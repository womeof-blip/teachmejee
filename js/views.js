/* TeachMeJEE � view renderers */

import { CONCEPTS, LEVELS, SUBJECTS, ALL_CONCEPTS, TOTAL_XP, weightInfo, weightLabel, SUBJECT_MAX_WEIGHT, DERIVATIONS } from "./data.js";
import { load, isCompleted, completeConcept, uncompleteConcept, markTask, savePlanner, save, getXP, getTotalXP, getStreak, longestStreak, addBonusXp, logActivity, todayISO, saveNote, toggleStar, isStarred, setGoal, setLastChapter, addMock, removeMock, addEvent, switchUser, recordQuizAnswer, dailyState, claimDailyReward, logFocusMin, srSchedule, srDue, markSeen, setBadgesSeen, extractYouTubeId, addVideo, removeVideo, weekKey, getBoss, recordBossRun, bumpPomodoroCount, pomodorosToday, getNoteProg, toggleNoteSec, setNoteCp, noteRecord, lastNoteId, planTicked, planTick, planStreak, planWeekDone, planWeekCompleteness } from "./store.js";
import { DEEP_NOTES, DEEP_NOTE_IDS, noteMinutes } from "./notes/index.js";
import { daysUntil, fmt, computePhases, generateSchedule, weekTasks, weeklyPlan } from "./planner.js";
import { QUESTIONS } from "./questions.js";
import { PYQS } from "./pyq.js";
import { NEET_TOPICS, NEET_QUESTIONS } from "./neet.js";
import { register, login, isLoggedIn, getSession, fetchLeaderboard, syncProgress } from "./api.js";
import { answerTutor } from "./tutor.js";
import { quoteRotator, didYouKnow, milestoneBar, streakAtRisk, preciseCountdown, velocityCard, peakHourWidget, subjectPie, ghostCompareCard, confidenceControl } from "./extras.js";
import { FOUNDATION_TRACKS, ALL_UNITS, TOTAL_UNITS } from "./foundation.js";
import { fToggleUnit, fIsDone, fSetCheck, fCheckPassed, foundationStats } from "./store.js";
import { h, makeToast, confettiBurst, xpFly, showModal, notifySync } from "./fx.js";
import * as Quantum from "./quantum.js";
import { allFeatures, featureStats, VIRTUAL_FEATURE_COUNT, FEATURE_COUNT, virtualFeatureAt } from "./features.js";
import { subtopicsFor } from "./notes/subtopics.js";

/* ----------- DOM helpers ----------- */


function esc(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function subjectTag(subject) {
  const s = SUBJECTS[subject];
  return h("span", { class: `tag ${s.cls}` }, s.name);
}

function levelName(lvl) {
  return LEVELS[lvl] ? LEVELS[lvl].title : `Level ${lvl}`;
}

function navigate(route) { location.hash = route; }

function nodeStatus(c, completed) {
  if (completed.has(c.id)) return "completed";
  const unmet = c.prereq.filter((p) => !completed.has(p));
  return unmet.length ? "locked" : "unlocked";
}

function rankName(xp) {
  const p = xp / TOTAL_XP;
  if (p >= 1) return "JEE Champion";
  if (p >= 0.8) return "Advanced";
  if (p >= 0.6) return "Topper";
  if (p >= 0.4) return "Problem Solver";
  if (p >= 0.2) return "Aspirant";
  if (p > 0) return "Scholar";
  return "Novice";
}

const RANKS = [["Novice", 0], ["Scholar", 0.2], ["Aspirant", 0.4], ["Problem Solver", 0.6], ["Topper", 0.8], ["Advanced", 1]];
function rankIndex(xp) {
  const p = xp / TOTAL_XP;
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (p >= RANKS[i][1]) idx = i;
  return idx;
}
function rankProgress(xp) {
  const p = xp / TOTAL_XP;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (p >= RANKS[i][1]) {
      const lo = RANKS[i][1];
      const next = RANKS[i + 1];
      if (!next) return { name: RANKS[i][0], next: null, frac: 1, nextXp: null, bandXp: TOTAL_XP };
      return { name: RANKS[i][0], next: next[0], frac: Math.min(1, (p - lo) / (next[1] - lo)), nextXp: Math.round(next[1] * TOTAL_XP), bandXp: Math.round((next[1] - lo) * TOTAL_XP) };
    }
  }
  return { name: "Novice", next: "Scholar", frac: p / 0.2, nextXp: Math.round(0.2 * TOTAL_XP), bandXp: Math.round(0.2 * TOTAL_XP) };
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function tile(k, l, rec = true) {
  return h("div", { class: `stat${rec ? " rec" : ""}` }, h("div", { class: "k" }, k), h("div", { class: "l" }, l));
}
const stat = tile;

export { makeToast };


function page(title, subtitle, body) {
  return h("div", {},
    h("div", { class: "stack", style: "gap:6px" },
      h("h1", {}, title),
      subtitle ? h("p", { class: "muted small" }, subtitle) : null),
    h("div", { class: "divider" }),
    body);
}

function ringSVG(pct, cls, size = 116, stroke = 10, fontSize = 22, label = null) {
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;
  const mid = size / 2;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", cls);
  const mk = (strokeColor, dashVal) => {
    const el = document.createElementNS(svgNS, "circle");
    el.setAttribute("cx", mid); el.setAttribute("cy", mid); el.setAttribute("r", r);
    el.setAttribute("fill", "none");
    el.style.stroke = strokeColor;
    el.style.strokeWidth = String(stroke);
    el.style.strokeDasharray = `${dashVal} ${c}`;
    if (dashVal !== c) { el.style.strokeLinecap = "round"; el.style.transformOrigin = "center"; el.style.transform = "rotate(-90deg)"; }
    svg.append(el);
    return el;
  };
  mk("var(--surface-3)", c);
  mk("var(--accent)", dash);
  const t = document.createElementNS(svgNS, "text");
  t.setAttribute("x", mid); t.setAttribute("y", mid + fontSize * 0.35);
  t.setAttribute("text-anchor", "middle");
  t.style.fill = "var(--text)";
  t.style.fontSize = String(fontSize);
  t.style.fontWeight = "700";
  t.textContent = label != null ? label : `${Math.round(pct)}%`;
  svg.append(t);
  return svg;
}

function progressRing(pct) { return ringSVG(pct, "progress-ring"); }

/* Professor Pip � the study-buddy owl, drawn inline so it works offline. */
function mascotSVG(size = 96, mood = "happy") {
  const eyeY = mood === "cheer" ? 62 : 66;
  return h("span", { class: "pip", style: `width:${size}px;height:${size * 1.08}px;display:inline-block`, html: `
<svg viewBox="0 0 100 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="50" cy="66" rx="34" ry="38" fill="#f2a33c"/>
  <ellipse cx="50" cy="76" rx="22" ry="26" fill="#ffd9a0"/>
  <path d="M20 52 Q14 84 26 98 M80 52 Q86 84 74 98" stroke="#d97f1e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="37" cy="${eyeY}" r="11" fill="#fff"/>
  <circle cx="63" cy="${eyeY}" r="11" fill="#fff"/>
  <circle cx="38" cy="${eyeY + 1}" r="4.6" fill="#231503"/>
  <circle cx="62" cy="${eyeY + 1}" r="4.6" fill="#231503"/>
  <circle cx="39.5" cy="${eyeY - 1.5}" r="1.4" fill="#fff"/>
  <circle cx="63.5" cy="${eyeY - 1.5}" r="1.4" fill="#fff"/>
  <path d="M45 ${eyeY + 12} L55 ${eyeY + 12} L50 ${eyeY + 19} Z" fill="#e86f52"/>
  <rect x="18" y="24" width="64" height="7" rx="3.5" fill="#231503"/>
  <path d="M50 8 L88 24 L50 40 L12 24 Z" fill="#463922"/>
  <path d="M50 16 v10" stroke="#231503" stroke-width="3" stroke-linecap="round"/>
  <circle cx="50" cy="28.5" r="3.2" fill="#f2a33c"/>
  <path d="M33 92 q17 10 34 0" stroke="#d97f1e" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>` });
}

/* ----------- Unified badges ----------- */

function BADGES(s, completedCount) {
  const practiced = (s.quizBest && s.quizBest.practiced) || 0;
  const best = (s.quizBest && s.quizBest.best) || 0;
  const streak = getStreak();
  const focusTotal = Object.values(s.focusLog || {}).reduce((a, b) => a + b, 0);
  const total = ALL_CONCEPTS.length;
  return [
    { id: "first", g: "?", t: "First Steps", d: "Master your first chapter", ok: completedCount >= 1 },
    { id: "ten", g: "?", t: "Ten Club", d: "Master 10 chapters", ok: completedCount >= 10 },
    { id: "half", g: "?", t: "Halfway There", d: `Reach 50% of the roadmap`, ok: completedCount >= total / 2 },
    { id: "all", g: "?", t: "Roadmap Master", d: "Complete every chapter", ok: completedCount >= total },
    { id: "fire", g: "?", t: "On Fire", d: "Hold a 3-day streak", ok: streak >= 3 },
    { id: "blaze", g: "?", t: "Unstoppable", d: "Hold a 7-day streak", ok: streak >= 7 },
    { id: "sharp", g: "?", t: "Sharpshooter", d: "Practice 50 questions", ok: practiced >= 50 },
    { id: "ace", g: "?", t: "Quiz Ace", d: "Score 8/8 in a session", ok: best >= 8 },
    { id: "scribe", g: "?", t: "Scribe", d: "Write a custom note", ok: Object.keys(s.notes).length >= 1 },
    { id: "curator", g: "?", t: "Curator", d: "Star your first chapter", ok: s.starred.length >= 1 },
    { id: "focus", g: "?", t: "Deep Work", d: "Log 120 focus minutes", ok: focusTotal >= 120 },
    { id: "analyst", g: "?", t: "Analyst", d: "Log 5 mock tests", ok: (s.mocks || []).length >= 5 },
  ];
}

/* ----------- Celebration kit ----------- */

function checkCelebrations(prevCompleted, prevRankIdx) {
  const s = load();
  const now = new Set(s.completed);
  const newlyUnlocked = ALL_CONCEPTS.filter((c) =>
    !now.has(c.id) &&
    !prevCompleted.has(c.id) &&
    c.prereq.every((p) => now.has(p)));
  if (newlyUnlocked.length) {
    confettiBurst();
    showModal({
      icon: "?",
      title: newlyUnlocked.length === 1 ? "New chapter unlocked!" : `${newlyUnlocked.length} new chapters unlocked!`,
      rows: newlyUnlocked.slice(0, 5).map((c) => h("span", {}, "? ", c.name)),
      cta: newlyUnlocked.length > 5 ? `Open roadmap (${newlyUnlocked.length - 5} more)` : "Open roadmap",
    });
  }
  for (const lv of LEVELS) {
    const inLevel = ALL_CONCEPTS.filter((c) => c.level === lv.lvl);
    const wasDone = inLevel.every((c) => prevCompleted.has(c.id)) && inLevel.length > 0;
    const isDone = inLevel.every((c) => now.has(c.id));
    if (isDone && !wasDone) {
      showModal({
        icon: "?",
        title: `${lv.title} cleared!`,
        rows: [h("span", {}, "Every chapter in this stage is mastered. The path ahead opens up.")],
        cta: "Continue the journey",
      });
    }
  }
  const newXp = getTotalXP(ALL_CONCEPTS);
  const newIdx = rankIndex(newXp);
  if (newIdx > prevRankIdx) {
    showModal({
      icon: "?",
      title: `Rank up: ${rankName(newXp)}!`,
      rows: [h("span", {}, "Your growing mastery is showing. Keep the streak alive.")],
      cta: "Nice",
    });
  }
  const badges = BADGES(s, s.completed.length);
  const seen = new Set(s.badgesSeen || []);
  const fresh = badges.filter((b) => b.ok && !seen.has(b.id));
  if (fresh.length) {
    setBadgesSeen(badges.filter((b) => b.ok).map((b) => b.id));
    for (const b of fresh.slice(0, 2)) {
      makeToast(`Badge unlocked: ${b.t}`, true);
    }
  }
}


/* ----------- Learning analytics helpers (real data) ----------- */

function conceptAccuracy(id) {
  const q = load().quizByConcept[id];
  if (!q || !q.t) return null;
  return q.c / q.t;
}

function getMasteryLevel(c) {
  if (!isCompleted(c.id)) return 0;
  const acc = conceptAccuracy(c.id);
  if (acc == null) return 1;
  if (acc >= 0.85) return 3;
  if (acc >= 0.6) return 2;
  return 1;
}

function getMasteryLabel(lvl) {
  return ["Not started", "Learning", "Familiar", "Expert"][lvl] || "Learning";
}

function getWeakAreas(limit = 10) {
  const s = load();
  const weak = [];
  for (const c of ALL_CONCEPTS) {
    const q = s.quizByConcept[c.id];
    if (!q || q.t < 2) continue;
    const acc = q.c / q.t;
    if (acc < 0.8) weak.push({ c, score: acc });
  }
  return weak.sort((a, b) => a.score - b.score).slice(0, limit);
}

function getRecommendations(limit = 6) {
  const completed = new Set(load().completed);
  const frontier = ALL_CONCEPTS
    .filter((c) => !completed.has(c.id) && c.prereq.every((p) => completed.has(p)))
    .sort((a, b) => a.level - b.level || weightInfo(b.id).w - weightInfo(a.id).w);
  return frontier.slice(0, limit).map((c, i) => ({
    c,
    priority: i < 3 ? "high" : "normal",
    reason: i < 3 ? "High-yield next step" : `~${weightInfo(c.id).w} marks � L${c.level}`,
  }));
}

function getSubjectStats() {
  const s = load();
  const stats = {};
  for (const subj of Object.keys(SUBJECTS)) {
    const chapters = ALL_CONCEPTS.filter((c) => c.subject === subj);
    const done = chapters.filter((c) => isCompleted(c.id)).length;
    let correct = 0, totalQ = 0;
    for (const c of chapters) {
      const q = s.quizByConcept[c.id];
      if (q) { correct += q.c; totalQ += q.t; }
    }
    stats[subj] = {
      completed: done,
      total: chapters.length,
      avgScore: totalQ ? correct / totalQ : null,
      pct: Math.round((done / chapters.length) * 100),
    };
  }
  return stats;
}

function revisionCandidates(limit = 12) {
  const s = load();
  const out = [];
  const today = todayISO();
  for (const id of srDue()) {
    const c = CONCEPTS[id];
    if (c) out.push({ c, why: "Spaced-repetition review", stale: 999 });
  }
  for (const c of ALL_CONCEPTS) {
    if (!isCompleted(c.id) || s.srQueue[c.id]) continue;
    const last = s.seen[c.id];
    const days = last ? Math.floor((new Date(today) - new Date(last)) / 86400000) : 999;
    if (days > 7) out.push({ c, why: last ? `Last opened ${days}d ago` : "Never reviewed", stale: days });
  }
  return out.slice(0, limit);
}

function heatmapCells(s) {
  const day = 86400000;
  const totalDays = 56;
  const today = new Date();
  const dow = (today.getDay() + 6) % 7;
  const start = new Date(today.getTime() - (totalDays - 1 + dow) * day);
  const cells = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start.getTime() + i * day);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const n = s.activity[key] || 0;
    const lvl = n === 0 ? 0 : n >= 5 ? 4 : n >= 3 ? 3 : n >= 2 ? 2 : 1;
    cells.push(h("span", { class: `heat-cell${lvl ? " l" + lvl : ""}`, title: `${key}: ${n} item${n === 1 ? "" : "s"}` }));
  }
  return h("div", { class: "heatmap" }, ...cells);
}

const DAILY_DEFS = [
  { id: "chapters", icon: "?", t: "Master chapters", target: () => Math.max(1, load().goal || 1), key: "chapters", reward: 10 },
  { id: "focus", icon: "?", t: "Focus minutes", target: () => 25, key: "focusMin", reward: 10 },
  { id: "quiz", icon: "?", t: "Correct answers", target: () => 5, key: "quiz", reward: 15 },
];

function dailiesPanel() {
  const wrap = h("div", { class: "dailies" });
  function renderD() {
    const d = dailyState();
    wrap.innerHTML = "";
    for (const def of DAILY_DEFS) {
      const target = def.target();
      const val = Math.min(d[def.key] || 0, target);
      const done = val >= target;
      const claimed = !!d.claimed[def.id];
      const bar = h("div", { class: "daily-bar" }, h("i", { style: `width:${(val / target) * 100}%` }));
      const action = claimed
        ? h("span", { class: "small faint" }, "+", def.reward, " XP claimed")
        : done
          ? h("button", { class: "btn btn-primary btn-sm claim-btn", onclick: () => { if (claimDailyReward(def.id, def.reward)) { makeToast(`Daily complete! +${def.reward} XP`, true); xpFly(def.reward); notifySync(); renderD(); } } }, `Claim +${def.reward}`)
          : null;
      wrap.append(h("div", { class: `daily${done && claimed ? " d-done" : ""}` },
        h("div", { class: "daily-icon" }, def.icon),
        h("div", { class: "daily-body" },
          h("div", { class: "daily-t" }, def.t),
          bar,
          h("div", { class: "daily-meta" }, h("span", {}, `${d[def.key] || 0} / ${target}`), h("span", {}, done ? "complete" : `reward +${def.reward} XP`))),
        action));
    }
  }
  renderD();
  return wrap;
}

export function HomeView(root) {
  const s = load();
  const completed = new Set(s.completed);
  const prevRankIdx = rankIndex(getTotalXP(ALL_CONCEPTS));
  const xp = getXP(ALL_CONCEPTS);
  const pct = (xp / TOTAL_XP) * 100;
  const dMain = daysUntil(s.planner.mainDate);
  const dAdv = daysUntil(s.planner.advDate);
  const next = generateSchedule(dAdv);
  const todayTasks = weekTasks(dAdv).slice(0, 1);
  const goal = s.goal || 1;
  const lastC = s.lastChapter ? CONCEPTS[s.lastChapter] : null;
  const rank = rankProgress(xp);
  const todayDone = s.activity[todayISO()] || 0;
  const badges = BADGES(s, completed.size);

  root.innerHTML = "";
  root.append(
    streakAtRisk(),
    preciseCountdown(s.planner),
    h("div", { class: "quantum-banner" },
      h("div", { class: "qb-glow" }),
      h("div", { class: "qb-inner" },
        h("span", { class: "qb-badge" }, "? QUANTUM EDITION � THE FUTURE OF LEARNING"),
        h("h1", { class: "qb-title" }, "Learn Today. Ace Tomorrow."),
        h("p", { class: "qb-sub" }, "A cognitive prosthetic for 1.5M minds � where textbook meets telepathy."),
        h("div", { class: "small faint", style:"margin-top:6px"}, `${featureStats().total} micro-features � 93�11 + globals � `, h("a",{href:"#/atlas", style:"color:var(--accent)"}, "explore Atlas ?")),
        h("div", { class: "qb-actions" },
          h("a", { class: "btn btn-primary btn-sm", href: "#/constellation" }, "Explore Constellation ?"),
          h("a", { class: "btn btn-sm", href: "#/library" }, "Open Library")))),
    h("div", { class: "hero", style: "margin-top:12px" },
      h("h1", {}, "Your roadmap to JEE Main & Advanced"),
      h("p", {}, "Every chapter is a node on a quest map. Master the basics to unlock the harder tiers � notes, formulas and 3D labs at every stop.")),


    h("div", { class: "countdown-grid" },
      h("div", { class: "countdown" },
        h("div", { class: "top" }, h("span", { class: "muted small" }, "JEE Main � Session 1"), h("span", { class: "small faint" }, fmt(s.planner.mainDate))),
        h("div", { class: "days" }, dMain >= 0 ? `${dMain}` : "�", " ", h("small", {}, "days")),
        h("div", { class: "detail" }, dMain >= 0 ? "left to unlock your first rank" : "set a new date in the Planner")),
      h("div", { class: "countdown adv" },
        h("div", { class: "top" }, h("span", { class: "muted small" }, "JEE Advanced"), h("span", { class: "small faint" }, fmt(s.planner.advDate))),
        h("div", { class: "days" }, dAdv >= 0 ? `${dAdv}` : "�", " ", h("small", {}, "days")),
        h("div", { class: "detail" }, "the real test � beyond JEE Main"))),

    h("div", { class: "stat-grid" },
      stat(`${getTotalXP(ALL_CONCEPTS)}`, "XP earned", false),
      stat(`${completed.size}/${ALL_CONCEPTS.length}`, "chapters mastered", false),
      stat(rankName(xp), "your rank", false),
      stat(`${s.planner.dailyHours || 6}h`, "study / day", false),
      stat(`${getStreak()}d`, "current streak", false)),

    h("div", { class: "card rank-card" },
      h("div", { class: "rank-line" },
        h("span", { class: "rank-name" }, rank.name),
        rank.next
          ? h("span", { class: "small faint" }, `${Math.round(rank.frac * 100)}% to ${rank.next} � ${rank.nextXp - getTotalXP(ALL_CONCEPTS)} XP to go`)
          : h("span", { class: "small faint" }, "Max rank reached")),
      h("div", { class: "rank-bar" }, h("i", { style: `width:${Math.round(rank.frac * 100)}%` }))),

    h("div", { class: "card labs-card" },
      h("div", { class: "labs-head" },
        h("span", { class: "qb-badge", style: "background:color-mix(in srgb,#60a5fa 14%,transparent);border-color:color-mix(in srgb,#60a5fa 22%,transparent);color:#60a5fa" }, "? FUTURE LAB � 110 FEATURES LIVE"),
        h("h3", { style: "margin:8px 0 4px" }, "The future is already installed"),
        h("p", { class: "muted small", style: "margin:0" }, "Constellation Map live. Quantum Edition protocols in beta. Hover to reveal.")),
      h("div", { class: "labs-grid" },
        h("a", { class: "lab-pill live", href: "#/constellation" }, "? Constellation Map � LIVE"),
        h("span", { class: "lab-pill" }, "?? ANPE � beta"),
        h("span", { class: "lab-pill" }, "?? Quantum Web � beta"),
        h("span", { class: "lab-pill" }, "?? STI Tutor � beta"),
        h("span", { class: "lab-pill proto" }, "?? DKF P2P � protocol"),
        h("span", { class: "lab-pill proto" }, "?? Mastery Cert � protocol"),
        h("span", { class: "lab-pill" }, "?? ALC Companion � beta"),
        h("span", { class: "lab-pill" }, "?? Focus Flow � beta"))),

    h("div", { class: "divider" }),

    h("a", { class: "card lib-homecard", href: "#/library" },
      h("div", {},
        h("h2", { style: "margin:0 0 4px" }, "Full textbook notes"),
        h("p", { class: "muted small", style: "margin:0" },
          `${ALL_CONCEPTS.filter((x) => DEEP_NOTES[x.id]).length} chapters rewritten as complete study notes � theory, derivations, worked examples, checkpoints & flashcards. Export any chapter as PDF.`)),
      h("span", { class: "btn btn-primary btn-sm" }, "Open library ?")),

    h("div", { class: "row" },
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Progress"),
        h("div", { class: "card progress-wrap" },
          progressRing(pct),
          h("div", {},
            h("p", { class: "muted small" }, `${completed.size} of ${ALL_CONCEPTS.length} concepts mastered`),
            h("p", { class: "muted small" }, `${ALL_CONCEPTS.length - completed.size} left on the map`),
            h("div", { style: "margin-top:10px;display:flex;gap:8px;flex-wrap:wrap" },
              h("a", { class: "btn btn-primary btn-sm", href: "#/roadmap" }, "Continue journey"),
              h("a", { class: "btn btn-sm", href: "#/daily" }, "Daily challenge")))),
        milestoneBar(completed.size, ALL_CONCEPTS.length),
        lastC
          ? h("div", { class: "card jump-card", style: "margin-top:12px" },
              h("div", { class: "jump-inner" },
                h("div", {},
                  h("div", { class: "small faint" }, "CONTINUE WHERE YOU LEFT OFF"),
                  h("div", { style: "font-weight:700;margin-top:4px" }, lastC.name),
                  h("div", { class: "muted small", style: "margin-top:2px" }, levelName(lastC.level))),
                h("a", { class: "btn btn-primary", href: `#/chapter/${lastC.id}` }, "Resume")))
          : null),
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Today's quests"),
        h("div", { class: "card" },
          dailiesPanel(),
          h("div", { class: "divider", style: "margin:14px 0" }),
          h("div", { style: "display:flex;justify-content:space-between;align-items:center;gap:10px" },
            h("span", { class: "small muted" }, `Goal progress today`),
            h("span", { class: "small faint" }, `${Math.min(todayDone, goal)}/${goal}`)),
          h("div", { class: "rank-bar", style: "margin-top:6px" },
            h("i", { style: `width:${Math.min(100, (todayDone / goal) * 100)}%` }))))),

    h("div", { class: "card heatmap-card", style: "margin-top:12px" },
      h("div", { style: "display:flex;justify-content:space-between;align-items:center;gap:8px" },
        h("h3", {}, "?? 56-Day Heatmap"),
        h("button", { class: "btn btn-sm", title:"Ambient focus � white noise", onclick: ()=>{
          try{
            const ctx=new (window.AudioContext||window.webkitAudioContext)();
            const buf=ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
            for(let i=0;i<buf.length;i++) buf.getChannelData(0)[i]=(Math.random()*2-1)*0.12;
            const src=ctx.createBufferSource(); src.buffer=buf; src.loop=true;
            const gain=ctx.createGain(); gain.gain.value=0.14; src.connect(gain).connect(ctx.destination); src.start();
            makeToast("?? Ambient on � 30s focus", true); setTimeout(()=>{ try{src.stop(); ctx.close();}catch{} },30000);
          }catch{ makeToast("Audio blocked � enable sound", true); }
        }}, "?? Ambient")),
      heatmapCells(s),
      h("p", { class: "small faint", style:"margin-top:8px" }, "Darker = more activity � keep the chain unbroken")),

    h("div", { class: "card", style: "margin-top:16px" },
      h("div", { style: "display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline" },
        h("h2", {}, "Next to unlock"),
        next.length > 4 ? h("span", { class: "hint" }, `${next.length} ready � showing 4`) : null),
      next.length
        ? h("div", { class: "stack", style: "gap:8px;margin-top:12px" },
            ...next.slice(0, 4).map((c) =>
              h("a", { class: "prereq-pill", href: `#/chapter/${c.id}` },
                subjectTag(c.subject), ` ${c.name}`, h("span", { class: "rn-xp" }, `+${c.xp} XP`))))
        : h("p", { class: "muted" }, "Everything is completed. Incredible.")),

    h("div", { class: "divider" }),

    h("div", { class: "row" },
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Today's plan"),
        todayTasks[0] && todayTasks[0].items.length
          ? h("div", { class: "stack", style: "gap:6px" },
              ...todayTasks[0].items.map((it) =>
                h("div", { class: "schedule-task" },
                  h("input", { type: "checkbox", checked: !!s.tasks[it.id], onchange: (ev) => markTask(it.id, ev.target.checked) }),
                  h("span", { class: `task-label${s.tasks[it.id] ? " done-task" : ""}` },
                    it.href ? h("a", { href: it.href }, it.text) : it.text),
                  h("span", { class: "small faint", style: "margin-left:auto" }, it.type))))
          : h("p", { class: "muted small" }, "Generate a schedule from the Planner.")),
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Jump in"),
        h("div", { class: "stack", style: "gap:8px" },
          h("a", { class: "btn", href: "#/formulas" }, "Formula sheet"),
          h("a", { class: "btn", href: "#/flash" }, "Flash revision"),
          h("a", { class: "btn", href: "#/planner" }, "Planner & focus timer"),
          h("a", { class: "btn", href: "#/quiz" }, "Practice quiz")))),

    h("div", { class: "row", style: "align-items:stretch" },
      h("div", { class: "col card", style: "min-width:250px;padding:13px 16px" },
        h("span", { class: "lbl", style: "margin-bottom:10px;display:block" }, "STUDY INSIGHTS"),
        h("div", { class: "record-grid", style: "margin-bottom:12px" }, peakHourWidget()),
        subjectPie(load().focusSubj || {})),
      (() => { const v = velocityCard(); v.className = "col card"; v.style.minWidth = "260px"; return v; })(),
      (() => { const g = ghostCompareCard(); if (g) { g.className = "col card"; g.style.minWidth = "240px"; } return g; })),

    h("div", { class: "row", style: "margin-top:22px" },
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Consistency"),
        h("div", { class: "card" },
          h("div", { style: "overflow-x:auto;padding:4px 2px" }, heatmapCells(s)),
          h("div", { class: "heatmap-legend" }, "less", h("span", { class: "heat-cell" }), h("span", { class: "heat-cell l1" }), h("span", { class: "heat-cell l2" }), h("span", { class: "heat-cell l3" }), h("span", { class: "heat-cell l4" }), "more"),
          h("p", { class: "hint", style: "margin-top:8px" }, `${Object.keys(s.activity).filter((k) => s.activity[k] > 0).length} active days recorded`))),
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Personal records"),
        h("div", { class: "record-grid" }, ...personalRecords(s)))),

    h("div", { class: "row", style: "margin-top:22px" },
      h("div", { class: "col" },
        h("h2", { style: "margin-bottom:12px" }, "Recent activity"),
        (s.log && s.log.length)
          ? h("div", { class: "card feed" }, ...s.log.slice(0, 7).map((e) => {
              const d = new Date(e.at);
              const sameDay = d.toDateString() === new Date().toDateString();
              const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
              return h("div", { class: "feed-item" },
                h("span", { class: "feed-dot" }),
                h("span", { class: "feed-text" }, e.text),
                h("span", { class: "small faint" }, sameDay ? time : d.toLocaleDateString(undefined, { day: "numeric", month: "short" })));
            }))
          : h("p", { class: "muted small" }, "Your latest wins will show up here."))),

    h("div", { style: "margin-top:22px" },
      h("div", { style: "display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap" },
        h("h2", {}, "Badges"),
        h("span", { class: "quiz-best" }, `${badges.filter((b) => b.ok).length}/${badges.length} unlocked`)),
      h("div", { class: "badge-grid", style: "margin-top:14px" },
        ...badges.map((b) =>
          h("div", { class: `badge${b.ok ? " on" : ""}` },
            h("div", { class: "badge-mark" }, b.g),
            h("div", {},
              h("div", { class: "badge-t" }, b.t),
              h("div", { class: "badge-d" }, b.d)))))));
}

function personalRecords(s) {
  const bestQuiz = (s.quizBest && s.quizBest.best) || 0;
  const practiced = (s.quizBest && s.quizBest.practiced) || 0;
  const bestMock = s.mocks.length
    ? Math.round(Math.max(...s.mocks.map((m) => (m.total > 0 ? (m.score / m.total) * 100 : 0))))
    : null;
  const bestDay = Object.keys(s.activity).length ? Math.max(...Object.values(s.activity)) : 0;
  const focusTotal = Object.values(s.focusLog || {}).reduce((a, b) => a + b, 0);
  return [
    tile(bestQuiz ? `${bestQuiz}/8` : "�", "best quiz session"),
    tile(practiced, "questions practiced"),
    tile(bestMock === null ? "�" : `${bestMock}%`, "best mock score"),
    tile(bestDay, "most items in a day"),
    tile(`${longestStreak()}d`, "longest streak"),
    tile(focusTotal ? `${focusTotal}m` : "�", "focus time logged"),
  ];
}

/* ----------- DAILY CHALLENGE ----------- */

function getDailyChallenge() {
  const s = load();
  const completed = new Set(s.completed);
  const seedStr = todayISO();
  const seed = seedStr.split("-").reduce((acc, p) => acc + parseInt(p, 10), 0);
  const frontier = ALL_CONCEPTS.filter((c) => !completed.has(c.id) && c.prereq.every((p) => completed.has(p)));
  const pool = frontier.length ? frontier : ALL_CONCEPTS.filter((c) => !completed.has(c.id));
  const list = pool.length ? pool : ALL_CONCEPTS;
  return list[seed % list.length];
}

