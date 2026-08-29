/* TeachMeJEE — feature pack: home widgets, duel mode, zen timer, settings modal,
   ghost rivals. Small, self-contained pieces shared across views. */

import { load, todayISO, getStreak, setConfidence, getConfidence, togglePyqStar, addGhost, removeGhost, logDuel, markBackupSaved } from "./store.js";
import { ALL_CONCEPTS, SUBJECTS, TOTAL_XP } from "./data.js";
import { daysUntil } from "./planner.js";
import { getSetting, setSetting, ACCENT_NAMES, chime, startNoise, storageBytes, STORAGE_QUOTA, saveSnapshot, listSnapshots, restoreSnapshot } from "./settings.js";
import { confettiBurst } from "./fx.js";

/* ── 1. Quote rotator (curated, date-seeded) ── */
const QUOTES = [
  ["Rank is a by-product. Process is the product.", "every topper ever"],
  ["You do not rise to the exam. You fall to your preparation.", "exam hall wisdom"],
  ["One chapter a day keeps the drop year away.", "Pip"],
  ["Syllabus is finite. Your consistency is not.", "Pip"],
  ["Toppers are just students who refused to break the streak.", "Pip"],
  ["Concepts compound. So does revision debt.", "Pip"],
  ["The mock you avoid is the lesson you postpone.", "Pip"],
  ["Solve angry, review calm.", "Pip"],
];
export function quoteRotator() {
  const day = Math.floor(Date.now() / 86400000);
  const [text, who] = QUOTES[day % QUOTES.length];
  return h("div", { class: "card quote-card" },
    h("div", { class: "quote-mark" }, "\u201C"),
    h("p", { style: "margin:0;font-weight:650;line-height:1.5" }, text),
    h("p", { class: "small faint", style: "margin:6px 0 0" }, "— " + who));
}

/* ── 2. Did-you-know factlet ── */
const FACTS = [
  "Light takes about 8 minutes 20 seconds to reach Earth from the Sun.",
  "Water is densest at 4 °C — that is why ice floats and lakes freeze top-down.",
  "Your brain uses roughly 20% of your resting energy budget.",
  "Graphene is a single atom thick yet about 200x stronger than steel.",
  "A photon released in the Sun's core can take ~100,000 years to escape the surface.",
  "Octopuses have three hearts and blue blood.",
  "The strongest muscle per gram in your body? The masseter — your jaw.",
  "DNA in all your cells, uncoiled and lined up, would stretch twice the diameter of the solar system.",
  "Sound travels about 4.3 times faster in water than in air.",
  "Honey never spoils — edible pots were found in 3,000-year-old tombs.",
  "Neutron stars spin up to 700 times per second.",
  "Bananas are slightly radioactive — potassium-40. Do not worry.",
  "The Eiffel Tower grows ~15 cm taller on hot summer days.",
  "Hot water can freeze faster than cold under some conditions — the Mpemba effect.",
  "Your stomach lining replaces itself every few days; you literally digest anything else.",
  "There are more possible chess games than atoms in the observable universe.",
];
export function didYouKnow() {
  const idx = new Date().getDate() % FACTS.length;
  return h("div", { class: "card fact-card" },
    h("div", { class: "lbl" }, "DID YOU KNOW"),
    h("p", { class: "small", style: "margin:4px 0 0;line-height:1.55" }, FACTS[idx]));
}

/* ── 3. Milestone bar: lights up each 10% of the roadmap ── */
export function milestoneBar(completed, total) {
  const s = load();
  const pctDone = Math.floor((completed / total) * 10);
  const marks = [];
  for (let i = 1; i <= 10; i++) {
    const hit = i <= pctDone || !!s.milestones[String(i * 10)];
    marks.push(h("span", { class: `mile${hit ? " hit" : ""}`, title: `${i * 10}% milestone` }, i * 10));
  }
  const nextAt = (pctDone + 1) * 10;
  return h("div", { class: "card", style: "padding:13px 16px;margin-top:12px" },
    h("div", { class: "row", style: "justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap" },
      h("span", { class: "lbl", style: "margin:0" }, "MILESTONES"),
      h("span", { class: "small faint" }, `next celebration at ${nextAt}%`)),
    h("div", { style: "display:flex;gap:7px;margin-top:9px;flex-wrap:wrap" }, ...marks));
}

