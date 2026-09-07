/* TeachMeJEE — simulation pack I: bespoke 3D labs for every PCM chapter.
   One dedicated lab per chapter so the Atlas + chapter pages play a real
   simulation instead of a generic fallback. Contract matches simsBio:
   factory(ctx) -> { tick(t,dt), controls[], set(key,val) }.
   Range controls omit `type` so Atlas variants apply (variantForControls). */

import { register, makeTextSprite, makeArrow } from "./engine.js";

export const SIM_FOR_CONCEPT = {
  "f-arithmetic": "ratio-scale",
  "f-geometry": "angle-tracer",
  "f-mensuration": "volume-morph",
  "f-stats": "histo-lab",
  "f-motion": "speed-timer",
  "f-atoms": "reaction-balancer",
  "f-periodic": "trend-drift",
  "M-quad": "parabola-walk",
  "M-seq": "sequence-stars",
  "M-trig": "sine-circle",
  "M-perm": "slot-tree",
  "M-binomial": "pascal-triangle",
  "M-circles": "circle-family",
  "M-conics": "conic-sweep",
  "M-limits": "limit-climb",
  "M-stats": "box-whisker",
  "M-defint": "reimann-slices",
  "M-diffeq": "slope-flow",
  "M-3dgeo": "solid-spin",
  "M-vectors": "vector-field",
  "M-prob": "urn-draw",
  "M-integ": "area-sweep",
  "M-complex": "complex-rotate",
  "P-units": "dimension-checks",
  "P-kinematics": "motion-graphs",
  "P-laws": "force-bleed",
  "P-wpe": "work-machines",
  "P-rotation": "gyro-spin",
  "P-gravitation": "orbit-prop",
  "P-shm": "phase-circle",
  "P-com": "com-balance",
  "P-fluids": "pressure-tower",
  "P-thermal": "expand-rod",
  "P-thermo": "cycle-pv",
  "P-ktg": "speed-dist",
  "P-waves": "wave-superpose",
  "P-electro": "field-line",
  "P-current": "ohm-walk",
  "P-magnet": "field-coil",
  "P-emi": "flux-coil",
  "P-ac": "phasor-plot",
  "P-emw": "em-wave",
  "P-rayoptics": "ray-mirror",
  "P-waveoptics": "interfere-fringe",
  "P-dual": "photoelectric-plot",
  "P-atoms": "spectrum-ladder",
  "P-semi": "diode-curve",
  "C-bonding": "lewis-orbit",
  "C-gas": "boyle-chamber",
  "C-thermo": "enthalpy-shot",
  "C-equil": "shift-balance",
  "C-ionic": "ph-titration",
  "C-redox": "cell-stack",
  "C-atomic": "orbital-shell",
};

/* ---- tiny shared helpers ---- */

function sprint(t, a, b) {
  const p = (Math.sin(t) + 1) / 2;
  return a + (b - a) * p;
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function PLine(THREE, color = "#f2a33c", max = 300) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(max * 3), 3));
  geo.setDrawRange(0, 0);
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 }));
  line.frustumCulled = false;
  const pts = [];
  return {
    line,
    push(v3) { pts.push(v3.clone()); if (pts.length > max) pts.shift();
      const a = line.geometry.attributes.position.array; pts.forEach((p, i) => a.set([p.x, p.y, p.z], i * 3));
      line.geometry.attributes.position.needsUpdate = true; line.geometry.setDrawRange(0, pts.length); },
  };
}

function Sweep(THREE, color = "#60a5fa", max = 400) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(max * 3), 3));
  geo.setDrawRange(0, 0);
  const pts = [];
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 }));
  line.frustumCulled = false;
  return {
    line, pts,
    push(v) { pts.push(v.clone()); if (pts.length > max) pts.shift();
      const a = line.geometry.attributes.position.array; pts.forEach((p, i) => a.set([p.x, p.y, p.z], i * 3));
      line.geometry.attributes.position.needsUpdate = true; line.geometry.setDrawRange(0, pts.length); },
  };
}

function blob(THREE, p, color, r = 0.12, emi = 0.45) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: emi }));
  m.position.copy(p); return m;
}

/* concisely reuse common materials */
const MT = (THREE, c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35 });

/* ================= foundation ================= */

register("ratio-scale", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const rods = [[-1.2, "#f87171"], [1.2, "#4ade80"]].map(([x, c]) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1, 0.18), MT(THREE, c));
    r.position.set(x, 0.5, 0); g.add(r); return r;
  });
  const lab = makeTextSprite("a : b", { size: 0.5, color: "#d7dae0" });
  lab.position.set(0, 2.7, 0); g.add(lab);
  let a = 3, b = 2;
  function paint() {
    rods[0].scale.y = a; rods[0].position.y = a / 2;
    rods[1].scale.y = b; rods[1].position.y = b / 2;
  }
  paint();
  return {
    tick() {},
    set(key, v) { if (key === "a") a = v; if (key === "b") b = v; paint(); },
    controls: [
      { key: "a", label: "Ratio a", min: 1, max: 9, step: 1, value: a },
      { key: "b", label: "Ratio b", min: 1, max: 9, step: 1, value: b },
    ],
  };
});

