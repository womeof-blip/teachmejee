/* TeachMeJEE — biology simulation pack 2: tissues, organs & systems.
   Built for the NEET track. Contract matches simsBio — factory(ctx) returns
   { tick(t,dt), controls[], set(key,val) }. Controls carry type:"range"
   so the bio MODELS grid renders them (it ignores controls without `type`). */

import { register } from "./engine.js";

const MAT = (THREE, c, emi = 0.3) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: emi });

/* Enzyme catalysis — substrate docks in the active site and splits into two products. */
register("bio-enzyme", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const enzyme = new THREE.Mesh(new THREE.SphereGeometry(1.3, 28, 28), MAT(THREE, "#8b5cf6"));
  enzyme.scale.set(1.2, 0.9, 0.9); g.add(enzyme);
  const notch = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.5, 12), MAT(THREE, "#f2a33c"));
  notch.rotation.z = Math.PI; notch.position.set(1.5, 0, 0); g.add(notch);
  const sub = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 14), MAT(THREE, "#4ade80", 0.5));
  g.add(sub);
  const pA = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), MAT(THREE, "#f87171", 0.5));
  pA.visible = false; g.add(pA);
  const pB = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), MAT(THREE, "#7dd3fc", 0.5));
  pB.visible = false; g.add(pB);
  const candy = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), MAT(THREE, "#fbbf24", 0.5));
  candy.visible = false; g.add(candy);
  let speed = 1, phase = 0;
  return {
    tick(_t, dt) {
      phase += dt * speed;
      const cycle = phase % 6;
      if (cycle < 2.4) {
        const p = cycle / 2.4;
        sub.position.set(-4 + 5.5 * p, Math.sin(cycle * 5) * 0.08, 0);
        sub.visible = true; pA.visible = false; pB.visible = false; candy.visible = false;
      } else if (cycle < 3) {
        sub.visible = false; candy.visible = true;
        candy.position.set(1.4, 0, 0); candy.scale.setScalar(1 + (cycle - 2.4) * 4);
      } else if (cycle < 6) {
        const p = (cycle - 3) / 3;
        pA.visible = pB.visible = true; sub.visible = candy.visible = false;
        pA.position.set(2 + 2 * p, 0.8 - 1.4 * p, 0);
        pB.position.set(2 + 2 * p, -0.8 + 1.4 * p, 0);
      }
      enzyme.rotation.y += dt * 0.2;
    },
    set(key, v9) { if (key === "speed") speed = v9; },
    controls: [{ key: "speed", label: "Reaction rate", type: "range", min: 0.2, max: 3, step: 0.1, value: 1 }],
  };
});

/* Mitochondrion — respiration: glucose fuel in, ATP out along the cristae. */
register("bio-mitochondria", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const G = new THREE.Group(); g.add(G);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 24), new THREE.MeshStandardMaterial({ color: "#c678dd", transparent: true, opacity: 0.28 }));
  shell.scale.set(1.35, 0.75, 0.9); G.add(shell);
  const cristae = [];
  for (let i = -2; i <= 2; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 0.5), MAT(THREE, "#f2a33c", 0.25));
    c.position.y = i * 0.22; G.add(c); cristae.push(c);
  }
  const fuel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), MAT(THREE, "#4ade80", 0.5));
  G.add(fuel);
  const atp = [];
  for (let i = 0; i < 3; i++) {
    const a = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), MAT(THREE, "#f87171", 0.55));
    a.visible = false; G.add(a); atp.push(a);
  }
  let rate = 0.8, phase = 0;
  return {
    tick(_t, dt) {
      phase += dt * rate;
      const cyc = phase % 8;
      if (cyc < 4) fuel.position.set(-4 + cyc, Math.sin(cyc * 3) * 0.4, 0);
      else if (cyc < 4.6) fuel.position.set(0, 0, 0);
      else fuel.position.set(-4, 0.4, 0);
      atp.forEach((a, i) => {
        const st = 4.6 + i * 1.1;
        const on = cyc > st && cyc < st + 0.7;
        a.visible = on;
        if (on) a.position.set(2 + (cyc - st) * 3, -0.4 + i * 0.5, 0);
      });
      cristae.forEach((c, i) => { c.position.y = i * 0.22 + Math.sin(_t * 1.4 + i) * 0.05; });
      G.rotation.z = Math.sin(_t * 0.6) * 0.1;
      G.rotation.y += dt * 0.15;
    },
    set(key, v9) { if (key === "rate") rate = v9; },
    controls: [{ key: "rate", label: "Respiration rate", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 0.8 }],
  };
});

