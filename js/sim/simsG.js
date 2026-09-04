/* TeachMeJEE — simulation pack G: chirality, kinetics, transistor,
   cyclotron, slope fields, polarization.
   Same contract: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }.
   Range controls omit `type` so Atlas variants apply (see variantForControls). */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "C-halo": "stereo-lab",
  "C-kinetics": "kinetics-lab",
  "P-semi": "transistor-lab",
  "P-magnet": "cyclotron-lab",
  "M-diffeq": "slope-field",
  "P-emw": "polarizer-lab",
};

/* Stereo lab: chiral carbon, R/S mirror swap, optical rotation arrow. */
register("stereo-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#52525b", emissive: "#52525b", emissiveIntensity: 0.3 }));
  g.add(center);
  const cols = ["#f87171", "#60a5fa", "#4ade80", "#fbbf24"];
  const tetra = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
  const subs = tetra.map((p, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 18, 18),
      new THREE.MeshStandardMaterial({ color: cols[i], emissive: cols[i], emissiveIntensity: 0.4 }));
    m.position.set(p[0] * 0.9, p[1] * 0.9, p[2] * 0.9);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: "#8a7c68" }));
    rod.position.set(p[0] * 0.45, p[1] * 0.45, p[2] * 0.45);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(p[0], p[1], p[2]).normalize());
    g.add(m, rod);
    return m;
  });
  const rayMat = new THREE.LineBasicMaterial({ color: "#f5eddc", transparent: true, opacity: 0.8 });
  const rayGeo = new THREE.BufferGeometry().setFromPoints(
    [new THREE.Vector3(-4, -2.4, 0), new THREE.Vector3(4, -2.4, 0)]);
  const ray = new THREE.Line(rayGeo, rayMat);
  g.add(ray);
  const arrowMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.8 });
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 10), arrowMat);
  arrow.position.set(4.2, -2.4, 0);
  arrow.rotation.z = -Math.PI / 2;
  g.add(arrow);
  let mirror = false, spin = 0.6, t = 0;
  return {
    tick(_t, dt) {
      t += dt;
      g.rotation.y += dt * spin;
      arrow.position.y = -2.4 + Math.sin(t * 2.2) * (mirror ? -0.35 : 0.35);
    },
    set(key, v) {
      if (key === "flip") {
        mirror = !mirror;
        const a = subs[0].position.clone(), b = subs[1].position.clone();
        subs[0].position.copy(b); subs[1].position.copy(a);
      }
      if (key === "spin") spin = v;
    },
    controls: [
      { key: "flip", label: "Swap to mirror image (R/S)", type: "button" },
      { key: "spin", label: "Rotation speed", min: 0, max: 2, step: 0.1, value: spin },
    ],
  };
});

/* Kinetics lab: [A] vs t for orders 0/1/2 plus reacting particle box. */
register("kinetics-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const CN = 90;
  const curves = [0, 1, 2].map((o) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(CN * 3), 3));
    const ln = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: ["#f87171", "#60a5fa", "#4ade80"][o], transparent: true, opacity: o === 1 ? 1 : 0.35 }));
    ln.frustumCulled = false;
    g.add(ln);
    return ln;
  });
  const frame = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, -2, 0), new THREE.Vector3(3, -2, 0),
      new THREE.Vector3(3, 2, 0), new THREE.Vector3(-3, 2, 0),
      new THREE.Vector3(-3, -2, 0),
    ]),
    new THREE.LineBasicMaterial({ color: "#4a4438" }));
  g.add(frame);
  const pGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const pMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.6 });
  const parts = [];
  for (let i = 0; i < 26; i++) {
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.set(-3 + Math.random() * 6, -2 + Math.random() * 4, (Math.random() - 0.5) * 1.4);
    p.userData = { vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6 };
    g.add(p);
    parts.push(p);
  }
  let order = 1, k = 0.7, t = 0;
  function conc(tt) {
    if (order === 0) return Math.max(0, 1 - k * tt * 0.25);
    if (order === 1) return Math.exp(-k * tt * 0.5);
    return 1 / (1 + k * tt * 0.6);
  }
  function repaint() {
    curves.forEach((ln, o) => {
      const arr = ln.geometry.attributes.position.array;
      for (let i = 0; i < CN; i++) {
        const tt = (12 * i) / (CN - 1);
        let c;
        if (o === 0) c = Math.max(0, 1 - k * tt * 0.25);
        else if (o === 1) c = Math.exp(-k * tt * 0.5);
        else c = 1 / (1 + k * tt * 0.6);
        arr[i * 3] = -3 + (6 * i) / (CN - 1);
        arr[i * 3 + 1] = -2 + c * 3.6;
        arr[i * 3 + 2] = 0;
      }
      ln.geometry.attributes.position.needsUpdate = true;
      ln.material.opacity = o === order ? 1 : 0.3;
    });
  }
  repaint();
  return {
    tick(_t, dt) {
      t += dt;
      const c = conc(t % 24);
      for (const p of parts) {
        p.position.x += p.userData.vx * dt;
        p.position.y += p.userData.vy * dt;
        if (p.position.x > 3 || p.position.x < -3) p.userData.vx *= -1;
        if (p.position.y > 2 || p.position.y < -2) p.userData.vy *= -1;
        p.visible = Math.random() < c + 0.04;
      }
    },
    set(key, v) {
      if (key === "order") { order = Math.round(v); repaint(); }
      if (key === "k") { k = v; repaint(); }
    },
    controls: [
      { key: "order", label: "Reaction order", type: "select", options: [0, 1, 2], value: order },
      { key: "k", label: "Rate constant k", min: 0.2, max: 2, step: 0.1, value: k },
    ],
  };
});