register("angle-tracer", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const verts = [new THREE.Vector3(-2, -0.8, 0), new THREE.Vector3(2, -0.8, 0), new THREE.Vector3(0, 1.9, 0)];
  const balls = verts.map(p => { const m = blob(THREE, p, "#fb923c", 0.14); g.add(m); return m; });
  const edgeG = new THREE.BufferGeometry();
  const edge = new THREE.Line(edgeG, new THREE.LineBasicMaterial({ color: "#60a5fa" }));
  g.add(edge);
  const sumLab = makeTextSprite("α + β + γ = 180°", { size: 0.55, color: "#d7dae0" });
  sumLab.position.set(0, -1.9, 0); g.add(sumLab);
  return {
    tick() {
      const a = verts[2].x, b = verts[2].y;
      edgeG.setAttribute("position", new THREE.Float32BufferAttribute(
        [-2, -0.8, 0, 2, -0.8, 0, a, b, 0, -2, -0.8, 0], 3));
      balls.forEach((m, i) => m.position.copy(verts[i]));
    },
    set(key, v) {
      const k = Math.round(v);
      if (key === "shape") verts[2].set(0, k === 0 ? 1.9 : k === 1 ? 3.4 : 0.9, 0);
    },
    controls: [{ key: "shape", label: "Triangle (0:normal, 1:tall, 2:flat)", type: "select", options: [0, 1, 2], value: 0 }],
  };
});

register("volume-morph", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const mat = MT(THREE, "#f2a33c");
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
  g.add(box);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 24), mat);
  cyl.visible = false; g.add(cyl);
  const sph = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), mat);
  sph.visible = false; g.add(sph);
  let f = 0, h = 2;
  return {
    tick(_t, dt) {
      const v = 1 + 0.4 * Math.sin(h * 2);
      box.scale.set(v, v, v);
    },
    set(key, v) {
      if (key === "shape") { const k = Math.round(v);
        box.visible = k === 0; cyl.visible = k === 1; sph.visible = k === 2; }
      if (key === "scale") { h = v; }
    },
    controls: [
      { key: "shape", label: "Shape (0:cube, 1:cyl, 2:sphere)", type: "select", options: [0, 1, 2], value: 0 },
      { key: "scale", label: "Scale", min: 1, max: 3, step: 0.1, value: h },
    ],
  };
});

register("histo-lab", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const colors = ["#60a5fa", "#4ade80", "#f2a33c", "#f87171", "#c678dd", "#7dd3fc", "#8fbf6f", "#fbbf24"];
  const bars = [];
  for (let i = 0; i < 8; i++) {
    const c = colors[i];
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1, 0.32), MT(THREE, c));
    m.position.set((i - 3.5) * 0.5, 0.5, 0); g.add(m); bars.push(m);
  }
  let sigma = 3;
  let seed = 1;
  return {
    tick() {},
    set(key, v) {
      if (key === "spread") sigma = v;
      if (key === "seed") seed = v;
      bars.forEach((b, i) => { b.scale.y = 0.5 + ((seed * 13 + i * 17) % 10) * 0.15 * sigma; b.position.y = b.scale.y / 2; });
    },
    controls: [
      { key: "spread", label: "Spread", min: 1, max: 8, step: 1, value: sigma },
      { key: "seed", label: "Data seed", min: 1, max: 20, step: 1, value: seed },
    ],
  };
});

register("speed-timer", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), MT(THREE, "#f87171"));
  ball.position.set(-2.8, 0, 0); g.add(ball);
  const track = PLine(THREE, "#60a5fa", 120);
  g.add(track.line);
  let v = 2.2;
  return {
    tick(_t, dt) {
      ball.position.x += dt * v;
      if (ball.position.x > 2.8) ball.position.x = -2.8;
      track.push(ball.position.clone());
    },
    set(key, vv) { if (key === "speed") v = vv; },
    controls: [{ key: "speed", label: "Speed (units/s)", min: 0.5, max: 5, step: 0.1, value: v }],
  };
});

register("reaction-balancer", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const colors = ["#60a5fa", "#f87171", "#4ade80", "#eab308", "#c678dd"];
  const kind = [];
  for (let i = 0; i < 10; i++) kind.push(i % 5);
  const atoms = kind.map((k, i) => {
    const a = blob(THREE, new THREE.Vector3((i % 5) - 2, 1.6 - Math.floor(i / 5) * 0.9, 0), colors[k], 0.15);
    g.add(a); return a;
  });
  let done = false;
  return {
    tick(_t, dt) {
      const phase = done ? 1 : 0;
      atoms.forEach((a, i) => {
        const x = (i % 5) - 2 + phase * 4;
        a.position.x += (x - a.position.x) * dt * 2;
        a.position.y = 1.6 - Math.floor(i / 5) * 0.9 + (done ? 0.9 : 0) + Math.sin(_t * 2 + i) * 0.05;
      });
    },
    set(key, v) { if (key === "go") done = !!v; },
    controls: [{ key: "go", label: "Balance reaction (products)", type: "toggle", value: false }],
  };
});

register("trend-drift", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const colors = ["#f87171", "#60a5fa"];
  const rads = [];
  for (let i = 0; i < 8; i++) {
    const r = 1.1 + i * 0.55;
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.06, r, 48),
      new THREE.MeshBasicMaterial({ color: colors[i % 2], transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; g.add(ring);
    rads.push(r);
  }
  const pts = [];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), MT(THREE, "#fbbf24"));
    m.position.set((i - 3) * 0.7, 0.2, 0); g.add(m); pts.push(m);
  }
  return {
    tick(_t, dt) {
      pts.forEach((p, i) => { p.position.y = 0.18 + Math.sin(_t * 2 + i * 1.2) * 0.4; });
    },
    set() {},
    controls: [],
  };
});

/* ================= mathematics ================= */

