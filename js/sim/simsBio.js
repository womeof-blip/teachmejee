/* TeachMeJEE — biology simulations for the NEET track.
   Contract: factory(ctx) -> { tick(_t, dt), controls[], set(key, val) }.
   The engine owns renderer/camera/orbit controls and disposes scene resources. */

import { register } from "./engine.js";

/* DNA double helix — two antiparallel strands with base-pair rungs. */
register("bio-dna", ({ THREE, group }) => {
  const helix = new THREE.Group();
  group.add(helix);
  const N = 24;
  const geoS = new THREE.SphereGeometry(0.16, 16, 16);
  const matA = new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.3 });
  const matB = new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.3 });
  const baseCols = ["#8fbf6f", "#ffc476", "#c678dd", "#7dd3fc"];
  const rungs = [];
  for (let i = 0; i < N; i++) {
    const y = (i - N / 2) * 0.4;
    const th = i * 0.55;
    const pa = new THREE.Vector3(Math.cos(th) * 1.1, y, Math.sin(th) * 1.1);
    const pb = new THREE.Vector3(Math.cos(th + Math.PI) * 1.1, y, Math.sin(th + Math.PI) * 1.1);
    const sa = new THREE.Mesh(geoS, matA);
    sa.position.copy(pa);
    const sb = new THREE.Mesh(geoS, matB);
    sb.position.copy(pb);
    helix.add(sa, sb);
    const col = baseCols[i % baseCols.length];
    const dir = new THREE.Vector3().subVectors(pb, pa);
    const len = dir.length();
    const rung = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, len, 8),
      new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 }));
    rung.position.copy(pa.clone().add(pb).multiplyScalar(0.5));
    rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    helix.add(rung);
    rungs.push(rung);
  }

  let speed = 0.5;
  const state = { speed, rungs: true };
  helix.rotation.z = 0.15;

  return {
    tick(_t, dt) { helix.rotation.y += dt * state.speed; },
    set(key, v) {
      if (key === "speed") state.speed = v;
      if (key === "rungs") rungs.forEach((r) => { r.visible = !!v; });
    },
    controls: [
      { key: "speed", label: "Twist speed", type: "range", min: 0, max: 2, step: 0.05, value: speed },
      { key: "rungs", label: "Base pairs", type: "toggle", value: true },
    ],
  };
});

/* Eukaryotic cell — labelled cutaway with bobbing organelles. */
register("bio-cell", ({ THREE, group }) => {
  const cellG = new THREE.Group();
  group.add(cellG);

  const membrane = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 48, 48),
    new THREE.MeshStandardMaterial({ color: "#ffc476", transparent: true, opacity: 0.14 }));
  cellG.add(membrane);

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshStandardMaterial({ color: "#c678dd", emissive: "#c678dd", emissiveIntensity: 0.18 }));
  cellG.add(nucleus);
  const nucleolus = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#8b5cf6", emissive: "#8b5cf6", emissiveIntensity: 0.25 }));
  nucleus.add(nucleolus);

  const er = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.055, 12, 60),
    new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.2 }));
  er.rotation.x = Math.PI / 2.6;
  cellG.add(er);

  const mitoMat = new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.22 });
  const mitoGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.17, 0.42, 6, 12) : new THREE.SphereGeometry(0.28, 16, 16);
  const mitos = [];
  [[1.2, 0.5, 0.4], [-1.1, -0.7, 0.9], [0.4, 1.3, -0.9], [-0.5, 0.9, 1.2], [1.4, -0.9, -0.5]].forEach((p, i) => {
    const m = new THREE.Mesh(mitoGeo, mitoMat);
    m.position.set(p[0], p[1], p[2]);
    m.rotation.set(i, i * 1.3, i * 0.7);
    cellG.add(m);
    mitos.push(m);
  });

  const vesMatA = new THREE.MeshStandardMaterial({ color: "#8fbf6f", emissive: "#8fbf6f", emissiveIntensity: 0.2 });
  const vesMatB = new THREE.MeshStandardMaterial({ color: "#ffd27a", emissive: "#ffd27a", emissiveIntensity: 0.2 });
  const vesicles = [];
  for (let i = 0; i < 7; i++) {
    const v = new THREE.Mesh(new THREE.SphereGeometry(0.09 + Math.random() * 0.07, 12, 12), i % 2 ? vesMatA : vesMatB);
    const a = Math.random() * Math.PI * 2, r2 = 0.9 + Math.random() * 1.0;
    v.position.set(Math.cos(a) * r2, (Math.random() - 0.5) * 1.6, Math.sin(a) * r2);
    cellG.add(v);
    vesicles.push(v);
  }
  const bases = mitos.map((m) => m.position.y);

  let spin = 0.12;
  return {
    tick(t, dt) {
      cellG.rotation.y += dt * spin;
      er.rotation.z += dt * 0.05;
      mitos.forEach((m, i) => { m.position.y = bases[i] + Math.sin(t * 0.9 + i * 1.7) * 0.09; });
      vesicles.forEach((v, i) => { v.position.y += Math.sin(t * 1.3 + i * 2.1) * 0.0016; });
    },
    set(key, v) { if (key === "spin") spin = v; if (key === "membrane") membrane.material.opacity = v ? 0.14 : 0.34; },
    controls: [
      { key: "spin", label: "Spin speed", type: "range", min: 0, max: 1, step: 0.02, value: spin },
      { key: "membrane", label: "Clear membrane", type: "toggle", value: false },
    ],
  };
});

