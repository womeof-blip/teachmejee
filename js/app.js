/* TeachMeJEE — entry point: router + palette + theme + backup + shortcuts */

import { resetAll, setTheme, applyTheme, exportData, importData, switchUser } from "./store.js";
import { ALL_CONCEPTS, CONCEPTS } from "./data.js";
import { QUESTIONS } from "./questions.js";
import { PYQS } from "./pyq.js";
import { applySettings, chime } from "./settings.js";
import {
  HomeView, DailyChallengeView, RoadmapView, ChapterView, FlowchartView,
  BrowseView, FormulasView, PlannerView, QuizView, FlashView,
  PredictorView, AnalyticsView, QuestsView, LeaderboardView, AuthView,
  NotesView, BookmarksView, WeakAreasView, RevisionsView, ProgressView,
  RecommendationsView, MasteryView, StatsView, AchievementsView, CalendarView,
  PYQView, NeetView, WelcomeView, TutorView, buildTutorChat, VideosView, FoundationView, LibraryView, refreshXP, disposeActiveSim, ConstellationView, LabsView, PlaygroundView, PeriodicView, DerivationView, AtlasView, MoleculeView, GraphView, BoardView, ThemeView, StudyPlanView, WeightageView, InsightView, ToolsView, FilesView,   GitJEEView, DashboardView, SprintView, DesmosView,
} from "./views.js";
import { DuelView, openSettings, zenToggle, feedDuelQuestions } from "./extras.js";
import { isLoggedIn, getSession, logout, syncProgress } from "./api.js";

const app = document.getElementById("app");

const VIEWS_MAP = {
  home: HomeView,
  welcome: WelcomeView,
  foundation: FoundationView,
  tutor: TutorView,
  daily: DailyChallengeView,
  roadmap: RoadmapView,
  library: LibraryView,
  constellation: ConstellationView,
  labs: LabsView,
  playground: PlaygroundView,
  periodic: PeriodicView,
  derivations: DerivationView,
  atlas: AtlasView,
  molecules: MoleculeView,
  graph: GraphView,
  board: BoardView,
  theme: ThemeView,
  studyplan: StudyPlanView,
  weightage: WeightageView,
  insight: InsightView,
  tools: ToolsView,
  files: FilesView,
  gitjee: GitJEEView,
  dashboard: DashboardView,
  sprint: SprintView,
  desmos: DesmosView,
  flowchart: FlowchartView,
  browse: BrowseView,
  pyq: PYQView,
  duel: DuelView,
  videos: VideosView,
  formulas: FormulasView,
  flash: FlashView,
  quiz: QuizView,
  planner: PlannerView,
  analytics: AnalyticsView,
  predictor: PredictorView,
  quests: QuestsView,
  leaderboard: LeaderboardView,
  login: AuthView,
  neet: NeetView,
  notes: NotesView,
  bookmarks: BookmarksView,
  weak: WeakAreasView,
  revisions: RevisionsView,
  progress: ProgressView,
  recommendations: RecommendationsView,
  mastery: MasteryView,
  stats: StatsView,
  achievements: AchievementsView,
  calendar: CalendarView,
};

function setActiveNav(route) {
  document.querySelectorAll("#sideNav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  const [name, param] = hash.split("/");
  setActiveNav(name === "chapter" ? "roadmap" : name);
  refreshXP();
  refreshUserChip();

  app.innerHTML = "";
  disposeActiveSim();

  try {
    if (name === "chapter" && param) ChapterView(app, param);
    else if (VIEWS_MAP[name]) VIEWS_MAP[name](app);
    else HomeView(app);
  } catch (e) {
    app.innerHTML = "";
    const card = hEl("div", { class: "card", style: "border-color:color-mix(in srgb,var(--red) 45%,transparent)" },
      hEl("h2", {}, "Something broke in this view"),
      hEl("p", { class: "small muted" }, e.message));
    const retry = hEl("button", { class: "btn btn-primary btn-sm", style: "margin-top:12px" }, "Retry");
    retry.addEventListener("click", () => route());
    card.append(retry);
    app.append(card);
  }

  window.scrollTo(0, 0);

  app.classList.remove("route-enter");
  void app.offsetWidth;
  app.classList.add("route-enter");

  if (name === "leaderboard") syncProgress().catch(() => {});
}
window.addEventListener("hashchange", route);

/* Globals for extras (duel question feed + challenge cards). */
window.__CONCEPT_MAP__ = CONCEPTS;
feedDuelQuestions(QUESTIONS, PYQS);
applySettings();
window.addEventListener("tmj-levelup", () => chime("level"));
window.addEventListener("tmj-bossclear", () => chime("level"));

/* ── Service worker: fresh code always wins; prompt once when an update arrives ── */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    try { sessionStorage.removeItem("tmj_sw_prompted"); } catch {}
    location.reload();
  });
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          try { if (sessionStorage.getItem("tmj_sw_prompted")) return; sessionStorage.setItem("tmj_sw_prompted", "1"); } catch {}
          const t = hEl("div", { class: "toast good" }, "New version ready");
          const b = hEl("button", { class: "chip", style: "margin-left:10px" }, "Reload");
          b.addEventListener("click", () => { sw.postMessage("SKIP_WAITING"); });
          t.append(b);
          document.body.append(t);
          setTimeout(() => t.remove(), 8000);
        }
      });
    });
  }).catch(() => {});
}

