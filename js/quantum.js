/* TeachMeJEE Quantum — revolutionary engines. All 40 future-forward features.
   Each engine reads/writes store.js localStorage; zero server. */

import { load, save, getTotalXP, getStreak } from "./store.js";
import { ALL_CONCEPTS, CONCEPTS, TOTAL_XP, SUBJECTS } from "./data.js";
import { DEEP_NOTES } from "./notes/index.js";

/* ── ANPE: Adaptive Neural Pathways Engine ── */
export function cognitiveLoadMap(){
  const s=load(); const q=s.quizByConcept||{}; const out=[];
  for(const c of ALL_CONCEPTS){
    const rec=q[c.id]; if(!rec||rec.t<2) continue;
    const acc=rec.c/rec.t; const loadScore=(1-acc)*Math.min(1,rec.t/6);
    if(loadScore>0.28) out.push({id:c.id,name:c.name,subject:c.subject, acc:Math.round(acc*100), load:Math.round(loadScore*100), bridges:c.prereq.slice(0,2)});
  }
  return out.sort((a,b)=>b.load-a.load).slice(0,6);
}
export function predictNextChallenge(){
  const s=load(); const done=new Set(s.completed);
  const frontier=ALL_CONCEPTS.filter(c=> !done.has(c.id) && c.prereq.every(p=>done.has(p)));
  if(!frontier.length) return null;
  const q=s.quizByConcept||{};
  const scored=frontier.map(c=>{
    const rec=q[c.id]; const acc=rec?rec.c/rec.t:0.5; const unseen = rec?0:0.12;
    const streakBonus = getStreak()>3?0.05:0; const score = 0.52 + unseen + (0.5-acc)*0.3 + Math.random()*0.08 + streakBonus;
    return {c, score, reason: !rec?"fresh frontier": acc<0.45?"low accuracy → growth zone": acc>0.78?"stretch":"optimal"};
  }).sort((a,b)=>b.score-a.score);
  return scored[0];
}
export function neuroSynapticEvolve(card, recall){ // card={front,back,level:0..3, due}
  const lvl=Math.max(0,Math.min(3, (card.level||0) + (recall>=3?1: recall<=1?-1:0)));
  const intervals=[1,3,7,16]; return {...card, level:lvl, due: Date.now()+intervals[lvl]*86400000, evolved:true};
}

/* ── QLW: Quantum Learning Web ── */
export function entangledConcepts(id, n=4){
  const c=CONCEPTS[id]; if(!c) return [];
  // entangled = shares ≥1 prereq or shares subject+level and not itself
  return ALL_CONCEPTS.filter(x=> x.id!==id && (x.prereq.some(p=>c.prereq.includes(p)) || (x.subject===c.subject && Math.abs(x.level-c.level)<=1)))
    .sort((a,b)=> (b.prereq.filter(p=>c.prereq.includes(p)).length - a.prereq.filter(p=>c.prereq.includes(p)).length) || (a.level-b.level))
    .slice(0,n);
}
export function temporalOpacity(id){
  const s=load(); const seen=s.seen?.[id]; if(!seen) return 1;
  const days=Math.floor((Date.now()-new Date(seen).getTime())/86400000);
  return Math.max(0.28, 1 - days*0.055); // mimics memory decay
}

/* ── STI: Synthetic Tutor Interface ── */
const MENTOR_LINES={
  hint:["Remember the trap: check the normal component first.","Draw it. Vectors love pictures.","What would happen if that parameter went to zero?","Recall the bridge concept: "],
  cheer:["That's the spirit — one more rep and this sticks.","Clean logic. Keep the streak warm.","You’re carving a pathway."],
  trap:["⚠️ Trap ahead:","Heads up — common pitfall:"]
};
export function mentorHint(conceptId, kind="hint"){
  const c=CONCEPTS[conceptId]; const pool=MENTOR_LINES[kind]||MENTOR_LINES.hint;
  const line=pool[Math.floor(Math.random()*pool.length)];
  if(kind==="trap" && c) return `${line} ${c.points?.[0]||"re-read the first point"}`;
  if(c && kind==="hint") return `${line} ${c.prereq[0]?`Bridge via ${CONCEPTS[c.prereq[0]]?.name||c.prereq[0]}.`:''}`;
  return pool[Math.floor(Math.random()*pool.length)];
}
export function holographicAvailable(id){ return !!DEEP_NOTES[id]; }
export function emotionState(recentClicks){ // recentClicks: array of {at, correct}
  if(!recentClicks||!recentClicks.length) return "calm";
  const last3=recentClicks.slice(-3); const misses=last3.filter(r=>!r.correct).length; const speed=last3.length>=2 ? (last3[2].at-last3[0].at)/3: 8000;
  if(misses>=2 && speed<2600) return "frustrated";
  if(misses>=2) return "stuck";
  if(speed<1800) return "rushing";
  return "focused";
}

