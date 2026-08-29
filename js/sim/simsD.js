/* TeachMeJEE — extra simulation pack (wave/particle/geometry labs).
   Same contract as the other packs: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }.
   SIM_FOR_CONCEPT maps chapter ids to these sims so the Chapter view can offer
   a lab even when data.js has no sim field for it. */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "M-prob": "galton",
  "M-vectors": "vector-lab",
  "M-conics": "conic-morpher",
  "M-complex": "complex-plane",
  "M-trig": "unit-circle",
  "C-electro": "galvanic-cell",
  "C-bonding": "vsepr-shapes",
  "C-mole": "mole-lab",
  "P-fluids": "bernoulli-tube",
  "P-ktg": "maxwell-box",
};

/* Galton board: balls falling through pegs build a binomial bell curve. */
register("galton", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pegMat = new THREE.MeshStandardMaterial({ color: "#c8b795" });
  const rows = 7;
  const pegGeo = new THREE.SphereGeometry(0.06, 10, 10);
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i <= r; i++) {
      const p = new THREE.Mesh(pegGeo, pegMat);
      p.position.set((i - r / 2) * 0.5, -r * 0.45, 0);
      g.add(p);
    }
  }
  const bins = [];
  const binGeo = new THREE.BoxGeometry(0.42, 0.02, 0.42);
  for (let b = 0; b <= rows; b++) {
    const stack = new THREE.Mesh(binGeo, new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.35 }));
    stack.position.set((b - rows / 2) * 0.5, 0, 1.4);
    g.add(stack);
    bins.push(stack);
  }
  const counts = new Array(bins.length).fill(0);
  const balls = [];
  const ballGeo = new THREE.SphereGeometry(0.09, 10, 10);
  const ballMat = new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.5 });
  let dropT = 0;
  function drop() {
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.6, 0);
    ball.userData = { x: 0, y: 0.6, vx: 0, vy: 0 };
    g.add(ball);
    balls.push(ball);
  }
  return {
    tick(_t, dt) {
      dropT += dt;
      if (dropT > 0.5) { dropT = 0; if (balls.length < 40) drop(); }
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.userData.vy -= dt * 3.2;
        b.userData.y += b.userData.vy * dt;
        b.position.y = b.userData.y;
        if (b.userData.y < -(rows - 1) * 0.45 + 0.05 && Math.random() < 0.25) {
          b.userData.vx += (Math.random() < 0.5 ? -1 : 1) * 0.55;
          b.userData.vy *= -0.35;
        }
        b.position.x += b.userData.vx * dt * 0.9;
        if (b.position.y < -rows * 0.45 + 1.15 && Math.abs(b.userData.vx) < 0.02) {
          const bin = Math.max(0, Math.min(bins.length - 1, Math.round(b.position.x / 0.5 + rows / 2)));
          counts[bin]++;
          bins[bin].scale.y = 1 + counts[bin] * 0.55;
          bins[bin].position.y = 0.01 * counts[bin];
          g.remove(b);
          balls.splice(i, 1);
        }
      }
    },
    set(key) { if (key === "clear") { counts.fill(0); bins.forEach((b) => { b.scale.y = 1; b.position.y = 0; }); } },
    controls: [{ key: "clear", label: "Reset bins", type: "button" }],
  };
});