/* Fertilisation — a sperm nucleus fuses with the egg and cleavage begins. */
register("bio-gamete", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const egg = new THREE.Mesh(new THREE.SphereGeometry(1.1, 28, 28), MAT(THREE, "#fbbf24", 0.2));
  g.add(egg);
  const zona = new THREE.Mesh(new THREE.SphereGeometry(1.22, 24, 24), new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.12 }));
  g.add(zona);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), MAT(THREE, "#7dd3fc", 0.4));
  g.add(head);
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), MAT(THREE, "#7dd3fc", 0.25));
  tail.position.y = -0.75; head.add(tail);
  const zygote = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 24), MAT(THREE, "#8fbf6f", 0.35));
  zygote.visible = false; g.add(zygote);
  let speed = 1, phase = 0, fused = false;
  return {
    tick(_t, dt) {
      phase += dt * speed;
      if (!fused && phase < 5) {
        head.position.set(-4 + phase * 0.9, Math.sin(phase * 3.4) * 0.12, 0);
        tail.rotation.z = Math.sin(phase * 8) * 0.5 + Math.PI / 2;
      } else if (!fused) {
        fused = true;
        head.position.set(0.6, 0, 0);
        head.scale.setScalar(1.15);
      }
      if (fused) {
        egg.material.opacity = 0.5; zona.material.opacity = 0.05;
        zygote.visible = true;
        zygote.scale.setScalar(1 + Math.sin(_t * 2) * 0.04);
        head.visible = false;
      }
      egg.rotation.y += dt * 0.1; zona.rotation.y += dt * 0.08;
    },
    set(key, v9) { if (key === "speed") speed = v9; if (key === "reset") { fused = false; phase = 0; head.visible = true; zygote.visible = false; egg.material.opacity = 1; zona.material.opacity = 0.12; } },
    controls: [
      { key: "speed", label: "Sperm speed", type: "range", min: 0.2, max: 2.5, step: 0.1, value: 1 },
      { key: "reset", label: "Reset fertilisation", type: "toggle", value: false },
    ],
  };
});

/* Early embryo — morula, blastula, gastrula and the germ layers. */
register("bio-embryo", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const cells = [];
  const mat = MAT(THREE, "#8fbf6f", 0.3);
  for (let i = 0; i < 16; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), mat);
    c.visible = false; g.add(c); cells.push(c);
  }
  const hollow = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), new THREE.MeshStandardMaterial({ color: "#8fbf6f", transparent: true, opacity: 0.25 }));
  hollow.visible = false; g.add(hollow);
  const cavity = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), new THREE.MeshStandardMaterial({ color: "#4ade80", transparent: true, opacity: 0.15 }));
  hollow.add(cavity);
  const dimple = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 8, 20), MAT(THREE, "#4ade80", 0.4));
  dimple.visible = false; dimple.rotation.x = Math.PI / 2; g.add(dimple);
  const stage = ["Single cell", "Morula (8-16 cells)", "Blastula (hollow)", "Gastrula (3 layers)"];
  let s = 0;
  function layout() {
    cells.forEach((c, i) => c.visible = false);
    hollow.visible = dimple.visible = false;
    if (s === 0) { cells[0].visible = true; cells[0].position.set(0, 0, 0); }
    if (s === 1) cells.forEach((c, i) => {
      c.visible = true;
      const a = i * 2.4, r2 = 0.36;
      c.position.set(Math.cos(a) * r2, Math.sin(i * 1.3) * r2, Math.sin(a) * r2);
    });
    if (s === 2) hollow.visible = true;
    if (s === 3) { dimple.visible = true; dimple.rotation.x = Math.PI / 2; }
  }
  layout();
  return {
    tick(_t, dt) {
      g.rotation.y += dt * 0.25;
      if (s === 1) cells.forEach((c, i) => { c.position.y += Math.sin(_t * 1.5 + i) * 0.0006; });
    },
    set(key, v9) {
      if (key === "stage") { s = Math.min(3, Math.max(0, typeof v9 === "string" ? stage.indexOf(v9) : v9)); layout(); }
    },
    controls: [{ key: "stage", label: "Stage", type: "select", options: stage, value: stage[s] }],
  };
});

