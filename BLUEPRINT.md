# TeachMeJEE Quantum — Complete Project Blueprint

**A self-contained, zero-backend JEE study superplatform — 93 chapters, 1,053 live micro-features + 100,000,000 generative simulation variants, 40+ "future" engines.**

> Version 12 ("Quantum") · Single author project · Runs 100% in the browser · Offline-capable PWA
> Tagline: *"The Future of JEE Learning — Built by aspirants. For aspirants."*

---

## 1. Purpose

TeachMeJEE is an all-in-one preparation hub for **JEE Main/Advanced and NEET** that turns scattered study habits into one auditable, gamified, analytics-driven system.

**Problem it solves**
- Notes, videos, tests and planners live in 6 different apps; progress never follows you.
- Students don't know *what's next* or *why they're weak*.
- Studying feels passive — no feedback loop.

**Solution**
- A single page that contains the **entire syllabus as a navigable graph** (93 chapters), full **textbook-quality notes** (93 deep rewrites), **interactive 3D labs** for physics/chemistry/math/biology, a **planner with spaced-repetition**, **analytics that predict rank**, and **1,000+ real clickable features** — all offline, all free, no server.

**Usability goals**
- Zero install — open `index.html` through any static host.
- Works on phone and desktop; touch + keyboard shortcuts.
- Onboarding tour (`#/welcome`) and a Class 9–10 launchpad (`#/foundation`) lower the barrier.
- Everything survives a hard refresh (localStorage + Export/Import backup).

---

## 2. Architecture

### 2.1 Stack (no build step)
| Layer | Technology |
|---|---|
| UI | Vanilla ES modules + a tiny `h()` hyperscript helper (`js/fx.js`) |
| 3D | Three.js `r160` via CDN importmap (`js/sim/engine.js`) |
| Charts/graphs | Hand-rolled SVG + Canvas (no chart library) |
| Persistence | `localStorage` under key `tmj_state` (per-user `tmj_state_<user>`) |
| PWA | `sw.js` — network-first code, stale-while-revalidate assets, versioned cache |
| Speech | `SpeechRecognition` (en-IN) for voice search |
| Feedback | Web `<audio>` (AttentionContext), `navigator.vibrate`, BroadcastChannel (P2P) |

### 2.2 Module map
```
index.html          shell, sidebar nav (≈47 routes), importmap
css/style.css       ~2,000 lines theming (dark/light, --accent/- -bg/--surface tokens)
js/app.js           router, command palette (Ctrl+K + 🎤), shortcuts, backup, Pip
js/views.js         all view renderers (home → calendar), Constellation, Atlas, Labs…
js/data.js          93 concepts, subjects, weights, derivations
js/notes/index.js   deep-notes index → 93 rewrites (p1/p2/p3, c1/c2/c3, m1/m2, advanced)
js/notes/subtopics.js  465 generative sub-topic micro-notes (93 × 5)
js/sim/             engine + 11 files, 59 Three.js lab sims, factory (100M variants)
js/features.js      Feature Atlas registry — 1,053 real + 100M virtual
js/quantum.js       26 "future" engines (ANPE, QLW, DKF, BIL…)
js/store.js         state layer, SR scheduler, streaks, badges, planner
js/questions.js, pyq.js, neet.js, tutor.js, planner.js, foundation.js,
js/extras.js        quizzes, PYQ bank, NEET hub, Pip brain, planner, duels, widgets
js/api.js           optional leaderboard sync (graceful offline fallback)
js/fx.js, settings.js, shield.js   helpers, theme/sound, content guards
```

### 2.3 State model (`stores`)
Completed chapters, XP, streak, planner + week tasks, quiz answers/log, PYQ stars, mock tests, revision queue (spaced repetition `tmj_sr`), focus minutes, dailies, notes, starred chapters, badges, boss progress, videos, pomodoros, note-tracker completion per concept-point.

---

## 3. Content Inventory

