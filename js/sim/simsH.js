/* TeachMeJEE — simulation pack H: polymers, hybridisation, colligative,
   calorimetry, straight lines, binomial, coordination geometry, drift.
   Same contract: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }.
   Range controls omit `type` so Atlas variants apply (see variantForControls). */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "C-hydrocarbons": "polymer-lab",
  "C-orgbasic": "hybrid-orbital",
  "C-solutions": "colligative-lab",
  "C-thermo": "calorimeter-lab",
  "M-lines": "line-lab",
  "M-prob": "binomial-dist",
  "C-coord": "coordination-geo",
  "P-current": "drift-lab",
};

/* Polymer lab: monomers link into a growing chain (addition polymerisation). */
register("polymer-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 22;
  const monoGeo = new THREE.SphereGeometry(0.17, 14, 14);
  const monoMat = new THREE.MeshStandardMaterial({ color: "#60a5fa", emissive: "#60a5fa", emissiveIntensity: 0.35 });
  const linkMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.5 });
  const beads = [];
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(monoGeo, monoMat.clone());
    const x = -3.3 + (6.6 * i) / (N - 1);
    const y = Math.sin(i * 1.1) * 0.32;
    m.position.set(x, y + 1.4, (i % 2) * 0.3 - 0.15);
    m.visible = false;
    g.add(m);
    beads.push(m);
    if (i > 0) {
      const prev = beads[i - 1].position;
      const link = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 8), linkMat);
      link.position.set((prev.x + x) / 2, (prev.y + y + 2.8) / 2 - 1.4 + 1.4, 0);
      link.position.set((prev.x + x) / 2, (prev.y + (y + 1.4)) / 2, 0);
      link.rotation.z = Math.atan2(x - prev.x, y + 1.4 - prev.y) + Math.PI;
      link.visible = false;
      g.add(link);
      m.userData.link = link;
    }
  }
  let rate = 1, grown = 0, acc = 0;
  return {
    tick(_t, dt) {
      acc += dt * rate;
      if (acc > 0.45) { acc = 0; grown = Math.min(N, grown + 1); }
      beads.forEach((b, i) => {
        const on = i < grown;
        b.visible = on;
        if (b.userData.link) b.userData.link.visible = on && i > 0;
        if (on) b.material.emissiveIntensity = 0.35 + 0.3 * Math.sin(_t * 3 + i);
      });
    },
    set(key, v) {
      if (key === "rate") rate = v;
      if (key === "reset") { grown = 0; acc = 0; }
    },
    controls: [
      { key: "rate", label: "Polymerisation rate", min: 0.2, max: 3, step: 0.1, value: rate },
      { key: "reset", label: "Reset monomers", type: "button" },
    ],
  };
});

/* Hybrid orbitals: sp3 tetrahedron, sp2 trigonal, sp linear morphs. */
register("hybrid-orbital", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 18, 18),
    new THREE.MeshStandardMaterial({ color: "#52525b", emissive: "#52525b", emissiveIntensity: 0.4 }));
  g.add(center);
  const lobeMat = new THREE.MeshStandardMaterial({ color: "#4ade80", emissive: "#4ade80", emissiveIntensity: 0.35, transparent: true, opacity: 0.85 });
  const lobes = [];
  for (let i = 0; i < 4; i++) {
    const l = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 14), lobeMat.clone());
    g.add(l);
    lobes.push(l);
  }
  const GEOS = [
    [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
    [[1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0], [0, 0, 1.4]],
    [[1, 0, 0], [-1, 0, 0], [0, 1, 0.9], [0, -1, -0.9]],
  ];
  let hyb = 0, spin = 0.5;
  function layout() {
    const dirs = GEOS[hyb];
    lobes.forEach((l, i) => {
      const d = new THREE.Vector3(...dirs[i]).normalize();
      l.position.copy(d.clone().multiplyScalar(0.85));
      l.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      l.visible = hyb === 0 ? true : i < 3 ? true : false;
      if (hyb > 0 && i === 3) { l.visible = true; l.scale.set(0.45, 0.45, 0.45); }
      else l.scale.set(1, 1, 1);
    });
  }
  layout();
  return {
    tick(_t, dt) { g.rotation.y += dt * spin; },
    set(key, v) {
      if (key === "hyb") { hyb = Math.round(v); layout(); }
      if (key === "spin") spin = v;
    },
    controls: [
      { key: "hyb", label: "Hybridisation (0:sp3, 1:sp2, 2:sp)", type: "select", options: [0, 1, 2], value: hyb },
      { key: "spin", label: "Rotation speed", min: 0, max: 2, step: 0.1, value: spin },
    ],
  };
});

