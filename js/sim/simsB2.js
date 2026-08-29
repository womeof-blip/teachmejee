/* JEE Planner — Physics simulations, part 2 (EM / optics / AC) */

import { register, makeTextSprite, makeArrow, makePoint, makeGrid } from "./engine.js";

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

/* ── ray optics: lens ─────────────────────────────────────── */
register("optics", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const lens = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.4, 3.4), new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.5 }));
  group.add(lens);
  const lensLbl = makeTextSprite("lens f", { size: 0.45, color: "#60a5fa" });
  lensLbl.position.set(0, 2.1, 0);
  group.add(lensLbl);
  const obj = new THREE.Group();
  const objStem = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.06), new THREE.MeshStandardMaterial({ color: "#fbbf24" }));
  const objHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 12), new THREE.MeshStandardMaterial({ color: "#fbbf24" }));
  objStem.position.y = 0.7;
  objHead.position.y = 1.4;
  objHead.rotation.z = Math.PI;
  obj.add(objStem, objHead);
  group.add(obj);
  let image = null;
  let raysGroup = null;
  let info = makeTextSprite("", { size: 0.5 });
  info.position.set(0, -3.4, 0);
  group.add(info);

  let u = 3, f = 1.2;
  function rebuild() {
    const v = (u * f) / (u - f);
    const mag = -v / u;
    obj.position.x = -u;
    if (image) { group.remove(image); disposeObj(image); }
    image = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.05), new THREE.MeshStandardMaterial({ color: "#f87171" }));
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.12, Math.max(Math.abs(mag) * 1.4, 0.12), 12), new THREE.MeshStandardMaterial({ color: "#f87171" }));
    head.rotation.z = mag > 0 ? Math.PI : 0;
    head.position.y = Math.max(mag, 0) * 1.4;
    image.add(stem, head);
    image.position.x = v;
    group.add(image);

    if (raysGroup) { group.remove(raysGroup); disposeObj(raysGroup); }
    raysGroup = new THREE.Group();
    const f1 = new THREE.Vector3(-u, 1.4, 0);
    const f2 = new THREE.Vector3(-u, 0, 0);
    const f3 = new THREE.Vector3(-u, 0.7, 0);
    const h = mag * 1.4;
    const imgPts = [new THREE.Vector3(v, 0, 0), new THREE.Vector3(v, Math.max(h, 0.01), 0)];
    if (v > 0) {
      // parallel ray → focal point
      raysGroup.add(linePts(THREE, [f1.clone(), new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(v, h, 0)], "#fbbf24"));
      // center ray
      raysGroup.add(linePts(THREE, [f2.clone(), new THREE.Vector3(0, 0, 0), new THREE.Vector3(v, h, 0)], "#4ade80"));
      // through-focus ray
      raysGroup.add(linePts(THREE, [f3.clone(), new THREE.Vector3(0, 0.7, 0), new THREE.Vector3(v, h, 0)], "#60a5fa"));
    } else {
      raysGroup.add(linePts(THREE, [f1.clone(), new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(2.5, 1.4, 0)], "#fbbf24"));
      raysGroup.add(linePts(THREE, [f2.clone(), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.5, 0, 0)], "#4ade80"));
      raysGroup.add(linePts(THREE, [f3.clone(), new THREE.Vector3(0, 0.7, 0), new THREE.Vector3(2.5, 0.7, 0)], "#60a5fa"));
    }
    group.add(raysGroup);

    const txt = `u=${u.toFixed(1)} f=${f.toFixed(1)} → v=${v.toFixed(2)}  m=${mag.toFixed(2)}  ${v > 0 ? (mag > 0 ? "real & upright (mag>0? check)" : "real & inverted") : "virtual & upright"}`;
    disposeObj(info); group.remove(info);
    info = makeTextSprite(txt, { size: 0.5 });
    info.position.set(0, -3.4, 0);
    group.add(info);
  }
  rebuild();
  const controls = [
    { key: "u", label: "Object distance u", min: 0.7, max: 5, step: 0.05, value: 3 },
    { key: "f", label: "Focal length f", min: 0.5, max: 2.5, step: 0.05, value: 1.2 },
  ];
  return { controls, set(key, v) { if (key === "u") u = v; if (key === "f") f = v; rebuild(); }, tick() {} };
});

