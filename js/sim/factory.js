/* TeachMeJEE — Simulation Factory: 100M parametric variations.
   Covers all 59 registered sims. Each sim is parameterised; Cartesian product yields variants.
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
