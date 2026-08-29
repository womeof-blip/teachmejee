/* TeachMeJEE — Class 9–10 Foundation track.
   Basics that let a younger student ascend to the JEE roadmap.
   Each unit bridges into real roadmap chapters (bridgeTo = concept ids).
   Foundation work never grants roadmap XP — it grants readiness. */

export const FOUNDATION_TRACKS = [
  {
    id: "math",
    name: "Mathematics Foundations",
    icon: "∑",
    feeds: "Every maths chapter, L1 onward",
    units: [
      { id: "f-num", estWeeks: 2, name: "Number systems, fractions & percentages",
        summary: "Fluency with rational numbers is the single strongest predictor of calculus speed later.",
        points: ["Fractions ↔ decimals ↔ percentages without a calculator", "Ratio & proportion word problems", "Powers, roots and laws of exponents"],
        bridgeTo: ["f-arithmetic"] },
      { id: "f-alg1", estWeeks: 2, name: "Algebra I — expressions & linear equations",
        summary: "From translating words to equations, to solving and graphing lines.",
        points: ["Simplifying & factorising polynomials", "Linear equations in one and two variables", "Graphing lines; slope as a rate"],
        bridgeTo: ["f-algebra", "M-quad"] },
      { id: "f-geo", estWeeks: 2, name: "Geometry essentials",
        summary: "Triangles, circles and the angle facts every JEE geometry problem assumes.",
        points: ["Triangle congruence & similarity", "Circle theorems: chords, tangents, angles", "Pythagoras in 2D and 3D"],
        bridgeTo: ["M-conics"] },
      { id: "f-trig", estWeeks: 2, name: "Trigonometry introduction",
        summary: "Ratios on the unit circle before identities — the on-ramp to M-trig.",
        points: ["sin/cos/tan from right triangles", "Values at standard angles", "Basic identities and heights-and-distances"],
        bridgeTo: ["M-trig"] },
      { id: "f-stat", estWeeks: 1, name: "Statistics & probability basics",
        summary: "Mean/median/mode plus counting — probability starts here, not in class 11.",
        points: ["Averages and dispersion intuition", "Simple events, dice & cards", "Reading graphs critically"],
        bridgeTo: ["M-stats", "M-prob"] },
    ],
  },
  {
    id: "phy",
    name: "Physics Readiness",
    icon: "⚛",
    feeds: "Mechanics & electricity, Level 0–1",
    units: [
      { id: "f-motion", estWeeks: 1, name: "Motion, speed & graphs",
        summary: "distance-time and velocity-time graphs are half of P-kinematics already.",
        points: ["Speed vs velocity vs acceleration", "Reading v-t graphs (area = distance)", "Uniform vs non-uniform motion"],
        bridgeTo: ["P-kinematics"] },
      { id: "f-force", estWeeks: 1, name: "Force, pressure & Newton's seeds",
        summary: "Push-pull intuition, friction, pressure in fluids.",
        points: ["Balanced vs unbalanced forces", "Pressure = force/area; atmospheric pressure", "Friction: useful and annoying"],
        bridgeTo: ["P-laws", "P-fluids"] },
      { id: "f-work", estWeeks: 1, name: "Work, energy & power primer",
        summary: "The W=Fd and KE ideas that P-wpe builds on formally.",
        points: ["Work done by a force", "Kinetic & potential energy stories", "Power as energy per second"],
        bridgeTo: ["P-wpe"] },
      { id: "f-light", estWeeks: 1, name: "Light — reflection & refraction intro",
        summary: "Law of reflection and lens intuition before ray optics formalism.",
        points: ["Plane & spherical mirrors", "Refraction through glass slab", "Dispersion rainbow demo"],
        bridgeTo: ["P-rayoptics"] },
      { id: "f-elec", estWeeks: 2, name: "Electricity first contact",
        summary: "Circuits, Ohm's law numerically, series vs parallel — P-current becomes easy.",
        points: ["Circuit symbols & simple circuits", "V = IR calculations", "Series vs parallel bulbs"],
        bridgeTo: ["P-current"] },
    ],
  },
  {
    id: "chem",
    name: "Chemistry Readiness",
    icon: "⚗",
    feeds: "Physical & organic chemistry, Level 0–1",
    units: [
      { id: "f-matter", estWeeks: 1, name: "Matter in our surroundings",
        summary: "States, changes of state, particle picture — C-gas assumes all of it.",
        points: ["Solid/liquid/gas particle models", "Melting, boiling, evaporation factors", "Diffusion demos"],
        bridgeTo: ["C-gas"] },
      { id: "f-atoms10", estWeeks: 2, name: "Atoms, molecules & ions",
        summary: "Mole-thinking begins here: counting particles by mass.",
        points: ["Atomic & molecular mass", "Ions and formula units", "Writing chemical formulae (criss-cross)"],
        bridgeTo: ["C-mole", "C-atomic"] },
      { id: "f-react", estWeeks: 1, name: "Chemical reactions & equations",
        summary: "Balancing equations is the grammar of all chemistry ahead.",
        points: ["Word → skeletal → balanced equations", "Reaction types: combination, displacement", "Signs a reaction happened"],
        bridgeTo: ["C-redox", "C-equil"] },
      { id: "f-acid", estWeeks: 1, name: "Acids, bases & salts",
        summary: "pH feel, indicators and neutralisation — equilibrium will feel familiar later.",
        points: ["Indicators & pH scale meaning", "Neutralisation in daily life", "Salt families"],
        bridgeTo: ["C-equil"] },
    ],
  },
  {
    id: "bio",
    name: "Biology Bridge (NEET optional)",
    icon: "❤",
    feeds: "NEET hub cell & physiology topics",
    units: [
      { id: "f-cell", estWeeks: 1, name: "The cell up close",
        summary: "Organelle names now so NEET cell biology is revision, not new learning.",
        points: ["Prokaryote vs eukaryote", "Mitochondria & chloroplast roles", "Microscope skills"],
        bridgeTo: [] },
      { id: "f-body", estWeeks: 1, name: "Human body systems overview",
        summary: "A tour of digestion, breathing, circulation — vocabulary for physiology.",
        points: ["Digestive tract map", "Breathing mechanism basics", "Heart as double pump"],
        bridgeTo: [] },
      { id: "f-plant", estWeeks: 1, name: "Plant life essentials",
        summary: "Photosynthesis and transport vocabulary for the NEET plant units.",
        points: ["Photosynthesis inputs/outputs", "Xylem vs phloem jobs", "Transpiration idea"],
        bridgeTo: [] },
    ],
  },
];

export const ALL_UNITS = FOUNDATION_TRACKS.flatMap((t) => t.units.map((u) => ({ ...u, trackId: t.id })));
export const TOTAL_UNITS = ALL_UNITS.length;
export const TOTAL_WEEKS = ALL_UNITS.reduce((a, u) => a + u.estWeeks, 0);

export function unitById(id) {
  return ALL_UNITS.find((u) => u.id === id) || null;
}