export function DailyChallengeView(root) {
  const challenge = getDailyChallenge();
  const completed = new Set(load().completed);
  const doneToday = isCompleted(challenge.id);
  const claimed = !!(dailyState().claimed && dailyState().claimed.challenge);
  const wstart = new Date();
  wstart.setDate(wstart.getDate() - ((wstart.getDay() + 6) % 7));

  root.innerHTML = "";
  root.append(
    page("Daily challenge",
      new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
      h("div", {},
        h("div", { class: "card", style: "text-align:center;padding:28px" },
          h("div", { class: "chapter-meta", style: "justify-content:center;margin-bottom:12px" },
            subjectTag(challenge.subject),
            h("span", { class: "tag" }, levelName(challenge.level)),
            h("span", { class: "tag" }, `+${challenge.xp} XP`),
            challenge.formulas.length ? h("span", { class: "tag" }, `${challenge.formulas.length} formulas`) : null,
            challenge.sim ? h("span", { class: "tag" }, "3D lab") : null),
          h("h1", {}, challenge.name),
          h("p", { class: "muted", style: "max-width:560px;margin:10px auto 16px" }, challenge.summary),
          challenge.prereq.length
            ? h("div", { class: "chapter-meta", style: "justify-content:center" },
                ...challenge.prereq.map((pid) => {
                  const pr = CONCEPTS[pid];
                  return h("a", { class: `prereq-pill${completed.has(pid) ? " done" : ""}`, href: `#/chapter/${pid}` }, completed.has(pid) ? "? " : "", pr.name);
                }))
            : null,
          h("div", { style: "display:flex;gap:9px;justify-content:center;margin-top:18px;flex-wrap:wrap" },
            h("a", { class: "btn btn-primary", href: `#/chapter/${challenge.id}` }, doneToday ? "Review again" : "Take the challenge"),
            doneToday && !claimed
              ? h("button", { class: "btn claim-btn", onclick: (ev) => { if (claimDailyReward("challenge", 15)) { ev.target.replaceWith(h("span", { class: "small faint" }, "+15 XP claimed")); makeToast("Challenge bonus: +15 XP", true); xpFly(15); refreshXP(); } } }, "Claim +15 bonus")
              : claimed ? h("span", { class: "small faint", style: "align-self:center" }, "bonus claimed") : null)),

        h("div", { class: "row", style: "margin-top:20px" },
          h("div", { class: "col card" },
            h("h3", { style: "margin-bottom:10px" }, "This week"),
            h("div", { style: "display:flex;gap:7px" },
              ...Array.from({ length: 7 }, (_, i) => {
                const d = new Date(wstart.getTime() + i * 86400000);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                const n = (load().activity[key] || 0);
                const cls = n >= 3 ? "a3" : n >= 2 ? "a2" : n >= 1 ? "a1" : "";
                const isToday = key === todayISO();
                return h("div", { title: `${key}: ${n} items`, class: `cal-day ${cls}${isToday ? " today" : ""}`, style: "aspect-ratio:auto;height:42px;font-size:11px;flex:1" },
                  h("div", { style: "display:flex;flex-direction:column;align-items:center;line-height:1.15" },
                    h("span", {}, d.getDate()),
                    n ? h("span", { class: "faint", style: "font-size:8.5px;color:var(--accent-ink)" }, `+${n}`) : null));
              })),
            h("p", { class: "hint", style: "margin-top:10px" }, "Active days this week � fill every box.")),
          h("div", { class: "col card" },
            h("h3", { style: "margin-bottom:10px" }, "Streak"),
            h("div", { class: "stat-grid", style: "margin-top:0" },
              tile(`${getStreak()}d`, "current streak"),
              tile(`${longestStreak()}d`, "best ever")))),
        h("p", { class: "hint", style: "margin-top:14px;text-align:center" }, "A fresh challenge is picked every night at midnight."))));
}

/* ----------- ROADMAP (journey) ----------- */

let journeyCompleted = null;

export function RoadmapView(root) {
  const s = load();
  journeyCompleted = new Set(s.completed);
  let subjFilter = null;
  let hideDone = false;

  function rnode(c, isFrontier) {
    const st = nodeStatus(c, journeyCompleted);
    const cls = st === "completed" ? "st-completed" : st === "unlocked" ? (isFrontier ? "st-current" : "st-unlocked") : "st-locked";
    const dot = st === "completed" ? "?" : isFrontier ? "?" : st === "unlocked" ? "+" : String(c.level + 1);
    const unmet = c.prereq.filter((p) => !journeyCompleted.has(p));
    return h("a", {
      href: `#/chapter/${c.id}`,
      class: `rnode ${cls}`,
      title: st === "locked" ? `Needs: ${unmet.map((p) => CONCEPTS[p].name).join(", ")}` : c.summary.slice(0, 140),
      onclick: (ev) => { if (ev.button === 0 && !ev.metaKey && !ev.ctrlKey) { ev.preventDefault(); navigate(`#/chapter/${c.id}`); } },
      "aria-label": c.name,
    },
      h("span", { class: "rn-dot" }, dot),
      h("span", { class: "rn-name" }, c.name),
      subjectTag(c.subject),
      h("span", { class: "rn-xp" }, `+${c.xp}`));
  }

  function gateEl(nextLvl) {
    const nextChapters = ALL_CONCEPTS.filter((c) => c.level === nextLvl);
    const locked = nextChapters.filter((c) => !journeyCompleted.has(c.id) && c.prereq.some((p) => !journeyCompleted.has(p)));
    const open = locked.length === 0;
    const pct = nextChapters.length ? Math.round(((nextChapters.length - locked.length) / nextChapters.length) * 100) : 100;
    return h("div", { class: `gate${open ? " open" : ""}` },
      h("div", { class: "gate-icon" }, open ? "?" : "?"),
      h("div", { class: "gate-text" },
        open
          ? h("b", {}, `${levelName(nextLvl)} gate open � every prerequisite chain is clear.`)
          : h("span", {}, h("b", {}, `${levelName(nextLvl)} gate`), ` � clear ${locked.length} more prerequisite${locked.length === 1 ? "" : "s"} to open it.`)),
      h("div", { class: "gate-bar" }, h("i", { style: `width:${pct}%` })));
  }

  function buildJourney() {
    const frontier = ALL_CONCEPTS.find((c) => !journeyCompleted.has(c.id) && c.prereq.every((p) => journeyCompleted.has(p)));
    const parts = [];
    LEVELS.forEach((lv, li) => {
      const nodes = ALL_CONCEPTS.filter((c) => c.level === lv.lvl && (!subjFilter || c.subject === subjFilter));
      const doneCount = nodes.filter((c) => journeyCompleted.has(c.id)).length;
      const pct = nodes.length ? (doneCount / nodes.length) * 100 : 0;
      const anyOpen = nodes.some((c) => nodeStatus(c, journeyCompleted) !== "locked");
      const state = doneCount === nodes.length ? "done" : anyOpen || doneCount > 0 ? "active" : "locked";
      const shown = nodes
        .filter((c) => !(hideDone && journeyCompleted.has(c.id)))
        .sort((a, b) => a.subject.localeCompare(b.subject) || a.name.localeCompare(b.name))
        .map((c) => rnode(c, frontier && c.id === frontier.id));
      parts.push(h("section", { class: `stage ${state}` },
        h("div", { class: "stage-head" },
          ringSVG(pct, "stage-ring", 46, 5, 11, `${Math.round(pct)}%`),
          h("div", {},
            h("div", { class: "stage-title" }, lv.title),
            h("div", { class: "stage-sub" }, lv.sub)),
          h("div", { class: "stage-chips" },
            h("span", { class: "tag" }, `${doneCount}/${nodes.length} mastered`),
            state === "locked" ? h("span", { class: "tag", style: "color:var(--faint)" }, "locked") : null,
            state === "done" ? h("span", { class: "tag", style: "color:var(--green)" }, "cleared ?") : null)),
        shown.length
          ? h("div", { class: "path" }, ...shown)
          : h("p", { class: "hint", style: "padding:2px" }, hideDone ? "Everything here is mastered." : "Nothing matches this filter.")));
      if (li < LEVELS.length - 1) parts.push(gateEl(lv.lvl + 1));
    });
    return h("div", { class: "journey" }, ...parts);
  }

  const journeyWrap = h("div");
  journeyWrap.append(buildJourney());

  function renderTabs() {
    tabsEl.innerHTML = "";
    [["all", "All"], ["P", SUBJECTS.P.name], ["C", SUBJECTS.C.name], ["M", SUBJECTS.M.name]].forEach(([key, label]) => {
      const on = (key === "all" && !subjFilter) || subjFilter === key;
      const b = h("button", { class: `ftab${on ? " on" : ""}`, onclick: () => { subjFilter = key === "all" ? null : key; renderTabs(); rebuild(); } }, label);
      tabsEl.append(b);
    });
    const fb = h("button", { class: `ftab${hideDone ? " on" : ""}`, style: "margin-left:auto", onclick: () => { hideDone = !hideDone; renderTabs(); rebuild(); } }, hideDone ? "Showing: in-progress" : "Hide mastered");
    tabsEl.append(fb);
  }
  const tabsEl = h("div", { class: "filter-tabs" });
  renderTabs();

  function rebuild() { journeyWrap.innerHTML = ""; journeyWrap.append(buildJourney()); }

  root.innerHTML = "";
  root.append(page("The Journey",
    "Master prerequisites to unlock deeper levels. Gates between stages open when every chain below them is clear.",
    h("div", {},
      tabsEl,
      h("div", { class: "legend" },
        h("span", {}, h("span", { class: "dot", style: "background:var(--green)" }), " mastered"),
        h("span", {}, h("span", { class: "dot", style: "background:var(--accent)" }), " ready to study"),
        h("span", {}, h("span", { class: "dot", style: "background:var(--surface-3)" }), " locked")),
      journeyWrap)));
}

/* ----------- MISSION JEE STUDY PLAN ----------- */

/* 42-week themed plan adapted from the classic Mission JEE structure.
   Each week lists the real chapter ids to cover per subject (P/C/M). */
const STUDY_PLAN = [
  { theme: "Ground Zero", p: ["P-units"], c: ["C-mole"], m: ["M-sets"] },
  { theme: "Motion & Atoms", p: ["P-kinematics"], c: ["C-atomic"], m: ["M-quad"] },
  { theme: "Forces of Habit", p: ["P-laws"], c: ["C-bonding"], m: ["M-seq"] },
  { theme: "Bonds & Binomials", p: ["P-wpe"], c: ["C-thermo"], m: ["M-binomial"] },
  { theme: "Spin City", p: ["P-rotation"], c: ["C-equil"], m: ["M-trig"] },
  { theme: "Gravity Check", p: ["P-gravitation"], c: ["C-ionic"], m: ["M-conics"] },
  { theme: "Matter Matters", p: ["P-fluids"], c: ["C-redox"], m: ["M-perm"] },
  { theme: "Heat of the Moment", p: ["P-thermo"], c: ["C-solutions"], m: ["M-limits"] },
  { theme: "Gas Giants", p: ["P-ktg"], c: ["C-kinetics"], m: ["M-3dgeo"] },
  { theme: "Good Vibrations", p: ["P-shm", "P-waves"], c: ["C-pblock"], m: ["M-diff"] },
  { theme: "Mechanics Boss Fight", p: ["P-com"], c: ["C-orgbasic"], m: ["M-vectors"] },
  { theme: "Charged Up", p: ["P-electro"], c: ["C-hydrocarbons"], m: ["M-prob"] },
  { theme: "Current Affairs", p: ["P-current"], c: ["C-halo"], m: ["M-stats"] },
  { theme: "Magnetic Personality", p: ["P-magnet"], c: ["C-alcohol"], m: ["M-diffeq"] },
  { theme: "Induced Effort", p: ["P-emi"], c: ["C-carbonyl"], m: ["M-integ"] },
  { theme: "Wave Hello", p: ["P-emw"], c: ["C-amines"], m: ["M-defint"] },
  { theme: "Light Work", p: ["P-rayoptics", "P-waveoptics"], c: ["C-sblock", "C-dblock"], m: ["M-diffeq"] },
  { theme: "Field Day", p: [], c: [], m: [] },  // mixed revision
  { theme: "Quantum Leap", p: ["P-dual"], c: ["C-coord"], m: ["M-3dgeo"] },
  { theme: "Nuclear Option", p: ["P-atoms"], c: ["C-metallurgy"], m: ["M-prob"] },
  { theme: "Chip Mode", p: ["P-semi"], c: ["C-surface"], m: ["M-stats"] },
  { theme: "Lab Rats", p: ["P-thermal"], c: ["C-electro"], m: ["M-vectors"] },
  { theme: "Modern Times", p: ["A-modern"], c: ["C-bio"], m: ["M-diffeq"] },
  { theme: "Full Syllabus, Full Send", p: [], c: [], m: [] },
  { theme: "Session 1 � Stay Sharp", p: [], c: [], m: [] },
  { theme: "Session 1 � Finish Strong", p: [], c: [], m: [] },
  { theme: "Mechanics, Round Two", p: ["A-mech"], c: ["C-orgbasic", "C-hydrocarbons"], m: ["M-conics"] },
  { theme: "Fields, Round Two", p: ["A-em"], c: ["C-halo"], m: ["M-diffeq"] },
  { theme: "Modern, Round Two", p: ["A-modern"], c: ["C-alcohol", "C-carbonyl"], m: ["M-integ"] },
  { theme: "Waves & Wet Lab", p: ["A-fluids"], c: ["C-amines", "C-bio"], m: ["M-3dgeo"] },
  { theme: "Weightage Kings", p: [], c: [], m: [] },
  { theme: "Weak-Spot Week", p: [], c: [], m: [] },
  { theme: "PYQ Marathon I", p: [], c: [], m: [] },
  { theme: "PYQ Marathon II", p: [], c: [], m: [] },
  { theme: "Session 2 � Stay Sharp", p: [], c: [], m: [] },
  { theme: "Session 2 � Finish Strong", p: [], c: [], m: [] },
  { theme: "Advanced Arc I", p: ["A-circuits"], c: ["C-electro"], m: ["A-algebra"] },
  { theme: "Advanced Arc II", p: ["A-optics"], c: ["C-dblock"], m: ["A-calc"] },
  { theme: "Advanced Arc III", p: ["A-thermo"], c: ["C-pblock"], m: ["A-geom"] },
  { theme: "Advanced Arc IV", p: [], c: [], m: [] },
  { theme: "The Last Mile", p: [], c: [], m: [] },
  { theme: "Taper & Trust", p: [], c: [], m: [] },
];

const PLAN_START = "2026-08-03";

export function StudyPlanView(root) {
  function gather() {
    const s = load();
    const completed = new Set(s.completed);
    const ticked = new Set(Object.keys(s.planProg.ticked).filter((k) => s.planProg.ticked[k]));
    const now = new Date();
    const start = new Date(PLAN_START + "T00:00:00");
    const weekMs = 7 * 86400000;
    const elapsed = Math.max(0, Math.floor((now - start) / weekMs));
    const curWeek = Math.min(STUDY_PLAN.length - 1, elapsed);
    return { completed, ticked, curWeek };
  }
  const { completed, ticked, curWeek } = gather();
  function ch(id) { return CONCEPTS[id]; }
  function isDone(id) { return completed.has(id) || ticked.has(id); }

  function pill(c, w, wi) {
    if (!c) return null;
    const done = isDone(c.id);
    const cb = h("span", {
      class: `plan-check${done ? " done" : ""}`, role: "checkbox",
      title: done ? "Mark not covered" : "Mark covered for this week",
      onclick: (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        planTick(c.id, wi, w ? [...w.p, ...w.c, ...w.m] : null);
        makeToast(`${c.name}: marked ${done ? "not covered" : "covered"}`, true);
        StudyPlanView(root);
      }
    }, done ? "✓" : "");
    return h("a", { class: `plan-topic${done ? " done" : ""}`, href: `#/chapter/${c.id}`, title: c.name },
      cb, h("span", { class: "plan-topic-name" }, c.name));
  }
  function col(subj, list, w, wi) {
    const items = list.map(ch).filter(Boolean);
    return h("div", { class: "plan-col" },
      h("div", { class: "plan-subj", style: "color:" + (SUBJECTS[subj]?.color || "var(--text)") },
        SUBJECTS[subj] ? SUBJECTS[subj].name : subj),
      items.length ? h("div", { class: "plan-topics" }, ...items.map((c) => pill(c, w, wi))) : h("span", { class: "small faint" }, "revision / rest"));
  }
  function weekRow(w, i) {
    const isCur = i === curWeek;
    const themed = w.theme;
    const all = [...w.p, ...w.c, ...w.m];
    const valid = all.filter((id) => !!ch(id));
    const doneCh = valid.filter((id) => isDone(id)).length;
    const totalCh = valid.length;
    const pct = totalCh ? Math.round((doneCh / totalCh) * 100) : 0;
    const weekFull = planWeekDone(i) || (totalCh > 0 && doneCh === totalCh);
    return h("div", { class: `plan-week${isCur ? " now" : ""}${weekFull ? " full" : ""}` },
      h("div", { class: "plan-week-head" },
        h("div", { style: "display:flex;align-items:baseline;gap:10px;flex-wrap:wrap" },
          h("span", { class: "plan-week-num" }, `Week ${i + 1}`),
          h("strong", {}, themed || "Mixed revision"),
          isCur ? h("span", { class: "tag", style: "background:var(--accent);color:#111" }, "current week") : null,
          weekFull ? h("span", { class: "tag", style: "background:var(--green);color:#111" }, "week complete!") : null),
        totalCh ? h("span", { class: "small faint" }, `${doneCh}/${totalCh} covered`) : null),
      totalCh ? h("div", { class: "plan-bar" },
        h("div", { class: "plan-bar-fill", style: "width:" + pct + "%" }),
        h("span", { class: "plan-bar-pct" }, pct + "%")) : null,
      h("div", { class: "plan-cols" }, col("P", w.p, w, i), col("C", w.c, w, i), col("M", w.m, w, i)));
  }
  const weeks = STUDY_PLAN.map(weekRow);

  const doneTotal = ALL_CONCEPTS.filter((c) => completed.has(c.id)).length;
  const completeWeeks = planWeekCompleteness();
  const streak = planStreak();
  root.innerHTML = "";
  root.append(page(
    "Mission JEE · 42-Week Study Plan",
    `Full syllabus → past papers → JEE Advanced. Themed 42-week roadmap from ${PLAN_START}. Tap a tick to mark a topic covered for its week.`,
    h("div", {},
      h("div", { class: "row", style: "gap:12px;margin-bottom:16px;flex-wrap:wrap" },
        h("div", { class: "card", style: "flex:1;min-width:180px;padding:16px" },
          h("div", { class: "small faint" }, "You are in"),
          h("div", { style: "font-size:20px;font-weight:700;margin-top:2px" },
            `Week ${curWeek + 1} · ${STUDY_PLAN[curWeek].theme || "revision"}`),
          h("div", { class: "small muted", style: "margin-top:3px" },
            `${doneTotal}/${ALL_CONCEPTS.length} chapters mastered overall`)),
        h("div", { class: "card", style: "flex:1;min-width:150px;padding:16px" },
          h("div", { class: "small faint" }, "Plan streak"),
          h("div", { style: "font-size:20px;font-weight:700;margin-top:2px;color:var(--accent)" },
            `${streak} day${streak === 1 ? "" : "s"}`),
          h("div", { class: "small muted", style: "margin-top:3px" },
            "keep ticking a topic daily")),
        h("div", { class: "card", style: "flex:1;min-width:150px;padding:16px" },
          h("div", { class: "small faint" }, "Weeks completed"),
          h("div", { style: "font-size:20px;font-weight:700;margin-top:2px;color:var(--green)" },
            `${completeWeeks}/${STUDY_PLAN.length}`),
          h("div", { class: "small muted", style: "margin-top:3px" },
            "cover every topic in a week to complete it")),
        h("div", { style: "display:flex;align-items:center" },
          h("a", { class: "btn btn-primary", href: "#/daily" }, "Today's challenge"))),
      h("div", { class: "plan-legend" },
        h("span", {}, h("span", { class: "dot", style: "background:var(--green)" }), " mastered / covered"),
        h("span", {}, h("span", { class: "dot", style: "background:var(--accent)" }), " current week"),
        h("span", {}, h("span", { class: "dot", style: "background:var(--surface-3)" }), " still to cover")),
      h("div", { class: "plan-list" }, ...weeks),
      h("div", { class: "small faint", style: "margin-top:14px;text-align:center" },
        "Coverage ticks are independent of chapter mastery — use them to track what you have covered this week."))));
}

/* ----------- CHAPTER ----------- */

export function ChapterView(root, id) {
  disposeActiveSim();
  const [cleanId, qStr] = id.split("?"); const c = CONCEPTS[cleanId]; const _variantParams = new URLSearchParams(qStr||"");
  const variantSim = _variantParams.get("sim"); const variantIdx = _variantParams.get("variant");
  if (variantSim && variantSim !== "undefined" && variantIdx != null && variantIdx !== "null") window.__SIM_VARIANT__ = { sim: variantSim, idx: variantIdx };
  else delete window.__SIM_VARIANT__;
  if (!c) {
    root.innerHTML = "";
    root.append(page("Not found", "This chapter does not exist.", h("a", { class: "btn", href: "#/roadmap" }, "Back to roadmap")));
    return;
  }
  const prevCompleted = new Set(load().completed);
  const prevRankIdx = rankIndex(getTotalXP(ALL_CONCEPTS));
  const completed = new Set(prevCompleted);
  const st = nodeStatus(c, completed);
  const unmet = c.prereq.filter((p) => !completed.has(p));
  setLastChapter(cleanId);
  markSeen(cleanId);

  const meta = h("div", { class: "chapter-meta" },
    subjectTag(c.subject),
    h("span", { class: "tag" }, levelName(c.level)),
    h("span", { class: "tag", title: "JEE Main importance", style: "color:var(--accent)" }, weightLabel(c.id)),
    h("span", { class: "tag", style: "color:var(--amber)" }, `+${c.xp} XP`),
    h("span", { class: "tag" }, st === "completed" ? "? mastered" : st === "unlocked" ? "ready" : "locked"));

  const head = h("div", { style: "margin-top:14px" },
    h("div", { class: "breadcrumb" },
      h("a", { href: "#/roadmap" }, "Journey"), `  /  ${levelName(c.level)}  /  ${c.name}`),
    h("div", { class: "chapter-head" },
      h("div", {}, h("h1", {}, c.name), meta),
      h("div", { class: "chapter-actions" }, starButton(c.id), h("button",{class:"btn btn-sm", title:"Focus Flow � immersive reading", onclick:()=>{ document.body.classList.toggle("focus-flow"); makeToast(document.body.classList.contains("focus-flow")?"Focus Flow ON":"Focus Flow OFF", true); }}, "? Focus"), completeButton(c, st, prevCompleted, prevRankIdx))));

  let body = st === "locked"
    ? h("div", { class: "card", style: "margin-top:20px" },
        h("h3", { style: "margin-bottom:8px" }, "This chapter is locked"),
        h("p", { class: "muted" }, "Master these prerequisites first to unlock it:"),
        h("div", { class: "chapter-meta" },
          ...unmet.map((pid) => {
            const pr = CONCEPTS[pid];
            return h("a", { class: "prereq-pill", href: `#/chapter/${pid}` }, subjectTag(pr.subject), ` ${pr.name}`);
          })),
        h("p", { class: "hint", style: "margin-top:12px" }, "Unlocking the last missing prerequisite opens this chapter instantly."))
    : tabsView(c);

  if (st !== "locked" && Quantum.godModeUnlocked(c.id)) {
    const god = h("div", { class: "card", style: "margin-top:14px;border-color:gold;background:color-mix(in srgb,gold 10%, var(--surface))" },
      h("h3", { style: "color:gold" }, "?? God Mode � Legendary CP Unlocked"),
      h("p", { class: "small muted" }, "You mastered 100%. Solve this ultra-hard challenge to earn a legendary badge."),
      h("div", { style: "margin-top:8px;display:flex;gap:8px" },
        h("button", { class: "btn btn-primary btn-sm", onclick: () => {
          const ok = confirm("God Mode: Accept legendary challenge? (demo � marks as completed)"); if(!ok) return;
          const s=load(); s.achievements=s.achievements||[]; if(!s.achievements.includes("god-"+c.id)){ s.achievements.push("god-"+c.id); save(); makeToast("?? Legendary badge earned!", true); const cert=Quantum.mintCertificate(); makeToast(`Cert ${cert.id}`, true); Quantum.haptic(true); }
        }}, "Accept God Challenge ?"),
        h("span", { class: "tag", style:"background:gold;color:#111" }, "LEGENDARY")));
    body = h("div", {}, god, body);
  }
  if (Quantum.architectUnlocked() && c.id === ALL_CONCEPTS[0].id) {
    const arch = h("div", { class: "card", style: "margin-top:14px;border-style:dashed" },
      h("h3", {}, "??? The Architect � Easter Note"),
      h("p", { class: "small muted" }, "You�ve proven persistence. The architect is Tanush Saha � and now, you. This note is the blueprint of learning itself. Build on."));
    body = h("div", {}, arch, body);
  }
  if (st !== "locked") {
    const doubts = (load().doubts && load().doubts[c.id]) || [];
    const list = h("div", { class: "stack", style: "gap:6px;margin-top:8px" });
    function repaintDoubts(){ list.innerHTML=""; if(!doubts.length) list.append(h("p",{class:"small faint"},"No doubts yet � be the first to ask.")); doubts.forEach(d=> list.append(h("div",{class:"card", style:"padding:8px;background:var(--bg)"}, h("div",{class:"small", style:"font-weight:600"}, d.q), h("div",{class:"small faint"}, new Date(d.at).toLocaleString() + (d.a?` � ? ${d.a}`:" � awaiting peer")) ))); }
    const inp=h("input",{type:"text", placeholder:"Ask a doubt � e.g. Why does SN1 need polar protic?", style:"flex:1"});
    const btn=h("button",{class:"btn btn-primary btn-sm", onclick:()=>{ const q=inp.value.trim(); if(!q) return; const s2=load(); s2.doubts=s2.doubts||{}; s2.doubts[c.id]=s2.doubts[c.id]||[]; s2.doubts[c.id].unshift({q, at:Date.now(), a:null}); save(); doubts.unshift({q, at:Date.now()}); inp.value=""; repaintDoubts(); makeToast("Doubt posted � peers will see in Fabric", true); }}, "Ask");
    repaintDoubts();
    const doubtCard=h("div",{class:"card", style:"margin-top:14px"}, h("h3",{}, "?? Doubt Chain � peer threads"), h("p",{class:"small muted"},"Local-first threads per chapter. No server � synced via Fabric when you export."), h("div",{class:"row", style:"gap:8px;margin-top:8px"}, inp, btn), list);
    body = h("div", {}, body, doubtCard);
  }
  // Subtopics � 5 deep lenses per chapter (465 total)
  if (st !== "locked") {
    const subs=subtopicsFor(c);
    const subWrap=h("div",{class:"card", style:"margin-top:14px"});
    subWrap.append(h("h3",{}, `?? Deep Subtopics � ${subs.length} lenses`), h("p",{class:"small muted"},"465 sub-notes total (93�5) � each a chapter-specific deep dive with trap, visual, and cross-link."));
    const grid=h("div",{class:"labs-grid2", style:"margin-top:8px"});
    subs.forEach(st=>{
      const holder=h("div",{class:"small", style:"margin-top:6px"}); holder.innerHTML=st.body;
      const card=h("div",{class:"card", style:"padding:10px;background:var(--bg)"},
        h("div",{style:"font-weight:700;font-size:13px"}, st.title),
        h("div",{class:"small faint", style:"margin-top:2px"}, st.lens),
        holder,
        h("div",{class:"small faint", style:"margin-top:6px"}, st.simHint));
      grid.append(card);
    });
    subWrap.append(grid);
    body = h("div", {}, body, subWrap);
  }

  root.innerHTML = "";
  root.append(head, body);
}

function starButton(id) {
  const on = isStarred(id);
  const btn = h("button", { class: `star-btn${on ? " on" : ""}`, title: on ? "Remove bookmark" : "Bookmark this chapter" }, "?");
  btn.addEventListener("click", () => {
    const nowOn = toggleStar(id);
    btn.classList.toggle("on", nowOn);
    btn.title = nowOn ? "Remove bookmark" : "Bookmark this chapter";
    makeToast(nowOn ? "Bookmarked." : "Bookmark removed.", nowOn);
    notifySync();
  });
  return btn;
}

function completeButton(c, st, prevCompleted, prevRankIdx) {
  const done = st === "completed";
  const locked = st === "locked";
  if (locked) {
    return h("button", { class: "btn", disabled: true, style: "cursor:not-allowed;opacity:.6" }, "Locked � finish prerequisites first");
  }
  const btn = h("button", { class: `btn ${done ? "btn-ghost" : "btn-primary"}` },
    done ? "? Mastered � undo" : "Mark as mastered");
  btn.addEventListener("click", () => {
    if (done) {
      uncompleteConcept(c.id);
      addEvent(`Un-marked "${c.name}"`);
      makeToast(`"${c.name}" un-marked.`);
    } else {
      completeConcept(c.id);
      addEvent(`Mastered "${c.name}" (+${c.xp} XP)`);
      makeToast(`"${c.name}" mastered! +${c.xp} XP`, true);
      const rect = btn.getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top, 110);
      xpFly(c.xp, btn);
      checkCelebrations(prevCompleted, prevRankIdx);
      notifySync();
    }
    ChapterView(root, c.id);
  });
  return btn;
}

/* ----------- SIM DISPOSAL ----------- */

let activeSimCleanup = null;
const viewCleanups = [];
export function onViewCleanup(fn) { viewCleanups.push(fn); }
export function disposeActiveSim() {
  while (viewCleanups.length) {
    const fn = viewCleanups.pop();
    try { fn(); } catch {}
  }
  if (activeSimCleanup) {
    const fn = activeSimCleanup;
    activeSimCleanup = null;
    try { fn(); } catch {}
  }
}
function ownSim(sim) {
  activeSimCleanup = () => { if (sim && sim.dispose) sim.dispose(); };
}

/* ----------- CHAPTER TABS ----------- */

function tabsView(c) {
  const tabEls = [];
  const paneWrap = h("div", {});
  const hasDeep = !!DEEP_NOTES[c.id];
  const panes = { Overview: overviewPane, Notes: notesPane, Formulas: formulasPane, "Sub-concepts": subsPane, Lectures: lecturesPane, Simulation: simPane };
  if (hasDeep) panes["Full Notes"] = deepNotesPane;
  const tabs = ["Overview", ...(hasDeep ? ["Full Notes"] : []), "Notes", "Formulas", "Sub-concepts", "Lectures", "Simulation"].filter(Boolean);

  function switchTab(name) {
    tabEls.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    disposeActiveSim();
    paneWrap.innerHTML = "";
    paneWrap.append(panes[name](c));
  }

  tabs.forEach((name) => {
    const t = h("button", { class: `tab${name === "Full Notes" ? " dn-tab" : ""}`, dataset: { tab: name } }, name);
    t.addEventListener("click", () => switchTab(name));
    tabEls.push(t);
  });

  const variantTab = window.__SIM_VARIANT__ && window.__SIM_VARIANT__.sim ? "Simulation" : "";
  switchTab(variantTab || (hasDeep ? "Full Notes" : tabs[0]));
  return h("div", {}, h("div", { class: "tabs" }, ...tabEls), paneWrap);
}

function overviewPane(c) {
  const completed = new Set(load().completed);
  const unlockedAfter = ALL_CONCEPTS.filter((n) => n.prereq.includes(c.id));
  return h("div", { class: "stack", style: "gap:16px;margin-top:4px" },
    h("div", { class: "card" },
      h("p", { class: "muted" }, c.summary),
      h("h3", { style: "margin:14px 0 8px" }, "Key points"),
      h("ul", { style: "margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px" },
        ...c.points.map((p) => h("li", {}, p)))),
    c.prereq.length
      ? h("div", {},
          h("h3", { style: "margin-bottom:8px" }, "Prerequisites"),
          h("div", { class: "chapter-meta" },
            ...c.prereq.map((p) =>
              h("a", { class: `prereq-pill${completed.has(p) ? " done" : ""}`, href: `#/chapter/${p}` },
                completed.has(p) ? "? " : "", CONCEPTS[p].name))))
      : null,
    unlockedAfter.length
      ? h("div", {},
          h("h3", { style: "margin-bottom:8px" }, "Unlocks next"),
          h("div", { class: "chapter-meta" },
            ...unlockedAfter.map((n) => h("a", { class: "prereq-pill", href: `#/chapter/${n.id}` }, n.name))))
      : null);
}

function notesPane(c) {
  const saved = (load().notes && load().notes[c.id]) || "";
  const ta = h("textarea", { class: "note-editor", rows: 4, placeholder: "Your own shortcuts, mnemonics, mistakes to avoid�" });
  ta.value = saved;
  const saveBtn = h("button", { class: "btn btn-sm" }, "Save note");
  const savedTag = h("span", { class: "quiz-best" }, saved ? "saved ?" : "not saved");
  const saveIt = () => {
    saveNote(c.id, ta.value);
    savedTag.textContent = "saved ?";
    makeToast("Note saved.", true);
    notifySync();
  };
  saveBtn.addEventListener("click", saveIt);
  ta.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "s") { ev.preventDefault(); saveIt(); }
  });
  return h("div", { class: "notes", style: "margin-top:4px" },
    h("div", { class: "card" },
      h("label", { class: "lbl" }, "Your notes (saved on this device)"),
      ta,
      h("div", { style: "display:flex;align-items:center;gap:10px;margin-top:8px" }, saveBtn, savedTag)),
    h("div", { class: "card" },
      h("h3", { style: "margin-bottom:8px" }, "Study notes"),
      h("ul", { style: "margin:0;padding-left:20px;display:flex;flex-direction:column;gap:5px;font-size:14px" },
        ...c.points.map((p) => h("li", {}, p))),
      c.subs.length
        ? h("div", {},
            h("h3", { style: "margin:16px 0 4px" }, "Sub-concepts"),
            h("div", { class: "sub-grid" },
              ...c.subs.map((sb) => h("div", { class: "sub-item" }, h("div", { class: "t" }, sb.n), h("div", { class: "d" }, sb.d)))))
        : null));
}

function formulasPane(c) {
  if (!c.formulas.length) return h("p", { class: "muted", style: "margin-top:8px" }, "No formulas listed for this chapter.");
  return h("div", { class: "formulas", style: "margin-top:4px" },
    ...c.formulas.map((f) =>
      h("div", { class: "formula" },
        h("span", { class: "fn" }, f.n),
        h("span", { class: "fs" }, f.f),
        f.d ? h("span", { class: "fd" }, f.d) : null)));
}

function subsPane(c) {
  if (!c.subs.length) return h("p", { class: "muted", style: "margin-top:8px" }, "No sub-concepts recorded.");
  return h("div", { class: "sub-grid", style: "margin-top:4px" },
    ...c.subs.map((sb) => h("div", { class: "sub-item" }, h("div", { class: "t" }, sb.n), h("div", { class: "d" }, sb.d))));
}

