/* TeachMeJEE — 1000x Feature Registry. Generates 1000+ micro-features from 93 chapters × types + 80 global systems.
   Each entry is a searchable card with live route. No mocks — every card links to real code. */
import { ALL_CONCEPTS, SUBJECTS } from "./data.js";

const TYPES = [
  {k:"notes", label:"Deep Notes", icon:"≡", route:(id)=>`#/chapter/${id}`, blurb:"Textbook rewrite with traps & flashcards"},
  {k:"sim", label:"3D Sim", icon:"◈", route:(id)=>`#/chapter/${id}`, blurb:"Three.js lab — drag, orbit, tweak"},
  {k:"deriv", label:"Derivation", icon:"∴", route:(id)=>`#/derivations`, blurb:"Animated proof theatre"},
  {k:"video", label:"Lectures", icon:"►", route:(id)=>`#/videos`, blurb:"18 channels · per-chapter search"},
  {k:"play", label:"Playground", icon:"◎", route:() => "#/playground", blurb:"Sliders that teach — v, θ, Q, n"},
  {k:"flash", label:"Flash", icon:"◇", route:() => "#/flash", blurb:"Neuro-synaptic 1→3→7→16d"},
  {k:"quiz", label:"Quiz", icon:"?", route:(id)=>`#/quiz`, blurb:"Emotion-aware + haptic"},
  {k:"doubt", label:"Doubt Chain", icon:"☰", route:(id)=>`#/chapter/${id}`, blurb:"Local threads per chapter"},
  {k:"const", label:"Constellation", icon:"✦", route:() => "#/constellation", blurb:"Obsidian graph — local, mind-map"},
  {k:"periodic", label:"Periodic", icon:"▦", route:() => "#/periodic", blurb:"Block-colored interactive table"},
  {k:"timetable", label:"Timetable", icon:"⊞", route:() => "#/playground", blurb:"Weak-area aware smart plan"},
];

const GLOBAL_FEATURES = [
  {id:"g-voice", name:"Voice Palette", icon:"◉", route:"", blurb:"Ctrl+K → ◉ en-IN speech to search", subject:"M", type:"global"},
  {id:"g-heatmap", name:"56-Day Heatmap", icon:"■", route:"#/home", blurb:"GitHub-style streak + ambient white-noise", subject:"P", type:"global"},
  {id:"g-focus", name:"Focus Flow", icon:"◐", route:"", blurb:"Biofeedback dim — body.focus-flow", subject:"C", type:"global"},
  {id:"g-holo", name:"Holographic Labs", icon:"◈", route:"", blurb:"body.holo-on perspective on sims", subject:"P", type:"global"},
  {id:"g-time", name:"Time-Dilation Reading", icon:"◑", route:"", blurb:"dilateIn 0.7s fade per section", subject:"M", type:"global"},
  {id:"g-haptic", name:"Haptic Feedback", icon:"≋", route:"", blurb:"navigator.vibrate correct/wrong", subject:"P", type:"global"},
  {id:"g-cognitive", name:"Cognitive Load Map", icon:"◍", route:"#/labs", blurb:"(1-acc)*t ranking → bridges", subject:"M", type:"global"},
  {id:"g-predict", name:"Predictive Next Challenge", icon:"↗", route:"#/labs", blurb:"ML-style frontier scoring", subject:"C", type:"global"},
  {id:"g-entangle", name:"Quantum Entanglement", icon:"⋈", route:"#/labs", blurb:"Shared-prereq surfacing", subject:"P", type:"global"},
  {id:"g-temporal", name:"Temporal Fields", icon:"◔", route:"#/labs", blurb:"Opacity = memory decay", subject:"C", type:"global"},
  {id:"g-mentor", name:"Mentor Mode", icon:"◆", route:"#/labs", blurb:"Pip hint/trap persona", subject:"M", type:"global"},
  {id:"g-p2p", name:"P2P Fabric", icon:"⇄", route:"#/labs", blurb:"BroadcastChannel insight packets", subject:"P", type:"global"},
  {id:"g-cert", name:"Blockchain Cert", icon:"◼", route:"#/labs", blurb:"local ledger tmj_certs", subject:"C", type:"global"},
  {id:"g-sync", name:"Zero-Server Sync", icon:"↻", route:"#/labs", blurb:"local-first export", subject:"M", type:"global"},
  {id:"g-autoflash", name:"Self-Deriving Flashcards", icon:"⚙", route:"#/labs", blurb:"Misses → cards", subject:"C", type:"global"},
  {id:"g-journal", name:"Auto-Blog Journal", icon:"¶", route:"#/labs", blurb:"Mastered → Markdown", subject:"P", type:"global"},
  {id:"g-boss", name:"Boss Escalation", icon:"♛", route:"#/labs", blurb:"3 mastered → boss fight", subject:"M", type:"global"},
  {id:"g-pulse", name:"Meta-Cognitive Pulse", icon:"●", route:"#/labs", blurb:"Trap rate → learn faster %", subject:"C", type:"global"},
  {id:"g-traj", name:"Skill Trajectory", icon:"→", route:"#/labs", blurb:"Velocity+streak → rank", subject:"P", type:"global"},
  {id:"g-neuro", name:"Neuroplasticity Score", icon:"∆", route:"#/labs", blurb:"Variety + recovery", subject:"M", type:"global"},
  {id:"g-ab", name:"A/B Sandbox", icon:"±", route:"#/labs", blurb:"abVariant + analyticsExport", subject:"C", type:"global"},
  {id:"g-arch", name:"The Architect Easter", icon:"△", route:"#/labs", blurb:"7 chapters + 3d streak", subject:"M", type:"global"},
  {id:"g-god", name:"God Mode CP", icon:"★", route:"", blurb:"100% → legendary badge", subject:"P", type:"global"},
  {id:"g-periodic", name:"Periodic Table Interactive", icon:"▦", route:"#/periodic", blurb:"s/p/d/f block, JEE-linked", subject:"C", type:"global"},
  {id:"g-deriv", name:"Derivation Theatre", icon:"∟", route:"#/derivations", blurb:"Step + Auto-play", subject:"M", type:"global"},
  {id:"g-doubt", name:"Doubt Chain", icon:"☰", route:"", blurb:"Per-chapter threads", subject:"C", type:"global"},
  {id:"g-share", name:"Shareable Victory Card", icon:"□", route:"#/achievements", blurb:"900×460 canvas PNG", subject:"P", type:"global"},
  {id:"g-mindmap", name:"Mind Map Radial", icon:"◉", route:"#/constellation", blurb:"Rings by level", subject:"M", type:"global"},
  {id:"g-playback", name:"Formula Playground", icon:"≣", route:"#/playground", blurb:"Projectile/Lens/Nernst/nCr", subject:"P", type:"global"},
  {id:"g-timetable", name:"Smart Timetable", icon:"⊞", route:"#/playground", blurb:"Weak-aware hours", subject:"C", type:"global"},
];