/* Punnett square — gametes recombine and genotype frequencies build up. */
register("bio-punnett", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const cols = { A: "#4ade80", a: "#f87171" };
  const cells = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), MAT(THREE, "#2a3140", 0.1));
    p.position.set((c - 1) * 1.15, (r - 1) * 1.15, 0);
    p.rotation.x = -Math.PI / 2; p.rotation.y = 0; p.rotation.z = 0;
    g.add(p);
    cells.push({ p, r, c });
  }
  const counts = [0, 0, 0];
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.12), MAT(THREE, "#7dd3fc", 0.4));
  bar.position.z = 1.6; g.add(bar);
  const ratio = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.12), MAT(THREE, "#c678dd", 0.4));
  ratio.position.z = 1.6; g.add(ratio);
  let t = 0;
  return {
    tick(_t, dt) {
      t += dt;
      if (t > 0.5) {
        t = 0;
        const off = Math.random() < 0.5 ? 0 : 1;
        counts[off * 0 + Math.floor(Math.random() * 3)]++;
      }
      const tot = counts[0] + counts[1] + counts[2] || 1;
      const dom = Math.round((counts[0] / tot) * 100);
      const rec = Math.round((counts[2] / tot) * 100);
      bar.scale.z = 0.12 + (dom / 100) * 2.4; bar.material.color.set(dom > 66 ? "#4ade80" : "#fbbf24");
      ratio.scale.z = 0.12 + (rec / 100) * 2.4;
      if (_t % 6 < 0.3) { counts[0] = counts[1] = counts[2] = 0; }
    },
    set(key) { if (key === "reset") counts.forEach((_, i) => counts[i] = 0); },
    controls: [{ key: "reset", label: "Reset tally", type: "toggle", value: false }],
  };
});

/* Natural selection — a predator culls the conspicuous morph; the population shifts. */
register("bio-selection", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const ground = new THREE.Mesh(new THREE.BoxGeometry(8, 0.15, 4), MAT(THREE, "#3f4a3f", 0.15));
  ground.position.y = -1.1; g.add(ground);
  const prey = [];
  const light = MAT(THREE, "#f3e7c9", 0.2);
  const dark = MAT(THREE, "#5b4636", 0.2);
  for (let i = 0; i < 90; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), i < 45 ? light : dark);
    m.position.set((Math.random() - 0.5) * 7.4, Math.random() * 0.1, (Math.random() - 0.5) * 3.6);
    m.userData.dead = false; g.add(m); prey.push(m);
  }
  let pred = 0, phase = 0;
  return {
    tick(_t, dt) {
      phase += dt;
      if (pred > 0 && phase > 1.2 / pred) {
        phase = 0;
        const dir = pred > 0 ? light : dark;
        const alive = prey.filter((m) => !m.userData.dead);
        if (alive.length > 6) {
          const victim = alive[Math.floor(Math.random() * alive.length)];
          if (victim.material === dir) victim.userData.dead = true, victim.visible = false;
        }
        if (prey.filter((m) => !m.userData.dead).length < 8) prey.forEach((m) => { m.userData.dead = false; m.visible = true; });
      }
      prey.forEach((m, i) => { m.position.y = -0.9 + Math.sin(_t * 1.6 + i) * 0.03; });
    },
    set(key, v9) { if (key === "pred") pred = Math.round(v9); },
    controls: [{ key: "pred", label: "Predation pressure", type: "range", min: 0, max: 3, step: 1, value: 0 }],
  };
});