### 3.1 Syllabus — 93 chapters (P 33 · C 30 · M 30), levels L0–L4
- **L0 Class 9–10 foundation (12):** Numbers, Arithmetic, Algebra, Geometry, Mensuration, Trig, Statistics, Physics, Motion, Matter, Atoms, Periodic.
- **Physics (33):** Units, Kinematics, Laws of Motion, Work-Power-Energy, Rotation, Gravitation, SHM, Thermodynamics, KTG, Waves, Fluids, Thermal, COM/Collisions, *11 ⇒ 33 advanced* (Electrostatics, Circuits, Magnetism, EMI, AC, Optics, Modern Physics, Momentum…).
- **Chemistry (30):** Mole, Atomic Structure, Bonding, Gas, Thermo, Equilibrium, Ionic, Redox, s-block, Organic basics + 20 more (GOC, Hydrocarbons, p-block, Metallurgy, Coordination, Electrochemistry, Solutions, Surface…).
- **Maths (30):** Sets, Quadratics, Complex, Sequences, Trig, Lines, Permutations, Binomial, Circles, Conics + vectors/3D, limits, calculus, integrals, differential equations, stats/probability.

Each chapter carries: `summary, points, formulas, subs, prereq, level, subject, xp`.

### 3.2 Deep notes — 93 full rewrites
Every chapter has a full self-authored note: definition → intuition → traps → quick formulas → exam flags → connection prompts (`js/notes/*`). Featured per-chapter in a "Full Notes" tab.

### 3.3 Generative subtopics — 465
`js/notes/subtopics.js` synthesizes 5 micro-notes per chapter from its points/formulas/subs (Deep Subtopics card in each chapter).

### 3.4 Simulations — 59 Three.js labs
| Domain | Sims |
|---|---|
| Maths (13) | numberline, functions, unitcircle, vectors, conics, complex, 3dgeo, integral, venn, tree, solids, crystal, galton |
| Physics (25) | projectile, shm, energy, rotation, collisions, gravitation, fluids, gas, thermo, waves, optics, electrostatics, circuit, magnet, emi, ac, atom, nucleus, lens-bench, projectile-lab, collision-lab, doppler-lab, rc-circuit, snell-tank, orbit-sim |
| Chemistry (9) | molecule, equilibrium, electrolysis, galvanic-cell, vsepr-shapes, mole-lab, bernoulli-tube, maxwell-box, photo(electric) |
| Biology (6) | bio-dna, bio-cell, bio-neuron, bio-photo, bio-heart, bio-synth |
| Labs (6) | vector-lab, conic-morpher, complex-plane, unit-circle, maxwell-box, bio-lab set |

All share orbit/drag, zoom, sliders/toggles, reset & fullscreen. `sim/factory.js` runs them as **100,000,007 deterministic parametric variants** (every control key/ranges mapped, hash-seeded) via the Atlas.

### 3.5 Lecture library — 18 channels
Physics Wallah, Unacademy, Vedantu, ALLEN, Resonance, Physics Galaxy, Rohit Mishra, Khan Academy, Apni Kaksha, Mohit Tyagi, Sameer Sir, Vishal Tiwari, Pankaj Sir, One-shot, PYQ Marathon, NCERT L–L, NEET Biology… each chapter queries its exact topic search; embed + save to `#/videos`.

---

## 4. Feature Registry — "1,000×" Atlas

`js/features.js` generates **1,053 real micro-features** = 93 chapters × 11 types + 30 global systems, plus **100M virtual variants**, all of them live routes (no mocks):
`notes · sim · deriv · video · play · flash · quiz · doubt · const · periodic · timetable` + globals.

**Every type is backed by a real view/tab.** The Atlas (`#/atlas`) is searchable and filterable by type/subject with "Generate 12 random variants ↗" (routes to `#/chapter/…?sim=…&variant=…`).

---

## 5. Views & Systems (≈47 routes)

**Core study**
- `#/home` — quantum banner, 56-day heatmap, streak, XP, ambient sound, focus-entry cards
- `#/roadmap` (Journey), `#/flowchart`, `#/library`, `#/browse`, `#/constellation`, `#/daily`
- `#/chapter/:id` — tabs: Overview · Full Notes · Notes · Formulas · Sub-concepts · Lectures · Simulation (+ God Mode, Doubt Chain, Deep Subtopics, Board shortcut)

**Practice**
- `#/quiz`, `#/flash` (1→3→7→16d SR + haptics), `#/pyq` (JEE PYQ bank), `#/duel` (1v1), `#/formulas`, `#/videos`

**Planning**
- `#/planner` (weekly plan + focus timer + pomodoro), `#/calendar`, `#/daily`