/* Vector lab: two source vectors and their resultant. */
register("vector-lab", ({ THREE, group, makeArrow }) => {
  const g = new THREE.Group();
  group.add(g);
  const arrowsG = new THREE.Group();
  g.add(arrowsG);
  let ax = 2, ay = 1, bx = -1, by = 2;
  function paint() {
    arrowsG.clear();
    arrowsG.add(
      makeArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(ax, ay, 0), "#69a7d8"),
      makeArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(bx, by, 0), "#e86f52"),
      makeArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(ax + bx, ay + by, 0), "#f2a33c"));
  }
  paint();
  return {
    tick() {},
    set(key, v) {
      if (key === "ax") ax = v;
      else if (key === "ay") ay = v;
      else if (key === "bx") bx = v;
      else if (key === "by") by = v;
      else return;
      paint();
    },
    controls: [
      { key: "ax", label: "A x-comp", type: "range", min: -3, max: 3, step: 0.1, value: ax },
      { key: "ay", label: "A y-comp", type: "range", min: -3, max: 3, step: 0.1, value: ay },
      { key: "bx", label: "B x-comp", type: "range", min: -3, max: 3, step: 0.1, value: bx },
      { key: "by", label: "B y-comp", type: "range", min: -3, max: 3, step: 0.1, value: by },
    ],
  };
});

/* Conic morpher: eccentricity slider morphs circle into parabola into hyperbola. */
register("conic-morpher", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  let e = 0.5;
  const line = new THREE.Line(
    new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(181 * 3), 3)),
    new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  g.add(line);
  function rebuild() {
    const pos = line.geometry.attributes.position.array;
    for (let i = 0; i <= 180; i++) {
      const th = (i / 180) * Math.PI * 2;
      let x = 0, z = 0;
      if (e < 0.999 || e > 1.001) {
        const r = 1 / (1 + e * Math.cos(th));
        if (Number.isFinite(r) && Math.abs(r) < 12) { x = r * Math.cos(th); z = r * Math.sin(th); }
      } else {
        const t = Math.tan(th / 2);
        x = 1 - t * t; z = 2 * t;
      }
      pos[i * 3] = x; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = z;
    }
    line.geometry.attributes.position.needsUpdate = true;
  }
  rebuild();
  return {
    tick() {},
    set(key, v) { if (key === "e") { e = v; rebuild(); } },
    controls: [{ key: "e", label: "Eccentricity (eps)", type: "range", min: 0, max: 2, step: 0.01, value: e }],
  };
});

/* Complex plane: unit circle with a rotating phasor e^(i theta). */
register("complex-plane", ({ THREE, group, makeArrow }) => {
  const g = new THREE.Group();
  group.add(g);
  const ringPts = [];
  for (let i = 0; i <= 64; i++) {
    const th = (i / 64) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(th), 0, Math.sin(th)));
  }
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: "#463922" })));
  const Y_AXIS = new THREE.Vector3(0, 1, 0);
  const arm = makeArrow(new THREE.Vector3(0, 0, 0), Y_AXIS.clone(), "#69a7d8");
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.6 }));
  g.add(arm, dot);
  let th = Math.PI / 4;
  let spin = 0.4;
  const dir = new THREE.Vector3();
  return {
    tick(_t, dt) {
      th += dt * spin;
      dir.set(Math.cos(th), 0, Math.sin(th));
      arm.quaternion.setFromUnitVectors(Y_AXIS, dir);
      dot.position.copy(dir);
    },
    set(key, v) { if (key === "spin") spin = v; },
    controls: [{ key: "spin", label: "Rotation speed", type: "range", min: 0, max: 2, step: 0.05, value: spin }],
  };
});