/* Neuron — myelinated axon firing a travelling action potential. */
register("bio-neuron", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);

  const soma = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 28, 28),
    new THREE.MeshStandardMaterial({ color: "#e6a1b1", emissive: "#e6a1b1", emissiveIntensity: 0.15 }));
  soma.position.set(-2.4, 0, 0);
  g.add(soma);

  for (let i = 0; i < 5; i++) {
    const d = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 1.0, 10),
      new THREE.MeshStandardMaterial({ color: "#e6a1b1" }));
    const ang = (i / 5) * Math.PI * 2;
    d.position.set(-3.1 + Math.cos(ang) * 0.35, Math.sin(ang) * 0.75, Math.sin(ang * 2) * 0.3);
    d.lookAt(soma.position.x - 1.4, 0, 0);
    d.rotateX(-Math.PI / 2);
    g.add(d);
  }

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.75, 0, 0),
    new THREE.Vector3(-0.9, 0.25, 0.15),
    new THREE.Vector3(0, -0.2, -0.2),
    new THREE.Vector3(0.95, 0.22, 0.2),
    new THREE.Vector3(1.9, -0.12, -0.1),
    new THREE.Vector3(2.7, 0.08, 0.05),
  ]);
  const axonMat = new THREE.MeshStandardMaterial({ color: "#d8c49a" });
  const SEG = 36;
  for (let i = 0; i < SEG; i++) {
    const t0 = i / SEG, t1 = (i + 1) / SEG;
    const p0 = curve.getPoint(t0), p1 = curve.getPoint(t1);
    const mid = p0.clone().add(p1).multiplyScalar(0.5);
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, p0.distanceTo(p1) + 0.01, 10), axonMat);
    seg.position.copy(mid);
    seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
    g.add(seg);
  }
  const sheaths = [];
  for (let s = 0; s < 5; s++) {
    const t = 0.12 + s * 0.17;
    const sheath = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.42, 14),
      new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffb454", emissiveIntensity: 0.12 }));
    sheath.position.copy(curve.getPoint(t));
    sheath.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
      curve.getPoint(t + 0.03).sub(curve.getPoint(t)).normalize());
    g.add(sheath);
    sheaths.push(sheath);
  }

  const sigMat = new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffc476", emissiveIntensity: 1.4 });
  const signal = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), sigMat);
  g.add(signal);

  let u = 0, spd = 0.35, myelin = true;
  return {
    tick(_t, dt) {
      u += dt * spd;
      if (u > 1.15) u = -0.15;
      const clamped = Math.max(0, Math.min(1, u));
      signal.position.copy(u < 0 || u > 1
        ? curve.getPoint(clamped)
        : curve.getPoint(clamped));
      signal.visible = u >= 0 && u <= 1;
      const pulse = 1 + 0.35 * Math.max(0, Math.sin(u * Math.PI));
      signal.scale.setScalar(pulse);
    },
    set(key, v) {
      if (key === "speed") spd = v;
      if (key === "fire") u = 0;
      if (key === "myelin") { myelin = !!v; sheaths.forEach((s) => { s.visible = myelin; }); }
    },
    controls: [
      { key: "speed", label: "Impulse speed", type: "range", min: 0.1, max: 1.5, step: 0.05, value: spd },
      { key: "myelin", label: "Myelin sheath", type: "toggle", value: true },
      { key: "fire", label: "Fire impulse", type: "button" },
    ],
  };
});