/* Colligative lab: vapour escaping pure solvent vs solution, ΔTf bar. */
register("colligative-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  function beaker(x, solute) {
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 1.6, 18, 1, true),
      new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    glass.position.set(x, -0.6, 0);
    g.add(glass);
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.62, 0.9, 18),
      new THREE.MeshStandardMaterial({ color: solute ? "#60a5fa" : "#7dd3fc", transparent: true, opacity: 0.7 }));
    liq.position.set(x, -0.85, 0);
    g.add(liq);
    if (solute) {
      for (let i = 0; i < 8; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8),
          new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.6 }));
        s.position.set(x + (Math.random() - 0.5) * 1, -1.1 + Math.random() * 0.6, (Math.random() - 0.5) * 0.6);
        g.add(s);
      }
    }
    return x;
  }
  beaker(-1.8, false);
  beaker(1.8, true);
  const vapGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const vapMat = new THREE.MeshStandardMaterial({ color: "#f5eddc", emissive: "#f5eddc", emissiveIntensity: 0.7, transparent: true, opacity: 0.8 });
  const vaps = [];
  for (let i = 0; i < 26; i++) {
    const v = new THREE.Mesh(vapGeo, vapMat);
    v.userData = { x: 0, y: 0, vy: 0, pure: true };
    g.add(v);
    vaps.push(v);
    resetVap(v, true);
  }
  function resetVap(v, init) {
    const pure = Math.random() < 0.5;
    v.userData.pure = pure;
    v.userData.x = (pure ? -1.8 : 1.8) + (Math.random() - 0.5) * 1;
    v.userData.y = init ? Math.random() * 3 : -0.2;
    v.userData.vy = 0.5 + Math.random() * 0.7;
  }
  const barBG = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.1),
    new THREE.MeshStandardMaterial({ color: "#22262e" }));
  barBG.position.set(0, 1.2, -0.8);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 0.12),
    new THREE.MeshStandardMaterial({ color: "#69d8d2", emissive: "#69d8d2", emissiveIntensity: 0.5 }));
  bar.position.set(0, 1.2, -0.8);
  g.add(barBG, bar);
  let m = 1;
  return {
    tick(_t, dt) {
      for (const v of vaps) {
        const slow = v.userData.pure ? 1 : Math.max(0.25, 1 - m * 0.3);
        v.userData.y += v.userData.vy * slow * dt;
        if (v.userData.y > 2.8) resetVap(v, false);
        v.position.set(v.userData.x, v.userData.y, 0);
      }
      const dep = Math.min(1, m * 0.32);
      bar.scale.y = Math.max(0.05, dep);
      bar.position.y = 1.2 - 2.4 * (1 - Math.max(0.05, dep)) / 2;
    },
    set(key, v) { if (key === "m") m = v; },
    controls: [
      { key: "m", label: "Solute molality (m)", min: 0, max: 3, step: 0.1, value: m },
    ],
  };
});

/* Calorimeter lab: fuels flash, water bar climbs by ΔH. */
register("calorimeter-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const bomb = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#8a7c68", roughness: 0.6, metalness: 0.4 }));
  bomb.position.set(-1.6, 0, 0);
  const jacket = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.2, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.25, side: THREE.DoubleSide }));
  jacket.position.set(-1.6, 0, 0);
  g.add(bomb, jacket);
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 14),
    new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: 0 }));
  flash.position.set(-1.6, 0, 0);
  g.add(flash);
  const barBG = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.15),
    new THREE.MeshStandardMaterial({ color: "#22262e" }));
  barBG.position.set(1.8, 0, 0);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.18),
    new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.6 }));
  bar.position.set(1.8, 0, 0);
  g.add(barBG, bar);
  const FUELS = [
    { dh: 890, col: "#ffd27a" },
    { dh: 1560, col: "#ffb347" },
    { dh: 286, col: "#9adcff" },
  ];
  let fuel = 0, heat = 0, burning = 0;
  return {
    tick(_t, dt) {
      if (burning > 0) {
        burning -= dt;
        flash.material.opacity = Math.max(0, burning);
        flash.scale.setScalar(1 + (1 - burning) * 0.6);
        heat = Math.min(1, heat + dt * 0.5);
      } else {
        flash.material.opacity = 0;
        heat = Math.max(0, heat - dt * 0.05);
      }
      const target = 0.15 + (FUELS[fuel].dh / 1560) * 0.8 * (heat > 0.02 ? 1 : heat / 0.02);
      bar.scale.y = Math.max(0.04, Math.min(1, target * Math.max(heat, 0.04)));
      bar.position.y = -1.5 + 3 * bar.scale.y / 2;
      bar.material.color.setStyle(FUELS[fuel].col);
    },
    set(key, v) {
      if (key === "fuel") fuel = Math.round(v);
      if (key === "ignite") { burning = 1; }
    },
    controls: [
      { key: "fuel", label: "Fuel (0:CH4, 1:C2H6, 2:H2)", type: "select", options: [0, 1, 2], value: fuel },
      { key: "ignite", label: "Ignite charge", type: "button" },
    ],
  };
});