/* Unit circle: sine/cosine traced as the rotating radius unrolls. */
register("unit-circle", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pts = [];
  for (let i = 0; i <= 72; i++) {
    const th = (i / 72) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(th), 0, Math.sin(th)));
  }
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#463922" })));
  const wavePts = [];
  for (let i = 0; i <= 100; i++) wavePts.push(new THREE.Vector3(i / 100 * 6 - 1, 0, 0));
  const wave = new THREE.Line(new THREE.BufferGeometry().setFromPoints(wavePts), new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  g.add(wave);
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.6 }));
  g.add(knob);
  let th = 0, spd = 0.8, mode = 0;
  return {
    tick(_t, dt) {
      th += dt * spd;
      knob.position.set(Math.cos(th), 0, Math.sin(th));
      const arr = wave.geometry.attributes.position.array;
      for (let i = 0; i <= 100; i++) {
        const tt = i / 100;
        const val = mode ? Math.cos(th - tt * Math.PI * 2) : Math.sin(th - tt * Math.PI * 2);
        arr[i * 3] = tt * 4.5 + 1.4;
        arr[i * 3 + 1] = val * 1.1;
        arr[i * 3 + 2] = 0;
      }
      wave.geometry.attributes.position.needsUpdate = true;
    },
    set(key, v) {
      if (key === "speed") spd = v;
      if (key === "fn") mode = v === "cos" ? 1 : 0;
    },
    controls: [
      { key: "speed", label: "Speed", type: "range", min: 0.1, max: 2, step: 0.05, value: spd },
      { key: "fn", label: "Function", type: "select", options: ["sin", "cos"], value: "sin" },
    ],
  };
});

/* Galvanic cell: Zn/Cu half-cells, electron flow through the wire. */
register("galvanic-cell", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const beakerMat = new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.18 });
  const lBeak = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.6, 24), beakerMat);
  lBeak.position.set(-1.6, -0.8, 0);
  const rBeak = lBeak.clone();
  rBeak.position.x = 1.6;
  g.add(lBeak, rBeak);
  const zn = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.6, 0.1), new THREE.MeshStandardMaterial({ color: "#c8b795" }));
  zn.position.set(-1.6, 0, 0);
  const cu = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.6, 0.1), new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.15 }));
  cu.position.set(1.6, 0, 0);
  g.add(zn, cu);
  const wire = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.04, 8, 48, Math.PI),
    new THREE.MeshStandardMaterial({ color: "#ffd27a", emissive: "#ffc476", emissiveIntensity: 0.4 }));
  wire.position.y = 0.85;
  g.add(wire);
  const eMat = new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffe9a8", emissiveIntensity: 1.4 });
  const electrons = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eMat);
    m.userData.u = i / 8;
    g.add(m);
    electrons.push(m);
  }
  let rate = 1;
  return {
    tick(_t, dt) {
      for (const e of electrons) {
        e.userData.u += dt * 0.25 * rate;
        if (e.userData.u > 1) e.userData.u -= 1;
        const u = e.userData.u;
        if (u < 0.75) {
          const ang = Math.PI * (u / 0.75);
          e.position.set(-Math.cos(ang) * 2.35, 0.85 + Math.sin(ang) * 2.35, 0);
        } else {
          const v = (u - 0.75) / 0.25;
          e.position.set(1.6 - v * 3.2, -0.4 - Math.sin(v * Math.PI) * 0.3, 0.95);
        }
        e.visible = rate > 0.05;
      }
    },
    set(key, v) { if (key === "rate") rate = v; },
    controls: [{ key: "rate", label: "Reaction rate", type: "range", min: 0, max: 2, step: 0.05, value: 1 }],
  };
});

/* VSEPR shapes: pick a geometry, watch the bond angles. */
register("vsepr-shapes", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#c678dd", emissive: "#c678dd", emissiveIntensity: 0.25 }));
  g.add(central);
  const ligandMat = new THREE.MeshStandardMaterial({ color: "#8fbf6f", emissive: "#8fbf6f", emissiveIntensity: 0.25 });
  let bonds = [];
  const GEOMS = {
    linear: [[1, 0, 0], [-1, 0, 0]],
    trigonal: [[1, 0, 0], [-0.5, 0, 0.87], [-0.5, 0, -0.87]],
    tetrahedral: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
    trigonalBipyramidal: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -0.5, 0.87], [0, -0.5, -0.87]],
    octahedral: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  };
  let current = "tetrahedral";
  function build(name) {
    bonds.forEach((b) => g.remove(b));
    bonds = [];
    for (const d of GEOMS[name]) {
      const v = new THREE.Vector3(...d).normalize();
      const end = v.clone().multiplyScalar(1.3);
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1.3, 10),
        new THREE.MeshStandardMaterial({ color: "#c8b795" }));
      stick.position.copy(end.clone().multiplyScalar(0.5));
      stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), ligandMat);
      atom.position.copy(end);
      g.add(stick, atom);
      bonds.push(stick, atom);
    }
  }
  build(current);
  let spin = 0.35;
  return {
    tick(_t, dt) { g.rotation.y += dt * spin; },
    set(key, v) {
      if (key === "geom" && GEOMS[v]) { current = v; build(v); }
      if (key === "spin") spin = v;
    },
    controls: [
      { key: "geom", label: "Shape", type: "select",
        options: ["linear", "trigonal", "tetrahedral", "trigonalBipyramidal", "octahedral"], value: current },
      { key: "spin", label: "Spin", type: "range", min: 0, max: 1.5, step: 0.05, value: spin },
    ],
  };
});