/* Photosynthesis — photons in, O₂ out; sunlight slider changes the rate. */
register("bio-photo", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);

  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 40, 40),
    new THREE.MeshStandardMaterial({ color: "#4f9d3f", emissive: "#2f7a2a", emissiveIntensity: 0.12 }));
  leaf.scale.set(1.5, 0.1, 0.9);
  g.add(leaf);
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 1.1, 10),
    new THREE.MeshStandardMaterial({ color: "#3e7d33" }));
  stem.position.y = -0.62;
  g.add(stem);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#ffd27a", emissive: "#ffc476", emissiveIntensity: 1.6 }));
  sun.position.set(3.4, 2.6, -1.2);
  g.add(sun);

  const photonMat = new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffe9a8", emissiveIntensity: 1.5 });
  const o2Mat = new THREE.MeshStandardMaterial({ color: "#8ec07c", emissive: "#8ec07c", emissiveIntensity: 0.9 });
  const co2Mat = new THREE.MeshStandardMaterial({ color: "#b9a58a" });

  const lerpV = (a, b, t) => new THREE.Vector3().lerpVectors(a, b, t);
  const leafTop = (off) => new THREE.Vector3(off.x, 0.16, off.z);
  const sunPt = () => sun.position.clone();

  const photons = [];
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), photonMat);
    g.add(m);
    photons.push({ m, t: i / 10, off: new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.05, (Math.random() - 0.5) * 1.0) });
  }
  const co2s = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), co2Mat);
    g.add(m);
    co2s.push({ m, t: i / 6, off: new THREE.Vector3((Math.random() - 0.5) * 1.2, 1.4 + Math.random() * 0.6, (Math.random() - 0.5) * 1.2) });
  }
  const o2s = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), o2Mat);
    g.add(m);
    o2s.push({ m, t: i / 6, off: new THREE.Vector3((Math.random() - 0.5) * 1.6, 1.6 + Math.random() * 0.8, (Math.random() - 0.5) * 1.6) });
  }

  let rate = 1;
  return {
    tick(t, dt) {
      sun.material.emissiveIntensity = 0.6 + rate * 1.2;
      leaf.rotation.z = Math.sin(t * 0.7) * 0.04;
      for (const p of photons) {
        p.t += dt * 0.55 * rate;
        if (p.t > 1) p.t -= 1;
        p.m.position.copy(lerpV(sunPt(), leafTop(p.off), p.t));
        p.m.visible = rate > 0.15;
      }
      for (const c of co2s) {
        c.t += dt * 0.3 * rate;
        if (c.t > 1) c.t -= 1;
        const src = new THREE.Vector3(c.off.x + 3.2, c.off.y, c.off.z);
        c.m.position.copy(lerpV(src, leafTop(c.off), c.t));
      }
      for (const o of o2s) {
        o.t += dt * 0.32 * rate;
        if (o.t > 1) o.t -= 1;
        const dst = new THREE.Vector3(o.off.x - 2.4, o.off.y + 0.8, o.off.z - 0.6);
        o.m.position.copy(lerpV(leafTop(o.off), dst, o.t));
      }
    },
    set(key, v) { if (key === "rate") rate = v; },
    controls: [
      { key: "rate", label: "Sunlight intensity", type: "range", min: 0, max: 2, step: 0.05, value: 1 },
    ],
  };
});