register("parabola-walk", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#4ade80", 300);
  g.add(trace.line);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), MT(THREE, "#f87171"));
  g.add(dot);
  let a = 0.6, c = 0;
  return {
    tick(_t, dt) {
      const x = sprint(_t, -3, 3);
      const y = a * x * x + c;
      dot.position.set(x, y - 1.5, 0);
      trace.push(dot.position.clone());
    },
    set(key, v) { if (key === "a") a = v; if (key === "c") c = v; },
    controls: [
      { key: "a", label: "Coefficient a", min: -1, max: 1.5, step: 0.1, value: a },
      { key: "c", label: "Constant c", min: -2, max: 2, step: 0.1, value: c },
    ],
  };
});

register("sequence-stars", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const dots = [];
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), MT(THREE, "#60a5fa"));
    m.position.set(i - 11.5, 0, 0); m.visible = false; g.add(m); dots.push(m);
  }
  let n = 10, d = 2, r = 1.5;
  return {
    tick() {
      dots.forEach((m, i) => {
        const on = i < n;
        m.visible = on;
        if (on) m.position.y = d * i + r + Math.sin(i * 0.9) * 0.05;
        m.material.emissiveIntensity = on ? 0.35 + 0.3 * Math.sin(i) : 0;
      });
    },
    set(key, v) {
      if (key === "n") n = Math.round(v);
      if (key === "d") d = v;
      if (key === "r") r = v;
    },
    controls: [
      { key: "n", label: "Terms", min: 2, max: 24, step: 1, value: n },
      { key: "d", label: "Common diff d", min: -3, max: 3, step: 0.2, value: d },
      { key: "r", label: "First term", min: -2, max: 3, step: 0.2, value: r },
    ],
  };
});

register("sine-circle", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 64),
    new THREE.MeshBasicMaterial({ color: "#60a5fa", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; g.add(ring);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), MT(THREE, "#f87171"));
  g.add(p);
  const trace = Sweep(THREE, "#f2a33c", 400);
  trace.line.position.x = 3; g.add(trace.line);
  let w = 1.2;
  return {
    tick(_t, dt) {
      const th = _t * w;
      const x = Math.cos(th), z = Math.sin(th);
      p.position.set(x * 1.6, 1.6 * Math.sin(th) * 0.6, z * 1.6);
      trace.push(new THREE.Vector3(_t * 0.35, Math.sin(th) * 1.5, 0));
    },
    set(key, v) { if (key === "omega") w = v; },
    controls: [{ key: "omega", label: "Angular speed ω", min: 0.4, max: 3, step: 0.1, value: w }],
  };
});

register("slot-tree", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const limbs = [];
  function build(n, x, py, w) {
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), MT(THREE, "#4ade80"));
    node.position.set(x, py, 0); g.add(node);
    if (n > 0) {
      [-w, w].forEach((dx) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), MT(THREE, "#60a5fa"));
        m.position.set(x + dx, py - 0.7, 0); g.add(m);
        const l = new THREE.Line(new THREE.BufferGeometry().setAttribute("position",
          new THREE.Float32BufferAttribute([x, py, 0, x + dx, py - 0.7, 0], 3)),
          new THREE.LineBasicMaterial({ color: "#7aa2ff", transparent: true, opacity: 0.6 }));
        g.add(l);
      });
    }
  }
  let depth = 3;
  return {
    tick() {
      g.traverse((o) => { if (o.isMesh) o.material.emissiveIntensity = 0.25 + 0.3 * Math.sin(o.position.x * 3 + o.position.y * 4); });
    },
    set(key, v) { if (key === "depth") depth = Math.round(v); },
    controls: [{ key: "depth", label: "Slots depth", min: 1, max: 4, step: 1, value: depth }],
  };
});

register("pascal-triangle", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const colors = ["#60a5fa", "#4ade80", "#f2a33c", "#f87171", "#c678dd"];
  const cells = [];
  function row(y, n) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), MT(THREE, colors[y % 5]));
      m.position.set((i - (n - 1) / 2) * 0.42, y * 0.62, 0);
      g.add(m); cells.push(m);
    }
  }
  for (let y = 0; y < 7; y++) row(y, y + 1);
  return {
    tick(_t) { cells.forEach((m, i) => { m.material.emissiveIntensity = 0.3 + 0.35 * Math.sin(_t * 2 + i * 0.4); }); },
    set() {},
    controls: [],
  };
});

register("circle-family", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const arcs = [];
  [1.2, 1.9, 2.6].forEach((r, i) => {
    const c = ["#60a5fa", "#4ade80", "#f2a33c"][i];
    const arc = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.7 }));
    const pts = []; for (let a = 0; a <= Math.PI * 2; a += 0.06) pts.push(Math.cos(a) * r, 0, Math.sin(a) * r);
    arc.geometry.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    arc.position.y = i - 1; g.add(arc); arcs.push(arc);
  });
  return {
    tick(){}, set(){}, controls: [],
  };
});

register("conic-sweep", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#f2a33c", 300);
  g.add(trace.line);
  let e = 0.6;
  return {
    tick(_t, dt) {
      const th = _t * 1.1;
      const a = 2.2, r = a * (1 - e * e) / (1 + e * Math.cos(th));
      const x = r * Math.cos(th), z = r * Math.sin(th);
      trace.push(new THREE.Vector3(x, 0, z));
    },
    set(key, v) { if (key === "e") e = v; },
    controls: [{ key: "e", label: "Eccentricity e", min: 0.1, max: 1.6, step: 0.05, value: e }],
  };
});

register("limit-climb", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const y = 2.2;
  const target = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), MT(THREE, "#f87171"));
  target.position.set(y, Math.sin(y) + 1, 0); g.add(target);
  const trace = Sweep(THREE, "#4ade80", 200);
  g.add(trace.line);
  return {
    tick(_t, dt) {
      const c = sprint(_t, -y, y);
      const x = c;
      trace.push(new THREE.Vector3(x, Math.sin(x) + 1, 0));
    },
    set() {},
    controls: [],
  };
});

