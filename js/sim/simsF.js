/* TeachMeJEE — simulation pack F: pendulum, standing waves, E-field,
   double-slit, titration, secant-to-tangent.
   Same contract: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }.
   Range controls omit `type` so Atlas variants apply (see variantForControls). */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "P-shm": "pendulum-lab",
  "P-waves": "standing-wave",
  "P-electro": "field-dipole",
  "P-waveoptics": "double-slit",
  "C-ionic": "titration-lab",
  "M-diff": "secant-tangent",
};

/* Pendulum lab: rod + bob, true small-angle dynamics, period from L and g. */
register("pendulum-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const standMat = new THREE.MeshStandardMaterial({ color: "#8a7c68" });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.12), standMat);
  bar.position.set(-0.6, 2.2, 0);
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.4, 0.12), standMat);
  pole.position.set(-1.8, 0, 0);
  g.add(bar, pole);
  const rodMat = new THREE.MeshStandardMaterial({ color: "#c8b795" });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 8), rodMat);
  const bob = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.55 }));
  g.add(rod, bob);
  let L = 1.6, deg = 28, grav = 9.8, phase = 0;
  function layout(th) {
    const px = 0, py = 2.2;
    const bx = px + L * Math.sin(th), by = py - L * Math.cos(th);
    rod.position.set((px + bx) / 2, (py + by) / 2, 0);
    rod.scale.y = L;
    rod.rotation.z = -th;
    bob.position.set(bx, by, 0);
  }
  layout(deg * Math.PI / 180);
  return {
    tick(_t, dt) {
      phase += Math.sqrt(grav / L) * dt;
      layout((deg * Math.PI / 180) * Math.cos(phase));
    },
    set(key, v) {
      if (key === "len") L = v;
      if (key === "ang") { deg = v; phase = 0; }
      if (key === "g") grav = v;
    },
    controls: [
      { key: "len", label: "Length L (m)", min: 0.6, max: 2.0, step: 0.05, value: L },
      { key: "ang", label: "Release angle (°)", min: 5, max: 60, step: 1, value: deg },
      { key: "g", label: "Gravity (m/s²)", min: 1.6, max: 24.8, step: 0.2, value: grav },
    ],
  };
});

/* Standing wave: modes on a string, nodes pinned, antinodes breathing. */
register("standing-wave", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const LEN = 6;
  const N = 121;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  line.frustumCulled = false;
  g.add(line);
  const postMat = new THREE.MeshStandardMaterial({ color: "#8a7c68" });
  [-LEN / 2, LEN / 2].forEach((x) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 0.12), postMat);
    post.position.set(x, 0, 0);
    g.add(post);
  });
  const nodeMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.7 });
  const nodeDots = [];
  for (let i = 0; i <= 5; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), nodeMat);
    d.visible = false;
    g.add(d);
    nodeDots.push(d);
  }
  let mode = 2, amp = 0.8, t = 0;
  function paint() {
    const arr = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const x = -LEN / 2 + (LEN * i) / (N - 1);
      const y = amp * Math.sin((mode * Math.PI * (x + LEN / 2)) / LEN) * Math.cos(3.2 * t);
      arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = 0;
    }
    geo.attributes.position.needsUpdate = true;
    nodeDots.forEach((d, i) => {
      if (i <= mode) {
        d.visible = true;
        d.position.set(-LEN / 2 + (LEN * i) / mode, 0, 0);
      } else d.visible = false;
    });
  }
  paint();
  return {
    tick(_t, dt) { t += dt; paint(); },
    set(key, v) { if (key === "mode") mode = Math.round(v); if (key === "amp") amp = v; paint(); },
    controls: [
      { key: "mode", label: "Mode n", min: 1, max: 5, step: 1, value: mode },
      { key: "amp", label: "Amplitude", min: 0.2, max: 1.4, step: 0.05, value: amp },
    ],
  };
});