/* Animal tissues — epithelia, muscle fibres and nerves laid side by side. */
register("bio-tissue", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const panels = [];
  const epi = [];
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 6), MAT(THREE, "#7dd3fc", 0.3));
    c.position.set((i - 2) * 0.55, 0.3, 0); g.add(c); epi.push(c);
  }
  panels.push(epi);
  const mus = [];
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.14, 0.6, 4, 8) : new THREE.CylinderGeometry(0.14, 0.14, 0.9, 8), MAT(THREE, "#f87171", 0.3));
    f.position.set((i - 1.5) * 0.5, 0.3, 0); f.rotation.z = i % 2 ? 0.35 : -0.35; g.add(f); mus.push(f);
  }
  panels.push(mus);
  const ner = [];
  for (let i = 0; i < 3; i++) { ner.push(new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), MAT(THREE, "#4ade80", 0.35))); }
  panels.push(ner);
  const names = ["Epithelial", "Muscle", "Nerve"];
  const tabs = [];
  let sel = 0;
  function layout() {
    panels.forEach((pl, pi) => pl.forEach((m) => { m.visible = pi === sel; m.position.set(0, 0.3, 0); }));
    if (sel === 0) epi.forEach((m, i) => m.position.x = (i - 2) * 0.55);
    if (sel === 1) mus.forEach((m, i) => m.position.x = (i - 1.5) * 0.5);
    if (sel === 2) ner.forEach((m, i) => { m.position.x = (i - 1) * 0.55; m.rotation.z = i % 2 ? 0.3 : -0.3; });
  }
  layout();
  return {
    tick(_t, dt) {
      g.rotation.y = Math.sin(_t * 0.4) * 0.1;
      if (sel === 1) mus.forEach((m, i) => m.position.y = 0.3 + Math.sin(_t * 2 + i) * 0.06);
      else if (sel === 2) ner.forEach((m, i) => m.position.y = 0.3 + Math.sin(_t * 1.2 + i * 2) * 0.04);
      else epi.forEach((m, i) => m.position.y = 0.3 + Math.sin(_t * 3 + i) * 0.015);
    },
    set(key, v9) {
      if (key === "tissue") { sel = Math.min(2, Math.max(0, typeof v9 === "string" ? names.indexOf(v9) : v9)); layout(); }
    },
    controls: [{ key: "tissue", label: "Tissue", type: "select", options: names, value: names[sel] }],
  };
});

/* Xylem — cohesion-tension pulls a column of water up the stem. */
register("bio-xylem", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const tubes = [];
  for (let t2 = 0; t2 < 3; t2++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 5, 10), new THREE.MeshStandardMaterial({ color: "#8a5a2b", transparent: true, opacity: 0.25 }));
    tube.position.x = (t2 - 1) * 0.7; tube.position.y = 0.5; g.add(tube);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 4.6, 10), MAT(THREE, "#7dd3fc", 0.25));
    col.position.x = (t2 - 1) * 0.7; col.position.y = -1.8; g.add(col);
    tubes.push({ col });
  }
  const leaf = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24), MAT(THREE, "#4ade80", 0.4));
  leaf.position.y = 3.2; leaf.rotation.x = Math.PI / 2; g.add(leaf);
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), MAT(THREE, "#7dd3fc", 0.5));
  drop.position.y = 0; drop.visible = false; g.add(drop);
  let tension = 1, phase = 0;
  return {
    tick(_t, dt) {
      phase += dt * tension;
      tubes.forEach(({ col }, t2) => { col.position.y = -1.8 + (phase % 4.6) + t2 * 0.4; });
      drop.visible = phase % 4.6 > 4.4;
      leaf.rotation.z += dt * 0.3;
    },
    set(key, v9) { if (key === "tension") tension = v9; },
    controls: [{ key: "tension", label: "Transpiration pull", type: "range", min: 0.2, max: 3, step: 0.1, value: 1 }],
  };
});