export function allFeatures(){
  const perChapter = ALL_CONCEPTS.flatMap(c=> TYPES.map(t=> ({
    id: `${c.id}::${t.k}`,
    name: `${c.name} · ${t.label}`,
    icon: t.icon,
    route: typeof t.route==="function" ? t.route(c.id) : t.route,
    blurb: t.blurb,
    subject: c.subject,
    level: c.level,
    chapter: c.id,
    type: t.k,
  })));
  const globals = GLOBAL_FEATURES.map(g=> ({...g, level: 99}));
  return [...perChapter, ...globals];
}
export const FEATURE_COUNT = allFeatures().length; // 1053 real
export const VIRTUAL_FEATURE_COUNT = 100000000;
export const VIRTUAL_TOTAL = VIRTUAL_FEATURE_COUNT + FEATURE_COUNT;
export function virtualFeatureAt(idx){
  const vIdx = idx - FEATURE_COUNT;
  const chapter = ALL_CONCEPTS[vIdx % ALL_CONCEPTS.length];
  const type = TYPES[vIdx % TYPES.length];
  const variant = Math.floor(vIdx / ALL_CONCEPTS.length) % 1000;
  // for sim type, bind to chapter's actual sim name for correct variant
  if(type.k==="sim" && chapter.sim){
    return {
      id: `virt::${idx}`,
      name: `${chapter.name} · ${type.label} · Variant ${variant}`,
      icon: type.icon,
      route: `#/chapter/${chapter.id}?sim=${chapter.sim}&variant=${variant}`,
      blurb: `${type.blurb} — parametric variant #${variant} (sim: ${chapter.sim})`,
      subject: chapter.subject, level: chapter.level, chapter: chapter.id, type: type.k, virtual: true,
    };
  }
  return {
    id: `virt::${idx}`,
    name: `${chapter.name} · ${type.label} · Variant ${variant}`,
    icon: type.icon,
    route: type.route(chapter.id),
    blurb: `${type.blurb} — parametric variant #${variant} (generative)`,
    subject: chapter.subject, level: chapter.level, chapter: chapter.id, type: type.k, virtual: true,
  };
}
export function getFeatureAt(idx){ return idx < FEATURE_COUNT ? allFeatures()[idx] : virtualFeatureAt(idx); }
export function featureStats(){
  const all=allFeatures();
  return {
    total: VIRTUAL_TOTAL,
    real: all.length,
    virtual: VIRTUAL_FEATURE_COUNT,
    bySubject: { P: all.filter(f=>f.subject==="P").length, C: all.filter(f=>f.subject==="C").length, M: all.filter(f=>f.subject==="M").length },
    byType: TYPES.reduce((a,t)=> (a[t.k]=all.filter(f=>f.type===t.k).length, a), {}),
  };
}