/* Heart — four chambers squeezing in sequence with a pacemaker flash. */
register("bio-heart", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const muscle = (c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.14 });
  const ra = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), muscle("#8b5a6b"));
  ra.position.set(-0.75, 0.55, 0);
  const la = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 24), muscle("#9d5f5f"));
  la.position.set(0.75, 0.6, 0);
  const rv = new THREE.Mesh(new THREE.SphereGeometry(0.85, 28, 28), muscle("#a34d4d"));
  rv.position.set(-0.55, -0.55, 0);
  const lv = new THREE.Mesh(new THREE.SphereGeometry(0.95, 28, 28), muscle("#b0413e"));
  lv.position.set(0.6, -0.6, 0);
  g.add(ra, la, rv, lv);

  const vesselMat = new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.2 });
  const aorta = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.16, 12, 24, Math.PI * 1.2), new THREE.MeshStandardMaterial({ color: "#e86f52" }));
  aorta.position.set(0.15, 1.35, 0);
  aorta.rotation.z = 0.4;
  const vena = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.2, 12), vesselMat);
  vena.position.set(-1.25, 1.45, 0);
  g.add(aorta, vena);

  const saNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 10, 10),
    new THREE.MeshStandardMaterial({ color: "#fff3c4", emissive: "#ffc476", emissiveIntensity: 1.6 }));
  saNode.position.copy(ra.position).add(new THREE.Vector3(-0.3, 0.3, 0));
  g.add(saNode);

  const blood = [];
  for (let i = 0; i < 10; i++) {
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.5 }));
    b.userData.u = i / 10;
    g.add(b);
    blood.push(b);
  }

  const rest = { ra: ra.scale.clone(), la: la.scale.clone(), rv: rv.scale.clone(), lv: lv.scale.clone() };
  let rate = 1;
  function beat(phase, t) {
    const pump = (mesh, restScale, start) => {
      const local = ((phase - start + 1) % 1);
      const k = local < 0.18 ? 1 - Math.sin((local / 0.18) * Math.PI) * 0.22 : 1;
      mesh.scale.set(restScale.x * k, restScale.y * k, restScale.z * k);
    };
    pump(rv, rest.rv, 0);
    pump(lv, rest.lv, 0);
    pump(ra, rest.ra, 0.5);
    pump(la, rest.la, 0.5);
    saNode.material.emissiveIntensity = phase < 0.1 ? 2.2 : 0.9 + Math.sin(t * 3) * 0.2;
  }
  return {
    tick(t, dt) {
      const bpm = 40 + rate * 50;
      beat((t * bpm / 60) % 1, t);
      g.rotation.y += dt * 0.12;
      for (const b of blood) {
        b.userData.u += dt * 0.22 * rate;
        if (b.userData.u > 1) b.userData.u -= 1;
        const u = b.userData.u;
        if (u < 0.5) b.position.set(-1.25 + u * 1.4, 1.45 - u * u * 1.6, 0.3);
        else b.position.set(0.15 + (u - 0.5) * 2.2, -0.1 + Math.sin((u - 0.5) * Math.PI) * 1.1, 0.45);
      }
    },
    set(key, v) { if (key === "rate") rate = v; },
    controls: [{ key: "rate", label: "Heart rate", type: "range", min: 0.4, max: 2.5, step: 0.05, value: 1 }],
  };
});