/* Dipole field: + and − charges with traced field lines and drifting probes. */
register("field-dipole", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const plus = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 18, 18),
    new THREE.MeshStandardMaterial({ color: "#f87171", emissive: "#f87171", emissiveIntensity: 0.8 }));
  const minus = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 18, 18),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", emissive: "#60a5fa", emissiveIntensity: 0.8 }));
  g.add(plus, minus);
  const lineMat = new THREE.LineBasicMaterial({ color: "#a89a7d", transparent: true, opacity: 0.75 });
  const LINES = 14, STEPS = 70;
  const traces = [];
  for (let i = 0; i < LINES; i++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(STEPS * 3), 3));
    const ln = new THREE.Line(geo, lineMat);
    ln.frustumCulled = false;
    g.add(ln);
    traces.push(ln);
  }
  const probeMat = new THREE.MeshStandardMaterial({ color: "#f5eddc", emissive: "#f5eddc", emissiveIntensity: 0.9 });
  const probes = [];
  for (let i = 0; i < LINES; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), probeMat);
    p.userData = { line: i, s: Math.random() };
    g.add(p);
    probes.push(p);
  }
  let sep = 1.6, charge = 2;
  function fieldAt(x, y) {
    const ax = -sep / 2, bx = sep / 2;
    const r1x = x - ax, r1y = y, r2x = x - bx, r2y = y;
    const d1 = Math.hypot(r1x, r1y) + 1e-4, d2 = Math.hypot(r2x, r2y) + 1e-4;
    const ex = charge * (r1x / (d1 * d1 * d1) - r2x / (d2 * d2 * d2));
    const ey = charge * (r1y / (d1 * d1 * d1) - r2y / (d2 * d2 * d2));
    const m = Math.hypot(ex, ey) + 1e-6;
    return [ex / m, ey / m];
  }
  function retrace() {
    plus.position.set(-sep / 2, 0, 0);
    minus.position.set(sep / 2, 0, 0);
    for (let i = 0; i < LINES; i++) {
      const arr = traces[i].geometry.attributes.position.array;
      let ang = (i / LINES) * Math.PI * 2;
      let x = -sep / 2 + Math.cos(ang) * 0.3, y = Math.sin(ang) * 0.3;
      for (let s = 0; s < STEPS; s++) {
        arr[s * 3] = x; arr[s * 3 + 1] = y; arr[s * 3 + 2] = 0;
        const [dx, dy] = fieldAt(x, y);
        x += dx * 0.16; y += dy * 0.16;
        if (Math.hypot(x - sep / 2, y) < 0.24) {
          for (let r = s + 1; r < STEPS; r++) { arr[r * 3] = x; arr[r * 3 + 1] = y; arr[r * 3 + 2] = 0; }
          break;
        }
        if (Math.abs(x) > 5 || Math.abs(y) > 4) {
          for (let r = s + 1; r < STEPS; r++) { arr[r * 3] = x; arr[r * 3 + 1] = y; arr[r * 3 + 2] = 0; }
          break;
        }
      }
      traces[i].geometry.attributes.position.needsUpdate = true;
    }
  }
  retrace();
  return {
    tick(_t, dt) {
      for (const p of probes) {
        p.userData.s = (p.userData.s + dt * 0.25) % 1;
        const arr = traces[p.userData.line].geometry.attributes.position.array;
        const idx = Math.min(STEPS - 1, Math.floor(p.userData.s * STEPS)) * 3;
        p.position.set(arr[idx], arr[idx + 1], 0);
      }
    },
    set(key, v) { if (key === "sep") { sep = v; retrace(); } if (key === "q") { charge = v; retrace(); } },
    controls: [
      { key: "sep", label: "Charge separation", min: 0.6, max: 3, step: 0.1, value: sep },
      { key: "q", label: "Charge strength", min: 1, max: 5, step: 0.5, value: charge },
    ],
  };
});