/* ── 4. Streak-at-risk banner ── */
export function streakAtRisk() {
  const s = load();
  const h = new Date().getHours();
  if (h < 18) return null;
  if ((s.activity[todayISO()] || 0) > 0) return null;
  if (getStreak() < 2) return null;
  return h("div", { class: "card risk-banner" },
    h("div", { class: "row", style: "align-items:center;gap:12px" },
      h("span", { class: "boss-glyph" }, "!"),
      h("div", { style: "flex:1;min-width:200px" },
        h("div", { style: "font-weight:700" }, `${getStreak()}-day streak is at risk`),
        h("p", { class: "small muted", style: "margin:2px 0 0" }, "One chapter or one focus session before midnight saves it.")),
      h("a", { class: "btn btn-primary btn-sm", href: "#/roadmap" }, "Save it")));
}

/* ── 5. Hour-precision countdown when close ── */
export function preciseCountdown(p) {
  const dm = daysUntil(p.mainDate);
  if (dm < 0 || dm > 7) return null;
  const target = new Date(p.mainDate + "T09:00:00");
  const ms = target - new Date();
  const days = Math.max(0, Math.floor(ms / 86400000));
  const hrs = Math.max(0, Math.floor((ms % 86400000) / 3600000));
  return h("div", { class: "card exam-week-banner" },
    h("div", { class: "lbl" }, "EXAM WEEK"),
    h("div", { style: "font-size:24px;font-weight:800;font-variant-numeric:tabular-nums" },
      `${days}d ${hrs}h until JEE Main`),
    h("p", { class: "hint", style: "margin:4px 0 0" }, "Sleep > cramming this week. Trust the reps."));
}

/* ── 6. Confidence control (chapter stars) ── */
export function confidenceControl(id, onChange) {
  let cur = getConfidence(id);
  const wrap = h("span", { class: "conf", title: "Your confidence in this chapter" });
  function paint() {
    wrap.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const b = h("button", { class: `conf-star${i <= cur ? " on" : ""}`, title: `${i} star${i > 1 ? "s" : ""}` }, "★");
      b.addEventListener("click", () => {
        cur = cur === i ? 0 : i;
        setConfidence(id, cur);
        paint();
        if (onChange) onChange(cur);
      });
      wrap.append(b);
    }
  }
  paint();
  return wrap;
}

/* ── 7. Peak study hour + subject pie + accuracy spark ── */
export function peakHourWidget() {
  const s = load();
  let best = -1, bestN = 0;
  for (const [hr, n] of Object.entries(s.hourHits || {})) {
    if (n > bestN) { bestN = n; best = +hr; }
  }
  const label = best < 0 ? "—" : best === 0 ? "12 am" : best < 12 ? `${best} am` : best === 12 ? "12 pm" : `${best - 12} pm`;
  return h("div", { class: "stat rec" }, h("div", { class: "k" }, label), h("div", { class: "l" }, "peak study hour"));
}

export function subjectPie(focusSubj) {
  const total = (focusSubj.P || 0) + (focusSubj.C || 0) + (focusSubj.M || 0);
  const el = h("div", { class: "pie-row" });
  const disc = document.createElement("div");
  disc.className = "pie";
  if (!total) {
    disc.style.background = "var(--surface-3)";
    el.append(disc, h("div", { class: "small faint pie-legend" }, "Run timed focus sessions with a subject picked to fill this."));
    return el;
  }
  const segs = [];
  let acc = 0;
  const colors = { P: "var(--phys)", C: "var(--chem)", M: "var(--math)" };
  for (const k of ["P", "C", "M"]) {
    const from = (acc / total) * 100;
    acc += focusSubj[k] || 0;
    const to = (acc / total) * 100;
    segs.push(`${colors[k]} ${from}% ${to}%`);
  }
  disc.style.background = `conic-gradient(${segs.join(", ")})`;
  const legend = h("div", { class: "pie-legend" },
    ...["P", "C", "M"].map((k) =>
      h("div", { class: "pie-leg" },
        h("i", { style: `background:${colors[k]}` }),
        `${SUBJECTS[k].name} · ${focusSubj[k] || 0}m`)));
  el.append(disc, legend);
  return el;
}

