/* JEE Planner — Physics simulations */

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

/* ── projectile motion ────────────────────────────────────── */
register("projectile", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4.5, 9));
  const ball = makePoint(new THREE.Vector3(0, 0, 0), "#fbbf24", 0.2);
  group.add(ball);
  const trail = makeTrail("#7aa2ff", 400, 2);
  group.add(trail.line);
  const vArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#4ade80", 0.18, 0.12);
  const hArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#f87171", 0.16, 0.1);
  group.add(vArrow, hArrow);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.6, 0);
  group.add(info);
  let cannon = makeTextSprite("cannon", { size: 0.45, color: "#949ba8" });
  cannon.position.set(0, -0.9, 0);
  group.add(cannon);

  const g = 9.8;
  let u = 8, ang = 50, running = 1;
  let t = 0;
  let lastLbl = "";

  function resetTrajectory() { t = 0; trail.clear(); ball.position.set(0, 0, 0); }
  function flightTime() { return (2 * u * Math.sin(ang * Math.PI / 180)) / g; }

  function updateInfo() {
    const R = (u * u * Math.sin(2 * ang * Math.PI / 180)) / g;
    const H = (u * u * Math.sin(ang * Math.PI / 180) ** 2) / (2 * g);
    const txt = `u=${u} m/s · θ=${ang}° · R=${R.toFixed(1)} m · H=${H.toFixed(1)} m`;
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.6, 0);
      group.add(info);
    }
  }
  updateInfo();

  const controls = [
    { key: "u", label: "Speed u", min: 3, max: 12, step: 0.1, value: 8 },
    { key: "ang", label: "Angle θ°", min: 10, max: 80, step: 1, value: 50 },
    { key: "run", label: "Run", type: "toggle", value: 1 },
    { key: "restart", label: "Restart", type: "button" },
  ];

  return {
    controls,
    set(key, v) {
      if (key === "u") { u = v; resetTrajectory(); updateInfo(); }
      if (key === "ang") { ang = v; resetTrajectory(); updateInfo(); }
      if (key === "run") running = v === 1;
      if (key === "restart") resetTrajectory();
    },
    tick(_t, dt) {
      if (running) {
        const T = flightTime();
        const p = t % (T * 1.35);
        const th = ang * Math.PI / 180;
        const x = u * Math.cos(th) * p;
        const y = u * Math.sin(th) * p - 0.5 * g * p * p;
        ball.position.set(x, Math.max(y, 0), 0);
        trail.push(new THREE.Vector3(x, Math.max(y, 0), 0));
        const vx = u * Math.cos(th);
        const vy = u * Math.sin(th) - g * p;
        vArrow.quaternion.identity();
        vArrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(vx, vy, 0).normalize());
        vArrow.scale.set(Math.hypot(vx, vy) * 0.7, 1, 1);
        vArrow.position.set(x, Math.max(y, 0), 0);
        hArrow.quaternion.identity();
        hArrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(vx, 0, 0).normalize());
        hArrow.scale.set(Math.abs(vx) * 0.55, 1, 1);
        hArrow.position.set(x, Math.max(y, 0) - 0.4, 0);
        t += dt;
      }
    },
  };
});

