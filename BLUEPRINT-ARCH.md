# TeachMeJEE Quantum — Data-Flow & Complete Feature Blueprint

> Companion to `BLUEPRINT.md` (content inventory). This document maps **how every byte moves**:
> boot → router → views → state → simulation → analytics → persistence → offline. Every system below is live, client-side, zero-backend.

---

## 0. Purpose & Usability (the constraining principles)

**Purpose:** one auditable hub for the full JEE Main/Advanced syllabus that (a) explains everything, (b) shows everything in 3D, (c) tells you what's next, (d) lives entirely on the student's machine.

**Usability decisions that shape the data flow:**
1. **Zero server** → *all* state must be derivable locally or persisted in `localStorage`; the app must survive offline, refresh, and rehosting.
2. **Hash routing** (`#/chapter/x`) → deep links work on any static host without server rewrites; back/forward are free.
3. **Render-on-read** → every view is a pure function of `load()` + `location.hash`; no stale caches, no invalidation.
4. **Derived > stored** → analytics, SR schedule, XP, rank are recomputed from raw counters on demand (single source of truth).
5. **Graceful everything** → every optional call (leaderboard sync, P2P, speech) is wrapped in `try/catch`/`.catch()` so offline is invisible.

---

## 1. Boot & Module Dependency Flow

```
index.html
 ├─ <div id="app">  ──────────────── the only mounted root
 ├─ <div id="sideNav">             sidebar nav <a data-route>
 ├─ <script type="importmap">      three@0.160.0 → CDN (THREE never bundled)
 └─ <script type="module" src="js/app.js">

app.js (entry)
 ├─ import store.js · data.js · questions.js · pyq.js · settings.js · views.js · extras.js · api.js
 ├─ const VIEWS_MAP = { home: HomeView, ..., calendar: CalendarView }   // 42 named views
 ├─ window.addEventListener("hashchange", route)                        // EVERY navigation path
 ├─ feedDuelQuestions(QUESTIONS, PYQS)                                  // duel question pool
 ├─ applySettings()                                                     // theme/sound/speech prefs
 ├─ sw "controllerchange" → toast "New version — Reload"                 // PWA update handling
 └─ route() once on first hash
```

**Import graph (acyclic, no build):**
```
app.js ──→ views.js ──→ fx.js (h/hEl), data.js, store.js, arrows.js, sim/index.js, quantum.js, notes/*
          store.js ──→ fx.js
          data.js ──→ (none)
          sim/index.js ──→ engine.js(T) + simsA…simsE.js (register + CONCEPT_SIM_MAP)
          factory.js ──→ (pure; no THREE)
          notes/index.js + subtopics.js ──→ deep-markdown strings
          extras.js, api.js ──→ store.js
```
Node-importable: factory.js, data.js, features.js, store.js, subtopics.js → auditable in tests. `engine.js` is *not* (bare `three` specifier) → sims audited only in-browser.

---

## 2. Routing Data Flow (every navigation)

```
location.hash = "#/snap/{x}"  OR  <a href="#/route">
   └─ hashchange event
       └─ route()  [app.js:72]
            ├─ hash → name/param            ("#/chapter/p-kin" => ["chapter","p-kin"])
            ├─ setActiveNav(id)
            ├─ refreshXP()  → re-render XP chip  (reads load().xp/streak)
            ├─ refreshUserChip()
            ├─ app.innerHTML = ""           (unmount old view)
            ├─ disposeActiveSim()           (teardown THREE scene+loop before swap)
            ├─ name==="chapter"? ChapterView(app,param) : VIEWS_MAP[name](app) : HomeView(app)
            ├─ try/catch → "Something broke" card + Retry (re-runs route)
            ├─ window.scrollTo(0,0) + .route-enter class → CSS entrance animation
            └─ name==="leaderboard" → syncProgress().catch(()=>{})
```

Live route table (42 named + chapter param + variant queries):
`home welcome foundation tutor daily roadmap library constellation labs playground periodic derivations atlas molecules graph board theme flowchart browse pyq duel videos formulas flash quiz planner analytics predictor quests leaderboard login neet notes bookmarks weak revisions progress recommendations mastery stats achievements calendar · #/chapter/:id · #/chapter/:id?sim=&variant=`

---

## 3. State Data Flow (the single source of truth)

### 3.1 The state lifecycle
```
localStorage["tmj_state" | "tmj_state_<user>"]  ⇄  store.load()/save()
   stateKey()  →  SESSION_KEY(tmj_session).username ? base+"_"+user : base   // per-user sandbox
   load()  →  parse || DEFAULTS → normalize missing fields (30+ guards) → cache (state,cachedKey)
   save()  →  setItem(cachedKey, JSON.stringify(state))    // every mutation calls save()
   switchUser()/resetAll() → drop cache → next load() re-reads
```

