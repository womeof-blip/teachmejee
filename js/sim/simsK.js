/* Extra 3D labs + studio models. Same contract as other packs. */

import { register } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "P-shm": "double-pendulum",
  "P-rotation": "gyroscope-precess",
  "P-gravitation": "kepler-system",
  "P-magnet": "lorentz-helix",
  "P-emi": "transformer-core",
  "P-waveoptics": "young-screen",
  "P-electro": "capacitor-field",
  "P-modern": "rutherford-scatter",
  "P-ktg": "brownian-gas",
  "C-atomic": "hydrogen-cloud",
  "C-solid": "crystal-fcc",
  "M-seq": "fibonacci-cone",
  "M-3dgeo": "tesseract-proj",
  "M-trig": "lissajous-3d",
};

function glass(THREE, color, opacity = 0.82) {
  return new THREE.MeshPhysicalMaterial({
    color, metalness: 0.18, roughness: 0.16, transparent: true, opacity,
    clearcoat: 1, clearcoatRoughness: 0.12,
  });
}

function std(THREE, color, emit = 0.25) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: emit });
}

register("double-pendulum", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), std(THREE, "#d8d2c4", 0.1));
  pivot.position.set(0, 2.2, 0);
  const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 8), std(THREE, "#9a9a93", 0));
  const r2 = r1.clone();
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), glass(THREE, "#69a7d8"));
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 18), glass(THREE, "#f2a33c"));
  g.add(pivot, r1, r2, b1, b2);
  let l1 = 1.2, l2 = 1.0, a1 = 1.8, a2 = 2.2, w1 = 0, w2 = 0, grav = 9.8;
  function place() {
    const x1 = l1 * Math.sin(a1), y1 = 2.2 - l1 * Math.cos(a1);
    const x2 = x1 + l2 * Math.sin(a2), y2 = y1 - l2 * Math.cos(a2);
    r1.position.set(x1 / 2, (2.2 + y1) / 2, 0);
    r1.scale.y = l1;
    r1.rotation.z = -a1;
    r2.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
    r2.scale.y = l2;
    r2.rotation.z = -a2;
    b1.position.set(x1, y1, 0);
    b2.position.set(x2, y2, 0);
  }
  place();
  return {
    tick(_t, dt) {
      const m1 = 1, m2 = 1;
      const den = 2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2);
      const a1a = (-grav * (2 * m1 + m2) * Math.sin(a1) - m2 * grav * Math.sin(a1 - 2 * a2)
        - 2 * Math.sin(a1 - a2) * m2 * (w2 * w2 * l2 + w1 * w1 * l1 * Math.cos(a1 - a2))) / (l1 * den);
      const a2a = (2 * Math.sin(a1 - a2) * (w1 * w1 * l1 * (m1 + m2) + grav * (m1 + m2) * Math.cos(a1)
        + w2 * w2 * l2 * m2 * Math.cos(a1 - a2))) / (l2 * den);
      w1 += a1a * dt; w2 += a2a * dt; a1 += w1 * dt; a2 += w2 * dt;
      place();
    },
    set(key, v) {
      if (key === "g") grav = v;
      if (key === "l") { l1 = v; l2 = v * 0.82; }
    },
    controls: [
      { key: "g", label: "g", min: 4, max: 16, step: 0.5, value: grav },
      { key: "l", label: "Length", min: 0.6, max: 1.8, step: 0.05, value: l1 },
    ],
  };
});

register("lissajous-3d", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 400;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), glass(THREE, "#f2a33c"));
  g.add(line, bead);
  let a = 3, b = 2, c = 5, d = 0.4;
  return {
    tick(t) {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const u = (i / (N - 1)) * Math.PI * 2;
        arr[i * 3] = 1.8 * Math.sin(a * u);
        arr[i * 3 + 1] = 1.8 * Math.sin(b * u + d);
        arr[i * 3 + 2] = 1.8 * Math.sin(c * u);
      }
      geo.attributes.position.needsUpdate = true;
      bead.position.set(1.8 * Math.sin(a * t), 1.8 * Math.sin(b * t + d), 1.8 * Math.sin(c * t));
    },
    set(key, v) { if (key === "a") a = v; if (key === "b") b = v; },
    controls: [
      { key: "a", label: "ωx", min: 1, max: 5, step: 1, value: a },
      { key: "b", label: "ωy", min: 1, max: 5, step: 1, value: b },
    ],
  };
});