/* ── SHM spring-mass ──────────────────────────────────────── */
register("shm", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4, 8));
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.6, 2.6), new THREE.MeshStandardMaterial({ color: "#4b5261" }));
  wall.position.x = -4.4;
  group.add(wall);
  const mass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.0), new THREE.MeshStandardMaterial({ color: "#7aa2ff", metalness: 0.2, roughness: 0.5 }));
  group.add(mass);

  let spring = null;
  function buildSpring() {
    if (spring) { group.remove(spring); disposeObj(spring); }
    const pts = [];
    const xStart = -4.2, xEnd = mass.position.x - 0.7;
    const coils = 14;
    for (let i = 0; i <= coils * 8; i++) {
      const xx = xStart + (xEnd - xStart) * (i / (coils * 8));
      pts.push(new THREE.Vector3(xx, Math.sin(i / 1.2) * 0.28, Math.cos(i / 1.2) * 0.28));
    }
    spring = linePts(THREE, pts, "#949ba8", 0.9);
    group.add(spring);
  }

  let A = 1.6, w = 1.2, running = 1, t = 0;
  const trail = makeTrail("#4ade80", 250, 2);
  trail.line.rotation.z = 0;
  group.add(trail.line);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.4, 0);
  group.add(info);
  let lastLbl = "";
  let keBar = null, peBar = null, teBar = null;

  function buildBars() {
    if (keBar) { group.remove(keBar); disposeObj(keBar); keBar = null; }
    if (peBar) { group.remove(peBar); disposeObj(peBar); peBar = null; }
    if (teBar) { group.remove(teBar); disposeObj(teBar); teBar = null; }
    keBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: "#f87171" }));
    peBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: "#4ade80" }));
    teBar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: "#fbbf24" }));
    const t1 = makeTextSprite("KE", { size: 0.35, color: "#f87171" });
    const t2 = makeTextSprite("PE", { size: 0.35, color: "#4ade80" });
    const t3 = makeTextSprite("Total", { size: 0.35, color: "#fbbf24" });
    t1.position.set(-2.4, 3.0, 0); t2.position.set(0, 3.0, 0); t3.position.set(2.4, 3.0, 0);
    group.add(keBar, peBar, teBar, t1, t2, t3);
  }
  buildBars();

  function update(dt) {
    if (running) t += dt * w;
    const x = A * Math.sin(t);
    mass.position.set(x, 0, 0);
    buildSpring();
    const v = A * Math.cos(t);
    const E = 0.5 * A * A;
    const ke = 0.5 * v * v;
    const pe = E - ke;
    keBar.scale.set(0.5, Math.max(ke / E, 0.02), 0.5);
    keBar.position.y = Math.max(ke / E, 0.02) / 2;
    keBar.position.set(-2.4, keBar.position.y - 1.4, 0);
    peBar.scale.set(0.5, Math.max(pe / E, 0.02), 0.5);
    peBar.position.y = Math.max(pe / E, 0.02) / 2;
    peBar.position.set(0, peBar.position.y - 1.4, 0);
    teBar.scale.set(0.5, 1, 0.5);
    teBar.position.set(2.4, 0.36, 0);
    trail.push(new THREE.Vector3(x, 1.2, 0));
    const txt = `x = A·sin(ωt) · T = ${(2 * Math.PI / w).toFixed(2)} s`;
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.4, 0);
      group.add(info);
    }
  }
  update(0);

  const controls = [
    { key: "A", label: "Amplitude A", min: 0.3, max: 2.4, step: 0.05, value: 1.6 },
    { key: "w", label: "Frequency ω", min: 0.4, max: 3, step: 0.05, value: 1.2 },
    { key: "run", label: "Run", type: "toggle", value: 1 },
  ];
  return { controls, set(key, v) { if (key === "A") A = v; if (key === "w") w = v; if (key === "run") running = v === 1; }, tick(_t, dt) { update(dt); } };
});