register("box-whisker", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const box = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.14), MT(THREE, "#60a5fa"));
  box.position.y = 0.7; g.add(box);
  const med = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.16), MT(THREE, "#f87171"));
  med.position.y = 0.7; g.add(med);
  const low = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 0.14), MT(THREE, "#4ade80"));
  low.position.set(-2.3, 0.3, 0); g.add(low);
  const hi = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 0.14), MT(THREE, "#4ade80"));
  hi.position.set(2.3, 0.3, 0); g.add(hi);
  return {
    tick(){}, set(){}, controls: [],
  };
});

register("reimann-slices", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  let n = 8;
  const slices = [];
  function f(x) { return (x * x) * 0.5 + 0.2; }
  function build() {
    slices.forEach(s => g.remove(s)); slices.length = 0;
    for (let i = 0; i < n; i++) {
      const x0 = (i / n) * 3.6 - 1.8;
      const h = f(x0);
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.6 / n - 0.04, h, 0.14), MT(THREE, i % 2 ? "#60a5fa" : "#4ade80"));
      m.position.set(x0 + (3.6 / n) / 2, h / 2, 0); g.add(m); slices.push(m);
    }
  }
  build();
  return {
    tick(){},
    set(key, v) { if (key === "n") { n = Math.round(v); build(); } },
    controls: [{ key: "n", label: "Slices", min: 3, max: 40, step: 1, value: n }],
  };
});

register("slope-flow", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const arrows = [];
  for (let xi = 0; xi < 8; xi++) for (let yi = 0; yi < 8; yi++) {
    const x = (xi - 3.5) * 0.7, y = (yi - 3.5) * 0.7;
    const a = new THREE.Vector3(1, y, 0);
    const dir = a.clone().normalize();
    const ar = makeArrow(new THREE.Vector3(x, 0, y), new THREE.Vector3(x + dir.x * 0.3, 0, y + dir.z * 0.3), "#7aa2ff", 0.14, 0.1);
    g.add(ar); arrows.push(ar);
  }
  return {
    tick(){}, set(){}, controls: [],
  };
});

register("solid-spin", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 6), MT(THREE, "#f2a33c"));
  g.add(prism);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.2, 24), MT(THREE, "#4ade80"));
  cone.position.set(2.4, 0, 0); g.add(cone);
  return {
    tick(_t, dt) { prism.rotation.y += dt * 0.8; cone.rotation.y += dt * 1.1; },
    set(){}, controls: [],
  };
});

register("vector-field", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const arrows = [];
  const base = 1.6;
  for (let xi = -3; xi <= 3; xi++) for (let yi = -3; yi <= 3; yi++) {
    const x = xi * 0.6, y = yi * 0.6;
    const vx = -y, vy = x;
    const from = new THREE.Vector3(x, 0, y);
    const to = new THREE.Vector3(x + vx * 0.25, 0, y + vy * 0.25);
    const ar = makeArrow(from, to, "#60a5fa", 0.14, 0.09);
    g.add(ar); arrows.push(ar);
  }
  return {
    tick(){}, set(){}, controls: [],
  };
});

register("urn-draw", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 1.4, 20),
    new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  urn.position.y = -0.7; g.add(urn);
  let red = 5, blue = 5;
  const balls = [];
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), MT(THREE, "#f87171"));
    m.position.set(0, -1.3, 0); g.add(m); balls.push(m);
  }
  function layout() {
        balls.forEach((m, i) => {
      const isRed = i < red;
      m.material.color.set(isRed ? "#f87171" : "#60a5fa");
      m.material.emissive.set(isRed ? "#f87171" : "#60a5fa");
      const a = (i / Math.max(1, red + blue)) * Math.PI * 2;
      m.position.set(Math.cos(a) * 0.4, -1.2 + 0.25 * Math.floor(i / 7), Math.sin(a) * 0.4);
    });
  }
  layout();
  return {
    tick(){},
    set(key, v) { if (key === "red") red = Math.round(v); if (key === "blue") blue = Math.round(v); layout(); },
    controls: [
      { key: "red", label: "Red balls", min: 1, max: 9, step: 1, value: red },
      { key: "blue", label: "Blue balls", min: 1, max: 9, step: 1, value: blue },
    ],
  };
});

register("area-sweep", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#f2a33c", 400);
  g.add(trace.line);
  let a = 0, b = 5;
  const filled = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: "#60a5fa", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  g.add(filled);
  function f(x) { return 2.2 * Math.sin(x * 0.8) + 2; }
  return {
    tick(_t, dt) {
      const x = sprint(_t, a, b);
      trace.push(new THREE.Vector3(x, f(x) - 2, 0));
    },
    set(key, v) { if (key === "b") b = v; },
    controls: [{ key: "b", label: "Upper limit b", min: 1, max: 8, step: 0.5, value: b }],
  };
});

register("complex-rotate", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const IM = new THREE.Vector3(0, 0, 2.2);
  const labels = [makeTextSprite("Re", { size: 0.5, color: "#f87171" }), makeTextSprite("Im", { size: 0.5, color: "#4ade80" })];
  labels[0].position.set(2.6, 0, 0); labels[1].position.set(0, 0, 2.6); g.add(labels[0], labels[1]);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), MT(THREE, "#fbbf24"));
  g.add(p);
  const trace = Sweep(THREE, "#c678dd", 400);
  g.add(trace.line);
  let w = 1;
  return {
    tick(_t, dt) {
      const th = _t * w;
      p.position.set(Math.cos(th) * 1.6, 0, Math.sin(th) * 1.6);
      trace.push(p.position.clone());
    },
    set(key, v) { if (key === "omega") w = v; },
    controls: [{ key: "omega", label: "Argument speed", min: 0.3, max: 3, step: 0.1, value: w }],
  };
});