/* ── electrostatics: charges + field particles ────────────── */
register("electrostatics", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  let q1 = 1, q2 = 1;
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), new THREE.MeshStandardMaterial({ color: "#f87171" }));
  c1.position.set(-1.8, 0, 0);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), new THREE.MeshStandardMaterial({ color: "#60a5fa" }));
  c2.position.set(1.8, 0, 0);
  group.add(c1, c2);
  const l1 = makeTextSprite("+", { size: 0.6, color: "#f87171" }); l1.position.set(-1.8, 0, 0);
  const l2 = makeTextSprite("−", { size: 0.6, color: "#60a5fa" }); l2.position.set(1.8, 0, 0);
  group.add(l1, l2);
  const N = 120;
  const pos = new Float32Array(N * 3);
  const parts = [];
  for (let i = 0; i < N; i++) {
    parts.push({ p: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4), v: new THREE.Vector3() });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#7aa2ff", size: 0.07, transparent: true, opacity: 0.9 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.3, 0);
  group.add(info);
  const controls = [
    { key: "q1", label: "Charge 1", min: -3, max: 3, step: 0.1, value: 1 },
    { key: "q2", label: "Charge 2", min: -3, max: 3, step: 0.1, value: 1 },
    { key: "restart", label: "Reset field", type: "button" },
  ];
  let lastLbl = "";
  return {
    controls,
    set(key, v) {
      if (key === "q1") q1 = v;
      if (key === "q2") q2 = v;
      if (key === "restart") {
        parts.forEach((pt) => { pt.p.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4); pt.v.set(0, 0, 0); });
      }
    },
    tick(_t, dt) {
      for (const pt of parts) {
        let fx = 0, fy = 0, fz = 0;
        const qs = [[-1.8, 0, 0, q1], [1.8, 0, 0, q2]];
        for (const [cx, cy, cz, q] of qs) {
          if (q === 0) continue;
          const dx = pt.p.x - cx, dy = pt.p.y - cy, dz = pt.p.z - cz;
          const r2 = dx * dx + dy * dy + dz * dz + 0.12;
          const r = Math.sqrt(r2);
          const f = (q * 0.6) / r2;
          fx += (f * dx) / r; fy += (f * dy) / r; fz += (f * dz) / r;
        }
        pt.v.x = pt.v.x * 0.98 + fx * dt * 3;
        pt.v.y = pt.v.y * 0.98 + fy * dt * 3;
        pt.v.z = pt.v.z * 0.98 + fz * dt * 3;
        pt.p.x += pt.v.x * dt; pt.p.y += pt.v.y * dt; pt.p.z += pt.v.z * dt;
        pt.p.x = Math.max(Math.min(pt.p.x, 4), -4);
        pt.p.y = Math.max(Math.min(pt.p.y, 3), -3);
        pt.p.z = Math.max(Math.min(pt.p.z, 3), -3);
      }
      parts.forEach((pt, i) => { pos[i * 3] = pt.p.x; pos[i * 3 + 1] = pt.p.y; pos[i * 3 + 2] = pt.p.z; });
      geo.attributes.position.needsUpdate = true;
      const same = (q1 > 0) === (q2 > 0);
      const txt = same ? "Like charges → repel · field lines diverge" : "Unlike charges → attract · field lines connect";
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, 3.3, 0);
        group.add(info);
      }
    },
  };
});

/* ── circuit: current loop ────────────────────────────────── */
register("circuit", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const R = 1.6;
  const loop = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.2, 0, -1.2), new THREE.Vector3(2.2, 0, -1.2),
      new THREE.Vector3(2.2, 0, 1.2), new THREE.Vector3(-2.2, 0, 1.2),
      new THREE.Vector3(-2.2, 0, -1.2),
    ]),
    new THREE.LineBasicMaterial({ color: "#4b5261" })
  );
  group.add(loop);
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.5), new THREE.MeshStandardMaterial({ color: "#4ade80" }));
  battery.position.set(2.6, 0, 0);
  const resistor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: "#f87171" }));
  resistor.position.set(-2.6, 0, 0);
  group.add(battery, resistor);
  const bl = makeTextSprite("battery", { size: 0.4, color: "#4ade80" }); bl.position.set(2.6, 0.9, 0);
  const rl = makeTextSprite("R", { size: 0.4, color: "#f87171" }); rl.position.set(-2.6, 0.9, 0);
  group.add(bl, rl);
  const N = 26;
  const pos = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#fbbf24", size: 0.12 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  const corners = [[-2.2, -1.2], [2.2, -1.2], [2.2, 1.2], [-2.2, 1.2]];
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 2.8, 0);
  group.add(info);
  let V = 12, res = 8, t0 = 0;
  const controls = [
    { key: "V", label: "Voltage V", min: 1, max: 24, step: 0.5, value: 12 },
    { key: "res", label: "Resistance R", min: 1, max: 20, step: 0.5, value: 8 },
  ];
  let lastLbl = "";
  return {
    controls,
    set(key, v) { if (key === "V") V = v; if (key === "res") res = v; },
    tick(t, dt) {
      t0 += dt;
      const I = V / res;
      const circ = 2 * (4.4 + 2.4);
      for (let i = 0; i < N; i++) {
        let s = ((t0 * I * 1.2) + (i / N) * circ) % circ;
        if (s < 0) s += circ;
        let x, z;
        if (s < 4.4) { x = -2.2 + s; z = -1.2; }
        else if (s < 4.4 + 2.4) { x = 2.2; z = -1.2 + (s - 4.4); }
        else if (s < 8.8 + 2.4) { x = 2.2 - (s - 4.4 - 2.4); z = 1.2; }
        else { x = -2.2; z = 1.2 - (s - 8.8); }
        pos[i * 3] = x; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = z;
      }
      geo.attributes.position.needsUpdate = true;
      const glow = Math.min(1, I / 3);
      resistor.material.color.setHex(glow > 0.5 ? 0xff8a8a : 0xf87171);
      const txt = `I = V/R = ${I.toFixed(2)} A · P = ${(V * I).toFixed(1)} W`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, 2.8, 0);
        group.add(info);
      }
    },
  };
});