/* Transistor lab: n-p-n stack with base-current-controlled collector flow. */
register("transistor-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const blockMat = (c) => new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.75 });
  const emit = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1), blockMat("#60a5fa"));
  emit.position.set(-1.5, 0, 0);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 1), blockMat("#4ade80"));
  base.position.set(0, 0, 0);
  const coll = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1), blockMat("#f87171"));
  coll.position.set(1.5, 0, 0);
  g.add(emit, base, coll);
  const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const dotMat = new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffe9a8", emissiveIntensity: 1.1 });
  const dots = [];
  for (let i = 0; i < 20; i++) {
    const d = new THREE.Mesh(dotGeo, dotMat);
    d.userData.u = Math.random();
    d.userData.lane = (Math.random() - 0.5) * 0.5;
    g.add(d);
    dots.push(d);
  }
  let ib = 30, t = 0;
  return {
    tick(_t, dt) {
      t += dt;
      const speed = 0.4 + ib / 40;
      for (const d of dots) {
        d.userData.u += dt * speed * 0.35;
        if (d.userData.u > 1) d.userData.u -= 1;
        d.position.set(-2.2 + d.userData.u * 4.4, d.userData.lane, 0.55);
        d.visible = d.userData.u > 0.28 || Math.random() < ib / 60;
      }
      base.material.opacity = 0.4 + (ib / 50) * 0.5;
    },
    set(key, v) { if (key === "ib") ib = v; },
    controls: [
      { key: "ib", label: "Base current Ib (µA)", min: 10, max: 50, step: 5, value: ib },
    ],
  };
});

/* Cyclotron lab: charge spirals out between Dees at cyclotron frequency. */
register("cyclotron-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const deeMat = new THREE.MeshStandardMaterial({ color: "#8a7c68", transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const deeL = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.5, 24, 1, false, Math.PI / 2, Math.PI), deeMat);
  const deeR = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.5, 24, 1, false, -Math.PI / 2, Math.PI), deeMat);
  deeL.rotation.x = deeR.rotation.x = Math.PI / 2;
  g.add(deeL, deeR);
  const ion = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 14, 14),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.9 }));
  g.add(ion);
  const TN = 400;
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(TN * 3), 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: "#69a7d8", transparent: true, opacity: 0.85 }));
  trail.frustumCulled = false;
  g.add(trail);
  const hist = [];
  let B = 1, v0 = 1.6, r = 0.15, ang = 0;
  function reset() { r = 0.15; ang = 0; hist.length = 0; }
  reset();
  return {
    tick(_t, dt) {
      const omega = B * 1.4;
      ang += omega * dt;
      r = Math.min(2.05, r + dt * 0.22 * v0 * 0.5);
      if (r >= 2.05) reset();
      ion.position.set(Math.cos(ang) * r, Math.sin(ang) * r, 0.3);
      hist.push(ion.position.x, ion.position.y, 0.3);
      if (hist.length > TN * 3) hist.splice(0, hist.length - TN * 3);
      const arr = trailGeo.attributes.position.array;
      for (let i = 0; i < hist.length; i++) arr[i] = hist[i];
      trailGeo.setDrawRange(0, hist.length / 3);
      trailGeo.attributes.position.needsUpdate = true;
    },
    set(key, v) { if (key === "B") { B = v; reset(); } if (key === "v") { v0 = v; reset(); } },
    controls: [
      { key: "B", label: "Magnetic field B (T)", min: 0.5, max: 2, step: 0.1, value: B },
      { key: "v", label: "Injection speed", min: 1, max: 3, step: 0.2, value: v0 },
    ],
  };
});