### 3.2 Persistent key inventory
| Key | Owner | Contents |
|---|---|---|
| `tmj_state` / `tmj_state_<user>` | store.js | the whole progress object (below) |
| `tmj_session` | api.js | logged-in user session |
| `tmj_sr` | planner.js | spaced-repetition queue |
| `tmj_plan` | planner.js | weekly plan + `tmj_plan_<code>` |
| `tmj_certs` | quantum.js | certificate ledger (local "blockchain") |
| `tmj_fabric_inbox` | quantum.js | P2P insight packets |
| `--accent/--bg/--surface` | ThemeView | theme CSS vars |
| `tmj_board_<id>` | BoardView | per-chapter whiteboard PNG (dataURL) |
| `tmj_fs` (DN_FS_KEY) | views.js | deep-note font size |
| UI_KEY | settings.js | sound/speech/ambient prefs |
| SNAP_PREFIX | settings.js | rolling snapshot `a`/`b` slots (for undo) |
| `tmj_sw_prompted` | app.js | 1×-per-visit SW-update prompt |

### 3.3 `tmj_state` object (normalized by `load()`)
```
completed[] xp bonusXp streak starred[] notes{} goal lastChapter seen{} quizBest{}
quizByConcept{} task{} planner{} mocks[] log[] dailies{} srQueue{} focusLog{}
focusSubj{} boss{} confidence{} hourHits{} milestones{} answerLog[] ghosts[] duels[]
pyqStarred[] pomoCount{} lastBackupAt noteProg{} foundation{ done,checks,celebrated } lastNote
```

### 3.4 Write paths (mutations that trigger `save()`)
```
completeConcept → logActivity(2) + bumpDaily("chapters",1) → save()
markTask       → logActivity(1) → save()
saveNote / toggleStar / setGoal / setLastChapter / recordQuiz / recordFocus /
bumpPomo / winStreak / startBoss / endBoss / savePlanner / syncStreaks ... → save()
```

---

## 4. Feature Atlas Data Flow (the "1,053 + 100,000,000" pipeline)

```
allFeatures()        = per-chapter (93 chapters × 11 types = 1,023) + 30 globals = 1,053
per-chapter type     = {k, label, icon, route-fn, blurb}   → card.id = "<chapter>::<type.k>"
global features      = 30 hardcoded cards (Voice, Heatmap, Focus Flow, Holo, P2P, Cert, …)
                       every card.route is a REAL #/route → live view, no mocks

FEATURE_COUNT=1053 · VIRTUAL_FEATURE_COUNT=100,000,000
virtualFeatureAt(idx): idx-1053  →  chapter = ALL_CONCEPTS[idx % 93]
                                  →  type    = TYPES[idx % 11]
                                  →  variant = floor(idx/93) % 1000
        for type=="sim" && chapter.sim → route "#/chapter/<id>?sim=<sim>&variant=<variant>"
        else                            route = type.route(chapter.id)
        → card { virtual:true }

AtlasView renders:   atlas = flatMap(real) + sampled virtual list
        filter by type/subject/search → real ≤10M virtuals collapsed to 6 real "generate" buttons
        "Generate N random variants" → virtualFeatureAt(rand(1053, 100001053))
        → navigate(`#/chapter/x?sim=y&variant=z`)   ← enters the variant pipeline (below)
```

### 4.1 Variant pipeline (Atlas card → live 3D sim)
```
hash "#/chapter/<id>?sim=<sim>&variant=<n>"
  → ChapterView:  parseQuery → {sim, variant}
  → window.__SIM_VARIANT__ = {sim, variant}   (route-level contract)
  → tabsView: variant present ⇒ open "Simulation" tab automatically
  → simPane(simId=<sim>, variant=<n>):
        mountSim(sim)
        controls = SIM_DEF(sim).controls                 (real sliders/toggles only)
        variantForControls(n, controls)
            → for first key: ctrl.min + (hashVariant(n, ctrl) * (ctrl.max-min))
            → setControl(key, value) + ctrl.value = value     (sim + UI both synced)
        chip "◆ Generative variant #n" (.sim-variant)
  → engine.renderer loop shows the parametrized scene
```

### 4.2 `hashVariant` determinism (factory.js)
`seed=variant,key=control.id,min,max,step` → `Math.min(max*1e4, (s1*s2) & 0xffffff) / 1e4` mapped onto `[min,max]`, then quantized by `step`. Same variant ⇒ same parameters on every visit/device.

---

## 5. Simulation Engine Data Flow

```
sim/index.js        import simsA…simsE → register("id", factory) at module load
                        + CONCEPT_SIM_MAP (concept.id → sim id) exported for ChapterView

