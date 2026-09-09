import { register } from "./engine.js";

/* Viscosity: falling sphere terminal velocity — drag vs buoyancy vs gravity. */
register("viscosity", ({ THREE, group, makeGrid, makeTextSprite }) => {
  const g = new THREE.Group();
  group.add(g);
  makeGrid(g, 6, 6);
  const tubeMat = new THREE.MeshStandardMaterial({ color: "#4a6fa5", transparent: true, opacity: 0.35 });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 20, 1, true), tubeMat);
  tube.position.y = 0;
  g.add(tube);
  const ballMat = new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.4 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), ballMat);
  g.add(ball);
  const topLabel = makeTextSprite("h = 2.5 m", { fontSize: 36 });
  topLabel.position.set(1.2, 2.5, 0);
  g.add(topLabel);
  let viscosity = 0.8, radius = 0.02, density = 7800, fluidDensity = 1000, gravity = 9.8;
  let y = 2.5, v = 0, running = true;
  function terminalV() {
    const eta = viscosity;
    const r = radius;
    return (2 * r * r * (density - fluidDensity) * gravity) / (9 * eta);
  }
  function layout() {
    ball.position.y = y;
    topLabel.material.opacity = 0;
  }
  layout();
  return {
    controls: [
      { key: "visc", label: "Viscosity η (Pa·s)", min: 0.01, max: 2.0, step: 0.01, value: viscosity },
      { key: "rad", label: "Sphere radius (m)", min: 0.005, max: 0.05, step: 0.001, value: radius },
      { key: "rho", label: "Sphere density (kg/m³)", min: 1000, max: 12000, step: 100, value: density },
      { key: "run", label: "Run / Pause", type: "toggle", value: 1 },
      { key: "restart", label: "Restart", type: "button" },
    ],
    set(key, v) {
      if (key === "visc") viscosity = v;
      if (key === "rad") radius = v;
      if (key === "rho") density = v;
      if (key === "run") running = !!v;
      if (key === "restart") { y = 2.5; v = 0; running = true; }
    },
    tick(_t, dt) {
      if (!running) return;
      const r = radius;
      const buoyancy = (4 / 3) * Math.PI * r * r * r * fluidDensity * gravity;
      const drag = 6 * Math.PI * viscosity * r * v;
      const weight = (4 / 3) * Math.PI * r * r * r * density * gravity;
      const netF = weight - buoyancy - drag;
      const mass = (4 / 3) * Math.PI * r * r * r * density;
      v += (netF / mass) * dt;
      y -= v * dt * 0.3;
      if (y < -2.5) { y = 2.5; v = 0; }
      layout();
    },
  };
});