/* Mole lab: N particles in a box against the Avogadro idea. */
register("mole-lab", ({ THREE, group }) => {
  const boxG = new THREE.Group();
  group.add(boxG);
  boxG.add(new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.08 })));
  boxG.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3)),
    new THREE.LineBasicMaterial({ color: "#69a7d8" })));
  const pGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const pMat = new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffc476", emissiveIntensity: 0.5 });
  const parts = [];
  for (let i = 0; i < 200; i++) {
    const m = new THREE.Mesh(pGeo, pMat);
    m.position.set((Math.random() - 0.5) * 2.8, (Math.random() - 0.5) * 2.8, (Math.random() - 0.5) * 2.8);
    m.userData.v = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(1.4);
    boxG.add(m);
    parts.push(m);
  }
  let showCount = 60, temp = 1;
  function apply() {
    parts.forEach((p, i) => { p.visible = i < showCount; p.material.emissiveIntensity = 0.3 + temp * 0.4; });
  }
  apply();
  return {
    tick(_t, dt) {
      for (const p of parts) {
        if (!p.visible) continue;
        p.position.addScaledVector(p.userData.v, dt * temp);
        ["x", "y", "z"].forEach((ax) => {
          if (Math.abs(p.position[ax]) > 1.42) { p.position[ax] = Math.sign(p.position[ax]) * 1.42; p.userData.v[ax] *= -1; }
        });
      }
    },
    set(key, v) {
      if (key === "count") { showCount = Math.round(v); apply(); }
      if (key === "temp") temp = v;
    },
    controls: [
      { key: "count", label: "Particles shown (of N_A)", type: "range", min: 10, max: 200, step: 5, value: showCount },
      { key: "temp", label: "Temperature", type: "range", min: 0.2, max: 3, step: 0.05, value: temp },
    ],
  };
});

