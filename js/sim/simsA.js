/* JEE Planner — Foundation & Mathematics simulations */

import { register, makeTextSprite, makeArrow, makePoint, makeAxes, makeGrid, makeTrail } from "./engine.js";

function linePts(THREE, pts, color = "#7aa2ff", opacity = 1) {
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
}

function disposeObj(o) {
  if (!o) return;
  o.traverse && o.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
    if (c.material) (Array.isArray(c.material) ? c.material : [c.material]).forEach((m) => m.dispose && m.dispose());
  });
}

/* ── number line ─────────────────────────────────────────── */
register("numberline", ({ THREE, group, makeAxes, makeGrid, makeTextSprite, makePoint }) => {
  const g = makeAxes(5.2, false);
  g.visible = false;
  group.add(g);
  group.add(makeGrid(5, 10));

  const ticks = [];
  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    const t = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.5, 0.03),
      new THREE.MeshBasicMaterial({ color: "#4b5261" })
    );
    t.position.set(i, 0, 0);
    group.add(t);
    const lbl = makeTextSprite(String(i), { size: 0.55, color: "#949ba8" });
    lbl.position.set(i, -0.62, 0);
    group.add(lbl);
    ticks.push(lbl);
  }
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(13.4, 0.03, 0.03),
    new THREE.MeshBasicMaterial({ color: "#3a4150" })
  );
  group.add(line);
  const origin = makeTextSprite("0", { size: 0.55, color: "#949ba8" });
  origin.position.set(0, -0.62, 0);
  group.add(origin);

  const pt = makePoint(new THREE.Vector3(0, 0.9, 0), "#7aa2ff", 0.22);
  group.add(pt);
  let valLabel = makeTextSprite("x = 0", { size: 0.6 });
  valLabel.position.set(0, 1.6, 0);
  group.add(valLabel);
  const ray = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8),
    new THREE.MeshBasicMaterial({ color: "#7aa2ff", transparent: true, opacity: 0.7 })
  );
  group.add(ray);

  let value = 0;
  let lastLabel = "";
  const controls = [
    { key: "value", label: "Number x", min: -6, max: 6, step: 0.1, value: 0 },
    { key: "move", label: "Auto scan", min: 0, max: 1, step: 1, value: 0 },
  ];
  let auto = false;
  return {
    controls,
    set(key, v) {
      if (key === "value") { value = v; auto = false; }
      if (key === "move") auto = v === 1;
    },
    tick(t) {
      if (auto) value = 6 * Math.sin(t * 0.6);
      pt.position.set(value, 0.9, 0);
      ray.position.set(value, 0.5, 0);
      const txt = "x = " + (value % 1 === 0 ? value.toFixed(0) : value.toFixed(2));
      if (txt !== lastLabel) {
        lastLabel = txt;
        disposeObj(valLabel);
        group.remove(valLabel);
        valLabel = makeTextSprite(txt, { size: 0.6 });
        valLabel.position.set(value, 1.6, 0);
        group.add(valLabel);
      } else {
        valLabel.position.set(value, 1.6, 0);
      }
    },
  };
});