/* Protein synthesis — DNA unzips, mRNA transcript feeds a ribosome building a peptide. */
register("bio-synth", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);

  const baseMatA = new THREE.MeshStandardMaterial({ color: "#69a7d8", emissive: "#69a7d8", emissiveIntensity: 0.3 });
  const baseMatB = new THREE.MeshStandardMaterial({ color: "#e86f52", emissive: "#e86f52", emissiveIntensity: 0.3 });
  const rungMat = new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffc476", emissiveIntensity: 0.3 });
  const dnaG = new THREE.Group();
  dnaG.position.set(-2.4, 0, 0);
  g.add(dnaG);
  const N = 10;
  for (let i = 0; i < N; i++) {
    const y = (i - N / 2) * 0.34;
    const th = i * 0.7;
    const pa = new THREE.Vector3(Math.cos(th) * 0.5, y, Math.sin(th) * 0.5);
    const pb = new THREE.Vector3(Math.cos(th + Math.PI) * 0.5, y, Math.sin(th + Math.PI) * 0.5);
    const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), baseMatA); s1.position.copy(pa);
    const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), baseMatB); s2.position.copy(pb);
    const dir = pb.clone().sub(pa);
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, dir.length(), 6), rungMat);
    rung.position.copy(pa.clone().add(pb).multiplyScalar(0.5));
    rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    dnaG.add(s1, s2, rung);
  }

  const mrnaPts = [];
  for (let i = 0; i <= 20; i++) mrnaPts.push(new THREE.Vector3(-1.4 + i * 0.16, Math.sin(i * 0.9) * 0.06, 0.9));
  const mrna = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(mrnaPts),
    new THREE.LineBasicMaterial({ color: "#ffc476" }));
  g.add(mrna);

  const riboLarge = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 20, 20),
    new THREE.MeshStandardMaterial({ color: "#8fbf6f", transparent: true, opacity: 0.85 }));
  riboLarge.scale.set(1.3, 0.8, 1);
  const riboSmall = riboLarge.clone();
  riboSmall.material = new THREE.MeshStandardMaterial({ color: "#5f8f43", transparent: true, opacity: 0.85 });
  riboSmall.scale.set(1.1, 0.55, 0.9);
  const riboG = new THREE.Group();
  riboG.add(riboLarge, riboSmall);
  riboSmall.position.y = -0.28;
  riboLarge.position.y = 0.22;
  g.add(riboG);

  const aaCols = ["#69a7d8", "#e86f52", "#c678dd", "#8ec07c"];
  const chain = [];
  for (let i = 0; i < 12; i++) {
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 12, 12),
      new THREE.MeshStandardMaterial({ color: aaCols[i % 4], emissive: aaCols[i % 4], emissiveIntensity: 0.3 }));
    bead.visible = false;
    g.add(bead);
    chain.push(bead);
  }
  let u = 0, spd = 0.12;
  return {
    tick(_t, dt) {
      u += dt * spd;
      if (u > 1.2) u = 0;
      const rx = -1.4 + Math.min(u, 1) * 3.2;
      riboG.position.set(rx, 0.95, 0.9);
      dnaG.rotation.y += dt * 0.25;
      const grown = Math.floor(Math.min(u, 1) * chain.length);
      chain.forEach((bead, i) => {
        bead.visible = i < grown;
        if (bead.visible) {
          const ti = i / (chain.length - 1 || 1);
          bead.position.set(rx - 0.9 - i * 0.19, 0.35 - Math.sin(ti * 3) * 0.12, 0.35);
        }
      });
    },
    set(key, v) { if (key === "speed") spd = v; },
    controls: [{ key: "speed", label: "Transcription speed", type: "range", min: 0.03, max: 0.4, step: 0.01, value: spd }],
  };
});

