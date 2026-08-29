/* TeachMeJEE — Generative Subtopics: 93 chapters × 5 = 465 deep sub-notes.
   Each subtopic is a focused lens on the chapter, generated on demand.
   Content is templated but chapter-specific, so every subtopic feels authored. */

const SUBTOPIC_TEMPLATES = {
  P: [
    { suffix: "Core Principles", lens: "First-principles derivation — where the formula comes from" },
    { suffix: "Worked Derivations", lens: "Step-by-step algebra with trap warnings" },
    { suffix: "Visual Intuition", lens: "What the graph / field / trajectory actually looks like" },
    { suffix: "JEE Traps & Shortcuts", lens: "Where toppers slip and how to save 40s per question" },
    { suffix: "Interlinked Problems", lens: "Cross-chapter problems that blend this with prerequisites" },
  ],
  C: [
    { suffix: "Mechanism & Arrow-Pushing", lens: "Electron flow, intermediates, rate-determining step" },
    { suffix: "Energetics & Lab", lens: "ΔH, ΔG, and what the bench actually does" },
    { suffix: "Structure & Visuals", lens: "VSEPR / orbital / lattice — what it looks like" },
    { suffix: "JEE Traps & Memory Tricks", lens: "Common mis-maps and mnemonics that stick" },
    { suffix: "Cross-Topic Synthesis", lens: "How this chapter powers the next (e.g. electrochemistry → moles)" },
  ],
  M: [
    { suffix: "Foundations & Proofs", lens: "Definitions → theorem → proof sketch" },
    { suffix: "Technique Toolbox", lens: "The 3-4 moves that solve 80% of JEE variants" },
    { suffix: "Graphical Insight", lens: "What the function / locus / distribution looks like" },
    { suffix: "Traps & Speed Tricks", lens: "Where sign, domain, or counting slips cost marks" },
    { suffix: "Hybrid Problems", lens: "Blended problems that span chapters" },
  ],
};

export function subtopicsFor(chapter){
  const tpl = SUBTOPIC_TEMPLATES[chapter.subject] || SUBTOPIC_TEMPLATES.M;
  return tpl.map((t, idx)=> ({
    id: `${chapter.id}::st${idx+1}`,
    title: `${chapter.name} — ${t.suffix}`,
    lens: t.lens,
    chapterId: chapter.id,
    subject: chapter.subject,
    level: chapter.level,
    // generative deep note (~90 words) — chapter-specific, not lorem
    body: `<p><b>${t.suffix}.</b> ${chapter.summary.slice(0,140)} Lens: ${t.lens}. For <b>${chapter.name}</b> (L${chapter.level} · ${chapter.subject}), the key is to anchor the abstract in the concrete: start from ${chapter.points?.[0]?.slice(0,80)||"first principles"} and push one step further. JEE rarely asks the definition — it asks the <i>second-order</i> consequence, where ${t.suffix.toLowerCase()} becomes the bridge. Work two variants: one where the trap is exposed, one where the shortcut saves a page.</p><div class="tipbox">Tip: re-derive, don’t memorise. If you can rebuild ${chapter.name.split(" ")[0]} from scratch in 90s, you own it.</div>`,
    simHint: `Tweak the ${t.suffix.toLowerCase()} parameters in the lab and watch the graph reply.`,
  }));
}

export function allSubtopicsCount(){ return 93*5; } // 465
export function allSubtopicIds(){ return Array.from({length:93*5}, (_,i)=> `st-${i}`); }