/* ── functions graph with tangent ─────────────────────────── */
register("functions", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(5, 10));
  const scene = group;
  let curve = null;
  let tangent = null;
  let dot = null;
  let mode = "quadratic";
  let x0 = 0.8;
  let showTangent = 1;

  const fns = {
    linear: (x) => 0.6 * x - 0.4,
    quadratic: (x) => 0.55 * x * x - 0.8,
    cubic: (x) => (x * x * x) / 3 - x,
    sine: (x) => 1.9 * Math.sin(x),
    exp: (x) => Math.exp(x) / 2 - 2.2,
  };
  const dfs = {
    linear: (x) => 0.6,
    quadratic: (x) => 1.1 * x,
    cubic: (x) => x * x - 1,
    sine: (x) => 1.9 * Math.cos(x),
    exp: (x) => Math.exp(x) / 2,
  };

  function rebuild() {
    const pts = [];
    for (let x = -4.6; x <= 4.6; x += 0.06) {
      pts.push(new THREE.Vector3(x, fns[mode](x), 0));
    }
    if (curve) { scene.remove(curve); disposeObj(curve); }
    curve = linePts(THREE, pts, "#7aa2ff", 0.95);
    scene.add(curve);
    rebuildTangent();
  }

  function rebuildTangent() {
    if (tangent) { scene.remove(tangent); disposeObj(tangent); tangent = null; }
    if (dot) { scene.remove(dot); disposeObj(dot); dot = null; }
    if (!showTangent) return;
    const f = fns[mode], df = dfs[mode];
    const y0 = f(x0), m = df(x0);
    const pts = [];
    for (let dx = -1.8; dx <= 1.8; dx += 0.05) pts.push(new THREE.Vector3(x0 + dx, y0 + m * dx, 0));
    tangent = linePts(THREE, pts, "#f87171", 0.9);
    scene.add(tangent);
    dot = makePoint(new THREE.Vector3(x0, y0, 0), "#fbbf24", 0.16);
    scene.add(dot);
  }

  rebuild();
  const label = makeTextSprite("y = f(x)", { size: 0.7 });
  label.position.set(3.6, 3.2, 0);
  scene.add(label);

  const controls = [
    { key: "mode", label: "Function", type: "select", value: "quadratic",
      options: ["linear", "quadratic", "cubic", "sine", "exp"] },
    { key: "x0", label: "Point x₀", min: -4, max: 4, step: 0.05, value: 0.8 },
    { key: "tan", label: "Show tangent", type: "toggle", value: 1 },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "mode") { mode = v; rebuild(); }
      if (key === "x0") { x0 = v; rebuildTangent(); }
      if (key === "tan") { showTangent = v; rebuildTangent(); }
    },
    tick() {},
  };
});

/* ── unit circle → sine/cosine ────────────────────────────── */
register("unitcircle", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(3.5, 7));
  const cpts = [];
  for (let a = 0; a <= Math.PI * 2.01; a += 0.05) cpts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
  group.add(linePts(THREE, cpts, "#3a4150", 0.8));

  let theta = 0;
  let auto = 1;
  const controls = [
    { key: "theta", label: "Angle θ°", min: 0, max: 360, step: 1, value: 0 },
    { key: "auto", label: "Rotate", type: "toggle", value: 1 },
  ];

  const arm = makeArrow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), "#7aa2ff", 0.22, 0.15);
  group.add(arm);
  const px = makePoint(new THREE.Vector3(0, 0, 0), "#f87171", 0.12);
  const py = makePoint(new THREE.Vector3(0, 0, 0), "#4ade80", 0.12);
  group.add(px, py);
  const tip = makePoint(new THREE.Vector3(0, 0, 0), "#fbbf24", 0.15);
  group.add(tip);

  let sinLbl = makeTextSprite("", { size: 0.6 });
  group.add(sinLbl);

  const rayX = new THREE.Mesh(new THREE.BoxGeometry(1, 0.025, 0.025), new THREE.MeshBasicMaterial({ color: "#f87171", transparent: true, opacity: 0.6 }));
  const rayY = new THREE.Mesh(new THREE.BoxGeometry(0.025, 1, 0.025), new THREE.MeshBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.6 }));
  group.add(rayX, rayY);

  const cosT = makeTextSprite("cos", { size: 0.45, color: "#f87171" });
  cosT.position.set(-2.6, 2.9, 0);
  const sinT = makeTextSprite("sin", { size: 0.45, color: "#4ade80" });
  sinT.position.set(2.6, 2.9, 0);
  group.add(cosT, sinT);

  let prev = 0;
  return {
    controls,
    set(key, v) {
      if (key === "theta") { theta = (v * Math.PI) / 180; auto = 0; }
      if (key === "auto") auto = v === 1;
    },
    tick(t) {
      if (auto) theta = t * 0.9;
      const c = Math.cos(theta), s = Math.sin(theta);
      arm.position.copy(new THREE.Vector3(0, 0, 0));
      arm.rotation.z = -theta;
      arm.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), theta);
      tip.position.set(c, s, 0);
      px.position.set(c, 0, 0);
      py.position.set(0, s, 0);
      rayX.scale.x = c;
      rayX.scale.y = Math.abs(s) < 0.001 ? 1 : 1;
      rayX.position.x = c / 2;
      rayY.scale.y = s;
      rayY.position.y = s / 2;
      const d = Math.round(theta * 180 / Math.PI);
      if (Math.round(d / 2) !== Math.round(prev / 2)) {
        disposeObj(sinLbl);
        group.remove(sinLbl);
        sinLbl = makeTextSprite(`θ=${d}°  cos=${c.toFixed(2)}  sin=${s.toFixed(2)}`, { size: 0.6 });
        group.add(sinLbl);
      }
      prev = d;
    },
  };
});