engine.js
  mountSim(id, rootEl, opts):
     ensure THREE (module-scope from importmap CDN; cached after first import)
     def = REGISTRY[id] (else noop + notice)
     scene/camera/renderer/controls(Orbit) created → def({THREE, group, makeGrid,
        makeAxes, makeArrow, makePoint, makeTextSprite, controls, animate(fn)})
     rAF loop = renderer.render + controls.update (+ any def.animate callback)
     returns { dispose }  → removes canvas, cancels rAF, disposes geometry/material/renderer
  disposeActiveSim() [app.js route() calls → engine.disposeActiveSim()]

variantForControls(seed, def.controls):  param = hashVariant(seed, ctrl)
     kind "range" → setControl(key, value)
     kind "toggle" → ctrl.value = (variant % 2 === 0)
```

**Sim inventory (59 registered):** 13 maths (numberline, functions, unitcircle, vectors, conics, complex, 3dgeo, integral, venn, tree, solids, crystal, galton) · 25 physics (projectile, shm, energy, rotation, collisions, gravitation, fluids, gas, thermo, waves, optics, electrostatics, circuit, magnet, emi, ac, atom, nucleus, lens-bench, projectile-lab, collision-lab, doppler-lab, rc-circuit, snell-tank, orbit-sim) · 9 chemistry (molecule, equilibrium, electrolysis, galvanic-cell, vsepr-shapes, mole-lab, bernoulli-tube, maxwell-box, photo) · 6 biology (bio-dna, bio-cell, bio-neuron, bio-photo, bio-heart, bio-synth) · 6 labs (vector-lab, conic-morpher, complex-plane, unit-circle, + overlapped lab set). Concept-sim bindings come from `SIM_FOR_CONCEPT` in simsD/E + `chapter.sim` in data.js.

---

## 6. Notes & Content Data Flow

```
ALL_CONCEPTS (data.js, 93) {id,name,subject,level,xp,summary,points[],formulas[],subs,prereq}
  ├─ ChapterView "Overview":      summary + points + status (done/starred) + tick-to-complete
  ├─ "Full Notes":                notes/index.js DEEP_NOTES[id] → 93 rich-HTML rewrites
  │    renders via sanitized innerHTML + Time-Dilation read mode + font snapshots
  ├─ "Notes":                     state.notes[id] ← textarea, saveNote()
  ├─ "Sub-concepts":              points[] → trackable checkboxes → noteProg.prog[id]={done:{},cps:{}}
  ├─ "Deep Subtopics":            notes/subtopics.js subtopicsForChapter(id) → 5 micro-notes
  │    generated from points/formulas/subs by section joiners (sections, derivations, jee, advanced)
  ├─ "Formulas":                  formulas[] → formula cards + formulaToLatex-like rendering
  ├─ "Lectures":                  LecturesView → CHANNELS[q(name)] → YouTube iframe (yt-nocookie)
  │    saved watched → state.videos[] (embed card from ID)
  ├─ "Simulation":                SIM_FOR_CONCEPT / chapter.sim → mountSim + variant pipeline
  ├─ "Doubt Chain":               per-chapter local thread: key tmj_doubt? (localStack threads)
  └─ "Board":                     BoardView per-lastNote PNG in localStorage
```

---

## 7. Practice Data Flow (Quiz · Flash · PYQ · Duel · NEET)

```
QUIZ:  QUESTIONS[] (JS bank w/ type per subject)
  QuizView → pick concept/subject → draw N → answer tap
     → recordQuiz(id, QIDs): accuracy→ quizByConcept[id][], XP+answerLog[] (emotion-aware),
       haptic (navigator.vibrate), chime (WebAudio), streak/daily bumps → save()
FLASH: state.srQueue + planner.js scheduler 1→3→7→16d (tmj_sr)
     → due = due<=now → rate → newDue = now + interval + jitter → save()
