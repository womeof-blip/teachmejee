/* TeachMeJEE — persistent state management */

const SESSION_KEY = "tmj_session";
const BASE_KEY = "tmj_state";

const DEFAULTS = {
  completed: [],
  planner: {
    mainDate: "2027-01-24",
    advDate: "2027-05-23",
    dailyHours: 6,
    startDate: todayISO(),
  },
  tasks: {},
  seen: {},
  bonusXp: 0,
  activity: {},
  quizBest: {},
  notes: {},
  starred: [],
  goal: 1,
  lastChapter: null,
  mocks: [],
  log: [],
  timeSpent: {},
  achievements: [],
  quizByConcept: {},
  dailies: {},
  srQueue: {},
  focusLog: {},
  badgesSeen: [],
  videos: [],
  focusSubj: {},
  boss: {},
  confidence: {},
  hourHits: {},
  milestones: {},
  answerLog: [],
  ghosts: [],
  duels: [],
  pyqStarred: [],
  pomoCount: {},
  lastBackupAt: 0,
  foundation: { done: {}, checks: {}, celebrated: false },
  drills: {},
  noteProg: {},
  lastNote: null,
};

/* ─────────── Full-notes reader progress (per chapter) ───────────
   noteProg[chid] = { s:[sectionIdx…], c:{cpIdx: chosenOption}, ts:lastOpenedMs } */
export function noteRecord(chid, touch = true) {
  const s = load();
  if (!s.noteProg[chid]) s.noteProg[chid] = { s: [], c: {} };
  if (touch) { s.noteProg[chid].ts = Date.now(); s.lastNote = chid; }
  save();
  return s.noteProg[chid];
}
export function getNoteProg(chid) {
  return load().noteProg[chid] || null;
}
export function toggleNoteSec(chid, idx) {
  const rec = noteRecord(chid, false);
  const i = rec.s.indexOf(idx);
  if (i >= 0) rec.s.splice(i, 1);
  else rec.s.push(idx);
  save();
  return i < 0;
}
export function markNoteSec(chid, idx, on = true) {
  const rec = noteRecord(chid, false);
  const has = rec.s.includes(idx);
  if (on && !has) rec.s.push(idx);
  if (!on && has) rec.s.splice(rec.s.indexOf(idx), 1);
  save();
  return on;
}
export function setNoteCp(chid, cpIdx, choice) {
  const rec = noteRecord(chid, false);
  rec.c[cpIdx] = choice;
  save();
}
export function lastNoteId() {
  return load().lastNote || null;
}

function dateKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function stateKey() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.username) return BASE_KEY + "_" + s.username;
    }
  } catch {}
  return BASE_KEY;
}

let state = null;
let cachedKey = null;

export function currentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw).username || null) : null;
  } catch { return null; }
}

export function switchUser() {
  state = null;
  cachedKey = null;
}