export function accuracySpark() {
  const log = load().answerLog || [];
  const recent = log.slice(-14);
  const bars = recent.map((r) => r.ok);
  while (bars.length < 10) bars.unshift(0.5);
  const shown = bars.slice(-14);
  return h("div", {},
    h("div", { class: "spark", title: "Last answers — green correct, red missed" },
      ...shown.map((okv) => h("i", { style: okv === 1 ? "background:var(--green)" : okv === 0 ? "background:var(--red)" : "" }))),
    h("p", { class: "hint", style: "margin-top:6px" }, log.length ? `Last ${recent.length} answers · ${Math.round((recent.filter((r) => r.ok).length / Math.max(1, recent.length)) * 100)}% correct` : "Answer quiz questions to build this."));
}

/* ── 8. Goal velocity card ── */
export function velocityCard() {
  const s = load();
  const done = s.completed.length;
  const remaining = ALL_CONCEPTS.length - done;
  const dAdv = daysUntil(s.planner.advDate);
  const weekKeys = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() - i * 86400000);
    weekKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  const lastWeekChapters = weekKeys.reduce((a, k) => a + (s.dayChapters && s.dayChapters[k] ? s.dayChapters[k] : 0), 0);
  void lastWeekChapters;
  const needPerWeek = dAdv > 0 ? Math.ceil(remaining / (dAdv / 7)) : remaining;
  return h("div", { class: "card", style: "padding:13px 16px" },
    h("div", { class: "row", style: "justify-content:space-between;align-items:baseline" },
      h("span", { class: "lbl", style: "margin:0" }, "PACE CHECK"),
      h("span", { class: "small faint" }, `${remaining} chapters left`)),
    h("p", { class: "small muted", style: "margin:6px 0 0" },
      dAdv > 0
        ? `To finish before JEE Advanced (${fmtDays(dAdv)} away), clear about ${needPerWeek} chapters/week.`
        : "Set an Advanced date in the Planner for pace math."));
}
function fmtDays(n) { return `${n} day${n === 1 ? "" : "s"}`; }

/* ── 9. Ghost rivals ── */
export function ghostCompareCard() {
  const ghosts = load().ghosts || [];
  if (!ghosts.length) return null;
  const meXp = load().completed.reduce((a, id) => {
    const c = ALL_CONCEPTS.find((x) => x.id === id);
    return a + (c ? c.xp : 0);
  }, 0) + (load().bonusXp || 0);
  const rows = ghosts.map((g) => {
    const ahead = meXp >= g.xp;
    const gap = Math.abs(meXp - g.xp);
    return h("div", { class: "modal-row" },
      h("b", {}, g.name),
      h("span", { class: "small " + (ahead ? "" : "muted") }, ahead ? `you lead by ${gap} XP` : `leads you by ${gap} XP`),
      h("button", { class: "btn btn-sm", style: "margin-left:auto", onclick: () => { removeGhost(g.name); } }, "✕"));
  });
  return h("div", { class: "card", style: "padding:13px 16px" },
    h("div", { class: "row", style: "justify-content:space-between;align-items:baseline" },
      h("span", { class: "lbl", style: "margin:0" }, "RIVALS"),
      h("span", { class: "small faint" }, "imported challenge cards")),
    h("div", { class: "stack", style: "gap:6px;margin-top:8px" }, ...rows));
}

