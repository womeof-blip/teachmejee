/* TeachMeJEE — UI settings, sound engine, snapshots, storage meter.
   Stored separately from study progress under tmj_ui so resets never nuke taste. */

const UI_KEY = "tmj_ui";
const SNAP_PREFIX = "tmj_snap_";
export const SUBJECT_KEYS = ["P", "C", "M"];

const DEFAULTS_UI = {
  fontScale: "md",
  density: "cozy",
  accent: "amber",
  themeAuto: false,
  sound: true,
  noise: "off",
  voice: false,
  collapsed: false,
};

let ui = null;
function loadUI() {
  if (ui) return ui;
  try {
    ui = { ...DEFAULTS_UI, ...(JSON.parse(localStorage.getItem(UI_KEY)) || {}) };
  } catch { ui = { ...DEFAULTS_UI }; }
  return ui;
}
function saveUI() {
  try { localStorage.setItem(UI_KEY, JSON.stringify(loadUI())); } catch {}
}
export function getSetting(k) { return loadUI()[k]; }
export function setSetting(k, v) {
  loadUI()[k] = v;
  saveUI();
  applySettings();
}

const ACCENTS = {
  amber: ["#f2a33c", "#ffc476"],
  coral: ["#ef7059", "#ff9d8a"],
  moss: ["#8fbf6f", "#b9e08f"],
  sky: ["#5da2d9", "#8ec5f0"],
  slate: ["#a3aec9", "#cdd5e8"],
};
export const ACCENT_NAMES = Object.keys(ACCENTS);

export function applySettings() {
  try {
    const u = loadUI();
    const rootEl = document.documentElement;
    if (!rootEl || !rootEl.dataset) return;
    rootEl.dataset.fontScale = u.fontScale;
  rootEl.dataset.density = u.density;
  const [a1, a2] = ACCENTS[u.accent] || ACCENTS.amber;
  rootEl.style.setProperty("--accent", a1);
  rootEl.style.setProperty("--accent-2", a2);
  if (u.collapsed) rootEl.classList.add("side-collapsed");
  else rootEl.classList.remove("side-collapsed");

    if (u.themeAuto && typeof window !== "undefined") {
      const h = new Date().getHours();
      const want = h >= 19 || h < 6 ? "dark" : "light";
      if (rootEl.getAttribute("data-theme") !== want) {
        rootEl.setAttribute("data-theme", want);
        try {
          import("./store.js").then((m) => { m.setTheme(want); }).catch(() => {});
        } catch {}
        const tb = document.getElementById("themeBtn");
        if (tb) tb.textContent = want === "light" ? "☾" : "☀";
      }
    }
    stopNoise();
    if (u.noise !== "off" && u.sound) startNoise(u.noise);
  } catch {}
}

/* ── WebAudio: chime + generated study noise (no audio files) ── */
let actx = null;
function ctx() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
  }
  if (actx.state === "suspended") actx.resume().catch(() => {});
  return actx;
}
export function chime(kind = "done") {
  if (!loadUI().sound) return;
  const c = ctx();
  if (!c) return;
  const notes = kind === "level" ? [523.25, 659.25, 783.99, 1046.5] : kind === "bad" ? [392, 311] : [659.25, 987.77];
  notes.forEach((f, i) => {
    const o = c.createOscillator();
    const gn = c.createGain();
    o.type = "sine";
    o.frequency.value = f;
    const t0 = c.currentTime + i * 0.09;
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    o.connect(gn).connect(c.destination);
    o.start(t0);
    o.stop(t0 + 0.55);
  });
}

let noiseNodes = null;
export function startNoise(kind) {
  stopNoise();
  if (kind === "off" || !loadUI().sound) return;
  const c = ctx();
  if (!c) return;
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "brown") {
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.2;
    } else if (kind === "rain") {
      data[i] = (Math.random() * 2 - 1) * 0.4 + (Math.random() < 0.002 ? (Math.random() * 2 - 1) : 0);
    } else {
      data[i] = white * 0.25;
    }
  }
  const srcNode = c.createBufferSource();
  srcNode.buffer = buf;
  srcNode.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = kind === "rain" ? "bandpass" : "lowpass";
  filter.frequency.value = kind === "rain" ? 1400 : 700;
  const gain = c.createGain();
  gain.gain.value = 0.05;
  srcNode.connect(filter).connect(gain).connect(c.destination);
  srcNode.start();
  noiseNodes = { srcNode, gain };
}
export function stopNoise() {
  if (noiseNodes) {
    try { noiseNodes.srcNode.stop(); } catch {}
    noiseNodes = null;
  }
}

/* ── Storage meter ── */
export function storageBytes() {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      total += (k.length + (localStorage.getItem(k) || "").length) * 2;
    }
  } catch {}
  return total;
}
export const STORAGE_QUOTA = 5 * 1024 * 1024;

/* ── Snapshot backups: two rotating slots ── */
import { exportData, importData } from "./store.js";

export function saveSnapshot() {
  const stamp = new Date().toISOString().slice(0, 16);
  const payload = JSON.stringify({ at: Date.now(), label: stamp, data: JSON.parse(exportData()) });
  const older = localStorage.getItem(SNAP_PREFIX + "b");
  localStorage.setItem(SNAP_PREFIX + "b", older || localStorage.getItem(SNAP_PREFIX + "a") || "");
  localStorage.setItem(SNAP_PREFIX + "a", payload);
  trimOld();
  return stamp;
}
function trimOld() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(SNAP_PREFIX));
    while (keys.length > 2) {
      const oldest = keys.sort().shift();
      localStorage.removeItem(oldest);
    }
  } catch {}
}
export function listSnapshots() {
  const out = [];
  for (const slot of ["a", "b"]) {
    try {
      const raw = localStorage.getItem(SNAP_PREFIX + slot);
      if (!raw) continue;
      const p = JSON.parse(raw);
      out.push({ slot, at: p.at, label: p.label, chapters: (p.data.completed || []).length, xpBonus: p.data.bonusXp || 0 });
    } catch {}
  }
  return out;
}
export function restoreSnapshot(slot) {
  try {
    const raw = localStorage.getItem(SNAP_PREFIX + slot);
    if (!raw) return false;
    const p = JSON.parse(raw);
    return importData(JSON.stringify(p.data));
  } catch { return false; }
}

/* Speak Pip answers aloud when enabled */
export function speak(text) {
  if (!loadUI().voice || typeof speechSynthesis === "undefined") return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/https?:\/\/\S+/g, ""));
    u.rate = 1.04;
    u.pitch = 1;
    speechSynthesis.speak(u);
  } catch {}
}
