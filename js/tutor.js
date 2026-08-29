/* TeachMeJEE — Pip, the offline study brain.
   Answers JEE/NEET questions by retrieving from the bundled syllabus,
   formulas, derivations, PYQ solutions, NEET notes — plus the user's own
   progress (weak topics, next steps, countdowns). No network, no API keys. */

import { CONCEPTS, LEVELS, SUBJECTS, ALL_CONCEPTS, TOTAL_XP, DERIVATIONS } from "./data.js";
import { load, getStreak, fIsDone } from "./store.js";
import { daysUntil, fmt } from "./planner.js";
import { PYQS } from "./pyq.js";
import { NEET_TOPICS } from "./neet.js";
import { ALL_UNITS } from "./foundation.js";
import { speak, chime } from "./settings.js";

let lastTopicText = null;
let lastChapterId = null;

const STOP = new Set(("the a an of for in on to is are what whats how why do does did i my me mine can you ur tell about explain give show all and or if it its with from into when where which who whom whose there here that these those please help need want know").split(/\s+/));

function tokens(q) {
  return q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
}

function hits(hay, toks) {
  hay = String(hay).toLowerCase();
  let s = 0;
  for (const t of toks) {
    if (!hay.includes(t)) continue;
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    s += re.test(hay) ? (t.length > 3 ? 3 : 2) : 1;
  }
  return s;
}

/* Inverse document frequency over the syllabus: "escape" outranks "velocity". */
let IDF = null;
function buildIDF() {
  if (IDF) return;
  const df = {};
  const N = ALL_CONCEPTS.length;
  for (const c of ALL_CONCEPTS) {
    const words = new Set((c.name + " " + c.summary).toLowerCase().match(/[a-z0-9]+/g) || []);
    for (const w of words) df[w] = (df[w] || 0) + 1;
  }
  IDF = {};
  for (const w in df) IDF[w] = Math.log(1 + N / df[w]);
}
function wHits(hay, toks) {
  buildIDF();
  hay = String(hay).toLowerCase();
  let s = 0;
  let strong = 0;
  for (const t of toks) {
    if (!hay.includes(t)) continue;
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    const base = re.test(hay) ? (t.length > 3 ? 3 : 2) : 1;
    const idf = IDF[t] != null ? IDF[t] : 2.5;
    if (idf >= 2.4 && base >= 2) strong++;
    s += base * idf;
  }
  return { s, strong };
}

function rankChapters(toks, phrase) {
  const core = toks.length > 1 ? toks.join(" ") : "";
  return ALL_CONCEPTS
    .map((c) => {
      const lc = (x) => String(x).toLowerCase();
      const name = wHits(c.name, toks);
      const sum = wHits(c.summary, toks);
      let s = name.s * 3 + sum.s * 1.2
        + c.points.reduce((a, p) => a + wHits(p, toks).s * 0.25, 0)
        + c.formulas.reduce((a, f) => a + wHits(`${f.n} ${f.f} ${f.d || ""}`, toks).s * 0.6, 0)
        + c.subs.reduce((a, sb) => a + wHits(`${sb.n} ${sb.d}`, toks).s * 0.2, 0);
      let boost = 0;
      if (core) {
        if (c.formulas.some((f) => lc(f.n).includes(core))) boost += 45;
        if (lc(c.name).includes(core)) boost += 38;
        else if (lc(c.summary).includes(core)) boost += 16;
        if (c.subs.some((sb) => lc(sb.n).includes(core))) boost += 8;
      }
      s += boost;
      const strong = name.strong + sum.strong > 0;
      const phraseHit = boost > 0 || (phrase.length > 5 && lc(c.name).includes(phrase));
      return { c, s, qualify: strong || phraseHit || name.s >= 3 };
    })
    .filter((x) => x.s > 0 && x.qualify)
    .sort((a, b) => b.s - a.s);
}