/* Double slit: wavelength-colored fringes, I = cos²·sinc² envelope. */
register("double-slit", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const wallMat = new THREE.MeshStandardMaterial({ color: "#4a4438" });
  const top = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 1.6), wallMat);
  top.position.set(-1, 1.9, 0);
  const bot = top.clone(); bot.position.y = -1.9;
  const mid = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 1.6), wallMat);
  g.add(top, bot, mid);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.1, 5.4),
    new THREE.MeshStandardMaterial({ color: "#111318", roughness: 0.9 }));
  screen.position.set(3.2, 0, 0);
  screen.rotation.y = -Math.PI / 2;
  g.add(screen);
  const FR = 48;
  const fringeMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const fringes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.1, 1.7), fringeMat, FR);
  g.add(fringes);
  const dummy = new THREE.Group();
  let sep = 1.1, lambdaNm = 550;
  function lambdaColor(nm) {
    const x = Math.max(380, Math.min(700, nm));
    let r = 0, gg = 0, b = 0;
    if (x < 440) { r = (440 - x) / 60; b = 1; }
    else if (x < 490) { gg = (x - 440) / 50; b = 1; }
    else if (x < 510) { gg = 1; b = (510 - x) / 20; }
    else if (x < 580) { r = (x - 510) / 70; gg = 1; }
    else if (x < 645) { r = 1; gg = (645 - x) / 65; }
    else { r = 1; }
    return [r, gg, b];
  }
  const L = 4.2, slitW = 0.28;
  function repaint() {
    const lam = lambdaNm * 1e-3;
    const [r, gg, b] = lambdaColor(lambdaNm);
    fringeMat.color.setRGB(r, gg, b);
    mid.scale.y = Math.max(0.15, 1.1 - sep * 0.45);
    for (let i = 0; i < FR; i++) {
      const y = -2.6 + (5.2 * i) / (FR - 1);
      const th = Math.atan2(y, L);
      const beta = (Math.PI * slitW * Math.sin(th)) / lam;
      const alpha = (Math.PI * sep * Math.sin(th)) / lam;
      const sinc = Math.abs(beta) < 1e-4 ? 1 : Math.sin(beta) / beta;
      const I = Math.pow(Math.cos(alpha), 2) * sinc * sinc;
      dummy.position.set(3.14, y, 0);
      dummy.scale.set(1, Math.max(0.02, I), 1);
      dummy.updateMatrix();
      fringes.setMatrixAt(i, dummy.matrix);
    }
    fringes.instanceMatrix.needsUpdate = true;
  }
  repaint();
  return {
    tick() {},
    set(key, v) { if (key === "sep") sep = v; if (key === "lam") lambdaNm = v; repaint(); },
    controls: [
      { key: "sep", label: "Slit separation d", min: 0.4, max: 2.4, step: 0.1, value: sep },
      { key: "lam", label: "Wavelength (nm)", min: 400, max: 700, step: 10, value: lambdaNm },
    ],
  };
});

/* Titration lab: weak acid vs strong base, live pH curve, indicator shift. */
register("titration-lab", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const glass = new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.35 });
  const burette = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.2, 16), glass);
  burette.position.set(-1.6, 1.4, 0);
  const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.5, 1.1, 20), glass);
  flask.position.set(-1.6, -1.6, 0);
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.45, 0.5, 20),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.25 }));
  liquid.position.set(-1.6, -1.85, 0);
  g.add(burette, flask, liquid);
  // pH curve board
  const CN = 101;
  const curveGeo = new THREE.BufferGeometry();
  curveGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(CN * 3), 3));
  const curve = new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: "#34d399" }));
  curve.frustumCulled = false;
  g.add(curve);
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshStandardMaterial({ color: "#f5eddc", emissive: "#f5eddc", emissiveIntensity: 0.8 }));
  g.add(dot);
  const BX = 0.4, BW = 3.4, BY = -2.2, BH = 3.6;
  const frame = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(BX, BY, 0), new THREE.Vector3(BX + BW, BY, 0),
      new THREE.Vector3(BX + BW, BY + BH, 0), new THREE.Vector3(BX, BY + BH, 0),
      new THREE.Vector3(BX, BY, 0),
    ]),
    new THREE.LineBasicMaterial({ color: "#4a4438" }));
  g.add(frame);
  let pKa = 4.7, conc = 0.1, vol = 0, running = true;
  const V0 = 25, C0 = 0.1, CB = 0.1;
  function phAt(v) {
    const nA = C0 * V0 - CB * v;
    const nB = CB * v;
    if (nA > 0 && nB > 0.0001) return pKa + Math.log10(nB / nA);
    if (nA <= 0) {
      const excess = (-nA) / (V0 + v);
      return 14 + Math.log10(Math.max(1e-12, excess));
    }
    const h = Math.sqrt(Math.pow(10, -pKa) * conc);
    return -Math.log10(Math.max(1e-12, h));
  }
  function repaint() {
    const arr = curve.geometry.attributes.position.array;
    for (let i = 0; i < CN; i++) {
      const v = (50 * i) / (CN - 1);
      const ph = Math.max(0, Math.min(14, phAt(v)));
      arr[i * 3] = BX + (BW * i) / (CN - 1);
      arr[i * 3 + 1] = BY + (BH * ph) / 14;
      arr[i * 3 + 2] = 0;
    }
    curve.geometry.attributes.position.needsUpdate = true;
  }
  repaint();
  const acidC = { r: 0xf2 / 255, g: 0xa3 / 255, b: 0x3c / 255 };
  const baseC = { r: 0xc0 / 255, g: 0x84 / 255, b: 0xfc / 255 };
  return {
    tick(_t, dt) {
      if (running) vol = Math.min(50, vol + dt * 3);
      const ph = Math.max(0, Math.min(14, phAt(vol)));
      dot.position.set(BX + (BW * vol) / 50, BY + (BH * ph) / 14, 0.05);
      const f = Math.max(0, Math.min(1, (ph - (pKa - 1)) / 2));
      liquid.material.color.setRGB(
        acidC.r + (baseC.r - acidC.r) * f,
        acidC.g + (baseC.g - acidC.g) * f,
        acidC.b + (baseC.b - acidC.b) * f);
      liquid.position.y = -1.85 + vol * 0.004;
    },
    set(key, v) {
      if (key === "pka") { pKa = v; repaint(); }
      if (key === "conc") { conc = v; repaint(); }
      if (key === "run") running = !running;
      if (key === "reset") vol = 0;
    },
    controls: [
      { key: "pka", label: "Acid pKa", min: 3, max: 9, step: 0.1, value: pKa },
      { key: "conc", label: "Acid conc (M)", min: 0.02, max: 0.2, step: 0.01, value: conc },
      { key: "run", label: "Pause / resume drip", type: "button" },
      { key: "reset", label: "Reset burette", type: "button" },
    ],
  };
});