/* file:// can't run ES-module imports — guide instead of a blank page. */
if (location.protocol === "file:") {
  app.innerHTML = "";
  app.append(hEl("div", { class: "card", style: "max-width:560px;margin:40px auto;text-align:center;padding:30px" },
    hEl("h2", {}, "Almost there"),
    hEl("p", { class: "muted small" }, "TeachMeJEE uses ES modules, which browsers block on file:// links. Run the bundled server and open the local URL instead:"),
    hEl("p", { class: "mono small" }, "node server.js   →   http://localhost:8000")));
} else {
  if (!location.hash) location.hash = "#/home";
  try { route(); } catch (e) {
    app.innerHTML = "";
    const card = hEl("div", { class: "card" },
      hEl("h2", {}, "Startup hiccup"),
      hEl("p", { class: "small muted" }, e.message));
    const retry = hEl("button", { class: "btn btn-primary btn-sm", style: "margin-top:10px" }, "Retry");
    retry.addEventListener("click", () => route());
    card.append(retry);
    app.append(card);
  }
}

/* Scroll parallax — one live listener, elements re-queried per frame. */
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  let plxTick = false;
  window.addEventListener("scroll", () => {
    if (plxTick) return;
    plxTick = true;
    requestAnimationFrame(() => {
      plxTick = false;
      const sy = scrollY;
      document.querySelectorAll("[data-plx]").forEach((el) => {
        el.style.transform = `translateY(${(sy * parseFloat(el.dataset.plx)).toFixed(1)}px)`;
      });
    });
  }, { passive: true });
}

/* Progress sync trigger — views dispatch "tmj-progress" after meaningful actions. */
let lastSync = 0;
window.addEventListener("tmj-progress", () => {
  if (!isLoggedIn()) return;
  const now = Date.now();
  if (now - lastSync < 20000) return;
  lastSync = now;
  syncProgress().catch(() => {});
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset ALL progress, notes and settings on this device?")) {
    resetAll();
    route();
  }
});

/* Theme */
applyTheme();
const themeBtn = document.getElementById("themeBtn");
function paintThemeBtn() {
  themeBtn.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "☾" : "☀";
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  setTheme(next);
  paintThemeBtn();
});
paintThemeBtn();

/* User chip */
function refreshUserChip() {
  const chip = document.getElementById("userChip");
  if (!chip) return;
  const s = isLoggedIn() ? getSession() : null;
  chip.innerHTML = "";
  if (s) {
    chip.append(
      hEl("span", { class: "uc-avatar" }, (s.username[0] || "?").toUpperCase()),
      hEl("span", { class: "uc-name" }, s.username),
      hEl("button", { title: "Log out" }, "Log out"));
    chip.lastElementChild.addEventListener("click", async () => {
      await logout().catch(() => {});
      switchUser();
      refreshUserChip();
      route();
    });
  } else {
    chip.append(
      hEl("span", { class: "uc-avatar" }, "G"),
      hEl("span", { class: "uc-name" }, "Guest"),
      hEl("button", { title: "Create a leaderboard account" }, "Join"));
    chip.lastElementChild.addEventListener("click", () => { location.hash = "#/login"; });
  }
}

/* ─────────── Command palette ─────────── */