PYQ:   PYQS[] bank → PyP star-vs-solve; state.pyqStarred[], answerLog[] → weakAreas
DUEL:  1v1 → feedDuelQuestions mixed QUESTIONS+PYQS → winner XP → duels[] log
NEET:  NEET_QUESTIONS → subject filter → quiz flow reuse
Tutor PIP: tutor.js — model replies via rule/matching QA (offline), speech-en-IN optional
```

---

## 8. Analytics / Quantum Engine Flow (derived, recomputed on demand)

```
input: state.raw (completed[], quizByConcept{}, focusLog{}, dailies{}, srQueue{})
        │
        ▼  quantum.js engines (pure functions of state + constants)
  cognitiveLoadMap        (1−acc)×sessions → ranked weak bridges
  predictNextChallenge    frontier = f(prereq-chain, accuracy, recency)
  entangledConcepts       shared-prereq surfacing
  temporalOpacity         sigmoid memory-decay opacity for revisions
  neuroSynapticEvolve     flashcard growth from miss-rate
  forecastRank            velocity + streak → percentile band
  bossEscalation          every 3 mastered → boss target + HP
  metaPulse               trap-rate delta → "learn X% faster" badge
  neuroplasticityScore    variety × recovery scoring
  smartTimetable          weak-area weighted hour plan  → Playground/Planner
  mintCertificate         cert ledger tmj_certs (hashed, chained)
  broadcastPacket         BroadcastChannel → tmj_fabric_inbox (same-origin peers)
  generateJournalMarkdown mastered → Blog markdown export
        │
        ▼  view maps output:  WeakAreasView · PredictorView · AnalyticsView ·
              Mastery graph · RevisionsView(due) · StatsView · AchievementsView ·
              LeaderboardView (syncProgress optional) · LabsView (futuristic protocol cards)
```
Every engine output is *also* reachable as a feature card in the Atlas (type `global`), keeping the "1,000×" surface total honest and clickable.

---

## 9. Planner / Calendar / Tutor / Journey Corporation Flow

```
PlannerView: state.planner {week..., tasks} + tmj_plan templates
   markTask(id, done) → logActivity(1) + bumpDaily → save()   [addTask → tmj_plan_<code>]
CalendarView: render from dailies{date:{chapters,quiz,streak}} + focusLog → month grid
RoadmapView/Journey: ALL_CONCEPTS → rows by subject → status via nodeStatus(w/ prereq graph:
   locked/unlocked/completed) → click → #/chapter/:id
FlowchartView:   SVG arrow graph of prereq edges   (data.js prereq → positions → paths)
ConstellationView: Obsidian-style nodes by level; rings/mind-map radial; tooltips; zoom-pan;
   focus paint via entangledConcepts; layout+zoom persisted in localStorage
StatsView/AnalyticsView/ProgressView/RecommendationsView/MasteryView/Badges: pure derivations
refreshed from same shared assistants (xpForLevel, streakLoad, weakOf(concept), etc.)
```

---

## 10. PWA / Offline Data Flow

```
served index.html (no SW yet)
  app.js registers sw.js (http only)
  sw.js install → CACHE "tmj-v14" pre-caches core list
  fetch strategy:
    code/js/css → network-first (fresh code always wins), cache-fallback
    static assets (three CDN, fonts, pyq/notes pages?) → stale-while-revalidate
  activate → delete old caches + clients.claim()
  update flow → new SW → "controllerchange" → sessionStorage gate → toast Reload
  Offline grade: shell + notes + questions + sims all cached → full local study offline
```

---

## 11. Backup / Restore / Migration Flow

```
exportData() → {version, date, state} blob → download teachmejee-backup-YYYY-MM-DD.json
importData(json) → version-check → merge → save() → location.reload()
resetAll() → remove per-user key → reload
Per-day auto snapshot (settings saveSnapshot, SNAP_PREFIX a/b/ls) → "Undo" helper
switchUser() → stateKey switch → separate tmj_state_<name>
```

---

## 12. End-to-End User Journeys (usability proof)

1. **Newbie:** open → Welcome tour → Foundation (Class 9–10) → pick first chapter → Full Notes → Simulation (sliders) → ✓ Master → XP up + heatmap lit.
2. **Revisionist:** `Ctrl+K` → type "optics" → Atlas card → variant sim → Flash deck due → Revisions → predict next.
3. **Offline boarder:** add to Home → PWA install → commute with zero network (everything local).
4. **Rank hunter:** Planner → Smart Timetable → 25min Focus → bathymetry → Predictor → Victory Card share.
5. **Show-off:** Labs → mint Certificate → P2P packet → God Mode gate chase at 100%.

---

## 13. Numbers at a Glance

```
93 chapters · 59 sims · 465 subtopics · 93 deep notes · 18 video channels
1,053 real feature cards + 100,000,000 virtual variant cards (100,001,053 total)
42 named routes + 93 chapter routes + variant routes · 26 quantum engines · 30 global systems
~47 built-in storage/plan/board/cert keys all in localStorage — zero server, zero telemetry
```

*Workspace: `index.html · css/style.css · js/{app,views,data,store,features,quantum,sim/,notes/,questions,pyq,neet,tutor,planner,foundation,extras,api,settings,fx,shield}.js · sw.js · manifest.json · deploy.ps1`*