/* Slope field: direction segments for y' = f(x,y) plus dragged solution curves. */
register("slope-field", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const eqs = [
    (x, y) => x,
    (x, y) => -y,
    (x, y) => x - y,
  ];
  const GX = 13, GY = 9, X0 = -4.2, X1 = 4.2, Y0 = -2.6, Y1 = 2.6;
  const segGeo = new THREE.BufferGeometry();
  segGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(GX * GY * 2 * 3), 3));
  const field = new THREE.LineSegments(segGeo, new THREE.LineBasicMaterial({ color: "#8a7c68", transparent: true, opacity: 0.8 }));
  field.frustumCulled = false;
  g.add(field);
  const CN = 120;
  const solGeo = new THREE.BufferGeometry();
  solGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(CN * 3), 3));
  const sol = new THREE.Line(solGeo, new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  sol.frustumCulled = false;
  g.add(sol);
  let eq = 1, c0 = 0.8;
  function repaint() {
    const f = eqs[eq];
    const arr = segGeo.attributes.position.array;
    let k = 0;
    for (let i = 0; i < GX; i++) {
      for (let j = 0; j < GY; j++) {
        const x = X0 + ((X1 - X0) * i) / (GX - 1);
        const y = Y0 + ((Y1 - Y0) * j) / (GY - 1);
        const m = Math.max(-3, Math.min(3, f(x, y)));
        const dx = 0.22 / Math.hypot(1, m), dy = (0.22 * m) / Math.hypot(1, m);
        arr[k++] = x - dx; arr[k++] = y - dy; arr[k++] = 0;
        arr[k++] = x + dx; arr[k++] = y + dy; arr[k++] = 0;
      }
    }
    segGeo.attributes.position.needsUpdate = true;
    const s = solGeo.attributes.position.array;
    let px = X0, py = c0;
    const h = (X1 - X0) / CN;
    for (let i = 0; i < CN; i++) {
      s[i * 3] = px;
      s[i * 3 + 1] = Math.max(Y0 - 0.4, Math.min(Y1 + 0.4, py));
      s[i * 3 + 2] = 0.02;
      py += f(px, py) * h;
      px += h;
    }
    solGeo.attributes.position.needsUpdate = true;
  }
  repaint();
  return {
    tick() {},
    set(key, v) {
      if (key === "eq") eq = Math.round(v);
      if (key === "c") c0 = v;
      repaint();
    },
    controls: [
      { key: "eq", label: "Equation (0:x, 1:−y, 2:x−y)", min: 0, max: 2, step: 1, value: eq },
      { key: "c", label: "Solution start y(−4.2)", min: -2, max: 2, step: 0.2, value: c0 },
    ],
  };
});

/* Polarizer lab: Malus law through two Polaroids, live transmitted bar. */
register("polarizer-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  function sheet(x, label) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 3.4),
      new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
    m.position.set(x, 0, 0);
    m.rotation.y = Math.PI / 2;
    g.add(m);
    const ax = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 0.06),
      new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.7 }));
    ax.position.set(x, 0, 0.9);
    g.add(ax);
    return ax;
  }
  const ax1 = sheet(-1.2);
  const ax2 = sheet(1.2);
  const beamMat = new THREE.LineBasicMaterial({ color: "#f5eddc", transparent: true, opacity: 0.7 });
  const beamGeo = new THREE.BufferGeometry().setFromPoints(
    [new THREE.Vector3(-3.4, 0, 0), new THREE.Vector3(3.4, 0, 0)]);
  g.add(new THREE.Line(beamGeo, beamMat));
  const barBG = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.6, 0.1),
    new THREE.MeshStandardMaterial({ color: "#22262e" }));
  barBG.position.set(3.4, 0, -0.6);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.6, 0.12),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.6 }));
  bar.position.set(3.4, -1.3, -0.6);
  g.add(barBG, bar);
  let a1 = 0, a2 = 45, t = 0;
  const waveMat = new THREE.LineBasicMaterial({ color: "#69d8d2", transparent: true, opacity: 0.9 });
  const W = 60;
  const waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(W * 3), 3));
  const wave = new THREE.Line(waveGeo, waveMat);
  wave.frustumCulled = false;
  g.add(wave);
  function repaint() {
    ax1.rotation.x = (a1 * Math.PI) / 180;
    ax2.rotation.x = (a2 * Math.PI) / 180;
    const d = ((a2 - a1) * Math.PI) / 180;
    const I = 0.5 * Math.pow(Math.cos(d), 2);
    bar.scale.y = Math.max(0.02, I);
    bar.position.y = -1.3 + (2.6 * Math.max(0.02, I)) / 2;
  }
  repaint();
  return {
    tick(_t, dt) {
      t += dt;
      const arr = waveGeo.attributes.position.array;
      for (let i = 0; i < W; i++) {
        const x = -3.4 + (6.8 * i) / (W - 1);
        arr[i * 3] = x;
        arr[i * 3 + 1] = Math.sin(x * 2.4 - t * 5) * 0.5;
        arr[i * 3 + 2] = Math.cos(x * 2.4 - t * 5) * 0.5;
      }
      waveGeo.attributes.position.needsUpdate = true;
    },
    set(key, v) { if (key === "a1") a1 = v; if (key === "a2") a2 = v; repaint(); },
    controls: [
      { key: "a1", label: "Polarizer 1 angle (°)", min: 0, max: 180, step: 5, value: a1 },
      { key: "a2", label: "Polarizer 2 angle (°)", min: 0, max: 180, step: 5, value: a2 },
    ],
  };
});