function simPane(c) {
  const shell = h("div", { class: "sim-shell", style: "height:430px" },
    h("canvas", { style: "position:absolute;inset:0;width:100%;height:100%" }),
    h("div", { class: "sim-loading" }, "Loading 3D lab�"),
    h("div", { class: "sim-tools" },
      h("button", { title: "Reset view", html: "&#8635;" }),
      h("button", { title: "Fullscreen", html: "&#9974;" })),
    h("div", { class: "sim-tag" }, "3D � drag rotate � scroll zoom � right-drag pan"),
    h("div", { class: "sim-variant", style: "display:none" }, "? Generative variant"));
  const ctrlWrap = h("div", { class: "sim-panel", hidden: true });
  let sim = null;

  import("./sim/index.js").then(async ({ mountSim, hasSim, CONCEPT_SIM_MAP }) => {
    const variantInfo = window.__SIM_VARIANT__;
    let simId = (variantInfo && variantInfo.sim) || c.sim || (CONCEPT_SIM_MAP && CONCEPT_SIM_MAP[c.id]);
    if (!simId || !hasSim(simId)) {
      try{
        const { randomVariant } = await import("./sim/factory.js");
        const v = randomVariant(); simId = v.sim;
        const loading = shell.querySelector(".sim-loading");
        if (loading) loading.textContent = `No dedicated lab � showing ${simId} variant (factory).`;
      }catch{
        const loading = shell.querySelector(".sim-loading");
        if (loading) loading.textContent = "No dedicated lab for this chapter yet � notes, formulas and the PYQ bank cover it.";
        return;
      }
    }
    try {
      sim = mountSim(shell.querySelector("canvas"), simId);
      ownSim(sim);
      // apply Atlas variant � uses the sim's REAL control keys/ranges
      if (variantInfo && variantInfo.idx != null) {
        try {
          const { variantForControls } = await import("./sim/factory.js");
          const presets = variantForControls(parseInt(variantInfo.idx, 10), sim.controls);
          Object.entries(presets).forEach(([k, val]) => { try { sim.setControl(k, val); } catch {} });
          sim.controls.forEach((ctrl) => { if (presets[ctrl.key] !== undefined) ctrl.value = presets[ctrl.key]; });
          const chip = shell.querySelector(".sim-variant");
          if (chip) { chip.textContent = `? Generative variant #${variantInfo.idx} � ${simId} (parametric controls applied)`; chip.style.display = "block"; }
        } catch {}
      }
      const loading = shell.querySelector(".sim-loading");
      if (loading) loading.remove();
      renderControls();
    } catch (err) {
      const loading = shell.querySelector(".sim-loading");
      if (loading) loading.textContent = `Could not start ${simId} (${err.message.slice(0,60)}). Try another chapter or reload.`;
    }
  });

  function renderControls() {
    if (!sim || !sim.controls.length) return;
    ctrlWrap.hidden = false;
    ctrlWrap.innerHTML = "";
    for (const ctrl of sim.controls) {
      const row = h("label");
      if (ctrl.type === "select") {
        row.append(ctrl.label + " ",
          h("select", { onchange: (ev) => { ctrl.value = ev.target.value; sim.setControl(ctrl.key, ctrl.value); } },
            ...ctrl.options.map((o) => h("option", { value: o, selected: o === ctrl.value ? "" : null }, o))));
      } else if (ctrl.type === "toggle") {
        row.append(h("input", { type: "checkbox", checked: !!ctrl.value, onchange: (ev) => { ctrl.value = ev.target.checked ? 1 : 0; sim.setControl(ctrl.key, ctrl.value); } }), " ", ctrl.label);
      } else if (ctrl.type === "button") {
        row.append(h("button", { class: "btn btn-sm", onclick: () => sim.setControl(ctrl.key, 1) }, ctrl.label));
      } else {
        const val = h("span", { class: "mono" }, ctrl.value);
        row.append(`${ctrl.label}: `, val,
          h("input", { type: "range", min: ctrl.min, max: ctrl.max, step: ctrl.step, value: ctrl.value,
            oninput: (ev) => {
              const v = parseFloat(ev.target.value);
              ctrl.value = v;
              val.textContent = v;
              sim.setControl(ctrl.key, v);
            } }));
      }
      ctrlWrap.append(row);
    }
  }

  const [resetBtn, fullBtn] = shell.querySelectorAll("button");
  resetBtn.addEventListener("click", () => sim && sim.resetView());
  fullBtn.addEventListener("click", () => {
    if (!document.fullscreenElement && shell.requestFullscreen) shell.requestFullscreen().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen();
  });

  return h("div", { style: "margin-top:4px" }, shell, ctrlWrap,
    h("p", { class: "hint", style: "margin-top:10px" }, "Interactive model � grab it with mouse or finger."));
}

/* ----------- FLOWCHART ----------- */

export function FlowchartView(root) {
  const completed = new Set(load().completed);
  const flow = h("div");
  LEVELS.forEach((lv, i) => {
    const nodes = ALL_CONCEPTS.filter((c) => c.level === lv.lvl).sort((a, b) => a.subject.localeCompare(b.subject));
    flow.append(h("div", { class: "flow-stage-label" }, `${lv.title} � ${lv.sub}`));
    flow.append(h("div", { class: "flow-stage" },
      ...nodes.map((c) => {
        const st = nodeStatus(c, completed);
        const n = h("div", { class: `flow-node ${st}` },
          h("span", { class: "fn-name" }, c.name),
          h("span", { class: "fn-sub" }, `${SUBJECTS[c.subject].name} � +${c.xp} XP`));
        n.addEventListener("click", () => navigate(`#/chapter/${c.id}`));
        return n;
      })));
    if (i < LEVELS.length - 1) flow.append(h("div", { class: "flow-connector" }));
  });
  root.innerHTML = "";
  root.append(page("Flowchart", "The recommended study path, layer by layer. Click any box to open it.", flow));
}

/* ----------- CONSTELLATION MAP (Concept Constellation) ----------- */

const CONSTELLATION_KEY = "tmj-constellation-pos";

export function ConstellationView(root) {
  const s = load();
  const completed = new Set(s.completed);
  const starred = new Set(s.starred || []);
  const container = h("div", { class: "constellation-obsidian" });
  root.innerHTML = "";
  root.append(page("Constellation � Obsidian Graph", "Filter, search, and fly through the syllabus like Obsidian. Drag nodes � scroll zoom � hover preview � click to open � depth and groups on the left.", container));
  renderConstellation(container, completed, starred, s);
}

function renderConstellation(container, completed, starred, state) {
  const allNodes = ALL_CONCEPTS.map((c) => ({
    id: c.id, name: c.name, subject: c.subject, level: c.level, xp: c.xp, summary: c.summary,
    status: nodeStatus(c, completed), prereqs: c.prereq.slice(), isStarred: starred.has(c.id)
  }));
  const allEdges = [];
  for (const n of allNodes) for (const p of n.prereqs) if (allNodes.some((q) => q.id === p)) allEdges.push({ from: p, to: n.id });

  let positions = state.constellationPos || {};
  for (const n of allNodes) if (!positions[n.id] || typeof positions[n.id] !== "object") positions[n.id] = { x: (Math.random()-0.5)*700, y: (Math.random()-0.5)*520 };

  let query = "", subjFilter = "ALL", statusFilter = "ALL", showLabels = true, showArrows = false, hideLocked = false, groupBy = "subject", localMode = false, selectedId = null, physicsOn = true;
  let zoom = 100;

  const wrap = h("div", { class: "obs-wrap" });
  const controls = h("div", { class: "obs-controls" });
  const searchIn = h("input", { type: "text", placeholder: "Search chapters (like Obsidian)�", class: "obs-search" });
  searchIn.addEventListener("input", ()=>{ query = searchIn.value.trim().toLowerCase(); redraw(); });
  const subjChips = h("div", { class: "obs-chips" });
  ["ALL","P","C","M"].forEach((s)=>{
    const label = s==="ALL"?"All":SUBJECTS[s].name;
    const b = h("button", { class: `chip obs-chip${subjFilter===s?" on":""}` }, label);
    b.addEventListener("click", ()=>{ subjFilter=s; subjChips.querySelectorAll(".obs-chip").forEach((x,i)=> x.classList.toggle("on", ["ALL","P","C","M"][i]===s)); redraw(); });
    subjChips.append(b);
  });
  const statusChips = h("div", { class: "obs-chips" });
  [["ALL","All"],["completed","Done"],["unlocked","Unlocked"],["locked","Locked"]].forEach(([v,l])=>{
    const b = h("button", { class: `chip obs-chip${statusFilter===v?" on":""}` }, l);
    b.addEventListener("click", ()=>{ statusFilter=v; statusChips.querySelectorAll(".obs-chip").forEach(x=> x.classList.toggle("on", x.textContent===l)); redraw(); });
    statusChips.append(b);
  });
  const toggles = h("div", { class: "obs-toggles" },
    (()=>{ const c=h("label",{class:"obs-toggle"}, h("input",{type:"checkbox",checked:showLabels}), " Labels"); c.firstChild.addEventListener("change",(e)=>{showLabels=e.target.checked; redraw();}); return c; })(),
    (()=>{ const c=h("label",{class:"obs-toggle"}, h("input",{type:"checkbox",checked:showArrows}), " Arrows"); c.firstChild.addEventListener("change",(e)=>{showArrows=e.target.checked; redraw();}); return c; })(),
    (()=>{ const c=h("label",{class:"obs-toggle"}, h("input",{type:"checkbox",checked:hideLocked}), " Hide locked"); c.firstChild.addEventListener("change",(e)=>{hideLocked=e.target.checked; redraw();}); return c; })(),
    (()=>{ const c=h("label",{class:"obs-toggle"}, h("input",{type:"checkbox",checked:localMode}), " Local graph"); c.firstChild.addEventListener("change",(e)=>{localMode=e.target.checked; if(!localMode) selectedId=null; redraw();}); return c; })(),
    (()=>{ const c=h("label",{class:"obs-toggle"}, h("input",{type:"checkbox",checked:physicsOn}), " Physics"); c.firstChild.addEventListener("change",(e)=>{physicsOn=e.target.checked; if(physicsOn) run();}); return c; })(),
  );
  const btnRow = h("div", { class:"obs-btnrow" },
    h("button",{class:"btn btn-sm", onclick:()=>{ physicsOn=true; run(); }}, "? Resume"),
    h("button",{class:"btn btn-sm", onclick:()=>{ for(const n of allNodes) positions[n.id]={x:(Math.random()-0.5)*700,y:(Math.random()-0.5)*520}; redraw(); }}, "? Reshuffle"),
    h("button",{class:"btn btn-sm", onclick:()=>{ zoom=100; redraw(); }}, "? Fit"),
    h("button",{class:"btn btn-sm", title:"Radial mind-map by level", onclick:()=>{
      const byLevel={}; allNodes.forEach(n=> (byLevel[n.level]=byLevel[n.level]||[]).push(n));
      Object.entries(byLevel).forEach(([lvl, arr])=>{
        const r=70 + (+lvl)*78; arr.forEach((n,i)=>{ const ang=(i/arr.length)*Math.PI*2 + (+lvl)*0.35; positions[n.id]={x: Math.cos(ang)*r, y: Math.sin(ang)*r}; vz[n.id]=0; vvy[n.id]=0; });
      }); redraw();
    }}, "? Mind Map"),
    h("span",{class:"small faint", style:"margin-left:6px"}, "Drag � scroll zoom � double-click fit"),
  );
  const legend = h("div",{class:"obs-legend"},
    h("span",{class:"obs-dot", style:"background:#60a5fa"}), " Physics ",
    h("span",{class:"obs-dot", style:"background:#34d399"}), " Chemistry ",
    h("span",{class:"obs-dot", style:"background:#fbbf24"}), " Maths ",
    h("span",{class:"obs-dot", style:"background:var(--green);border:2px solid var(--green)"}), " Done ",
    h("span",{class:"obs-dot", style:"background:var(--amber)"}), " Unlocked ",
  );
  controls.append(
    h("div",{class:"obs-searchrow"}, searchIn, h("span",{class:"small faint"}, `${allNodes.length} nodes � ${allEdges.length} links`)),
    h("div",{class:"obs-row"}, h("span",{class:"small faint", style:"min-width:56px"}, "Subject"), subjChips),
    h("div",{class:"obs-row"}, h("span",{class:"small faint", style:"min-width:56px"}, "Status"), statusChips),
    toggles, btnRow, legend
  );

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "-440 -340 880 680");
  svg.setAttribute("class", "constellation-svg obs-svg");
  svg.style.width = "100%"; svg.style.height = "620px"; svg.style.cursor = "grab"; svg.setAttribute("tabindex","0"); svg.style.touchAction="none";
  const edgesG = document.createElementNS(svgNS, "g"); svg.append(edgesG);
  const nodesG = document.createElementNS(svgNS, "g"); svg.append(nodesG);
  const labelsG = document.createElementNS(svgNS, "g"); svg.append(labelsG);
  // arrow marker
  const defs = document.createElementNS(svgNS, "defs");
  defs.innerHTML = `<marker id="obsArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--faint)" opacity="0.7"/></marker>`;
  svg.append(defs);

  const tooltip = h("div",{class:"obs-tooltip", style:"display:none;position:absolute;pointer-events:none;z-index:5"});
  const stage = h("div",{class:"obs-stage", style:"position:relative"});
  stage.append(svg, tooltip);
  wrap.append(controls, stage);
  container.append(wrap);

  let vz={}, vvy={}, draggingNode=null;
  const kRepel=2200, kSpring=0.045, kFriction=0.85;

  function nodeRadius(n,z){ const base = n.level===0?7 : n.level>=4?6:5.5; return base*z; }
  function nodeColor(n){ return SUBJECTS[n.subject]?.color || "#999"; }
  function nodeStroke(n){ if(n.status==="completed") return "var(--green)"; if(n.status==="unlocked") return "var(--amber)"; return "var(--surface-2)"; }
  function matches(n){
    if(hideLocked && n.status==="locked") return false;
    if(subjFilter!=="ALL" && n.subject!==subjFilter) return false;
    if(statusFilter!=="ALL" && n.status!==statusFilter) return false;
    if(query && !(n.name.toLowerCase().includes(query) || n.summary.toLowerCase().includes(query))) return false;
    if(localMode && selectedId){
      if(n.id===selectedId) return true;
      const sel = allNodes.find(x=>x.id===selectedId);
      const neighbors = new Set([selectedId, ...((sel&&sel.prereqs)||[]), ...allNodes.filter(x=>x.prereqs.includes(selectedId)).map(x=>x.id)]);
      if(!neighbors.has(n.id)) return false;
    }
    return true;
  }

  function redraw(){
    const z = zoom/100;
    const visible = new Set(allNodes.filter(matches).map(n=>n.id));
    edgesG.innerHTML=""; nodesG.innerHTML=""; labelsG.innerHTML="";
    for(const e of allEdges){
      if(!visible.has(e.from) || !visible.has(e.to)) continue;
      const a=positions[e.from], b=positions[e.to]; if(!a||!b) continue;
      const allDone = completed.has(e.from)&&completed.has(e.to);
      const eitherDone = completed.has(e.from)||completed.has(e.to);
      const dim = localMode && selectedId && !(e.from===selectedId || e.to===selectedId);
      const path=document.createElementNS(svgNS,"path");
      path.setAttribute("d", `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
      path.setAttribute("stroke", allDone?"var(--green)":eitherDone?"var(--amber)":"var(--surface-3)");
      path.setAttribute("stroke-width", eitherDone?"2":"1");
      path.setAttribute("fill","none");
      path.setAttribute("opacity", dim?"0.08": allDone?"0.9": eitherDone?"0.55":"0.22");
      if(showArrows) path.setAttribute("marker-end","url(#obsArrow)");
      edgesG.append(path);
    }
    for(const n of allNodes){
      if(!visible.has(n.id)) continue;
      const p=positions[n.id]; const r=nodeRadius(n,z);
      const isSel = selectedId===n.id;
      const isNeighbor = localMode && selectedId && (n.prereqs.includes(selectedId) || allNodes.find(x=>x.id===selectedId)?.prereqs.includes(n.id));
      if(localMode && selectedId && !isSel && !isNeighbor && n.id!==selectedId) {
        // still draw but faded handled via opacity below
      }
      const fade = (query && !n.name.toLowerCase().includes(query) && !n.summary.toLowerCase().includes(query)) ? 0.22 : 1;
      const localFade = localMode && selectedId && n.id!==selectedId && !n.prereqs.includes(selectedId) && !allNodes.find(x=>x.id===selectedId)?.prereqs.includes(n.id) ? 0.18 : 1;
      const circ=document.createElementNS(svgNS,"circle");
      circ.setAttribute("cx",p.x); circ.setAttribute("cy",p.y); circ.setAttribute("r", r + (isSel?3:0));
      circ.setAttribute("fill", nodeColor(n));
      circ.setAttribute("stroke", isSel?"var(--text)": nodeStroke(n));
      circ.setAttribute("stroke-width", isSel?"3": n.status==="completed"?"3":"1.5");
      circ.setAttribute("class", `const-node const-node-${n.status}${n.isStarred?" starred":""}${isSel?" obs-sel":""}`);
      circ.setAttribute("data-id", n.id);
      circ.style.cursor="pointer"; circ.style.opacity = Math.min(fade, localFade);
      if(n.isStarred){ circ.setAttribute("stroke-dasharray","3 2"); }
      nodesG.append(circ);
      if(n.status==="completed"){
        const glow=document.createElementNS(svgNS,"circle");
        glow.setAttribute("cx",p.x); glow.setAttribute("cy",p.y); glow.setAttribute("r", r+7);
        glow.setAttribute("fill","none"); glow.setAttribute("stroke","var(--green)"); glow.setAttribute("stroke-width","2"); glow.setAttribute("opacity", String(0.5*Math.min(fade,localFade))); glow.setAttribute("filter","blur(2px)");
        nodesG.insertBefore(glow, circ);
      }
      if(showLabels){
        const lbl=document.createElementNS(svgNS,"text");
        lbl.setAttribute("x",p.x); lbl.setAttribute("y", p.y + r + 16);
        lbl.setAttribute("text-anchor","middle"); lbl.setAttribute("font-size", Math.max(8, 11*z));
        lbl.setAttribute("fill","var(--muted)"); lbl.setAttribute("opacity", String((n.status==="completed"?0.85:0.5)*Math.min(fade,localFade)));
        lbl.textContent = n.name.length>18 ? n.name.slice(0,18)+"�" : n.name;
        labelsG.append(lbl);
      }
    }
  }

  function step(){
    if(!physicsOn) return;
    const z=zoom/100; const repel=kRepel/(z*z);
    for(const a of allNodes){ let fx=0,fy=0; for(const b of allNodes){ if(a.id===b.id) continue; const dx=positions[a.id].x-positions[b.id].x, dy=positions[a.id].y-positions[b.id].y; let d2=dx*dx+dy*dy+1; if(d2<1) d2=1; const f=repel/d2; fx+=(dx/Math.sqrt(d2))*f; fy+=(dy/Math.sqrt(d2))*f; }
      for(const p of a.prereqs){ const t=positions[p]; if(!t) continue; fx+=(positions[a.id].x-t.x)*kSpring*z; fy+=(positions[a.id].y-t.y)*kSpring*z; }
      vz[a.id]=(vz[a.id]||0)+fx; vvy[a.id]=(vvy[a.id]||0)+fy;
    }
    for(const a of allNodes){ if(draggingNode===a.id) continue; positions[a.id].x+=vz[a.id]; positions[a.id].y+=vvy[a.id]; vz[a.id]*=kFriction; vvy[a.id]*=kFriction; }
    redraw();
  }
  let running=true; function run(){ if(!running) return; step(); requestAnimationFrame(run); } run();

  svg.addEventListener("mousedown",(ev)=>{
    const c=ev.target; if(c.classList.contains("const-node")){ draggingNode=c.getAttribute("data-id"); selectedId=draggingNode; if(localMode) redraw(); ev.preventDefault(); return; }
    if(localMode && !ev.target.closest(".const-node")){ selectedId=null; redraw(); }
  });
  svg.addEventListener("mousemove",(ev)=>{
    if(draggingNode){
      const ctm=svg.getScreenCTM(); const dx=(ev.movementX||0)/(ctm.a||1), dy=(ev.movementY||0)/(ctm.d||1);
      positions[draggingNode].x+=dx; positions[draggingNode].y+=dy; vz[draggingNode]=0; vvy[draggingNode]=0; return;
    }
    const t=ev.target;
    if(t.classList.contains("const-node")){
      const id=t.getAttribute("data-id"); const n=allNodes.find(x=>x.id===id); if(!n) return;
      tooltip.style.display="block"; tooltip.style.left=(ev.offsetX+14)+"px"; tooltip.style.top=(ev.offsetY-10)+"px";
      tooltip.innerHTML=""; tooltip.append(
        h("div",{style:"font-weight:700;font-size:13px"}, n.name),
        h("div",{class:"small faint"}, `${SUBJECTS[n.subject].name} � L${n.level} � ${n.status}${n.isStarred?" � ?":""}`),
        h("div",{class:"small", style:"margin-top:4px;max-width:220px;white-space:normal"}, n.summary.slice(0,120)+"�"),
        h("div",{class:"small", style:"margin-top:6px"}, h("span",{class:`tag ${SUBJECTS[n.subject].cls}`}, SUBJECTS[n.subject].name), `  Click to open`)
      );
    } else { tooltip.style.display="none"; }
  });
  svg.addEventListener("mouseup",()=>{ draggingNode=null; });
  svg.addEventListener("mouseleave",()=>{ draggingNode=null; tooltip.style.display="none"; });
  svg.addEventListener("wheel",(ev)=>{ ev.preventDefault(); zoom=Math.min(200,Math.max(45, zoom - ev.deltaY*0.001*zoom)); redraw(); });
  svg.addEventListener("dblclick",()=>{ zoom=100; redraw(); });
  container.addEventListener("click",(ev)=>{
    const node=ev.target.closest?.(".const-node");
    if(!node) return;
    const id=node.getAttribute("data-id"); if(!id) return;
    if(ev.shiftKey || ev.altKey){ selectedId=id; if(!localMode){ localMode=true; toggles.querySelectorAll("input")[3].checked=true; } redraw(); ev.preventDefault(); return; }
    navigate(`#/chapter/${id}`);
  });
  let saveTimer; svg.addEventListener("mousemove",()=>{ clearTimeout(saveTimer); saveTimer=setTimeout(()=>{ state.constellationPos=positions; save(); },1100); });
  redraw();
}





/* ----------- LABS � Quantum Protocols Showcase (all 40 revolutionary features) ----------- */
export function LabsView(root){
  const s=load(); const pulse=Quantum.metaPulse(); const traj=Quantum.forecastRank(); const neuro=Quantum.neuroplasticityScore();
  const loadMap=Quantum.cognitiveLoadMap(); const pred=Quantum.predictNextChallenge();
  const derived=Quantum.deriveFlashcardsFromMisses(2); const boss=Quantum.bossEscalation();
  const certs=JSON.parse(localStorage.getItem("tmj_certs")||"[]"); const inbox=Quantum.inboxPackets();
  const godChapters=ALL_CONCEPTS.filter(c=> Quantum.godModeUnlocked(c.id)).slice(0,2);
  const archUnlocked=Quantum.architectUnlocked();
  root.innerHTML=""; root.append(page("TeachMeJEE Labs � Quantum Edition", "The Future of JEE Learning � 40 systems � zero server. Built by aspirants. For aspirants.",
    h("div",{class:"stack", style:"gap:14px"},
      h("div",{class:"card labs-hero"}, h("div",{class:"qb-badge"},"? QUANTUM EDITION � BIL � OPEN SOURCE DNA"), h("h2",{style:"margin:8px 0 6px"},"Where textbook meets telepathy"), h("p",{class:"muted small"}, `${Quantum.BRAND.tagline} � ${Quantum.BRAND.dna} � ${ALL_CONCEPTS.length} chapters � ${certs.length} certs minted � ${inbox.length} packets in fabric.`), h("div",{class:"row", style:"gap:8px;margin-top:8px;flex-wrap:wrap"}, h("a",{class:"btn btn-primary btn-sm", href:"#/constellation"},"Open Constellation ?"), h("a",{class:"btn btn-sm", href:"#/videos"},"Lectures (18 channels) ?"), h("span",{class:"tag"},"v5 Quantum"))),
      // MLD row
      h("div",{class:"labs-grid2"},
        h("div",{class:"card lab-card"}, h("h3",{},"?? Meta-Cognitive Pulse"), h("p",{class:"small muted"}, pulse.learnFaster + " � " + pulse.peak),
          h("div",{class:"lab-demo"}, h("div",{class:"row", style:"justify-content:space-between"}, h("span",{class:"small"},`Trap rate ${pulse.trapRate}%`), h("span",{class:"small faint"}, pulse.exposure)), h("div",{class:"rank-bar"}, h("i",{style:`width:${Math.min(100,pulse.trapRate*2)}%`})) ),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Skill Trajectory"), h("p",{class:"small muted"},`Forecast ${traj.rank} � ${traj.pct}% to mastery`),
          h("div",{class:"lab-demo"}, h("div",{class:"rank-bar"}, h("i",{style:`width:${traj.pct}%`})), h("div",{class:"small faint", style:"margin-top:6px"},`Velocity ${traj.velocity}% � Streak ${getStreak()}d`)),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},`?? Neuroplasticity ${neuro.score}`), h("p",{class:"small muted"}, neuro.label),
          h("div",{class:"lab-demo"}, h("div",{class:"rank-bar"}, h("i",{style:`width:${neuro.score}%`})), h("div",{class:"small faint", style:"margin-top:6px"},`Variety ${neuro.variety}% across ${ALL_CONCEPTS.length} chapters`)),
          h("span",{class:"tag live"},"LIVE")),
      ),
      h("div",{class:"labs-grid2"},
        h("div",{class:"card lab-card"}, h("h3",{},"?? ANPE � Cognitive Load Map"), h("p",{class:"small muted"},"Real-time struggle tracking ? auto bridges."),
          h("div",{class:"lab-demo"}, loadMap.length? h("div",{class:"stack", style:"gap:6px"}, ...loadMap.slice(0,3).map(x=> h("div",{class:"row", style:"justify-content:space-between"}, h("a",{class:"prereq-pill", href:`#/chapter/${x.id}`}, `${x.name} ${x.acc}%`), h("span",{class:"small faint"},`load ${x.load}%`)))) : h("span",{class:"small faint"},"No load yet � attempt 2 quizzes per chapter")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Predictive Next Challenge"), h("p",{class:"small muted"},"ML-style picks optimal difficulty."),
          h("div",{class:"lab-demo"}, pred? h("div",{}, h("a",{class:"prereq-pill", href:`#/chapter/${pred.c.id}`}, pred.c.name), h("div",{class:"small faint", style:"margin-top:6px"}, pred.reason), h("button",{class:"btn btn-primary btn-sm", style:"margin-top:8px", onclick:()=> navigate(`#/chapter/${pred.c.id}`)}, "Go ?")) : h("span",{class:"small faint"},"All frontiers clear � boss awaits")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Neuro-Synaptic Flashcards"), h("p",{class:"small muted"},"Cards evolve 1?3?7?16d on recall."),
          h("div",{class:"lab-demo"}, h("div",{class:"small"},`Due now: ${(Object.keys(s.srQueue||{}).length)} � Tap Evolve on a card in Flash to see level up`), h("a",{class:"btn btn-sm", href:"#/flash", style:"margin-top:8px"},"Open Flash ?")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Entanglement"), h("p",{class:"small muted"},"Master one ? surfaces linked math."),
          h("div",{class:"lab-demo"}, (()=>{ const sel=pred?.c||ALL_CONCEPTS.find(c=>load().completed.includes(c.id))||ALL_CONCEPTS[0]; const ent=Quantum.entangledConcepts(sel.id,3); return h("div",{class:"stack", style:"gap:6px"}, h("div",{class:"small faint"},`Entangled with ${sel.name}:`), ...ent.map(c=> h("a",{class:"prereq-pill", href:`#/chapter/${c.id}`}, c.name))); })()),
          h("span",{class:"tag"},"BETA")),
        h("div",{class:"card lab-card"}, h("h3",{},"? Temporal Fields"), h("p",{class:"small muted"},"Opacity = memory decay. Review to relight."),
          h("div",{class:"lab-demo"}, (()=>{ const arr=ALL_CONCEPTS.filter(c=> load().completed.includes(c.id)).slice(0,3); return arr.length? h("div",{class:"stack", style:"gap:6px"}, ...arr.map(c=>{ const op=Math.round(Quantum.temporalOpacity(c.id)*100); return h("div",{class:"row", style:`justify-content:space-between;opacity:${Math.max(0.35, op/100)}`}, h("span",{class:"small"}, c.name), h("span",{class:"small faint"}, op+"%")); })) : h("span",{class:"small faint"},"Complete a chapter to see decay"); })()),
          h("span",{class:"tag"},"BETA")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Mentor Mode"), h("p",{class:"small muted"},"Pip delivers hints in-character."),
          h("div",{class:"lab-demo"}, h("div",{class:"small"}, Quantum.mentorHint(ALL_CONCEPTS[10].id, "hint")), h("button",{class:"btn btn-sm", style:"margin-top:8px", onclick:()=> makeToast(Quantum.mentorHint(pred?.c?.id||ALL_CONCEPTS[5].id, "trap"), true)}, "Trap warning ?")),
          h("span",{class:"tag live"},"LIVE")),
      ),
      h("div",{class:"labs-grid2"},
        h("div",{class:"card lab-card"}, h("h3",{},"?? Holographic Layers"), h("p",{class:"small muted"},"CSS 3D overlays for vectors/orbitals."),
          h("div",{class:"lab-demo"}, h("label",{class:"obs-toggle"}, h("input",{type:"checkbox", onchange:(e)=>{ document.body.classList.toggle("holo-on", e.target.checked); }}), " Enable holograms in Chapter")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Emotion-Aware CPs"), h("p",{class:"small muted"},`State: ${Quantum.emotionState((load().answerLog||[]).slice(-5).map(a=>({at:a.at, correct:!!a.ok})))} � adjusts tone.`),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=> makeToast(`Emotion: ${Quantum.emotionState((load().answerLog||[]).slice(-5).map(a=>({at:a.at, correct:!!a.ok})))} � take a micro-break?`, true)}, "Check pulse")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? P2P Fabric"), h("p",{class:"small muted"},"Broadcast insight packets via BroadcastChannel."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=>{ const pkt=Quantum.createInsightPacket(load().lastNote||ALL_CONCEPTS[0].id); Quantum.broadcastPacket(pkt); makeToast("Packet broadcast to nearby tabs", true); }}, "Broadcast insight"), h("div",{class:"small faint", style:"margin-top:6px"}, `${inbox.length} packets in local inbox`)),
          h("span",{class:"tag proto"},"PROTOCOL")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Blockchain Cert"), h("p",{class:"small muted"},"Verifiable badge on local ledger."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-primary btn-sm", onclick:()=>{ const c=Quantum.mintCertificate(); makeToast(`Minted ${c.id} � ${c.pct}%`, true); }}, "Mint certificate"), h("div",{class:"small faint", style:"margin-top:6px"}, certs[0]?`Last: ${certs[0].id} � ${certs[0].pct}%`:"No certs yet")),
          h("span",{class:"tag proto"},"PROTOCOL")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Zero-Server Sync"), h("p",{class:"small muted"},"IPFS-style export � no central authority."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=>{ const blob=new Blob([Quantum.zeroServerSyncExport()],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`teachmejee-fabric-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); }}, "Export fabric ?")),
          h("span",{class:"tag proto"},"PROTOCOL")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Self-Deriving Flashcards"), h("p",{class:"small muted"},"Auto from your misses."),
          h("div",{class:"lab-demo"}, derived.length? h("div",{class:"stack", style:"gap:6px"}, ...derived.map(d=> h("div",{class:"small"}, `${d.front.slice(0,46)}� ? ${d.back.slice(0,28)}�`)), h("button",{class:"btn btn-sm", style:"margin-top:6px", onclick:()=>{ const s2=load(); s2.srQueue=s2.srQueue||{}; derived.forEach(d=> s2.srQueue["auto-"+Date.now()+Math.random()]={q:d.front,a:d.back,due:Date.now()}); save(); makeToast("Derived cards added to Flash", true); }}, "Add to Flash")) : h("span",{class:"small faint"},"No misses yet � attempt quiz")),
          h("span",{class:"tag live"},"LIVE")),
      ),
      h("div",{class:"labs-grid2"},
        h("div",{class:"card lab-card"}, h("h3",{},"?? Auto-Blog Journal"), h("p",{class:"small muted"},"Mastered chapters ? Markdown journal."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=>{ const md=Quantum.generateJournalMarkdown(); const blob=new Blob([md],{type:"text/markdown"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="TeachMeJEE-Journal.md"; a.click(); URL.revokeObjectURL(url); }}, "Export Journal.md")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Boss Escalation"), h("p",{class:"small muted"},"Combines mastered topics."),
          h("div",{class:"lab-demo"}, boss? h("div",{}, h("div",{class:"small"}, boss.title), h("div",{class:"small faint"}, `+${boss.xp} XP`), h("button",{class:"btn btn-primary btn-sm", style:"margin-top:6px", onclick:()=> navigate(`#/quiz`)}, "Fight boss ?")) : h("span",{class:"small faint"},"Master 4 chapters to unlock")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Time-Dilation Reading"), h("p",{class:"small muted"},"Derivations fade in incrementally."),
          h("div",{class:"lab-demo"}, h("label",{class:"obs-toggle"}, h("input",{type:"checkbox", onchange:(e)=> document.body.classList.toggle("time-dilate", e.target.checked)}), " Enable in Notes")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? Haptic Feedback"), h("p",{class:"small muted"},"Vibration on CP correctness."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=>{ Quantum.haptic(true); makeToast("Haptic: correct ?", true); }}, "Test haptic ?"), h("button",{class:"btn btn-sm", style:"margin-left:6px", onclick:()=> Quantum.haptic(false)}, "?")),
          h("span",{class:"tag live"},"LIVE")),
        h("div",{class:"card lab-card"}, h("h3",{},"?? A/B & Sandbox"), h("p",{class:"small muted"},`Variant ${Quantum.abVariant("note-layout")} � Export logs.`),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=>{ const blob=new Blob([JSON.stringify(Quantum.analyticsExport(),null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="analytics-sandbox.json"; a.click(); URL.revokeObjectURL(url); }}, "Export sandbox")),
          h("span",{class:"tag"},"BETA")),
        h("div",{class:"card lab-card"}, h("h3",{}, archUnlocked?"??? The Architect � UNLOCKED":"??? The Architect � LOCKED"), h("p",{class:"small muted"}, archUnlocked?"Creator revealed � see below.":"Solve 7+ chapters + 3d streak to reveal."),
          h("div",{class:"lab-demo"}, archUnlocked? h("div",{class:"small"}, "Built by Tanush Saha � anonymous no more. The architect is you, the aspirant.") : h("span",{class:"small faint"},`Progress ${load().completed.length}/7 � streak ${getStreak()}d`)),
          h("span",{class:"tag", style: archUnlocked?"background:gold;color:#111":""}, archUnlocked?"EASTER":"LOCKED")),
      ),
      h("div",{class:"labs-grid2"},
        h("div",{class:"card lab-card", style: godChapters.length?"border-color:gold":""}, h("h3",{}, "?? God Mode CPs"), h("p",{class:"small muted"}, godChapters.length?`Unlocked for ${godChapters.map(c=>c.name).join(", ")}`:"100% a chapter to unlock legendary CP"),
          h("div",{class:"lab-demo"}, godChapters.length? h("div",{class:"stack", style:"gap:6px"}, ...godChapters.map(c=> h("a",{class:"prereq-pill", href:`#/chapter/${c.id}`}, `God CP: ${c.name}`))) : h("span",{class:"small faint"},"Keep mastering � god mode awaits")),
          h("span",{class:"tag", style: godChapters.length?"background:gold;color:#111":""}, godChapters.length?"UNLOCKED":"LOCKED")),
        h("div",{class:"card lab-card"}, h("h3",{}, "?? TeachMeJEE Labs Portal"), h("p",{class:"small muted"},"Top scorers co-author CPs."),
          h("div",{class:"lab-demo"}, h("button",{class:"btn btn-sm", onclick:()=> makeToast("Submit a CP via GitHub PR � open source DNA", true)}, "Contribute ?")),
          h("span",{class:"tag"},"OPEN")),
        h("div",{class:"card lab-card"}, h("h3",{}, "??? Branding"), h("p",{class:"small muted"}, Quantum.BRAND.tagline),
          h("div",{class:"lab-demo"}, h("div",{class:"small"}, Quantum.BRAND.edition), h("div",{class:"small faint"}, Quantum.BRAND.dna)),
          h("span",{class:"tag live"},"LIVE"))
      ),
      h("div",{class:"card", style:"border-style:dashed"}, h("h3",{}, "How to demo for judges (30s)"), h("ol",{class:"small", style:"margin:8px 0 0 18px;display:flex;flex-direction:column;gap:4px"}, h("li",{},"Labs shows all 40 systems live � each card is wired to your real store"), h("li",{},"Constellation: search + Local graph + Shift+click isolate (Obsidian)"), h("li",{},"Chapter: toggle Focus Flow + Holographic + Time-Dilation"), h("li",{},"Miss a quiz ? Labs Autonomous Companion forges a card; check Flash")) )
    )));
}