/* Root nodule — symbiotic bacteria fix atmospheric N₂ into usable ammonia. */
register("bio-nodule", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const root = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 4, 12), MAT(THREE, "#a9743f", 0.12));
  root.rotation.z = Math.PI / 2; g.add(root);
  const nodules = [];
  const pos = [[0.9, 0.8, 0], [1.6, -0.6, 0.2], [0.3, -1.2, -0.2]];
  pos.forEach((p) => {
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), MAT(THREE, "#e8b64c", 0.35));
    n.position.set(p[0], p[1], p[2]); g.add(n); nodules.push(n);
  });
  const bub = [];
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), MAT(THREE, "#4ade80", 0.6));
    b.visible = false; g.add(b); bub.push(b);
  }
  let phase = 0, rate = 1;
  return {
    tick(_t, dt) {
      phase += dt * rate;
      const cyc = phase % 5;
      bub.forEach((b, i) => {
        const st = 1 + i * 0.7;
        const on = cyc > st && cyc < st + 1.2;
        b.visible = on;
        if (on) { b.position.set(0.6 - (cyc - st) * 2, 0.5 + (cyc - st) * 1.6, 0); b.scale.setScalar(1 + (cyc - st)); }
      });
      nodules.forEach((n, i) => { n.scale.setScalar(1 + Math.sin(_t * 2.2 + i * 2) * 0.08); });
    },
    set(key, v9) { if (key === "rate") rate = v9; },
    controls: [{ key: "rate", label: "N₂ fixation rate", type: "range", min: 0.2, max: 3, step: 0.1, value: 1 }],
  };
});

/* Phototropism — the shoot bends toward the light, auxin redistributes to the shade side. */
register("bio-auxin", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 2.6, 10), MAT(THREE, "#4ade80", 0.3));
  stem.position.y = 1.3; g.add(stem);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), MAT(THREE, "#8fbf6f", 0.4));
  tip.position.y = 2.6; g.add(tip);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.8, 12), MAT(THREE, "#7c5a3e", 0.2));
  pot.position.y = 0.4; g.add(pot);
  const aux = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), MAT(THREE, "#fbbf24", 0.6));
  aux.position.y = 2.4; g.add(aux);
  const light = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), MAT(THREE, "#ffe28a", 0.5));
  light.rotation.y = Math.PI / 2; light.position.x = 3.4; light.position.y = 3; g.add(light);
  const L = new THREE.PointLight(0xffe28a, 4, 8);
  L.position.set(3.4, 3, 0); g.add(L);
  const flowers = [];
  for (let i = 0; i < 3; i++) {
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), MAT(THREE, "#c678dd", 0.3));
    fl.visible = i === 0; g.add(fl); flowers.push(fl);
  }
  let angle = 0, min = 3;
  return {
    tick(_t, dt) {
      min = Math.max(0, min - dt * 0.5);
      if (min > 0) { g.rotation.z = 0; aux.visible = false; flowers.forEach((f, i) => f.visible = i === 0); }
      else {
        g.rotation.z = -angle * 0.85;
        const a = new THREE.Vector3(aux.position.x, aux.position.y, 0).clone();
        aux.position.copy(a).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(g.rotation.z, 1) - 0.15);
        aux.visible = true;
        flowers.forEach((f, i) => f.visible = i === 1);
      }
      tip.material.emissiveIntensity = 0.4 + Math.sin(_t * 2) * 0.1;
    },
    set(key, v9) { if (key === "light") angle = Math.abs(v9); if (key === "reset") min = 3; flowers.forEach((f) => f.scale.setScalar(1)); },
    controls: [
      { key: "light", label: "Light direction", type: "range", min: -2, max: 2, step: 0.1, value: 0 },
      { key: "reset", label: "Reset stimulus", type: "toggle", value: false },
    ],
  };
});

