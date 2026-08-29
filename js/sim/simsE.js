/* TeachMeJEE — simulation pack E: optics, kinematics, circuits, orbits.
   Same contract: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }. */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "P-rayoptics": "lens-bench",
  "P-kinematics": "projectile-lab",
  "P-laws": "collision-lab",
  "P-waves": "doppler-lab",
  "P-emi": "rc-circuit",
  "P-gravitation": "orbit-sim",
};

/* Thin lens bench: draggable object, real rays, live image. */
register("lens-bench", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4.5, 0, 0), new THREE.Vector3(4.5, 0, 0)]),
    new THREE.LineBasicMaterial({ color: "#463922" }));
  g.add(axis);
  const lensMat = new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.35 });
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.12, 32), lensMat);
  lens.rotation.z = Math.PI / 2;
  g.add(lens);
  const fMarks = [];
  [-2, 2].forEach((x) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.6 }));
    m.position.set(x, 0, 0);
    g.add(m);
    fMarks.push(m);
  });
  const objArrow = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 10), new THREE.MeshStandardMaterial({ color: "#e86f52" }));
  objArrow.geometry.translate(0, -0.45, 0);
  g.add(objArrow);
  const imgArrow = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 10), new THREE.MeshStandardMaterial({ color: "#8fbf6f" }));
  imgArrow.geometry.translate(0, -0.45, 0);
  g.add(imgArrow);
  const rayMat = new THREE.LineBasicMaterial({ color: "#ffc476" });
  const rays = [];
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]), rayMat);
    g.add(line);
    rays.push(line);
  }
  let u = -3.2, f = 2;
  function paint() {
    objArrow.position.set(u, 0, 0);
    objArrow.rotation.z = Math.PI;
    const v = (u * f) / (u + f);
    const mag = Math.abs(v / u);
    imgArrow.position.set(v, 0, 0);
    imgArrow.scale.y = Math.min(4, Math.max(0.15, mag));
    if (v < 0) imgArrow.rotation.z = 0; else imgArrow.rotation.z = Math.PI;
    for (const r of rays) {
      const tipY = -0.85;
      const p0 = new THREE.Vector3(u, tipY, 0);
      const atLens = new THREE.Vector3(0, tipY, 0);
      const outDir = new THREE.Vector3(v - 0, tipY * (1 - (f === 0 ? 0 : 0)), 0);
      const slope = (tipY - 0) / (v - 0 || 1e-6);
      const endY = slope * (5.5 - v);
      const pEnd = new THREE.Vector3(5.5, Number.isFinite(endY) ? Math.max(-4, Math.min(4, endY)) : 0, 0);
      const arr = r.geometry.attributes.position.array;
      arr[0] = p0.x; arr[1] = p0.y; arr[2] = 0;
      arr[3] = atLens.x; arr[4] = atLens.y; arr[5] = 0;
      arr[6] = v; arr[7] = 0; arr[8] = 0;
      arr[9] = pEnd.x; arr[10] = pEnd.y; arr[11] = 0;
      r.geometry.attributes.position.needsUpdate = true;
      void outDir;
    }
  }
  paint();
  return {
    tick(_t, dt) { lens.rotation.x += dt * 0.25; },
    set(key, v) {
      if (key === "u") { u = Math.min(-1.05, v); paint(); }
      if (key === "f") { f = v; fMarks.forEach((m, i) => { m.position.x = i ? f : -f; }); paint(); }
    },
    controls: [
      { key: "u", label: "Object distance", type: "range", min: -4.4, max: -1.05, step: 0.05, value: u },
      { key: "f", label: "Focal length", type: "range", min: 1, max: 3, step: 0.05, value: f },
    ],
  };
});

/* Projectile lab: angle + speed sliders, live trail, range apex markers. */
register("projectile-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.08, 1.6),
    new THREE.MeshStandardMaterial({ color: "#3a2f1e" }));
  ground.position.set(0, -1.6, 0);
  g.add(ground);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 14, 14),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.5 }));
  g.add(ball);
  const trailPts = [];
  const trail = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  g.add(trail);
  const speed = { v: 7, ang: 50 };
  let st = null;
  function launch() {
    const rad = (speed.ang * Math.PI) / 180;
    st = { x: -4.5, y: -1.5, vx: speed.v * Math.cos(rad), vy: speed.v * Math.sin(rad), done: false };
    trailPts.length = 0;
  }
  launch();
  return {
    tick(_t, dt) {
      if (!st) return;
      st.vy -= 9.8 * dt * 0.35;
      st.x += st.vx * dt; st.y += st.vy * dt;
      ball.position.set(st.x, st.y, 0);
      trailPts.push(ball.position.clone());
      if (trailPts.length > 260) trailPts.shift();
      trail.geometry.setFromPoints(trailPts);
      if (st.y < -1.55 && st.vy < 0) launch();
    },
    set(key, v) { if (key === "v") speed.v = v; if (key === "ang") speed.ang = v; launch(); },
    controls: [
      { key: "v", label: "Launch speed", type: "range", min: 3, max: 12, step: 0.1, value: speed.v },
      { key: "ang", label: "Angle (deg)", type: "range", min: 10, max: 80, step: 1, value: speed.ang },
    ],
  };
});