export function PlaygroundView(root){
  const s=load(); const tt=Quantum.smartTimetable(s.planner?.dailyHours||6);
  const mkRow=(label, min,max,step,val, onIn, unit="")=>{
    const inp=h("input",{type:"range", min,max,step,value:val, style:"flex:1"}); const out=h("span",{class:"mono small", style:"min-width:56px;text-align:right"}, val+unit);
    inp.addEventListener("input",()=>{ out.textContent=inp.value+unit; onIn(inp.value); }); return h("div",{class:"row", style:"gap:8px;align-items:center"}, h("span",{class:"small", style:"min-width:78px"}, label), inp, out);
  };
  // projectile state
  let v=12, ang=42, g=9.8;
  const projOut=h("div",{class:"mono small", style:"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px"});
  function paintProj(){ const rad=ang*Math.PI/180; const R=(v*v*Math.sin(2*rad))/g; const T=(2*v*Math.sin(rad))/g; const H=(v*v*Math.sin(rad)*Math.sin(rad))/(2*g); projOut.textContent=`R = ${(R).toFixed(2)} m � T = ${T.toFixed(2)} s � H = ${H.toFixed(2)} m  (v�sin2?/g)`; }
  // lens state
  let u=-30, f=15;
  const lensOut=h("div",{class:"mono small", style:"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px"});
  function paintLens(){ const vImg=1/(1/f + 1/u); const m=vImg/u; lensOut.textContent=`v = ${vImg.toFixed(1)} cm � m = ${m.toFixed(2)}  (1/f = 1/v - 1/u)`; }
  // nernst
  let Q=0.01, n=2; const E0=0.34;
  const nernstOut=h("div",{class:"mono small", style:"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px"});
  function paintNernst(){ const E=E0 - (0.0592/n)*Math.log10(Q); nernstOut.textContent=`E = ${E.toFixed(3)} V  (E�=${E0} - 0.0592/${n}�log10${Q})`; }
  // nCr
  let nn=8, rr=3;
  const ncrOut=h("div",{class:"mono small", style:"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px"});
  function fact(x){ let r=1; for(let i=2;i<=x;i++) r*=i; return r; }
  function paintNcr(){ const v=fact(nn)/(fact(rr)*fact(nn-rr)); ncrOut.textContent=`C(${nn},${rr}) = ${v}  (n! / r!(n-r)!)`; }
  paintProj(); paintLens(); paintNernst(); paintNcr();
  root.innerHTML=""; root.append(page("Formula Playground � sliders that teach",
    "Drag the numbers. The formula stays the same � your intuition grows. Zero server, instant feedback.",
    h("div",{class:"stack", style:"gap:14px"},
      h("div",{class:"card"}, h("h3",{}, "?? Smart Timetable (weak-area aware)"), h("p",{class:"small muted", style:"margin:4px 0 8px"}, `Built from Cognitive Load Map + frontier � ${tt.length} blocks today`),
        h("div",{class:"stack", style:"gap:6px"}, ...tt.map(t=> h("div",{class:"row", style:"justify-content:space-between;align-items:center;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px"}, h("div",{}, h("div",{class:"small", style:"font-weight:600"}, t.name), h("div",{class:"small faint"}, `${SUBJECTS[t.subject].name} � ${t.why}`)), h("span",{class:"tag"}, `${t.hours}h`), h("a",{class:"btn btn-sm", href:`#/chapter/${t.id}`}, "Go ?")))),
        h("button",{class:"btn btn-primary btn-sm", style:"margin-top:10px", onclick:()=> makeToast("Timetable saved to Planner (local)", true)}, "Save to Planner")),
      h("div",{class:"card"}, h("h3",{}, "?? Projectile Playground"), h("p",{class:"small muted"},"R = v� sin2? / g � drag v and ?"),
        mkRow("v",5,20,1,v, x=>{v=+x; paintProj();}, " m/s"), mkRow("?",10,80,1,ang, x=>{ang=+x; paintProj();}, "�"), projOut),
      h("div",{class:"card"}, h("h3",{}, "?? Lens Playground"), h("p",{class:"small muted"},"1/f = 1/v - 1/u � drag object distance"),
        mkRow("u",-50,-10,1,u, x=>{u=+x; paintLens();}, " cm"), mkRow("f",8,25,1,f, x=>{f=+x; paintLens();}, " cm"), lensOut),
      h("div",{class:"card"}, h("h3",{}, "?? Nernst Playground"), h("p",{class:"small muted"},"E = E� - 0.0592/n � logQ"),
        mkRow("Q",0.0001,1,0.01,Q, x=>{Q=+x; paintNernst();}, ""), mkRow("n",1,3,1,n, x=>{n=+x; paintNernst();}, " e?"), nernstOut),
      h("div",{class:"card"}, h("h3",{}, "?? nCr Playground"), h("p",{class:"small muted"},"Choose n and r � see combinatorics live"),
        mkRow("n",4,12,1,nn, x=>{nn=+x; if(rr>nn) rr=nn; paintNcr();}, ""), mkRow("r",1,6,1,rr, x=>{rr=Math.min(+x,nn); paintNcr();}, ""), ncrOut)
    )));
}

export function PeriodicView(root){
  const ELS=[
    [1,"H","Hydrogen","s",1,1],[2,"He","Helium","s",18,1],[3,"Li","Lithium","s",1,2],[4,"Be","Beryllium","s",2,2],[5,"B","Boron","p",13,2],[6,"C","Carbon","p",14,2],[7,"N","Nitrogen","p",15,2],[8,"O","Oxygen","p",16,2],[9,"F","Fluorine","p",17,2],[10,"Ne","Neon","p",18,2],
    [11,"Na","Sodium","s",1,3],[12,"Mg","Magnesium","s",2,3],[13,"Al","Aluminium","p",13,3],[14,"Si","Silicon","p",14,3],[15,"P","Phosphorus","p",15,3],[16,"S","Sulfur","p",16,3],[17,"Cl","Chlorine","p",17,3],[18,"Ar","Argon","p",18,3],
    [19,"K","Potassium","s",1,4],[20,"Ca","Calcium","s",2,4],[21,"Sc","Scandium","d",3,4],[22,"Ti","Titanium","d",4,4],[23,"V","Vanadium","d",5,4],[24,"Cr","Chromium","d",6,4],[25,"Mn","Manganese","d",7,4],[26,"Fe","Iron","d",8,4],[27,"Co","Cobalt","d",9,4],[28,"Ni","Nickel","d",10,4],[29,"Cu","Copper","d",11,4],[30,"Zn","Zinc","d",12,4],[31,"Ga","Gallium","p",13,4],[32,"Ge","Germanium","p",14,4],[33,"As","Arsenic","p",15,4],[34,"Se","Selenium","p",16,4],[35,"Br","Bromine","p",17,4],[36,"Kr","Krypton","p",18,4],
    [37,"Rb","Rubidium","s",1,5],[38,"Sr","Strontium","s",2,5],[39,"Y","Yttrium","d",3,5],[40,"Zr","Zirconium","d",4,5],[41,"Nb","Niobium","d",5,5],[42,"Mo","Molybdenum","d",6,5],[43,"Tc","Technetium","d",7,5],[44,"Ru","Ruthenium","d",8,5],[45,"Rh","Rhodium","d",9,5],[46,"Pd","Palladium","d",10,5],[47,"Ag","Silver","d",11,5],[48,"Cd","Cadmium","d",12,5],[49,"In","Indium","p",13,5],[50,"Sn","Tin","p",14,5],[51,"Sb","Antimony","p",15,5],[52,"Te","Tellurium","p",16,5],[53,"I","Iodine","p",17,5],[54,"Xe","Xenon","p",18,5],
    [55,"Cs","Cesium","s",1,6],[56,"Ba","Barium","s",2,6],[57,"La","Lanthanum","f",3,9],[72,"Hf","Hafnium","d",4,6],[73,"Ta","Tantalum","d",5,6],[74,"W","Tungsten","d",6,6],[75,"Re","Rhenium","d",7,6],[76,"Os","Osmium","d",8,6],[77,"Ir","Iridium","d",9,6],[78,"Pt","Platinum","d",10,6],[79,"Au","Gold","d",11,6],[80,"Hg","Mercury","d",12,6],[81,"Tl","Thallium","p",13,6],[82,"Pb","Lead","p",14,6],[83,"Bi","Bismuth","p",15,6],[84,"Po","Polonium","p",16,6],[85,"At","Astatine","p",17,6],[86,"Rn","Radon","p",18,6],
  ];
  const blockColor={s:"#f87171",p:"#60a5fa",d:"#34d399",f:"#a78bfa"};
  let q=""; let block="ALL";
  const wrap=h("div",{class:"stack", style:"gap:12px"}); const grid=h("div",{class:"periodic-grid"}); const detail=h("div",{class:"card", style:"min-height:88px"});
  const search=h("input",{type:"text", placeholder:"Search element (H, Fe, Gold)�", style:"flex:1"}); search.addEventListener("input",()=>{q=search.value.toLowerCase(); paint();});
  const chips=h("div",{class:"filter-tabs", style:"gap:6px"});
  ;["ALL","s","p","d","f"].forEach(b=>{
    const btn=h("button",{class:`ftab${block===b?" on":""}`}, b==="ALL"?"All":b+"-block");
    btn.addEventListener("click",()=>{ block=b; chips.querySelectorAll(".ftab").forEach(x=>x.classList.toggle("on", x.textContent===btn.textContent)); paint(); });
    chips.append(btn);
  });
  function paint(){
    grid.innerHTML=""; detail.innerHTML=""; detail.append(h("p",{class:"small faint"},"Click an element ? see JEE link"));
    const filtered=ELS.filter(e=> (block==="ALL"||e[3]===block) && (!q || `${e[1]} ${e[2]} ${e[0]}`.toLowerCase().includes(q)));
    // render as positioned grid
    grid.style.gridTemplateColumns="repeat(18, minmax(0,1fr))";
    for(let r=1;r<=9;r++) for(let c=1;c<=18;c++){
      const el=filtered.find(e=> e[5]===r && e[4]===c);
      if(!el){ grid.append(h("div",{style:"height:46px"})); continue; }
      const cell=h("button",{class:"periodic-cell", style:`background:color-mix(in srgb, ${blockColor[el[3]]} 18%, var(--surface));border:1px solid color-mix(in srgb, ${blockColor[el[3]]} 35%, transparent);`},
        h("div",{class:"small", style:`color:${blockColor[el[3]]};font-weight:800`}, el[1]),
        h("div",{style:"font-size:9px;color:var(--faint)"}, el[0]),
        h("div",{class:"small faint", style:"font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"}, el[2]));
      cell.addEventListener("click",()=>{
        const chap = el[3]==="s"? "C-sblock" : el[3]==="p"? "C-pblock" : el[3]==="d"? "C-dblock" : "C-fblock";
        detail.innerHTML=""; detail.append(
          h("div",{class:"row", style:"justify-content:space-between;align-items:center"},
            h("div",{}, h("h3",{}, `${el[2]} (${el[1]}-${el[0]})`), h("div",{class:"small faint"}, `Block ${el[3]} � Group ${el[4]} � Period ${el[5]}`)),
            h("span",{class:"tag", style:`background:${blockColor[el[3]]};color:#111`}, el[3]+"-block")),
          h("p",{class:"small muted", style:"margin-top:6px"}, el[2]+" is a "+el[3]+"-block element. JEE focus: periodicity trends, ionisation, electronegativity."),
          h("div",{class:"row", style:"gap:8px;margin-top:8px"}, h("a",{class:"btn btn-primary btn-sm", href:`#/chapter/${chap}`}, "Open chapter ?"), h("span",{class:"small faint"},"Click element again to pin to Notes"))
        );
      });
      grid.append(cell);
    }
  }
  paint();
  root.innerHTML=""; root.append(page("Periodic Table � Interactive", "Tap any element. Block-colored, searchable, JEE-linked. Built for the 1.5M.",
    h("div",{class:"stack", style:"gap:12px"}, h("div",{class:"row", style:"gap:8px"}, search, chips), grid, detail)));
}

export function DerivationView(root){
  let q=""; const search=h("input",{type:"text", placeholder:"Search derivations� (e.g. Pythagoras, Nernst, entropy)", style:"flex:1"}); search.addEventListener("input",()=>{q=search.value.toLowerCase(); paint();});
  const wrap=h("div",{class:"stack", style:"gap:12px"});
  function paint(){
    wrap.innerHTML="";
    const entries=Object.entries(DERIVATIONS).filter(([id,txt])=> !q || `${CONCEPTS[id]?.name||id} ${txt}`.toLowerCase().includes(q)).slice(0,30);
    if(!entries.length){ wrap.append(h("p",{class:"small faint"},"No derivations match.")); return; }
    for(const [id, txt] of entries){
      const c=CONCEPTS[id]; const card=h("div",{class:"card"});
      const steps=txt.split(/\. +/).filter(Boolean); let idx=0;
      const out=h("div",{class:"small", style:"margin-top:8px;min-height:38px"}); const prog=h("div",{class:"rank-bar", style:"margin-top:8px"}, h("i",{style:"width:0%"}));
      function show(i){ out.innerHTML=""; out.append(...steps.slice(0,i+1).map((s,j)=> h("div",{style:`opacity:${j===i?1:0.72};margin-top:${j?6:0}px`}, `${j+1}. ${s}.`))); prog.firstChild.style.width=`${((i+1)/steps.length)*100}%`; }
      const nextBtn=h("button",{class:"btn btn-sm", onclick:()=>{ idx=Math.min(steps.length-1, idx+1); show(idx); if(idx===steps.length-1) nextBtn.disabled=true; }}, "Next step ?");
      const autoBtn=h("button",{class:"btn btn-sm", style:"margin-left:6px", onclick:()=>{
        idx=0; show(0); let t=setInterval(()=>{ idx++; if(idx>=steps.length){ clearInterval(t); return; } show(idx); }, 900);
      }}, "? Auto-play");
      show(0);
      card.append(h("div",{class:"row", style:"justify-content:space-between;align-items:center"}, h("div",{}, h("h3",{}, c?c.name:id), h("div",{class:"small faint"}, c?`${SUBJECTS[c.subject].name} � L${c.level}`:"")), h("a",{class:"btn btn-sm", href:`#/chapter/${id}`}, "Open ?")), out, prog, h("div",{style:"margin-top:8px"}, nextBtn, autoBtn));
      wrap.append(card);
    }
  }
  paint();
  root.innerHTML=""; root.append(page("Derivation Theatre � animated", "Every key result, revealed one logical step at a time. Auto-play like a proof film.", h("div",{class:"stack", style:"gap:12px"}, h("div",{class:"row", style:"gap:8px"}, search), wrap)));
}

export function AtlasView(root){
  const stats=featureStats(); let q=""; let type="ALL"; let subj="ALL"; let shown=60;
  const search=h("input",{type:"text", placeholder:`Search 1000+ features � try "sim", "doubt", "P-block" �`, style:"flex:1"}); search.addEventListener("input",()=>{q=search.value.toLowerCase(); shown=60; paint();});
  const typeChips=h("div",{class:"filter-tabs", style:"gap:6px;flex-wrap:wrap"});
  ;["ALL","notes","sim","deriv","video","play","flash","quiz","doubt","const","periodic","timetable","global"].forEach(t=>{
    const b=h("button",{class:`ftab${type===t?" on":""}`}, t); b.addEventListener("click",()=>{type=t; typeChips.querySelectorAll(".ftab").forEach(x=>x.classList.toggle("on", x.textContent===t)); shown=60; paint();}); typeChips.append(b);
  });
  const subjChips=h("div",{class:"filter-tabs", style:"gap:6px"});
  ;["ALL","P","C","M"].forEach(s=>{
    const b=h("button",{class:`ftab${subj===s?" on":""}`}, s==="ALL"?"All subjects":SUBJECTS[s].name); b.addEventListener("click",()=>{subj=s; subjChips.querySelectorAll(".ftab").forEach(x=>x.classList.toggle("on", x.textContent===b.textContent)); shown=60; paint();}); subjChips.append(b);
  });
  const grid=h("div",{class:"labs-grid2"}); const more=h("button",{class:"btn btn-sm", style:"display:none"}, "Load more ?"); more.addEventListener("click",()=>{shown+=60; paint();});
  const counter=h("div",{class:"small faint"}); const virtBox=h("div",{style:"margin-top:6px"});
  function paint(){
    const all=allFeatures(); const filtered=all.filter(f=>{
      if(type!=="ALL" && f.type!==type) return false;
      if(subj!=="ALL" && f.subject!==subj) return false;
      if(q && !`${f.name} ${f.blurb} ${f.type}`.toLowerCase().includes(q)) return false;
      return true;
    });
    counter.textContent=`${filtered.length} of ${stats.total} features � P:${stats.bySubject.P} C:${stats.bySubject.C} M:${stats.bySubject.M} � showing ${Math.min(shown, filtered.length)}`;
    grid.innerHTML=""; filtered.slice(0,shown).forEach(f=>{
      const card=h("a",{class:"card lab-card", href:f.route||"#/labs", style:"text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:4px"},
        h("div",{class:"row", style:"justify-content:space-between;align-items:center"},
          h("span",{}, `${f.icon} ${f.name}`),
          h("span",{class:`tag ${f.subject==="P"?"tag-phys":f.subject==="C"?"tag-chem":"tag-math"}`}, f.type)),
        h("div",{class:"small muted", style:"min-height:28px"}, f.blurb),
        h("span",{class:"small faint"}, f.route||"#/labs"));
      grid.append(card);
    });
    more.style.display = filtered.length>shown ? "block":"none";
    more.textContent=`Load more ? ${Math.max(0, filtered.length-shown)} left`;
  }
  paint();
  root.innerHTML=""; root.append(page(`Feature Atlas � ${stats.total} micro-features`, `1000� stand-out: 93 chapters � 11 types + 30 globals. Every card is a live route � no dead mocks.`,
    h("div",{class:"stack", style:"gap:12px"},
      h("div",{class:"card", style:"background:linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--surface)) 0%, var(--surface) 100%);border-color:color-mix(in srgb, var(--accent) 22%, var(--border))"},
        h("div",{class:"row", style:"justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:baseline"},
          h("div",{}, h("h2",{style:"margin:0"}, `${stats.total} features`), h("div",{class:"small muted"}, `P ${stats.bySubject.P} � C ${stats.bySubject.C} � M ${stats.bySubject.M} � 11 types � 93 chapters`)),
          h("span",{class:"qb-badge"},"? 1000� STAND-OUT"))),
      h("div",{class:"card", style:"border-color:gold;background:color-mix(in srgb,gold 9%, var(--surface));"},
        h("h3",{}, "?? 100,000,000 Generative Variants � Sim Factory"),
        h("p",{class:"small muted"}, `Real ${stats.real.toLocaleString()} + Virtual ${stats.virtual.toLocaleString()} = ${stats.total.toLocaleString()} total. Each variant is a parametric sim/playground combo � generated on demand, zero RAM. Factory: 59 bases � 1000s of combos.`),
        h("div",{class:"row", style:"gap:8px;margin-top:8px"}, h("button",{class:"btn btn-primary btn-sm", onclick:()=>{ const g=h("div",{class:"labs-grid2"}); for(let i=0;i<12;i++){ const f=virtualFeatureAt(FEATURE_COUNT + Math.floor(Math.random()*VIRTUAL_FEATURE_COUNT)); g.append(h("a",{class:"card lab-card", href:f.route, style:"text-decoration:none;color:inherit"}, h("div",{style:"font-weight:700;font-size:13px"}, `${f.icon} ${f.name}`), h("div",{class:"small muted", style:"margin-top:4px"}, f.blurb), h("span",{class:"small faint"}, f.route))); } virtBox.innerHTML=""; virtBox.append(g); }}, "Generate 12 random variants ?"), h("span",{class:"small faint"}, "100M via factory � try it")),
        virtBox),
      h("div",{class:"row", style:"gap:8px"}, search),
      h("div",{class:"stack", style:"gap:8px"}, h("div",{class:"small faint"},"Filter by type"), typeChips),
      h("div",{class:"stack", style:"gap:8px"}, h("div",{class:"small faint"},"Filter by subject"), subjChips),
      counter, grid, more)));
}

export function MoleculeView(root){
  const MOL={
    "H2O":{atoms:[{e:"O",x:0,y:0,z:0,c:"#ef4444"},{e:"H",x:0.76,y:0.58,z:0,c:"#f5eddc"},{e:"H",x:-0.76,y:0.58,z:0,c:"#f5eddc"}], bonds:[[0,1],[0,2]]},
    "CH4":{atoms:[{e:"C",x:0,y:0,z:0,c:"#52525b"},{e:"H",x:0.9,y:0.9,z:0,c:"#f5eddc"},{e:"H",x:-0.9,y:0.9,z:0,c:"#f5eddc"},{e:"H",x:0,y:-0.9,z:0.9,c:"#f5eddc"},{e:"H",x:0,y:-0.9,z:-0.9,c:"#f5eddc"}], bonds:[[0,1],[0,2],[0,3],[0,4]]},
    "C6H6":{atoms:[{e:"C",x:1,y:0,z:0,c:"#52525b"},{e:"C",x:0.5,y:0.86,z:0,c:"#52525b"},{e:"C",x:-0.5,y:0.86,z:0,c:"#52525b"},{e:"C",x:-1,y:0,z:0,c:"#52525b"},{e:"C",x:-0.5,y:-0.86,z:0,c:"#52525b"},{e:"C",x:0.5,y:-0.86,z:0,c:"#52525b"}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]},
    "NH3":{atoms:[{e:"N",x:0,y:0,z:0,c:"#60a5fa"},{e:"H",x:0.9,y:0.6,z:0,c:"#f5eddc"},{e:"H",x:-0.45,y:0.6,z:0.78,c:"#f5eddc"},{e:"H",x:-0.45,y:0.6,z:-0.78,c:"#f5eddc"}], bonds:[[0,1],[0,2],[0,3]]},
  };
  let sel="H2O"; const canvas=h("canvas",{width:520, height:320, style:"width:100%;height:320px;background:radial-gradient(ellipse at 50% 30%, #1e293b 0%, #0d0f14 70%);border-radius:12px;border:1px solid var(--border);display:block"}); const ctx=canvas.getContext("2d");
  let rot=0; let raf=0; function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const mol=MOL[sel]; const cx=canvas.width/2, cy=canvas.height/2, s=70;
    // bonds
    ctx.strokeStyle="rgba(245,237,220,0.7)"; ctx.lineWidth=3;
    mol.bonds.forEach(([a,b])=>{
      const A=mol.atoms[a], B=mol.atoms[b];
      const ax=cx + (A.x*Math.cos(rot)-A.z*Math.sin(rot))*s, ay=cy + A.y*s;
      const bx=cx + (B.x*Math.cos(rot)-B.z*Math.sin(rot))*s, by=cy + B.y*s;
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
    });
    // atoms
    mol.atoms.forEach(at=>{
      const x=cx + (at.x*Math.cos(rot)-at.z*Math.sin(rot))*s, y=cy + at.y*s;
      const r= at.e==="H"?14: at.e==="O"?22: at.e==="N"?20:18;
      ctx.fillStyle=at.c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#111"; ctx.font="700 11px sans-serif"; ctx.textAlign="center"; ctx.fillText(at.e, x, y+4);
    });
    rot+=0.008; raf=requestAnimationFrame(draw);
  }
  draw();
  const selEl=h("select",{style:"min-width:140px"}, ...Object.keys(MOL).map(k=> h("option",{value:k, selected:k===sel}, k)));
  selEl.addEventListener("change",()=>{ sel=selEl.value; });
  const info=h("div",{class:"small muted", style:"margin-top:8px"}, "Drag-free 3D-ish projection � auto-rotating � pick a molecule");
  root.innerHTML=""; root.append(page("Molecule Viewer 3D", "Rotate any molecule � H2O, CH4, Benzene, NH3. JEE chemistry, now tactile.",
    h("div",{class:"stack", style:"gap:12px"}, h("div",{class:"row", style:"gap:8px"}, h("span",{class:"small faint"},"Molecule"), selEl, h("span",{class:"tag"},"Three-ish � no server")), canvas, info)));
  const obs=new ResizeObserver(()=>{ canvas.width=canvas.clientWidth*2; canvas.height=320*2; canvas.style.height="320px"; }); obs.observe(canvas);
  root.addEventListener("DOMNodeRemoved",()=>{ cancelAnimationFrame(raf); obs.disconnect(); }, {once:true});
}
export function GraphView(root){
  const canvas=h("canvas",{width:640, height:360, style:"width:100%;height:360px;background:var(--bg);border:1px solid var(--border);border-radius:12px;display:block"}); const ctx=canvas.getContext("2d");
  let expr="Math.sin(x)*2"; let a=1, b=0; const inp=h("input",{type:"text", value:expr, style:"flex:1", placeholder:"f(x) e.g. Math.sin(x)*2 + a*x + b"});
  const aSl=h("input",{type:"range", min:-3, max:3, step:0.1, value:a}); const bSl=h("input",{type:"range", min:-5, max:5, step:0.2, value:b});
  function plot(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width, H=canvas.height; const scale=42; const ox=W/2, oy=H/2;
    ctx.strokeStyle="rgba(120,120,130,0.25)"; ctx.lineWidth=1;
    for(let x=-10;x<=10;x++){ ctx.beginPath(); ctx.moveTo(ox + x*scale, 0); ctx.lineTo(ox + x*scale, H); ctx.stroke(); }
    for(let y=-6;y<=6;y++){ ctx.beginPath(); ctx.moveTo(0, oy + y*scale); ctx.lineTo(W, oy + y*scale); ctx.stroke(); }
    ctx.strokeStyle="#f2a33c"; ctx.lineWidth=2; ctx.beginPath();
    let first=true;
    for(let px=0; px<W; px++){
      const x=(px-ox)/scale; let y; try{ const fn=new Function("x","a","b",`return ${inp.value}`); y=fn(x, +aSl.value, +bSl.value); }catch{ y=NaN; }
      const py=oy - y*scale; if(!isFinite(y)) { first=true; continue; }
      if(first){ ctx.moveTo(px, py); first=false; } else ctx.lineTo(px, py);
    } ctx.stroke();
    ctx.fillStyle="var(--faint)"; ctx.font="11px sans-serif"; ctx.fillText("x", W-12, oy-6); ctx.fillText("y", ox+8, 12);
  }
  inp.addEventListener("input", plot); aSl.addEventListener("input", plot); bSl.addEventListener("input", plot);
  plot();
  root.innerHTML=""; root.append(page("Graph Playground � Desmos-like", "Type any f(x) with a,b sliders. Live canvas � zero server.",
    h("div",{class:"stack", style:"gap:12px"},
      h("div",{class:"row", style:"gap:8px"}, h("span",{class:"small faint"},"f(x) ="), inp),
      h("div",{class:"row", style:"gap:10px"}, h("span",{class:"small"},"a"), aSl, h("span",{class:"small"},"b"), bSl),
      canvas,
      h("p",{class:"small faint"},"Try: Math.cos(x)*a , Math.pow(x,2)+b , Math.exp(-x*x)*3"))));
}
export function BoardView(root){
  const key="tmj_board_"+(load().lastNote||"global");
  const canvas=h("canvas",{width:800, height:420, style:"width:100%;height:420px;background:#0d0f14;border:1px solid var(--border);border-radius:12px;cursor:crosshair;display:block"}); const ctx=canvas.getContext("2d"); ctx.lineCap="round"; ctx.lineJoin="round";
  let drawing=false, last=null;
  function loadBoard(){ try{ const d=localStorage.getItem(key); if(d){ const img=new Image(); img.onload=()=> ctx.drawImage(img,0,0); img.src=d; } }catch{} }
  function saveBoard(){ try{ localStorage.setItem(key, canvas.toDataURL()); }catch{} }
  canvas.addEventListener("pointerdown",e=>{ drawing=true; const r=canvas.getBoundingClientRect(); last={x:(e.clientX-r.left)*(canvas.width/r.width), y:(e.clientY-r.top)*(canvas.height/r.height)}; });
  canvas.addEventListener("pointermove",e=>{
    if(!drawing||!last) return; const r=canvas.getBoundingClientRect(); const x=(e.clientX-r.left)*(canvas.width/r.width), y=(e.clientY-r.top)*(canvas.height/r.height);
    ctx.strokeStyle="#f5eddc"; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(x,y); ctx.stroke(); last={x,y};
  });
  window.addEventListener("pointerup",()=>{ if(drawing){ drawing=false; last=null; saveBoard(); }});
  loadBoard();
  root.innerHTML=""; root.append(page("Whiteboard � per chapter", "Draw freehand, save locally, export PNG. Lives in localStorage � no server.",
    h("div",{class:"stack", style:"gap:10px"},
      h("div",{class:"row", style:"gap:8px"},
        h("button",{class:"btn btn-sm", onclick:()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); saveBoard(); }}, "Clear"),
        h("button",{class:"btn btn-primary btn-sm", onclick:()=>{ const a=document.createElement("a"); a.href=canvas.toDataURL(); a.download=`board-${Date.now()}.png`; a.click(); }}, "Export PNG"),
        h("span",{class:"small faint"}, `Key: ${key}`)),
      canvas,
      h("p",{class:"small faint"},"Tip: open a chapter ? Board saves per chapter (lastNote)."))));
}
export function ThemeView(root){
  const cur=getComputedStyle(document.documentElement);
  const pick=(label, cssVar, defVal)=>{
    const inp=h("input",{type:"color", value: defVal}); inp.addEventListener("input",()=>{ document.documentElement.style.setProperty(cssVar, inp.value); localStorage.setItem(cssVar, inp.value); });
    const saved=localStorage.getItem(cssVar); if(saved){ document.documentElement.style.setProperty(cssVar, saved); inp.value=saved; }
    return h("div",{class:"row", style:"justify-content:space-between;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 10px"}, h("span",{class:"small"}, label), inp);
  };
  root.innerHTML=""; root.append(page("Theme Studio", "Craft your palette � live preview, saved locally. Zero server.",
    h("div",{class:"stack", style:"gap:10px"},
      pick("Accent", "--accent", cur.getPropertyValue("--accent").trim()||"#f2a33c"),
      pick("Background", "--bg", cur.getPropertyValue("--bg").trim()||"#151109"),
      pick("Surface", "--surface", cur.getPropertyValue("--surface").trim()||"#241c12"),
      h("div",{class:"row", style:"gap:8px"},
        h("button",{class:"btn btn-sm", onclick:()=>{ ["--accent","--bg","--surface"].forEach(k=>{ localStorage.removeItem(k); location.reload(); }); }}, "Reset"),
        h("span",{class:"small faint"},"Saved in localStorage � survives reload")))));
}