register("bloch-sphere", ({ THREE, group, makeAxes }) => {
  const g = new THREE.Group();
  group.add(g);
  g.add(makeAxes(1.6, false));
  const sph = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 24), glass(THREE, "#69a7d8", 0.18));
  const ket = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), std(THREE, "#f2a33c", 0.8));
  g.add(sph, ket);
  let theta = 0.8, phi = 0.4;
  return {
    tick(t) {
      phi += 0.35;
      ket.position.set(1.4 * Math.sin(theta) * Math.cos(phi), 1.4 * Math.cos(theta), 1.4 * Math.sin(theta) * Math.sin(phi));
    },
    set(key, v) { if (key === "theta") theta = v; },
    controls: [{ key: "theta", label: "θ", min: 0.05, max: 3.1, step: 0.05, value: theta }],
  };
});

register("kepler-system", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), std(THREE, "#f2a33c", 1.2));
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), glass(THREE, "#69a7d8"));
  const N = 180;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const orbit = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: "#463922" }));
  g.add(sun, planet, orbit);
  let e = 0.35, a = 2.6;
  function ellipse() {
    const arr = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const th = (i / N) * Math.PI * 2;
      const r = a * (1 - e * e) / (1 + e * Math.cos(th));
      arr[i * 3] = r * Math.cos(th); arr[i * 3 + 1] = 0; arr[i * 3 + 2] = r * Math.sin(th);
    }
    geo.attributes.position.needsUpdate = true;
  }
  ellipse();
  return {
    tick(t) {
      const th = t * 0.55;
      const r = a * (1 - e * e) / (1 + e * Math.cos(th));
      planet.position.set(r * Math.cos(th), 0, r * Math.sin(th));
    },
    set(key, v) { if (key === "e") { e = v; ellipse(); } },
    controls: [{ key: "e", label: "Eccentricity", min: 0, max: 0.7, step: 0.05, value: e }],
  };
});

register("fourier-stack", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 160;
  const layers = [];
  for (let k = 0; k < 9; k++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: k ? "#69a7d8" : "#f2a33c" }));
    line.position.y = 1.6 - k * 0.38;
    g.add(line);
    layers.push(geo);
  }
  let terms = 5;
  return {
    tick(t) {
      for (let k = 0; k < 9; k++) {
        const arr = layers[k].attributes.position.array;
        for (let i = 0; i < N; i++) {
          const x = (i / (N - 1)) * 6 - 3;
          let y = 0;
          const nMax = k === 0 ? terms : Math.min(k, terms);
          for (let n = 1; n <= nMax; n += 2) y += Math.sin(n * (x + t)) / n;
          arr[i * 3] = x; arr[i * 3 + 1] = y * 0.45; arr[i * 3 + 2] = 0;
        }
        layers[k].attributes.position.needsUpdate = true;
      }
    },
    set(key, v) { if (key === "n") terms = v; },
    controls: [{ key: "n", label: "Harmonics", min: 1, max: 9, step: 2, value: terms }],
  };
});

register("platonic-family", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const geos = [
    new THREE.TetrahedronGeometry(1.4),
    new THREE.BoxGeometry(1.7, 1.7, 1.7),
    new THREE.OctahedronGeometry(1.5),
    new THREE.DodecahedronGeometry(1.4),
    new THREE.IcosahedronGeometry(1.4),
  ];
  const mesh = new THREE.Mesh(geos[3], glass(THREE, "#c8b795", 0.78));
  g.add(mesh);
  let kind = 3;
  return {
    tick(_t, dt) { mesh.rotation.y += dt * 0.4; mesh.rotation.x += dt * 0.15; },
    set(key, v) {
      if (key === "kind") {
        kind = Math.round(v);
        mesh.geometry = geos[kind];
      }
    },
    controls: [{ key: "kind", label: "Solid 0–4", min: 0, max: 4, step: 1, value: kind }],
  };
});

register("mobius-strip", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  let twist = 1;
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), glass(THREE, "#69a7d8", 0.7));
  g.add(mesh);
  function build() {
    const uN = 80, vN = 8;
    const pos = [];
    const idx = [];
    for (let i = 0; i <= uN; i++) {
      const u = (i / uN) * Math.PI * 2;
      for (let j = 0; j <= vN; j++) {
        const v = (j / vN - 0.5) * 0.7;
        const x = (1.6 + v * Math.cos(twist * u / 2)) * Math.cos(u);
        const y = v * Math.sin(twist * u / 2);
        const z = (1.6 + v * Math.cos(twist * u / 2)) * Math.sin(u);
        pos.push(x, y, z);
      }
    }
    for (let i = 0; i < uN; i++) {
      for (let j = 0; j < vN; j++) {
        const a = i * (vN + 1) + j;
        idx.push(a, a + 1, a + vN + 1, a + 1, a + vN + 2, a + vN + 1);
      }
    }
    mesh.geometry.dispose();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    mesh.geometry = geo;
  }
  build();
  return {
    tick(_t, dt) { g.rotation.y += dt * 0.25; },
    set(key, v) { if (key === "twist") { twist = v; build(); } },
    controls: [{ key: "twist", label: "Half-twists", min: 1, max: 3, step: 1, value: twist }],
  };
});