/* ── vectors: a, b, a+b, dot, cross ───────────────────────── */
register("vectors", ({ THREE, group, makeGrid, makeAxes, makeTextSprite, makeArrow }) => {
  group.add(makeGrid(5, 10));
  group.add(makeAxes(4.5));
  let a = new THREE.Vector3(2.4, 1.2, 0);
  let b = new THREE.Vector3(-1.0, 2.0, 1.4);
  let sum = new THREE.Vector3();
  let showCross = 1;

  const arrows = { a: null, b: null, sum: null, cross: null };
  const labels = {};

  function rebuild() {
    sum = a.clone().add(b);
    const spec = {
      a: { v: a, c: "#60a5fa", lbl: "a" },
      b: { v: b, c: "#34d399", lbl: "b" },
      sum: { v: sum, c: "#fbbf24", lbl: "a + b" },
    };
    for (const k of Object.keys(spec)) {
      if (arrows[k]) { group.remove(arrows[k]); disposeObj(arrows[k]); arrows[k] = null; }
      if (labels[k]) { group.remove(labels[k]); disposeObj(labels[k]); labels[k] = null; }
    }
    if (arrows.cross) { group.remove(arrows.cross); disposeObj(arrows.cross); arrows.cross = null; }

    for (const [k, s] of Object.entries(spec)) {
      arrows[k] = makeArrow(new THREE.Vector3(), s.v, s.c, 0.34, 0.2);
      group.add(arrows[k]);
      labels[k] = makeTextSprite(s.lbl, { size: 0.55, color: s.c });
      labels[k].position.copy(s.v).multiplyScalar(1.2);
      group.add(labels[k]);
    }
    if (showCross && a.length() && b.length()) {
      const cross = new THREE.Vector3().crossVectors(a, b);
      arrows.cross = makeArrow(new THREE.Vector3(), cross, "#f87171", 0.3, 0.18);
      group.add(arrows.cross);
    }
    updateInfo();
  }

  let infoLbl = makeTextSprite("", { size: 0.6 });
  group.add(infoLbl);
  function updateInfo() {
    disposeObj(infoLbl);
    group.remove(infoLbl);
    const dot = a.dot(b);
    const cross = showCross ? new THREE.Vector3().crossVectors(a, b) : new THREE.Vector3();
    const txt = `a·b = ${dot.toFixed(2)}` + (showCross ? `   |a×b| = ${cross.length().toFixed(2)}` : "");
    infoLbl = makeTextSprite(txt, { size: 0.6 });
    infoLbl.position.set(0, -3.4, 0);
    group.add(infoLbl);
  }

  rebuild();
  const controls = [
    { key: "ax", label: "a.x", min: -4, max: 4, step: 0.1, value: a.x },
    { key: "ay", label: "a.y", min: -4, max: 4, step: 0.1, value: a.y },
    { key: "az", label: "a.z", min: -4, max: 4, step: 0.1, value: a.z },
    { key: "bx", label: "b.x", min: -4, max: 4, step: 0.1, value: b.x },
    { key: "by", label: "b.y", min: -4, max: 4, step: 0.1, value: b.y },
    { key: "bz", label: "b.z", min: -4, max: 4, step: 0.1, value: b.z },
    { key: "cross", label: "Show a×b", type: "toggle", value: 1 },
  ];
  return {
    controls,
    set(key, v) {
      const m = { ax: 0, ay: 1, az: 2, bx: 0, by: 1, bz: 2 };
      const arr = key[0] === "a" ? a : b;
      arr.setComponent(m[key], v);
      if (key === "cross") showCross = v === 1;
      rebuild();
    },
    tick() {},
  };
});