/* Collision lab: two gliders on a track, elasticity slider, momentum conserved. */
register("collision-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const track = new THREE.Mesh(new THREE.BoxGeometry(9, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: "#3a2f1e" }));
  track.position.y = -0.8;
  g.add(track);
  const mkGlider = (col) => new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.42, 0.6),
    new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.25 }));
  const a = mkGlider("#69a7d8"), b = mkGlider("#e86f52");
  g.add(a, b);
  let va = 1.6, vb = -1.1, rest = 1;
  function reset() { a.position.set(-3.2, -0.55, 0); b.position.set(3.2, -0.55, 0); va = 1.6 + Math.random(); vb = -(1 + Math.random()); }
  reset();
  return {
    tick(_t, dt) {
      a.position.x += va * dt; b.position.x += vb * dt;
      const hitDist = 0.68;
      if (Math.abs(a.position.x - b.position.x) < hitDist) {
        const m1 = 1, m2 = 1.4;
        const ua = va, ub = vb;
        va = (rest * m2 * (ub - ua) + m1 * ua + m2 * ub) / (m1 + m2);
        vb = (rest * m1 * (ua - ub) + m1 * ua + m2 * ub) / (m1 + m2);
        const mid = (a.position.x + b.position.x) / 2;
        a.position.x = mid - hitDist / 2 - 0.01;
        b.position.x = mid + hitDist / 2 + 0.01;
      }
      for (const [p, vv] of [[a, va], [b, vb]]) {
        if (Math.abs(p.position.x) > 4.2) reset();
        void vv;
      }
    },
    set(key, v) {
      if (key === "rest") rest = v;
      if (key === "reset") reset();
    },
    controls: [
      { key: "rest", label: "Elasticity e", type: "range", min: 0, max: 1, step: 0.05, value: 1 },
      { key: "reset", label: "Reset run", type: "button" },
    ],
  };
});

/* Doppler lab: moving source emitting wavefront rings, compression ahead. */
register("doppler-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const src = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.9 }));
  src.position.set(0, 0, 0);
  g.add(src);
  const rings = [];
  for (let i = 0; i < 12; i++) {
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 41 }, (_, k) => {
        const th = (k / 40) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(th), Math.sin(th), 0);
      })),
      new THREE.LineBasicMaterial({ color: "#69a7d8", transparent: true, opacity: 0.7 }));
    ring.visible = false;
    ring.userData = { x: 0, y: 0, r: 0, alive: false };
    g.add(ring);
    rings.push(ring);
  }
  let spawnT = 0, vx = 1.4, waveSpd = 2.2;
  return {
    tick(_t, dt) {
      src.position.x += vx * dt;
      if (src.position.x > 4 || src.position.x < -4) vx *= -1;
      spawnT += dt;
      if (spawnT > 0.35) {
        spawnT = 0;
        const freeRing = rings.find((r) => !r.userData.alive);
        if (freeRing) { freeRing.userData.alive = true; freeRing.userData.r = 0.05; freeRing.userData.x = src.position.x; freeRing.userData.y = 0; }
      }
      for (const r of rings) {
        if (!r.userData.alive) continue;
        r.userData.r += waveSpd * dt;
        const sc = r.userData.r;
        r.scale.set(sc, sc, 1);
        r.position.set(r.userData.x, r.userData.y, 0);
        r.visible = sc < 7;
        r.material.opacity = Math.max(0, 0.75 - sc * 0.11);
        if (sc >= 7) r.userData.alive = false;
      }
    },
    set(key, v) { if (key === "vx") vx = v; if (key === "vw") waveSpd = v; },
    controls: [
      { key: "vx", label: "Source speed", type: "range", min: 0.2, max: 2.4, step: 0.05, value: 1.4 },
      { key: "vw", label: "Wave speed", type: "range", min: 1, max: 4, step: 0.05, value: 2.2 },
    ],
  };
});