function rankNeet(toks, phrase) {
  buildIDF();
  const core = toks.length > 1 ? toks.join(" ") : "";
  return NEET_TOPICS
    .map((t) => {
      const hay = `${t.name} ${t.summary} ${t.points.join(" ")} ${t.terms.join(" ")}`;
      const r = wHits(hay, toks);
      let s = r.s;
      const lc = (x) => String(x).toLowerCase();
      if (core) {
        if (lc(t.name).includes(core)) s += 38;
        else if (hay.toLowerCase().includes(core)) s += 14;
      }
      const qualify = r.strong > 0 || (core && lc(t.name).includes(core));
      return { t, s, qualify };
    })
    .filter((x) => x.s > 0 && x.qualify)
    .sort((a, b) => b.s - a.s);
}

function rankPyq(toks) {
  return PYQS
    .map((q) => ({ q, s: hits(q.q, toks) + hits(q.why, toks) * 0.5 + (q.chapName ? hits(q.chapName, toks) : 0) }))
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s);
}

function accuracyOf(id) {
  const rec = load().quizByConcept[id];
  return rec && rec.t >= 2 ? rec.c / rec.t : null;
}

function frontier(limit = 3) {
  const done = new Set(load().completed);
  return ALL_CONCEPTS
    .filter((c) => !done.has(c.id) && c.prereq.every((p) => done.has(p)))
    .sort((a, b) => a.level - b.level || b.xp - a.xp)
    .slice(0, limit);
}

function weakList(limit = 3) {
  const out = [];
  for (const c of ALL_CONCEPTS) {
    const acc = accuracyOf(c.id);
    if (acc != null && acc < 0.8) out.push({ c, acc });
  }
  return out.sort((a, b) => a.acc - b.acc).slice(0, limit);
}

function countdownLine() {
  const p = load().planner;
  const dm = daysUntil(p.mainDate);
  const da = daysUntil(p.advDate);
  return `JEE Main (${fmt(p.mainDate)}): ${dm >= 0 ? dm + " days left" : "date passed"}\nJEE Advanced (${fmt(p.advDate)}): ${da >= 0 ? da + " days left" : "date passed"}`;
}

function chapterAnswer(c, toks) {
  const done = new Set(load().completed);
  const st = done.has(c.id) ? "mastered" : c.prereq.every((p) => done.has(p)) ? "unlocked now" : "locked until prerequisites are done";
  const lines = [];
  lines.push(`${c.name} — ${SUBJECTS[c.subject].name}, ${LEVELS[c.level] ? LEVELS[c.level].title : "L" + c.level} · ${st}.`);
  lines.push("");
  lines.push(c.summary);
  if (c.points.length) {
    lines.push("");
    lines.push("Key points:");
    for (const p of c.points.slice(0, 3)) lines.push("- " + p);
  }
  if (c.formulas.length) {
    lines.push("");
    lines.push("Core formulas:");
    for (const f of c.formulas.slice(0, 3)) lines.push(`- ${f.n}: ${f.f}`);
  }
  const relPyq = PYQS.filter((q) => q.chap === c.id);
  if (relPyq.length) {
    lines.push("");
    lines.push(`${relPyq.length} past-paper question${relPyq.length === 1 ? "" : "s"} on this live in the PYQ bank.`);
  }
  if (c.sim) lines.push("There is an interactive 3D lab on the Simulation tab.");
  lastTopicText = lines.join("\n");
  lastChapterId = c.id;
  speak(lines.join(". "));
  const acts = [{ label: "Open chapter", href: `#/chapter/${c.id}` }];
  if (relPyq.length) acts.push({ label: "See PYQs", href: "#/pyq" });
  const followups = [];
  if (c.formulas[0]) followups.push(`Derivation of ${c.formulas[0].n.toLowerCase()}?`);
  const nxt = ALL_CONCEPTS.find((n) => n.prereq.includes(c.id) && !done.has(n.id));
  if (nxt) followups.push(`What does ${c.name} unlock?`);
  void toks;
  return { text: lines.join("\n"), actions: acts, followups };
}