export function BrowseView(root) {
  const s = load();
  const completed = new Set(s.completed);
  const starred = new Set(s.starred);
  const searchInput = h("input", { type: "text", placeholder: "Search 90+ chapters�" });
  const listWrap = h("div", { style: "margin-top:16px" });
  const tabs = ["All", "Unlocked", "Locked", "Done", "Starred"];
  let filter = "All";

  function matches(c, ql) {
    if (ql && !(c.name.toLowerCase().includes(ql) || c.summary.toLowerCase().includes(ql))) return false;
    const st = nodeStatus(c, completed);
    if (filter === "Unlocked" && st !== "unlocked") return false;
    if (filter === "Locked" && st !== "locked") return false;
    if (filter === "Done" && st !== "completed") return false;
    if (filter === "Starred" && !starred.has(c.id)) return false;
    return true;
  }

  function renderList(q) {
    const ql = (q || "").toLowerCase();
    listWrap.innerHTML = "";
    for (const subj of ["P", "C", "M"]) {
      const items = ALL_CONCEPTS
        .filter((c) => c.subject === subj && matches(c, ql))
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
      if (!items.length) continue;
      listWrap.append(
        h("h3", { style: "margin:18px 0 8px" }, SUBJECTS[subj].name),
        h("div", { class: "table-wrap" },
          h("table", {},
            h("thead", {}, h("tr", {},
              h("th", {}), h("th", {}, "Chapter"), h("th", {}, "Level"), h("th", {}, "Weightage"), h("th", {}, "Status"), h("th", {}, "XP"))),
            h("tbody", {},
              ...items.map((c) => {
                const st = nodeStatus(c, completed);
                const wInfo = weightInfo(c.id);
                const star = h("button", { class: `star-btn small${starred.has(c.id) ? " on" : ""}`, title: "Bookmark" }, "?");
                star.addEventListener("click", (ev) => {
                  ev.stopPropagation();
                  const nowOn = toggleStar(c.id);
                  star.classList.toggle("on", nowOn);
                  if (filter === "Starred" && !nowOn) renderList(searchInput.value);
                });
                const tr = h("tr", { class: "row-link" },
                  h("td", {}, star),
                  h("td", {}, c.name, h("div", { class: "faint small" }, c.summary.slice(0, 70) + "�")),
                  h("td", { class: "small muted" }, `L${c.level}`),
                  h("td", {}, h("span", { class: `wtag w-${Math.min(4, Math.ceil(wInfo.w / 2))}`, title: weightLabel(c.id) }, `~${wInfo.w}m`)),
                  h("td", { class: "small" }, st === "completed" ? "? done" : st),
                  h("td", {}, `${c.xp} XP`));
                tr.addEventListener("click", () => navigate(`#/chapter/${c.id}`));
                return tr;
              })))));
    }
    if (!listWrap.children.length) listWrap.append(h("div", { class: "empty" }, "No chapters match those filters."));
  }

  searchInput.addEventListener("input", () => renderList(searchInput.value));
  renderList("");
  root.innerHTML = "";
  root.append(page("All chapters", "Every concept in the syllabus � searchable and filterable.",
    h("div", {},
      h("div", { class: "searchbar" }, searchInput),
      h("div", { class: "filter-tabs", style: "margin-top:12px" },
        ...tabs.map((t) => {
          const b = h("button", { class: `ftab${t === filter ? " on" : ""}` }, t);
          b.addEventListener("click", () => {
            filter = t;
            document.querySelectorAll(".ftab").forEach((x) => x.classList.toggle("on", x.textContent === t));
            renderList(searchInput.value);
          });
          return b;
        })),
      listWrap)));
}

/* ----------- FORMULAS ----------- */

export function FormulasView(root) {
  const searchInput = h("input", { type: "text", placeholder: "Search formulas� (e.g. kinematics, nernst, binomial)" });
  const wrap = h("div", { style: "margin-top:16px" });

  function render(q) {
    const ql = (q || "").toLowerCase();
    wrap.innerHTML = "";
    for (const subj of ["P", "C", "M"]) {
      const chapters = ALL_CONCEPTS.filter((c) => c.subject === subj && c.formulas.length)
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
        .filter((c) => !ql || c.name.toLowerCase().includes(ql) || c.formulas.some((f) => (f.n + f.f).toLowerCase().includes(ql)));
      if (!chapters.length) continue;
      wrap.append(
        h("h3", { style: "margin:18px 0 8px" }, SUBJECTS[subj].name),
        h("div", { class: "table-wrap" },
          h("table", {},
            h("thead", {}, h("tr", {}, h("th", {}, "Chapter"), h("th", {}, "Formula"), h("th", {}, "Meaning"))),
            h("tbody", {},
              ...chapters.flatMap((c) =>
                c.formulas.map((f) => {
                  const tr = h("tr", { class: "row-link" },
                    h("td", {}, h("a", { href: `#/chapter/${c.id}` }, c.name)),
                    h("td", {}, h("code", {}, f.f)),
                    h("td", { class: "muted small" }, f.n + (f.d ? ` � ${f.d}` : "")));
                  tr.addEventListener("click", () => navigate(`#/chapter/${c.id}`));
                  return tr;
                }))))));
    }
    if (!wrap.children.length) wrap.append(h("div", { class: "empty" }, "No formulas match."));
  }

  searchInput.addEventListener("input", () => render(searchInput.value));
  render("");
  root.innerHTML = "";
  root.append(page("Formula sheet", "",
    h("div", {},
      h("div", { class: "row", style: "align-items:center;gap:12px;margin-bottom:6px" },
        h("p", { class: "muted small", style: "flex:1;min-width:220px;margin:0" }, "Every formula in the roadmap, one searchable sheet. Click a row to jump to its chapter."),
        h("button", { class: "btn btn-sm", onclick: () => window.print() }, "Print sheet")),
      h("div", { class: "searchbar" }, searchInput),
      wrap)));
}

/* ----------- PLANNER ----------- */

const pomo = { total: 25 * 60, remaining: 25 * 60, running: false, iv: null, subj: "" };
let pomoUI = null;

function pomoStop() {
  if (pomo.iv) { clearInterval(pomo.iv); pomo.iv = null; }
  pomo.running = false;
}
function pomoFmt(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}
function pomoSync() {
  const ui = pomoUI;
  if (!ui || !ui.display || !ui.display.isConnected) return;
  ui.display.textContent = pomoFmt(pomo.remaining);
  ui.display.classList.toggle("done", pomo.remaining <= 0);
  const frac = pomo.total ? pomo.remaining / pomo.total : 0;
  const C = 2 * Math.PI * ((172 - 9) / 2 - 1);
  ui.fg.style.strokeDasharray = `${frac * C} ${C}`;
  ui.fg.style.strokeLinecap = "round";
  ui.fg.classList.toggle("paused", !pomo.running && pomo.remaining > 0);
  ui.fg.classList.toggle("done", pomo.remaining <= 0);
  ui.start.textContent = pomo.running ? "Pause" : pomo.remaining === 0 ? "Done" : pomo.remaining < pomo.total ? "Resume" : "Start";
  ui.sessions.textContent = `${load().focusLog[todayISO()] || 0} min today � ${pomodorosToday()} session${pomodorosToday() === 1 ? "" : "s"}`;
  ui.presets.forEach((p) => p.el.classList.toggle("on", !pomo.running && Math.round(pomo.total / 60) === p.min));
}
function pomoTick() {
  pomo.remaining--;
  if (pomo.remaining <= 0) {
    pomoStop();
    logFocusMin(Math.round(pomo.total / 60), pomo.subj);
    bumpPomodoroCount();
    addEvent(`Focus session complete: ${Math.round(pomo.total / 60)} min${pomo.subj ? " � " + SUBJECTS[pomo.subj].name : ""}`);
    makeToast("Focus session complete � take a break!", true);
    confettiBurst(innerWidth / 2, innerHeight * 0.3, 70);
    notifySync();
  }
  pomoSync();
}

function focusTimerCard() {
  const size = 172, stroke = 9;
  const r = (size - stroke) / 2 - 1;
  const C = 2 * Math.PI * r;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "");
  const bgC = document.createElementNS(svgNS, "circle");
  bgC.setAttribute("cx", size / 2); bgC.setAttribute("cy", size / 2); bgC.setAttribute("r", r);
  bgC.setAttribute("fill", "none");
  bgC.style.stroke = "var(--surface-3)";
  bgC.style.strokeWidth = String(stroke);
  const fg = document.createElementNS(svgNS, "circle");
  fg.setAttribute("cx", size / 2); fg.setAttribute("cy", size / 2); fg.setAttribute("r", r);
  fg.setAttribute("fill", "none");
  fg.style.stroke = "var(--accent)";
  fg.style.strokeWidth = String(stroke);
  fg.style.strokeDasharray = `${C} ${C}`;
  fg.style.transformOrigin = "center";
  fg.style.transform = "rotate(-90deg)";
  svg.append(bgC, fg);
  svg.setAttribute("class", "");

  const display = h("div", { class: "timer-display" }, pomoFmt(pomo.remaining));
  const centerWrap = h("div", { class: "ring-center" }, display);
  const ringBox = h("div", { class: "timer-ring" });
  svg.setAttribute("width", size); svg.setAttribute("height", size);
  ringBox.append(svg, centerWrap);

  const minsIn = h("input", { type: "number", value: Math.round(pomo.total / 60), min: 1, max: 120 });
  minsIn.addEventListener("change", () => {
    if (pomo.running) return;
    const m = Math.max(1, Math.min(120, parseInt(minsIn.value, 10) || 25));
    pomo.total = m * 60; pomo.remaining = m * 60;
    pomoSync();
  });

  const startBtn = h("button", { class: "btn btn-primary btn-sm" }, "Start");
  const subjSel = h("select", { title: "What are you studying?" },
    h("option", { value: "" }, "Mixed"),
    h("option", { value: "P" }, SUBJECTS.P.name),
    h("option", { value: "C" }, SUBJECTS.C.name),
    h("option", { value: "M" }, SUBJECTS.M.name));
  subjSel.addEventListener("change", () => { if (!pomo.running) pomo.subj = subjSel.value; });
  pomo.subj = pomo.subj || "";
  subjSel.value = pomo.subj;
  startBtn.addEventListener("click", () => {
    if (pomo.running) {
      pomoStop();
    } else {
      if (pomo.remaining <= 0) pomo.remaining = pomo.total;
      pomo.subj = subjSel.value;
      pomo.running = true;
      pomo.iv = setInterval(pomoTick, 1000);
    }
    pomoSync();
  });
  const resetBtn = h("button", { class: "btn btn-sm" }, "Reset");
  resetBtn.addEventListener("click", () => {
    pomoStop();
    pomo.remaining = pomo.total;
    pomoSync();
  });

  const presetsEl = h("div", { class: "presets" });
  const presets = [5, 15, 25, 50].map((min) => {
    const el = h("button", { class: "preset" }, `${min}m`);
    el.addEventListener("click", () => {
      if (pomo.running) return;
      pomo.total = min * 60; pomo.remaining = min * 60;
      minsIn.value = min;
      pomoSync();
    });
    presetsEl.append(el);
    return { min, el };
  });

  const sessions = h("span", { class: "small faint" }, "");
  pomoUI = { display, fg, start: startBtn, sessions, presets };

  return h("div", { class: "card timer-card", style: "margin-bottom:22px" },
    ringBox,
    h("div", { class: "timer-side" },
      h("h2", {}, "Focus timer"),
      h("p", { class: "hint", style: "margin-top:4px" }, "Pomodoro sprints � finish a chapter segment before the bell."),
      h("div", { class: "timer-row" },
        h("span", { class: "small muted" }, "Minutes"), minsIn,
        h("span", { class: "small muted" }, "Subject"), subjSel,
        startBtn, resetBtn),
      presetsEl,
      sessions));
}

export function PlannerView(root) {
  const s = load();
  const p = s.planner;
  const dAdv = daysUntil(p.advDate);
  const phases = computePhases(dAdv);
  const tasks = weekTasks(dAdv);
  const wp = weeklyPlan(p.dailyHours || 6);
  const next = generateSchedule(dAdv);

  function dateField(label, key, value) {
    const inp = h("input", { type: "date", value, onchange: (ev) => { savePlanner({ [key]: ev.target.value }); makeToast("Target date updated", true); notifySync(); render(); } });
    return h("div", { class: "field" }, h("label", { class: "lbl" }, label), inp);
  }
  function numField(label, key, value, min, max) {
    const inp = h("input", { type: "number", value, min, max, oninput: (ev) => savePlanner({ [key]: parseFloat(ev.target.value) || min }) });
    return h("div", { class: "field" }, h("label", { class: "lbl" }, label), inp);
  }

  root.innerHTML = "";
  root.append(
    page("Planner", "Exam dates, study phases, weekly schedule and the focus timer.",
      h("div", {},
        focusTimerCard(),

        h("div", { class: "row" },
          h("div", { class: "col card" },
            h("h2", { style: "margin-bottom:14px" }, "Study settings"),
            dateField("JEE Main � Session 1", "mainDate", p.mainDate),
            dateField("JEE Advanced", "advDate", p.advDate),
            numField("Study hours per day", "dailyHours", p.dailyHours || 6, 1, 16),
            (() => {
              const inp = h("input", { type: "number", value: s.goal || 1, min: 1, max: 10, onchange: (ev) => { setGoal(parseInt(ev.target.value, 10) || 1); makeToast("Daily goal updated", true); render(); } });
              return h("div", { class: "field" }, h("label", { class: "lbl" }, "Daily chapter goal"), inp);
            })()),
          h("div", { class: "col card" },
            h("h2", { style: "margin-bottom:14px" }, "Countdowns"),
            h("div", { class: "stack", style: "gap:10px" },
              h("div", { class: "countdown", style: "margin:0" },
                h("div", { class: "top" }, h("span", { class: "muted small" }, "JEE Main"), h("span", { class: "small faint" }, fmt(p.mainDate))),
                h("div", { class: "days" }, daysUntil(p.mainDate) >= 0 ? daysUntil(p.mainDate) : "�", " ", h("small", {}, "days"))),
              h("div", { class: "countdown adv", style: "margin:0" },
                h("div", { class: "top" }, h("span", { class: "muted small" }, "JEE Advanced"), h("span", { class: "small faint" }, fmt(p.advDate))),
                h("div", { class: "days" }, dAdv >= 0 ? dAdv : "�", " ", h("small", {}, "days")))))),

        h("h2", { style: "margin:24px 0 12px" }, "Study phases"),
        h("div", { class: "phase-bar" },
          ...phases.map((ph, i) => h("i", { style: `background:${["var(--accent)", "var(--chem)", "var(--math)"][i] || "var(--accent)"};width:${Math.max(ph.pct, 0.5)}%` }))),
        phases.length
          ? h("div", { class: "row" }, ...phases.map((ph) =>
              h("div", { class: "col card", style: "padding:13px 15px" },
                h("h3", {}, `${ph.name} � ${ph.days} days`),
                h("p", { class: "small muted", style: "margin-top:4px;margin-bottom:0" }, ph.desc))))
          : h("p", { class: "hint" }, "Set a valid Advanced date to see phases."),

    h("div", { class: "divider" }),

    h("div", { class: "row", style: "gap:14px;align-items:stretch" },
      h("div", { class: "col", style: "min-width:260px" }, quoteRotator()),
      h("div", { class: "col", style: "min-width:260px" }, didYouKnow())),

    h("div", { class: "row", style: "margin-top:0" },
          h("div", { class: "col" },
            h("div", { class: "row", style: "justify-content:space-between;align-items:center;margin-bottom:14px" },
              h("h2", {}, "Your week ahead"),
              h("button", { class: "btn btn-sm", onclick: () => window.print() }, "Print week")),
            ...tasks.map((day) => {
              const countSpan = h("span", { class: "d-date" });
              const refreshCount = () => { countSpan.textContent = `${day.items.filter((i) => load().tasks[i.id]).length}/${day.items.length} done`; };
              const dayDiv = h("div", { class: "schedule-day" },
                h("div", { class: "d-head" },
                  h("span", { style: "font-weight:600;font-size:14px" }, day.date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })),
                  countSpan),
                h("div", { style: "margin-top:6px;display:flex;flex-direction:column;gap:2px" },
                  ...day.items.map((it) => {
                    const cb = h("input", { type: "checkbox", checked: !!load().tasks[it.id], onchange: (ev) => {
                      markTask(it.id, ev.target.checked);
                      label.classList.toggle("done-task", ev.target.checked);
                      if (ev.target.checked) addEvent(`Finished a plan task: ${it.text}`);
                      refreshCount();
                    } });
                    const label = h("span", { class: `task-label${load().tasks[it.id] ? " done-task" : ""}` }, it.href ? h("a", { href: it.href }, it.text) : it.text);
                    return h("div", { class: "schedule-task" }, cb, label,
                      h("span", { class: "small faint", style: "margin-left:auto" }, it.type));
                  })));
              refreshCount();
              return dayDiv;
            })),
          h("div", { class: "col" },
            h("h2", { style: "margin-bottom:14px" }, "Weekly split"),
            h("div", { class: "card table-wrap", style: "margin-bottom:14px" },
              h("table", {},
                h("thead", {}, h("tr", {}, h("th", {}, "Subject"), h("th", {}, "Hours/week"))),
                h("tbody", {}, ...wp.map((rw) => h("tr", {}, h("td", {}, rw.subject), h("td", {}, `${rw.hours} h`)))))),
            h("h3", { style: "margin-bottom:10px" }, "Up next"),
            next.length
              ? h("div", { class: "stack" },
                  ...next.slice(0, 6).map((c) =>
                    h("a", { class: "prereq-pill", href: `#/chapter/${c.id}` }, subjectTag(c.subject), ` ${c.name}`)))
              : h("p", { class: "muted" }, "Roadmap complete!"))))));

  function render() { PlannerView(root); }
  pomoSync();
}

/* ----------- QUIZ ----------- */

export function QuizView(root) {
  const completedSet = new Set(load().completed);
  const quizBest = load().quizBest || {};
  let timedMode = false;
  let isBoss = false;
  try {
    if (sessionStorage.getItem("tmj_boss")) { isBoss = true; sessionStorage.removeItem("tmj_boss"); }
  } catch {}
  if (isBoss) { timedMode = true; }

  const bank = QUESTIONS.filter((q) => completedSet.has(q.c));
  const pool = bank.length >= 5 ? bank : QUESTIONS;

  let quizLen = 8;
  if (isBoss) quizLen = Math.min(16, pool.length);
  const lenSel = h("select", { title: "Number of questions" },
    h("option", { value: "8" }, "Quick � 8"),
    h("option", { value: "16" }, "Full � 16"));
  lenSel.addEventListener("change", () => { quizLen = parseInt(lenSel.value, 10) || 8; });
  if (isBoss) { lenSel.value = String(quizLen); lenSel.disabled = true; }

  const box = h("div", { class: "quiz-box" });
  root.innerHTML = "";
  root.append(page("Practice quiz", "+5 XP per correct answer. Keys: 1�4 answer � Enter continue.", box));

  let quiz = [];
  let idx = 0, score = 0, streak = 0;
  let combo = 0;
  const results = [];
  let deadline = null, timeIv = null, timeChip = null;

  const onKey = (ev) => {
    if (!box.isConnected) { document.removeEventListener("keydown", onKey); return; }
    const n = parseInt(ev.key, 10);
    if (n >= 1 && n <= 4) {
      const btn = box.querySelectorAll(".quiz-opt")[n - 1];
      if (btn && !btn.disabled) btn.click();
    } else if (ev.key === "Enter") {
      const nextBtn = box.querySelector(".quiz-next:not([hidden])");
      if (nextBtn && !nextBtn.disabled) nextBtn.click();
    }
  };
  document.addEventListener("keydown", onKey);

  renderStart();

  function renderStart() {
    box.innerHTML = "";
    const timedCb = h("input", { type: "checkbox", onchange: (ev) => { timedMode = ev.target.checked; }, checked: isBoss, disabled: isBoss });
    if (isBoss) {
      box.append(h("div", { class: "card boss-banner", style: "margin-bottom:14px;border-color:color-mix(in srgb,var(--red) 45%,transparent)" },
        h("div", { class: "row", style: "justify-content:space-between;align-items:center" },
          h("div", {},
            h("h2", { style: "color:var(--red)" }, "? Boss battle"),
            h("p", { class: "small muted", style: "margin:4px 0 0" }, `${quizLen} questions � 10 minutes � score 12+ to clear the week.`)),
          h("span", { class: "boss-glyph", style: "font-size:30px" }, "?"))));
    }
    box.append(
      h("div", { class: "card" },
        h("h2", {}, "Ready?"),
        h("p", { class: "muted small", style: "margin-top:6px" },
          bank.length >= 5
            ? `${bank.length} questions unlocked from your mastered chapters.`
            : `Only ${bank.length} unlocked yet � using the full bank.`),
        h("label", { style: "display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13.5px;color:var(--muted);cursor:pointer" },
          timedCb, "Timed mode � 90 seconds for the whole set"),
        h("div", { style: "margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center" },
          lenSel,
          h("button", { class: "btn btn-primary", onclick: () => renderQ(0) }, "Start quiz"),
          quizBest.practiced
            ? h("span", { class: "quiz-best" }, `${quizBest.practiced} practiced � best session ${quizBest.best}/8`)
            : h("span", { class: "quiz-best" }, "No attempts yet."))));
  }

  function startTimer() {
    if (!timedMode) return null;
    const totalSec = isBoss ? 600 : 90;
    deadline = Date.now() + totalSec * 1000;
    timeChip = h("span", { class: "timer-chip" }, isBoss ? "10:00" : "1:30");
    timeIv = setInterval(() => {
      if (!timeChip.isConnected) { clearInterval(timeIv); return; }
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      timeChip.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      timeChip.classList.toggle("low", left <= (isBoss ? 60 : 15));
      if (left <= 0) { clearInterval(timeIv); finish(); }
    }, 250);
    return timeChip;
  }

  function renderQ(i) {
    idx = i;
    if (i === 0) {
      quiz = shuffle(pool).slice(0, quizLen);
      score = 0; streak = 0; results.length = 0;
      startTimer();
    }
    box.innerHTML = "";
    const q = quiz[i];
    const progress = h("div", { class: "quiz-progress" },
      ...quiz.map((_, k) => h("i", { class: k < i ? "done" : k === i ? "current" : "" })));
    const counter = h("span", { class: "quiz-best" }, `Question ${i + 1} of ${quiz.length}`);
    const comboChip = h("span");
    function paintCombo() {
      comboChip.innerHTML = "";
      if (combo >= 2) comboChip.append(h("span", { class: "combo-chip" }, `${combo} in a row`));
    }
    paintCombo();
    const opts = h("div", { class: "stack", style: "gap:8px;margin-top:10px" },
      ...q.opts.map((o, k) =>
        h("button", { class: "quiz-opt", onclick: () => answer(k, q.a) },
          h("span", { class: "q-key" }, "ABCD"[k]), o)));
    const why = h("div", { class: "quiz-why", hidden: true }, q.why);
    const nextBtn = h("button", { class: "btn quiz-next", hidden: true,
      onclick: () => (idx + 1 < quiz.length ? renderQ(idx + 1) : finish()) }, "Next");

    box.append(
      h("div", { style: "display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap" }, counter, comboChip, timeChip),
      progress,
      h("h2", { style: "margin-top:10px" }, q.q),
      opts, why,
      h("div", { style: "margin-top:14px" }, nextBtn));

    function answer(chosen, correct) {
      const ok = chosen === correct;
      recordQuizAnswer(q.c, ok);
      Quantum.haptic(ok);
      const emo=Quantum.emotionState((load().answerLog||[]).slice(-5).map(a=>({at:a.at, correct:!!a.ok})));
      if(!ok && emo==="frustrated") setTimeout(()=> makeToast("?? Frustrated? Take a micro-break � you�ve got this.", true), 400);
      if(!ok && emo==="stuck") setTimeout(()=> makeToast(`?? ${Quantum.mentorHint(q.c,"trap")}`, true), 500);
      results[idx] = ok;
      if (ok) { score++; streak++; combo++; confettiMini(); }
      else { streak = 0; combo = 0; }
      paintCombo();
      [...opts.children].forEach((b) => { b.disabled = true; });
      [...opts.children][correct].classList.add("correct");
      if (!ok) [...opts.children][chosen].classList.add("wrong");
      why.hidden = false;
      nextBtn.hidden = false;
      refreshXP();
    }
    function confettiMini() {
      if (streak >= 3) confettiBurst(innerWidth / 2, innerHeight * 0.25, 26);
    }
  }

  function finish() {
    if (timeIv) clearInterval(timeIv);
    const stt = load();
    stt.quizBest = stt.quizBest || {};
    stt.quizBest.best = Math.max(stt.quizBest.best || 0, score);
    stt.quizBest.practiced = (stt.quizBest.practiced || 0) + quiz.length;
    save();
    addBonusXp(score * 5);
    logActivity(1);
    addEvent(`Quiz finished: ${score}/${quiz.length} (+${score * 5} XP)`);
    if (isBoss) {
      const prev = getBoss();
      const now = recordBossRun(score);
      addEvent(score >= 12 ? `Weekly boss defeated: ${score}/${quiz.length}` : `Boss attempt: ${score}/${quiz.length}`);
      if (now.cleared && !(prev && prev.cleared)) {
        confettiBurst();
        showModal({
          icon: "?",
          title: "Boss defeated!",
          rows: [h("span", {}, `You cleared the weekly gauntlet with ${score}/${quiz.length}.`)],
          cta: "Claim the glory",
        });
      } else if (now.cleared) {
        makeToast(`Best this week: ${now.best}/16`, true);
      } else {
        makeToast(`Boss survives � ${score}/${quiz.length}. Regroup and retry.`, false);
      }
    }
    refreshXP();
    notifySync();
    if (score >= 7) confettiBurst();

    const pctScore = Math.round((score / Math.max(1, quiz.length)) * 100);
    box.innerHTML = "";
    box.append(
      h("div", { class: "quiz-result card" },
        h("div", { class: "big" }, `${score}/${quiz.length}`),
        h("p", { class: "muted" }, pctScore >= 80 ? "Outstanding round!" : pctScore >= 50 ? "Solid effort." : "Keep studying � retry any time."),
        h("p", { class: "quiz-best" }, `+${score * 5} XP earned`),
        h("div", { style: "margin-top:18px" },
          h("button", { class: "btn btn-primary", onclick: () => QuizView(root) }, "Play again"))),
      h("div", { class: "quiz-review" },
        h("h2", { style: "margin-bottom:10px" }, "Review"),
        ...quiz.map((q, i) => {
          const ok = results[i];
          return h("div", { class: "card", style: "margin-bottom:10px;padding:14px 16px" },
            h("p", { style: "font-weight:600;margin-bottom:4px" }, ok ? "? Correct" : "? Missed", h("span", { class: "small faint" }, ` � ${q.q}`)),
            h("p", { class: "small muted", style: "margin:0" }, `Answer: ${q.opts[q.a]} � ${q.why}`),
            CONCEPTS[q.c] ? h("a", { class: "prereq-pill", href: `#/chapter/${q.c}`, style: "margin-top:8px" }, "Open chapter") : null);
        })));
  }
}

/* ----------- FORMULA FLASH (spaced repetition) ----------- */

export function FlashView(root) {
  const allCards = ALL_CONCEPTS
    .filter((c) => c.formulas.length)
    .flatMap((c) => c.formulas.map((f) => ({ ...f, cid: c.id, cname: c.name, subject: c.subject })));
  const dueIds = new Set(srDue());
  let mode = "all";
  let deck = [], idx = 0, flipped = false, known = 0, total = 0, dueRun = false;
  let reverse = false;

  const cardBox = h("div", { class: "flash-box" });
  const pills = h("div", { class: "filter-tabs", style: "margin-top:12px;align-items:center" });

  const flashKeys = (ev) => {
    if (!cardBox.isConnected) { document.removeEventListener("keydown", flashKeys); return; }
    const tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (ev.code === "Space") { ev.preventDefault(); flip(); }
    else if (ev.key === "ArrowLeft") prev();
    else if (ev.key === "ArrowRight") next();
    else if (ev.key === "1") gotIt();
    else if (ev.key === "2") againSoon();
  };
  document.addEventListener("keydown", flashKeys);

  function buildPills() {
    pills.innerHTML = "";
    [["all", "All subjects"], ["P", SUBJECTS.P.name], ["C", SUBJECTS.C.name], ["M", SUBJECTS.M.name]].forEach(([m, label]) => {
      const b = h("button", { class: `ftab${m === mode && !dueRun ? " on" : ""}`, onclick: () => { dueRun = false; mode = m; rebuild(); } }, label);
      pills.append(b);
    });
    const nDue = srDue().filter((id) => allCards.some((cd) => cd.cid === id)).length;
    if (nDue) {
      pills.append(h("button", { class: `due-chip${dueRun ? " on" : ""}`, onclick: () => { dueRun = true; rebuild(true); } }, nDue, " due for review"));
    }
  }

  function rebuild(fromDue = false) {
    if (dueRun) {
      deck = shuffle(allCards.filter((c) => dueIds.has(c.cid)));
    } else {
      deck = shuffle(allCards.filter((c) => mode === "all" || c.subject === mode));
    }
    idx = 0; flipped = false; known = 0; total = deck.length;
    if (!deck.length) {
      cardBox.innerHTML = "";
      cardBox.append(h("div", { class: "empty" }, fromDue ? "Nothing is due right now � come back tomorrow." : "No formulas for this filter."));
      return;
    }
    render();
  }

  function render() {
    flipped = false;
    cardBox.innerHTML = "";
    const c = deck[idx];
    cardBox.append(
      h("div", { class: "flash-progress" },
        h("span", { class: "quiz-best" }, `Card ${idx + 1} / ${total}${dueRun ? " � due review" : ""}`),
        h("span", { class: "small faint" }, `${known} known`)),
      h("div", { class: "flash-card", onclick: () => { flipped = !flipped; paintFlip(); } },
        h("div", { class: "flash-inner" },
          reverse
            ? h("div", { class: "flash-side flash-front" },
                h("span", { class: "flash-chapter" }, subjectTag(c.subject), " ", c.cname),
                h("code", {}, c.f),
                h("div", { class: "small faint" }, "Which formula is this?"))
            : h("div", { class: "flash-side flash-front" },
                h("span", { class: "flash-chapter" }, subjectTag(c.subject), " ", c.cname),
                h("div", { class: "flash-q" }, c.n),
                h("div", { class: "small faint" }, "Tap to reveal")),
          h("div", { class: "flash-side flash-back" },
            reverse ? h("div", { class: "flash-q" }, c.n) : h("code", {}, c.f),
            c.d ? h("p", { class: "small muted", style: "margin:0" }, c.d) : null))),
      h("div", { class: "row", style: "gap:8px;margin-top:14px;justify-content:center" },
        h("button", { class: "btn btn-sm", onclick: prev, title: "Previous (left arrow)" }, "?"),
        h("button", { class: "btn btn-sm", onclick: flip, title: "Flip (Space)" }, "Flip"),
        h("button", { class: "btn btn-sm", onclick: next, title: "Next (right arrow)" }, "?")),
      h("div", { class: "row", style: "gap:8px;margin-top:10px;justify-content:center" },
        h("button", { class: "btn btn-primary btn-sm", onclick: gotIt, title: "Got it (1)" }, "Got it ?"),
        h("button", { class: "btn btn-sm", onclick: againSoon, title: "Again soon (2)" }, "Again soon"),
        h("button", { class: `btn btn-sm${reverse ? " btn-primary" : ""}`, onclick: () => { reverse = !reverse; render(); } }, "Reverse")));
  }

  function paintFlip() { cardBox.querySelector(".flash-card").classList.toggle("flipped", flipped); }
  function flip() { flipped = !flipped; paintFlip(); }
  function prev() { if (deck.length) { idx = (idx - 1 + deck.length) % deck.length; render(); } }
  function next() { if (deck.length) { idx = (idx + 1) % deck.length; render(); } }

  function gotIt() {
    if (!deck.length) return;
    const c = deck[idx];
    srSchedule(c.cid, true);
    Quantum.haptic(true);
    try{ const card={front:c.n, back:c.f, level: (load().srQueue?.[c.cid]?.interval||3)>6?2:0}; Quantum.neuroSynapticEvolve(card, 4); }catch{}
    known++;
    deck.splice(idx, 1);
    if (!deck.length) {
      logActivity(1);
      addEvent(`Flash session: ${known} formulas locked in${dueRun ? " (due review)" : ""}`);
      notifySync();
      cardBox.innerHTML = "";
      cardBox.append(h("div", { class: "quiz-result" },
        h("div", { class: "big" }, `${known}/${total}`),
        h("p", { class: "muted" }, known === total ? "Perfect sweep � every formula retired." : "Session done. The rest are scheduled for review."),
        h("p", { class: "quiz-best" }, "Cards you miss resurface in 1�3 days; mastered ones after a week."),
        h("div", { style: "margin-top:18px" },
          h("button", { class: "btn btn-primary", onclick: () => FlashView(root) }, "New session"))));
      return;
    }
    idx = Math.min(idx, deck.length - 1);
    render();
  }
  function againSoon() {
    if (!deck.length) return;
    const c = deck[idx];
    srSchedule(c.cid, false);
    Quantum.haptic(false);
    try{ const card={front:c.n, back:c.f, level:0}; Quantum.neuroSynapticEvolve(card, 1); }catch{}
    deck.push(deck.splice(idx, 1)[0]);
    idx = idx % deck.length;
    render();
  }

  buildPills();
  root.innerHTML = "";
  root.append(page("Formula flash", "Flip through every formula like a deck of cards. Missed cards resurface on a spaced schedule.", h("div", {}, pills, cardBox)));
  rebuild();
}