/* Secant-to-tangent: shrink h and watch the secant become the derivative. */
register("secant-tangent", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const f = (x) => x * x;
  const X0 = -2.6, X1 = 2.6, CN = 120;
  const curveGeo = new THREE.BufferGeometry();
  curveGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(CN * 3), 3));
  const curve = new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  curve.frustumCulled = false;
  g.add(curve);
  const secGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const secant = new THREE.Line(secGeo, new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  secant.frustumCulled = false;
  g.add(secant);
  const tanGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const tangent = new THREE.Line(tanGeo, new THREE.LineBasicMaterial({ color: "#34d399", transparent: true, opacity: 0.9 }));
  tangent.frustumCulled = false;
  g.add(tangent);
  const ptMat = new THREE.MeshStandardMaterial({ color: "#f5eddc", emissive: "#f5eddc", emissiveIntensity: 0.7 });
  const pA = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), ptMat);
  const pB = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), ptMat.clone());
  g.add(pA, pB);
  const Y = (x) => f(x) - 2.2;
  let a = 1, h = 1;
  function repaint() {
    const arr = curveGeo.attributes.position.array;
    for (let i = 0; i < CN; i++) {
      const x = X0 + ((X1 - X0) * i) / (CN - 1);
      arr[i * 3] = x; arr[i * 3 + 1] = Y(x); arr[i * 3 + 2] = 0;
    }
    curveGeo.attributes.position.needsUpdate = true;
    const ax = a, ay = f(a), bx = a + h, by = f(bx);
    pA.position.set(ax, Y(ax), 0);
    pB.position.set(bx, Y(bx), 0);
    const sp = secGeo.attributes.position.array;
    const ex = 3.2;
    const m = h === 0 ? 2 * a : (by - ay) / (bx - ax);
    sp[0] = ax - ex; sp[1] = Y(ax) - m * ex; sp[2] = 0;
    sp[3] = ax + ex; sp[4] = Y(ax) + m * ex; sp[5] = 0;
    secGeo.attributes.position.needsUpdate = true;
    const tp = tanGeo.attributes.position.array;
    const mt = 2 * a;
    tp[0] = ax - ex; tp[1] = Y(ax) - mt * ex; tp[2] = 0;
    tp[3] = ax + ex; tp[4] = Y(ax) + mt * ex; tp[5] = 0;
    tanGeo.attributes.position.needsUpdate = true;
  }
  repaint();
  return {
    tick() {},
    set(key, v) { if (key === "a") a = v; if (key === "h") h = v; repaint(); },
    controls: [
      { key: "a", label: "Point a", min: -2, max: 2, step: 0.1, value: a },
      { key: "h", label: "Secant gap h", min: 0.02, max: 2, step: 0.02, value: h },
    ],
  };
});