/* ── magnet: field around current loop ────────────────────── */
register("magnet", ({ THREE, group, makeGrid, makeTextSprite, makeArrow }) => {
  group.add(makeGrid(3, 6));
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.14, 16, 48),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", metalness: 0.3, roughness: 0.4 })
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  let I = 1.2;
  const N = 40;
  const pos = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#fbbf24", size: 0.09 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  const arrows = [];
  const dirs = [];
  for (let i = 0; i < 12; i++) {
    const r = 0.9 + (i % 4) * 0.75;
    const ang = Math.floor(i / 4) * (Math.PI / 1.5);
    const ax = r * Math.cos(ang), az = r * Math.sin(ang);
    const from = new THREE.Vector3(ax, 0, az);
    const to = from.clone().add(new THREE.Vector3(0, 0.7, 0));
    const a = makeArrow(from, to, "#4ade80", 0.18, 0.12);
    group.add(a);
    arrows.push(a);
    dirs.push({ ax, az });
  }
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.2, 0);
  group.add(info);
  const controls = [{ key: "I", label: "Current I", min: 0.1, max: 3, step: 0.05, value: 1.2 }];
  let lastLbl = "";
  return {
    controls,
    set(key, v) { I = v; },
    tick(t, dt) {
      const ang0 = t * 2 * Math.PI * I * 0.12;
      for (let i = 0; i < 12; i++) {
        const { ax, az } = dirs[i];
        const rad = Math.hypot(ax, az);
        const a = Math.atan2(az, ax) + ang0 * 0.5;
        pos[i * 3] = rad * Math.cos(a);
        pos[i * 3 + 1] = 0.25 + Math.sin(t * I * 2 + i) * 0.05;
        pos[i * 3 + 2] = rad * Math.sin(a);
        arrows[i].rotation.z = 0;
        arrows[i].rotation.x = 0;
        arrows[i].quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0));
      }
      for (let i = 0; i < 12; i++) {
        const { ax, az } = dirs[i];
        const a = Math.atan2(az, ax) + ang0 * 0.5;
        pos[(i + 12) * 3] = 2.6 * Math.cos(a + 0.2);
        pos[(i + 12) * 3 + 1] = -0.3;
        pos[(i + 12) * 3 + 2] = 2.6 * Math.sin(a + 0.2);
      }
      for (let i = 0; i < 16; i++) {
        pos[(i + 24) * 3] = 3.2 * Math.cos(i * 0.4);
        pos[(i + 24) * 3 + 1] = 0.3;
        pos[(i + 24) * 3 + 2] = 3.2 * Math.sin(i * 0.4);
      }
      geo.attributes.position.needsUpdate = true;
      const txt = `B ∝ I — compass needles align to the field of the loop`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, 3.2, 0);
        group.add(info);
      }
    },
  };
});