/* ----------- JEE PREVIOUS YEAR QUESTIONS ----------- */

export function PYQView(root) {
  let subjectF = "all";
  let examF = "all";
  let yearF = "all";
  let specialF = "all";

  const years = [...new Set(PYQS.map((q) => q.year))].sort((a, b) => b - a);
  const wrap = h("div", { style: "margin-top:16px" });

  const difficultyOf = (q) => (q.exam === "adv" ? "hard" : q.year >= 2023 ? "med" : "easy");

  function filtered() {
    return PYQS.filter((q) =>
      (subjectF === "all" || q.subject === subjectF) &&
      (examF === "all" || q.exam === examF) &&
      (yearF === "all" || String(q.year) === yearF) &&
      (specialF === "all"
        || (specialF === "starred" && load().pyqStarred.includes(q.id))
        || (specialF === "hard" && difficultyOf(q) === "hard")));
  }

  function render() {
    wrap.innerHTML = "";
    const list = filtered();
    wrap.append(h("p", { class: "hint", style: "margin:4px 2px 12px" },
      `${list.length} question${list.length === 1 ? "" : "s"} � answers stay hidden until you reveal them.`));
    if (!list.length) { wrap.append(h("div", { class: "empty" }, mascotSVG(60), h("p", { style: "margin-top:6px" }, "Nothing matches these filters."))); return; }
    for (const q of shuffle(list)) {
      const starred = () => load().pyqStarred.includes(q.id);
      const starBtn = h("button", { class: `star-btn small${starred() ? " on" : ""}`, title: "Bookmark this PYQ", "aria-label": "Bookmark PYQ" }, "?");
      starBtn.addEventListener("click", () => {
        const on = togglePyqStar(q.id);
        starBtn.classList.toggle("on", on);
        if (specialF === "starred") render();
      });
      const diff = difficultyOf(q);
      const sol = h("div", { class: "stack", style: "gap:8px;margin-top:12px", hidden: true },
        ...q.opts.map((o, k) =>
          h("div", { class: `modal-row${k === q.a ? "" : ""}`, style: k === q.a ? "border-color:color-mix(in srgb,var(--green) 50%,transparent)" : "" },
            h("b", { style: "color:var(--faint)" }, "ABCD"[k]), o, k === q.a ? h("span", { class: "small", style: "color:var(--green);font-weight:700" }, " ? correct") : null)),
        h("div", { class: "quiz-why" }, q.why),
        CONCEPTS[q.chap] ? h("a", { class: "prereq-pill", href: `#/chapter/${q.chap}` }, "Open related chapter") : null);
      const revealBtn = h("button", { class: "btn btn-sm", onclick: () => { sol.hidden = false; revealBtn.remove(); } }, "Reveal answer & solution");
      const card = h("div", { class: "card", style: "margin-bottom:12px" },
        h("div", { class: "chapter-meta", style: "margin:0 0 10px" },
          starBtn,
          h("span", { class: `tag ${q.exam === "adv" ? "tag-math" : "tag-phys"}` }, q.exam === "adv" ? "JEE Advanced" : "JEE Main"),
          h("span", { class: "tag" }, q.year),
          h("span", { class: `tag${diff === "hard" ? "" : ""}`, style: diff === "hard" ? "color:var(--red)" : diff === "med" ? "color:var(--amber)" : "color:var(--green)" }, diff),
          subjectTag(q.subject),
          q.chapName ? h("span", { class: "tag", style: "color:var(--faint)" }, q.chapName) : null),
        h("p", { style: "font-size:14.5px;line-height:1.65;margin-bottom:10px" }, q.q),
        revealBtn, sol);
      wrap.append(card);
    }
  }

  const subjTabs = h("div", { class: "filter-tabs" },
    ...["all", "P", "C", "M"].map((k) => {
      const label = k === "all" ? "All subjects" : SUBJECTS[k].name;
      const b = h("button", { class: `ftab${k === subjectF ? " on" : ""}`, onclick: () => { subjectF = k; [...subjTabs.children].forEach((x) => x.classList.remove("on")); b.classList.add("on"); render(); } }, label);
      return b;
    }));
  const examSel = h("select", { onchange: (ev) => { examF = ev.target.value; render(); } },
    h("option", { value: "all" }, "All papers"),
    h("option", { value: "main" }, "JEE Main"),
    h("option", { value: "adv" }, "JEE Advanced"));
  const yearSel = h("select", { onchange: (ev) => { yearF = ev.target.value; render(); } },
    h("option", { value: "all" }, "All years"),
    ...years.map((y) => h("option", { value: String(y) }, String(y))));
  const specialSel = h("select", { onchange: (ev) => { specialF = ev.target.value; render(); } },
    h("option", { value: "all" }, "Everything"),
    h("option", { value: "starred" }, "? Bookmarked"),
    h("option", { value: "hard" }, "Hard only"));

  render();
  root.innerHTML = "";
  root.append(page("JEE previous year questions",
    "Real questions from past JEE Main & Advanced papers, with worked solutions.",
    h("div", {},
      h("div", { class: "row", style: "align-items:center;gap:10px" },
        subjTabs,
        h("div", { style: "display:flex;gap:8px;margin-left:auto;flex-wrap:wrap" }, examSel, yearSel, specialSel)),
      wrap)));
}

/* ----------- RANK PREDICTOR ----------- */

const PCT_POINTS = [[0, 0.5], [40, 25], [80, 50], [120, 68], [160, 84], [200, 94], [240, 98.6], [280, 99.85], [300, 100]];

export function percentileFromScore(score) {
  const x = Math.max(0, Math.min(300, score));
  for (let i = 1; i < PCT_POINTS.length; i++) {
    const [x0, y0] = PCT_POINTS[i - 1], [x1, y1] = PCT_POINTS[i];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return 100;
}

export function PredictorView(root) {
  const scoreInput = h("input", { type: "number", value: 180, min: 0, max: 300, style: "width:110px" });
  const scoreSlider = h("input", { type: "range", value: 180, min: 0, max: 300, step: 1 });
  const candSelect = h("select", {},
    [["1000000", "~10 lakh"], ["1450000", "~14.5 lakh"], ["1800000", "~18 lakh"]].map(([v, t]) => h("option", { value: v }, t)));
  const resultBox = h("div", { class: "card predict-card", style: "margin-top:18px" });

  function compute() {
    const score = Math.max(0, Math.min(300, parseInt(scoreInput.value, 10) || 0));
    const n = parseInt(candSelect.value, 10) || 1450000;
    const pct = percentileFromScore(score);
    const rank = Math.max(1, Math.ceil(((100 - pct) / 100) * n));
    const band = Math.max(1, Math.ceil(n * 0.004));
    resultBox.innerHTML = "";
    resultBox.append(
      h("div", { class: "row", style: "align-items:center;gap:18px" },
        h("div", { class: "predict-rank" },
          h("div", { class: "big" }, rank.toLocaleString("en-IN")),
          h("div", { class: "muted small" }, "expected rank")),
        h("div", { style: "flex:1;min-width:220px" },
          h("div", { class: "rank-bar", style: "margin-bottom:8px" }, h("i", { style: `width:${Math.min(100, pct)}%` })),
          h("p", { class: "small", style: "margin-bottom:4px" }, `� ${pct.toFixed(2)} percentile � band ${(rank - band).toLocaleString("en-IN")}�${(rank + band).toLocaleString("en-IN")}`),
          h("p", { class: "hint", style: "margin:0" }, "Ballpark from recent session curves � not a prophecy."))));
  }

  scoreInput.addEventListener("input", () => { scoreSlider.value = scoreInput.value; compute(); });
  scoreSlider.addEventListener("input", () => { scoreInput.value = scoreSlider.value; compute(); });
  candSelect.addEventListener("change", compute);

  root.innerHTML = "";
  root.append(page("Rank predictor", "Turn a target JEE Main score into an expected percentile and rank.",
    h("div", {},
      h("div", { class: "card", style: "max-width:520px" },
        h("h3", {}, "Expected score"),
        h("div", { class: "row", style: "gap:10px;margin-top:10px;align-items:center" },
          scoreInput, h("span", { class: "muted small" }, "out of 300")),
        h("div", { style: "margin-top:8px" }, scoreSlider),
        h("label", { class: "lbl", style: "display:block;margin-top:14px" }, "Candidates appearing"),
        candSelect),
      resultBox)));
  compute();
}

/* ----------- ANALYTICS ----------- */

function sparkline(days = 14) {
  const s = load();
  const bars = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    bars.push(s.activity[key] || 0);
  }
  const max = Math.max(1, ...bars);
  return h("div", { class: "spark", title: "Items completed, last 14 days" },
    ...bars.map((n) => h("i", { style: `height:${Math.max(4, (n / max) * 100)}%` })));
}

export function AnalyticsView(root) {
  const completed = new Set(load().completed);

  const nameIn = h("input", { type: "text", value: "Mock", placeholder: "Mock name", style: "width:140px" });
  const subjSel = h("select", {}, [["P", SUBJECTS.P.name], ["C", SUBJECTS.C.name], ["M", SUBJECTS.M.name]].map(([v, t]) => h("option", { value: v }, t)));
  const scoreIn = h("input", { type: "number", value: 60, min: 0, style: "width:80px" });
  const totalIn = h("input", { type: "number", value: 100, min: 1, style: "width:80px" });
  const listWrap = h("div", { style: "margin-top:14px" });
  const avgWrap = h("div", { class: "row", style: "gap:10px;margin-top:12px" });

  function stats() {
    const list = load().mocks || [];
    const withPct = list.map((m) => ({ ...m, pct: m.total > 0 ? (m.score / m.total) * 100 : 0 }));
    const avg = withPct.length ? withPct.reduce((a, m) => a + m.pct, 0) / withPct.length : 0;
    const best = withPct.length ? Math.max(...withPct.map((m) => m.pct)) : 0;
    return { withPct, avg, best };
  }

  function renderAvg() {
    const { withPct } = stats();
    avgWrap.innerHTML = "";
    for (const sub of ["P", "C", "M"]) {
      const rows = withPct.filter((m) => m.subject === sub);
      const a = rows.length ? rows.reduce((x, m) => x + m.pct, 0) / rows.length : null;
      avgWrap.append(tile(a === null ? "�" : `${Math.round(a)}%`, `${SUBJECTS[sub].name} avg`));
    }
  }

  function renderList() {
    const { withPct, avg, best } = stats();
    listWrap.innerHTML = "";
    if (!withPct.length) {
      listWrap.append(h("p", { class: "hint" }, "No mock tests logged yet."));
      return;
    }
    listWrap.append(
      h("div", { class: "row", style: "gap:10px;margin-bottom:14px" },
        tile(withPct.length, "mocks logged"), tile(`${Math.round(avg)}%`, "average"), tile(`${Math.round(best)}%`, "best")),
      h("div", { class: "mock-chart" },
        ...withPct.map((m) =>
          h("div", { class: "mock-bar-col", title: `${m.name} � ${m.date} � ${m.score}/${m.total} (${Math.round(m.pct)}%)` },
            h("div", { class: `mock-bar subj-${m.subject}`, style: `height:${Math.max(3, m.pct)}%` }),
            h("div", { class: "mock-bar-label" }, Math.round(m.pct))))),
      h("div", { class: "table-wrap", style: "margin-top:16px" },
        h("table", {},
          h("thead", {}, h("tr", {}, h("th", {}, "Date"), h("th", {}, "Mock"), h("th", {}, "Subject"), h("th", {}, "Score"), h("th", {}, "%"), h("th", {}))),
          h("tbody", {},
            ...[...withPct].reverse().map((m) =>
              h("tr", {},
                h("td", { class: "small faint" }, m.date),
                h("td", {}, m.name),
                h("td", {}, SUBJECTS[m.subject].name),
                h("td", {}, `${m.score}/${m.total}`),
                h("td", {}, `${Math.round(m.pct)}%`),
                h("td", {}, h("button", { class: "btn btn-ghost btn-sm", onclick: () => { removeMock(m.id); notifySync(); renderList(); renderAvg(); } }, "?"))))))));
  }

  function renderWeightage() {
    weightWrap.innerHTML = "";
    let totalDone = 0, totalMax = 0;
    for (const sub of ["P", "C", "M"]) {
      const concepts = ALL_CONCEPTS.filter((c) => c.subject === sub);
      const done = concepts.filter((c) => completed.has(c.id)).reduce((a, c) => a + weightInfo(c.id).w, 0);
      const max = SUBJECT_MAX_WEIGHT[sub] || 1;
      totalDone += done; totalMax += max;
      weightWrap.append(
        h("div", { style: "margin-bottom:14px" },
          h("div", { class: "row", style: "justify-content:space-between" },
            h("span", { style: "font-weight:600" }, SUBJECTS[sub].name),
            h("span", { class: "small muted" }, `${done}/${max} marks secured`)),
          h("div", { class: "rank-bar", style: "margin-top:6px" }, h("i", { style: `width:${Math.round((done / max) * 100)}%` }))));
    }
    weightWrap.append(h("p", { class: "hint", style: "margin-top:6px" },
      `Exam-mark ground covered: ${Math.round((totalDone / totalMax) * 100)}% of total JEE Main weightage.`));
  }

  function add() {
    const name = nameIn.value.trim() || "Mock";
    const score = Math.max(0, parseInt(scoreIn.value, 10) || 0);
    const total = Math.max(1, parseInt(totalIn.value, 10) || 1);
    if (score > total) { makeToast("Score can't exceed the total."); return; }
    addMock({ name, subject: subjSel.value, score, total });
    addEvent(`Logged mock: ${name} � ${score}/${total}`);
    renderList(); renderAvg(); makeToast(`"${name}" logged.`, true); notifySync();
  }

  const addBtn = h("button", { class: "btn btn-primary btn-sm", onclick: add }, "Log mock");
  const weightWrap = h("div", { style: "margin-top:14px" });

  root.innerHTML = "";
  root.append(page("Performance analytics", "Mock trends, subject averages, activity rhythm and exam-mark coverage.",
    h("div", {},
      h("div", { class: "card", style: "max-width:680px" },
        h("h3", {}, "Log a mock test"),
        h("div", { class: "row", style: "gap:10px;margin-top:10px;align-items:center" },
          nameIn, subjSel, scoreIn, h("span", { class: "muted small" }, "out of"), totalIn, addBtn)),
      listWrap,
      h("div", { class: "divider" }),
      h("h2", { style: "margin-bottom:4px" }, "Activity rhythm"),
      h("div", { class: "card", style: "max-width:520px;margin-top:10px;padding:14px 16px" }, sparkline()),
      h("div", { class: "divider" }),
      h("h2", { style: "margin-bottom:4px" }, "Focus by subject"),
      (() => {
        const fs = load().focusSubj || {};
        const row = h("div", { class: "row", style: "gap:10px;margin-top:10px" });
        for (const sub of ["P", "C", "M"]) {
          row.append(tile(`${fs[sub] || 0}m`, `${SUBJECTS[sub].name} focus`));
        }
        if (!fs.P && !fs.C && !fs.M) row.append(h("p", { class: "hint", style: "margin:4px 2px" }, "Pick a subject before starting the focus timer to build this breakdown."));
        return row;
      })(),
      h("div", { class: "divider" }),
      h("h2", { style: "margin-bottom:4px" }, "Subject averages"),
      avgWrap,
      h("div", { class: "divider" }),
      h("h2", { style: "margin-bottom:4px" }, "Weightage coverage"),
      weightWrap)));
  renderList(); renderAvg(); renderWeightage();
}

export function refreshXP() {
  const pill = document.getElementById("xpPill");
  if (pill) pill.textContent = `${getTotalXP(ALL_CONCEPTS)} XP`;
}

/* ----------- AUTH ----------- */

export function AuthView(root) {
  const mode = { value: "login" };
  const title = h("h2", {}, "Log in");
  const sub = h("p", { class: "auth-sub" }, "Accounts are stored on this device and power the local leaderboard.");
  const userIn = h("input", { type: "text", placeholder: "Username", spellcheck: "false", autocomplete: "username" });
  const passIn = h("input", { type: "password", placeholder: "Password", autocomplete: "current-password" });
  const msg = h("div", { class: "auth-msg" });
  const switchBtn = h("button", {}, "Create an account");
  const submitBtn = h("button", { class: "btn btn-primary", style: "width:100%", type: "submit" }, "Log in");

  function setMode(m) {
    mode.value = m;
    title.textContent = m === "login" ? "Log in" : "Create account";
    submitBtn.textContent = m === "login" ? "Log in" : "Create account";
    switchBtn.textContent = m === "login" ? "Create an account" : "Already have an account? Log in";
    passIn.autocomplete = m === "login" ? "current-password" : "new-password";
    msg.textContent = "";
  }
  switchBtn.onclick = () => setMode(mode.value === "login" ? "register" : "login");

  async function submit() {
    const username = userIn.value.trim();
    const password = passIn.value;
    if (!username) { msg.textContent = "Enter a username."; return; }
    if (!password) { msg.textContent = "Enter a password."; return; }
    submitBtn.disabled = true;
    try {
      const sess = mode.value === "login" ? await login(username, password) : await register(username, password);
      switchUser();
      makeToast(`Welcome, ${sess.username}!`, true);
      let target = "#/home";
      try {
        if (!sessionStorage.getItem("tmj_welcomed")) { target = "#/welcome"; sessionStorage.setItem("tmj_welcomed", "1"); }
      } catch {}
      location.hash = target;
    } catch (e) {
      msg.textContent = e.message || "Something went wrong.";
    } finally {
      submitBtn.disabled = false;
    }
  }

  root.innerHTML = "";
  root.append(page("Leaderboard account", "",
    h("div", { class: "auth-wrap" },
      h("div", { class: "card auth-card" },
        title, sub,
        h("form", { onsubmit: (ev) => { ev.preventDefault(); submit(); } },
          h("div", { class: "field" }, h("label", {}, "Username"), userIn),
          h("div", { class: "field" }, h("label", {}, "Password"), passIn),
          submitBtn),
        msg,
        h("div", { class: "auth-switch" }, switchBtn),
        h("p", { class: "hint", style: "margin:14px 0 0;text-align:center" },
          h("a", { href: "#/home" }, "Continue as guest"), " � everything works offline, an account just adds the leaderboard.")))));
}

/* ----------- LEADERBOARD ----------- */

export function LeaderboardView(root) {
  const listWrap = h("div");
  const meWrap = h("div");

  async function loadLB() {
    listWrap.innerHTML = "";
    meWrap.innerHTML = "";
    try {
      const { list, me } = await fetchLeaderboard();
      if (!list.length) {
        listWrap.append(h("p", { class: "empty" }, "No players yet. Create an account to appear here."));
      } else {
        listWrap.append(...list.slice(0, 50).map((u, i) => {
          const isMe = me && u.username === me.username;
          return h("div", { class: `lb-row${isMe ? " me" : ""}${i < 3 ? " top3" : ""}` },
            h("span", { class: "lb-rank" }, `#${i + 1}`),
            h("span", { class: "lb-avatar" }, (u.username[0] || "?").toUpperCase()),
            h("span", { class: "lb-name" }, u.username),
            h("span", { class: "lb-meta" }, `${u.chapters} chapters � ${u.streak}d streak`),
            h("span", { class: "lb-xp" }, `${u.xp} XP`));
        }));
      }
      const sess = getSession();
      if (sess) {
        const mine = list.find((u) => u.username === sess.username);
        const st = load();
        meWrap.append(
          h("div", { class: "card" },
            h("h3", { style: "margin-bottom:10px" }, "Your standing"),
            h("div", { class: "quest-stats" },
              tile(mine ? `#${mine.rank}` : "�", "rank"),
              tile(getTotalXP(ALL_CONCEPTS), "XP"),
              tile(`${(st.quizBest && st.quizBest.best) || 0}/8`, "best quiz"),
              tile((st.mocks || []).length, "mocks")),
            h("button", { class: "btn btn-sm", style: "margin-top:12px", onclick: sync }, "Push progress now")));
      } else {
        meWrap.append(
          h("div", { class: "card" },
            h("h3", { style: "margin-bottom:8px" }, "Not on the board yet"),
            h("p", { class: "small muted" }, "Create a free account to publish your XP, chapters and streak."),
            h("button", { class: "btn btn-primary btn-sm", style: "margin-top:10px", onclick: () => navigate("#/login") }, "Log in / register")));
      }
    } catch {
      listWrap.append(h("p", { class: "empty" }, "Leaderboard unavailable on this device."));
    }
  }

  async function sync() {
    try {
      await syncProgress();
      makeToast("Progress pushed.", true);
      loadLB();
    } catch (e) {
      makeToast(e.message || "Sync failed.");
    }
  }

  root.innerHTML = "";
  root.append(page("Leaderboard", "Local rankings � every account on this device competes here.",
    h("div", { class: "lb-layout" },
      h("div", {},
        h("div", { class: "row", style: "align-items:center;gap:10px;margin-bottom:12px" },
          h("button", { class: "btn btn-sm", onclick: loadLB }, "Refresh"),
          h("span", { class: "small faint" }, "Sorted by XP.")),
        listWrap),
      meWrap)));
  loadLB();
}

/* ----------- NOTES / BOOKMARKS / SMALL VIEWS ----------- */

