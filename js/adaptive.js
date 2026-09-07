/* TeachMeJEE — Adaptive Learning Engine (the "Eagle" layer).
   Reads live study behaviour (completions, accuracy, activity timestamps)
   and recomputes the learner's path every time it is asked:
   - mastery per concept (recency-weighted accuracy)
   - pace (chapters per week, from completed + first-activity date)
   - difficulty zone (advancing / in-flow / consolidating)
   - mastery-aware review spacing (higher accuracy → longer gaps, then a recall check)
   - today's path sized to the learner's demonstrated pace
   Zero server: it derives everything from localStorage the rest of the app writes. */

import { weightInfo } from "./data.js";

const A_KEY = "tmj_adaptive_v1";
const MAX_ANSWERS = 320;
const DAY = 86400000;

export const ZONE_ADV = "advancing";
export const ZONE_FLOW = "flow";
export const ZONE_CON = "consolidating";

function toKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function todayKey(now) {
  return toKey(new Date(now));
}
function streakOf(activity) {
  const set = new Set(Object.keys(activity || {}).filter((k) => (activity[k] || 0) > 0));
  if (!set.size) return 0;
  let c = 0;
  let d = new Date();
  if (!set.has(toKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(toKey(d))) { c++; d.setDate(d.getDate() - 1); }
  return c;
}

export function adaptiveState() {
  try {
    const s = JSON.parse(localStorage.getItem(A_KEY) || "null");
    if (s && typeof s === "object" && Array.isArray(s.answers)) return s;
  } catch {}
  return { since: Date.now(), answers: [], reviews: {} };
}

function persist(s) {
  try { localStorage.setItem(A_KEY, JSON.stringify(s)); } catch {}
}

export function resetAdaptive() {
  try { localStorage.removeItem(A_KEY); } catch {}
}

export function adaptiveLogAnswer(conceptId, correct, ts = Date.now()) {
  const s = adaptiveState();
  s.answers.push({ c: conceptId, ok: correct ? 1 : 0, at: ts });
  s.answers = s.answers.slice(-MAX_ANSWERS);
  persist(s);
  return s;
}

export function attempts(store, id) {
  const st = adaptiveState();
  const q = store.quizByConcept && store.quizByConcept[id];
  return (q ? q.t : 0) + st.answers.filter((a) => a.c === id).length;
}

export function masteryOf(store, id, now = Date.now()) {
  const st = adaptiveState();
  let recent = 0, recentN = 0;
  for (const a of st.answers) {
    if (a.c !== id || now - a.at > 45 * DAY) continue;
    recent += a.ok; recentN++;
  }
  const long = store.quizByConcept && store.quizByConcept[id];
  const n = recentN + (long ? long.t : 0);
  if (!n) return null;
  const allAcc = (recent + (long ? long.c : 0)) / n;
  const recency = recentN ? recent / recentN : 0;
  return Math.max(0, Math.min(1, 0.55 * recency + 0.45 * allAcc));
}

export function lastAnswerAt(id) {
  const st = adaptiveState();
  let last = null;
  for (const a of st.answers) if (a.c === id && (last == null || a.at > last)) last = a.at;
  return last;
}

/* Higher mastery → longer spacing, but always a recall check comes back. */
export function spacingFor(store, id) {
  const m = masteryOf(store, id);
  if (lastAnswerAt(id) == null) return Infinity;
  const days = m == null ? 3 : Math.max(1, Math.round(1 + m * m * 9));
  return days * DAY;
}

export function stats(store, now = Date.now()) {
  const st = adaptiveState();
  const cut = now - 28 * DAY;
  const answers28 = st.answers.filter((a) => a.at >= cut);
  const acc28 = answers28.length ? answers28.reduce((s, a) => s + a.ok, 0) / answers28.length : null;
  const actTs = Object.keys(store.activity || {}).map((d) => +new Date(d + "T00:00:00")).filter((t) => !isNaN(t) && t <= now);
  const start = Math.min(st.since || now, actTs.length ? Math.min(...actTs) : now);
  const weeks = Math.max(0.5, (now - start) / (DAY * 7));
  const completed = (store.completed || []).length;
  const velocity = completed / weeks;
  const zone = acc28 == null ? ZONE_FLOW : acc28 >= 0.75 ? ZONE_ADV : acc28 >= 0.5 ? ZONE_FLOW : ZONE_CON;
  const activeDays = new Set(Object.keys(store.activity || {}).filter((d) => +new Date(d + "T00:00:00") >= cut)).size;
  const left = (store.allCount || 0) - completed;
  const estWeeks = velocity > 0.2 ? Math.round(left / velocity) : null;
  return { velocity, acc: acc28, answersN: answers28.length, activeDays, zone, streak: streakOf(store.activity), completed, estWeeks, remaining: left, since: start };
}

export function dueCount(store, now = Date.now()) {
  let n = 0;
  const today = todayKey(now);
  for (const id of Object.keys(store.srQueue || {})) {
    const d = store.srQueue[id];
    if (d && d.due && d.due <= today) n++;
  }
  for (const a of adaptiveState().answers) {
    if (now - a.at >= spacingFor(store, a.c)) n++;
  }
  return n;
}

export function weakList(store, all, limit = 10) {
  const out = [];
  for (const c of all) {
    const m = masteryOf(store, c.id);
    if (m == null || m >= 0.7) continue;
    out.push({ c, score: m });
  }
  return out.sort((a, b) => a.score - b.score).slice(0, limit);
}

export function dailyLoad(store) {
  const s = stats(store);
  const news = s.velocity >= 8 ? 3 : s.velocity >= 4 ? 2 : 1;
  return { reviews: dueCount(store), news, velocity: s.velocity };
}

export function recommendPath(store, all, limit = 6) {
  const byId = new Map(all.map((c) => [c.id, c]));
  const now = Date.now();
  const today = todayKey(now);
  const items = [];
  const seen = new Set();
  function push(c, kind, reason, urgency) {
    if (seen.has(c.id)) return;
    seen.add(c.id);
    items.push({ c, kind, reason, urgency });
  }
  for (const id of Object.keys(store.srQueue || {})) {
    const d = store.srQueue[id];
    if (d && d.due && d.due <= today && byId.has(id)) push(byId.get(id), "review", "Scheduled review — spaced repetition", 110);
  }
  for (const a of adaptiveState().answers) {
    const c = byId.get(a.c);
    if (!c || seen.has(a.c)) continue;
    if (masteryOf(store, a.c) != null && now - lastAnswerAt(a.c) >= spacingFor(store, a.c)) {
      const d = Math.max(1, Math.floor((now - lastAnswerAt(a.c)) / DAY));
      push(c, "recall", `Recall check — last practised ${d}d ago`, 90 + Math.max(0, d - 3));
    }
  }
  for (const w of weakList(store, all, 12)) {
    push(w.c, "weak", `Accuracy ${Math.round(w.score * 100)}% — needs the floor rebuilt`, 60 + Math.round((1 - w.score) * 30));
  }
  const completed = new Set(store.completed || []);
  const frontier = all
    .filter((c) => !completed.has(c.id) && c.prereq.every((p) => completed.has(p)))
    .sort((a, b) => a.level - b.level || weightInfo(b.id).w - weightInfo(a.id).w);
  for (const c of frontier) push(c, "next", `L${c.level} · ~${weightInfo(c.id).w} marks`, 25 - c.level);
  items.sort((a, b) => b.urgency - a.urgency);
  return items.slice(0, limit);
}

export function adaptiveRound(store, pool, n = 6) {
  const zone = stats(store).zone;
  const now = Date.now();
  const scored = pool.map((q) => {
    const m = masteryOf(store, q.c, now);
    const t = attempts(store, q.c);
    const w = weightInfo(q.c).w || 0;
    let base = Math.random() * 0.2;
    if (m == null) {
      base += zone === ZONE_CON ? -0.2 : zone === ZONE_FLOW ? 0.1 : -0.3;
    } else if (zone === ZONE_ADV) {
      const gap = Math.abs(m - 0.62);
      base += 0.5 - gap + Math.min(0.25, t * 0.02);
    } else if (zone === ZONE_CON) {
      base += m < 0.62 ? 0.55 : -0.3;
      base -= Math.min(0.3, t * 0.03);
    } else {
      base += (t < 4 ? 0.25 : m < 0.7 ? 0.2 : -0.1) + m * 0.1;
    }
    return { q, base, w };
  });
  scored.sort((a, b) => (b.base + b.w * 0.002) - (a.base + a.w * 0.002));
  const chosen = [];
  const perConc = {};
  for (const s of scored) {
    if (chosen.length >= n) break;
    const used = perConc[s.q.c] || 0;
    if (used >= 2) continue;
    chosen.push(s);
    perConc[s.q.c] = used + 1;
  }
  return chosen.map((s) => s.q);
}

export function zoneText(zone) {
  if (zone === ZONE_ADV) return "Advancing — raising the difficulty";
  if (zone === ZONE_CON) return "Consolidating — easy floor, rebuild confidence";
  return "In flow — challenge matches you";
}