/* Mitosis: chromosomes condense, align, split — stage by stage. */
register("bio-mitosis", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const cell = new THREE.Mesh(
    new THREE.SphereGeometry(2.4, 24, 24),
    new THREE.MeshStandardMaterial({ color: "#9db8c9", transparent: true, opacity: 0.16 }));
  g.add(cell);
  const chromMat = new THREE.MeshStandardMaterial({ color: "#c678dd", emissive: "#c678dd", emissiveIntensity: 0.55 });
  const arms = [];
  for (let i = 0; i < 4; i++) {
    const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 4, 8), chromMat);
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.5, 4, 8), chromMat);
    g.add(a, b);
    arms.push([a, b]);
  }
  const spindleMat = new THREE.LineBasicMaterial({ color: "#8a7c68", transparent: true, opacity: 0.5 });
  const spindleGeo = new THREE.BufferGeometry().setFromPoints(
    [new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, 2.2, 0)]);
  const spindle = new THREE.Line(spindleGeo, spindleMat);
  g.add(spindle);
  let stage = 2, play = true, t = 0;
  const STAGENAMES = ["Interphase", "Prophase", "Metaphase", "Anaphase", "Telophase"];
  function layout() {
    const s = stage;
    arms.forEach(([a, b], i) => {
      const off = (i - 1.5) * 0.55;
      let spread, yy;
      if (s <= 1) { spread = 0.12; yy = Math.sin(i * 1.7) * 0.9; }
      else if (s === 2) { spread = 0.12; yy = off; }
      else if (s === 3) { spread = 0.55; yy = off; }
      else { spread = 1.05; yy = off * 0.7; }
      a.position.set(-spread, yy, 0);
      b.position.set(spread, yy, 0);
      a.rotation.z = 0.5; b.rotation.z = -0.5;
      const vis = s >= 1;
      a.visible = b.visible = vis;
      const sc = s === 0 ? 0.4 : 1;
      a.scale.set(sc, sc, sc); b.scale.set(sc, sc, sc);
    });
    spindle.visible = s >= 1 && s <= 3;
  }
  layout();
  return {
    tick(_t, dt) {
      if (play) {
        t += dt;
        if (t > 2.2) { t = 0; stage = (stage + 1) % 5; layout(); }
      }
    },
    set(key, v) {
      if (key === "stage") { stage = Math.round(v); play = false; layout(); }
      if (key === "play") { play = !play; if (play) t = 0; }
    },
    controls: [
      { key: "stage", label: "Stage (0–4)", type: "range", min: 0, max: 4, step: 1, value: stage },
      { key: "play", label: "Auto-play cycle", type: "button" },
    ],
  };
});

/* Nephron: filtrate flows the tubule, ADH decides how much water stays. */
register("bio-nephron", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const path = [
    new THREE.Vector3(-2.6, 1.6, 0), new THREE.Vector3(-1.2, 1.6, 0),
    new THREE.Vector3(-0.6, 0.4, 0), new THREE.Vector3(-0.6, -1.4, 0),
    new THREE.Vector3(0.6, -1.4, 0), new THREE.Vector3(0.6, 0.2, 0),
    new THREE.Vector3(1.4, 1.0, 0), new THREE.Vector3(2.6, 1.0, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(path);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 60, 0.16, 10, false),
    new THREE.MeshStandardMaterial({ color: "#e8b4b8", transparent: true, opacity: 0.5 }));
  g.add(tube);
  const cup = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.6),
    new THREE.MeshStandardMaterial({ color: "#c678dd", transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
  cup.position.set(-2.6, 1.6, 0);
  cup.rotation.x = Math.PI;
  g.add(cup);
  const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const dotMat = new THREE.MeshStandardMaterial({ color: "#7dd3fc", emissive: "#7dd3fc", emissiveIntensity: 0.9 });
  const dots = [];
  for (let i = 0; i < 22; i++) {
    const d = new THREE.Mesh(dotGeo, dotMat);
    d.userData.u = Math.random();
    g.add(d);
    dots.push(d);
  }
  const outBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 0.2),
    new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.5 }));
  outBar.position.set(3.3, 0.2, 0);
  g.add(outBar);
  let flow = 1, adh = 1;
  return {
    tick(_t, dt) {
      for (const d of dots) {
        d.userData.u += dt * 0.12 * flow;
        if (d.userData.u > 1) d.userData.u -= 1;
        const p = curve.getPoint(d.userData.u);
        d.position.copy(p);
        d.visible = d.userData.u < 0.55 || Math.random() < 0.35 + adh * 0.3;
      }
      const urine = Math.max(0.06, 1 - adh * 0.75);
      outBar.scale.y = urine;
      outBar.position.y = 0.2 - 1.6 * (1 - urine) / 2;
    },
    set(key, v) {
      if (key === "flow") flow = v;
      if (key === "adh") adh = v ? 1 : 0;
    },
    controls: [
      { key: "flow", label: "Filtration rate", type: "range", min: 0.3, max: 2, step: 0.1, value: flow },
      { key: "adh", label: "ADH present", type: "toggle", value: true },
    ],
  };
});