register("torus-knot-studio", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.32, 180, 24, 2, 3), glass(THREE, "#f2a33c"));
  g.add(mesh);
  let p = 2, q = 3;
  return {
    tick(_t, dt) { mesh.rotation.x += dt * 0.2; mesh.rotation.y += dt * 0.35; },
    set(key, v) {
      if (key === "p") p = Math.round(v);
      if (key === "q") q = Math.round(v);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.TorusKnotGeometry(1.15, 0.32, 180, 24, p, q);
    },
    controls: [
      { key: "p", label: "p", min: 2, max: 5, step: 1, value: p },
      { key: "q", label: "q", min: 3, max: 7, step: 1, value: q },
    ],
  };
});

register("lorentz-helix", ({ THREE, group, makeTrail }) => {
  const g = new THREE.Group();
  group.add(g);
  const trail = makeTrail("#69a7d8", 240);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), std(THREE, "#f2a33c", 0.8));
  g.add(trail.line, p);
  let B = 1.2, pos = { x: 1.2, y: 0, z: 0 }, vel = { x: 0, y: 1.4, z: 0.8 };
  return {
    tick(_t, dt) {
      const q = 1, m = 1;
      const ax = (q / m) * (vel.y * 0 - vel.z * 0);
      const ay = (q / m) * (vel.z * B - vel.x * 0);
      const az = (q / m) * (vel.x * 0 - vel.y * B);
      vel.x += ax * dt; vel.y += ay * dt; vel.z += az * dt;
      pos.x += vel.x * dt; pos.y += vel.y * dt; pos.z += vel.z * dt;
      if (pos.y > 3) { pos.y = -3; trail.clear(); }
      p.position.set(pos.x, pos.y, pos.z);
      trail.push(p.position);
    },
    set(key, v) { if (key === "B") B = v; },
    controls: [{ key: "B", label: "B", min: 0.4, max: 3, step: 0.1, value: B }],
  };
});

register("coupled-springs", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.6), std(THREE, "#3a2f1e", 0));
  wall.position.set(-3, 0, 0);
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.5), glass(THREE, "#69a7d8"));
  const m2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.5), glass(THREE, "#f2a33c"));
  g.add(wall, m1, m2);
  let x1 = -1.2, x2 = 1.1, v1 = 0, v2 = 0, k = 1.4;
  return {
    tick(_t, dt) {
      const a1 = (-k * (x1 + 1.2) + k * ((x2 - x1) - 2.3));
      const a2 = (-k * ((x2 - x1) - 2.3) - k * (x2 - 1.1));
      v1 += a1 * dt; v2 += a2 * dt; x1 += v1 * dt; x2 += v2 * dt;
      m1.position.set(x1, 0, 0); m2.position.set(x2, 0, 0);
    },
    set(key, v) { if (key === "k") k = v; },
    controls: [{ key: "k", label: "k", min: 0.4, max: 3, step: 0.1, value: k }],
  };
});

register("brownian-gas", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4, 3, 3)), new THREE.LineBasicMaterial({ color: "#463922" }));
  g.add(box);
  const pts = [];
  for (let i = 0; i < 48; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), std(THREE, i ? "#c8b795" : "#f2a33c", 0.4));
    m.position.set((Math.random() - 0.5) * 3.6, (Math.random() - 0.5) * 2.6, (Math.random() - 0.5) * 2.6);
    m.userData.v = { x: (Math.random() - 0.5), y: (Math.random() - 0.5), z: (Math.random() - 0.5) };
    g.add(m); pts.push(m);
  }
  let T = 1.2;
  return {
    tick(_t, dt) {
      for (const p of pts) {
        p.userData.v.x += (Math.random() - 0.5) * T * dt * 4;
        p.userData.v.y += (Math.random() - 0.5) * T * dt * 4;
        p.userData.v.z += (Math.random() - 0.5) * T * dt * 4;
        p.position.x += p.userData.v.x * dt;
        p.position.y += p.userData.v.y * dt;
        p.position.z += p.userData.v.z * dt;
        ["x", "y", "z"].forEach((ax, i) => {
          const lim = [1.9, 1.4, 1.4][i];
          if (Math.abs(p.position[ax]) > lim) { p.position[ax] = Math.sign(p.position[ax]) * lim; p.userData.v[ax] *= -1; }
        });
      }
    },
    set(key, v) { if (key === "T") T = v; },
    controls: [{ key: "T", label: "Temperature", min: 0.4, max: 3, step: 0.1, value: T }],
  };
});