/* ── 10. Duel mode (same-device 1v1 quiz) ── */
export function DuelView(root) {
  let p1 = "Player 1", p2 = "Player 2", subjF = "all", turn = 0;
  let scores = [0, 0], qNum = 0;
  const LEN = 5;
  let pool = [], order = [];

  function pageShell(title, subtitle, body) {
    return h("div", {},
      h("div", { class: "stack", style: "gap:6px" },
        h("h1", {}, title),
        subtitle ? h("p", { class: "muted small" }, subtitle) : null),
      h("div", { class: "divider" }),
      body);
  }

  const stage = h("div", { class: "quiz-box", style: "max-width:none" });

  root.innerHTML = "";
  root.append(pageShell("Duel mode", "Two players, one device. Alternate questions — highest score wins.",
    h("div", {},
      (() => {
        const n1 = h("input", { type: "text", value: p1, placeholder: "Player 1" });
        const n2 = h("input", { type: "text", value: p2, placeholder: "Player 2" });
        const sel = h("select", {},
          h("option", { value: "all" }, "All subjects"),
          h("option", { value: "P" }, SUBJECTS.P.name),
          h("option", { value: "C" }, SUBJECTS.C.name),
          h("option", { value: "M" }, SUBJECTS.M.name));
        const startBtn = h("button", { class: "btn btn-primary", onclick: () => {
          p1 = n1.value.trim() || "Player 1"; p2 = n2.value.trim() || "Player 2";
          subjF = sel.value;
          begin();
        } }, "Start duel");
        return h("div", { class: "card row", style: "gap:10px;align-items:center;margin-bottom:16px" }, n1, h("span", { class: "small faint" }, "vs"), n2, sel, startBtn);
      })(),
      stage)));

  function begin() {
    const done = new Set(load().completed);
    let bank = window.__QUESTIONS__ || [];
    bank = bank.filter((q) => subjF === "all" || (q.c && q.c.startsWith(subjF)) || (q.subj === subjF));
    if (bank.length < LEN * 2) bank = bank.concat(window.__PYQ_AS_MCQ__ || []);
    pool = shuffle(bank).slice(0, LEN * 2);
    if (!pool.length) {
      stage.innerHTML = "";
      stage.append(h("div", { class: "empty" }, "No questions available for this filter."));
      return;
    }
    scores = [0, 0]; qNum = 0; turn = 0;
    nextQ();
  }

  function nextQ() {
    stage.innerHTML = "";
    if (qNum >= pool.length) return finish();
    const who = turn % 2;
    const q = pool[qNum];
    stage.append(
      h("div", { class: "duel-turn" },
        h("span", { class: `combo-chip` }, `${who === 0 ? p1 : p2}'s question`),
        h("span", { class: "quiz-best", style: "margin-left:auto" }, `Q${Math.floor(qNum / 2) + 1}/${LEN} · ${p1} ${scores[0]} — ${scores[1]} ${p2}`)),
      h("h2", { style: "margin:10px 0" }, q.q),
      h("div", { class: "stack", style: "gap:8px" },
        ...q.opts.map((o, k) => h("button", { class: "quiz-opt", onclick: (ev) => answer(ev, k, q.a) },
          h("span", { class: "q-key" }, "ABCD"[k]), o))));
  }

  function answer(ev, chosen, correct) {
    [...ev.currentTarget.parentElement.children].forEach((b) => { b.disabled = true; });
    const okk = chosen === correct;
    ev.currentTarget.classList.add(okk ? "correct" : "wrong");
    if (okk) scores[turn % 2]++;
    setTimeout(() => { qNum++; turn++; nextQ(); }, 900);
  }

  function finish() {
    const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? p1 : p2;
    logDuel(p1, scores[0], p2, scores[1]);
    stage.innerHTML = "";
    stage.append(h("div", { class: "quiz-result" },
      h("div", { class: "big" }, `${scores[0]} – ${scores[1]}`),
      h("p", { class: "muted" }, winner ? `${winner} takes the duel.` : "Dead heat. Rematch?"),
      h("div", { style: "margin-top:14px" },
        h("button", { class: "btn btn-primary", onclick: () => DuelView(root) }, "Rematch"))));
    confettiBurst(innerWidth / 2, innerHeight * 0.3, 80);
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Injects question sources so duel works without importing quiz banks here. */
export function feedDuelQuestions(questions, pyqs) {
  window.__QUESTIONS__ = questions.map((q) => ({ q: q.q, opts: q.opts, a: q.a, c: q.c }));
  window.__PYQ_AS_MCQ__ = pyqs.map((q) => ({ q: q.q, opts: q.opts, a: q.a, c: q.chap, subj: q.subject }));
}

/* ── 11. Zen overlay ── */
let zenState = null;
export function zenToggle(mins = 25) {
  if (zenState) { zenExit(); return; }
  const overlay = h("div", { class: "zen-overlay" });
  const timeEl = h("div", { class: "zen-time" }, fmtZen(mins * 60));
  const hint = h("div", { class: "hint" }, "Esc to exit · space to pause");
  overlay.append(timeEl, hint);
  document.body.append(overlay);
  zenState = { remaining: mins * 60, paused: false, iv: setInterval(() => {
    if (zenState.paused) return;
    zenState.remaining--;
    timeEl.textContent = fmtZen(Math.max(0, zenState.remaining));
    if (zenState.remaining <= 0) {
      chime("done");
      try { import("./store.js").then((m) => { m.logFocusMin(mins); m.addEvent(`Zen session: ${mins} min`); }); } catch {}
      zenExit();
    }
  }, 1000), keydown };
  function keydown(ev) {
    if (ev.key === "Escape") zenExit();
    if (ev.code === "Space") { ev.preventDefault(); if (zenState) zenState.paused = !zenState.paused; }
  }
  document.addEventListener("keydown", keydown);
  zenState.keydown = keydown;
}
function zenExit() {
  if (!zenState) return;
  clearInterval(zenState.iv);
  document.removeEventListener("keydown", zenState.keydown);
  document.querySelector(".zen-overlay")?.remove();
  zenState = null;
}
function fmtZen(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

/* ── 12. Settings modal ── */
export function openSettings(onApplied) {
  if (document.querySelector(".settings-overlay")) return;
  const u = {};
  const overlay = h("div", { class: "modal-overlay settings-overlay" });
  const modal = h("div", { class: "modal settings-modal", style: "width:520px;text-align:left" });

  modal.append(h("h2", {}, "Settings"));

  /* General */
  const fontSel = selectRow("Text size", [["sm", "Small"], ["md", "Comfortable"], ["lg", "Large"]], getSetting("fontScale"), (v) => setSetting("fontScale", v));
  const densSel = selectRow("Density", [["cozy", "Cozy"], ["compact", "Compact"]], getSetting("density"), (v) => setSetting("density", v));
  const accentRow = h("div", { class: "field" }, h("label", { class: "lbl" }, "Accent colour"));
  const swatches = h("div", { class: "swatch-row" });
  for (const name of ACCENT_NAMES) {
    const b = h("button", { class: `swatch sw-${name}${getSetting("accent") === name ? " on" : ""}`, title: name });
    b.addEventListener("click", () => { setSetting("accent", name); [...swatches.children].forEach((x) => x.classList.remove("on")); b.classList.add("on"); if (onApplied) onApplied(); });
    swatches.append(b);
  }
  accentRow.append(swatches);
  const autoThemeCb = checkRow("Auto dark theme at night (7pm–6am)", getSetting("themeAuto"), (v) => setSetting("themeAuto", v));

  /* Sound */
  const soundCb = checkRow("Sounds (chimes)", getSetting("sound"), (v) => { setSetting("sound", v); if (!v) startNoise("off"); });
  const noiseRow = selectRow("Study noise", [["off", "Silence"], ["brown", "Brown noise"], ["rain", "Rain"], ["white", "White noise"]],
    getSetting("noise"), (v) => setSetting("noise", v));
  const voiceCb = checkRow("Pip reads answers aloud", getSetting("voice"), (v) => setSetting("voice", v));

  modal.append(
    h("h3", { style: "margin:14px 0 8px" }, "Appearance"),
    fontSel, densSel, accentRow, autoThemeCb,
    h("h3", { style: "margin:18px 0 8px" }, "Sound"),
    soundCb, noiseRow, voiceCb);

  /* Data */
  const used = storageBytes();
  const pct = Math.min(100, Math.round((used / STORAGE_QUOTA) * 100));
  const meter = h("div", { class: "rank-bar" }, h("i", { style: `width:${Math.max(2, pct)}%` }));
  modal.append(
    h("h3", { style: "margin:18px 0 8px" }, "Data"),
    h("div", { class: "field" },
      h("label", { class: "lbl" }, `Storage used — ${(used / 1024).toFixed(0)} KB of ~${(STORAGE_QUOTA / 1024 / 1024).toFixed(0)} MB (${pct}%)`),
      meter),
    (() => {
      const btn = h("button", { class: "btn btn-sm", onclick: () => {
        const stamp = saveSnapshot();
        markBackupSaved();
        makeToastLocal(`Snapshot saved ${stamp.slice(11)}`);
        snapsWrap.innerHTML = "";
        renderSnaps(snapsWrap);
      } }, "Save snapshot now");
      const snapsWrap = h("div", { class: "stack", style: "gap:6px;margin-top:8px" });
      renderSnaps(snapsWrap);
      return h("div", { class: "field" }, h("label", { class: "lbl" }, "Snapshots (two rotating slots, stored locally)"), btn, snapsWrap);
    })(),
    (() => {
      const ta = h("textarea", { class: "note-editor", style: "min-height:70px", placeholder: "Paste a rival's challenge card JSON…" });
      const impBtn = h("button", { class: "btn btn-sm", onclick: () => {
        try {
          const data = JSON.parse(ta.value);
          if (!data.name) throw new Error("bad");
          addGhost({ name: String(data.name).slice(0, 20), xp: +data.xp || 0, chapters: +data.chapters || 0, streak: +data.streak || 0, bestQuiz: +data.bestQuiz || 0 });
          makeToastLocal(`${data.name} added as rival.`);
          ta.value = "";
        } catch { makeToastLocal("That card did not parse."); }
      } }, "Add rival");
      const copyBtn = h("button", { class: "btn btn-sm", onclick: () => {
        const s = load();
        const card = { name: getSessionName() || "Guest", xp: s.completed.reduce((a, id) => a + (window.__CONCEPT_MAP__[id]?.xp || 0), 0) + (s.bonusXp || 0), chapters: s.completed.length, streak: getStreak(), bestQuiz: (s.quizBest && s.quizBest.best) || 0 };
        navigator.clipboard?.writeText(JSON.stringify(card)).then(() => makeToastLocal("Challenge card copied."), () => {});
      } }, "Copy my challenge card");
      return h("div", { class: "field" },
        h("label", { class: "lbl" }, "Rivals"),
        h("div", { class: "row", style: "gap:8px;margin-bottom:8px" }, copyBtn, impBtn),
        ta);
    })());

  const closeBtn = h("button", { class: "btn btn-primary", style: "width:100%;margin-top:14px" }, "Done");
  closeBtn.addEventListener("click", () => overlay.remove());
  modal.append(closeBtn);
  overlay.append(modal);
  overlay.addEventListener("mousedown", (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.append(overlay);

  function renderSnaps(wrapEl) {
    const snaps = listSnapshots();
    if (!snaps.length) { wrapEl.append(h("p", { class: "hint", style: "margin:4px 0 0" }, "No snapshots yet.")); return; }
    for (const sn of snaps) {
      wrapEl.append(h("div", { class: "modal-row" },
        h("span", { class: "mono small" }, sn.label),
        h("span", { class: "small faint" }, `${sn.chapters} chapters`),
        h("button", { class: "btn btn-sm", style: "margin-left:auto", onclick: () => {
          if (restoreSnapshot(sn.slot)) { makeToastLocal("Snapshot restored."); if (onApplied) onApplied(); }
          else makeToastLocal("Restore failed.");
        } }, "Restore")));
    }
  }

  function selectRow(label, opts, val, onch) {
    const sel = h("select", { onchange: (ev) => onch(ev.target.value) },
      ...opts.map(([v, t]) => h("option", { value: v, selected: v === val ? "" : null }, t)));
    return h("div", { class: "field" }, h("label", { class: "lbl" }, label), sel);
  }
  function checkRow(label, val, onch) {
    const cb = h("input", { type: "checkbox", checked: !!val, onchange: (ev) => onch(ev.target.checked) });
    return h("label", { style: "display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--text);cursor:pointer;margin-bottom:10px" }, cb, label);
  }
  function getSessionName() {
    try { return JSON.parse(localStorage.getItem("tmj_session")).username; } catch { return null; }
  }
  function makeToastLocal(msg) {
    const t = document.createElement("div");
    t.className = "toast good";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }
}

/* Titles derived from badges — displayed in settings About block. */
const TITLE_MAP = [
  ["ace", "Ace"], ["blaze", "Unstoppable"], ["all", "Legend"], ["half", "Halfway Hero"],
  ["ten", "Decader"], ["sharp", "Sharpshooter"], ["focus", "Deep Worker"], ["analyst", "Analyst"],
  ["fire", "On Fire"], ["scribe", "Scribe"], ["curator", "Curator"], ["first", "Fresh Start"],
];
export function earnedTitles() {
  const s = load();
  const count = s.completed.length;
  const best = (s.quizBest && s.quizBest.best) || 0;
  const practiced = (s.quizBest && s.quizBest.practiced) || 0;
  const streak = getStreak();
  const focusTotal = Object.values(s.focusLog || {}).reduce((a, b) => a + b, 0);
  const okSet = new Set([
    ["ace", best >= 8], ["blaze", streak >= 7], ["all", count >= ALL_CONCEPTS.length],
    ["half", count >= ALL_CONCEPTS.length / 2], ["ten", count >= 10], ["sharp", practiced >= 50],
    ["focus", focusTotal >= 120], ["analyst", (s.mocks || []).length >= 5], ["fire", streak >= 3],
    ["scribe", Object.keys(s.notes).length >= 1], ["curator", s.starred.length >= 1], ["first", count >= 1],
  ].filter(([, ok]) => ok).map(([id]) => id));
  return TITLE_MAP.filter(([id]) => okSet.has(id)).map(([, title]) => title);
}

function h(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}