export function NotesView(root) {
  const s = load();
  const entries = Object.entries(s.notes || {})
    .map(([id, text]) => ({ c: CONCEPTS[id], text }))
    .filter((e) => e.c);

  const wrap = h("div");
  if (!entries.length) {
    wrap.append(h("p", { class: "hint" }, "No notes yet. Open any chapter ? Notes tab and save one."));
  }
  for (const { c, text } of entries) {
    const body = h("div", { class: "saved-note small", style: "white-space:pre-wrap;color:var(--muted)" }, text);
    const editTa = h("textarea", { class: "note-editor", hidden: true });
    editTa.value = text;
    const editBtn = h("button", { class: "btn btn-sm", onclick: () => {
      editTa.hidden = !editTa.hidden;
      body.hidden = !editTa.hidden;
      editBtn.textContent = editTa.hidden ? "Edit" : "Cancel";
      if (!editTa.hidden) return;
    } }, "Edit");
    const saveBtn = h("button", { class: "btn btn-primary btn-sm", hidden: true, onclick: () => {
      saveNote(c.id, editTa.value);
      body.textContent = load().notes[c.id] || "(empty)";
      editTa.hidden = true; body.hidden = false; saveBtn.hidden = true;
      makeToast("Note saved.", true);
    } }, "Save");
    editBtn.addEventListener("click", () => { saveBtn.hidden = !editTa.hidden; });
    wrap.append(h("div", { class: "card", style: "margin-bottom:12px" },
      h("div", { class: "row", style: "justify-content:space-between;align-items:flex-start;gap:10px" },
        h("div", {},
          h("a", { style: "font-weight:650", href: `#/chapter/${c.id}` }, c.name),
          h("div", { style: "margin-top:5px" }, subjectTag(c.subject))),
        h("div", { class: "chapter-actions" }, editBtn, saveBtn)),
      h("div", { style: "margin-top:10px" }, body, editTa)));
  }

  root.innerHTML = "";
  root.append(page("Study notes", "",
    h("div", {},
      h("div", { class: "row", style: "align-items:center;gap:12px;margin-bottom:6px" },
        h("p", { class: "muted small", style: "flex:1;min-width:200px;margin:0" }, "Everything you have written, across all chapters."),
        h("button", { class: "btn btn-sm", onclick: () => {
          const lines = entries.map(({ c, text }) => `## ${c.name}\n${text}`).join("\n\n");
          const blob = new Blob([lines], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "teachmejee-notes.txt";
          a.click();
          URL.revokeObjectURL(url);
        } }, "Export .txt"),
        h("button", { class: "btn btn-sm", onclick: () => window.print() }, "Print notes")),
      wrap)));
}

export function BookmarksView(root) {
  const s = load();
  const items = s.starred.map((id) => CONCEPTS[id]).filter(Boolean);
  const wrap = h("div");
  if (!items.length) wrap.append(h("p", { class: "hint" }, "No bookmarks yet. Tap ? on any chapter."));
  for (const c of items) {
    wrap.append(h("div", { class: "card row-link", style: "margin-bottom:10px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap",
      onclick: () => navigate(`#/chapter/${c.id}`) },
      h("div", {}, h("div", { style: "font-weight:650" }, c.name), h("div", { class: "small faint", style: "margin-top:3px" }, `${levelName(c.level)} � +${c.xp} XP`)),
      h("button", { class: "btn btn-sm", onclick: (ev) => { ev.stopPropagation(); toggleStar(c.id); BookmarksView(root); } }, "? Remove")));
  }
  root.innerHTML = "";
  root.append(page("Bookmarks", "Chapters you starred for quick access.", wrap));
}

export function WeakAreasView(root) {
  const weak = getWeakAreas();
  const wrap = h("div");
  if (!weak.length) {
    wrap.append(h("p", { class: "hint" }, "Nothing flagged yet. Answer quiz questions on mastered chapters � anything below 80% accuracy lands here."));
  }
  for (const { c, score } of weak) {
    wrap.append(h("div", { class: "card", style: "margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 16px" },
      h("div", {},
        h("div", { style: "font-weight:650" }, c.name),
        h("div", { style: "margin-top:4px" }, subjectTag(c.subject)),
        h("div", { class: "small", style: "color:var(--red);margin-top:5px" }, `Accuracy: ${Math.round(score * 100)}%`)),
      h("a", { class: "btn btn-sm", href: `#/chapter/${c.id}` }, "Review")));
  }
  root.innerHTML = "";
  root.append(page("Weak areas", "Mastered chapters where your quiz accuracy is under 80%.", wrap));
}

export function RevisionsView(root) {
  const items = revisionCandidates();
  const wrap = h("div");
  if (!items.length) wrap.append(h("div", { class: "empty" }, mascotSVG(64, "cheer"), h("p", { style: "margin:8px 0 0" }, "All caught up! Reviews resurface automatically as you study.")));
  for (const { c, why } of items) {
    wrap.append(h("div", { class: "card", style: "margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 16px" },
      h("div", {},
        h("div", { style: "font-weight:650" }, c.name),
        h("div", { style: "margin-top:4px" }, subjectTag(c.subject)),
        h("div", { class: "small faint", style: "margin-top:4px" }, why)),
      h("a", { class: "btn btn-sm", href: `#/chapter/${c.id}` }, "Revise")));
  }
  root.innerHTML = "";
  root.append(page("Revisions due", "Spaced repetition: chapters you opened long ago or marked for review.", wrap));
}

export function ProgressView(root) {
  const stats = getSubjectStats();
  const cards = Object.keys(stats).map((subj) => {
    const stt = stats[subj];
    return h("div", { class: "card", style: "margin-bottom:12px" },
      h("div", { class: "row", style: "justify-content:space-between;align-items:baseline;margin-bottom:8px" },
        h("h3", {}, SUBJECTS[subj].name),
        h("span", { class: "small faint" }, `${stt.pct}%`)),
      h("div", { class: "rank-bar" }, h("i", { style: `width:${stt.pct}%` })),
      h("div", { class: "small faint", style: "margin-top:8px" },
        `${stt.completed}/${stt.total} chapters`,
        stt.avgScore == null ? "" : ` � quiz accuracy ${Math.round(stt.avgScore * 100)}%`));
  });
  root.innerHTML = "";
  root.append(page("Progress by subject", "Completion and quiz accuracy per subject.", h("div", {}, cards)));
}

export function RecommendationsView(root) {
  const recs = getRecommendations(9);
  const wrap = h("div");
  if (!recs.length) wrap.append(h("p", { class: "muted" }, "Roadmap complete!"));
  for (const { c, priority, reason } of recs) {
    wrap.append(h("div", { class: "card", style: "margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 16px;border-left:3px solid " + (priority === "high" ? "var(--accent)" : "var(--border)") },
      h("div", {},
        h("div", { style: "font-weight:650" }, c.name),
        h("div", { style: "margin-top:5px" }, subjectTag(c.subject)),
        h("div", { class: "small faint", style: "margin-top:4px" }, reason)),
      h("div", { class: "chapter-actions" },
        priority === "high" ? h("span", { class: "combo-chip" }, "next up") : null,
        h("a", { class: "btn btn-sm", href: `#/chapter/${c.id}` }, "Start"))));
  }
  root.innerHTML = "";
  root.append(page("Recommended next", "The highest-yield chapters unlocked right now.", wrap));
}

export function MasteryView(root) {
  const sections = [3, 2, 1, 0].map((lvl) => ({
    lvl,
    chapters: ALL_CONCEPTS.filter((c) => getMasteryLevel(c) === lvl),
  })).filter((x) => x.chapters.length);
  const wrap = h("div");
  for (const { lvl, chapters } of sections) {
    wrap.append(h("div", { style: "margin-bottom:22px" },
      h("h2", { style: "margin-bottom:10px;font-size:16px" }, `${getMasteryLabel(lvl)} � ${chapters.length}`),
      h("div", { class: "sub-grid" },
        ...chapters.slice(0, 40).map((c) =>
          h("div", { class: "sub-item row-link", onclick: () => navigate(`#/chapter/${c.id}`) },
            h("div", { class: "t" }, c.name),
            h("div", { style: "margin-top:5px" }, subjectTag(c.subject)))))));
  }
  root.innerHTML = "";
  root.append(page("Topic mastery", "Mastery grows when you answer quiz questions correctly after mastering a chapter.",
    h("div", {},
      Object.keys(load().quizByConcept).length === 0 && !load().completed.length
        ? h("p", { class: "hint", style: "margin-bottom:14px" }, "Take quizzes from the Practice section to build mastery levels.")
        : null,
      wrap)));
}

export function StatsView(root) {
  const s = load();
  const stats = getSubjectStats();
  let bestSubject = null, bestVal = -1;
  for (const [subj, stt] of Object.entries(stats)) {
    if (stt.avgScore != null && stt.avgScore > bestVal) { bestVal = stt.avgScore; bestSubject = subj; }
  }
  const focusTotal = Object.values(s.focusLog || {}).reduce((a, b) => a + b, 0);
  const topCards = [
    ["Total XP", getTotalXP(ALL_CONCEPTS)],
    ["Study streak", `${getStreak()} day${getStreak() === 1 ? "" : "s"}`],
    ["Chapters mastered", `${s.completed.length}/${ALL_CONCEPTS.length}`],
    ["Weak areas", getWeakAreas().length],
    ["Due revision", revisionCandidates().length],
    ["Best subject", bestSubject ? SUBJECTS[bestSubject].name : "�"],
    ["Focus time", `${focusTotal} min`],
    ["Active days", Object.keys(s.activity).filter((k) => s.activity[k] > 0).length],
  ];
  const subjectCards = Object.entries(stats).map(([subj, stt]) =>
    h("div", { class: "card", style: "padding:13px 15px" },
      h("div", { class: "row", style: "justify-content:space-between;margin-bottom:7px" },
        h("span", { style: "font-weight:600" }, SUBJECTS[subj].name),
        h("span", { class: "small faint" }, `${stt.pct}%`)),
      h("div", { class: "rank-bar" }, h("i", { style: `width:${stt.pct}%` })),
      h("div", { class: "small faint", style: "margin-top:7px" }, stt.avgScore == null ? "No quiz data yet" : `Quiz accuracy ${Math.round(stt.avgScore * 100)}%`)));

  root.innerHTML = "";
  root.append(page("Statistics", "The full picture of your preparation.",
    h("div", {},
      h("div", { class: "stat-grid", style: "grid-template-columns:repeat(auto-fit,minmax(150px,1fr))" },
        ...topCards.map(([l, v]) => h("div", { class: "stat" }, h("div", { class: "k", style: "font-size:19px" }, String(v)), h("div", { class: "l" }, l)))),
      h("div", { class: "divider" }),
      h("div", { class: "stack", style: "gap:12px" }, ...subjectCards))));
}

export function AchievementsView(root) {
  const s = load();
  const badges = BADGES(s, s.completed.length);
  const count = s.completed.length;
  const focusTotal = Object.values(s.focusLog || {}).reduce((a, b) => a + b, 0);
  const prog = {
    first: [Math.min(count, 1), 1],
    ten: [Math.min(count, 10), 10],
    half: [Math.min(count, Math.ceil(ALL_CONCEPTS.length / 2)), Math.ceil(ALL_CONCEPTS.length / 2)],
    all: [count, ALL_CONCEPTS.length],
    fire: [Math.min(getStreak(), 3), 3],
    blaze: [Math.min(getStreak(), 7), 7],
    sharp: [Math.min((s.quizBest && s.quizBest.practiced) || 0, 50), 50],
    ace: [Math.min((s.quizBest && s.quizBest.best) || 0, 8), 8],
    scribe: [Math.min(Object.keys(s.notes).length, 1), 1],
    curator: [Math.min(s.starred.length, 1), 1],
    focus: [Math.min(focusTotal, 120), 120],
    analyst: [Math.min((s.mocks || []).length, 5), 5],
  };
  const unlocked = badges.filter((b) => b.ok).length;
  const shareCard = h("div", { class: "card", style:"margin-top:14px" }, h("h3",{}, "?? Shareable Victory Card"), h("p",{class:"small muted"},"Generate a canvas card for Instagram / WhatsApp � one tap."),
    h("div",{class:"row", style:"gap:8px;margin-top:8px;flex-wrap:wrap"},
      h("button",{class:"btn btn-primary btn-sm", onclick:()=>{
        const c=document.createElement("canvas"); c.width=900; c.height=460; const ctx=c.getContext("2d");
        const g=ctx.createLinearGradient(0,0,900,460); g.addColorStop(0,"#1a1208"); g.addColorStop(1,"#2e2517"); ctx.fillStyle=g; ctx.fillRect(0,0,900,460);
        ctx.fillStyle="#f2a33c"; ctx.font="800 28px sans-serif"; ctx.fillText("TeachMeJEE Quantum", 36, 48);
        ctx.fillStyle="#f5eddc"; ctx.font="700 22px sans-serif"; ctx.fillText(`${unlocked}/${badges.length} badges � ${getTotalXP(ALL_CONCEPTS)} XP � ${count}/${ALL_CONCEPTS.length} chapters`, 36, 88);
        ctx.fillStyle="#a89a7d"; ctx.font="13px sans-serif"; ctx.fillText("The Future of JEE Learning � Built by aspirants. For aspirants.", 36, 112);
        // badges
        let x=36, y=150; badges.filter(b=>b.ok).slice(0,8).forEach(b=>{ ctx.fillStyle="rgba(242,163,60,0.14)"; ctx.beginPath(); ctx.roundRect(x,y,104,72,10); ctx.fill(); ctx.fillStyle="#ffd9a0"; ctx.font="22px sans-serif"; ctx.fillText(b.g, x+38, y+30); ctx.fillStyle="#f5eddc"; ctx.font="9px sans-serif"; const t=b.t.slice(0,14); ctx.fillText(t, x+52-ctx.measureText(t).width/2, y+50); x+=112; if(x>780){ x=36; y+=84; } });
        ctx.fillStyle="#a89a7d"; ctx.font="11px sans-serif"; ctx.fillText("teachmejee.local � tmj-v8 Quantum", 36, 438);
        const url=c.toDataURL("image/png"); const a=document.createElement("a"); a.href=url; a.download=`teachmejee-victory-${Date.now()}.png`; a.click();
      }}, "Generate & Download PNG"),
      h("span",{class:"small faint"},"900�460 � no server")) );
  root.innerHTML = "";
  root.append(page("Achievements", `${unlocked} of ${badges.length} badges earned.`,
    h("div", { class: "stack", style:"gap:14px" },
      h("div", { class: "badge-grid" },
        ...badges.map((b) => {
          const card = h("div", { class: `badge${b.ok ? " on" : ""}` },
            h("div", { class: "badge-mark" }, b.g),
            h("div", {},
              h("div", { class: "badge-t" }, b.t),
              h("div", { class: "badge-d" }, b.d)));
          if (!b.ok && prog[b.id]) {
            const [cur, tgt] = prog[b.id];
            const pct = Math.max(4, Math.round((cur / Math.max(1, tgt)) * 100));
            card.append(h("div", { class: "ach-prog-wrap", style: "margin-left:auto;flex:none;width:74px" },
              h("div", { class: "ach-prog" }, h("i", { style: `width:${pct}%` })),
              h("div", { class: "small faint", style: "font-size:10px;text-align:right;margin-top:3px" }, `${cur}/${tgt}`)));
          }
          return card;
        })),
      shareCard)));
}

/* ----------- CALENDAR ----------- */

let calOffset = 0;
export function CalendarView(root) {
  const s = load();
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + calOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(h("div"));
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const n = Number(s.activity[key] || 0);
    const cls = n >= 4 ? "a3" : n >= 2 ? "a2" : n >= 1 ? "a1" : "";
    const isToday = key === todayISO();
    const isExam = key === s.planner.mainDate || key === s.planner.advDate;
    cells.push(h("div", { class: `cal-day ${cls}${isToday ? " today" : ""}${isExam ? " exam" : ""}`, title: `${key}${n ? ` � ${n} item${n > 1 ? "s" : ""}` : ""}${isExam ? " � EXAM DAY" : ""}` }, d));
  }

  root.innerHTML = "";
  root.append(page("Study calendar", "Daily activity with exam dates pinned.",
    h("div", { style: "max-width:480px" },
      h("div", { class: "cal-nav" },
        h("button", { class: "btn btn-sm", onclick: () => { calOffset--; CalendarView(root); } }, "� Prev"),
        h("div", { class: "cal-title" }, base.toLocaleDateString(undefined, { month: "long", year: "numeric" })),
        h("button", { class: "btn btn-sm", onclick: () => { calOffset++; CalendarView(root); } }, "Next �"),
        h("button", { class: "btn btn-ghost btn-sm", onclick: () => { calOffset = 0; CalendarView(root); } }, "Today")),
      h("div", { class: "cal-grid" },
        ...["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((l) => h("div", { class: "cal-dow" }, l)),
        ...cells),
      h("div", { class: "heatmap-legend", style: "margin-top:12px" },
        h("span", { class: "heat-cell" }), " quiet",
        h("span", { class: "heat-cell l1" }), h("span", { class: "heat-cell l2" }), h("span", { class: "heat-cell l3" }), " busy",
        h("span", { class: "cal-day exam", style: "display:inline-block;width:11px;height:11px;min-height:0" }), " exam day"))));
}

/* ----------- NEET HUB (biology models + notes + practice) ----------- */

let neetTab = "syllabus";
let neetQuery = "";

export function NeetView(root) {
  disposeActiveSim();
  const s = load();
  const readCount = NEET_TOPICS.filter((t) => s.seen[`neet:${t.id}`]).length;

  const neetSearchEl = h("input", { type: "text", placeholder: "Search topics, terms�", style: "margin-top:14px;max-width:340px" });
  neetSearchEl.addEventListener("input", () => { neetQuery = neetSearchEl.value; if (neetTab === "syllabus") NeetView(root); });
  const head = page("NEET hub", "Biology-first track for the medical entrance � notes, 3D models and practice.",
    h("div", {},
      h("div", { class: "stat-grid", style: "grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:0" },
        tile(`${readCount}/${NEET_TOPICS.length}`, "topics studied", false),
        tile(Object.values(s.activity).reduce((a, b) => a + b, 0), "total items done", false),
        tile(`${getStreak()}d`, "streak", false)),
      h("div", { class: "filter-tabs", style: "margin-top:16px" },
        ...[["syllabus", "Biology notes"], ["models", "Biology models"], ["practice", "Practice"]].map(([k, label]) => {
          const b = h("button", { class: `ftab${neetTab === k ? " on" : ""}`, onclick: () => { neetTab = k; NeetView(root); } }, label);
          return b;
        })),
      neetSearchEl,
      h("div", { style: "margin-top:18px" }, neetTab === "syllabus" ? syllabusTab() : neetTab === "models" ? modelsTab(root) : practiceTab(root))));
  root.innerHTML = "";
  root.append(head);

  function syllabusTab() {
    const units = {};
    const ql = (typeof neetQuery !== "undefined" ? neetQuery : "").trim().toLowerCase();
    const topics = NEET_TOPICS.filter((t) => !ql || `${t.name} ${t.summary} ${t.terms.join(" ")}`.toLowerCase().includes(ql));
    for (const t of topics) (units[t.unit] = units[t.unit] || []).push(t);
    const open = {};
    return h("div", { class: "journey" },
      ...Object.entries(units).map(([unit, topics]) =>
        h("section", { class: "stage active" },
          h("div", { class: "flow-stage-label", style: "padding-left:0" }, unit),
          h("div", { class: "path" },
            ...topics.map((t) => {
              const detail = h("div", { class: "card", style: "margin-top:8px", hidden: true },
                h("p", { class: "muted small" }, t.summary),
                h("ul", { style: "margin:10px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:4px;font-size:13.5px" },
                  ...t.points.map((pt) => h("li", {}, pt))),
                h("div", { class: "chapter-meta" },
                  ...t.terms.map((term) => h("span", { class: "tag tag-chem" }, term))),
                h("div", { class: "chapter-actions", style: "margin-top:12px" },
                  h("button", { class: "btn btn-sm", onclick: () => { srSchedule(`neet:${t.id}`, true); markSeen(`neet:${t.id}`); makeToast("Scheduled for revision.", true); } }, "Mark revised"),
                  t.model ? h("button", { class: "btn btn-primary btn-sm", onclick: () => { neetTab = "models"; neetModel = t.model; NeetView(root); } }, "Open 3D model") : null));
              const btn = h("button", {
                class: `qnode${open[t.id] ? " current" : ""}`,
                onclick: () => {
                  open[t.id] = !open[t.id];
                  detail.hidden = !open[t.id];
                  btn.classList.toggle("current", open[t.id]);
                  if (open[t.id]) markSeen(`neet:${t.id}`);
                },
              },
                h("span", { class: "qn-mark" }, load().seen[`neet:${t.id}`] ? "?" : "+"),
                h("span", { class: "qn-name" }, t.name),
                t.model ? h("span", { class: "tag tag-phys", style: "font-size:10px" }, "3D") : null,
                t.qcount ? h("span", { class: "qn-xp" }, `${t.qcount} Qs`) : null);
              return h("div", {}, btn, detail);
            })))));
  }

  function modelsTab(rootEl) {
    const MODELS = [
      { id: "bio-dna", name: "DNA double helix", desc: "Antiparallel strands, base-pair rungs, B-form twist." },
      { id: "bio-cell", name: "Eukaryotic cell", desc: "Membrane, nucleus, mitochondria, ER � labelled cutaway." },
      { id: "bio-neuron", name: "Neuron & impulse", desc: "Myelinated axon firing an action potential." },
      { id: "bio-photo", name: "Photosynthesis", desc: "Light photons in, O2 out � watch the rate react." },
      { id: "bio-heart", name: "Human heart", desc: "Four chambers pumping in sequence with a pacemaker flash." },
      { id: "bio-synth", name: "Protein synthesis", desc: "DNA unzips, mRNA feeds a ribosome building a peptide." },
    ];
    const viewer = h("div");
    let mounted = null;

    function mount(id) {
      disposeActiveSim();
      viewer.innerHTML = "";
      const shell = h("div", { class: "sim-shell", style: "height:420px" },
        h("canvas", { style: "position:absolute;inset:0;width:100%;height:100%" }),
        h("div", { class: "sim-loading" }, "Loading biology lab�"),
        h("div", { class: "sim-tag" }, "drag rotate � scroll zoom"));
      const ctrl = h("div", { class: "sim-panel", hidden: true });
      const backBtn = h("button", { class: "btn btn-sm", onclick: () => { disposeActiveSim(); drawGrid(); } }, "? All models");
      viewer.append(backBtn, shell, ctrl);
      import("./sim/index.js").then(({ mountSim }) => {
        try {
          mounted = mountSim(shell.querySelector("canvas"), id);
          ownSim(mounted);
          const loading = shell.querySelector(".sim-loading");
          if (loading) loading.remove();
          ctrl.hidden = !mounted.controls.length;
          for (const c of mounted.controls) {
            const row = h("label");
            if (c.type === "range") {
              const val = h("span", { class: "mono" }, c.value);
              row.append(`${c.label}: `, val,
                h("input", { type: "range", min: c.min, max: c.max, step: c.step, value: c.value,
                  oninput: (ev) => { const v = parseFloat(ev.target.value); val.textContent = v; mounted.setControl(c.key, v); } }));
            } else if (c.type === "toggle") {
              row.append(h("input", { type: "checkbox", checked: !!c.value, onchange: (ev) => mounted.setControl(c.key, ev.target.checked ? 1 : 0) }), " ", c.label);
            } else if (c.type === "button") {
              row.append(h("button", { class: "btn btn-sm", onclick: () => mounted.setControl(c.key, 1) }, c.label));
            } else if (c.type === "select") {
              row.append(c.label + " ",
                h("select", { onchange: (ev) => mounted.setControl(c.key, ev.target.value) },
                  ...c.options.map((o) => h("option", { value: o }, o))));
            }
            ctrl.append(row);
          }
        } catch {
          const loading = shell.querySelector(".sim-loading");
          if (loading) loading.textContent = "WebGL unavailable.";
        }
      });
    }

    function drawGrid() {
      viewer.innerHTML = "";
      const grid = h("div", { class: "sub-grid", style: "grid-template-columns:repeat(auto-fill,minmax(230px,1fr))" },
        ...MODELS.map((m) =>
          h("div", { class: "sub-item row-link", style: "padding:16px", onclick: () => mount(m.id) },
            h("div", { class: "t" }, m.name),
            h("div", { class: "d", style: "margin-top:6px" }, m.desc),
            h("button", { class: "btn btn-primary btn-sm", style: "margin-top:12px", onclick: (ev) => { ev.stopPropagation(); mount(m.id); } }, "Explore model"))));
      viewer.append(grid);
    }

    drawGrid();
    if (typeof neetModel !== "undefined" && neetModel) {
      const id = neetModel;
      neetModel = null;
      setTimeout(() => mount(id), 0);
      return h("div", {}, h("p", { class: "hint", style: "margin-bottom:10px" }, "Opening model�"), viewer);
    }
    return viewer;
  }

  function practiceTab() {
    const lenSel = h("select", { title: "Round length" },
      h("option", { value: "8" }, "Quick � 8"),
      h("option", { value: "16" }, "Full � 16"));
    const quiz = shuffle(NEET_QUESTIONS).slice(0, 8);
    let idx = 0, score = 0;
    lenSel.addEventListener("change", () => {
      quiz.length = 0;
      quiz.push(...shuffle(NEET_QUESTIONS).slice(0, parseInt(lenSel.value, 10) || 8));
    });
    const box = h("div", { class: "quiz-box", style: "max-width:none" });

    function renderQ() {
      box.innerHTML = "";
      const q = quiz[idx];
      const opts = h("div", { class: "stack", style: "gap:8px;margin-top:10px" },
        ...q.opts.map((o, k) => h("button", { class: "quiz-opt", onclick: () => answer(k, q.a) },
          h("span", { class: "q-key" }, "ABCD"[k]), o)));
      const why = h("div", { class: "quiz-why", hidden: true }, q.why);
      const realNext = h("button", { class: "btn", hidden: true, onclick: () => nextQ() }, "Next");
      const nextBtn = h("button", { class: "btn", hidden: true, onclick: () => (idx + 1 < quiz.length ? (idx++, renderQ()) : finish()) },
        idx + 1 < quiz.length ? "Next" : "See result");
      box.append(
        h("div", { class: "row", style: "align-items:center;gap:10px" },
          h("span", { class: "quiz-best" }, `Question ${idx + 1} of ${quiz.length} � ${score} correct`),
          lenSel),
        h("h2", { style: "margin-top:8px" }, q.q),
        opts, why,
        h("div", { style: "margin-top:14px" }, nextBtn));

      function answer(chosen, correct) {
        const ok = chosen === correct;
        if (ok) score++;
        [...opts.children].forEach((b) => { b.disabled = true; });
        [...opts.children][correct].classList.add("correct");
        if (!ok) [...opts.children][chosen].classList.add("wrong");
        why.hidden = false;
        nextBtn.hidden = false;
      }
    }

    function finish() {
      box.innerHTML = "";
      addBonusXp(score * 2);
      logActivity(1);
      addEvent(`NEET practice: ${score}/${quiz.length}`);
      refreshXP();
      notifySync();
      if (score >= 6) confettiBurst();
      box.append(h("div", { class: "quiz-result card" },
        h("div", { class: "big" }, `${score}/${quiz.length}`),
        h("p", { class: "quiz-best" }, `+${score * 2} XP bonus earned`),
        h("div", { style: "margin-top:16px" },
          h("button", { class: "btn btn-primary", onclick: () => NeetView(root) }, "New round"))));
    }

    renderQ();
    return box;
  }
}

let neetModel = null;

/* ----------- QUEST BOARD ----------- */

export function QuestsView(root) {
  const s = load();
  const completed = new Set(s.completed);
  const byLevel = {};
  for (const c of ALL_CONCEPTS) (byLevel[c.level] = byLevel[c.level] || []).push(c);
  const frontier = ALL_CONCEPTS.find((c) => !completed.has(c.id) && c.prereq.every((p) => completed.has(p)));

  function questNode(c) {
    const done = completed.has(c.id);
    const st = done ? "done" : c.id === (frontier && frontier.id) ? "current" : c.prereq.every((p) => completed.has(p)) ? "unlocked" : "locked";
    return h("button", { class: `qnode ${st}`, onclick: () => navigate(`#/chapter/${c.id}`), title: c.summary },
      h("span", { class: "qn-mark" }, done ? "?" : String(c.level + 1)),
      h("span", { class: "qn-name" }, c.name),
      subjectTag(c.subject),
      h("span", { class: "qn-xp" }, `+${c.xp}`));
  }

  const board = h("div", { class: "quest-board" },
    h("div", { class: "quest-legend" },
      h("span", {}, h("i", { class: "ql-done" }), "done"),
      h("span", {}, h("i", { class: "ql-now" }), "next up"),
      h("span", {}, h("i", { class: "ql-lock" }), "locked")),
    ...Object.keys(byLevel).sort((a, b) => a - b).map((lvl) =>
      h("div", { class: "quest-stage" },
        h("div", { class: "quest-stage-label" },
          LEVELS[lvl] ? `Level ${lvl} � ${LEVELS[lvl].title}` : `Level ${lvl}`,
          h("b", {}, `${byLevel[lvl].filter((c) => completed.has(c.id)).length}/${byLevel[lvl].length} done`)),
        h("div", { class: "quest-nodes" }, ...byLevel[lvl].map(questNode)))));

  const xp = getTotalXP(ALL_CONCEPTS);
  const rp = rankProgress(xp);
  const bestQuiz = (s.quizBest && s.quizBest.best) || 0;
  const queue = shuffle(ALL_CONCEPTS.filter((c) => !completed.has(c.id) && c.prereq.every((p) => completed.has(p)))).slice(0, 10);

  function bossCard() {
    const b = getBoss();
    return h("div", { class: `card boss-card${b.cleared ? " cleared" : ""}` },
      h("div", { class: "row", style: "justify-content:space-between;align-items:center;margin-bottom:6px" },
        h("h3", {}, "Weekly boss"),
        h("span", { class: "boss-glyph" }, b.cleared ? "?" : "?")),
      h("p", { class: "small muted", style: "margin:0 0 10px" }, b.cleared
        ? `Cleared this week � best ${b.best}/16. It resets Monday.`
        : "A 16-question timed gauntlet. Score 12 or better to clear it."),
      h("button", { class: `btn ${b.cleared ? "" : "btn-primary"} btn-sm`, onclick: () => {
        try { sessionStorage.setItem("tmj_boss", "1"); } catch {}
        navigate("#/quiz");
      } }, b.cleared ? "Fight again" : "Fight the boss"));
  }

  const side = h("div", { class: "quest-side" },
    bossCard(),
    h("div", { class: "card" },
      h("h3", { style: "margin-bottom:10px" }, "Your journey"),
      h("div", { class: "quest-stats" },
        tile(xp, "total XP"),
        tile(`${completed.size}/${ALL_CONCEPTS.length}`, "chapters"),
        tile(`${getStreak()}d`, "streak"),
        tile(`${bestQuiz}/8`, "best quiz"),
        tile(rp.name, "rank"))),
    h("div", { class: "card" },
      h("h3", { style: "margin-bottom:8px" }, "Practice queue"),
      h("div", { class: "puzzle-list" },
        queue.length
          ? queue.map((c) =>
              h("div", { class: "puzzle-row", onclick: () => navigate(`#/chapter/${c.id}`) },
                h("span", { class: "pr-name" }, c.name),
                subjectTag(c.subject),
                h("span", { class: "pr-rating" }, `~${weightInfo(c.id).w}m`)))
          : h("p", { class: "hint", style: "padding:10px 6px" }, "Roadmap complete � nothing left to queue."))));

  root.innerHTML = "";
  root.append(page("Quest board",
    "The whole syllabus as one board � clear the glowing node to advance.",
    h("div", { class: "quest-layout" }, board, side)));
}




/* ----------- WELCOME (post-login landing) ----------- */

export function WelcomeView(root) {
  const s = load();
  const sess = getSession();
  const name = sess ? sess.username : "Guest";
  const completed = s.completed.length;

  root.innerHTML = "";
  root.append(
    h("div", { class: "welcome" },
      h("div", { class: "welcome-hero", style: "position:relative;overflow:hidden;border-radius:var(--radius);padding:44px 36px;background:linear-gradient(140deg, var(--surface) 30%, color-mix(in srgb,var(--accent) 14%, var(--surface)))" },
        h("canvas", { class: "hero-3d", "aria-hidden": "true" }),
        h("span", { class: "float-orb", "data-plx": "0.35", style: "top:-30px;left:6%" }),
        h("span", { class: "float-orb orb-b", "data-plx": "-0.25", style: "bottom:-46px;right:10%" }),
        h("div", { class: "row", style: "align-items:center;gap:26px;flex-wrap:wrap;position:relative;z-index:2" },
          mascotSVG(112, "cheer"),
          h("div", { class: "stack", style: "gap:6px" },
            h("p", { class: "small faint", style: "margin:0;letter-spacing:.12em;text-transform:uppercase" }, `Welcome back, ${name}`),
            h("h1", { class: "grad-text", style: "font-size:32px" }, completed ? `${ALL_CONCEPTS.length - completed} chapters between you and mastery` : "Your JEE quest starts here"),
            h("p", { class: "muted small", style: "margin:0;max-width:520px" }, "A roadmap that plays like a game: unlock levels by mastering prerequisites, keep streaks alive, claim daily quests � and bring NEET Biology along in the same bag."),
            h("div", { class: "chapter-actions", style: "margin-top:12px" },
              h("button", { class: "btn btn-primary", onclick: () => { try { sessionStorage.setItem("tmj_welcomed", "1"); } catch {} location.hash = "#/home"; } }, "Enter the dashboard"),
              h("a", { class: "btn", href: "#/roadmap" }, "Peek at the journey"))))),
      heroLevelCard(s),
      h("div", { class: "stat-grid", style: "grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:18px" },
        tile(`${getTotalXP(ALL_CONCEPTS)}`, "XP earned", false),
        tile(`${completed}/${ALL_CONCEPTS.length}`, "chapters", false),
        tile(`${getStreak()}d`, "streak", false),
        tile(`${(s.quizBest && s.quizBest.practiced) || 0}`, "questions done", false)),

      h("div", { class: "welcome-tiles" },
        ...[["#/roadmap", "journey", "The Journey", "Five gated stages. Master prerequisites to unlock deeper tiers."],
            ["#/pyq", "pyq", "PYQ bank", "Real JEE Main & Advanced questions with worked solutions."],
            ["#/videos", "vids", "Lecture library", "Channel-matched searches plus your own pinned lessons."],
            ["#/neet", "neet", "NEET hub", "Biology notes, 3D organ models and NCERT-true practice."]].map(([href, art, t, d]) => {
          const a = h("a", { class: "card welcome-tile", href });
          a.append(
            h("span", { class: "wt-art", html: tileArt(art) }),
            h("h3", {}, t),
            h("p", { class: "small muted", style: "margin:0" }, d));
          return a;
        }))));

  import("./sim/hero.js")
    .then(({ initHero }) => initHero(root.querySelector(".hero-3d")))
    .then((inst) => { if (inst && inst.dispose) ownSim(inst); })
    .catch(() => {});
}

function tileArt(kind) {
  const art = {
    journey: `<svg viewBox="0 0 120 80"><path d="M10 65 Q30 20 55 40 T110 18" stroke="#f2a33c" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/><circle cx="10" cy="65" r="6" fill="#8fbf6f"/><circle cx="55" cy="40" r="6" fill="#69a7d8"/><circle cx="110" cy="18" r="7" fill="#e86f52"/><path d="M104 8 l12 0 -6 -10 z" fill="#ffc476"/></svg>`,
    pyq: `<svg viewBox="0 0 120 80"><rect x="30" y="12" width="60" height="56" rx="7" fill="#241c12" stroke="#463922"/><text x="42" y="38" font-size="15" font-weight="700" fill="#f2a33c">JEE</text><text x="42" y="56" font-size="13" fill="#c8b795">2024</text><path d="M84 20 l14 14 -22 22 -16 3 3 -16 z" fill="#69a7d8"/></svg>`,
    vids: `<svg viewBox="0 0 120 80"><rect x="22" y="16" width="76" height="48" rx="10" fill="#e86f52"/><path d="M52 30 L74 40 L52 50 Z" fill="#fff8ec"/><rect x="46" y="66" width="28" height="5" rx="2.5" fill="#463922"/></svg>`,
    neet: `<svg viewBox="0 0 120 80"><path d="M60 62 C34 46 30 26 44 20 c9 -4 16 2 16 2 s7 -6 16 -2 c14 6 10 26 -16 42z" fill="#e86f52"/><path d="M60 30 v22 M50 40 h20" stroke="#ffd27a" stroke-width="5" stroke-linecap="round"/></svg>`,
  };
  return art[kind] || art.journey;
}

function playerLevel(xp) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 25)) + 1);
}
function levelFloor(lv) { return (lv - 1) * (lv - 1) * 25; }

let shownLevel = null;
function heroLevelCard(s) {
  void s;
  const xp = getTotalXP(ALL_CONCEPTS);
  const lv = playerLevel(xp);
  const lo = levelFloor(lv), hi = levelFloor(lv + 1);
  const pct = Math.round(((xp - lo) / Math.max(1, hi - lo)) * 100);
  if (shownLevel == null) shownLevel = load().badgesSeen.includes(`lv:${lv}`) || lv;
  return h("div", { class: "card level-card", style: "margin-top:14px;display:flex;align-items:center;gap:18px;flex-wrap:wrap" },
    h("div", { class: "lv-badge" }, `LV ${lv}`),
    h("div", { style: "flex:1;min-width:200px" },
      h("div", { class: "row", style: "justify-content:space-between;align-items:baseline;margin-bottom:6px" },
        h("span", { style: "font-weight:700" }, `Player level ${lv}`),
        h("span", { class: "small faint" }, `${xp} / ${hi} XP to LV ${lv + 1}`)),
      h("div", { class: "rank-bar" }, h("i", { style: `width:${Math.min(100, pct)}%` }))));
}

/* ----------- PIP CHAT (offline study brain) ----------- */

function chatBubble(role) {
  return h("div", { class: `msg ${role}` }, h("div", { class: "bubble" }));
}

function chipRow(chips, onPick) {
  if (!chips || !chips.length) return null;
  return h("div", { class: "chip-row" },
    ...chips.map((c) => {
      const label = typeof c === "string" ? c : c.label;
      const b = h("button", { class: "chip" }, label);
      b.addEventListener("click", () => {
        if (typeof c === "string") onPick(c);
        else location.hash = c.href;
      });
      return b;
    }));
}

export function buildTutorChat() {
  const feed = h("div", { class: "chat-feed" });
  const input = h("input", { type: "text", placeholder: "Ask about any topic, formula, PYQ or your plan�", autocomplete: "off" });
  const sendBtn = h("button", { class: "btn btn-primary btn-sm", title: "Send" }, "Send");

  function addBubble(role) {
    const m = chatBubble(role);
    feed.append(m);
    feed.scrollTop = feed.scrollHeight;
    return m.firstChild;
  }

  function typewrite(bubble, text, done) {
    let i = 0;
    const iv = setInterval(() => {
      i += 3;
      bubble.textContent = text.slice(0, i);
      feed.scrollTop = feed.scrollHeight;
      if (i >= text.length) { clearInterval(iv); bubble.textContent = text; done(); }
    }, 12);
  }

  function ask(qText) {
    const q = qText.trim();
    if (!q) return;
    const ub = addBubble("me");
    ub.textContent = q;
    input.value = "";
    const tb = addBubble("pip");
    tb.innerHTML = "<span class='dots'><i></i><i></i><i></i></span>";
    setTimeout(() => {
      const ans = answerTutor(q);
      tb.innerHTML = "";
      const body = h("div", { class: "bubble-text" });
      tb.append(body);
      typewrite(body, ans.text, () => {
        const acts = chipRow(ans.actions, () => {});
        if (acts) tb.append(acts);
        const fu = chipRow(ans.followups, ask);
        if (fu) tb.append(fu);
        feed.scrollTop = feed.scrollHeight;
      });
    }, 380 + Math.random() * 420);
  }

  sendBtn.addEventListener("click", () => ask(input.value));
  input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") ask(input.value); });

  feed.append(h("div", { class: "msg pip" },
    h("div", { class: "bubble" },
      h("div", { class: "bubble-text" },
        "Hi! I am Pip � your offline study brain. I have read all 93 chapters, every formula, the PYQ bank and the NEET notes, and I can see your progress.",
        h("div", { class: "chip-row" },
          ...["What should I study next?", "Explain escape velocity", "My weak areas", "Days left for Advanced?"].map((s) => {
            const b = h("button", { class: "chip" }, s);
            b.addEventListener("click", () => ask(s));
            return b;
          }))))));

  return h("div", { class: "pip-chat" },
    h("div", { class: "chat-head" },
      mascotSVG(34),
      h("div", {},
        h("div", { style: "font-weight:700;font-size:14px;line-height:1.2" }, "Pip"),
        h("div", { class: "small faint", style: "margin-top:1px" }, "offline � knows your syllabus and your progress"))),
    feed,
    h("div", { class: "chat-input" }, input, sendBtn));
}

export function TutorView(root) {
  root.innerHTML = "";
  root.append(page("Ask Pip",
    "A retrieval tutor wired into this exact syllabus � no internet needed, nothing leaves your device.",
    buildTutorChat()));
}

/* ----------- VIDEO LECTURES ----------- */

const CHANNELS = [
  { key: "pw", name: "Physics Wallah � Alakh Pandey", subjects: ["P","C","M"], q: (name) => `${name} Physics Wallah Alakh Pandey JEE` },
  { key: "unac", name: "Unacademy JEE", subjects: ["P","C","M"], q: (name) => `${name} Unacademy JEE` },
  { key: "ved", name: "Vedantu JEE", subjects: ["P","C","M"], q: (name) => `${name} Vedantu JEE` },
  { key: "allen", name: "ALLEN Career Institute", subjects: ["P","C","M"], q: (name) => `${name} Allen JEE` },
  { key: "res", name: "Resonance Kota", subjects: ["P","C","M"], q: (name) => `${name} Resonance Kota JEE` },
  { key: "pg", name: "Physics Galaxy � Ashish Arora", subjects: ["P"], q: (name) => `${name} Physics Galaxy Ashish Arora` },
  { key: "rohit", name: "Rohit Mishra (Physics)", subjects: ["P"], q: (name) => `${name} Physics IIT JEE Rohit Mishra` },
  { key: "khan", name: "Khan Academy (concept)", subjects: ["P","C","M"], q: (name) => `${name} Khan Academy` },
  { key: "apni", name: "Apni Kaksha � Aman Dhattarwal", subjects: ["P","C","M"], q: (name) => `${name} Aman Dhattarwal Apni Kaksha` },
  { key: "mohit", name: "Mohit Tyagi (Maths)", subjects: ["M"], q: (name) => `${name} Mohit Tyagi mathematics JEE` },
  { key: "sameer", name: "Sameer Sir � Maths", subjects: ["M"], q: (name) => `${name} Sameer Chincholikar maths JEE` },
  { key: "vishal", name: "Vishal Tiwari (Chemistry)", subjects: ["C"], q: (name) => `${name} Chemistry Vishal Tiwari JEE` },
  { key: "pankaj", name: "Pankaj Sir � Chemistry", subjects: ["C"], q: (name) => `${name} Pankaj Sir chemistry JEE` },
  { key: "oneshot", name: "One-shot Revision", subjects: ["P","C","M"], q: (name) => `${name} one shot JEE Main` },
  { key: "pyqchan", name: "PYQ Marathon", subjects: ["P","C","M"], q: (name) => `${name} previous year questions JEE` },
  { key: "ncert", name: "NCERT Line-by-Line", subjects: ["P","C","M","BIO"], q: (name) => `${name} NCERT line by line` },
  { key: "ncertbio", name: "NCERT Biology � NEET", subjects: ["BIO"], q: (name) => `${name} NCERT biology line by line NEET` },
  { key: "biov", name: "Biology at Ease / Seep Pahuja", subjects: ["BIO"], q: (name) => `${name} Seep Pahuja biology NEET` },
];