/* ── conics: cone sliced by a plane ───────────────────────── */
register("conics", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));

  const coneMat = new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.28, side: THREE.DoubleSide });
  const coneTop = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.4, 48), coneMat);
  coneTop.position.y = 1.7;
  const coneBot = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3.4, 48), coneMat);
  coneBot.position.y = -1.7;
  coneBot.rotation.x = Math.PI;
  const rimC = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({ color: "#60a5fa", transparent: true, opacity: 0.15, side: THREE.DoubleSide }));
  rimC.rotation.x = Math.PI / 2;
  rimC.position.y = 3.4;
  const rimC2 = rimC.clone();
  rimC2.position.y = -3.4;
  group.add(coneTop, coneBot, rimC, rimC2);

  let plane = null;
  let curve = null;
  let typeLbl = makeTextSprite("circle", { size: 0.8 });
  typeLbl.position.set(0, 3.6, 0);
  group.add(typeLbl);

  const tA = Math.atan(2.2 / 3.4); // ~0.574 rad
  let m = 0;     // plane y = m·x + d
  let d = 0.9;

  function rebuild() {
    const tanA = Math.tan(tA);
    const mt = m * tanA;
    const A = 1 - mt * mt;
    const d2 = d * d;
    if (plane) { group.remove(plane); disposeObj(plane); plane = null; }
    if (curve) { group.remove(curve); disposeObj(curve); curve = null; }

    // build plane mesh (rectangle on plane y = m x + d, spanning x,z in [-3,3])
    const nx = -m, ny = 1, nz = 0;
    const norm = Math.sqrt(nx * nx + ny * ny);
    const n = { x: nx / norm, y: ny / norm, z: 0 };
    const size = 3.4;
    const pts = [
      new THREE.Vector3(-size, m * -size + d, -size),
      new THREE.Vector3(size, m * size + d, -size),
      new THREE.Vector3(size, m * size + d, size),
      new THREE.Vector3(-size, m * -size + d, size),
    ];
    const idx = [0, 1, 2, 0, 2, 3];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts.flatMap((p) => [p.x, p.y, p.z]), 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    plane = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#34d399", transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    group.add(plane);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: "#4ade80" }));
    group.add(edge);
    plane.userData.edge = edge;

    // intersection curve on the plane
    const cur = [];
    const add2 = (p) => { const pp = new THREE.Vector3(p.x, m * p.x + d, p.z); cur.push(pp); };

    if (Math.abs(A) < 0.02) {
      // parabola
      const coef = 2 * d * tanA;
      for (let z = -3; z <= 3; z += 0.03) {
        const x = (z * z - d2 * tanA * tanA) / coef;
        add2({ x, z });
      }
    } else {
      const x0 = (m * d * tanA * tanA) / A;
      const a2 = (d2 * tanA * tanA) / (A * A);
      const b2 = (d2 * tanA * tanA) / A;
      if (A > 0) {
        // ellipse
        const a = Math.sqrt(a2), b = Math.sqrt(b2);
        for (let u = 0; u <= Math.PI * 2.001; u += 0.02) add2({ x: x0 + a * Math.cos(u), z: b * Math.sin(u) });
      } else {
        // hyperbola
        const a = Math.sqrt(-a2), b = Math.sqrt(-b2);
        for (let u = -1.6; u <= 1.6; u += 0.03) {
          const ch = Math.cosh(u), sh = Math.sinh(u);
          add2({ x: x0 + a * ch, z: b * sh });
          add2({ x: x0 - a * ch, z: b * sh });
        }
      }
    }
    curve = linePts(THREE, cur, "#fbbf24", 1);
    group.add(curve);

    const type = Math.abs(A) < 0.02 ? "parabola (plane ∥ generator)" : A > 0 ? "ellipse (tilt < cone angle)" : "hyperbola (tilt > cone angle)";
    disposeObj(typeLbl);
    group.remove(typeLbl);
    typeLbl = makeTextSprite(type, { size: 0.62 });
    typeLbl.position.set(0, 3.9, 0);
    group.add(typeLbl);
  }

  rebuild();
  const controls = [
    { key: "m", label: "Plane tilt", min: -1.1, max: 1.1, step: 0.02, value: 0 },
    { key: "d", label: "Plane offset", min: -1.8, max: 1.8, step: 0.05, value: 0.9 },
  ];
  return {
    controls,
    set(key, v) { if (key === "m") m = v; if (key === "d") d = v; rebuild(); },
    tick() {},
  };
});