const PALETTE_VIEWS = [
  ["#/welcome", "Welcome tour"],
  ["#/home", "Home"],
  ["#/tutor", "Ask Pip (study brain)"],
  ["#/foundation", "Class 9-10 launchpad"],
  ["#/daily", "Daily challenge"],
  ["#/roadmap", "The journey (roadmap)"],
  ["#/library", "Notes library (full textbook notes)"],
  ["#/constellation", "Constellation Map (live graph)"],
  ["#/labs", "Labs — Future Protocols"],
  ["#/playground", "Formula Playground (sliders)"],
  ["#/periodic", "Periodic Table (interactive)"],
  ["#/derivations", "Derivation Theatre (animated)"],
  ["#/atlas", "Feature Atlas — 1000× (searchable)"],
  ["#/molecules", "Molecule Viewer 3D"],
  ["#/graph", "Graph Playground (Desmos-like)"],
  ["#/board", "Whiteboard (per chapter)"],
  ["#/theme", "Theme Studio"],
  ["#/quests", "Quest board"],
  ["#/browse", "Browse chapters"],
  ["#/pyq", "JEE previous year questions"],
  ["#/videos", "Video lectures"],
  ["#/neet", "NEET hub"],
  ["#/formulas", "Formula sheet"],
  ["#/flash", "Flash revision"],
  ["#/quiz", "Practice quiz"],
  ["#/planner", "Planner & focus timer"],
  ["#/analytics", "Analytics"],
  ["#/predictor", "Rank predictor"],
  ["#/calendar", "Study calendar"],
  ["#/stats", "Statistics"],
  ["#/achievements", "Achievements"],
  ["#/notes", "Notes"],
  ["#/bookmarks", "Bookmarks"],
  ["#/revisions", "Revisions due"],
  ["#/weak", "Weak areas"],
  ["#/mastery", "Mastery map"],
  ["#/recommendations", "Recommended next"],
  ["#/progress", "Subject progress"],
  ["#/leaderboard", "Leaderboard"],
];
const SUBJECT_NAME = { P: "Physics", C: "Chemistry", M: "Maths" };

const recentRoutes = [];
const ORIG_ROUTE = route;
route = function (...args) {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  const name = hash.split("/")[0];
  if (!recentRoutes.includes(name)) recentRoutes.unshift(name);
  if (recentRoutes.length > 6) recentRoutes.pop();
  return ORIG_ROUTE.apply(this, args);
};

function buildPaletteItems(q) {
  const t = q.trim().toLowerCase();
  const items = [];
  if (!t) {
    for (const name of recentRoutes.slice(0, 5)) {
      const hit = PALETTE_VIEWS.find(([href]) => href === "#/" + name);
      if (hit) items.push({ href: hit[0], name: hit[1], sub: "Recent" });
    }
    for (const [href, label] of PALETTE_VIEWS) {
      if (!items.some((it) => it.href === href)) items.push({ href, name: label, sub: "Page" });
    }
    return items.slice(0, 50);
  }
  for (const [href, label] of PALETTE_VIEWS) {
    if (label.toLowerCase().includes(t)) items.push({ href, name: label, sub: "Page" });
  }
  for (const c of ALL_CONCEPTS) {
    if (`${c.name} ${c.subject}`.toLowerCase().includes(t)) {
      items.push({ href: `#/chapter/${c.id}`, name: c.name, sub: `${SUBJECT_NAME[c.subject] || c.subject} · L${c.level} · ${c.xp} XP` });
      continue;
    }
    for (const p of c.points) {
      if (p.toLowerCase().includes(t)) {
        items.push({ href: `#/chapter/${c.id}`, name: c.name, sub: "…" + p.slice(Math.max(0, p.toLowerCase().indexOf(t) - 12), p.toLowerCase().indexOf(t) + 40) + "…" });
        break;
      }
    }
  }
  return items.slice(0, 50);
}

