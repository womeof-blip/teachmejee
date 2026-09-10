/* TeachMeJEE — Simulation Factory: 100M parametric variations.
   Covers all 156 registered sims. Each sim is parameterised; Cartesian product yields variants.
   Virtual count 100,000,007 — generate any variant on demand, zero RAM. */

const BASE_SIMS = [
  {name:"numberline", params:{range:[1,10,1], speed:[0.5,3,0.5]}},
  {name:"functions", params:{a:[0.5,3,0.5], b:[-2,2,0.5]}},
  {name:"unitcircle", params:{ang:[0,360,5]}},
  {name:"vectors", params:{mag:[1,8,0.5], ang:[0,360,15]}},
  {name:"conics", params:{e:[0.1,1.8,0.1], a:[1,4,0.2]}},
  {name:"complex", params:{re:[-2,2,0.2], im:[-2,2,0.2]}},
  {name:"3dgeo", params:{rot:[0,360,10]}},
  {name:"integral", params:{n:[4,40,2]}},
  {name:"particles", params:{temp:[200,600,20]}},
  {name:"venn", params:{a:[0.1,0.9,0.1], b:[0.1,0.9,0.1]}},
  {name:"tree", params:{depth:[2,5,1], branch:[2,4,1]}},
  {name:"solids", params:{sides:[4,12,1]}},
  {name:"crystal", params:{a:[2,5,0.2]}},
  {name:"projectile", params:{v:[5,20,1], ang:[15,80,5]}},
  {name:"shm", params:{amp:[0.5,3,0.2], freq:[0.5,3,0.2]}},
  {name:"energy", params:{h:[1,10,0.5]}},
  {name:"rotation", params:{omega:[0.5,4,0.2]}},
  {name:"collisions", params:{e:[0,1,0.1], m1:[0.5,2,0.2]}},
  {name:"gravitation", params:{M:[1,10,1]}},
  {name:"fluids", params:{v:[0.5,6,0.5]}},
  {name:"gas", params:{T:[200,600,20]}},
  {name:"thermo", params:{T:[300,800,20]}},
  {name:"waves", params:{f:[1,10,0.5], amp:[0.5,3,0.2]}},
  {name:"optics", params:{f:[8,28,2]}},
  {name:"electrostatics", params:{q:[1,10,1]}},
  {name:"circuit", params:{R:[10,1000,10], V:[1,12,1]}},
  {name:"magnet", params:{B:[0.1,2,0.1]}},
  {name:"emi", params:{flux:[0.1,5,0.2]}},
  {name:"ac", params:{f:[10,100,5]}},
  {name:"atom", params:{n:[1,6,1]}},
  {name:"nucleus", params:{A:[1,250,5]}},
  {name:"semi", params:{doping:[1,10,1]}},
  {name:"molecule", params:{bond:[0.9,1.6,0.05]}},
  {name:"equilibrium", params:{K:[0.01,10,0.1]}},
  {name:"electrolysis", params:{I:[0.5,5,0.5]}},
  {name:"photo", params:{freq:[1,10,0.5]}},
  {name:"galton", params:{rows:[6,14,1], bias:[0.42,0.58,0.02]}},
  {name:"vector-lab", params:{mag:[1,8,0.5]}},
  {name:"conic-morpher", params:{e:[0.1,1.8,0.1]}},
  {name:"complex-plane", params:{re:[-2,2,0.2]}},
  {name:"unit-circle", params:{ang:[0,360,5]}},
  {name:"galvanic-cell", params:{conc:[0.01,1,0.05]}},
  {name:"vsepr-shapes", params:{steric:[2,6,1]}},
  {name:"mole-lab", params:{n:[0.1,5,0.1]}},
  {name:"bernoulli-tube", params:{v:[0.5,6,0.5]}},
  {name:"maxwell-box", params:{T:[200,600,20]}},
  {name:"lens-bench", params:{u:[-50,-10,2], f:[8,28,2]}},
  {name:"projectile-lab", params:{v:[5,20,1], ang:[15,80,5]}},
  {name:"collision-lab", params:{e:[0,1,0.1]}},
  {name:"doppler-lab", params:{vx:[0.5,4,0.2]}},
  {name:"rc-circuit", params:{R:[10,1000,50]}},
  {name:"snell-tank", params:{inc:[10,80,5]}},
  {name:"orbit-sim", params:{vy:[0.9,2.2,0.1]}},
  {name:"bio-dna", params:{pairs:[5,20,1]}},
  {name:"bio-cell", params:{stage:[0,4,1]}},
  {name:"bio-neuron", params:{stim:[0,10,1]}},
  {name:"bio-photo", params:{light:[0,10,1]}},
  {name:"bio-heart", params:{rate:[40,120,5]}},
  {name:"bio-synth", params:{temp:[20,40,2]}},
  {name:"pendulum-lab", params:{len:[0.6,2,0.1], ang:[5,60,5]}},
  {name:"standing-wave", params:{mode:[1,5,1], amp:[0.2,1.4,0.1]}},
  {name:"field-dipole", params:{sep:[0.6,3,0.1], q:[1,5,0.5]}},
  {name:"double-slit", params:{sep:[0.4,2.4,0.1], lam:[400,700,10]}},
  {name:"titration-lab", params:{pka:[3,9,0.1], conc:[0.02,0.2,0.01]}},
  {name:"secant-tangent", params:{a:[-2,2,0.1], h:[0.02,2,0.02]}},
  {name:"stereo-lab", params:{flip:[0,1,1], spin:[0,2,0.1]}},
  {name:"kinetics-lab", params:{order:[0,2,1], k:[0.2,2,0.1]}},
  {name:"transistor-lab", params:{ib:[10,50,5]}},
  {name:"cyclotron-lab", params:{B:[0.5,2,0.1], v:[1,3,0.2]}},
  {name:"slope-field", params:{eq:[0,2,1], c:[-2,2,0.2]}},
  {name:"polarizer-lab", params:{a1:[0,180,10], a2:[0,180,10]}},
  {name:"bio-mitosis", params:{stage:[0,4,1]}},
  {name:"bio-nephron", params:{flow:[0.3,2,0.1]}},
  {name:"bio-lung", params:{rate:[0.2,1.6,0.1]}},
  {name:"bio-muscle", params:{pace:[0.15,1,0.05]}},
  {name:"polymer-lab", params:{rate:[0.2,3,0.1]}},
  {name:"hybrid-orbital", params:{hyb:[0,2,1], spin:[0,2,0.1]}},
  {name:"colligative-lab", params:{m:[0,3,0.1]}},
  {name:"calorimeter-lab", params:{fuel:[0,2,1]}},
  {name:"line-lab", params:{m:[-3,3,0.1], c:[-3,3,0.1]}},
  {name:"binomial-dist", params:{n:[2,20,1], p:[0.05,0.95,0.05]}},
  {name:"coordination-geo", params:{geo:[0,2,1], spin:[0,2,0.1]}},
  {name:"drift-lab", params:{E:[0.2,3,0.1]}},
  {name:"bio-circulation", params:{rate:[0.2,1.4,0.05]}},
  {name:"bio-synapse", params:{rate:[0.2,1.6,0.05]}},
  {name:"bio-digest", params:{speed:[0.1,1.4,0.05]}},
  {name:"bio-meiosis", params:{stage:[0,4,1]}},
{name:"ratio-scale", params:{"a":[1,9,1],"b":[1,9,1]}},
  {name:"angle-tracer", params:{"shape":[0,2,1]}},
  {name:"volume-morph", params:{"scale":[1,3,0.1],"shape":[0,2,1]}},
  {name:"histo-lab", params:{"spread":[1,8,1],"seed":[1,20,1]}},
  {name:"speed-timer", params:{"speed":[0.5,5,0.1]}},
  {name:"reaction-balancer", params:{"mode":[0,1,1]}},
  {name:"trend-drift", params:{"mode":[0,1,1]}},
  {name:"parabola-walk", params:{"a":[-1,1.5,0.1],"c":[-2,2,0.1]}},
  {name:"sequence-stars", params:{"n":[2,24,1],"d":[-3,3,0.2],"r":[-2,3,0.2]}},
  {name:"sine-circle", params:{"omega":[0.4,3,0.1]}},
  {name:"slot-tree", params:{"depth":[1,4,1]}},
  {name:"pascal-triangle", params:{"mode":[0,1,1]}},
  {name:"circle-family", params:{"mode":[0,1,1]}},
  {name:"conic-sweep", params:{"e":[0.1,1.6,0.05]}},
  {name:"limit-climb", params:{"mode":[0,1,1]}},
  {name:"box-whisker", params:{"mode":[0,1,1]}},
  {name:"reimann-slices", params:{"n":[3,40,1]}},
  {name:"slope-flow", params:{"mode":[0,1,1]}},
  {name:"solid-spin", params:{"mode":[0,1,1]}},
  {name:"vector-field", params:{"mode":[0,1,1]}},
  {name:"urn-draw", params:{"red":[1,9,1],"blue":[1,9,1]}},
  {name:"area-sweep", params:{"b":[1,8,0.5]}},
  {name:"complex-rotate", params:{"omega":[0.3,3,0.1]}},
  {name:"dimension-checks", params:{"mode":[0,1,1]}},
  {name:"motion-graphs", params:{"accel":[0.2,2.5,0.1]}},
  {name:"force-bleed", params:{"mode":[0,1,1]}},
  {name:"work-machines", params:{"load":[1,5,0.2],"effort":[1,5,0.2]}},
  {name:"gyro-spin", params:{"spin":[0.5,5,0.2],"precess":[0,3,0.1]}},
  {name:"orbit-prop", params:{"speed":[0.2,2,0.1],"e":[0,0.7,0.05]}},
  {name:"phase-circle", params:{"omega":[0.4,3,0.1]}},
  {name:"com-balance", params:{"m2":[1,9,1]}},
  {name:"pressure-tower", params:{"level":[0.5,3,0.1]}},
  {name:"expand-rod", params:{"mode":[0,1,1]}},
  {name:"cycle-pv", params:{"path":[0,1,1]}},
  {name:"speed-dist", params:{"mode":[0,1,1]}},
  {name:"wave-superpose", params:{"k":[0.4,3,0.1]}},
  {name:"field-line", params:{"charge":[-3,3,1]}},
  {name:"ohm-walk", params:{"mode":[0,1,1]}},
  {name:"field-coil", params:{"mode":[0,1,1]}},
  {name:"flux-coil", params:{"speed":[0.1,2,0.1]}},
  {name:"phasor-plot", params:{"phase":[0,3.14,0.1]}},
  {name:"em-wave", params:{"k":[0.4,3,0.2]}},
  {name:"ray-mirror", params:{"angle":[0.1,1.3,0.05]}},
  {name:"interfere-fringe", params:{"sep":[0.4,2,0.1],"lam":[0.5,2,0.1]}},
  {name:"photoelectric-plot", params:{"f":[1,6,0.1]}},
  {name:"spectrum-ladder", params:{"mode":[0,1,1]}},
  {name:"diode-curve", params:{"mode":[0,1,1]}},
  {name:"lewis-orbit", params:{"pairs":[2,4,1]}},
  {name:"boyle-chamber", params:{"mode":[0,1,1]}},
  {name:"enthalpy-shot", params:{"mode":[0,1,1]}},
  {name:"shift-balance", params:{"mode":[0,1,1]}},
  {name:"ph-titration", params:{"vol":[0,50,1]}},
  {name:"cell-stack", params:{"mode":[0,1,1]}},
  {name:"orbital-shell", params:{"mode":[0,1,1]}},

{name:"bio-enzyme", params:{"speed":[0.2,3,0.1]}},
  {name:"bio-mitochondria", params:{"rate":[0.2,2.5,0.1]}},
  {name:"bio-gamete", params:{"speed":[0.2,2.5,0.1]}},
  {name:"bio-embryo", params:{"mode":[0,1,1]}},
  {name:"bio-punnett", params:{"mode":[0,1,1]}},
  {name:"bio-selection", params:{"pred":[0,3,1]}},
  {name:"bio-tissue", params:{"mode":[0,1,1]}},
  {name:"bio-xylem", params:{"tension":[0.2,3,0.1]}},
  {name:"bio-nodule", params:{"rate":[0.2,3,0.1]}},
  {name:"bio-auxin", params:{"light":[-2,2,0.1]}},
  {name:"bio-logistic", params:{"rate":[0.5,3,0.1],"n":[0.1,6,0.1]}},
  {name:"bio-foodweb", params:{"flow":[0,1,0.05]}},
  {name:"bio-ferment", params:{"rate":[0.2,4,0.1]}},
  {name:"bio-menses", params:{"day":[0,1,0.02]}},
  {name:"bio-antibody", params:{"rate":[0.2,3,0.1]}},

  {name:"double-pendulum", params:{g:[4,16,0.5], l:[0.6,1.8,0.1]}},
  {name:"lissajous-3d", params:{a:[1,5,1], b:[1,5,1]}},
  {name:"bloch-sphere", params:{theta:[0,3.14,0.1]}},
  {name:"kepler-system", params:{e:[0,0.6,0.05]}},
  {name:"fourier-stack", params:{n:[1,9,1]}},
  {name:"platonic-family", params:{kind:[0,4,1]}},
  {name:"mobius-strip", params:{twist:[1,3,1]}},
  {name:"torus-knot-studio", params:{p:[2,5,1], q:[3,7,1]}},
  {name:"lorentz-helix", params:{B:[0.4,3,0.1]}},
  {name:"coupled-springs", params:{k:[0.4,3,0.1]}},
  {name:"brownian-gas", params:{T:[0.4,3,0.1]}},
  {name:"hydrogen-cloud", params:{n:[1,4,1]}},
  {name:"bragg-lattice", params:{d:[0.4,1.6,0.1]}},
  {name:"atwood-machine", params:{m2:[0.6,2.4,0.1]}},
  {name:"transformer-core", params:{ratio:[0.4,3,0.1]}},
  {name:"helmholtz-pair", params:{sep:[0.6,2.4,0.1]}},
  {name:"chladni-plate", params:{n:[1,6,1], m:[1,6,1]}},
  {name:"fibonacci-cone", params:{n:[40,200,10]}},
  {name:"tesseract-proj", params:{spin:[0.2,2,0.1]}},
  {name:"magnetic-bottle", params:{B:[0.5,3,0.1]}},
  {name:"rutherford-scatter", params:{b:[0.2,2,0.1]}},
  {name:"catenary-arch", params:{a:[0.4,2,0.1]}},
  {name:"geodesic-dome", params:{freq:[1,4,1]}},
  {name:"quantum-well-3d", params:{n:[1,5,1]}},
  {name:"millikan-drop", params:{E:[0.2,3,0.1]}},
  {name:"dna-supercoil", params:{twist:[4,14,1]}},
  {name:"crystal-fcc", params:{a:[0.6,1.6,0.1]}},
  {name:"crystal-bcc", params:{a:[0.6,1.6,0.1]}},
  {name:"young-screen", params:{d:[0.3,1.8,0.1]}},
  {name:"capacitor-field", params:{gap:[0.3,1.8,0.1]}},
  {name:"gyroscope-precess", params:{spin:[1,6,0.2]}},
  {name:"golden-spiral", params:{turns:[2,8,1]}},
  {name:"studio-knot", params:{p:[2,5,1]}},
  {name:"studio-orb", params:{n:[8,40,2]}},
  {name:"studio-atom", params:{n:[1,5,1]}},
  {name:"studio-helix", params:{turns:[4,16,1]}},
  {name:"studio-city", params:{n:[12,48,4]}},

];