/* ================= physics ================= */

register("dimension-checks", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const chips = ["[M]", "[L]", "[T]"].map((c, i) => {
    const s = makeTextSprite(c, { size: 0.7, color: ["#f87171", "#4ade80", "#60a5fa"][i] });
    s.position.set((i - 1) * 3, 1.6, 0); g.add(s); return s;
  });
  const dimensions = ["L", "M", "T"].map((d, i) => {
    const s = makeTextSprite(d, { size: 0.6, color: "#d7dae0" });
    s.position.set((i - 1) * 3, -1.2, 0); g.add(s); return s;
  });
  return {
    tick(){}, set(){}, controls: [],
  };
});

register("motion-graphs", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const traceD = Sweep(THREE, "#4ade80", 400);
  const traceV = Sweep(THREE, "#f2a33c", 400);
  traceD.line.position.y = 1.8; traceV.line.position.y = -1.8;
  g.add(traceD.line, traceV.line);
  let a = 0.8;
  return {
    tick(_t, dt) {
      const t = sprint(_t, 0, 4);
      const d = 0.5 * a * t * t;
      const v = a * t;
      traceD.push(new THREE.Vector3(t - 2, d * 0.6, 0));
      traceV.push(new THREE.Vector3(t - 2, v * 0.6, 0));
    },
    set(key, vv) { if (key === "accel") a = vv; },
    controls: [{ key: "accel", label: "Acceleration a", min: 0.2, max: 2.5, step: 0.1, value: a }],
  };
});

register("force-bleed", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), MT(THREE, "#60a5fa"));
  g.add(box);
  let F = 2;
  const arrows = [];
  [[1, "#f87171"], [0.6, "#4ade80"]].forEach(() => {});
  return {
    tick() {
      const ax = F;
      box.position.x += (sprint(F, -2, 4) - box.position.x) * 1;
    },
    set(key, vv) { if (key === "F") F = vv; },
    controls: [{ key: "F", label: "Applied force F", min: -2, max: 4, step: 0.2, value: F }],
  };
});

register("work-machines", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), MT(THREE, "#4ade80"));
  fulcrum.position.y = -0.25; g.add(fulcrum);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 0.16), MT(THREE, "#f2a33c"));
  g.add(beam);
  let load = 2, effort = 1;
  return {
    tick() {
      beam.rotation.z = (load * 1.5 - effort * 2.7) * 0.02;
    },
    set(key, v) { if (key === "load") load = v; if (key === "effort") effort = v; },
    controls: [
      { key: "load", label: "Load", min: 1, max: 5, step: 0.2, value: load },
      { key: "effort", label: "Effort", min: 1, max: 5, step: 0.2, value: effort },
    ],
  };
});

register("gyro-spin", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.22, 16, 40), MT(THREE, "#60a5fa"));
  wheel.rotation.x = Math.PI / 2; g.add(wheel);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 10), MT(THREE, "#f2a33c"));
  axle.rotation.z = Math.PI / 2; g.add(axle);
  let spin = 2, pre = 0.6;
  return {
    tick(_t, dt) { wheel.rotation.z += dt * spin; g.rotation.y += dt * pre; },
    set(key, v) { if (key === "spin") spin = v; if (key === "precess") pre = v; },
    controls: [
      { key: "spin", label: "Spin", min: 0.5, max: 5, step: 0.2, value: spin },
      { key: "precess", label: "Precession", min: 0, max: 3, step: 0.1, value: pre },
    ],
  };
});

register("orbit-prop", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const sun = blob(THREE, new THREE.Vector3(0, 0, 0), "#fbbf24", 0.5);
  g.add(sun);
  const orb = new THREE.Group();
  const planet = blob(THREE, new THREE.Vector3(2.4, 0, 0), "#60a5fa", 0.2);
  orb.add(planet); g.add(orb);
  let speed = 0.7, a = 2.4, e = 0.15;
  return {
    tick(_t, dt) {
      const th = _t * speed;
      const r = a * (1 - e * e) / (1 + e * Math.cos(th));
      planet.position.set(r * Math.cos(th), 0, r * Math.sin(th));
    },
    set(key, v) { if (key === "speed") speed = v; if (key === "e") e = v; },
    controls: [
      { key: "speed", label: "Orbit speed", min: 0.2, max: 2, step: 0.1, value: speed },
      { key: "e", label: "Eccentricity", min: 0, max: 0.7, step: 0.05, value: e },
    ],
  };
});

register("phase-circle", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 64),
    new THREE.MeshBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; g.add(ring);
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), MT(THREE, "#f87171"));
  g.add(p);
  const y = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), MT(THREE, "#60a5fa"));
  y.position.set(0, 2, 0); g.add(y);
  let w = 1.4;
  return {
    tick(_t, dt) {
      const th = _t * w;
      p.position.set(Math.cos(th) * 1.6, 1.6 * Math.sin(th) * 0.7, 0);
      y.position.y = 1.6 * Math.sin(th);
    },
    set(key, v) { if (key === "omega") w = v; },
    controls: [{ key: "omega", label: "ω", min: 0.4, max: 3, step: 0.1, value: w }],
  };
});