/* Calorimetry: hot + cold water mixing, thermometer reads final T. */
register("calorimetry", ({ THREE, group, makeGrid, makeTextSprite }) => {
  const g = new THREE.Group();
  group.add(g);
  makeGrid(g, 6, 6);
  const beakerGeo = new THREE.CylinderGeometry(0.6, 0.5, 1.6, 20, 1, true);
  const beakerMat = new THREE.MeshStandardMaterial({ color: "#a0c4e8", transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const beaker = new THREE.Mesh(beakerGeo, beakerMat);
  beaker.position.y = -0.5;
  g.add(beaker);
  const waterGeo = new THREE.CylinderGeometry(0.55, 0.48, 1.2, 20);
  const coldMat = new THREE.MeshStandardMaterial({ color: "#4a90d9", transparent: true, opacity: 0.6 });
  const hotMat = new THREE.MeshStandardMaterial({ color: "#e85d3a", transparent: true, opacity: 0.6 });
  const coldWater = new THREE.Mesh(waterGeo, coldMat);
  coldWater.position.y = -0.7;
  coldWater.visible = true;
  g.add(coldWater);
  const hotWater = new THREE.Mesh(waterGeo, hotMat);
  hotWater.position.y = 0.4;
  hotWater.visible = false;
  g.add(hotWater);
  const thermoMat = new THREE.MeshStandardMaterial({ color: "#e86f52" });
  const thermo = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.06), new THREE.MeshStandardMaterial({ color: "#ccc" }));
  thermo.position.set(0.8, 0, 0);
  g.add(thermo);
  const mercury = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 0.04), thermoMat);
  mercury.position.set(0.8, -0.5, 0);
  g.add(mercury);
  let mCold = 0.2, TCold = 20, mHot = 0.2, THot = 80, Cp = 4186;
  let mixed = false, Tfinal = 20;
  function calcFinal() {
    Tfinal = (mCold * Cp * TCold + mHot * Cp * THot) / ((mCold + mHot) * Cp);
    return Tfinal;
  }
  function layout() {
    coldWater.scale.y = mCold / 0.2;
    hotWater.scale.y = mHot / 0.2;
    const tF = mixed ? calcFinal() : TCold;
    const h = ((tF - 0) / 100) * 1.8;
    mercury.scale.y = Math.max(0.05, h);
    mercury.position.y = -1.4 + h / 2;
  }
  layout();
  return {
    controls: [
      { key: "mC", label: "Cold water mass (kg)", min: 0.05, max: 0.5, step: 0.01, value: mCold },
      { key: "TC", label: "Cold temp (°C)", min: 0, max: 40, step: 1, value: TCold },
      { key: "mH", label: "Hot water mass (kg)", min: 0.05, max: 0.5, step: 0.01, value: mHot },
      { key: "TH", label: "Hot temp (°C)", min: 40, max: 100, step: 1, value: THot },
      { key: "mix", label: "Mix", type: "button" },
      { key: "reset", label: "Reset", type: "button" },
    ],
    set(key, v) {
      if (key === "mC") mCold = v;
      if (key === "TC") TCold = v;
      if (key === "mH") mHot = v;
      if (key === "TH") THot = v;
      if (key === "mix") { mixed = true; coldWater.visible = false; hotWater.visible = false; }
      if (key === "reset") { mixed = false; coldWater.visible = true; hotWater.visible = true; }
      layout();
    },
    tick() {},
  };
});

/* Biomolecules: amino acid → peptide bond → protein backbone 3D ribbon. */
register("biomolecules", ({ THREE, group, makeTextSprite }) => {
  const g = new THREE.Group();
  group.add(g);
  const atomColors = { C: "#555", O: "#e84040", N: "#4488ff", H: "#ccc", S: "#ddcc00" };
  const atomMat = {};
  for (const [k, c] of Object.entries(atomColors)) atomMat[k] = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 });
  function makeAtom(el, x, y, z, s) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(s || 0.12, 12, 12), atomMat[el]);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  }
  function makeBond(a, b) {
    const dir = new THREE.Vector3().subVectors(b.position, a.position);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(a.position, b.position).multiplyScalar(0.5);
    const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 6), new THREE.MeshStandardMaterial({ color: "#888" }));
    bond.position.copy(mid);
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    g.add(bond);
  }
  const atoms = [];
  const backbone = [
    { el: "N", x: -2.0, y: 0 },
    { el: "C", x: -1.2, y: 0.3 },
    { el: "C", x: -0.4, y: 0 },
    { el: "N", x: 0.4, y: 0.3 },
    { el: "C", x: 1.2, y: 0 },
    { el: "C", x: 2.0, y: 0.3 },
  ];
  backbone.forEach((a) => atoms.push(makeAtom(a.el, a.x, a.y, 0, 0.14)));
  for (let i = 0; i < atoms.length - 1; i++) makeBond(atoms[i], atoms[i + 1]);
  makeAtom("O", -0.4, -0.8, 0, 0.1);
  makeAtom("H", 0.4, 1.1, 0, 0.08);
  makeAtom("H", -2.0, -0.7, 0, 0.08);
  makeAtom("CH3", 2.0, 1.1, 0, 0.16);
  const label = makeTextSprite("Peptide backbone (N-C-C-N-C-C)", { fontSize: 30 });
  label.position.set(0, 1.8, 0);
  g.add(label);
  let angle = 0;
  return {
    controls: [
      { key: "rot", label: "Rotate", min: 0, max: 360, step: 1, value: 0 },
    ],
    set(key, v) { if (key === "rot") angle = v * Math.PI / 180; },
    tick(_t, dt) { angle += dt * 0.3; g.rotation.y = angle; },
  };
});