/* RC circuit: capacitor fills as it charges, bulb dims, graph draws. */
register("rc-circuit", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.3), new THREE.MeshStandardMaterial({ color: "#c8b795" }));
  battery.position.set(-3, -1, 0);
  const capA = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.08), new THREE.MeshStandardMaterial({ color: "#69a7d8" }));
  capA.position.set(2.4, -1, 0);
  const capB = capA.clone(); capB.position.x = 2.95;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 18), new THREE.MeshStandardMaterial({ color: "#ffd27a", emissive: "#ffc476", emissiveIntensity: 1.2 }));
  bulb.position.set(0, -1, 0);
  g.add(battery, capA, capB, bulb);
  const wireMat = new THREE.MeshBasicMaterial({ color: "#8a7c68" });
  const wirePath = [
    new THREE.Vector3(-3, -0.65, 0), new THREE.Vector3(-3, 1.2, 0), new THREE.Vector3(2.65, 1.2, 0),
    new THREE.Vector3(2.65, -0.6, 0),
  ];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wirePath.concat([new THREE.Vector3(-2.85, -1, 0), new THREE.Vector3(2.4, -1, 0)])), wireMat));
  const chargeDots = [];
  for (let i = 0; i < 14; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffe9a8", emissiveIntensity: 1.2 }));
    d.userData.u = i / 14;
    g.add(d);
    chargeDots.push(d);
  }
  let tau = 1.4, q = 0, running = true;
  return {
    tick(t, dt) {
      if (running) q = Math.min(1, q + dt / tau); else q = Math.max(0, q - dt / (tau * 1.4));
      bulb.material.emissiveIntensity = 0.15 + (1 - q) * 1.3;
      capB.scale.y = 0.3 + q * 0.9;
      capA.material.color.setStyle(q > 0.5 ? "#8ec07c" : "#69a7d8");
      for (const d of chargeDots) {
        d.userData.u += dt * (running ? (1.2 - q) : -0.4);
        if (d.userData.u > 1) d.userData.u -= 1;
        if (d.userData.u < 0) d.userData.u += 1;
        const u = d.userData.u;
        if (u < 0.62) {
          const seg = u / 0.62;
          const idx = Math.min(wirePath.length - 2, Math.floor(seg * (wirePath.length - 1)));
          const f = seg * (wirePath.length - 1) - idx;
          d.position.lerpVectors(wirePath[idx], wirePath[idx + 1], f);
        } else {
          const f = (u - 0.62) / 0.38;
          d.position.set(-2.85 + f * 5.25, -0.92 + Math.sin(f * Math.PI) * 0.06, 0.1);
        }
      }
      void t;
    },
    set(key, v) {
      if (key === "tau") tau = v;
      if (key === "switch") running = !running;
    },
    controls: [
      { key: "tau", label: "RC time constant", type: "range", min: 0.5, max: 3, step: 0.1, value: tau },
      { key: "switch", label: "Throw switch", type: "button" },
    ],
  };
});

/* Snell's tank: light beam refracting into water, TIR past critical angle. */
register("snell-tank", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const water = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 2), new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.22 }));
  water.position.set(0, -0.8, 0);
  g.add(water);
  const beamIn = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: "#fff3c4" }));
  const beamOut = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: "#8ec07c" }));
  const reflected = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: "#e86f52", transparent: true, opacity: 0.6 }));
  g.add(beamIn, beamOut, reflected);
  let inc = 35;
  const n1 = 1, n2 = 1.33;
  function paint() {
    const rad = (inc * Math.PI) / 180;
    const dir = new THREE.Vector3(Math.sin(rad), -Math.cos(rad), 0);
    beamIn.geometry.setFromPoints([new THREE.Vector3(dir.x * 3, dir.y * 3, 0), new THREE.Vector3(0, 0, 0)]);
    const sinT = (n1 / n2) * Math.sin(rad);
    if (sinT <= 1) {
      const tRad = Math.asin(sinT);
      const td = new THREE.Vector3(Math.sin(tRad), -Math.cos(tRad), 0);
      beamOut.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), td.multiplyScalar(2.6)]);
      beamOut.material.color.setStyle("#8ec07c");
      reflected.material.opacity = 0.25;
    } else {
      const rd = new THREE.Vector3(Math.sin(rad), Math.cos(rad), 0);
      beamOut.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), rd.multiplyScalar(2.8)]);
      beamOut.material.color.setStyle("#e86f52");
      reflected.material.opacity = 0;
    }
    reflected.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.sin(rad) * 2.4, Math.cos(rad) * 2.4, 0)]);
  }
  paint();
  return {
    tick(_t, dt) { void dt; },
    set(key, v) { if (key === "inc") { inc = v; paint(); } },
    controls: [{ key: "inc", label: "Angle of incidence", type: "range", min: 5, max: 85, step: 1, value: inc }],
  };
});

/* Orbit sim: central star, planet with adjustable tangential speed -> ellipses. */
register("orbit-sim", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffb454", emissiveIntensity: 1.4 }));
  g.add(star);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 14, 14),
    new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.4 }));
  g.add(planet);
  const trailPts = [];
  const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: "#463922" }));
  g.add(trail);
  let pos = new THREE.Vector2(4, 0);
  let vel = new THREE.Vector2(0, 1.55);
  const GM = 9;
  function launch(vy) { pos.set(4, 0); vel.set(0, vy); trailPts.length = 0; }
  launch(vel.y);
  return {
    tick(_t, dt) {
      const r = pos.length();
      const acc = pos.clone().multiplyScalar(-GM / (r * r * r));
      vel.addScaledVector(acc, dt);
      pos.addScaledVector(vel, dt);
      planet.position.set(pos.x, pos.y, 0);
      trailPts.push(planet.position.clone());
      if (trailPts.length > 420) trailPts.shift();
      trail.geometry.setFromPoints(trailPts);
      star.material.emissiveIntensity = 1.2 + Math.sin(_t * 2) * 0.2;
    },
    set(key, v) { if (key === "vy") launch(v); },
    controls: [{ key: "vy", label: "Launch speed (relaunch)", type: "range", min: 0.9, max: 2.2, step: 0.05, value: 1.55 }],
  };
});