function neetAnswer(t, toks) {
  void toks;
  const lines = [];
  lines.push(`${t.name} — NEET ${t.unit}.`);
  lines.push("");
  lines.push(t.summary);
  if (t.points.length) {
    lines.push("");
    lines.push("NCERT anchors:");
    for (const p of t.points.slice(0, 4)) lines.push("- " + p);
  }
  if (t.model) lines.push("");
  lines.push(t.model ? "An interactive 3D model for this lives in NEET hub > Biology models." : "More depth lives in the NEET hub notes.");
  const qs = NEET_TOPICS.filter((x) => x.unit === t.unit).reduce((a, x) => a + (x.qcount || 0), 0);
  if (qs) lines.push(`Roughly ${qs} NEET questions historically come from the ${t.unit} unit.`);
  return {
    text: lines.join("\n"),
    actions: [{ label: "Open NEET hub", href: "#/neet" }],
    followups: [`Quiz me on ${t.name}?`, "Biology models"],
  };
}

/* Curated topic router: famous exam phrases map straight to their home chapter.
   Longest matching alias wins; everything else falls through to scoring. */
const TOPIC_ROUTES = [
  ["escape velocity", "P-gravitation"], ["kepler", "P-gravitation"], ["orbital velocity", "P-gravitation"], ["gravitational potential", "P-gravitation"],
  ["projectile", "P-kinematics"], ["relative velocity", "P-kinematics"], ["equations of motion", "P-kinematics"],
  ["newton", "P-laws"], ["friction", "P-laws"], ["inertia", "P-laws"],
  ["work energy theorem", "P-wpe"], ["conservation of energy", "P-wpe"],
  ["simple harmonic", "P-shm"], ["shm", "P-shm"], ["pendulum", "P-shm"], ["oscillation", "P-shm"],
  ["moment of inertia", "P-rotation"], ["torque", "P-rotation"], ["angular momentum", "P-rotation"], ["rolling", "P-rotation"],
  ["bernoulli", "P-fluids"], ["viscosity", "P-fluids"], ["terminal velocity", "P-fluids"], ["surface tension", "P-fluids"], ["archimedes", "P-fluids"],
  ["kinetic theory", "P-ktg"], ["degrees of freedom", "P-ktg"], ["maxwell", "P-ktg"],
  ["doppler", "P-waves"], ["beats", "P-waves"], ["standing wave", "P-waves"], ["resonance", "P-waves"], ["interference", "P-waves"],
  ["thin lens", "P-rayoptics"], ["mirror formula", "P-rayoptics"], ["total internal reflection", "P-rayoptics"], ["snell", "P-rayoptics"], ["dispersion", "P-rayoptics"],
  ["faraday", "P-emi"], ["lenz", "P-emi"], ["induced emf", "P-emi"], ["transformer", "P-emi"], ["self inductance", "P-emi"],
  ["ohm", "P-current"], ["kirchhoff", "P-current"], ["wheatstone", "P-current"], ["potentiometer", "P-current"],
  ["biot", "P-magnet"], ["ampere", "P-magnet"], ["cyclotron", "P-magnet"], ["solenoid", "P-magnet"],
  ["photoelectric", "P-dual"], ["de broglie", "P-dual"], ["work function", "P-dual"], ["stopping potential", "P-dual"],
  ["bohr", "P-atoms"], ["balmer", "P-atoms"], ["hydrogen spectrum", "P-atoms"],
  ["zener", "P-semi"], ["rectifier", "P-semi"], ["logic gate", "P-semi"], ["p-n junction", "P-semi"], ["transistor", "P-semi"],
  ["mole concept", "C-mole"], ["molarity", "C-mole"], ["molality", "C-mole"], ["stoichiometry", "C-mole"], ["limiting reagent", "C-mole"],
  ["ideal gas", "C-gas"], ["boyle", "C-gas"], ["charles law", "C-gas"], ["van der waals", "C-gas"], ["dalton", "C-gas"],
  ["hess", "C-thermo"], ["enthalpy", "C-thermo"], ["entropy", "C-thermo"], ["gibbs", "C-thermo"], ["spontaneity", "C-thermo"],
  ["quantum number", "C-atomic"], ["aufbau", "C-atomic"], ["hund", "C-atomic"], ["heisenberg", "C-atomic"], ["orbital", "C-atomic"],
  ["hybridis", "C-bonding"], ["vsepr", "C-bonding"], ["hydrogen bond", "C-bonding"], ["bond order", "C-bonding"], ["molecular orbital", "C-bonding"],
  ["oxidation number", "C-redox"], ["balancing redox", "C-redox"],
  ["nernst", "C-electro"], ["electrolysis", "C-electro"], ["kohlrausch", "C-electro"], ["galvanic", "C-electro"], ["electrode potential", "C-electro"],
  ["arrhenius", "C-kinetics"], ["rate law", "C-kinetics"], ["half life", "C-kinetics"], ["order of reaction", "C-kinetics"],
  ["le chatelier", "C-equil"], ["buffer", "C-equil"], ["common ion", "C-equil"], ["solubility product", "C-equil"], ["ph of", "C-equil"],
  ["markovnikov", "C-orgbasic"], ["iupac", "C-orgbasic"], ["inductive effect", "C-orgbasic"], ["sn1", "C-orgbasic"], ["sn2", "C-orgbasic"],
  ["aldol", "C-carbonyl"], ["cannizzaro", "C-carbonyl"], ["tollens", "C-carbonyl"], ["clemmensen", "C-carbonyl"],
  ["de moivre", "M-complex"], ["cube roots of unity", "M-complex"], ["argand", "M-complex"],
  ["chain rule", "M-diff"], ["implicit differentiation", "M-diff"], ["maxima", "M-diff"], ["rolle", "M-diff"], ["lagrange", "M-diff"],
  ["integration by parts", "M-integ"], ["definite integral", "M-integ"], ["substitution", "M-integ"], ["area under curve", "M-integ"],
  ["bayes", "M-prob"], ["binomial distribution", "M-prob"], ["conditional probability", "M-prob"],
  ["scalar triple product", "M-vectors"], ["cross product", "M-vectors"], ["dot product", "M-vectors"], ["projection of vector", "M-vectors"],
  ["eccentricity", "M-conics"], ["hyperbola", "M-conics"], ["parabola", "M-conics"], ["ellipse", "M-conics"],
  ["arithmetic progression", "M-seq"], ["geometric progression", "M-seq"], ["ap gp", "M-seq"], ["harmonic progression", "M-seq"],
  ["quadratic", "M-quad"], ["discriminant", "M-quad"], ["nature of roots", "M-quad"],
  ["l hospital", "M-limits"], ["continuity and differentiability", "M-diff"],
  ["variance", "M-stats"], ["standard deviation", "M-stats"], ["mean deviation", "M-stats"],
  ["fluid mosaic", "n-cell"], ["cell theory", "n-cell"],
  ["kranz", "n-photo"], ["calvin cycle", "n-photo"], ["rubisco", "n-photo"], ["c4 plants", "n-photo"], ["cam plants", "n-photo"],
  ["nephron", "n-excretory"], ["counter current", "n-excretory"], ["adh", "n-excretory"], ["gfr", "n-excretory"],
  ["sa node", "n-circulation"], ["cardiac output", "n-circulation"], ["ecg", "n-circulation"], ["blood clotting", "n-circulation"],
  ["lac operon", "n-molecular"], ["okazaki", "n-molecular"], ["genetic code", "n-molecular"], ["dna replication", "n-molecular"],
  ["down syndrome", "n-inherit"], ["mendel", "n-inherit"], ["haemophilia", "n-inherit"], ["klinefelter", "n-inherit"],
  ["adaptive radiation", "n-evolution"], ["hardy weinberg", "n-evolution"], ["darwin", "n-evolution"],
  ["action potential", "n-neural"], ["saltatory conduction", "n-neural"], ["synapse", "n-neural"], ["resting potential", "n-neural"],
  ["insulin", "n-hormone"], ["pituitary", "n-hormone"], ["thyroid", "n-hormone"],
  ["transpiration pull", "n-transport"], ["stomata open", "n-transport"], ["pressure flow", "n-transport"],
  ["nitrogen fixation", "n-mineral"], ["leghaemoglobin", "n-mineral"], ["chlorosis", "n-mineral"],
  ["penicillin", "n-microbes"], ["biogas", "n-microbes"], ["bt cotton", "n-microbes"], ["yeast fermentation", "n-microbes"],
  ["plasmodium", "n-health"], ["antibody", "n-health"], ["aids", "n-health"], ["malaria", "n-health"],
];