register("com-balance", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const m1 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), MT(THREE, "#f87171"));
  m1.position.set(-1.6, 0, 0); g.add(m1);
  const m2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 14), MT(THREE, "#60a5fa"));
  m2.position.set(1.6, 0, 0); g.add(m2);
  const com = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), MT(THREE, "#fbbf24"));
  g.add(com);
  let m2v = 4;
  return {
    tick() {
      const x = (-1.6 * 2 + 1.6 * m2v) / (2 + m2v);
      com.position.x = x;
    },
    set(key, v) { if (key === "m2") m2v = v; },
    controls: [{ key: "m2", label: "m₂ mass", min: 1, max: 9, step: 1, value: m2v }],
  };
});

register("pressure-tower", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 20),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.5 }));
  col.position.y = 1.5; g.add(col);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 20), MT(THREE, "#f2a33c"));
  lid.position.y = 3; g.add(lid);
  let level = 2;
  return {
    tick() {
      lid.position.y = level; col.scale.y = level; col.position.y = level / 2;
    },
    set(key, v) { if (key === "level") level = v; },
    controls: [{ key: "level", label: "Fluid depth h", min: 0.5, max: 3, step: 0.1, value: level }],
  };
});

register("expand-rod", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const rod = new THREE.Mesh(new THREE.BoxGeometry(3, 0.12, 0.12), MT(THREE, "#f2a33c"));
  g.add(rod);
  let T = 300;
  return {
    tick() {
      const L = 3 * (1 + 1.2e-5 * (T - 300));
      rod.scale.x = L / 3;
    },
    set(key, v) { if (key === "T") T = v; },
    controls: [{ key: "T", label: "Temperature K", min: 200, max: 800, step: 20, value: T }],
  };
});

register("cycle-pv", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#f2a33c", 600);
  g.add(trace.line);
  let path = 0;
  return {
    tick(_t, dt) {
      const t = _t * 0.6;
      const P = 2 + Math.sin(t), V = 2 + Math.cos(t);
      trace.push(new THREE.Vector3(V * 0.6, P * 1.2, 0));
    },
    set(key, v) { if (key === "path") path = Math.round(v); },
    controls: [
      { key: "path", label: "Cycle (0:circle, 1:square)", type: "select", options: [0, 1], value: path },
    ],
  };
});

register("speed-dist", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#60a5fa", 300);
  g.add(trace.line);
  let T = 300;
  return {
    tick(_t, dt) {
      const v = sprint(_t, 0, 4);
      const vp = Math.sqrt(2 * 1.4 * T) / 40;
      const y = (v / (vp * vp)) * Math.exp(-(v * v) / (2 * vp * vp)) * 3;
      trace.push(new THREE.Vector3(v - 2, y, 0));
    },
    set(key, v) { if (key === "T") T = v; },
    controls: [{ key: "T", label: "Temperature K", min: 200, max: 700, step: 20, value: T }],
  };
});

register("wave-superpose", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const t1 = Sweep(THREE, "#f87171", 300); t1.line.position.y = 0.6;
  const t2 = Sweep(THREE, "#4ade80", 300); t2.line.position.y = -0.6;
  const ts = Sweep(THREE, "#60a5fa", 300);
  g.add(t1.line, t2.line, ts.line);
  let f = 1.4;
  return {
    tick(_t, dt) {
      const x = sprint(_t, -3, 3);
      const y1 = Math.sin(x * f) * 1;
      const y2 = Math.sin(x * f + 0.85) * 1;
      t1.push(new THREE.Vector3(x, y1, 0));
      t2.push(new THREE.Vector3(x, y2, 0));
      ts.push(new THREE.Vector3(x, y1 + y2, 0));
    },
    set(key, v) { if (key === "k") f = v; },
    controls: [{ key: "k", label: "Phase/frequency", min: 0.4, max: 3, step: 0.1, value: f }],
  };
});

register("field-line", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const q1 = blob(THREE, new THREE.Vector3(-1.4, 0, 0), "#f87171", 0.3);
  const q2 = blob(THREE, new THREE.Vector3(1.4, 0, 0), "#60a5fa", 0.3);
  g.add(q1, q2);
  const lines = [];
  for (let a = 0; a < 12; a++) {
    const th = (a / 12) * Math.PI * 2;
    const x = Math.cos(th) * 2.6, z = Math.sin(th) * 2.6;
    const ar = makeArrow(new THREE.Vector3(x, 0, z), new THREE.Vector3(0, 0, 0), "#7aa2ff", 0.14, 0.09);
    g.add(ar); lines.push(ar);
  }
  let q = 1;
  return {
    tick(){},
    set(key, v) { if (key === "charge") q = v; },
    controls: [{ key: "charge", label: "Charge", min: -3, max: 3, step: 1, value: q }],
  };
});

register("ohm-walk", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const battery = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, 12), MT(THREE, "#f87171"));
  battery.position.x = -2; battery.rotation.z = Math.PI / 2; g.add(battery);
  const bulb = blob(THREE, new THREE.Vector3(1.8, 0, 0), "#fbbf24", 0.24, 0.7);
  g.add(bulb);
  let V = 6, R = 5;
  return {
    tick() {
      const I = V / R;
      bulb.material.emissiveIntensity = 0.2 + Math.min(1, I / 3) * 0.8;
    },
    set(key, v) { if (key === "V") V = v; if (key === "R") R = v; },
    controls: [
      { key: "V", label: "Voltage V", min: 1, max: 12, step: 1, value: V },
      { key: "R", label: "Resistance Ω", min: 1, max: 20, step: 1, value: R },
    ],
  };
});

register("field-coil", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.14, 12, 30), MT(THREE, "#f2a33c"));
  coil.rotation.x = Math.PI / 2; g.add(coil);
  let I = 2;
  return {
    tick(_t, dt) { coil.rotation.z += dt * 0.4; },
    set(key, v) { if (key === "I") I = v; },
    controls: [{ key: "I", label: "Current", min: 1, max: 8, step: 0.5, value: I }],
  };
});