/* ── complex plane ────────────────────────────────────────── */
register("complex", ({ THREE, group, makeGrid, makeTextSprite, makeArrow, makePoint }) => {
  group.add(makeGrid(4, 8));
  let a = 2.4, b = 1.6;
  let auto = 1;
  const controls = [
    { key: "re", label: "Real part a", min: -4, max: 4, step: 0.05, value: a },
    { key: "im", label: "Imag part b", min: -4, max: 4, step: 0.05, value: b },
    { key: "auto", label: "Rotate z", type: "toggle", value: 1 },
  ];
  const zArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#7aa2ff", 0.28, 0.18);
  const cArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#f87171", 0.28, 0.18);
  const proj = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#4ade80", 0.22, 0.14);
  group.add(zArrow, cArrow, proj);
  const zL = makeTextSprite("z", { size: 0.55, color: "#7aa2ff" });
  const cL = makeTextSprite("z̄", { size: 0.55, color: "#f87171" });
  group.add(zL, cL);
  let info = makeTextSprite("", { size: 0.6 });
  info.position.set(0, -3.4, 0);
  group.add(info);

  let theta0 = 0;
  function update() {
    const th = theta0;
    const ca = Math.cos(th), sa = Math.sin(th);
    const ar = a * ca - b * sa;
    const ai = a * sa + b * ca;
    const v = new THREE.Vector3(ar, ai, 0);
    zArrow.position.copy(new THREE.Vector3());
    zArrow.quaternion.identity();
    zArrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), v.clone().normalize());
    zArrow.scale.set(v.length(), 1, 1);
    zL.position.copy(v).multiplyScalar(1.25);
    cArrow.quaternion.identity();
    cArrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(ar, -ai, 0).normalize());
    cArrow.scale.set(v.length(), 1, 1);
    cL.position.set(ar, -ai, 0).multiplyScalar(1.25);
    proj.quaternion.identity();
    proj.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(ar, 0, 0).normalize());
    proj.scale.set(Math.abs(ar), 1, 1);
    const r = Math.hypot(ar, ai);
    const arg = Math.atan2(ai, ar);
    const txt = `|z| = ${r.toFixed(2)}   arg z = ${(arg * 180 / Math.PI).toFixed(1)}°   z = ${ar.toFixed(2)} ${ai >= 0 ? "+" : "−"} ${Math.abs(ai).toFixed(2)}i`;
    disposeObj(info); group.remove(info);
    info = makeTextSprite(txt, { size: 0.58 });
    info.position.set(0, -3.4, 0);
    group.add(info);
  }
  update();

  return {
    controls,
    set(key, v) {
      if (key === "re") { a = v; auto = 0; }
      if (key === "im") { b = v; auto = 0; }
      if (key === "auto") auto = v === 1;
    },
    tick(t) { if (auto) theta0 = t * 0.5; update(); },
  };
});