/* Line lab: y = mx + c with live angle readout geometry. */
register("line-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const grid = new THREE.GridHelper(10, 10, "#333a47", "#22262e");
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -0.05;
  g.add(grid);
  const LG = 2;
  const lineGeo = new THREE.BufferGeometry().setFromPoints(
    [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)]);
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  g.add(line);
  const wedgeGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.4, 0, 0), new THREE.Vector3(0, 0, 0)]);
  const wedge = new THREE.Line(wedgeGeo, new THREE.LineBasicMaterial({ color: "#69d8d2" }));
  g.add(wedge);
  const dotMat = new THREE.MeshStandardMaterial({ color: "#f5eddc", emissive: "#f5eddc", emissiveIntensity: 0.7 });
  const icept = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), dotMat);
  g.add(icept);
  let m = 1, c = 0.5;
  function repaint() {
    const arr = lineGeo.attributes.position.array;
    arr[0] = -5; arr[1] = m * -5 + c; arr[2] = 0;
    arr[3] = 5; arr[4] = m * 5 + c; arr[5] = 0;
    lineGeo.attributes.position.needsUpdate = true;
    const w = wedgeGeo.attributes.position.array;
    const run = Math.sign(m) || 1;
    w[0] = 0; w[1] = c; w[2] = 0;
    w[3] = run * 1.4; w[4] = c; w[5] = 0;
    w[6] = run * 1.4; w[7] = c + m * run * 1.4; w[8] = 0;
    wedgeGeo.attributes.position.needsUpdate = true;
    icept.position.set(0, c, 0);
  }
  repaint();
  return {
    tick() {},
    set(key, v) { if (key === "m") m = v; if (key === "c") c = v; repaint(); },
    controls: [
      { key: "m", label: "Slope m", min: -3, max: 3, step: 0.1, value: m },
      { key: "c", label: "Intercept c", min: -3, max: 3, step: 0.1, value: c },
    ],
  };
});

/* Binomial distribution: bars for B(n,p), mean line slides. */
register("binomial-dist", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const MAXN = 20;
  const bars = [];
  const barGeo = new THREE.BoxGeometry(0.32, 1, 0.32);
  for (let i = 0; i <= MAXN; i++) {
    const b = new THREE.Mesh(barGeo, new THREE.MeshStandardMaterial({
      color: "#60a5fa", emissive: "#60a5fa", emissiveIntensity: 0.35 }));
    b.position.set(-4.4 + (8.8 * i) / MAXN, 0, 0);
    g.add(b);
    bars.push(b);
  }
  const meanPin = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 10),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.8 }));
  meanPin.rotation.x = Math.PI;
  g.add(meanPin);
  function fact(x) { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; }
  function pmf(k, n, p) {
    if (k < 0 || k > n) return 0;
    return (fact(n) / (fact(k) * fact(n - k))) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }
  let n = 10, p = 0.5;
  function repaint() {
    let mx = 0.001;
    for (let k = 0; k <= MAXN; k++) mx = Math.max(mx, pmf(k, n, p));
    for (let k = 0; k <= MAXN; k++) {
      const h = k <= n ? (pmf(k, n, p) / mx) * 3 : 0.001;
      bars[k].scale.y = Math.max(0.02, h);
      bars[k].position.y = -1.6 + bars[k].scale.y / 2;
      bars[k].visible = k <= n;
      const isMean = Math.abs(k - n * p) < 0.51;
      bars[k].material.emissiveIntensity = isMean ? 0.9 : 0.35;
    }
    meanPin.position.set(-4.4 + (8.8 * n * p) / MAXN, 2.4, 0);
  }
  repaint();
  return {
    tick() {},
    set(key, v) { if (key === "n") n = Math.round(v); if (key === "p") p = v; repaint(); },
    controls: [
      { key: "n", label: "Trials n", min: 2, max: 20, step: 1, value: n },
      { key: "p", label: "Success p", min: 0.05, max: 0.95, step: 0.05, value: p },
    ],
  };
});