/* ── energy: roller coaster ───────────────────────────────── */
register("energy", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4, 8));
  const trackPts = [];
  for (let i = 0; i <= 200; i++) {
    const s = i / 200;
    const x = -4 + s * 8;
    const y = 0.6 + 1.6 * Math.pow(Math.sin((s) * Math.PI * 2.2), 2) * Math.exp(-s * 2);
    trackPts.push(new THREE.Vector3(x, y, 0));
  }
  group.add(linePts(THREE, trackPts, "#949ba8", 0.9));
  const ball = makePoint(new THREE.Vector3(0, 0, 0), "#fbbf24", 0.22);
  group.add(ball);
  let keBar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.45), new THREE.MeshBasicMaterial({ color: "#f87171" }));
  let peBar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.45), new THREE.MeshBasicMaterial({ color: "#4ade80" }));
  let meBar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.45), new THREE.MeshBasicMaterial({ color: "#fbbf24" }));
  const l1 = makeTextSprite("KE", { size: 0.35, color: "#f87171" }); l1.position.set(-2.4, 3.2, 0);
  const l2 = makeTextSprite("PE", { size: 0.35, color: "#4ade80" }); l2.position.set(0, 3.2, 0);
  const l3 = makeTextSprite("Total E", { size: 0.35, color: "#fbbf24" }); l3.position.set(2.4, 3.2, 0);
  group.add(keBar, peBar, meBar, l1, l2, l3);

  let s = 0, speed = 0.32, running = 1;
  function yAt(x) {
    const s = (x + 4) / 8;
    return 0.6 + 1.6 * Math.pow(Math.sin(s * Math.PI * 2.2), 2) * Math.exp(-s * 2);
  }
  function tickSim(dt) {
    if (!running) return;
    const dy = yAt(ball.position.x + 0.05) - yAt(ball.position.x);
    const dx = 0.05;
    const slope = dy / dx;
    speed += (dt * 0.55 * (-slope * 0.6));
    speed = Math.max(Math.min(speed, 0.5), 0.05);
    const xx = ball.position.x + speed * dt * 3;
    if (xx > 4) { ball.position.x = -4; }
    else {
      ball.position.x = xx;
      ball.position.y = yAt(xx);
    }
    const y = ball.position.y;
    const g = 9.8;
    const total = yAt(-4) * g + 0.5 * 1;
    const pe = y * g;
    const ke = Math.max(total - pe, 0);
    const me = pe + ke;
    const H = 3.2;
    keBar.scale.set(0.45, Math.max((ke / total) * 1.4, 0.02), 0.45);
    keBar.position.set(-2.4, keBar.scale.y / 2 - 1.4, 0);
    peBar.scale.set(0.45, Math.max((pe / total) * 1.4, 0.02), 0.45);
    peBar.position.set(0, peBar.scale.y / 2 - 1.4, 0);
    meBar.scale.set(0.45, Math.max((me / total) * 1.4, 0.02), 0.45);
    meBar.position.set(2.4, meBar.scale.y / 2 - 1.4, 0);
  }
  ball.position.set(-4, yAt(-4), 0);
  const controls = [
    { key: "run", label: "Run", type: "toggle", value: 1 },
    { key: "restart", label: "Restart", type: "button" },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "run") running = v === 1;
      if (key === "restart") { ball.position.x = -4; ball.position.y = yAt(-4); speed = 0.32; }
    },
    tick(_t, dt) { tickSim(dt); },
  };
});

/* ── rotation ─────────────────────────────────────────────── */
register("rotation", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 0.28, 48),
    new THREE.MeshStandardMaterial({ color: "#7aa2ff", metalness: 0.25, roughness: 0.4 })
  );
  disc.rotation.x = Math.PI / 2;
  disc.position.y = 0.6;
  group.add(disc);
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: "#fbbf24" }));
  spoke.position.y = 0.6;
  group.add(spoke);

  const wArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), "#4ade80", 0.4, 0.24);
  const LArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), "#f87171", 0.4, 0.24);
  group.add(wArrow, LArrow);
  const wLbl = makeTextSprite("ω", { size: 0.6, color: "#4ade80" }); wLbl.position.set(0, 3.2, 0.4);
  const LLbl = makeTextSprite("L = Iω", { size: 0.6, color: "#f87171" }); LLbl.position.set(0, 3.2, -0.6);
  group.add(wLbl, LLbl);

  let omega = 1.6, precess = 0, running = 1;
  const controls = [
    { key: "w", label: "Angular speed ω", min: 0.2, max: 4, step: 0.05, value: 1.6 },
    { key: "precess", label: "Precession (torque)", type: "toggle", value: 0 },
    { key: "run", label: "Run", type: "toggle", value: 1 },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "w") omega = v;
      if (key === "precess") precess = v === 1;
      if (key === "run") running = v === 1;
    },
    tick(t, dt) {
      if (!running) return;
      disc.rotation.z += omega * dt;
      spoke.rotation.z = disc.rotation.z;
      const sp = omega;
      wArrow.scale.set(1, sp, 1);
      LArrow.scale.set(1, sp, 1);
      if (precess) {
        disc.rotation.y += dt * 1.2;
        spoke.rotation.y = disc.rotation.y;
      }
    },
  };
});