/* ── 3D geometry: plane + point + normal ──────────────────── */
register("3dgeo", ({ THREE, group, makeGrid, makeAxes, makeTextSprite, makeArrow, makePoint }) => {
  group.add(makeGrid(4, 8));
  group.add(makeAxes(4));
  let na = 0, nb = 0, nc = 1, dd = 0;
  let px = 1.4, py = 1.2, pz = 0.8;
  let plane = null, normal = null, dot = null, footLbl = null, distLbl = null;

  function rebuild() {
    if (plane) { group.remove(plane); disposeObj(plane); plane = null; }
    if (normal) { group.remove(normal); disposeObj(normal); normal = null; }
    if (distLbl) { group.remove(distLbl); disposeObj(distLbl); distLbl = null; }

    const n = new THREE.Vector3(na, nb, nc).normalize();
    const planeGeo = new THREE.PlaneGeometry(8, 8);
    plane = new THREE.Mesh(planeGeo, new THREE.MeshStandardMaterial({ color: "#34d399", transparent: true, opacity: 0.28, side: THREE.DoubleSide }));
    plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    const dLen = dd / n.length();
    plane.position.copy(n).multiplyScalar(-dLen);
    group.add(plane);
    const origin = new THREE.Vector3(0, 0, 0);
    normal = makeArrow(origin, n.clone().multiplyScalar(1.8), "#4ade80", 0.25, 0.16);
    group.add(normal);
    const nLbl = makeTextSprite("normal n̂", { size: 0.5, color: "#4ade80" });
    nLbl.position.copy(n).multiplyScalar(2.2);
    group.add(nLbl);

    const P = new THREE.Vector3(px, py, pz);
    if (dot) { group.remove(dot); disposeObj(dot); }
    dot = makePoint(P, "#fbbf24", 0.18);
    group.add(dot);
    const dist = Math.abs(na * px + nb * py + nc * pz + dd) / Math.sqrt(na * na + nb * nb + nc * nc);
    distLbl = makeTextSprite(`d(point, plane) = ${dist.toFixed(2)}`, { size: 0.55 });
    distLbl.position.set(0, -3.2, 0);
    group.add(distLbl);
    const eq = `${na || "0"}x ${nb >= 0 ? "+" : "−"} ${Math.abs(nb) || "0"}y ${nc >= 0 ? "+" : "−"} ${Math.abs(nc) || "0"}z ${dd >= 0 ? "+" : "−"} ${Math.abs(dd)} = 0`;
    const eqLbl = makeTextSprite(eq, { size: 0.5, color: "#949ba8" });
    eqLbl.position.set(0, 3.6, 0);
    group.add(eqLbl);
  }
  rebuild();
  const controls = [
    { key: "na", label: "a (normal x)", min: -2, max: 2, step: 0.05, value: 0 },
    { key: "nb", label: "b (normal y)", min: -2, max: 2, step: 0.05, value: 0 },
    { key: "nc", label: "c (normal z)", min: -2, max: 2, step: 0.05, value: 1 },
    { key: "dd", label: "d (offset)", min: -3, max: 3, step: 0.05, value: 0 },
    { key: "px", label: "Point x", min: -3, max: 3, step: 0.05, value: 1.4 },
    { key: "py", label: "Point y", min: -3, max: 3, step: 0.05, value: 1.2 },
    { key: "pz", label: "Point z", min: -3, max: 3, step: 0.05, value: 0.8 },
  ];
  return { controls, set(key, v) { ({ na: () => na = v, nb: () => nb = v, nc: () => nc = v, dd: () => dd = v, px: () => px = v, py: () => py = v, pz: () => pz = v }[key])(); rebuild(); }, tick() {} };
});

/* ── integral: area under curve with accumulating bars ────── */
register("integral", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const bars = new THREE.Group();
  group.add(bars);
  const curvePts = [];
  const f = (x) => 0.4 * x * x;
  for (let x = -2.6; x <= 2.6; x += 0.02) curvePts.push(new THREE.Vector3(x, f(x), 0));
  group.add(linePts(THREE, curvePts, "#7aa2ff", 0.9));

  let limit = 1.2;
  let barsCount = 30;
  let label = makeTextSprite("", { size: 0.6 });
  label.position.set(0, 3.4, 0);
  group.add(label);

  function rebuild() {
    while (bars.children.length) { bars.remove(bars.children[0]); disposeObj(bars.children[0]); }
    const n = barsCount;
    let sum = 0;
    const mat = new THREE.MeshStandardMaterial({ color: "#7aa2ff", transparent: true, opacity: 0.75 });
    for (let i = 0; i < n; i++) {
      const x = (-limit) + (2 * limit) * (i + 0.5) / n;
      const h = f(x);
      const w = (2 * limit) / n;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, Math.max(h, 0.001), w * 0.92), mat);
      bar.position.set(x, h / 2, 0);
      bars.add(bar);
      sum += h * w;
    }
    const real = 2 * (0.4 * limit * limit * limit / 3);
    disposeObj(label); group.remove(label);
    label = makeTextSprite(`∫₋${limit.toFixed(1)} ${limit.toFixed(1)} f(x)dx ≈ ${sum.toFixed(3)}   (exact ${real.toFixed(3)})`, { size: 0.55 });
    label.position.set(0, 3.5, 0);
    group.add(label);
  }
  rebuild();
  const controls = [
    { key: "limit", label: "Upper limit", min: 0.3, max: 2.4, step: 0.05, value: 1.2 },
    { key: "n", label: "Number of bars", min: 5, max: 60, step: 1, value: 30 },
  ];
  return { controls, set(key, v) { if (key === "limit") limit = v; if (key === "n") barsCount = Math.round(v); rebuild(); }, tick() {} };
});