register("hydrogen-cloud", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const dots = [];
  const geo = new THREE.SphereGeometry(0.035, 6, 6);
  for (let i = 0; i < 280; i++) {
    const m = new THREE.Mesh(geo, std(THREE, "#69a7d8", 0.5));
    g.add(m); dots.push(m);
  }
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), std(THREE, "#f2a33c", 1));
  g.add(nuc);
  let n = 2;
  function scatter() {
    for (let i = 0; i < dots.length; i++) {
      const u = Math.random() * 0.999;
      const th = Math.acos(2 * Math.random() - 1);
      const ph = Math.random() * Math.PI * 2;
      const r = n * 0.7 * Math.pow(-Math.log(1 - u), 0.45);
      dots[i].position.set(r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), r * Math.sin(th) * Math.sin(ph));
    }
  }
  scatter();
  return {
    tick() {},
    set(key, v) { if (key === "n") { n = v; scatter(); } },
    controls: [{ key: "n", label: "n (shell)", min: 1, max: 4, step: 1, value: n }],
  };
});

register("bragg-lattice", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const atoms = [];
  const geo = new THREE.SphereGeometry(0.12, 10, 10);
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (let k = 0; k < 3; k++) {
    const m = new THREE.Mesh(geo, std(THREE, k ? "#69a7d8" : "#f2a33c", 0.3));
    g.add(m); atoms.push({ m, i, j, k });
  }
  let d = 0.9;
  const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5, 8), std(THREE, "#e86f52", 0.6));
  ray.rotation.z = Math.PI / 2;
  g.add(ray);
  return {
    tick(t) {
      atoms.forEach((a) => a.m.position.set(a.i * d, a.k * d - d, a.j * d));
      ray.position.set(0, Math.sin(t) * 0.4, 0);
      ray.scale.y = 1;
    },
    set(key, v) { if (key === "d") d = v; },
    controls: [{ key: "d", label: "d spacing", min: 0.4, max: 1.6, step: 0.1, value: d }],
  };
});

register("atwood-machine", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pul = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 10, 24), std(THREE, "#c8b795", 0.1));
  pul.rotation.y = Math.PI / 2;
  pul.position.y = 1.8;
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), glass(THREE, "#69a7d8"));
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), glass(THREE, "#f2a33c"));
  g.add(pul, a, b);
  let m2 = 1.4, y = 0;
  return {
    tick(_t, dt) {
      const acc = (m2 - 1) / (m2 + 1) * 2.4;
      y += acc * dt;
      if (Math.abs(y) > 1.2) y = -Math.sign(y) * 1.2;
      a.position.set(-0.45, 0.6 - y, 0);
      b.position.set(0.45, 0.6 + y, 0);
      pul.rotation.z += acc * dt;
    },
    set(key, v) { if (key === "m2") m2 = v; },
    controls: [{ key: "m2", label: "m₂ / m₁", min: 0.6, max: 2.4, step: 0.1, value: m2 }],
  };
});

register("transformer-core", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const core = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.28, 12, 32), std(THREE, "#3a2f1e", 0));
  core.rotation.x = Math.PI / 2;
  g.add(core);
  const coils = [];
  for (let s = -1; s <= 1; s += 2) {
    for (let i = 0; i < 10; i++) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 16), std(THREE, s < 0 ? "#69a7d8" : "#f2a33c", 0.4));
      c.position.set(s * 1.05, 0, (i - 4.5) * 0.09);
      g.add(c); coils.push(c);
    }
  }
  let ratio = 1;
  return {
    tick(t) {
      coils.forEach((c, i) => { c.scale.setScalar(1 + 0.08 * Math.sin(t * 6 + i * 0.2) * (i < 10 ? 1 : ratio)); });
    },
    set(key, v) { if (key === "ratio") ratio = v; },
    controls: [{ key: "ratio", label: "N₂/N₁", min: 0.4, max: 3, step: 0.1, value: ratio }],
  };
});

register("helmholtz-pair", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const c1 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 10, 40), std(THREE, "#69a7d8", 0.4));
  const c2 = c1.clone();
  g.add(c1, c2);
  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), std(THREE, "#f2a33c", 0.9));
  g.add(probe);
  let sep = 1.2;
  return {
    tick(t) {
      c1.position.z = -sep / 2; c2.position.z = sep / 2;
      probe.position.set(0, 0.2 * Math.sin(t * 2), 0);
    },
    set(key, v) { if (key === "sep") sep = v; },
    controls: [{ key: "sep", label: "Coil gap", min: 0.6, max: 2.4, step: 0.1, value: sep }],
  };
});