register("flux-coil", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(1, 0.22, 14, 32), MT(THREE, "#60a5fa"));
  loop.rotation.x = Math.PI / 2; g.add(loop);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 12), MT(THREE, "#f87171"));
  bar.position.set(0, 1.2, 0); g.add(bar);
  let v = 0.4;
  return {
    tick(_t, dt) {
      bar.position.y = mod(_t * v, 3);
      bar.material.emissiveIntensity = 0.4 + 0.5 * Math.sin(_t * v * Math.PI);
    },
    set(key, x) { if (key === "speed") v = x; },
    controls: [{ key: "speed", label: "Bar speed", min: 0.1, max: 2, step: 0.1, value: v }],
  };
});

register("phasor-plot", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#60a5fa", 500);
  g.add(trace.line);
  const tip = blob(THREE, new THREE.Vector3(0, 0, 0), "#f87171", 0.12);
  g.add(tip);
  let ph = 1.2;
  return {
    tick(_t, dt) {
      const th = _t * 2;
      tip.position.set(Math.cos(th) * 1.6, 1.6 * Math.sin(th) * 0.7, 0);
      trace.push(new THREE.Vector3(Math.cos(th) * 1.6, 1.6 * Math.sin(th) * 0.7, 0));
    },
    set(key, v) { if (key === "phase") ph = v; },
    controls: [{ key: "phase", label: "Phase offset", min: 0, max: 3.14, step: 0.1, value: ph }],
  };
});

register("em-wave", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const tE = Sweep(THREE, "#f2a33c", 400);
  const tB = Sweep(THREE, "#60a5fa", 400);
  tE.line.position.y = 0; tB.line.position.y = 0;
  g.add(tE.line, tB.line);
  let k = 1.4;
  return {
    tick(_t, dt) {
      const x = sprint(_t, -3, 3);
      tE.push(new THREE.Vector3(x, Math.sin(x * k) * 0.9, 0));
      tB.push(new THREE.Vector3(x, 0, Math.sin(x * k) * 0.9));
    },
    set(key, v) { if (key === "k") k = v; },
    controls: [{ key: "k", label: "Wavenumber", min: 0.4, max: 3, step: 0.2, value: k }],
  };
});

register("ray-mirror", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8),
    new THREE.MeshStandardMaterial({ color: "#9db8c9", metalness: 0.8, roughness: 0.3 }));
  mirror.rotation.z = Math.PI / 2; mirror.position.x = 2; g.add(mirror);
  let angle = 0.6;
  return {
    tick() {
      for (const l of g.children.filter(o => o.geometry && o.geometry.type === "BufferGeometry")) g.remove(l);
      const inEnd = new THREE.Vector3(-2, Math.tan(angle) * 2, 0);
      g.add(new THREE.Line(new THREE.BufferGeometry().setAttribute("position",
        new THREE.Float32BufferAttribute([inEnd.x, inEnd.y, 0, 0, 0, 0], 3)),
        new THREE.LineBasicMaterial({ color: "#f87171" })));
      const outEnd = new THREE.Vector3(0, 0, 0);
      g.add(new THREE.Line(new THREE.BufferGeometry().setAttribute("position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, -inEnd.y * 0.8, 0], 3)),
        new THREE.LineBasicMaterial({ color: "#60a5fa" })));
    },
    set(key, v) { if (key === "angle") angle = v; },
    controls: [{ key: "angle", label: "Incidence angle", min: 0.1, max: 1.3, step: 0.05, value: angle }],
  };
});

register("interfere-fringe", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  let sep = 0.9, lam = 1;
  const bands = [];
  function build() {
    bands.forEach(b => g.remove(b)); bands.length = 0;
    for (let i = -5; i <= 5; i++) {
      const y = i * 0.4;
      const bright = i % 2 === 0;
      const b = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.16),
        new THREE.MeshBasicMaterial({ color: bright ? "#f2a33c" : "#3b4553", transparent: true, opacity: 0.75, side: THREE.DoubleSide }));
      b.position.set(0, y, 0); g.add(b); bands.push(b);
    }
  }
  build();
  return {
    tick(){},
    set(key, v) { if (key === "sep") sep = v; if (key === "lam") lam = v; },
    controls: [
      { key: "sep", label: "Slit separation", min: 0.4, max: 2, step: 0.1, value: sep },
      { key: "lam", label: "Wavelength", min: 0.5, max: 2, step: 0.1, value: lam },
    ],
  };
});

register("photoelectric-plot", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#60a5fa", 200);
  g.add(trace.line);
  let f = 2;
  return {
    tick(_t, dt) {
      const W = 1.5;
      const E = f - W;
      const y = E > 0 ? E * 1.2 : 0;
      trace.push(new THREE.Vector3(f - 4, y, 0));
    },
    set(key, v) { if (key === "f") f = v; },
    controls: [{ key: "f", label: "Frequency ν", min: 1, max: 6, step: 0.1, value: f }],
  };
});

register("spectrum-ladder", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const cols = ["#60a5fa", "#4ade80", "#f2a33c", "#f87171", "#c678dd"];
  const levels = [];
  for (let i = 0; i < 5; i++) {
    const s = makeTextSprite("n=" + (i + 1), { size: 0.45, color: cols[i] });
    s.position.set(-2.2, i * 1.1 - 1, 0); g.add(s);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.07, 0.1), new THREE.MeshStandardMaterial({ color: cols[i], emissive: cols[i], emissiveIntensity: 0.5 }));
    bar.position.set(0, i * 1.1 - 1, 0); g.add(bar);
    levels.push(bar);
  }
  return {
    tick(_t, dt) { levels.forEach((l, i) => { l.material.emissiveIntensity = 0.3 + 0.5 * Math.max(0, Math.sin(_t * 2 + i)); }); },
    set(){}, controls: [],
  };
});