/* Bernoulli tube: venturi with pressure-height bars. */
register("bernoulli-tube", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const profile = [
    new THREE.Vector3(-3, 0.9, 0), new THREE.Vector3(-1.2, 0.9, 0),
    new THREE.Vector3(-0.5, 0.45, 0), new THREE.Vector3(0.5, 0.45, 0),
    new THREE.Vector3(1.2, 0.9, 0), new THREE.Vector3(3, 0.9, 0),
  ];
  const top = new THREE.Line(new THREE.BufferGeometry().setFromPoints(profile), new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  const bot = top.clone();
  bot.scale.y = -1;
  g.add(top, bot);
  const drops = [];
  const dGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const dMat = new THREE.MeshStandardMaterial({ color: "#8ec07c", emissive: "#8ec07c", emissiveIntensity: 0.4 });
  for (let i = 0; i < 26; i++) {
    const d = new THREE.Mesh(dGeo, dMat);
    d.userData.x = -3 + Math.random() * 6;
    g.add(d);
    drops.push(d);
  }
  const bars = [];
  [-2.2, 0, 2.2].forEach((x) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1, 0.14), new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.4 }));
    bar.position.set(x, 1.7, 0);
    g.add(bar);
    bars.push(bar);
  });
  function heightAt(x) {
    const ax = Math.abs(x);
    return ax < 0.5 ? 0.45 : ax < 1.2 ? 0.9 - ((ax - 0.5) / 0.7) * 0.45 : 0.9;
  }
  let flow = 1;
  return {
    tick(_t, dt) {
      for (const d of drops) {
        const gap = heightAt(d.userData.x) * 2;
        d.userData.x += flow * (1.9 / gap) * dt;
        if (d.userData.x > 3) d.userData.x = -3;
        d.position.set(d.userData.x, (Math.random() - 0.5) * (gap - 0.15) + 0.02, 0);
      }
      bars.forEach((bar, i) => {
        const xs = [-2.2, 0, 2.2][i];
        const gap = heightAt(xs) * 2;
        const h = Math.max(0.15, 1.4 - ((flow * flow) / (gap * gap)) * 0.9);
        bar.scale.y = h;
        bar.position.y = 1.15 + h * 0.5;
      });
    },
    set(key, v) { if (key === "flow") flow = v; },
    controls: [{ key: "flow", label: "Flow speed", type: "range", min: 0.2, max: 2.5, step: 0.05, value: 1 }],
  };
});

/* Maxwell distribution: live speed histogram from particles in a box. */
register("maxwell-box", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const box = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 2.6, 2.6)),
    new THREE.LineBasicMaterial({ color: "#463922" }));
  box.position.z = -2.2;
  g.add(box);
  const NBINS = 14;
  const bars = [];
  const barGeo = new THREE.BoxGeometry(0.17, 1, 0.17);
  for (let i = 0; i < NBINS; i++) {
    const b = new THREE.Mesh(barGeo, new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.35 }));
    b.position.set(-1.2 + i * 0.185, 0, 0);
    g.add(b);
    bars.push(b);
  }
  const pGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const pMat = new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffc476", emissiveIntensity: 0.5 });
  const parts = [];
  function seed(temp) {
    parts.forEach((p) => g.remove(p));
    parts.length = 0;
    for (let i = 0; i < 90; i++) {
      const m = new THREE.Mesh(pGeo, pMat);
      m.position.set((Math.random() - .5) * 2.4, (Math.random() - .5) * 2.4, (Math.random() - .5) * 2.4 - 2.2);
      const s = temp * (0.4 + Math.random());
      m.userData.v = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize().multiplyScalar(s);
      g.add(m);
      parts.push(m);
    }
  }
  seed(1);
  let temp = 1, acc = 0;
  return {
    tick(_t, dt) {
      for (const p of parts) {
        p.position.addScaledVector(p.userData.v, dt);
        ["x", "y", "z"].forEach((ax) => {
          const lim = ax === "z" ? 1.2 : 1.28;
          const off = ax === "z" ? -2.2 : 0;
          const rel = p.position[ax] - off;
          if (Math.abs(rel) > lim) { p.position[ax] = off + Math.sign(rel) * lim; p.userData.v[ax] *= -1; }
        });
      }
      acc += dt;
      if (acc > 0.4) {
        acc = 0;
        const counts = new Array(NBINS).fill(0);
        for (const p of parts) {
          const s = p.userData.v.length() / (temp || 1);
          const bi = Math.min(NBINS - 1, Math.floor((s / 2) * NBINS));
          counts[Math.max(0, bi)]++;
        }
        const max = Math.max(1, ...counts);
        bars.forEach((b, i) => { b.scale.y = 0.1 + (counts[i] / max) * 1.4; b.position.y = b.scale.y * 0.5; });
      }
    },
    set(key, v) { if (key === "temp") { temp = v; seed(temp); } },
    controls: [{ key: "temp", label: "Temperature (resample)", type: "range", min: 0.4, max: 2.5, step: 0.1, value: 1 }],
  };
});