register("chladni-plate", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6, 40, 40), new THREE.MeshStandardMaterial({ color: "#241c12", wireframe: true }));
  plate.rotation.x = -Math.PI / 2;
  g.add(plate);
  let n = 3, m = 2;
  return {
    tick(t) {
      const pos = plate.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        const z = 0.18 * Math.sin(n * (x + 1.8)) * Math.sin(m * (y + 1.8)) * Math.sin(t * 3);
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    },
    set(key, v) { if (key === "n") n = v; if (key === "m") m = v; },
    controls: [
      { key: "n", label: "n", min: 1, max: 6, step: 1, value: n },
      { key: "m", label: "m", min: 1, max: 6, step: 1, value: m },
    ],
  };
});

register("fibonacci-cone", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const dots = [];
  const geo = new THREE.SphereGeometry(0.06, 8, 8);
  for (let i = 0; i < 200; i++) {
    const m = new THREE.Mesh(geo, std(THREE, i % 2 ? "#f2a33c" : "#69a7d8", 0.4));
    g.add(m); dots.push(m);
  }
  let n = 120;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return {
    tick(_t, dt) {
      g.rotation.y += dt * 0.2;
      for (let i = 0; i < dots.length; i++) {
        dots[i].visible = i < n;
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y) * 1.6;
        const th = i * golden;
        dots[i].position.set(Math.cos(th) * r, y * 1.6, Math.sin(th) * r);
      }
    },
    set(key, v) { if (key === "n") n = v; },
    controls: [{ key: "n", label: "Seeds", min: 40, max: 200, step: 10, value: n }],
  };
});

register("tesseract-proj", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const verts4 = [];
  for (let i = 0; i < 16; i++) {
    verts4.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
  }
  const balls = verts4.map(() => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), std(THREE, "#f2a33c", 0.5));
    g.add(m); return m;
  });
  const lines = [];
  for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
    let d = 0;
    for (let k = 0; k < 4; k++) d += verts4[i][k] === verts4[j][k] ? 0 : 1;
    if (d === 1) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(6), 3));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#c8b795" }));
      g.add(line); lines.push([i, j, geo]);
    }
  }
  let spin = 0.6;
  return {
    tick(t) {
      const a = t * spin;
      const pts = verts4.map(([x, y, z, w]) => {
        const x1 = x * Math.cos(a) - w * Math.sin(a);
        const w1 = x * Math.sin(a) + w * Math.cos(a);
        const k = 2 / (3 - w1);
        return [x1 * k, y * k, z * k];
      });
      balls.forEach((b, i) => b.position.set(...pts[i]));
      lines.forEach(([i, j, geo]) => {
        const arr = geo.attributes.position.array;
        arr.set(pts[i], 0); arr.set(pts[j], 3);
        geo.attributes.position.needsUpdate = true;
      });
    },
    set(key, v) { if (key === "spin") spin = v; },
    controls: [{ key: "spin", label: "4D spin", min: 0.2, max: 2, step: 0.1, value: spin }],
  };
});

register("magnetic-bottle", ({ THREE, group, makeTrail }) => {
  const g = new THREE.Group();
  group.add(g);
  const c1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.07, 8, 24), std(THREE, "#69a7d8", 0.4));
  const c2 = c1.clone();
  c1.position.y = 1.6; c2.position.y = -1.6;
  g.add(c1, c2);
  const trail = makeTrail("#f2a33c", 180);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), std(THREE, "#f2a33c", 0.8));
  g.add(trail.line, p);
  let B = 1.2, y = 0, vy = 1.4, r = 0.55, ph = 0;
  return {
    tick(_t, dt) {
      const Bz = B * (1.2 + Math.pow(y / 1.5, 2));
      ph += Bz * dt * 4;
      vy += -y * 0.8 * dt;
      y += vy * dt;
      if (Math.abs(y) > 1.7) vy *= -1;
      p.position.set(r * Math.cos(ph), y, r * Math.sin(ph));
      trail.push(p.position);
    },
    set(key, v) { if (key === "B") B = v; },
    controls: [{ key: "B", label: "B", min: 0.5, max: 3, step: 0.1, value: B }],
  };
});