/* ── elastic collisions ───────────────────────────────────── */
register("collisions", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4, 8));
  const m1 = 1, m2 = 1;
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshStandardMaterial({ color: "#60a5fa" }));
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshStandardMaterial({ color: "#34d399" }));
  b1.position.set(-3, 0, 0);
  b2.position.set(3, 0, 0);
  group.add(b1, b2);
  const v1a = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#f87171", 0.2, 0.12);
  const v2a = makeArrow(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0), "#fbbf24", 0.2, 0.12);
  group.add(v1a, v2a);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.4, 0);
  group.add(info);

  let u1 = 2, u2 = -1.4, running = 1;
  let x1 = -3, x2 = 3, v1 = u1, v2 = u2, collided = false, done = false, lastLbl = "";

  function showInfo() {
    const txt = collided
      ? `after: v₁=${v1.toFixed(2)} m/s · v₂=${v2.toFixed(2)} m/s · momentum p = ${(v1 + v2).toFixed(2)}`
      : `before: u₁=${u1.toFixed(2)} m/s · u₂=${u2.toFixed(2)} m/s · momentum p = ${(u1 + u2).toFixed(2)}`;
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.4, 0);
      group.add(info);
    }
  }
  showInfo();

  function restart() {
    x1 = -3; x2 = 3; v1 = u1; v2 = u2; collided = false; done = false;
  }

  const controls = [
    { key: "u1", label: "u₁", min: 0, max: 4, step: 0.1, value: 2 },
    { key: "u2", label: "u₂", min: -4, max: 0, step: 0.1, value: -1.4 },
    { key: "run", label: "Run", type: "toggle", value: 1 },
    { key: "restart", label: "Restart", type: "button" },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "u1") { u1 = v; restart(); showInfo(); }
      if (key === "u2") { u2 = v; restart(); showInfo(); }
      if (key === "run") running = v === 1;
      if (key === "restart") { restart(); showInfo(); }
    },
    tick(_t, dt) {
      if (!running || done) return;
      const rel = (x1 + 0.8 < x2 - 0.8);
      if (x1 + 1.6 >= x2 - 1.6 && !collided) {
        collided = true;
        const m = m1, m2b = m2;
        const v1n = ((m - m2b) * v1 + 2 * m2b * v2) / (m + m2b);
        const v2n = ((m2b - m) * v2 + 2 * m * v1) / (m + m2b);
        v1 = v1n; v2 = v2n;
        showInfo();
      }
      x1 += v1 * dt;
      x2 += v2 * dt;
      b1.position.x = x1;
      b2.position.x = x2;
      v1a.position.set(x1, 1.4, 0);
      v1a.quaternion.identity();
      v1a.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(v1, 0, 0).normalize());
      v1a.scale.set(Math.abs(v1), 1, 1);
      v2a.position.set(x2, 1.4, 0);
      v2a.quaternion.identity();
      v2a.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(v2, 0, 0).normalize());
      v2a.scale.set(Math.abs(v2), 1, 1);
      if (Math.abs(x1) > 6 || Math.abs(x2) > 6) done = true;
    },
  };
});