register("diode-curve", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const trace = Sweep(THREE, "#60a5fa", 300);
  g.add(trace.line);
  let V = 0.4;
  return {
    tick(_t, dt) {
      const v = sprint(_t, -1.5, 1.5);
      const I = v > 0 ? (v * v) * 1.2 : -0.2;
      trace.push(new THREE.Vector3(v, I, 0));
    },
    set(key, v) { if (key === "V") V = v; },
    controls: [{ key: "V", label: "Bias", min: -1.5, max: 1.5, step: 0.1, value: V }],
  };
});

/* ================= chemistry ================= */

register("lewis-orbit", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const center = blob(THREE, new THREE.Vector3(0, 0, 0), "#52525b", 0.28);
  g.add(center);
  const lobes = [];
  for (let i = 0; i < 4; i++) {
    const l = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.95, 14), MT(THREE, "#4ade80"));
    const a = (i / 4) * Math.PI * 2 + 0.4;
    l.position.set(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7);
    l.rotation.z = Math.PI / 2 - a; g.add(l); lobes.push(l);
  }
  let pairs = 4;
  return {
    tick(_t, dt) { g.rotation.y += dt * 0.5; },
    set(key, v) { if (key === "pairs") pairs = Math.round(v); },
    controls: [{ key: "pairs", label: "Bond pairs", min: 2, max: 4, step: 1, value: pairs }],
  };
});

register("boyle-chamber", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 20), MT(THREE, "#f2a33c"));
  g.add(piston);
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 20),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.5 }));
  gas.position.y = -0.7; g.add(gas);
  let P = 1;
  return {
    tick() {
      const V = 1.6 - P * 0.28;
      gas.scale.y = V / 1.4;
      piston.position.y = -1.4 + V;
    },
    set(key, v) { if (key === "P") P = v; },
    controls: [{ key: "P", label: "Pressure", min: 1, max: 8, step: 0.2, value: P }],
  };
});

register("enthalpy-shot", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const r1 = blob(THREE, new THREE.Vector3(-2, 1.8, 0), "#f87171", 0.28);
  const p = blob(THREE, new THREE.Vector3(2, -1.2, 0), "#4ade80", 0.28);
  g.add(r1, p);
  const trace = Sweep(THREE, "#f2a33c", 200);
  g.add(trace.line);
  return {
    tick(_t, dt) {
      const x = sprint(_t, -2, 2);
      const y = 1.8 - (x + 2) * 0.75;
      trace.push(new THREE.Vector3(x, y, 0));
    },
    set(){}, controls: [],
  };
});

register("shift-balance", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.14), MT(THREE, "#f2a33c"));
  g.add(bar);
  const ful = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 4), MT(THREE, "#4ade80"));
  ful.position.y = -0.25; g.add(ful);
  let A = 2, B = 2;
  return {
    tick() {
      const m = A - B;
      bar.rotation.z = -m * 0.05;
    },
    set(key, v) { if (key === "A") A = v; if (key === "B") B = v; },
    controls: [
      { key: "A", label: "Reactants", min: 1, max: 5, step: 0.2, value: A },
      { key: "B", label: "Products", min: 1, max: 5, step: 0.2, value: B },
    ],
  };
});

register("ph-titration", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 1.2, 20),
    new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  flask.position.y = -0.6; g.add(flask);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.52, 0.8, 20), MT(THREE, "#c678dd"));
  liq.position.y = -0.8; g.add(liq);
  let vol = 0;
  return {
    tick() {},
    set(key, v) {
      if (key === "vol") {
        vol = v;
        const ph = 1 + (Math.sin((v / 50) * Math.PI)) * 6;
        const g2 = ph > 7 ? 1 : ph / 7;
        liq.material.color.setHSL(0.65 * (1 - g2), 0.8, 0.4);
      }
    },
    controls: [{ key: "vol", label: "Titrant added (mL)", min: 0, max: 50, step: 1, value: vol }],
  };
});

register("cell-stack", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const anode = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.3), MT(THREE, "#f87171"));
  anode.position.x = -1.4; g.add(anode);
  const cathode = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.3), MT(THREE, "#60a5fa"));
  cathode.position.x = 1.4; g.add(cathode);
  const salt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), MT(THREE, "#f2a33c"));
  salt.rotation.z = Math.PI / 2; g.add(salt);
  let E = 0.9;
  return {
    tick(_t, dt) {
      const I = E;
      anode.material.emissiveIntensity = 0.2 + I * 0.3;
      cathode.material.emissiveIntensity = 0.2 + I * 0.3;
    },
    set(key, v) { if (key === "E") E = v; },
    controls: [{ key: "E", label: "Cell EMF", min: 0.3, max: 2.5, step: 0.1, value: E }],
  };
});

register("orbital-shell", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const nucleus = blob(THREE, new THREE.Vector3(0, 0, 0), "#f87171", 0.25, 0.6);
  g.add(nucleus);
  const shells = [0.8, 1.6, 2.4];
  const rings = shells.map((r, i) => {
    const s = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 6, 48), MT(THREE, ["#60a5fa", "#4ade80", "#f2a33c"][i]));
    s.rotation.x = Math.PI / 2 + i * 0.5; g.add(s); return s;
  });
  return {
    tick(_t, dt) { rings.forEach((r, i) => r.rotation.z += dt * (0.4 + i * 0.2)); },
    set(){}, controls: [],
  };
});