register("rutherford-scatter", ({ THREE, group, makeTrail }) => {
  const g = new THREE.Group();
  group.add(g);
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), std(THREE, "#f2a33c", 1));
  g.add(nuc);
  const trail = makeTrail("#69a7d8", 160);
  const a = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), std(THREE, "#e86f52", 0.7));
  g.add(trail.line, a);
  let b = 0.8, x = -4, y = 0.8, vx = 3.2, vy = 0;
  function reset() { x = -4; y = b; vx = 3.2; vy = 0; trail.clear(); }
  reset();
  return {
    tick(_t, dt) {
      const r2 = x * x + y * y + 0.05;
      const f = 2.2 / r2;
      vx += f * (x / Math.sqrt(r2)) * dt;
      vy += f * (y / Math.sqrt(r2)) * dt;
      x += vx * dt; y += vy * dt;
      if (x > 4 || Math.abs(y) > 4) reset();
      a.position.set(x, y, 0);
      trail.push(a.position);
    },
    set(key, v) { if (key === "b") { b = v; reset(); } },
    controls: [{ key: "b", label: "Impact param", min: 0.2, max: 2, step: 0.1, value: b }],
  };
});

register("catenary-arch", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 60;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#f2a33c" }));
  g.add(line);
  let a = 0.9;
  return {
    tick() {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * 4 - 2;
        arr[i * 3] = x;
        arr[i * 3 + 1] = a * Math.cosh(x / a) - a * Math.cosh(2 / a) + 1.6;
        arr[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
    },
    set(key, v) { if (key === "a") a = v; },
    controls: [{ key: "a", label: "a", min: 0.4, max: 2, step: 0.1, value: a }],
  };
});

register("geodesic-dome", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), new THREE.MeshStandardMaterial({ color: "#69a7d8", wireframe: true }));
  g.add(mesh);
  let freq = 1;
  return {
    tick(_t, dt) { mesh.rotation.y += dt * 0.25; },
    set(key, v) {
      freq = Math.round(v);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.IcosahedronGeometry(1.6, freq);
    },
    controls: [{ key: "freq", label: "Frequency", min: 1, max: 4, step: 1, value: freq }],
  };
});

register("quantum-well-3d", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const well = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1.4), std(THREE, "#3a2f1e", 0));
  well.position.y = -1.1;
  const walls = [-1.6, 1.6].map((x) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 1.4), std(THREE, "#463922", 0));
    w.position.set(x, 0.1, 0); g.add(w); return w;
  });
  g.add(well);
  const N = 80;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  const psi = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#69a7d8" }));
  g.add(psi);
  let n = 2;
  return {
    tick(t) {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * 3 - 1.5;
        const y = Math.sin(n * Math.PI * (x + 1.5) / 3) * Math.cos(t * n);
        arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = 0;
      }
      geo.attributes.position.needsUpdate = true;
    },
    set(key, v) { if (key === "n") n = v; },
    controls: [{ key: "n", label: "n", min: 1, max: 5, step: 1, value: n }],
  };
});

register("millikan-drop", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const plates = [-1.2, 1.2].map((y) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 2), std(THREE, "#c8b795", 0.1));
    p.position.y = y; g.add(p); return p;
  });
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), glass(THREE, "#f2a33c"));
  g.add(drop);
  let E = 1.2, y = 0, v = 0;
  return {
    tick(_t, dt) {
      const q = 1, m = 1, gacc = 1.6;
      const a = (q * E - m * gacc) / m - 1.8 * v;
      v += a * dt; y += v * dt;
      if (Math.abs(y) > 1) { y = Math.sign(y) * 1; v = 0; }
      drop.position.y = y;
    },
    set(key, v0) { if (key === "E") E = v0; },
    controls: [{ key: "E", label: "E field", min: 0.2, max: 3, step: 0.1, value: E }],
  };
});

register("dna-supercoil", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 140;
  const geoA = new THREE.BufferGeometry();
  const geoB = new THREE.BufferGeometry();
  geoA.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  geoB.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  g.add(new THREE.Line(geoA, new THREE.LineBasicMaterial({ color: "#69a7d8" })));
  g.add(new THREE.Line(geoB, new THREE.LineBasicMaterial({ color: "#e86f52" })));
  let twist = 8;
  return {
    tick(t) {
      const a = geoA.attributes.position.array, b = geoB.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const u = i / (N - 1);
        const y = u * 4 - 2;
        const ph = u * twist * Math.PI * 2 + t * 0.4;
        a[i * 3] = Math.cos(ph) * 0.55; a[i * 3 + 1] = y; a[i * 3 + 2] = Math.sin(ph) * 0.55;
        b[i * 3] = Math.cos(ph + Math.PI) * 0.55; b[i * 3 + 1] = y; b[i * 3 + 2] = Math.sin(ph + Math.PI) * 0.55;
      }
      geoA.attributes.position.needsUpdate = true;
      geoB.attributes.position.needsUpdate = true;
      g.rotation.y += 0.003;
    },
    set(key, v) { if (key === "twist") twist = v; },
    controls: [{ key: "twist", label: "Turns", min: 4, max: 14, step: 1, value: twist }],
  };
});