/* ── gravitation: orbit ───────────────────────────────────── */
register("gravitation", ({ THREE, group, makeGrid, makeTextSprite, makePoint }) => {
  group.add(makeGrid(4, 8));
  const star = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 0.5 }));
  group.add(star);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), new THREE.MeshStandardMaterial({ color: "#60a5fa" }));
  group.add(planet);
  const trail = makeTrail("#7aa2ff", 500, 2);
  group.add(trail.line);
  const gArrow = makeArrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), "#4ade80", 0.2, 0.12);
  group.add(gArrow);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.4, 0);
  group.add(info);

  let e = 0.4, speedScale = 1, running = 1, theta = 0, lastLbl = "";
  const a = 3;

  function update() {
    const b = a * Math.sqrt(1 - e * e);
    const px = a * Math.cos(theta) * (1 - e * e) / (1 + e * Math.cos(theta));
    const py = b * Math.sin(theta) * (1 - e * e) / (1 + e * Math.cos(theta));
    planet.position.set(px, 0, py);
    const r = Math.hypot(px, py);
    const g = 1.8 / (r * r);
    gArrow.position.copy(planet.position);
    gArrow.quaternion.identity();
    gArrow.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-px, 0, -py).normalize());
    gArrow.scale.set(g * 0.9, 1, 1);
    trail.push(planet.position.clone());
    const txt = `elliptical orbit · eccentricity e = ${e.toFixed(2)} · r = ${r.toFixed(2)}`;
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.4, 0);
      group.add(info);
    }
  }

  const controls = [
    { key: "e", label: "Eccentricity e", min: 0, max: 0.85, step: 0.01, value: 0.4 },
    { key: "speed", label: "Speed", min: 0.1, max: 3, step: 0.05, value: 1 },
    { key: "run", label: "Run", type: "toggle", value: 1 },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "e") { e = v; trail.clear(); }
      if (key === "speed") speedScale = v;
      if (key === "run") running = v === 1;
    },
    tick(_t, dt) {
      if (running) {
        const denom = (1 + e * Math.cos(theta));
        const dtheta = (0.8 * speedScale * denom * denom) / (a * Math.sqrt(1 - e * e)) * 2.2;
        theta += dtheta * dt;
      }
      update();
    },
  };
});

/* ── fluids: buoyancy ─────────────────────────────────────── */
register("fluids", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const tank = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 2.4, 3.6),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.18, side: THREE.DoubleSide })
  );
  tank.position.y = -1.2;
  group.add(tank);
  const waterTop = 0.4;
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(3.62, 1.8, 3.62),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.28 })
  );
  water.position.y = 0.4 - 0.9;
  group.add(water);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), new THREE.MeshStandardMaterial({ color: "#fbbf24" }));
  ball.position.y = 0.1;
  group.add(ball);
  const buoy = makeArrow(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), "#4ade80", 0.3, 0.18);
  const wgt = makeArrow(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), "#f87171", 0.3, 0.18);
  group.add(buoy, wgt);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.4, 0);
  group.add(info);

  let rho = 1, ballR = 0.55, bob = 0;
  const controls = [
    { key: "rho", label: "Fluid density ρ", min: 0.2, max: 2.2, step: 0.02, value: 1 },
    { key: "r", label: "Ball radius", min: 0.3, max: 0.8, step: 0.01, value: 0.55 },
  ];
  function update() {
    ball.scale.set(ballR / 0.55, ballR / 0.55, ballR / 0.55);
    const vol = (4 / 3) * Math.PI * ballR ** 3;
    const Fb = rho * 9.8 * vol * (ball.position.y < waterTop ? 1 : 0.2);
    const Fg = 9.8 * 1.2 * vol;
    buoy.scale.set(1, Fb * 0.3, 1);
    buoy.position.copy(ball.position);
    buoy.position.y += 0.8;
    wgt.scale.set(1, Fg * 0.3, 1);
    wgt.position.copy(ball.position);
    wgt.position.y -= 0.8;
    const net = Fb - Fg;
    const txt = net > 0.01 ? "Ball floats (F_b > W)" : net < -0.01 ? "Ball sinks (W > F_b)" : "Ball floats in equilibrium";
    disposeObj(info); group.remove(info);
    info = makeTextSprite(txt, { size: 0.55 });
    info.position.set(0, 3.4, 0);
    group.add(info);
    return net;
  }
  const controls2 = controls;
  return {
    controls: controls2,
    set(key, v) { if (key === "rho") rho = v; if (key === "r") ballR = v; },
    tick(t, dt) {
      const net = update();
      if (ball.position.y > waterTop && net > 0) bob -= dt * 0.3;
      ball.position.y += (net > 0 ? -0.4 : 0.25) * dt * 0.8;
      ball.position.y = Math.max(Math.min(ball.position.y, 1.8), -1.6);
      ball.rotation.y += dt;
    },
  };
});

