import { hasSim } from './sindex.js';
import { ALL_CONCEPTS } from './data.js';

const used = [...new Set(ALL_CONCEPTS.map((c) => c.sim).filter(Boolean))];
const missing = used.filter((s) => !hasSim(s));
const registered = new Set();
// enumerate known names from the sim source files
import { readFileSync } from 'fs';
for (const f of ['simsA.js', 'simsB.js', 'simsB2.js', 'simsC.js']) {
  const src = readFileSync('C:/Users/Admin/AppData/Local/Temp/opencode/test/' + f, 'utf8');
  for (const m of src.matchAll(/register\(['"]([^'"]+)['"]/g)) registered.add(m[1]);
}
console.log('concepts using sims: ' + used.length);
console.log('registered in source: ' + registered.size);
const unregistered = used.filter((s) => !registered.has(s));
console.log('concept sim ids with no registration: ' + JSON.stringify(unregistered));
console.log('registered but unused: ' + JSON.stringify([...registered].filter((s) => !used.includes(s))));