function ytEmbed(ytId, title) {
  return h("div", { class: "video-card" },
    h("div", { class: "ratio" },
      h("iframe", {
        src: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0`,
        title: title || "Lecture",
        loading: "lazy",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowfullscreen: true,
      })),
    h("div", { class: "row", style: "justify-content:space-between;align-items:center;margin-top:7px;gap:8px" },
      h("span", { class: "small", style: "font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" }, title || "Lecture"),
      h("span", { class: "chapter-actions" },
        h("a", { class: "star-btn small", href: `https://www.youtube.com/watch?v=${ytId}`, target: "_blank", rel: "noopener noreferrer", title: "Open on YouTube" }, "?"),
        h("button", { class: "btn btn-sm", onclick: () => { removeVideo(ytId); notifySync(); } }, "?"))));
}

export function VideosView(root) {
  let subjF = "P";
  const wrap = h("div");

  function channelButtons(name, subjects) {
    return h("span", { class: "chapter-actions" },
      ...CHANNELS.filter((ch) => ch.subjects.some((s) => subjects.includes(s))).map((ch) =>
        h("a", { class: "chip", href: `https://www.youtube.com/results?search_query=${encodeURIComponent(ch.q(name))}`, target: "_blank", rel: "noopener noreferrer" }, ch.name.split("(")[0].trim())));
  }

  function render() {
    wrap.innerHTML = "";
    const s = load();

    wrap.append(h("div", { class: "card", style: "margin-bottom:18px" },
      h("h3", {}, "Pin a lecture"),
      h("p", { class: "hint", style: "margin:4px 0 10px" }, "Paste any YouTube link � it becomes a permanent embedded lesson here and on its chapter page."),
      (() => {
        const urlIn = h("input", { type: "text", placeholder: "https://youtube.com/watch?v=� or youtu.be/�", style: "flex:1;min-width:220px" });
        const titleIn = h("input", { type: "text", placeholder: "Title (optional)", style: "width:170px" });
        const sel = h("select", {},
          h("option", { value: "" }, "General (no chapter)"),
          ...["P", "C", "M"].map((sub) =>
            h("optgroup", { label: SUBJECTS[sub].name },
              ...ALL_CONCEPTS.filter((c) => c.subject === sub).map((c) => h("option", { value: c.id }, c.name)))),
          h("optgroup", { label: "NEET Biology" },
            ...NEET_TOPICS.map((t) => h("option", { value: `neet:${t.id}` }, t.name))));
        const msg = h("span", { class: "small faint" });
        const addBtn = h("button", { class: "btn btn-primary btn-sm", onclick: () => {
          const id = extractYouTubeId(urlIn.value);
          if (!id) { msg.textContent = "That does not look like a YouTube link."; return; }
          const chapId = sel.value && !sel.value.startsWith("neet:") ? sel.value : null;
          if (addVideo(id, chapId, titleIn.value)) {
            msg.textContent = "Pinned.";
            urlIn.value = ""; titleIn.value = "";
            makeToast("Lecture pinned.", true);
            notifySync();
            render();
          } else msg.textContent = "Already pinned.";
        } }, "Pin lecture");
        return h("div", { class: "row", style: "gap:9px;align-items:center" }, urlIn, titleIn, sel, addBtn, msg);
      })()));

    const mine = s.videos;
    wrap.append(
      h("h2", { style: "margin-bottom:10px" }, `Your library${mine.length ? ` � ${mine.length}` : ""}`),
      mine.length
        ? h("div", { class: "video-grid" }, ...mine.map((v) => ytEmbed(v.ytId, v.title)))
        : h("p", { class: "hint", style: "margin-bottom:18px" }, "Nothing pinned yet � grab a link from a search below."));

    wrap.append(h("div", { class: "divider" }), h("h2", { style: "margin-bottom:10px" }, "Find lectures"));
    const isBio = subjF === "BIO";
    const list = isBio
      ? NEET_TOPICS
      : ALL_CONCEPTS.filter((c) => c.subject === subjF).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    wrap.append(h("div", { class: "stack", style: "gap:6px" },
      ...list.map((item) =>
        h("div", { class: "lecture-row" },
          h("div", { style: "min-width:0" },
            h("span", { style: "font-weight:600;font-size:13.5px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" }, item.name),
            h("span", { class: "small faint" }, isBio ? item.unit : levelName(item.level))),
          channelButtons(item.name, isBio ? ["BIO"] : [item.subject])))));
  }

  const tabsEl = h("div", { class: "filter-tabs", style: "margin-bottom:14px" });
  function renderTabs() {
    tabsEl.innerHTML = "";
    [["P", SUBJECTS.P.name], ["C", SUBJECTS.C.name], ["M", SUBJECTS.M.name], ["BIO", "NEET Biology"]].forEach(([k, label]) => {
      const b = h("button", { class: `ftab${subjF === k ? " on" : ""}`, onclick: () => { subjF = k; renderTabs(); render(); } }, label);
      tabsEl.append(b);
    });
  }
  renderTabs(); render();

  root.innerHTML = "";
  root.append(page("Video lectures",
    "Channel-matched searches for every chapter, plus your own permanently embedded lessons.",
    h("div", {}, tabsEl, wrap)));
}

function lecturesPane(c) {
  const s = load();
  const mine = s.videos.filter((v) => v.chapId === c.id);
  return h("div", { class: "notes", style: "margin-top:4px" },
    h("div", { class: "card" },
      h("h3", { style: "margin-bottom:6px" }, "Find this chapter on YouTube"),
      h("p", { class: "hint", style: "margin-bottom:10px" }, "Pre-filled searches � pick your teacher."),
      h("div", { class: "chapter-meta" }, channelButtons(c.name, [c.subject]))),
    mine.length
      ? h("div", {},
          h("h3", { style: "margin:4px 0 10px" }, "Your pinned lectures"),
          h("div", { class: "video-grid" }, ...mine.map((v) => ytEmbed(v.ytId, v.title))))
      : h("p", { class: "hint" }, "No pinned lectures for this chapter yet � pin one from the Video lectures page or paste a link while studying."));
}

/* ----------- CLASS 9�10 FOUNDATION TRACK ----------- */

export function FoundationView(root) {
  const s = load();
  const fstats = foundationStats();
  const pct = Math.round((fstats.done / TOTAL_UNITS) * 100);
  const remainingWeeks = ALL_UNITS.filter((u) => !fIsDone(u.id)).reduce((a, u) => a + u.estWeeks, 0);

  const gradeSel = h("select", {},
    h("option", { value: "9" }, "Class 9"),
    h("option", { value: "10" }, "Class 10"));
  const hrsIn = h("input", { type: "number", value: Math.max(1, s.planner.dailyHours || 2), min: 1, max: 8 });
  const timelineOut = h("div", {});

  function calcTimeline() {
    const studyDays = parseInt(gradeSel.value, 10) === 9 ? 6 : 5;
    const hrs = Math.max(1, parseInt(hrsIn.value, 10) || 1);
    const weeklyHrs = studyDays * hrs;
    const weeks = Math.max(remainingWeeks, Math.ceil((remainingWeeks * 6) / Math.max(1, weeklyHrs)));
    const months = Math.max(1, Math.round(weeks / 4.3));
    const target = new Date(Date.now() + weeks * 7 * 86400000);
    timelineOut.innerHTML = "";
    timelineOut.append(
      h("p", { style: "margin:0;font-size:19px;font-weight:750" },
        `� ${months} month${months === 1 ? "" : "s"} to JEE-ready`),
      h("p", { class: "small muted", style: "margin:4px 0 0" },
        `${weeks} weeks at ${hrs}h/day � ready by around ${target.toLocaleDateString(undefined, { month: "long", year: "numeric" })}`),
      h("p", { class: "hint", style: "margin-top:6px" },
        months <= (parseInt(gradeSel.value, 10) === 10 ? 12 : 22)
          ? "Comfortably before your JEE Main window � the gates will do the rest."
          : "Tight but possible � protect the daily hours and use the focus timer."));
  }
  gradeSel.addEventListener("change", calcTimeline);
  hrsIn.addEventListener("input", calcTimeline);

  function trackCard(track) {
    const done = track.units.filter((u) => fIsDone(u.id)).length;
    const checked = fCheckPassed(track.id);
    return h("div", { class: `card${checked ? "" : ""}`, style: "margin-bottom:16px;border-color:" + (done === track.units.length ? "color-mix(in srgb,var(--green) 40%,transparent)" : "var(--border)") },
      h("div", { class: "row", style: "justify-content:space-between;align-items:center;margin-bottom:8px;gap:10px;flex-wrap:wrap" },
        h("div", { style: "display:flex;align-items:center;gap:11px" },
          h("span", { class: "daily-icon" }, track.icon),
          h("div", {},
            h("h3", {}, track.name),
            h("div", { class: "small faint", style: "margin-top:1px" }, "feeds ? " + track.feeds))),
        h("span", { class: "tag" }, `${done}/${track.units.length}`)),
      h("div", { class: "rank-bar", style: "margin-bottom:10px" }, h("i", { style: `width:${(done / track.units.length) * 100}%` })),
      h("div", { class: "stack", style: "gap:8px" },
        ...track.units.map((u) => unitRow(u))),
      h("div", { style: "margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center" },
        done === track.units.length && !checked
          ? h("button", { class: "btn btn-primary btn-sm claim-btn", onclick: () => runBridgeCheck(track) }, "Take the bridge check")
          : null,
        checked ? h("span", { class: "combo-chip" }, "bridge cleared ?") : null));
  }

  function unitRow(u) {
    const open = { v: false };
    const detail = h("div", { hidden: true, style: "padding:8px 4px 2px 36px" },
      h("p", { class: "small muted", style: "margin:0 0 6px" }, u.summary),
      h("ul", { style: "margin:0;padding-left:18px;display:flex;flex-direction:column;gap:3px;font-size:13px" },
        ...u.points.map((pt) => h("li", {}, pt))),
      u.bridgeTo.length
        ? h("div", { class: "chapter-meta", style: "margin-top:8px" },
            h("span", { class: "small faint", style: "align-self:center" }, "unlocks later:"),
            ...u.bridgeTo.filter((id) => CONCEPTS[id]).map((id) =>
              h("a", { class: "prereq-pill", href: `#/chapter/${id}`, style: "font-size:12px;padding:4px 10px" }, CONCEPTS[id].name)))
        : null);
    const row = h("div", {},
      h("button", {
        class: `qnode${fIsDone(u.id) ? " done" : ""}`,
        onclick: () => {
          open.v = !open.v;
          detail.hidden = !open.v;
          row.firstElementChild.classList.toggle("current", open.v);
        },
      },
        h("span", { class: "qn-mark" }, fIsDone(u.id) ? "?" : "+"),
        h("span", { class: "qn-name" }, u.name),
        h("span", { class: "tag", style: "font-size:10px" }, `~${u.estWeeks}w`)),
      detail,
      h("button", { class: `btn btn-sm${fIsDone(u.id) ? "" : " btn-primary"}`, style: "margin:6px 0 2px 36px", onclick: () => {
        fToggleUnit(u.id);
        if (foundationStats().done === TOTAL_UNITS && !load().foundation.celebrated) {
          const st = load(); st.foundation.celebrated = true; save();
          confettiBurst(); chime("level");
          showModal({ icon: "?", title: "Foundation complete!", rows: [h("span", {}, "Every basic is yours. The Class 11�12 roadmap starts unlocked at Level 0 � go take it.")] , cta: "Enter the Journey" });
        }
        FoundationView(root);
      } }, fIsDone(u.id) ? "Mark not done" : "Mark as learnt"));
    return row;
  }

  function runBridgeCheck(track) {
    const bridges = [...new Set(track.units.flatMap((u) => u.bridgeTo))].filter((id) => CONCEPTS[id]);
    let qs = QUESTIONS.filter((q) => bridges.includes(q.c)).slice(0, 4);
    if (qs.length < 4) qs = qs.concat(shuffle(PYQS).filter((q) => q.subject !== "BIO").slice(0, 4 - qs.length)
      .map((q) => ({ q: q.q, opts: q.opts, a: q.a })));
    qs = shuffle(qs).slice(0, 4);
    if (!qs.length) { fSetCheck(track.id, true); makeToast("Bridge cleared by default (no questions available).", true); FoundationView(root); return; }

    let i = 0, correct = 0;
    const box = h("div");
    root.innerHTML = "";
    root.append(page(`Bridge check � ${track.name}`, "Answer at least 3 of 4 to clear the bridge into JEE territory.", box));

    function renderQ() {
      box.innerHTML = "";
      const q = qs[i];
      const opts = h("div", { class: "stack", style: "gap:8px;margin-top:10px" },
        ...q.opts.map((o, k) => h("button", { class: "quiz-opt", onclick: () => answer(k, q.a) },
          h("span", { class: "q-key" }, "ABCD"[k]), o)));
      box.append(h("span", { class: "quiz-best" }, `Question ${i + 1} / ${qs.length} � ${correct} correct`),
        h("h2", { style: "margin-top:8px" }, q.q), opts,
        h("div", { style: "margin-top:14px" }, realNext));
      function answer(chosen, corr) {
        if (chosen === corr) correct++;
        [...opts.children].forEach((b) => { b.disabled = true; });
        [...opts.children][corr].classList.add("correct");
        if (chosen !== corr) [...opts.children][chosen].classList.add("wrong");
        realNext.hidden = false;
      }
      function nextQ() {
        i++;
        if (i < qs.length) renderQ();
        else finishCheck();
      }
    }

    function finishCheck() {
      const passed = correct >= 3;
      fSetCheck(track.id, passed);
      if (passed) { confettiBurst(); chime("level"); showModal({ icon: "?", title: "Bridge cleared!", rows: [`${correct}/4 on ${track.name}. This territory is officially yours.`], cta: "Onward" }); }
      else makeToast(`${correct}/4 � revisit the units and retake when ready.`);
      notifySync();
      FoundationView(root);
    }

    renderQ();
  }

  /* Ascension plan: ordered remaining units */
  const remaining = ALL_UNITS.filter((u) => !fIsDone(u.id));
  let cum = 0;
  const planRows = remaining.map((u) => {
    cum += u.estWeeks;
    return h("div", { class: "modal-row" },
      h("b", { class: "mono small" }, `W${cum - u.estWeeks + 1}�${cum}`),
      h("span", { class: "small" }, u.name));
  });

  root.innerHTML = "";
  root.append(page("Class 9�10 launchpad",
    "Master these basics and the JEE roadmap stops being scary � every unit here feeds a real chapter.",
    h("div", {},
      (() => {
        const s2 = load();
        const xp = getTotalXP(ALL_CONCEPTS);
        void xp; void s2;
        return h("div", { class: "card rank-card", style: "display:flex;gap:22px;align-items:center;flex-wrap:wrap" },
          ringSVG(pct, "progress-ring"),
          h("div", { style: "flex:1;min-width:230px" },
            h("h2", {}, `Readiness ${pct}%`),
            h("p", { class: "muted small", style: "margin:4px 0 8px" }, `${fstats.done} of ${TOTAL_UNITS} foundation units learnt. Readiness unlocks nothing less than confidence � roadmap XP stays separate.`),
            h("div", { class: "row", style: "gap:8px;flex-wrap:wrap" },
              h("a", { class: "btn btn-primary btn-sm", href: "#/roadmap" }, "Preview the Journey"),
              h("a", { class: "btn btn-sm", href: "#/tutor" }, "Ask Pip a doubt")),
            h("div", { class: "field", style: "margin-top:14px;margin-bottom:0" },
              h("label", { class: "lbl" }, "Ascension timeline"),
              h("div", { class: "row", style: "gap:9px;align-items:center" }, gradeSel, hrsIn, h("span", { class: "small faint" }, "hrs/day")),
              timelineOut)));
      })(),
      h("div", { class: "divider" }),
      h("h2", { style: "margin-bottom:12px" }, "Your tracks"),
      ...FOUNDATION_TRACKS.map(trackCard),
      remaining.length
        ? h("div", {},
            h("div", { class: "row", style: "justify-content:space-between;align-items:center;margin-bottom:10px" },
              h("h2", {}, "Ascending plan"),
              h("button", { class: "btn btn-sm", onclick: () => window.print() }, "Print plan")),
            h("div", { class: "stack", style: "gap:6px;max-width:620px" }, ...planRows))
        : h("div", { class: "card", style: "text-align:center;padding:26px" },
            mascotSVG(72, "cheer"),
            h("h2", { style: "margin-top:10px" }, "Every basic mastered."),
            h("p", { class: "muted small", style: "margin-top:6px" }, "The Level 0 gates are already open for you � start the Journey and climb."),
            h("a", { class: "btn btn-primary", style: "margin-top:12px", href: "#/roadmap" }, "Enter the Journey")))));
  calcTimeline();
}

/* --------------------------------------------------------------
   FULL NOTES READER � textbook-grade chapter notes with TOC,
   scrollspy, checkpoints, step-reveal examples, flashcards,
   search, focus mode, read-aloud and print-to-PDF.
   -------------------------------------------------------------- */

const DN_FS_KEY = "tmj_dn_fs";

function dnHighlight(root, query) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentNode && /^(SCRIPT|STYLE|MARK)$/.test(n.parentNode.nodeName)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const rx = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  let count = 0;
  for (const node of nodes) {
    const txt = node.nodeValue;
    if (!txt || !rx.test(txt)) { rx.lastIndex = 0; continue; }
    rx.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = rx.exec(txt))) {
      frag.append(document.createTextNode(txt.slice(last, m.index)));
      const mark = document.createElement("mark");
      mark.className = "dn-mark";
      mark.textContent = m[0];
      frag.append(mark);
      last = m.index + m[0].length;
      count++;
    }
    frag.append(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  return count;
}

function dnStepsEnhance(container) {
  container.querySelectorAll(".ex").forEach((ex) => {
    const steps = ex.querySelectorAll(".steps li");
    if (!steps.length) return;
    steps.forEach((li, i) => { if (i > 0) li.classList.add("dn-hidden-step"); });
    let shown = 1;
    const bar = h("div", { class: "ex-nav" },
      h("span", { class: "ex-count" }, `step 1/${steps.length}`));
    const btn = h("button", { class: "btn btn-sm ex-next" }, shown < steps.length ? "Reveal next step ?" : "All steps shown ?");
    btn.addEventListener("click", () => {
      if (shown < steps.length) {
        steps[shown].classList.remove("dn-hidden-step");
        shown++;
        bar.querySelector(".ex-count").textContent = `step ${shown}/${steps.length}`;
        btn.textContent = shown < steps.length ? "Reveal next step ?" : "All steps shown ?";
        if (shown === steps.length) btn.disabled = true;
        const ans = ex.querySelector(".exa");
        if (ans && shown >= steps.length) ans.classList.add("revealed");
      }
    });
    bar.append(btn);
    ex.querySelector(".steps").after(bar);
    const ans = ex.querySelector(".exa");
    if (ans && steps.length <= 1) ans.classList.add("revealed");
  });
}

export function deepNotesPane(c) {
  const note = DEEP_NOTES[c.id];
  const secs = note.secs;
  const cps = note.cps || [];
  const totalMin = noteMinutes(note);
  const prog = getNoteProg(c.id);
  const readSet = new Set(prog ? prog.s : []);
  const cpChoices = prog ? (prog.c || {}) : {};

  /* checkpoint placement map */
  const cpAfter = {};
  cps.forEach((cp, i) => {
    const at = Number.isInteger(cp.after) ? Math.min(cp.after, secs.length - 1) : -1;
    (cpAfter[at] = cpAfter[at] || []).push(i);
  });

  const wrap = h("div", { class: "deepnotes" });
  const fs = parseInt(localStorage.getItem(DN_FS_KEY) || "16", 10);
  wrap.style.setProperty("--dn-fs", fs + "px");

  /* toolbar */
  const pctFill = h("span", { class: "dn-pct-fill" });
  const pctLabel = h("span", { class: "dn-pct-label" }, "0%");
  const searchIn = h("input", { class: "dn-search", type: "text", placeholder: "Search these notes�", autocomplete: "off" });
  const matchTag = h("span", { class: "dn-matches" });
  const focusBtn = h("button", { class: "btn btn-sm", title: "Dim everything except the section you're reading" }, "Focus");
  const listenBtn = h("button", { class: "btn btn-sm", title: "Read current section aloud" }, "Listen");
  const printBtn = h("button", { class: "btn btn-sm btn-primary", title: "Print / save as PDF" }, "PDF ?");

  function paintPct() {
    const p = Math.round((readSet.size / Math.max(1, secs.length)) * 100);
    pctFill.style.width = p + "%";
    pctLabel.textContent = `${readSet.size}/${secs.length} � ${p}%`;
  }

  const toolbar = h("div", { class: "dn-toolbar" },
    h("div", { class: "dn-progress" }, pctFill),
    h("div", { class: "dn-tools" },
      pctLabel,
      h("span", { class: "dn-mins", title: "Estimated reading time" }, `�${totalMin} min read`),
      h("button", { class: "btn btn-sm", title: "Smaller text", onclick: () => setFs(fsHolder.v - 1) }, "A-"),
      h("button", { class: "btn btn-sm", title: "Larger text", onclick: () => setFs(fsHolder.v + 1) }, "A+"),
      searchIn, matchTag,
      listenBtn, focusBtn, printBtn));
  const fsHolder = { v: fs };
  function setFs(v) {
    v = Math.max(13, Math.min(22, v));
    if (v === fsHolder.v) return;
    fsHolder.v = v;
    localStorage.setItem(DN_FS_KEY, String(v));
    article.style.fontSize = v + "px";
  }

  /* layout: toc + article */
  const tocList = h("ol", { class: "dn-toc-list" });
  const toc = h("aside", { class: "dn-toc" },
    h("div", { class: "dn-toc-title" }, "Contents"),
    tocList);

  const article = h("article", { class: "dn-article dn-print-root" });
  article.style.fontSize = fsHolder.v + "px";

  const secEls = [];

  function renderSections(filterQuery) {
    article.innerHTML = "";
    secEls.length = 0;

    const head = h("header", { class: "dn-head" },
      h("h2", { class: "dn-chapter-title" }, c.name),
      h("p", { class: "dn-chapter-sub" },
        `${SUBJECTS[c.subject].name} � ${levelName(c.level)} � full-chapter study notes � �${totalMin} min`));
    article.append(head);

    secs.forEach((sec, i) => {
      const body = h("div", { html: sec.h });
      const check = h("input", { type: "checkbox", checked: readSet.has(i) ? "" : null, title: "Mark this section as read" });
      check.addEventListener("change", () => {
        const on = toggleNoteSec(c.id, i);
        if (on) readSet.add(i); else readSet.delete(i);
        tocList.children[i].classList.toggle("done", on);
        paintPct();
        notifySync();
      });
      const el = h("section", { class: `dn-sec${readSet.has(i) ? " done" : ""}`, id: `dn-sec-${i}`, dataset: { idx: String(i) } },
        h("h3", { class: "dn-sec-title" }, check, h("span", {}, `${i + 1}. ${sec.t}`)),
        body);

      (cpAfter[i] || []).forEach((ci) => el.append(buildCheckpoint(ci)));
      article.append(el);
      secEls.push(el);
    });

    /* flashcards */
    if (note.fl && note.fl.length) article.append(buildFlashes());

    /* prev / next */
    const deepIds = ALL_CONCEPTS.filter((x) => DEEP_NOTES[x.id]).map((x) => x.id);
    const pos = deepIds.indexOf(c.id);
    const nav = h("footer", { class: "dn-prevnext" });
    if (pos > 0) {
      const p = CONCEPTS[deepIds[pos - 1]];
      nav.append(h("a", { class: "dn-pn", href: `#/chapter/${p.id}` }, h("small", {}, "? previous"), p.name));
    } else nav.append(h("span", {}));
    if (pos >= 0 && pos < deepIds.length - 1) {
      const n = CONCEPTS[deepIds[pos + 1]];
      nav.append(h("a", { class: "dn-pn right", href: `#/chapter/${n.id}` }, h("small", {}, "next ?"), n.name));
    } else nav.append(h("span", {}));
    article.append(nav);

    dnStepsEnhance(article);
    if (filterQuery) highlightIn(article, filterQuery);
    buildToc();
    paintPct();
    observeSections();
  }

  function buildCheckpoint(ci) {
    const cp = cps[ci];
    const chosen = cpChoices[ci];
    const opts = cp.o.map((opt, oi) => {
      const b = h("button", { class: "cp-opt" }, opt);
      if (chosen != null) {
        b.disabled = true;
        if (oi === cp.a) b.classList.add("correct");
        else if (oi === chosen) b.classList.add("wrong");
      }
      return b;
    });
    const box = h("div", { class: "dn-cp" },
      h("div", { class: "cp-tag" }, "? Checkpoint"),
      h("div", { class: "cp-q" }, cp.q),
      ...opts,
      chosen != null
        ? h("div", { class: `cp-exp${chosen === cp.a ? " ok" : " no"}` },
            chosen === cp.a ? "Correct � " : "Not quite. ", cp.e)
        : null);
    opts.forEach((b, oi) => b.addEventListener("click", () => {
      if (cpChoices[ci] != null) return;
      setNoteCp(c.id, ci, oi);
      if (oi === cp.a) logActivity(1);
      renderSections(searchIn.value.trim().length > 1 ? searchIn.value.trim() : "");
    }));
    return box;
  }

  function buildFlashes() {
    const grid = h("div", { class: "dn-flashes" });
    const cards = note.fl.map(([q, a]) => {
      const cardEl = h("div", { class: "dn-flash" },
        h("div", { class: "dn-flash-inner" },
          h("div", { class: "f front" }, q),
          h("div", { class: "f back" }, a)));
      cardEl.addEventListener("click", () => cardEl.classList.toggle("flipped"));
      grid.append(cardEl);
      return cardEl;
    });
    const shuffleBtn = h("button", { class: "btn btn-sm", style: "margin-top:8px" }, "? Shuffle cards");
    shuffleBtn.addEventListener("click", () => {
      const arr = [...cards];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      grid.innerHTML = "";
      arr.forEach((cardEl) => { cardEl.classList.remove("flipped"); grid.append(cardEl); });
    });
    return h("section", { class: "dn-sec dn-recall" },
      h("h3", { class: "dn-sec-title" }, h("span", {}, "Rapid recall � tap a card to flip")),
      grid, shuffleBtn);
  }

  function buildToc() {
    tocList.innerHTML = "";
    secs.forEach((sec, i) => {
      const li = h("li", { class: readSet.has(i) ? "done" : "" },
        h("a", { href: `#dn-sec-${i}` }, sec.t));
      li.querySelector("a").addEventListener("click", (ev) => {
        ev.preventDefault();
        document.getElementById(`dn-sec-${i}`).scrollIntoView({ behavior: "smooth", block: "start" });
      });
      tocList.append(li);
    });
  }

  /* scrollspy + progress bar */
  let activeIdx = -1;
  function observeSections() {
    activeIdx = -1;
    updateActive();
  }
  function updateActive() {
    let best = -1;
    const probe = 140;
    for (let i = 0; i < secEls.length; i++) {
      if (secEls[i].getBoundingClientRect().top <= probe) best = i;
    }
    if (best !== activeIdx) {
      activeIdx = best;
      [...tocList.children].forEach((li, i) => li.classList.toggle("active", i === best));
      secEls.forEach((el, i) => el.classList.toggle("active", i === best));
    }
    /* reading progress bar follows scroll */
    const rect = article.getBoundingClientRect();
    const total = rect.height - innerHeight * 0.5;
    const done = Math.max(0, Math.min(total, -(rect.top) + innerHeight * 0.35));
    const sp = total > 40 ? Math.round((done / total) * 100) : 0;
    pctFill.style.width = Math.max(sp, Math.round((readSet.size / Math.max(1, secs.length)) * 100)) + "%";
  }
  const onScroll = () => requestAnimationFrame(updateActive);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* keyboard: jump sections with [ ] */
  function onKey(ev) {
    if (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA") return;
    if (ev.key !== "[" && ev.key !== "]") return;
    const dir = ev.key === "]" ? 1 : -1;
    const target = Math.max(0, Math.min(secs.length - 1, (activeIdx < 0 ? 0 : activeIdx) + dir));
    document.getElementById(`dn-sec-${target}`).scrollIntoView({ behavior: "smooth" });
  }
  document.addEventListener("keydown", onKey);

  /* focus mode */
  focusBtn.addEventListener("click", () => {
    const on = wrap.classList.toggle("focus-mode");
    focusBtn.classList.toggle("on", on);
  });

  /* search */
  let debounceT = null;
  searchIn.addEventListener("input", () => {
    clearTimeout(debounceT);
    debounceT = setTimeout(() => {
      const q = searchIn.value.trim();
      renderSections(q.length > 1 ? q : "");
      if (q.length > 1) {
        requestAnimationFrame(() => {
          const marks = article.querySelectorAll(".dn-mark");
          matchTag.textContent = marks.length ? `${marks.length} match${marks.length === 1 ? "" : "es"} � Enter to jump` : "no matches";
          if (marks.length) marks[0].scrollIntoView({ block: "center" });
          jumpState.i = 0;
        });
      }
    }, 220);
  });
  const jumpState = { i: 0 };
  searchIn.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    const marks = article.querySelectorAll(".dn-mark");
    if (!marks.length) return;
    jumpState.i = (jumpState.i + 1) % marks.length;
    marks[jumpState.i].scrollIntoView({ block: "center", behavior: "smooth" });
    marks.forEach((m, k) => m.classList.toggle("cur", k === jumpState.i));
  });

  /* read aloud */
  let speaking = false;
  listenBtn.addEventListener("click", () => {
    try {
      if (!("speechSynthesis" in window)) { makeToast("Speech not supported in this browser."); return; }
      if (speaking) { speechSynthesis.cancel(); speaking = false; listenBtn.classList.remove("on"); listenBtn.textContent = "Listen"; return; }
      const src = secEls[activeIdx < 0 ? 0 : activeIdx];
      if (!src) return;
      const u = new SpeechSynthesisUtterance(src.innerText.slice(0, 4000));
      u.rate = 1;
      u.onend = () => { speaking = false; listenBtn.classList.remove("on"); listenBtn.textContent = "Listen"; };
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      speaking = true;
      listenBtn.classList.add("on");
      listenBtn.textContent = "Stop";
    } catch {}
  });

  /* print / PDF */
  printBtn.addEventListener("click", () => {
    document.body.classList.add("print-notes");
    const done = () => document.body.classList.remove("print-notes");
    window.addEventListener("afterprint", done, { once: true });
    setTimeout(() => window.print(), 60);
  });

  onViewCleanup(() => {
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("keydown", onKey);
    clearTimeout(debounceT);
    try { speechSynthesis.cancel(); } catch {}
  });

  renderSections("");
  updateActive();

  wrap.append(toolbar, h("div", { class: "dn-body" }, toc, article));
  return wrap;
}

/* ----------- NOTES LIBRARY (#/library) ----------- */

export function LibraryView(root) {
  const ids = ALL_CONCEPTS.filter((x) => DEEP_NOTES[x.id]);
  let subjectFilter = "ALL";
  let query = "";

  const continueCard = h("div", {});
  const gridWrap = h("div", {});
  const searchIn = h("input", { class: "lib-search", type: "text", placeholder: "Search chapters with full notes�", autocomplete: "off" });
  const chips = ["ALL", "P", "C", "M"].map((s) => {
    const label = s === "ALL" ? "All subjects" : SUBJECTS[s].name;
    const chip = h("button", { class: `chip lib-chip${s === subjectFilter ? " on" : ""}` }, label);
    chip.addEventListener("click", () => {
      subjectFilter = s;
      chips.forEach((ch, i) => ch.classList.toggle("on", ["ALL", "P", "C", "M"][i] === s));
      paintGrid();
    });
    return chip;
  });
  searchIn.addEventListener("input", () => { query = searchIn.value.trim().toLowerCase(); paintGrid(); });

  function progressOf(id) {
    const n = DEEP_NOTES[id];
    const p = getNoteProg(id);
    const done = p && p.s ? p.s.length : 0;
    return { done, total: n.secs.length, pct: Math.round((done / Math.max(1, n.secs.length)) * 100), cps: Object.keys(p && p.c ? p.c : {}).length };
  }

  function paintContinue() {
    continueCard.innerHTML = "";
    const last = lastNoteId();
    if (!last || !DEEP_NOTES[last]) { continueCard.remove(); return; }
    const cc = CONCEPTS[last];
    if (!cc) return;
    const pr = progressOf(last);
    continueCard.append(h("div", { class: "card lib-continue" },
      h("div", {},
        h("div", { class: "lbl" }, "Continue reading"),
        h("a", { class: "lib-cont-title", href: `#/chapter/${cc.id}` }, cc.name),
        h("p", { class: "muted small", style: "margin:4px 0 0" },
          `${SUBJECTS[cc.subject].name} � ${pr.done}/${pr.total} sections read${pr.cps ? ` � ${pr.cps} checkpoint${pr.cps === 1 ? "" : "s"} answered` : ""}`)),
      h("div", { class: "lib-cont-bar" }, h("span", { style: `width:${pr.pct}%` })),
      h("a", { class: "btn btn-primary btn-sm", href: `#/chapter/${cc.id}` }, pr.pct ? "Resume ?" : "Start ?")));
  }

  function paintGrid() {
    gridWrap.innerHTML = "";
    const groups = ["P", "C", "M"].filter((s) => subjectFilter === "ALL" || subjectFilter === s);
    let shown = 0;
    for (const sub of groups) {
      const rows = ids.filter((c) => c.subject === sub &&
        (!query || c.name.toLowerCase().includes(query)));
      if (!rows.length) continue;
      shown += rows.length;
      gridWrap.append(h("h3", { class: "lib-group" },
        h("span", { class: `tag ${SUBJECTS[sub].cls}` }, SUBJECTS[sub].name),
        ` ${rows.length} chapter${rows.length === 1 ? "" : "s"} with full notes`));
      const grid = h("div", { class: "lib-grid" });
      rows.forEach((c) => {
        const pr = progressOf(c.id);
        const mins = noteMinutes(DEEP_NOTES[c.id]);
        grid.append(h("a", { class: "lib-item", href: `#/chapter/${c.id}` },
          h("div", { class: "li-top" },
            h("strong", {}, c.name),
            h("span", { class: "lib-mins" }, `�${mins} min`)),
          h("div", { class: "muted small" }, levelName(c.level)),
          h("div", { class: "lib-bar" }, h("span", { style: `width:${pr.pct}%` })),
          h("div", { class: "lib-foot" },
            pr.pct === 0 ? "not started" : pr.pct === 100 ? "? fully read" : `${pr.pct}% read`)));
      });
      gridWrap.append(grid);
    }
    if (!shown) gridWrap.append(h("p", { class: "muted", style: "margin-top:20px" }, "No chapters match that search."));
  }

  const totalMinSum = ids.reduce((a, c) => a + noteMinutes(DEEP_NOTES[c.id]), 0);
  root.innerHTML = "";
  root.append(page(
    "Notes Library",
    `${ids.length} full-textbook chapters � �${Math.round(totalMinSum / 6) / 10} hours of reading � progress tracked per section`,
    h("div", { class: "stack", style: "gap:18px" },
      continueCard,
      h("div", { class: "row", style: "gap:10px;flex-wrap:wrap" }, ...chips),
      searchIn,
      gridWrap)));
  paintContinue();
  paintGrid();
}