/* Coordination geometry: octahedral / tetrahedral / square-planar cages. */
register("coordination-geo", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const metal = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#c678dd", emissive: "#c678dd", emissiveIntensity: 0.5 }));
  g.add(metal);
  const ligMat = new THREE.MeshStandardMaterial({ color: "#7dd3fc", emissive: "#7dd3fc", emissiveIntensity: 0.45 });
  const ligs = [];
  for (let i = 0; i < 6; i++) {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), ligMat);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 8),
      new THREE.MeshStandardMaterial({ color: "#8a7c68" }));
    g.add(l, rod);
    ligs.push({ l, rod });
  }
  const GEOS = [
    [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
    [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1], [0, 0, 0], [0, 0, 0]],
    [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 0], [0, 0, 0]],
  ];
  let geo = 0, spin = 0.5;
  function layout() {
    const dirs = GEOS[geo];
    ligs.forEach(({ l, rod }, i) => {
      const d = dirs[i];
      const empty = d[0] === 0 && d[1] === 0 && d[2] === 0;
      l.visible = rod.visible = !empty;
      if (empty) return;
      const v = new THREE.Vector3(...d).normalize().multiplyScalar(1.5);
      l.position.copy(v);
      rod.position.copy(v.clone().multiplyScalar(0.5));
      rod.scale.y = 1.1;
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
    });
  }
  layout();
  return {
    tick(_t, dt) { g.rotation.y += dt * spin; },
    set(key, v) {
      if (key === "geo") { geo = Math.round(v); layout(); }
      if (key === "spin") spin = v;
    },
    controls: [
      { key: "geo", label: "Geometry (0:octa, 1:tetra, 2:sq-planar)", type: "select", options: [0, 1, 2], value: geo },
      { key: "spin", label: "Rotation speed", min: 0, max: 2, step: 0.1, value: spin },
    ],
  };
});

/* Drift lab: electrons accelerate through lattice under E-field. */
register("drift-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 7, 16, 1, true),
    new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
  wire.rotation.z = Math.PI / 2;
  g.add(wire);
  const ionGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const ionMat = new THREE.MeshStandardMaterial({ color: "#8a7c68" });
  for (let i = 0; i < 14; i++) {
    const ion = new THREE.Mesh(ionGeo, ionMat);
    ion.position.set(-3 + (6 * i) / 13, (i % 2 ? 0.3 : -0.3), (i % 3 - 1) * 0.25);
    g.add(ion);
  }
  const eGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const eMat = new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffe9a8", emissiveIntensity: 1.1 });
  const els = [];
  for (let i = 0; i < 30; i++) {
    const e = new THREE.Mesh(eGeo, eMat);
    e.userData = { x: -3.5 + Math.random() * 7, y: (Math.random() - 0.5) * 0.7, z: (Math.random() - 0.5) * 0.5, jx: Math.random() * 9, jy: Math.random() * 9 };
    g.add(e);
    els.push(e);
  }
  let E = 1;
  return {
    tick(t, dt) {
      for (const e of els) {
        e.userData.jx += dt * 6; e.userData.jy += dt * 7;
        e.userData.x += dt * (0.3 + E * 1.1);
        if (e.userData.x > 3.5) e.userData.x -= 7;
        e.position.set(
          e.userData.x + Math.sin(e.userData.jx) * 0.12,
          e.userData.y + Math.sin(e.userData.jy) * 0.12,
          e.userData.z);
      }
      void t;
    },
    set(key, v) { if (key === "E") E = v; },
    controls: [
      { key: "E", label: "Electric field E", min: 0.2, max: 3, step: 0.1, value: E },
    ],
  };
});