/* Population growth — the logistic S-curve overshoots or stabilises with capacity. */
register("bio-logistic", ({ THREE, group, makeTextSprite }) => {
  const g = new THREE.Group(); group.add(g);
  const L = -4, R = 4;
  const B = -2.4, T2 = 2.4;
  const W = R - L, H = T2 - B;
  const ring = new THREE.Mesh(new THREE.RingGeometry(W / 2, W / 2 - 0.02, 40), MAT(THREE, "#333a47", 0.05));
  ring.rotation.x = -Math.PI / 2; ring.position.set(L + W / 2, 0, B + H / 2); g.add(ring);
  const capLine = new THREE.Mesh(new THREE.BoxGeometry(W * 0.98, 0.02, 0.02), MAT(THREE, "#f87171", 0.3));
  capLine.rotation.x = -Math.PI / 2; capLine.position.set(L + W / 2, 0.01, T2 - 0.3); g.add(capLine);
  const trace = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: "#4ade80", transparent: true, opacity: 0.95 }));
  trace.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(400 * 3), 3));
  trace.geometry.setDrawRange(0, 0);
  trace.frustumCulled = false; g.add(trace);
  const pts = [];
  const tcap = makeTextSprite("K (carrying capacity)", { size: 0.5, color: "#f87171" });
  tcap.position.set(L + 0.6, 0.2, T2 - 0.05); g.add(tcap);
  let K = 4, r = 1.5, n = 0.3, t = 0, traceHead = 0;
  return {
    tick(_t, dt) {
      t += dt * 0.4;
      K = 4;
      const dn = r * n * (1 - n / K);
      n += dn * dt * 0.4;
      n = Math.max(0.05, n);
      const arr = trace.geometry.attributes.position.array;
      if (pts.length < 200) {
        pts.push(L + (t % 20) * W / 20);
        arr.set([0, 0, 0], traceHead * 3);
        traceHead += 3;
      } else {
        arr.set([arr[(traceHead - 3) * 3 % 600], arr[(traceHead - 2) * 3 % 600], arr[(traceHead - 1) * 3 % 600]], traceHead % 600);
      }
      trace.geometry.setDrawRange(0, Math.min(200, pts.length));
    },
    set(key, v9) { if (key === "rate") r = v9; if (key === "n") n = v9; },
    controls: [
      { key: "rate", label: "Growth rate r", type: "range", min: 0.5, max: 3, step: 0.1, value: 1.5 },
      { key: "n", label: "Starting N₀", type: "range", min: 0.1, max: 6, step: 0.1, value: 0.3 },
    ],
  };
});

/* Predator–prey energy pyramid — only ~10% moves up each trophic level. */
register("bio-foodweb", ({ THREE, group, makeTextSprite }) => {
  const g = new THREE.Group(); group.add(g);
  const LEVELS = [
    { color: "#4ade80", label: "Producers" },
    { color: "#fbbf24", label: "Primary consumers" },
    { color: "#f87171", label: "Secondary consumers" },
    { color: "#c678dd", label: "Tertiary consumers" },
  ];
  const boxes = [];
  LEVELS.forEach((lv, i) => {
    const w = 4.8 - i * 1.1;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.9, 0.9), MAT(THREE, lv.color, 0.18));
    b.position.set(0, -1.8 + i * 1.35, 0);
    b.rotation.x = Math.PI / 2;
    g.add(b); boxes.push(b);
    const t = makeTextSprite(lv.label, { size: 0.5, color: "#d7dae0", bg: "rgba(13,15,19,0.4)" });
    t.position.set(0, 0.2, -1.8 + i * 1.35);
    g.add(t);
  });
  let energy = [100, 100, 100, 100];
  let pulses = 0;
  return {
    tick(_t, dt) {
      pulses += dt;
      if (pulses > 0.8) {
        pulses = 0;
        energy[0] = 100;
        energy[1] = (energy[0] * (0.08 + Math.random() * 0.05)).toFixed(2) * 1;
        energy[2] = (energy[1] * (0.08 + Math.random() * 0.05)).toFixed(2) * 1;
        energy[3] = (energy[2] * (0.08 + Math.random() * 0.05)).toFixed(2) * 1;
      }
      boxes.forEach((b, i) => {
        b.scale.x = Math.max(0.3, energy[i] / 100);
        b.material.emissiveIntensity = 0.12 + (energy[i] / 100) * 0.4;
      });
      g.rotation.y = Math.sin(_t * 0.5) * 0.12;
    },
    set(key, v9) { if (key === "flow") energy[0] = v9 * 100; },
    controls: [{ key: "flow", label: "Energy flow", type: "range", min: 0, max: 1, step: 0.05, value: 1 }],
  };
});