/* ── generic particle swarm ───────────────────────────────── */
register("particles", ({ THREE, group, makeGrid }) => {
  group.add(makeGrid(3, 6));
  const N = 120;
  const pos = new Float32Array(N * 3);
  const vel = [];
  const seeds = [];
  for (let i = 0; i < N; i++) {
    seeds.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5]);
    vel.push([(Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#7aa2ff", size: 0.09, transparent: true, opacity: 0.9 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  let speed = 1;
  const controls = [{ key: "speed", label: "Speed", min: 0, max: 3, step: 0.1, value: 1 }];
  return {
    controls,
    set(key, v) { speed = v; },
    tick(t, dt) {
      for (let i = 0; i < N; i++) {
        seeds[i][0] += vel[i][0] * dt * speed;
        seeds[i][1] += vel[i][1] * dt * speed;
        seeds[i][2] += vel[i][2] * dt * speed;
        for (let k = 0; k < 3; k++) {
          if (Math.abs(seeds[i][k]) > 2.5) vel[i][k] *= -1;
        }
        pos[i * 3] = seeds[i][0]; pos[i * 3 + 1] = seeds[i][1]; pos[i * 3 + 2] = seeds[i][2];
      }
      geo.attributes.position.needsUpdate = true;
      pts.rotation.y = t * 0.08;
    },
  };
});

/* ── venn diagram ─────────────────────────────────────────── */
register("venn", ({ THREE, group, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const mk = (x, z, c) => {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 40, 40),
      new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.35, depthWrite: false })
    );
    s.position.set(x, 0, z);
    group.add(s);
  };
  mk(-0.9, 0.55, "#60a5fa");
  mk(0.9, 0.55, "#34d399");
  mk(0, -0.95, "#fbbf24");
  const lbls = [
    ["A", -2.0, 1.0, "#60a5fa"],
    ["B", 2.0, 1.0, "#34d399"],
    ["C", 0, -1.9, "#fbbf24"],
  ];
  for (const [t, x, y, c] of lbls) {
    const l = makeTextSprite(t, { size: 0.7, color: c });
    l.position.set(x, 0, y);
    group.add(l);
  }
  return { tick(t) { }, };
});

/* ── counting tree ────────────────────────────────────────── */
register("tree", ({ THREE, group, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4, 8));
  const branchGroup = new THREE.Group();
  group.add(branchGroup);
  let levels = 3;
  let label = makeTextSprite("", { size: 0.6 });
  label.position.set(0, 3.6, 0);
  group.add(label);

  function build(node, x, y, level) {
    if (level <= 0) return;
    const lx = x - Math.pow(2, -level) * 3, rx = x + Math.pow(2, -level) * 3;
    const ny = y - 0.9;
    const pts = [new THREE.Vector3(x, y, 0), new THREE.Vector3(lx, ny, 0)];
    const edge = linePts(THREE, pts, "#3a4150", 0.8);
    branchGroup.add(edge);
    const pts2 = [new THREE.Vector3(x, y, 0), new THREE.Vector3(rx, ny, 0)];
    branchGroup.add(linePts(THREE, pts2, "#3a4150", 0.8));
    branchGroup.add(makePoint(new THREE.Vector3(lx, ny, 0), "#7aa2ff", 0.12));
    branchGroup.add(makePoint(new THREE.Vector3(rx, ny, 0), "#7aa2ff", 0.12));
    build(lx, ny, level - 1);
    build(rx, ny, level - 1);
  }

  function rebuild() {
    while (branchGroup.children.length) { branchGroup.remove(branchGroup.children[0]); }
    branchGroup.add(makePoint(new THREE.Vector3(0, 1.9, 0), "#fbbf24", 0.16));
    build(0, 1.9, levels);
    const leaves = Math.pow(2, levels);
    disposeObj(label); group.remove(label);
    label = makeTextSprite(`2^${levels} = ${leaves} outcomes at the leaves`, { size: 0.58 });
    label.position.set(0, 3.7, 0);
    group.add(label);
  }
  rebuild();
  const controls = [{ key: "levels", label: "Levels", min: 1, max: 5, step: 1, value: 3 }];
  return { controls, set(key, v) { levels = Math.round(v); rebuild(); }, tick() {} };
});