/* ── EMI: magnet into coil, Lenz ──────────────────────────── */
register("emi", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const coil = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.12, 12, 40), new THREE.MeshStandardMaterial({ color: "#fbbf24" }));
  coil.position.set(0, 0, 0);
  coil.rotation.x = Math.PI / 2;
  group.add(coil);
  const magnet = new THREE.Group();
  const half = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), new THREE.MeshStandardMaterial({ color: "#f87171" }));
  half.position.y = 0.3;
  const half2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), new THREE.MeshStandardMaterial({ color: "#60a5fa" }));
  half2.position.y = -0.3;
  magnet.add(half, half2);
  magnet.position.set(3.2, 0, 0);
  group.add(magnet);
  let emfArrow = null;
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.2, 0);
  group.add(info);
  let pos = 3.2, dir = -1, speed = 1, lastLbl = "";
  const controls = [
    { key: "speed", label: "Magnet speed", min: 0.1, max: 3, step: 0.05, value: 1 },
    { key: "auto", label: "Oscillate", type: "toggle", value: 1 },
  ];
  let auto = 1;
  return {
    controls,
    set(key, v) {
      if (key === "speed") speed = v;
      if (key === "auto") auto = v === 1;
    },
    tick(t, dt) {
      if (auto) pos = 3.1 * Math.cos(t * speed * 0.8);
      magnet.position.x = pos;
      const dist = Math.abs(pos);
      const inCoil = dist < 1.6;
      const movingIn = (Math.abs(pos) < Math.abs(magnet.userData.last || 3.2));
      magnet.userData.last = pos;
      const e = inCoil ? (speed * 0.5) * (movingIn ? 1 : -1) : 0;
      if (emfArrow) { group.remove(emfArrow); disposeObj(emfArrow); }
      if (Math.abs(e) > 0.05) {
        const r = 1.6;
        emfArrow = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(r * (e > 0 ? 1 : -1), 0, 0),
            new THREE.Vector3(r * (e > 0 ? 0.4 : -0.4), 0, 0),
          ]),
          new THREE.LineBasicMaterial({ color: e > 0 ? "#4ade80" : "#f87171" })
        );
        group.add(emfArrow);
      }
      const txt = inCoil
        ? `Flux changing → ε = −dΦ/dt = ${e.toFixed(2)} V (Lenz opposes motion)`
        : "Move magnet near coil to induce EMF";
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, 3.2, 0);
        group.add(info);
      }
    },
  };
});

/* ── AC: phasor + waveforms ───────────────────────────────── */
register("ac", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const N = 140;
  const arrV = new Float32Array(N * 3);
  const arrI = new Float32Array(N * 3);
  const geoV = new THREE.BufferGeometry();
  geoV.setAttribute("position", new THREE.BufferAttribute(arrV, 3));
  const geoI = new THREE.BufferGeometry();
  geoI.setAttribute("position", new THREE.BufferAttribute(arrI, 3));
  const lineV = new THREE.Line(geoV, new THREE.LineBasicMaterial({ color: "#60a5fa" }));
  const lineI = new THREE.Line(geoI, new THREE.LineBasicMaterial({ color: "#34d399" }));
  group.add(lineV, lineI);
  const phV = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#60a5fa", 0.25, 0.15);
  const phI = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#34d399", 0.25, 0.15);
  phV.position.set(-3.6, 2.2, 0);
  phI.position.set(-3.6, -1.2, 0);
  group.add(phV, phI);
  const tV = makeTextSprite("V", { size: 0.5, color: "#60a5fa" }); tV.position.set(-3.2, 3.2, 0);
  const tI = makeTextSprite("I", { size: 0.5, color: "#34d399" }); tI.position.set(-3.2, -0.2, 0);
  group.add(tV, tI);
  let phi = 0, f = 1;
  const controls = [
    { key: "f", label: "Frequency (Hz)", min: 0.2, max: 3, step: 0.05, value: 1 },
    { key: "phi", label: "Phase lead φ°", min: -90, max: 90, step: 1, value: 0 },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "f") f = v;
      if (key === "phi") phi = (v * Math.PI) / 180;
    },
    tick(t) {
      const w = 2 * Math.PI * f;
      const arrV = geoV.attributes.position.array;
      const arrI = geoI.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const x = -4 + (8 * i) / (N - 1);
        arrV[i * 3] = x; arrV[i * 3 + 1] = Math.sin(w * x * 0.8 + t * w) * 1.4; arrV[i * 3 + 2] = 0;
        arrI[i * 3] = x; arrI[i * 3 + 1] = Math.sin(w * x * 0.8 + t * w - phi) * 1.4; arrI[i * 3 + 2] = 0;
      }
      geoV.attributes.position.needsUpdate = true;
      geoI.attributes.position.needsUpdate = true;
      phV.quaternion.identity();
      phV.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), t * w);
      phI.quaternion.identity();
      phI.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), t * w - phi);
    },
  };
});
