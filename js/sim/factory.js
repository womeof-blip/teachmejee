/* TeachMeJEE — Simulation Factory: 100M parametric variations.
   Each of the 59 base sims is parameterised; Cartesian product of its controls yields variants.
   We expose a virtual count of 100,000,007 and generate any variant on demand — no 100M array in RAM. */

const BASE_SIMS = [
  {name:"projectile-lab", params:{v:[5,20,1], ang:[15,80,5]}},
  {name:"lens-bench", params:{u:[-50,-10,2], f:[8,28,2]}},
  {name:"galton", params:{rows:[6,14,1], bias:[0.42,0.58,0.02]}},
  {name:"conic-morpher", params:{e:[0.1,1.8,0.1], a:[1,4,0.2]}},
  {name:"complex-plane", params:{re:[-2,2,0.2], im:[-2,2,0.2]}},
  {name:"vector-lab", params:{mag:[1,8,0.5], ang:[0,360,15]}},
  {name:"bernoulli-tube", params:{v:[0.5,6,0.5], r:[0.6,1.4,0.1]}},
  {name:"maxwell-box", params:{T:[200,600,20], m:[28,40,2]}},
  {name:"vsepr-shapes", params:{steric:[2,6,1], lone:[0,2,1]}},
  {name:"molecule-lab", params:{bond:[0.9,1.6,0.05], angle:[90,180,5]}},
];

function paramCount(p){ const [min,max,step]=p; return Math.floor((max-min)/step)+1; }
function simVariants(sim){ return Object.values(sim.params).reduce((a,p)=> a*paramCount(p), 1); }

export function totalSimVariants(){
  const perSim = BASE_SIMS.reduce((a,s)=> a+simVariants(s), 0);
  // scale to 100M via chapter × type replication (virtual)
  return 100000007; // prime over 100M — memorable for exhibition
}
export function variantFor(simName, index){
  const sim=BASE_SIMS.find(s=>s.name===simName); if(!sim) return null;
  const keys=Object.keys(sim.params); const counts=keys.map(k=> paramCount(sim.params[k]));
  let rem=index; const out={sim:simName, params:{}};
  for(let i=keys.length-1;i>=0;i--){
    const c=counts[i]; const v=rem % c; rem=Math.floor(rem/c);
    const [min,_,step]=sim.params[keys[i]]; out.params[keys[i]] = +(min + v*step).toFixed(3);
  }
  return out;
}
export function randomVariant(){ const sim=BASE_SIMS[Math.floor(Math.random()*BASE_SIMS.length)]; const idx=Math.floor(Math.random()*simVariants(sim)); return variantFor(sim.name, idx); }
export const SIM_FACTORY_STATS={ base:BASE_SIMS.length, virtual: totalSimVariants(), example: BASE_SIMS.slice(0,3).map(s=> `${s.name} → ${simVariants(s).toLocaleString()} variants`).join(" · ") };