function routeTopic(l) {
  let best = null;
  for (const [alias, target] of TOPIC_ROUTES) {
    if (l.includes(alias) && (!best || alias.length > best.alias.length)) best = { alias, target };
  }
  return best;
}

export function answerTutor(raw) {
  let q = String(raw || "").trim();
  if (!q) {
    return { text: "Ask me anything from the syllabus — definitions, formulas, derivations, past questions, or what to study next.", actions: [], followups: ["What should I study next?", "Days left for JEE Main?", "Formula for escape velocity"] };
  }

  /* Slash commands */
  if (q.startsWith("/")) {
    const cmd = q.slice(1).toLowerCase().split(/\s+/)[0];
    const arg = q.slice(1 + cmd.length).trim();
    if (cmd === "quiz") {
      const sub = arg && SUBJECTS[arg.toUpperCase()] ? ` on ${SUBJECTS[arg.toUpperCase()].name}` : "";
      return { text: `Rolling an${sub} set now.`, actions: [{ label: "Start quiz", href: "#/quiz" }], followups: [] };
    }
    if (cmd === "pyq") {
      return { text: arg ? `Filtering the PYQ bank for "${arg}".` : "Opening the PYQ bank.", actions: [{ label: "PYQ bank", href: "#/pyq" }], followups: [] };
    }
    if (cmd === "plan") return { text: countdownLine(), actions: [{ label: "Planner", href: "#/planner" }], followups: [] };
    if (cmd === "flash") return { text: "Deck's ready.", actions: [{ label: "Flash revision", href: "#/flash" }], followups: [] };
    if (cmd === "help" || cmd === "?") {
      return { text: "Commands: /quiz [P|C|M] · /pyq [topic] · /plan · /flash — or just ask in plain words.", actions: [], followups: [] };
    }
  }

  /* Conversation context: "more", "why?", "continue" reuse the last topic */
  if (/^(more|continue|go on|tell me more|why\??|elaborate)\b/i.test(q) && lastTopicText) {
    return { text: lastTopicText, actions: lastChapterId ? [{ label: "Open chapter", href: `#/chapter/${lastChapterId}` }] : [], followups: ["Quiz me"] };
  }

  const l = q.toLowerCase();
  const toks = tokens(q);

  if (/^(hi|hello|hey|yo|hii+)\b/.test(l) || /\bhelp\b/.test(l)) {
    return {
      text: "I am Pip — I read your syllabus so you do not have to search.\nTry:\n- Explain any topic (\"escape velocity\", \"Kranz anatomy\")\n- \"Formula for ...\" or \"derivation of ...\"\n- \"What should I study next?\", \"my weak areas\"\n- \"days left for Advanced\"",
      actions: [],
      followups: ["Explain SHM", "My weak areas", "Quiz me"],
    };
  }

  const routed = routeTopic(l);
  if (routed) {
    const target = CONCEPTS[routed.target];
    if (target) return chapterAnswer(target, toks);
    const nt = NEET_TOPICS.find((t) => t.id === routed.target);
    if (nt) return neetAnswer(nt, toks);
  }

  if (/\b(day|days|left|countdown|remaining)\b/.test(l) && !/\bstreak\b/.test(l)) {
    return { text: countdownLine(), actions: [{ label: "Planner", href: "#/planner" }], followups: ["What should I study next?"] };
  }

  /* Foundation units — the class 9/10 on-ramp */
  const unitHit = ALL_UNITS
    .map((u) => ({ u, s: hits(u.name, toks) * 3 + hits(u.summary, toks) + u.points.reduce((a, p) => a + hits(p, toks) * 0.5, 0) }))
    .filter((x) => x.s >= 6)
    .sort((a, b) => b.s - a.s)[0];
  if (unitHit) {
    const u = unitHit.u;
    const done = fIsDone(u.id);
    const lines = [`${u.name} — Class 9–10 foundation (~${u.estWeeks} week${u.estWeeks > 1 ? "s" : ""}).`, "", u.summary, ""];
    for (const p of u.points) lines.push("- " + p);
    lastTopicText = lines.join("\n");
    speak(lines.join(". "));
    return {
      text: lines.join("\n"),
      actions: [{ label: done ? "Open launchpad" : "Mark as learnt", href: "#/foundation" }],
      followups: [`What should I study next?`],
    };
  }


  if (/\b(weak|weakness|struggl|worse|worst|bad at|improve|fix)\b/.test(l)) {
    const weak = weakList();
    if (!weak.length) {
      const f = frontier();
      return {
        text: "No weak spots flagged yet — quizzes decide that. Accuracy under 80% on a mastered chapter lands it here.\nMeanwhile, your highest-yield next chapters:",
        actions: f.map((c) => ({ label: c.name, href: `#/chapter/${c.id}` })),
        followups: ["Quiz me", "What should I study next?"],
      };
    }
    return {
      text: "Based on your quiz record, tighten these first:\n" + weak.map((w) => `- ${w.c.name} — ${Math.round(w.acc * 100)}% accuracy`).join("\n"),
      actions: weak.map((w) => ({ label: w.c.name, href: `#/chapter/${w.c.id}` })),
      followups: ["Quiz me", "Revisions due"],
    };
  }

  if (/\b(next|now|recommend|suggest|study|start|begin)\b/.test(l) && !/formula|equation/.test(l)) {
    const recs = frontier(3);
    if (!recs.length) return { text: "The roadmap is complete. Nothing left to unlock — go own those PYQs.", actions: [{ label: "PYQ bank", href: "#/pyq" }], followups: [] };
    return {
      text: "Your unlocked frontier, sorted by yield:\n" + recs.map((c, i) => `${i + 1}. ${c.name} (+${c.xp} XP, L${c.level})`).join("\n") + "\nRule of thumb: clear the lowest level first — gates depend on it.",
      actions: recs.map((c) => ({ label: c.name, href: `#/chapter/${c.id}` })),
      followups: ["Days left for JEE Main?", "Quiz me"],
    };
  }

  if (/\b(quiz|test me|mcq)\b/.test(l)) {
    let sub = "";
    if (/\bphysic/.test(l)) sub = " Physics";
    if (/\bchem/.test(l)) sub = " Chemistry";
    if (/\b(math|maths|mathematic)/.test(l)) sub = " Maths";
    if (/neet|bio/.test(l)) {
      return { text: "Opening the NEET practice set — 8 NCERT-true questions.", actions: [{ label: "NEET practice", href: "#/neet" }], followups: [] };
    }
    return { text: `Rolling an 8-question${sub} set from chapters you have mastered. Keys 1–4 answer, Enter advances.`, actions: [{ label: "Start quiz", href: "#/quiz" }, { label: "Timed mode inside", href: "#/quiz" }], followups: [] };
  }

  if (/\b(flash|flip|card)s?\b/.test(l) && !/formula for/.test(l)) {
    return { text: "Flash revision retires cards you know and reschedules the rest (1/3/7/16-day spacing). Due cards show as a chip.", actions: [{ label: "Open flash deck", href: "#/flash" }], followups: [] };
  }

  if (/\b(streak|xp|score|progress|rank|level)\b/.test(l)) {
    const s = load();
    const xp = s.completed.reduce((a, id) => a + (CONCEPTS[id] ? CONCEPTS[id].xp : 0), 0) + (s.bonusXp || 0);
    return {
      text: `${getStreak()}-day streak · ${xp}/${TOTAL_XP} XP · ${s.completed.length}/${ALL_CONCEPTS.length} chapters mastered.\nConsistency beats intensity — protect the streak.`,
      actions: [{ label: "Statistics", href: "#/stats" }],
      followups: ["What should I study next?"],
    };
  }

  const wantsFormula = /\b(formula|equation|law of|expression for)\b/.test(l);
  const wantsDeriv = /\b(deriv|prove|proof|derive)\b/.test(l);
  const phrase = l.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  if (wantsFormula || wantsDeriv) {
    buildIDF();
    const scored = [];
    for (const c of ALL_CONCEPTS) {
      for (const f of c.formulas) {
        const r = wHits(`${f.n} ${f.f} ${f.d || ""}`, toks);
        const s = r.s + wHits(c.name, toks).s * 0.4;
        if (s > 0) scored.push({ c, f, s });
      }
    }
    scored.sort((a, b) => b.s - a.s);
    if (scored.length && scored[0].s >= 6) {
      const top = scored.slice(0, 3);
      const lines = wantsDeriv && DERIVATIONS[top[0].c.id]
        ? [`${top[0].f.n} — where it comes from:`, "", DERIVATIONS[top[0].c.id]]
        : top.map((x) => `${x.f.n}\n  ${x.f.f}${x.f.d ? "\n  (" + x.f.d + ")" : ""}\n  [${x.c.name}]`);
      if (wantsDeriv && !DERIVATIONS[top[0].c.id]) lines.unshift(`${top[0].f.n}:`);
      return {
        text: lines.join("\n"),
        actions: [{ label: `Open ${top[0].c.name}`, href: `#/chapter/${top[0].c.id}` }],
        followups: [`Explain ${top[0].c.name}`, `PYQs on ${top[0].c.name}?`],
      };
    }
  }

  const pyqTop = rankPyq(toks)[0];
  const chapsAll = rankChapters(toks, phrase);
  const minDistinct = Math.min(2, toks.length);
  const distinctIn = (c) => toks.filter((t) => hits(`${c.name} ${c.summary}`, [t]) > 0).length;
  const chaps = chapsAll.filter((x) => x.s >= 6 && distinctIn(x.c) >= minDistinct);
  const neetHit = rankNeet(toks, phrase)[0];
  const bestNeet = neetHit && neetHit.s >= 5 && (!chaps[0] || neetHit.s >= chaps[0].s * 0.8) ? neetHit : null;

  const pyqDistinct = toks.filter((t) => hits(`${pyqTop ? pyqTop.q.q : ""} ${pyqTop ? pyqTop.q.why : ""}`, [t]) > 0).length;
  if (pyqTop && pyqDistinct >= 2 && pyqTop.s >= 5 && pyqTop.s >= Math.max(chaps[0] ? chaps[0].s : 0, bestNeet ? bestNeet.s : 0) * 1.15) {
    const q = pyqTop.q;
    return {
      text: `${q.exam === "adv" ? "JEE Advanced" : "JEE Main"} ${q.year} asked:\n"${q.q}"\n\nAnswer: (${String.fromCharCode(65 + q.a)}) ${q.opts[q.a]}\nWhy: ${q.why}`,
      actions: [{ label: "PYQ bank", href: "#/pyq" }, ...(CONCEPTS[q.chap] ? [{ label: q.chapName, href: `#/chapter/${q.chap}` }] : [])],
      followups: ["Quiz me", "More PYQs like this"],
    };
  }

  if (bestNeet) return neetAnswer(bestNeet.t, toks);
  if (chaps[0]) {
    if (wantsDeriv && !chaps[0].c.formulas.length && DERIVATIONS[chaps[0].c.id]) {
      return { text: DERIVATIONS[chaps[0].c.id], actions: [{ label: `Open ${chaps[0].c.name}`, href: `#/chapter/${chaps[0].c.id}` }], followups: [`Formulas in ${chaps[0].c.name}?`] };
    }
    return chapterAnswer(chaps[0].c, toks);
  }

  return {
    text: "That one is outside my syllabus map. I am strongest on the 93 roadmap chapters, their formulas, the PYQ bank and NEET biology. Try a topic name like \"Bernoulli\", \"Nernst\" or \"photosynthesis\".",
    actions: [{ label: "Browse syllabus", href: "#/browse" }],
    followups: ["What should I study next?", "Days left for JEE Main?"],
  };
}