**Insight**
- `#/analytics`, `#/predictor` (rank), `#/weak`, `#/mastery`, `#/revisions` (SR due), `#/recommendations`, `#/stats`, `#/achievements`, `#/leaderboard`, `#/login`

**WOW / demo features**
- `#/labs` — future protocols (ANPE, QLW, STI, DKF, ALC, MLD, IEL, BIL, ERI, certification…)
- `#/atlas` — 1000× feature map + generative variant generator
- `#/periodic` — interactive periodic table (s/p/d/f blocks)
- `#/derivations` — animated proof theatre
- `#/playground` — projectile / lens / Nernst / nCr sliders + smart timetable
- `#/molecules`, `#/graph`, `#/board`, `#/theme` — 3D molecules, Desmos-like plotter, per-chapter whiteboard, theme studio
- `#/molecules`, `#/constellation` — Obsidian-style concept graph (local view, mind-map radial, focus, tooltips, zoom/pan, save layout)

---

## 6. "Quantum" Engines (`js/quantum.js`)

| Engine | What it does |
|---|---|
| `cognitiveLoadMap` | ranks concepts by `(1−accuracy)×sessions`, surfaces bridge gaps |
| `predictNextChallenge` | ML-style frontier scoring for the next task |
| `entangledConcepts` | shared-prerequisite surfacing (quantum entanglement metaphor) |
| `temporalOpacity` | memory-decay opacity on old material |
| `neuroSynapticEvolve` / `neuroplasticityScore` | flashcard growth & variety based learning speed |
| `mentorHint` | Pip persona: hint/trap/doubt answering |
| `emotionState` + `haptic` | sentiment-aware toasts + `navigator.vibrate` |
| `createInsightPacket`/`broadcastPacket` | P2P insight packets via BroadcastChannel |
| `mintCertificate` | local blockchain-style certificate ledger (`tmj_certs`) |
| `zeroServerSyncExport` / `deriveFlashcardsFromMisses` / `generateJournalMarkdown` | export, missed→cards, auto Blog journal |
| `bossEscalation` / `metaPulse` / `forecastRank` | boss fights, learning-rate, rank forecast |
| `abVariant` / `analyticsExport` | A/B sandbox + data export |
| `godModeUnlocked` / `architectUnlocked` | easter-egg endgame badges |
| `smartTimetable` | weak-area aware hour plan |

---

## 7. Gamification & Feedback

- **XP & levels** per chapter; rank titles; level-up chime (WebAudio).
- **Streaks** + 56-day heatmap; streak-at-risk nudges; daily challenges/claim rewards.
- **Badges & achievements**; shareable **Victory Card** (900×460 canvas PNG).
- **Boss fights** after chaining mastered concepts; **God Mode** (+legendary badge) at 100%.
- **Milestone tracker**, ghost-comparison vs. past self, confidence controls.
- Progress sync to optional leaderboard (`#/api` graceful-fails offline).

---

## 8. Usability & Accessibility

- Keyboard: `Ctrl+K` palette · `?` shortcuts · `g`+key chording · `f` zen · `,` settings · `1–4` quiz.
- Voice search (🎤), `Shift` bypass for copy guards, reduced-motion respected.
- Focus Flow (biofeedback dim), Time-Dilation reading mode, skip-link, aria-labels.
- Works file:→ shows "run `node server.js`" guide; ES-module friendly static host.

---

## 9. Reliability & Security

- **PWA**: versioned cache (`sw.js`), network-first code, offline fallback, skipWaiting/claim, "New version ready → Reload" toast.
- **No server, no data leaving device** (except optional leaderboard); content guards deter casual copy (Ctrl+C/F12/U, drag, long-select).
- JSON **backup export/import** (`teachmejee-backup-YYYY-MM-DD.json`).
- Deployment: `deploy.ps1` + `.github/workflows/pages.yml` (GitHub Pages / Netlify / Vercel / Cloudflare all work from one tree).

---

## 10. Deployment / Runs on

`node server.js` → http://localhost:8000 · GitHub Pages · Netlify Drop · Vercel · Cloudflare Pages · any static host.

---

*This blueprint mirrors the shipped tree: `index.html · css/style.css · js/{app,views,data,store,features,quantum,sim/…,notes/…} · sw.js · manifest.json · deploy.ps1`.*