/* GOC Shapes: hybridization geometry — sp, sp2, sp3 with bond angles. */
register("goc-shapes", ({ THREE, group, makeTextSprite }) => {
  const g = new THREE.Group();
  group.add(g);
  const centerMat = new THREE.MeshStandardMaterial({ color: "#555", emissive: "#555", emissiveIntensity: 0.3 });
  const outerMat = new THREE.MeshStandardMaterial({ color: "#e84040", emissive: "#e84040", emissiveIntensity: 0.3 });
  const bondMat = new THREE.MeshStandardMaterial({ color: "#888" });
  let hybrid = "sp3";
  const configs = {
    sp3: { angle: 109.5, labels: ["Tetrahedral", "109.5°"], positions: [
      [0, 0, 0], [1, 0.5, 0], [-0.5, 1, 0.5], [-0.5, -0.5, 0.8], [0.3, -0.3, -0.9]
    ]},
    sp2: { angle: 120, labels: ["Trigonal Planar", "120°"], positions: [
      [0, 0, 0], [1.2, 0, 0], [-0.6, 1.04, 0], [-0.6, -1.04, 0]
    ]},
    sp: { angle: 180, labels: ["Linear", "180°"], positions: [
      [0, 0, 0], [1.4, 0, 0], [-1.4, 0, 0]
    ]},
  };
  let meshes = [];
  function build() {
    meshes.forEach((m) => g.remove(m));
    meshes = [];
    const cfg = configs[hybrid];
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), centerMat);
    center.position.set(...cfg.positions[0]);
    g.add(center);
    meshes.push(center);
    for (let i = 1; i < cfg.positions.length; i++) {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), outerMat);
      atom.position.set(...cfg.positions[i]);
      g.add(atom);
      meshes.push(atom);
      const dir = new THREE.Vector3(...cfg.positions[i]).normalize();
      const len = new THREE.Vector3(...cfg.positions[i]).length();
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 6), bondMat);
      bond.position.set(cfg.positions[i][0] / 2, cfg.positions[i][1] / 2, cfg.positions[i][2] / 2);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(bond);
      meshes.push(bond);
    }
    const lbl = makeTextSprite(`${cfg.labels[0]} — ${cfg.labels[1]}`, { fontSize: 32 });
    lbl.position.set(0, 2.2, 0);
    g.add(lbl);
    meshes.push(lbl);
  }
  build();
  return {
    controls: [
      { key: "hyb", label: "Hybridization", type: "select", options: ["sp3", "sp2", "sp"], value: "sp3" },
    ],
    set(key, v) { if (key === "hyb") { hybrid = v; build(); } },
    tick(_t, dt) { g.rotation.y += dt * 0.2; },
  };
});