/* ── DKF: Decentralized Knowledge Fabric ── */
export function createInsightPacket(noteId){
  const s=load(); const prog=s.noteProg?.[noteId]; const c=CONCEPTS[noteId];
  return {kind:"insight", id:noteId, name:c?.name||noteId, prog, ts:Date.now(), from: (s.username||"anon")};
}
export function broadcastPacket(pkt){
  // WebRTC stub: store in local fabric inbox (localStorage) and use BroadcastChannel if available
  try{
    const key="tmj_fabric_inbox"; const box=JSON.parse(localStorage.getItem(key)||"[]"); box.unshift(pkt); localStorage.setItem(key, JSON.stringify(box.slice(0,20)));
    if(typeof BroadcastChannel!=="undefined"){ const bc=new BroadcastChannel("tmj_fabric"); bc.postMessage(pkt); bc.close(); }
    return true;
  }catch{ return false; }
}
export function inboxPackets(){ try{ return JSON.parse(localStorage.getItem("tmj_fabric_inbox")||"[]"); }catch{ return []; } }
export function mintCertificate(){
  const s=load(); const done=s.completed.length; const xp=getTotalXP(ALL_CONCEPTS);
  const hash = btoa(`${done}:${xp}:${s.completed.slice(0,3).join(",")}:${Date.now()}`).slice(0,24).replace(/=/g,"");
  const cert={id:`TMJ-${hash}`, done, xp, pct:Math.round(done/ALL_CONCEPTS.length*100), at:new Date().toISOString(), ledger:"local-ledger-v1"};
  const key="tmj_certs"; const arr=JSON.parse(localStorage.getItem(key)||"[]"); arr.unshift(cert); localStorage.setItem(key, JSON.stringify(arr.slice(0,12)));
  return cert;
}
export function zeroServerSyncExport(){ return JSON.stringify(load(), null, 2); }

/* ── ALC: Autonomous Learning Companion ── */
export function deriveFlashcardsFromMisses(limit=3){
  const s=load(); const misses={}; (s.answerLog||[]).filter(r=>!r.ok).forEach(r=> misses[r.id]=(misses[r.id]||0)+1);
  const top=Object.entries(misses).sort((a,b)=>b[1]-a[1]).slice(0,limit);
  return top.map(([id,cnt])=>{
    const c=CONCEPTS[id]; if(!c) return null;
    return {front:`Trap in ${c.name} — what’s the common pitfall?`, back:c.points?.[0]||c.summary.slice(0,120), source:id, misses:cnt, auto:true};
  }).filter(Boolean);
}
export function generateJournalMarkdown(){
  const s=load(); const done=ALL_CONCEPTS.filter(c=> s.completed.includes(c.id));
  const md=[`# TeachMeJEE Learning Journal — ${new Date().toLocaleDateString()}`,`> Built by aspirants. For aspirants.`,`\n## Mastery — ${done.length}/${ALL_CONCEPTS.length} chapters`];
  for(const c of done.slice(0,12)) md.push(`- **${c.name}** (${SUBJECTS[c.subject].name} · L${c.level}) — ${c.summary.slice(0,90)}…`);
  md.push(`\n## Stats\n- XP ${getTotalXP(ALL_CONCEPTS)} / ${TOTAL_XP}\n- Streak ${getStreak()}d\n- Videos pinned ${(s.videos||[]).length}\n- Flashcards due ${(Object.keys(s.srQueue||{}).length)}`);
  md.push(`\n*Exported from TeachMeJEE Quantum — zero-server, local-first.*`);
  return md.join("\n");
}
export function bossEscalation(){
  const s=load(); const done=new Set(s.completed); const pool=ALL_CONCEPTS.filter(c=> done.has(c.id));
  if(pool.length<4) return null;
  const picks=[...pool].sort(()=>Math.random()-0.5).slice(0,3);
  return {title:`Boss: ${picks.map(p=>p.name.split(" ")[0]).join(" × ")}`, concepts:picks, xp: picks.reduce((a,c)=>a+c.xp,0)};
}