/* ── solids (mensuration) ─────────────────────────────────── */
register("solids", ({ THREE, group, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const items = [];
  const specs = [
    { geo: new THREE.SphereGeometry(1, 40, 40), pos: [-2.6, 0, 0], name: "Sphere V=⅘πr³" },
    { geo: new THREE.CylinderGeometry(0.8, 0.8, 1.8, 40), pos: [0, 0, 0], name: "Cylinder V=πr²h" },
    { geo: new THREE.ConeGeometry(0.9, 1.8, 40), pos: [2.6, 0, 0], name: "Cone V=⅓πr²h" },
  ];
  const mat = new THREE.MeshStandardMaterial({ color: "#7aa2ff", metalness: 0.2, roughness: 0.5 });
  for (const s of specs) {
    const m = new THREE.Mesh(s.geo, mat);
    m.position.set(...s.pos);
    group.add(m);
    items.push(m);
    const l = makeTextSprite(s.name, { size: 0.45, color: "#949ba8" });
    l.position.set(s.pos[0], -1.6, 0);
    group.add(l);
  }
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), new THREE.MeshStandardMaterial({ color: "#34d399", metalness: 0.2, roughness: 0.5 }));
  box.position.set(-1.3, 0, 2.2);
  group.add(box);
  items.push(box);
  const boxL = makeTextSprite("Cube V=s³", { size: 0.45, color: "#949ba8" });
  boxL.position.set(-1.3, -1.6, 2.2);
  group.add(boxL);
  return { tick(t) { items.forEach((it, i) => { it.rotation.y = t * 0.4 * (i + 1) * 0.5; }); } };
});

/* ── crystal lattice ──────────────────────────────────────── */
register("crystal", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3.5, 7));
  let type = "simple";
  const cellGroup = new THREE.Group();
  group.add(cellGroup);
  let label = makeTextSprite("", { size: 0.6 });
  label.position.set(0, 3.4, 0);
  group.add(label);

  const atomMat = new THREE.MeshStandardMaterial({ color: "#7aa2ff", metalness: 0.3, roughness: 0.4 });
  const edgeMat = new THREE.LineBasicMaterial({ color: "#3a4150" });

  function rebuild() {
    while (cellGroup.children.length) { cellGroup.remove(cellGroup.children[0]); }
    const a = 2;
    const corner = [];
    for (let x = -1; x <= 1; x += 2) for (let y = -1; y <= 1; y += 2) for (let z = -1; z <= 1; z += 2) {
      corner.push(new THREE.Vector3(x * a / 2, y * a / 2, z * a / 2));
    }
    const sites = [...corner];
    if (type !== "simple") {
      sites.push(new THREE.Vector3(0, 0, 0));
    }
    if (type === "fcc") {
      const faces = [[a/2,0,0],[0,a/2,0],[0,0,a/2],[-a/2,0,0],[0,-a/2,0],[0,0,-a/2]];
      faces.forEach(([x,y,z]) => sites.push(new THREE.Vector3(x,y,z)));
    }
    for (const s of sites) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), atomMat);
      m.position.copy(s);
      cellGroup.add(m);
    }
    // edges
    const corners = corner;
    const edges = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
    for (const [i,j] of edges) {
      const g = new THREE.BufferGeometry().setFromPoints([corners[i], corners[j]]);
      cellGroup.add(new THREE.Line(g, edgeMat));
    }
    const counts = { simple: 8 * 1/8, bcc: 8 * 1/8 + 1, fcc: 8 * 1/8 + 6 * 1/2 };
    disposeObj(label); group.remove(label);
    label = makeTextSprite(`${type.toUpperCase()} lattice · ${counts[type]} atoms per unit cell`, { size: 0.55 });
    label.position.set(0, 3.5, 0);
    group.add(label);
  }
  rebuild();
  const controls = [{ key: "type", label: "Lattice type", type: "select", value: "simple", options: ["simple", "bcc", "fcc"] }];
  return { controls, set(key, v) { type = v; rebuild(); }, tick(t) { cellGroup.rotation.y = t * 0.15; } };
});