/* Fermenter — microbes churn substrate into product, bubbling CO₂ off. */
register("bio-ferment", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.2, 20), new THREE.MeshStandardMaterial({ color: "#5b6b7a", transparent: true, opacity: 0.3 }));
  tank.position.y = 0.4; g.add(tank);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.15, 20), MAT(THREE, "#8a9bb0", 0.1));
  lid.position.y = 1.5; g.add(lid);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), MAT(THREE, "#8a9bb0", 0.15));
  tube.rotation.z = Math.PI / 2; tube.position.set(0.7, 1.6, 0); g.add(tube);
  const bub = [];
  for (let i = 0; i < 8; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), MAT(THREE, "#7dd3fc", 0.5));
    b.position.set(0.5, -0.4 + i * 0.18, (Math.random() - 0.5) * 0.8); g.add(b); bub.push(b);
  }
  const out = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 8), MAT(THREE, "#fbbf24", 0.4));
  out.rotation.x = -Math.PI / 2; out.position.set(-1.1, 0.6, 0); g.add(out);
  let rate = 1;
  return {
    tick(_t, dt) {
      bub.forEach((b, i) => {
        b.visible = false;
        const p = (_t * rate + i * 0.37) % 1;
        b.position.set(0.6 - p * 0.4, -0.4 + p * 2.2, b.position.z);
        b.visible = true;
        b.scale.setScalar(0.6 + p);
      });
      tank.rotation.y += dt * 0.1;
      g.rotation.y = Math.sin(_t * 0.6) * 0.15;
    },
    set(key, v9) { if (key === "rate") rate = v9; },
    controls: [{ key: "rate", label: "Fermentation rate", type: "range", min: 0.2, max: 4, step: 0.1, value: 1 }],
  };
});