/* ── kinetic theory gas ───────────────────────────────────── */
register("gas", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const half = 1.8;
  const boxEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(half * 2, half * 2, half * 2)),
    new THREE.LineBasicMaterial({ color: "#3a4150" })
  );
  group.add(boxEdges);
  const N = 90;
  const pos = new Float32Array(N * 3);
  const vel = [];
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 3;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    vel.push([(Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#7aa2ff", size: 0.09, transparent: true, opacity: 0.95 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  let pressureLbl = makeTextSprite("", { size: 0.55 });
  pressureLbl.position.set(0, 3.3, 0);
  group.add(pressureLbl);
  let temp = 1, lastLbl = "";
  const collisions = { c: 0 };

  const controls = [
    { key: "temp", label: "Temperature", min: 0.2, max: 3, step: 0.05, value: 1 },
    { key: "restart", label: "Reset molecules", type: "button" },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "temp") temp = v;
      if (key === "restart") {
        for (let i = 0; i < N; i++) {
          pos[i * 3] = (Math.random() - 0.5) * 3;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
    },
    tick(t, dt) {
      let hits = 0;
      const sp = 0.8 * temp;
      for (let i = 0; i < N; i++) {
        for (let k = 0; k < 3; k++) {
          pos[i * 3 + k] += vel[i][k] * sp * dt;
          if (Math.abs(pos[i * 3 + k]) > half) {
            vel[i][k] *= -1;
            hits++;
          }
        }
      }
      geo.attributes.position.needsUpdate = true;
      collisions.c = collisions.c * 0.98 + hits * 0.02;
      const txt = `P ∝ T · wall collisions/s = ${collisions.c.toFixed(0)}`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(pressureLbl); group.remove(pressureLbl);
        pressureLbl = makeTextSprite(txt, { size: 0.55 });
        pressureLbl.position.set(0, 3.3, 0);
        group.add(pressureLbl);
      }
    },
  };
});

/* ── thermodynamics: piston ───────────────────────────────── */
register("thermo", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const cyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 2.6, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: "#949ba8", transparent: true, opacity: 0.25, side: THREE.DoubleSide })
  );
  cyl.position.y = 0;
  group.add(cyl);
  const N = 55;
  const pos = new Float32Array(N * 3);
  const vel = [];
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 2.2;
    pos[i * 3 + 1] = Math.random() * 2;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
    vel.push([(Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: "#fbbf24", size: 0.1 }));
  group.add(pts);
  let piston = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.18, 32), new THREE.MeshStandardMaterial({ color: "#7aa2ff", metalness: 0.2, roughness: 0.4 }));
  group.add(piston);
  let heat = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 16), new THREE.MeshStandardMaterial({ color: "#f87171", emissive: "#f87171", emissiveIntensity: 0.6 }));
  heat.position.set(0, -1.7, 0);
  heat.rotation.x = Math.PI;
  heat.visible = false;
  group.add(heat);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.3, 0);
  group.add(info);
  let heatOn = 0, pistonY = 1.0, temp = 1, lastLbl = "";
  const controls = [
    { key: "heat", label: "Heat on", type: "toggle", value: 0 },
    { key: "reset", label: "Reset piston", type: "button" },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "heat") heatOn = v === 1;
      if (key === "reset") { pistonY = 1.0; temp = 1; }
    },
    tick(t, dt) {
      heat.visible = heatOn;
      if (heatOn) temp = Math.min(temp + dt * 0.5, 3.2);
      const sp = 0.5 * temp;
      for (let i = 0; i < N; i++) {
        for (let k = 0; k < 3; k++) {
          pos[i * 3 + k] += vel[i][k] * sp * dt;
        }
        if (Math.abs(pos[i * 3]) > 1.25) vel[i][0] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 1.25) vel[i][2] *= -1;
        if (pos[i * 3 + 1] > pistonY - 0.15) { pos[i * 3 + 1] = pistonY - 0.15; vel[i][1] *= -1; }
        if (pos[i * 3 + 1] < -1.2) { pos[i * 3 + 1] = -1.2; vel[i][1] *= -1; }
      }
      geo.attributes.position.needsUpdate = true;
      if (heatOn) pistonY = Math.min(pistonY + dt * 0.12, 2.4);
      piston.position.y = pistonY;
      const txt = heatOn ? `Heating → gas expands, piston rises (W > 0)` : `Isochoric/equilibrium — gas at rest temperature`;
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