/* 3D Geometry: skew lines — two lines that don't intersect and aren't parallel. */
register("skew-lines", ({ THREE, group, makeGrid, makeAxes, makeTextSprite, makeArrow }) => {
  const g = new THREE.Group();
  group.add(g);
  makeGrid(g, 6, 6);
  makeAxes(g);
  const lineMat1 = new THREE.LineBasicMaterial({ color: "#69a7d8" });
  const lineMat2 = new THREE.LineBasicMaterial({ color: "#e86f52" });
  const geo1 = new THREE.BufferGeometry();
  const geo2 = new THREE.BufferGeometry();
  const pts1 = new Float32Array(6);
  const pts2 = new Float32Array(6);
  geo1.setAttribute("position", new THREE.BufferAttribute(pts1, 3));
  geo2.setAttribute("position", new THREE.BufferAttribute(pts2, 3));
  const line1 = new THREE.Line(geo1, lineMat1);
  const line2 = new THREE.Line(geo2, lineMat2);
  g.add(line1, line2);
  let a1 = 0.5, b1 = 0.3, c1 = 0, a2 = 0, b2 = 0.5, c2 = 0.4;
  function layout() {
    pts1[0] = -3; pts1[1] = a1 * (-3) + b1; pts1[2] = c1;
    pts1[3] = 3; pts1[4] = a1 * 3 + b1; pts1[5] = c1;
    pts2[0] = -3; pts2[1] = a2 * (-3) + b2; pts2[2] = c2 + 1;
    pts2[3] = 3; pts2[4] = a2 * 3 + b2; pts2[5] = c2 + 1;
    geo1.attributes.position.needsUpdate = true;
    geo2.attributes.position.needsUpdate = true;
  }
  layout();
  const l1Label = makeTextSprite("L₁", { fontSize: 28, color: "#69a7d8" });
  l1Label.position.set(3.2, a1 * 3 + b1, c1);
  g.add(l1Label);
  const l2Label = makeTextSprite("L₂", { fontSize: 28, color: "#e86f52" });
  l2Label.position.set(3.2, a2 * 3 + b2, c2 + 1);
  g.add(l2Label);
  return {
    controls: [
      { key: "a1", label: "L₁ slope", min: -1, max: 1, step: 0.05, value: a1 },
      { key: "b1", label: "L₁ y-intercept", min: -1, max: 1, step: 0.05, value: b1 },
      { key: "a2", label: "L₂ slope", min: -1, max: 1, step: 0.05, value: a2 },
      { key: "b2", label: "L₂ y-intercept", min: -1, max: 1, step: 0.05, value: b2 },
      { key: "c2", label: "L₂ z-offset", min: -1, max: 2, step: 0.05, value: c2 },
    ],
    set(key, v) {
      if (key === "a1") a1 = v;
      if (key === "b1") b1 = v;
      if (key === "a2") a2 = v;
      if (key === "b2") b2 = v;
      if (key === "c2") c2 = v;
      layout();
    },
    tick() {},
  };
});

/* Conductance: electrolytic cell — current vs concentration vs electrode area. */
register("conductance", ({ THREE, group, makeGrid, makeTextSprite }) => {
  const g = new THREE.Group();
  group.add(g);
  makeGrid(g, 6, 6);
  const bathMat = new THREE.MeshStandardMaterial({ color: "#4a90d9", transparent: true, opacity: 0.35 });
  const bath = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1.5), bathMat);
  bath.position.y = -0.3;
  g.add(bath);
  const electMat = new THREE.MeshStandardMaterial({ color: "#aaa" });
  const elect1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.8), electMat);
  elect1.position.set(-1.2, 0, 0);
  g.add(elect1);
  const elect2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.8), electMat);
  elect2.position.set(1.2, 0, 0);
  g.add(elect2);
  let conc = 1.0, area = 0.8, kappa = 0.012;
  let ions = [];
  const ionMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.5 });
  for (let i = 0; i < 30; i++) {
    const ion = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ionMat);
    ion.position.set((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 0.8 - 0.3, (Math.random() - 0.5) * 1.0);
    ion.userData.v = new THREE.Vector3((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5);
    g.add(ion);
    ions.push(ion);
  }
  function layout() {
    elect1.scale.y = area / 0.8;
    elect2.scale.y = area / 0.8;
  }
  layout();
  return {
    controls: [
      { key: "conc", label: "Concentration (mol/L)", min: 0.1, max: 2.0, step: 0.1, value: conc },
      { key: "area", label: "Electrode area (cm²)", min: 0.2, max: 1.5, step: 0.1, value: area },
    ],
    set(key, v) {
      if (key === "conc") conc = v;
      if (key === "area") { area = v; layout(); }
    },
    tick(_t, dt) {
      const speed = conc * 0.5;
      ions.forEach((ion) => {
        ion.position.x += ion.userData.v.x * speed * dt;
        ion.position.z += ion.userData.v.z * speed * dt;
        if (Math.abs(ion.position.x) > 1.1) ion.userData.v.x *= -1;
        if (Math.abs(ion.position.z) > 0.6) ion.userData.v.z *= -1;
      });
    },
  };
});

export const SIM_FOR_CONCEPT = {
  "P-fluids": "viscosity",
  "C-biomolecules": "biomolecules",
  "C-goc": "goc-shapes",
  "M-3dgeo": "skew-lines",
};