register("crystal-fcc", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pts = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
    [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5], [0.5, 0.5, 1], [0.5, 1, 0.5], [1, 0.5, 0.5]];
  const atoms = pts.map((p, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), glass(THREE, i < 8 ? "#c8b795" : "#69a7d8"));
    g.add(m); return { m, p };
  });
  let a = 1.1;
  return {
    tick(_t, dt) {
      g.rotation.y += dt * 0.25;
      atoms.forEach(({ m, p }) => m.position.set((p[0] - 0.5) * a * 2, (p[1] - 0.5) * a * 2, (p[2] - 0.5) * a * 2));
    },
    set(key, v) { if (key === "a") a = v; },
    controls: [{ key: "a", label: "a", min: 0.6, max: 1.6, step: 0.1, value: a }],
  };
});

register("crystal-bcc", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const pts = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [0.5, 0.5, 0.5]];
  const atoms = pts.map((p, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(i === 8 ? 0.2 : 0.15, 12, 12), glass(THREE, i === 8 ? "#f2a33c" : "#c8b795"));
    g.add(m); return { m, p };
  });
  let a = 1.1;
  return {
    tick(_t, dt) {
      g.rotation.y += dt * 0.25;
      atoms.forEach(({ m, p }) => m.position.set((p[0] - 0.5) * a * 2, (p[1] - 0.5) * a * 2, (p[2] - 0.5) * a * 2));
    },
    set(key, v) { if (key === "a") a = v; },
    controls: [{ key: "a", label: "a", min: 0.6, max: 1.6, step: 0.1, value: a }],
  };
});

register("young-screen", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 3.2, 1, 64), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  const cols = new Float32Array(65 * 2 * 3);
  screen.geometry.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  screen.position.x = 2.4;
  g.add(screen);
  const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), std(THREE, "#f2a33c", 0.8));
  const s2 = s1.clone();
  s1.position.set(-2.2, 0.25, 0); s2.position.set(-2.2, -0.25, 0);
  g.add(s1, s2);
  let d = 0.7;
  return {
    tick() {
      s1.position.y = d / 2; s2.position.y = -d / 2;
      const attr = screen.geometry.attributes.color;
      for (let i = 0; i < 65; i++) {
        const y = (i / 64) * 3.2 - 1.6;
        const I = Math.cos((Math.PI * d * y) / 1.2) ** 2;
        attr.setXYZ(i, I, I * 0.85, 0.3);
        attr.setXYZ(i + 65, I, I * 0.85, 0.3);
      }
      attr.needsUpdate = true;
    },
    set(key, v) { if (key === "d") d = v; },
    controls: [{ key: "d", label: "Slit sep", min: 0.3, max: 1.8, step: 0.1, value: d }],
  };
});

register("capacitor-field", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.6), std(THREE, "#69a7d8", 0.2));
  const p2 = p1.clone();
  g.add(p1, p2);
  const arrows = [];
  for (let i = 0; i < 12; i++) {
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), std(THREE, "#f2a33c", 0.5));
    g.add(a); arrows.push(a);
  }
  let gap = 0.9;
  return {
    tick() {
      p1.position.y = gap / 2; p2.position.y = -gap / 2;
      arrows.forEach((a, i) => {
        a.position.set(((i % 4) - 1.5) * 0.55, 0, (Math.floor(i / 4) - 1) * 0.45);
        a.scale.y = gap;
      });
    },
    set(key, v) { if (key === "gap") gap = v; },
    controls: [{ key: "gap", label: "Gap", min: 0.3, max: 1.8, step: 0.1, value: gap }],
  };
});

register("gyroscope-precess", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 10, 32), glass(THREE, "#c8b795"));
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), std(THREE, "#9a9a93", 0));
  axle.rotation.z = Math.PI / 2;
  const hold = new THREE.Group();
  hold.add(rotor, axle);
  hold.position.y = 0.4;
  g.add(hold);
  let spin = 3;
  return {
    tick(t) {
      rotor.rotation.x += 0.25 * spin;
      hold.rotation.y = t * (0.4 + 1 / spin);
      hold.rotation.z = 0.25;
    },
    set(key, v) { if (key === "spin") spin = v; },
    controls: [{ key: "spin", label: "Spin", min: 1, max: 6, step: 0.2, value: spin }],
  };
});