let paletteOpen = false;
function openPalette() {
  if (paletteOpen) return;
  paletteOpen = true;
  const overlay = hEl("div", { class: "palette-overlay" });
  const input = hEl("input", { type: "text", placeholder: "Search pages and chapters…  (◉ voice)", autocomplete: "off" });
  const micBtn = hEl("button", { class: "btn btn-sm", title: "Voice search", style:"position:absolute;right:10px;top:9px" }, "◉");
  const inputWrap = hEl("div", { style:"position:relative;display:flex;align-items:center" }, input, micBtn);
  input.style.flex="1"; input.style.paddingRight="42px";
  const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if(!hasSpeech) micBtn.style.opacity=".45";
  micBtn.addEventListener("click", ()=>{
    const SR= window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ input.placeholder="Voice not supported"; return; }
    const rec=new SR(); rec.lang="en-IN"; rec.interimResults=false; rec.maxAlternatives=1;
    micBtn.textContent="●"; micBtn.disabled=true;
    rec.onresult=e=>{ const t=e.results[0][0].transcript; input.value=t; sel=0; renderItems(t); input.focus(); };
    rec.onerror=()=>{ micBtn.textContent="◉"; micBtn.disabled=false; };
    rec.onend=()=>{ micBtn.textContent="◉"; micBtn.disabled=false; };
    rec.start();
  });
  const list = hEl("div", { class: "palette-list" });
  const box = hEl("div", { class: "palette" });
  box.append(inputWrap, list,
    hEl("div", { class: "palette-foot" },
      hEl("span", {}, "↑↓ navigate · Enter open · Esc close · ◉ voice"),
      hEl("span", {}, "? for all shortcuts")));
  overlay.append(box);
  document.body.append(overlay);
  input.focus();

  let sel = 0;
  let items = [];

  function renderItems(q) {
    items = buildPaletteItems(q);
    list.innerHTML = "";
    if (!items.length) {
      list.append(hEl("div", { class: "palette-empty" }, "No matches."));
      return;
    }
    items.forEach((it, i) => {
      const row = hEl("div", { class: `palette-item${i === sel ? " sel" : ""}` },
        hEl("span", { class: "pi-name" }, it.name),
        hEl("span", { class: "pi-kind" }, it.sub));
      row.addEventListener("mousemove", () => { sel = i; highlight(); });
      row.addEventListener("click", () => go(it));
      list.append(row);
    });
  }
  function highlight() {
    [...list.children].forEach((el, i) => el.classList.toggle("sel", i === sel));
    const cur = list.children[sel];
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
  }
  function go(it) {
    closePalette();
    location.hash = it.href;
  }
  function closePalette() {
    if (!paletteOpen) return;
    paletteOpen = false;
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  }
  function onKey(ev) {
    if (ev.key === "Escape") { closePalette(); return; }
    if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(items.length - 1, sel + 1); highlight(); return; }
    if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(0, sel - 1); highlight(); return; }
    if (ev.key === "Enter" && items.length) { ev.preventDefault(); go(items[sel]); }
  }

  input.addEventListener("input", () => { sel = 0; renderItems(input.value); });
  overlay.addEventListener("mousedown", (ev) => { if (ev.target === overlay) closePalette(); });
  document.addEventListener("keydown", onKey);
  renderItems("");
}

document.getElementById("paletteBtn").addEventListener("click", openPalette);

/* ─────────── Shortcuts modal (?) ─────────── */