/* Lung: bronchial tree inflates alveoli on a breathing cycle. */
register("bio-lung", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const tubeMat = new THREE.MeshStandardMaterial({ color: "#e8b4b8", transparent: true, opacity: 0.8 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.6, 12), tubeMat);
  trunk.position.set(0, 1.6, 0);
  g.add(trunk);
  const sacs = [];
  const sacMat = new THREE.MeshStandardMaterial({ color: "#f2a33c", emissive: "#f2a33c", emissiveIntensity: 0.35, transparent: true, opacity: 0.85 });
  const branches = [[-1, 0.4], [1, 0.4], [-1.7, -0.7], [1.7, -0.7], [-0.9, -1.5], [0.9, -1.5]];
  for (const [bx, by] of branches) {
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.1, 8), tubeMat);
    br.position.set(bx * 0.5, by + 0.5, 0);
    br.rotation.z = bx > 0 ? -0.5 : 0.5;
    g.add(br);
    for (let k = 0; k < 4; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), sacMat.clone());
      s.position.set(bx + (k - 1.5) * 0.28, by - 0.35, (k % 2) * 0.2);
      g.add(s);
      sacs.push(s);
    }
  }
  let rate = 0.5, t = 0;
  return {
    tick(_t, dt) {
      t += dt * rate * 2;
      const infl = 0.75 + 0.45 * Math.sin(t * 2);
      for (const s of sacs) s.scale.set(infl, infl, infl);
      trunk.scale.x = trunk.scale.z = 0.9 + 0.15 * Math.sin(t * 2);
    },
    set(key, v) { if (key === "rate") rate = v; },
    controls: [
      { key: "rate", label: "Breathing rate", type: "range", min: 0.2, max: 1.6, step: 0.1, value: rate },
    ],
  };
});

/* Muscle: sarcomere sliding filaments — Z-discs close on contraction. */
register("bio-muscle", ({ THREE, group }) => {
  const g = new THREE.Group();
  group.add(g);
  const zMat = new THREE.MeshStandardMaterial({ color: "#f5eddc" });
  const zL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.3), zMat);
  const zR = zL.clone();
  g.add(zL, zR);
  const thickMat = new THREE.MeshStandardMaterial({ color: "#60a5fa", emissive: "#60a5fa", emissiveIntensity: 0.4 });
  const thins = [];
  const thinMat = new THREE.MeshStandardMaterial({ color: "#f87171", emissive: "#f87171", emissiveIntensity: 0.4 });
  const thick = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.7, 10), thickMat);
  thick.rotation.z = Math.PI / 2;
  g.add(thick);
  for (let i = 0; i < 6; i++) {
    const side = i < 3 ? -1 : 1;
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 8), thinMat);
    f.rotation.z = Math.PI / 2;
    f.position.y = -0.6 + (i % 3) * 0.6;
    g.add(f);
    thins.push({ m: f, side });
  }
  let contract = 0.4, dir = 1, auto = true;
  function layout() {
    const half = 1.9 - contract * 0.75;
    zL.position.x = -half; zR.position.x = half;
    for (const th of thins) {
      th.m.position.x = th.side * (half - 0.45 - contract * 0.25);
    }
    thick.material.emissiveIntensity = 0.25 + contract * 0.5;
  }
  layout();
  return {
    tick(_t, dt) {
      if (!auto) return;
      contract += dir * dt * 0.5;
      if (contract > 1) { contract = 1; dir = -1; }
      if (contract < 0.15) { contract = 0.15; dir = 1; }
      layout();
    },
    set(key, v) {
      if (key === "pace") { contract = Math.max(0.15, Math.min(1, v)); auto = false; layout(); }
      if (key === "auto") { auto = !auto; }
    },
    controls: [
      { key: "pace", label: "Contraction level", type: "range", min: 0.15, max: 1, step: 0.05, value: contract },
      { key: "auto", label: "Auto cycle", type: "button" },
    ],
  };
});