export function load() {
  const key = stateKey();
  if (state && cachedKey === key) return state;
  cachedKey = key;
  try {
    const raw = localStorage.getItem(key);
    state = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULTS));
  } catch {
    state = JSON.parse(JSON.stringify(DEFAULTS));
  }
  if (!state.planner) state.planner = { ...DEFAULTS.planner };
  if (!state.completed) state.completed = [];
  if (!state.tasks) state.tasks = {};
  if (!state.seen) state.seen = {};
  if (!state.activity) state.activity = {};
  if (typeof state.bonusXp !== "number") state.bonusXp = 0;
  if (!state.theme) state.theme = "dark";
  if (!state.quizBest) state.quizBest = {};
  if (!state.notes) state.notes = {};
  if (!state.starred) state.starred = [];
  if (typeof state.goal !== "number" || state.goal < 1) state.goal = 1;
  if (!state.lastChapter) state.lastChapter = null;
  if (!Array.isArray(state.mocks)) state.mocks = [];
  if (!Array.isArray(state.log)) state.log = [];
  if (!state.quizByConcept || typeof state.quizByConcept !== "object") state.quizByConcept = {};
  if (!state.dailies || typeof state.dailies !== "object") state.dailies = {};
  if (!state.srQueue || typeof state.srQueue !== "object") state.srQueue = {};
  if (!state.focusLog || typeof state.focusLog !== "object") state.focusLog = {};
  if (!Array.isArray(state.badgesSeen)) state.badgesSeen = [];
  if (!Array.isArray(state.videos)) state.videos = [];
  if (!state.focusSubj || typeof state.focusSubj !== 'object') state.focusSubj = {};
  if (!state.boss || typeof state.boss !== 'object') state.boss = {};
  for (const k of ["confidence", "hourHits", "milestones"]) if (!state[k] || typeof state[k] !== "object") state[k] = {};
  for (const k of ["answerLog", "ghosts", "duels", "pyqStarred"]) if (!Array.isArray(state[k])) state[k] = [];
  if (!state.pomoCount || typeof state.pomoCount !== "object") state.pomoCount = {};
  if (typeof state.lastBackupAt !== "number") state.lastBackupAt = 0;
  if (!state.foundation || typeof state.foundation !== "object") state.foundation = { done: {}, checks: {}, celebrated: false };
    if (!state.noteProg || typeof state.noteProg !== "object") state.noteProg = {};
    if (!state.planProg || typeof state.planProg !== "object") state.planProg = { ticked: {}, streak: 0, lastCheck: null, weeks: {} };
    if (!Array.isArray(state.userCards)) state.userCards = [];
  if (!("streak" in state.planProg) || typeof state.planProg.streak !== "number") state.planProg.streak = 0;
  if (!("weeks" in state.planProg) || typeof state.planProg.weeks !== "object") state.planProg.weeks = {};
  if (!("lastCheck" in state.planProg)) state.planProg.lastCheck = null;
  if (!("lastNote" in state)) state.lastNote = null;
  return state;
}

export function save() {
  const key = cachedKey || stateKey();
  try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
}

export function getState() { return load(); }

export function isCompleted(id) {
  const s = load();
  return s.completed.includes(id);
}

export function completeConcept(id) {
  const s = load();
  if (!s.completed.includes(id)) {
    s.completed.push(id);
    logActivity(2);
    bumpDaily("chapters", 1);
  }
  save();
}

export function uncompleteConcept(id) {
  const s = load();
  s.completed = s.completed.filter((x) => x !== id);
  save();
}

export function markTask(id, done) {
  const s = load();
  s.tasks[id] = !!done;
  if (done) logActivity(1);
  save();
}

export function saveNote(id, text) {
  const s = load();
  if (text && text.trim()) s.notes[id] = text.trim();
  else delete s.notes[id];
  save();
}

export function toggleStar(id) {
  const s = load();
  s.starred = s.starred.includes(id) ? s.starred.filter((x) => x !== id) : [...s.starred, id];
  save();
  return s.starred.includes(id);
}

export function isStarred(id) {
  return load().starred.includes(id);
}

export function planTicked(id) {
  return !!load().planProg.ticked[id];
}