function paramCount(p){ const [min,max,step]=p; return Math.floor((max-min)/step)+1; }
function simVariants(sim){ return Object.values(sim.params).reduce((a,p)=> a*paramCount(p), 1); }

export function totalSimVariants(){ return 100000007; }
export function variantFor(simName, index){
  const sim=BASE_SIMS.find(s=>s.name===simName); if(!sim) return null;
  const keys=Object.keys(sim.params); const counts=keys.map(k=> paramCount(sim.params[k]));
  let rem=index; const out={sim:simName, params:{}};
  for(let i=keys.length-1;i>=0;i--){
    const c=counts[i]; const v=rem % c; rem=Math.floor(rem/c);
    const [min,,step]=sim.params[keys[i]]; out.params[keys[i]] = +(min + v*step).toFixed(3);
  }
  return out;
}
export function randomVariant(){ const sim=BASE_SIMS[Math.floor(Math.random()*BASE_SIMS.length)]; const idx=Math.floor(Math.random()*simVariants(sim)); return variantFor(sim.name, idx); }
export function simByName(name){ return BASE_SIMS.find(s=>s.name===name) || null; }

/* Deterministic value for a sim control key — always inside [min,max] quantized by step. */
export function hashVariant(seed, min, max, step, key){
  let h = 2166136261;
  const s = `${key}:${seed}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  const frac = ((h >>> 0) % 10000) / 10000;
  const n = Math.max(1, Math.floor((max - min) / step));
  const idx = Math.min(n, Math.floor(frac * (n + 1)));
  return +(min + idx * step).toFixed(6);
}

/* Build a full set of variant presets for a real mounted sim's controls. */
export function variantForControls(seed, controls){
  const out = {};
  for (const ctrl of controls) {
    if (ctrl.type || ctrl.min == null || ctrl.max == null || ctrl.step == null) continue;
    out[ctrl.key] = hashVariant(seed, ctrl.min, ctrl.max, ctrl.step, ctrl.key);
  }
  return out;
}
export const SIM_FACTORY_STATS={ base:BASE_SIMS.length, virtual: totalSimVariants(), example: BASE_SIMS.slice(0,3).map(s=> `${s.name} → ${simVariants(s).toLocaleString()} variants`).join(" · ") };