function openShortcuts() {
  if (document.querySelector(".modal-overlay")) return;
  const rows = [
    ["Search everything", ["Ctrl", "K"]],
    ["Answer quiz option", ["1", "–", "4"]],
    ["Advance / continue", ["Enter"]],
    ["Close overlays", ["Esc"]],
    ["This shortcut sheet", ["?"]],
    ["Toggle theme", ["◐ button"]],
  ];
  const overlay = hEl("div", { class: "modal-overlay" });
  const modal = hEl("div", { class: "modal" });
  modal.append(hEl("h2", {}, "Keyboard shortcuts"));
  const list = hEl("div", { class: "shortcut-list" });
  for (const [label, keys] of rows) {
    const keyBox = hEl("span", { class: "shortcut-keys" });
    for (const k of keys) keyBox.append(hEl("kbd", {}, k));
    list.append(hEl("div", { class: "shortcut-row" }, hEl("span", {}, label), keyBox));
  }
  modal.append(list);
  const closeBtn = hEl("button", { class: "btn btn-primary", style: "width:100%" }, "Got it");
  closeBtn.addEventListener("click", () => overlay.remove());
  modal.append(closeBtn);
  overlay.append(modal);
  overlay.addEventListener("mousedown", (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.append(overlay);
}

document.addEventListener("keydown", (ev) => {
  const tag = ev.target && ev.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (ev.key === "?" && !ev.ctrlKey && !ev.metaKey) openShortcuts();
  if (ev.key === "f" && !ev.ctrlKey && !ev.metaKey) zenToggle(25);
  if (ev.key === "," && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); openSettings(route); }
  if (!chord.active && ev.key.toLowerCase() === "g" && !ev.ctrlKey && !ev.metaKey) {
    chord.active = true;
    setTimeout(() => { chord.active = false; }, 1200);
    return;
  }
  if (chord.active) {
    chord.active = false;
    const map = { h: "#/home", r: "#/roadmap", j: "#/journey", q: "#/quiz", p: "#/planner", d: "#/daily", v: "#/videos", n: "#/neet", t: "#/tutor", b: "#/browse", y: "#/pyq", s: "#/stats", a: "#/analytics", l: "#/library" };
    const dest = map[ev.key.toLowerCase()];
    if (dest) { ev.preventDefault(); location.hash = dest; }
    return;
  }
  if (ev.key.toLowerCase() === "k" && (ev.ctrlKey || ev.metaKey)) {
    ev.preventDefault();
    openPalette();
  }
});
const chord = { active: false };

/* ─────────── Backup ─────────── */

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `teachmejee-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
const importFile = document.getElementById("importFile");
document.getElementById("importBtn").addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  const f = importFile.files && importFile.files[0];
  importFile.value = "";
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (importData(reader.result)) {
      applyTheme();
      paintThemeBtn();
      route();
      makeToastLocal("Backup restored.");
    } else {
      alert("That file doesn't look like a valid TeachMeJEE backup.");
    }
  };
  reader.readAsText(f);
});

function hEl(tag, props = {}, text) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) e.setAttribute(k, v);
  if (text != null) e.append(document.createTextNode(String(text)));
  return e;
}

function makeToastLocal(msg) {
  const t = hEl("div", { class: "toast good" }, msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* ─────────── Pip floating orb ─────────── */

function openPip() {
  if (document.querySelector(".pip-overlay")) return;
  const overlay = hEl("div", { class: "pip-overlay" });
  const panel = hEl("div", { class: "pip-panel" });
  const closeBtn = hEl("button", { class: "pip-close", title: "Close", "aria-label": "Close chat" }, "×");
  closeBtn.addEventListener("click", () => overlay.remove());
  panel.append(closeBtn);
  panel.append(buildTutorChat());
  overlay.append(panel);
  overlay.addEventListener("mousedown", (ev) => { if (ev.target === overlay) overlay.remove(); });
  document.body.append(overlay);
  const inp = overlay.querySelector("input");
  if (inp) inp.focus();
}
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") {
    const ov = document.querySelector(".pip-overlay");
    if (ov) ov.remove();
  }
});

const pipFab = hEl("button", { class: "fab-pip", title: "Ask Pip — offline study brain", "aria-label": "Ask Pip" });
pipFab.append(hEl("span", { class: "fab-orb" }, "P"));
pipFab.addEventListener("click", () => {
  if (location.hash !== "#/tutor") openPip();
});
document.body.append(pipFab);

/* ─────────── Content protection deterrents ───────────
   Client-side guards can only discourage casual copying, not prevent a determined user.
   Hold Shift while clicking / pressing keys to bypass for legitimate debugging. */
const guardBypassed = (ev) => ev.shiftKey;

document.addEventListener("contextmenu", (ev) => {
  if (!guardBypassed(ev)) ev.preventDefault();
});

document.addEventListener("copy", (ev) => {
  if (guardBypassed(ev)) return;
  const sel = String(getSelection() || "");
  const tag = ev.target && ev.target.tagName;
  const editable = tag === "INPUT" || tag === "TEXTAREA";
  if (!editable && sel.length > 160) {
    ev.preventDefault();
    ev.clipboardData.setData("text/plain", "Content from TeachMeJEE — copying long passages is disabled.");
    const t = hEl("div", { class: "toast" }, "Long-form copying is disabled.");
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }
});

document.addEventListener("dragstart", (ev) => {
  if (ev.target && (ev.target.tagName === "IMG" || ev.target.tagName === "svg")) ev.preventDefault();
});

document.addEventListener("keydown", (ev) => {
  if (guardBypassed(ev)) return;
  const k = ev.key;
  if (k === "F12") { ev.preventDefault(); return; }
  if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey && ["I", "J", "C"].includes(k.toUpperCase())) { ev.preventDefault(); return; }
  if ((ev.ctrlKey || ev.metaKey) && k.toLowerCase() === "u") ev.preventDefault();
});

try {
  console.log("%cTeachMeJEE %cby Tanush Saha",
    "background:#f2a33c;color:#231503;font-weight:800;padding:3px 10px;border-radius:6px 0 0 6px",
    "background:#241c12;color:#f5eddc;padding:3px 10px;border-radius:0 6px 6px 0");
  console.log("%cOriginal coursework. Source is authored, not copied — please respect that.",
    "color:#97835f;font-style:italic");
} catch {}