/* Menstrual cycle — hormones crest and the endometrium thickens and sheds. */
register("bio-menses", ({ THREE, group, makeTextSprite }) => {
  const g = new THREE.Group(); group.add(g);
  const uterus = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 20), new THREE.MeshStandardMaterial({ color: "#c85e6b", transparent: true, opacity: 0.25 }));
  uterus.scale.set(1.05, 0.8, 0.8); g.add(uterus);
  const lining = new THREE.Mesh(new THREE.SphereGeometry(1.02, 20, 20), new THREE.MeshStandardMaterial({ color: "#c85e6b", transparent: true, opacity: 0.45 }));
  lining.scale.set(1.05, 0.8, 0.8); g.add(lining);
  const follicle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), MAT(THREE, "#fbbf24", 0.4));
  follicle.position.set(2, 0.4, 0); g.add(follicle);
  const corpus = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), MAT(THREE, "#4ade80", 0.45));
  corpus.position.set(-2, -0.4, 0); corpus.visible = false; g.add(corpus);
  const bars = [];
  ["FSH", "Estrogen", "LH"].forEach((nm, i) => {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.05), MAT(THREE, "#333a47", 0.1));
    base.position.set(-4 + i * 1.2, -1.6, 0); g.add(base);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1, 0.05), MAT(THREE, i === 1 ? "#4ade80" : "#7dd3fc", 0.3));
    bar.position.set(-4 + i * 1.2, -1.1, 0); bar.scale.y = 0.1; g.add(bar);
    bars.push(bar);
    const t = makeTextSprite(nm, { size: 0.4, color: "#d7dae0", bg: "rgba(13,15,19,0)" });
    t.position.set(-4 + i * 1.2, -2.1, 0); g.add(t);
  });
  const days = ["Menses", "Follicular", "Ovulation", "Luteal"];
  let d = 0;
  return {
    tick(_t, dt) {
      d = (d + dt * 0.5) % 28;
      const fsh = Math.max(0, Math.sin(d / 28 * Math.PI * 2)) + (d < 5 ? -0.5 : 0);
      const est = Math.max(0.1, Math.sin(((d + 10) / 28) * Math.PI * 2) + 0.7);
      const lh = Math.abs(Math.sin((d / 28) * Math.PI * 4)) * 0.8;
      bars[0].scale.y = Math.max(0.1, fsh); bars[1].scale.y = Math.max(0.1, est); bars[2].scale.y = Math.max(0.1, lh);
      bars[0].position.y = -1.1 + bars[0].scale.y / 2; bars[1].position.y = -1.1 + bars[1].scale.y / 2; bars[2].position.y = -1.1 + bars[2].scale.y / 2;
      const cyc = Math.floor(d / 7);
      const thick = 0.05 + (cyc === 1 ? 0.1 : cyc === 2 ? 0.2 : cyc === 3 ? 0.28 : 0.02);
      lining.material.opacity = 0.2 + thick;
      follicle.visible = cyc !== 3; corpus.visible = cyc === 3;
      follicle.scale.setScalar(1 + Math.sin(d * 0.6) * 0.08);
      g.rotation.y += dt * 0.08;
    },
    set(key, v9) { if (key === "day") d = (v9 * 28) % 28; },
    controls: [
      { key: "day", label: "Cycle day", type: "range", min: 0, max: 1, step: 0.02, value: 0 },
      { key: "label", label: "Caption", type: "toggle", value: true },
    ],
  };
});

/* Antibody response — each B-cell swarm makes antibodies that tag the invaders. */
register("bio-antibody", ({ THREE, group }) => {
  const g = new THREE.Group(); group.add(g);
  const germs = [];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), MAT(THREE, "#f87171", 0.4));
    m.position.set((i - 2) * 1.3, 0, 0); g.add(m); germs.push(m);
  }
  const bcells = [];
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), MAT(THREE, "#7dd3fc", 0.35));
    b.position.set((i - 1.5) * 1.1, -2, 0); g.add(b); bcells.push(b);
  }
  const tags = [];
  for (let i = 0; i < 16; i++) {
    const tb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), MAT(THREE, "#fbbf24", 0.6));
    tb.visible = false; g.add(tb); tags.push(tb);
  }
  let phase = 0, rate = 1;
  return {
    tick(_t, dt) {
      phase += dt * rate;
      const dock = (phase % 8) < 6;
      bcells.forEach((b, i) => {
        b.visible = dock;
        b.position.y = dock ? -2 + (phase % 8) * 0.35 : -2;
      });
      tags.forEach((tb, i) => {
        const gid = i % 5;
        const ca = Math.floor(i / 5);
        const on = phase > 2 + gid * 0.7 && phase % 8 > 2 + gid * 0.7;
        tb.visible = on;
        if (on) {
          const sp = germs[gid];
          tb.position.set(sp.position.x + Math.cos(ca * 2.1 + gid) * 0.36, Math.sin(ca * 1.7 + gid) * 0.36, 0);
        }
      });
      germs.forEach((m, i) => { m.position.y = Math.sin(_t * 1.5 + i * 2) * 0.08; });
    },
    set(key, v9) { if (key === "rate") rate = v9; },
    controls: [{ key: "rate", label: "Immune response", type: "range", min: 0.2, max: 3, step: 0.1, value: 1 }],
  };
});