export function planTick(id, weekIdx, weekIds) {
  const s = load();
  const p = s.planProg;
  p.ticked[id] = !p.ticked[id];
  const t = todayISO();
  if (p.lastCheck !== t) {
    const yest = new Date(t + "T12:00:00");
    yest.setDate(yest.getDate() - 1);
    const yKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, "0")}-${String(yest.getDate()).padStart(2, "0")}`;
    p.streak = p.lastCheck === yKey || !p.lastCheck ? p.streak + 1 : 1;
    p.lastCheck = t;
    logActivity(1);
  }
  if (weekIdx != null && Array.isArray(weekIds) && weekIds.length) {
    const own = weekIds.every((wid) => p.ticked[wid] || s.completed.includes(wid));
    p.weeks[weekIdx] = own;
    if (own) logActivity(4);
  }
  save();
  return p.ticked[id];
}

export function planStreak() {
  return load().planProg.streak;
}

export function planWeekDone(weekIdx) {
  return load().planProg.weeks[weekIdx] === true;
}

export function planWeekCompleteness() {
  const p = load().planProg;
  const c = Object.keys(p.weeks).filter((k) => p.weeks[k] === true).length;
  return c;
}

export function setGoal(n) {
  const s = load();
  s.goal = Math.max(1, Math.floor(n) || 1);
  save();
}

export function setLastChapter(id) {
  const s = load();
  if (s.lastChapter !== id) {
    s.lastChapter = id;
    save();
  }
}

export function savePlanner(patch) {
  const s = load();
  s.planner = { ...s.planner, ...patch };
  save();
}

export function resetAll() {
  state = JSON.parse(JSON.stringify(DEFAULTS));
  const key = cachedKey || stateKey();
  try { localStorage.removeItem(key); } catch {}
  cachedKey = null;
}

export function getXP(concepts) {
  const s = load();
  return concepts.filter((c) => s.completed.includes(c.id)).reduce((a, c) => a + c.xp, 0);
}

export function getTotalXP(concepts) {
  return getXP(concepts) + (load().bonusXp || 0);
}

export function addBonusXp(n) {
  const s = load();
  s.bonusXp = (s.bonusXp || 0) + n;
  save();
}

export function logActivity(n = 1) {
  const s = load();
  const key = todayISO();
  s.activity[key] = (s.activity[key] || 0) + n;
  const hr = new Date().getHours();
  s.hourHits[hr] = (s.hourHits[hr] || 0) + 1;
  save();
}

/* Recent activity feed (newest first, capped) */
export function addEvent(text) {
  const s = load();
  s.log.unshift({ at: Date.now(), text });
  s.log = s.log.slice(0, 60);
  save();
}

/* Mock-test performance tracking */
export function addMock({ name, subject, score, total }) {
  const s = load();
  s.mocks.unshift({ id: Date.now() + "-" + Math.floor(Math.random() * 1e4), name, subject, score, total, date: todayISO() });
  s.mocks = s.mocks.slice(0, 200);
  save();
}

export function removeMock(id) {
  const s = load();
  s.mocks = s.mocks.filter((m) => m.id !== id);
  save();
}

export function getStreak() {
  const s = load();
  const set = new Set(Object.keys(s.activity).filter((k) => s.activity[k] > 0));
  if (!set.size) return 0;
  const day = 86400000;
  let streak = 0;
  let d = new Date();
  if (!set.has(dateKey(d))) d = new Date(d.getTime() - day);
  while (set.has(dateKey(d))) {
    streak++;
    d = new Date(d.getTime() - day);
  }
  return streak;
}

export function longestStreak() {
  const s = load();
  const keys = Object.keys(s.activity).filter((k) => s.activity[k] > 0).sort();
  if (!keys.length) return 0;
  const set = new Set(keys);
  let best = 0, cur = 0;
  let prev = null;
  for (const k of keys) {
    const t = new Date(k + "T00:00:00").getTime();
    if (prev !== null && Math.round((t - prev) / 86400000) === 1) cur++;
    else cur = 1;
    prev = t;
    best = Math.max(best, cur);
  }
  return best;
}

/* Per-concept quiz tallies power Mastery / Weak Areas / subject averages */
export function recordQuizAnswer(conceptId, correct) {
  const s = load();
  const cur = s.quizByConcept[conceptId] || { c: 0, t: 0 };
  cur.t += 1;
  if (correct) cur.c += 1;
  s.quizByConcept[conceptId] = cur;
  s.answerLog.push({ id: conceptId, ok: correct ? 1 : 0, at: Date.now() });
  s.answerLog = s.answerLog.slice(-200);
  if (correct) bumpDaily("quiz", 1);
  save();
}

/* Chapter self-rating (0-5 stars set by the learner). */
export function setConfidence(id, stars) {
  const s = load();
  const v = Math.max(0, Math.min(5, Math.round(stars)));
  if (v === 0) delete s.confidence[id];
  else s.confidence[id] = v;
  save();
}
export function getConfidence(id) {
  return load().confidence[id] || 0;
}
export function togglePyqStar(id) {
  const s = load();
  const i = s.pyqStarred.indexOf(id);
  if (i >= 0) s.pyqStarred.splice(i, 1);
  else s.pyqStarred.push(id);
  save();
  return i < 0;
}

/* Ghost rivals from imported challenge cards. */
export function addGhost(g) {
  const s = load();
  const existing = s.ghosts.filter((x) => x.name !== g.name);
  existing.unshift({ name: g.name, xp: g.xp | 0, chapters: g.chapters | 0, streak: g.streak | 0, bestQuiz: g.bestQuiz | 0, at: Date.now() });
  s.ghosts = existing.slice(0, 6);
  save();
}
export function removeGhost(name) {
  const s = load();
  s.ghosts = s.ghosts.filter((x) => x.name !== name);
  save();
}

export function logDuel(p1, s1, p2, s2) {
  const s = load();
  s.duels.unshift({ at: Date.now(), p1, s1, p2, s2, winner: s1 === s2 ? "tie" : s1 > s2 ? p1 : p2 });
  s.duels = s.duels.slice(0, 20);
  save();
}

export function bumpPomodoroCount() {
  const s = load();
  const k = todayISO();
  s.pomoCount[k] = (s.pomoCount[k] || 0) + 1;
  save();
}
export function pomodorosToday() {
  return load().pomoCount[todayISO()] || 0;
}

export function markBackupSaved() {
  load().lastBackupAt = Date.now();
  save();
}

/* Class 9–10 Foundation track progress (separate from roadmap XP). */
export function fToggleUnit(unitId) {
  const s = load();
  if (!s.foundation.done[unitId]) {
    s.foundation.done[unitId] = todayISO();
    logActivity(1);
  } else {
    delete s.foundation.done[unitId];
  }
  save();
  return !!s.foundation.done[unitId];
}
export function fIsDone(unitId) {
  return !!(load().foundation.done[unitId]);
}
export function fSetCheck(trackId, ok) {
  const s = load();
  if (ok) s.foundation.checks[trackId] = true;
  else delete s.foundation.checks[trackId];
  save();
}
export function fCheckPassed(trackId) {
  return !!(load().foundation.checks[trackId]);
}
export function foundationStats() {
  const s = load();
  const done = Object.keys(s.foundation.done).filter((k) => s.foundation.done[k]).length;
  return { done };
}

/* Daily quests reset every local date */
export function dailyState() {
  const s = load();
  const key = todayISO();
  if (!s.dailies[key] || typeof s.dailies[key] !== "object") {
    s.dailies[key] = { chapters: 0, focusMin: 0, quiz: 0, claimed: {} };
  }
  return s.dailies[key];
}

function bumpDaily(key, n) {
  dailyState()[key] += n;
}

export function claimDailyReward(id, xp) {
  const d = dailyState();
  if (d.claimed[id]) return false;
  d.claimed[id] = true;
  addBonusXp(xp);
  save();
  return true;
}

export function logFocusMin(min, subj) {
  const s = load();
  const key = todayISO();
  s.focusLog[key] = (s.focusLog[key] || 0) + min;
  if (subj && SUBJECT_KEYS.includes(subj)) s.focusSubj[subj] = (s.focusSubj[subj] || 0) + min;
  bumpDaily("focusMin", min);
  save();
}
const SUBJECT_KEYS = ["P", "C", "M"];

/* Pinned YouTube lectures — the user pastes any link, we keep the id. */
export function extractYouTubeId(url) {
  const raw = String(url || "");
  const m = raw.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  if (m) return m[1];
  const bare = raw.trim();
  return /^[\w-]{11}$/.test(bare) ? bare : null;
}
export function addVideo(ytId, chapId, title) {
  const s = load();
  if (s.videos.some((v) => v.ytId === ytId)) return false;
  const t = String(title || "").trim();
  s.videos.unshift({ ytId, chapId: chapId || null, title: t || "Lecture", added: Date.now() });
  s.videos = s.videos.slice(0, 120);
  save();
  return true;
}
export function removeVideo(ytId) {
  const s = load();
  s.videos = s.videos.filter((v) => v.ytId !== ytId);
  save();
}

/* Weekly boss battle: one 16-question timed run per week, cleared at 12+. */
export function weekKey() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const wk = Math.floor((d - start) / 604800000);
  return `${d.getFullYear()}-W${wk}`;
}
export function getBoss() {
  const b = load().boss || {};
  return b.week === weekKey() ? b : { week: weekKey(), best: 0, cleared: false };
}
export function recordBossRun(score) {
  const s = load();
  const wk = weekKey();
  const cur = s.boss && s.boss.week === wk ? s.boss : { week: wk, best: 0, cleared: false };
  cur.best = Math.max(cur.best || 0, score);
  if (score >= 12) cur.cleared = true;
  s.boss = cur;
  save();
  return cur;
}

/* Spaced repetition: Leitner-style boxes at 1/3/7/16 day intervals */
const SR_STEPS = [1, 3, 7, 16];
export function srSchedule(id, good = true) {
  const s = load();
  const cur = s.srQueue[id] || { box: -1 };
  const box = good ? Math.min(cur.box + 1, SR_STEPS.length - 1) : 0;
  const due = dateKey(new Date(Date.now() + SR_STEPS[box] * 86400000));
  s.srQueue[id] = { box, due };
  save();
}

export function srDue() {
  const s = load();
  const today = todayISO();
  return Object.keys(s.srQueue).filter((id) => s.srQueue[id].due <= today);
}

/* User-created flashcards: {id, front, back, subject} — reviewed in Flash. */
export function addUserCard(front, back, subject) {
  const s = load();
  const card = {
    id: "u" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
    front: String(front || "").trim().slice(0, 300),
    back: String(back || "").trim().slice(0, 800),
    subject: ["P", "C", "M"].includes(subject) ? subject : "M",
  };
  if (!card.front || !card.back) return null;
  s.userCards.push(card);
  logActivity(1);
  save();
  return card;
}

export function removeUserCard(id) {
  const s = load();
  s.userCards = s.userCards.filter((c) => c.id !== id);
  if (s.srQueue[id]) delete s.srQueue[id];
  save();
}

export function markSeen(id) {
  const s = load();
  s.seen[id] = todayISO();
  save();
}

export function setBadgesSeen(ids) {
  const s = load();
  s.badgesSeen = ids;
  save();
}

export function setTheme(t) {
  const s = load();
  s.theme = t === "light" ? "light" : "dark";
  save();
  applyTheme();
}

export function applyTheme() {
  try {
    document.documentElement.setAttribute("data-theme", load().theme === "light" ? "light" : "dark");
  } catch {}
}

export function exportData() {
  return JSON.stringify(load(), null, 2);
}

export function importData(json) {
  try {
    const d = JSON.parse(json);
    if (!d || typeof d !== "object") throw new Error("bad");
    const fresh = JSON.parse(JSON.stringify(DEFAULTS));
    state = { ...fresh, ...d };
    if (!Array.isArray(state.completed)) state.completed = [];
    if (!state.planner) state.planner = { ...DEFAULTS.planner };
    if (!state.tasks) state.tasks = {};
    if (!state.activity) state.activity = {};
    if (!state.notes) state.notes = {};
    if (!state.starred) state.starred = [];
    if (typeof state.goal !== "number" || state.goal < 1) state.goal = 1;
    if (!state.quizBest) state.quizBest = {};
    if (!Array.isArray(state.mocks)) state.mocks = [];
    if (!Array.isArray(state.log)) state.log = [];
    if (!state.quizByConcept || typeof state.quizByConcept !== "object") state.quizByConcept = {};
    if (!state.dailies || typeof state.dailies !== "object") state.dailies = {};
    if (!state.srQueue || typeof state.srQueue !== "object") state.srQueue = {};
    if (!state.focusLog || typeof state.focusLog !== "object") state.focusLog = {};
    if (!Array.isArray(state.badgesSeen)) state.badgesSeen = [];
    if (!Array.isArray(state.videos)) state.videos = [];
    if (!state.focusSubj || typeof state.focusSubj !== 'object') state.focusSubj = {};
    for (const k of ["confidence", "hourHits", "milestones"]) if (!state[k] || typeof state[k] !== 'object') state[k] = {};
    for (const k of ["answerLog", "ghosts", "duels", "pyqStarred"]) if (!Array.isArray(state[k])) state[k] = [];
    if (!state.pomoCount || typeof state.pomoCount !== 'object') state.pomoCount = {};
    if (typeof state.lastBackupAt !== 'number') state.lastBackupAt = 0;
  if (!state.foundation || typeof state.foundation !== 'object') state.foundation = { done: {}, checks: {}, celebrated: false };
  if (!state.boss || typeof state.boss !== 'object') state.boss = {};
    if (!state.noteProg || typeof state.noteProg !== "object") state.noteProg = {};
    if (!state.planProg || typeof state.planProg !== "object") state.planProg = { ticked: {}, streak: 0, lastCheck: null, weeks: {} };
    if (!Array.isArray(state.userCards)) state.userCards = [];
    if (!("lastNote" in state)) state.lastNote = null;
    save();
    return true;
  } catch {
    return false;
  }
}