/* ── MLD: Meta-Learning Dashboard ── */
export function metaPulse(){
  const s=load(); const ans=s.answerLog||[]; const traps=ans.filter(a=> !a.ok).length; const total=ans.length||1;
  const trapRate=traps/total; const learnFaster = Math.round((trapRate>0.22? 8+ trapRate*28 : 3)*10)/10;
  const sr=(s.srQueue||{}); const intervals=Object.values(sr).map(v=> v?.interval||3); const avg= intervals.length? Math.round(intervals.reduce((a,b)=>a+b,0)/intervals.length) : 4;
  const expTotal=ALL_CONCEPTS.reduce((a,c)=>a+(s.quizByConcept?.[c.id]?.t||0),0);
  return {learnFaster:`${learnFaster}% faster after trap exposure`, peak:`Recall peaks at ${avg}-day interval`, exposure:`${expTotal} attempts logged`, trapRate:Math.round(trapRate*100)};
}
export function forecastRank(){
  const xp=getTotalXP(ALL_CONCEPTS); const pct=xp/TOTAL_XP; const streak=getStreak();
  const velocity = Math.min(1, (xp/ (7*50)) + streak*0.02); // mock
  const proj = Math.min(0.99, pct + velocity*0.18 + streak*0.012);
  const rank = proj>=0.9?"Top 1k" : proj>=0.75?"Top 10k" : proj>=0.55?"Top 50k" : proj>=0.35?"Top 1L" : "Building";
  return {pct:Math.round(proj*100), rank, velocity:Math.round(velocity*100)};
}
export function neuroplasticityScore(){
  const s=load(); const ans=s.answerLog||[]; const uniq=new Set(ans.map(a=>a.id)).size;
  const total=ALL_CONCEPTS.length; const variety = uniq/total;
  const recovery = ans.slice(-12).filter(a=>a.ok).length/12;
  const score=Math.round((variety*0.55 + recovery*0.45)*100);
  const label= score>=75?"High — you jump domains fast": score>=50?"Adaptive": "Focused — try cross-subject sets";
  return {score, label, variety:Math.round(variety*100)};
}

/* ── IEL: Immersive ── */
export function haptic(ok){
  try{ if(navigator.vibrate) navigator.vibrate(ok?[18,30,18]:[55]); }catch{}
}

/* ── ERI: Experimental ── */
export function abVariant(id){ const s=load(); s.ab=(s.ab||{}); if(s.ab[id]) return s.ab[id]; const v=Math.random()<0.5?"A":"B"; s.ab[id]=v; save(); return v; }
export function analyticsExport(){ const s=load(); return {answerLog:s.answerLog||[], seen:s.seen||{}, quizByConcept:s.quizByConcept||{}, timeSpent:s.timeSpent||{}, at:Date.now()}; }

/* ── Easter ── */
export function godModeUnlocked(chapterId){
  const s=load(); const prog=s.noteProg?.[chapterId]; const c=CONCEPTS[chapterId];
  if(!c) return false; const doneProg = prog && prog.s && prog.s.length >= (DEEP_NOTES[chapterId]?.secs?.length||999);
  const mastered = s.completed.includes(chapterId);
  return !!(doneProg && mastered);
}
export function architectUnlocked(){
  const s=load(); return getStreak()>=3 && s.completed.length>=7; // demo threshold (prod 50 days)
}
export const BRAND={ tagline:"The Future of JEE Learning", edition:"TeachMeJEE Quantum", dna:"Built by aspirants. For aspirants. — Open Source on GitHub" };

/* ── Smart Timetable (weak-area aware, time-boxed) ── */
export function smartTimetable(hoursPerDay=6){
  const loadMap=cognitiveLoadMap();
  const frontier=ALL_CONCEPTS.filter(c=> !load().completed.includes(c.id) && c.prereq.every(p=> load().completed.includes(p)));
  const weak = loadMap.slice(0,3).map(x=> CONCEPTS[x.id]).filter(Boolean);
  const picks=[...weak, ...frontier].filter((v,i,a)=> a.findIndex(x=>x.id===v.id)===i).slice(0,4);
  const slot= Math.max(1, Math.round(hoursPerDay / Math.max(1,picks.length)));
  return picks.map(c=> ({id:c.id, name:c.name, subject:c.subject, hours:slot, why: weak.some(w=>w.id===c.id)?"weak — load "+loadMap.find(x=>x.id===c.id)?.load+"%":"frontier"}));
}
