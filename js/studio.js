/* Spline scene catalog + runtime loader. Public prod.spline.design URLs. */

export const SPLINE_SCENES = [
  { id: "cube", title: "Interactive cube", blurb: "Official Spline runtime demo — drag, hover, click.", url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
  { id: "scene-k", title: "Studio object", blurb: "Second official export used in Spline’s React docs.", url: "https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode" },
  { id: "in9", title: "POC scene", blurb: "Community scene from public Spline examples.", url: "https://prod.spline.design/IN9PUsuOpxoZgPWh/scene.splinecode" },
  { id: "bpy", title: "Loader sample", blurb: "Scene used with @splinetool/loader.", url: "https://prod.spline.design/bPyo53wTrYqJgajV/scene.splinecode" },
  { id: "6zq", title: "Svelte sample", blurb: "Another public .splinecode used in open examples.", url: "https://prod.spline.design/6ZQA4GzzFjXNeDE4/scene.splinecode" },
];

export const STUDIO_SIMS = [
  { id: "studio-knot", title: "Glass knot", blurb: "Physical-material torus knot." },
  { id: "studio-orb", title: "Orbital swarm", blurb: "Icosahedron core with orbiting beads." },
  { id: "studio-atom", title: "Atom studio", blurb: "Nucleus and electron shells." },
  { id: "studio-helix", title: "Helix strand", blurb: "Beaded helix with live twist." },
  { id: "studio-city", title: "Block city", blurb: "Minimal massing model." },
  { id: "torus-knot-studio", title: "p,q knot", blurb: "Parametric torus knot." },
  { id: "platonic-family", title: "Platonics", blurb: "Five regular solids." },
  { id: "mobius-strip", title: "Möbius", blurb: "One-sided surface." },
  { id: "tesseract-proj", title: "Tesseract", blurb: "4D cube projected to 3D." },
  { id: "geodesic-dome", title: "Geodesic", blurb: "Icosahedral subdivision." },
  { id: "fibonacci-cone", title: "Phyllotaxis", blurb: "Golden-angle packing." },
  { id: "dna-supercoil", title: "DNA coil", blurb: "Antiparallel helices." },
];

export const SIM_LABELS = {
  "double-pendulum": ["Chaos pendulum", "Physics"],
  "lissajous-3d": ["Lissajous 3D", "Maths"],
  "bloch-sphere": ["Bloch sphere", "Physics"],
  "kepler-system": ["Kepler orbit", "Physics"],
  "fourier-stack": ["Fourier square wave", "Maths"],
  "platonic-family": ["Platonic solids", "Maths"],
  "mobius-strip": ["Möbius strip", "Maths"],
  "torus-knot-studio": ["Torus knot", "Maths"],
  "lorentz-helix": ["Lorentz helix", "Physics"],
  "coupled-springs": ["Coupled springs", "Physics"],
  "brownian-gas": ["Brownian gas", "Physics"],
  "hydrogen-cloud": ["Hydrogen cloud", "Chemistry"],
  "bragg-lattice": ["Bragg lattice", "Physics"],
  "atwood-machine": ["Atwood machine", "Physics"],
  "transformer-core": ["Transformer", "Physics"],
  "helmholtz-pair": ["Helmholtz coils", "Physics"],
  "chladni-plate": ["Chladni plate", "Physics"],
  "fibonacci-cone": ["Fibonacci packing", "Maths"],
  "tesseract-proj": ["Tesseract", "Maths"],
  "magnetic-bottle": ["Magnetic bottle", "Physics"],
  "rutherford-scatter": ["Rutherford scatter", "Physics"],
  "catenary-arch": ["Catenary", "Maths"],
  "geodesic-dome": ["Geodesic dome", "Maths"],
  "quantum-well-3d": ["Particle in a box", "Physics"],
  "millikan-drop": ["Millikan drop", "Physics"],
  "dna-supercoil": ["DNA helix", "Biology"],
  "crystal-fcc": ["FCC crystal", "Chemistry"],
  "crystal-bcc": ["BCC crystal", "Chemistry"],
  "young-screen": ["Young screen", "Physics"],
  "capacitor-field": ["Capacitor field", "Physics"],
  "gyroscope-precess": ["Gyroscope", "Physics"],
  "golden-spiral": ["Golden spiral", "Maths"],
  "studio-knot": ["Glass knot", "Studio"],
  "studio-orb": ["Orbital swarm", "Studio"],
  "studio-atom": ["Atom studio", "Studio"],
  "studio-helix": ["Helix strand", "Studio"],
  "studio-city": ["Block city", "Studio"],
};

let viewerReady = null;
export function ensureSplineViewer() {
  if (customElements.get("spline-viewer")) return Promise.resolve();
  if (viewerReady) return viewerReady;
  viewerReady = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Spline viewer"));
    document.head.append(s);
  });
  return viewerReady;
}

export function makeSplineFrame(url) {
  const host = document.createElement("div");
  host.className = "spline-host";
  const note = document.createElement("div");
  note.className = "sim-loading";
  note.textContent = "Loading Spline scene…";
  host.append(note);
  ensureSplineViewer().then(() => {
    note.remove();
    const v = document.createElement("spline-viewer");
    v.setAttribute("url", url);
    v.setAttribute("loading-anim-type", "spinner-small-dark");
    host.append(v);
  }).catch(() => {
    note.textContent = "Spline viewer blocked (offline or CDN). Use the studio models below — they run locally.";
  });
  return host;
}