/* ── waves / superposition ────────────────────────────────── */
register("waves", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(4, 8));
  const N = 160;
  const pts = new Array(N).fill(0).map(() => new THREE.Vector3());
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#7aa2ff", linewidth: 2 }));
  group.add(line);
  const pts2 = new Array(N).fill(0).map(() => new THREE.Vector3());
  const geo2 = new THREE.BufferGeometry();
  geo2.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const line2 = new THREE.Line(geo2, new THREE.LineBasicMaterial({ color: "#34d399", transparent: true, opacity: 0.6 }));
  group.add(line2);
  const pts3 = new Array(N).fill(0).map(() => new THREE.Vector3());
  const geo3 = new THREE.BufferGeometry();
  geo3.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const line3 = new THREE.Line(geo3, new THREE.LineBasicMaterial({ color: "#fbbf24", linewidth: 2 }));
  group.add(line3);
  let info = makeTextSprite("blue + green = yellow (superposition)", { size: 0.5 });
  info.position.set(0, 3.2, 0);
  group.add(info);
  let k1 = 1.2, w1 = 1.6, A1 = 1, k2 = 1.2, w2 = 1.4, A2 = 1;
  const controls = [
    { key: "A1", label: "Amplitude A₁", min: 0, max: 2, step: 0.05, value: 1 },
    { key: "A2", label: "Amplitude A₂", min: 0, max: 2, step: 0.05, value: 1 },
    { key: "w2", label: "Frequency ω₂", min: 0.4, max: 2.4, step: 0.02, value: 1.4 },
    { key: "reverse", label: "Reverse 2nd wave", type: "toggle", value: 0 },
  ];
  let rev = 0;
  return {
    controls,
    set(key, v) {
      if (key === "A1") A1 = v;
      if (key === "A2") A2 = v;
      if (key === "w2") w2 = v;
      if (key === "reverse") rev = v === 1;
    },
    tick(t) {
      const arr = geo.attributes.position.array;
      const arr2 = geo2.attributes.position.array;
      const arr3 = geo3.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const x = -5 + (10 * i) / (N - 1);
        const dir = rev ? 1 : -1;
        const y1 = A1 * Math.sin(k1 * x - w1 * t);
        const y2 = A2 * Math.sin(k2 * x + dir * w2 * t);
        arr[i * 3] = x; arr[i * 3 + 1] = y1; arr[i * 3 + 2] = 0;
        arr2[i * 3] = x; arr2[i * 3 + 1] = y2; arr2[i * 3 + 2] = 0;
        arr3[i * 3] = x; arr3[i * 3 + 1] = y1 + y2; arr3[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
      geo2.attributes.position.needsUpdate = true;
      geo3.attributes.position.needsUpdate = true;
    },
  };
});