register("golden-spiral", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const N = 200;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
  g.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#f2a33c" })));
  let turns = 4;
  return {
    tick() {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const t = (i / (N - 1)) * turns * Math.PI * 2;
        const r = 0.12 * Math.exp(0.306 * t);
        arr[i * 3] = r * Math.cos(t); arr[i * 3 + 1] = r * Math.sin(t); arr[i * 3 + 2] = t * 0.04 - 0.6;
      }
      geo.attributes.position.needsUpdate = true;
    },
    set(key, v) { if (key === "turns") turns = v; },
    controls: [{ key: "turns", label: "Turns", min: 2, max: 8, step: 1, value: turns }],
  };
});

register("studio-knot", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.05, 0.34, 220, 28, 2, 5), glass(THREE, "#e8e4d9", 0.9));
  g.add(mesh);
  let p = 2;
  return {
    tick(_t, dt) { mesh.rotation.x += dt * 0.18; mesh.rotation.y += dt * 0.28; },
    set(key, v) {
      p = Math.round(v);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.TorusKnotGeometry(1.05, 0.34, 220, 28, p, 5);
    },
    controls: [{ key: "p", label: "p", min: 2, max: 5, step: 1, value: p }],
  };
});

register("studio-orb", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), glass(THREE, "#69a7d8"));
  g.add(core);
  const shells = [];
  let n = 18;
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), glass(THREE, "#f2a33c", 0.85));
    g.add(m); shells.push(m);
  }
  return {
    tick(t) {
      core.rotation.y = t * 0.3;
      for (let i = 0; i < shells.length; i++) {
        shells[i].visible = i < n;
        const u = i / Math.max(n, 1) * Math.PI * 2;
        shells[i].position.set(Math.cos(u + t) * 1.6, Math.sin(u * 1.7) * 0.6, Math.sin(u + t) * 1.6);
      }
    },
    set(key, v) { if (key === "n") n = v; },
    controls: [{ key: "n", label: "Orbits", min: 8, max: 40, step: 2, value: n }],
  };
});

register("studio-atom", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), glass(THREE, "#f2a33c"));
  g.add(nuc);
  const els = [];
  for (let i = 0; i < 12; i++) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), std(THREE, "#69a7d8", 0.8));
    g.add(e); els.push(e);
  }
  let n = 3;
  return {
    tick(t) {
      els.forEach((e, i) => {
        e.visible = i < n * 2;
        const ring = Math.floor(i / 2) + 1;
        const ph = t * (1.2 / ring) + i;
        e.position.set(Math.cos(ph) * ring * 0.7, Math.sin(ph * 0.4) * 0.2, Math.sin(ph) * ring * 0.7);
      });
    },
    set(key, v) { if (key === "n") n = v; },
    controls: [{ key: "n", label: "Shells", min: 1, max: 5, step: 1, value: n }],
  };
});

register("studio-helix", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const beads = [];
  for (let i = 0; i < 48; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), glass(THREE, i % 2 ? "#69a7d8" : "#e8e4d9"));
    g.add(m); beads.push(m);
  }
  let turns = 8;
  return {
    tick(t) {
      g.rotation.y = t * 0.2;
      beads.forEach((m, i) => {
        const u = i / beads.length * turns * Math.PI * 2;
        m.position.set(Math.cos(u) * 0.9, i / beads.length * 3.2 - 1.6, Math.sin(u) * 0.9);
      });
    },
    set(key, v) { if (key === "turns") turns = v; },
    controls: [{ key: "turns", label: "Turns", min: 4, max: 16, step: 1, value: turns }],
  };
});

register("studio-city", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const blocks = [];
  for (let i = 0; i < 48; i++) {
    const h = 0.3 + (i % 7) * 0.22;
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.28, h, 0.28), glass(THREE, i % 3 ? "#c8b795" : "#69a7d8", 0.75));
    g.add(m); blocks.push({ m, h });
  }
  let n = 24;
  return {
    tick(t) {
      g.rotation.y = t * 0.12;
      blocks.forEach((b, i) => {
        b.m.visible = i < n;
        const col = i % 8, row = Math.floor(i / 8);
        b.m.position.set((col - 3.5) * 0.42, b.h / 2 + Math.sin(t + i) * 0.04, (row - 2.5) * 0.42);
      });
    },
    set(key, v) { if (key === "n") n = v; },
    controls: [{ key: "n", label: "Blocks", min: 12, max: 48, step: 4, value: n }],
  };
});
