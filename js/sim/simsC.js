/* JEE Planner — Chemistry & Modern Physics simulations */

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

/* ── atomic orbitals ──────────────────────────────────────── */
register("atom", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), new THREE.MeshStandardMaterial({ color: "#f87171", emissive: "#f87171", emissiveIntensity: 0.4 }));
  group.add(nucleus);
  const nLbl = makeTextSprite("nucleus", { size: 0.4, color: "#f87171" });
  nLbl.position.set(0, -0.7, 0);
  group.add(nLbl);
  const N = 400;
  const pos = new Float32Array(N * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: "#7aa2ff", size: 0.05, transparent: true, opacity: 0.8 });
  const pts = new THREE.Points(geo, mat);
  group.add(pts);
  const cloudGroup = new THREE.Group();
  group.add(cloudGroup);
  let type = "1s";
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.3, 0);
  group.add(info);
  let lastLbl = "";

  function rebuild() {
    const seed = [];
    const spread = type === "2p" ? 1.9 : type === "2s" ? 1.5 : 1.0;
    while (seed.length < N) {
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 4;
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > 3.2) continue;
      let keep = false;
      if (type === "1s") keep = Math.random() < 2.2 * Math.exp(-r * r / 0.7);
      if (type === "2s") keep = Math.random() < 1.4 * Math.exp(-r * r / 2.2);
      if (type === "2p") keep = Math.random() < 1.2 * (y * y) * Math.exp(-r * r / 2.6);
      if (keep) seed.push([x, y, z]);
    }
    while (seed.length < N) seed.push([(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5]);
    const arr = geo.attributes.position.array;
    seed.forEach((s, i) => { arr[i * 3] = s[0]; arr[i * 3 + 1] = s[1]; arr[i * 3 + 2] = s[2]; });
    geo.attributes.position.needsUpdate = true;
    const txt = type === "1s" ? "1s orbital — spherical, highest probability at nucleus" : type === "2s" ? "2s orbital — spherical with radial node" : "2p orbital — two lobes along the y-axis (dumbbell)";
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.3, 0);
      group.add(info);
    }
  }
  rebuild();
  const controls = [{ key: "orb", label: "Orbital", type: "select", value: "1s", options: ["1s", "2s", "2p"] }];
  return {
    controls,
    set(key, v) { type = v; rebuild(); },
    tick(t) { pts.rotation.y = t * 0.15; },
  };
});

/* ── nucleus & decay ──────────────────────────────────────── */
register("nucleus", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const protons = [], neutrons = [];
  const np = 12, nn = 14;
  const rN = 1.1;
  for (let i = 0; i < np + nn; i++) {
    const x = (Math.random() - 0.5) * rN;
    const y = (Math.random() - 0.5) * rN;
    const z = (Math.random() - 0.5) * rN;
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: i < np ? "#f87171" : "#60a5fa" })
    );
    m.position.set(x, y, z);
    group.add(m);
    (i < np ? protons : neutrons).push(m);
  }
  const decays = [];
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.3, 0);
  group.add(info);
  let rate = 1, Nnuc = 100;
  const controls = [
    { key: "rate", label: "Decay rate λ", min: 0.1, max: 3, step: 0.05, value: 1 },
    { key: "reset", label: "Reset nuclei", type: "button" },
  ];
  let lastLbl = "";
  return {
    controls,
    set(key, v) {
      if (key === "rate") rate = v;
      if (key === "reset") { Nnuc = 100; for (const d of decays) { if (d.obj) { group.remove(d.obj); disposeObj(d.obj); } } decays.length = 0; }
    },
    tick(t, dt) {
      Nnuc = Math.max(0, Nnuc - rate * dt * 4);
      const p = Math.random();
      if (p < rate * dt * 1.6) {
        const pm = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: "#fbbf24", transparent: true, opacity: 0.9 }));
        group.add(pm);
        decays.push({ x: 0, y: 0, z: 0, vx: (Math.random() - 0.5) * 2.4, vy: Math.random() * 2.6, vz: (Math.random() - 0.5) * 2.4, life: 0, obj: pm });
      }
      for (let i = decays.length - 1; i >= 0; i--) {
        const d = decays[i];
        d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt; d.life += dt;
        const m = d.obj;
        if (m) { m.position.set(d.x, d.y, d.z); m.scale.multiplyScalar(1.02); }
        if (d.life > 2.2) { if (m) { group.remove(m); disposeObj(m); } decays.splice(i, 1); }
      }
      const tHalf = 0.693 / rate;
      const txt = `N = N₀e^(−λt) · N = ${Nnuc.toFixed(0)} · t½ = ${tHalf.toFixed(2)} s`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, 3.3, 0);
        group.add(info);
      }
      group.children.forEach((c) => { if (c !== info && c !== protons[0] && c.geometry) c.rotation.y = t * 0.1; });
    },
  };
});

/* ── semiconductors: band gap ─────────────────────────────── */
register("semi", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const bandMat = new THREE.MeshStandardMaterial({ color: "#7aa2ff", transparent: true, opacity: 0.45 });
  const conduction = new THREE.Mesh(new THREE.BoxGeometry(5, 0.8, 1.6), bandMat);
  conduction.position.y = 1.5;
  const valence = new THREE.Mesh(new THREE.BoxGeometry(5, 0.8, 1.6), new THREE.MeshStandardMaterial({ color: "#4ade80", transparent: true, opacity: 0.45 }));
  valence.position.y = -1.5;
  group.add(conduction, valence);
  const cLbl = makeTextSprite("conduction band", { size: 0.5, color: "#7aa2ff" }); cLbl.position.set(0, 2.2, 0);
  const vLbl = makeTextSprite("valence band", { size: 0.5, color: "#4ade80" }); vLbl.position.set(0, -2.2, 0);
  group.add(cLbl, vLbl);
  const gapLbl = makeTextSprite("band gap E₉", { size: 0.5, color: "#fbbf24" });
  gapLbl.position.set(3.2, 0, 0);
  group.add(gapLbl);

  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 0.4 }));
  electron.position.set(-2, -1.5, 0);
  group.add(electron);
  let photon = null;
  let state = "ground"; // ground | excited | photon-excited
  let photonE = 1.5;
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, -3.4, 0);
  group.add(info);
  let lastLbl = "";
  const controls = [
    { key: "E", label: "Photon energy E (eV)", min: 0.2, max: 3, step: 0.05, value: 1.5 },
    { key: "emit", label: "Fire photon", type: "button" },
  ];
  const bandGap = 1.1;
  return {
    controls,
    set(key, v) {
      if (key === "E") photonE = v;
      if (key === "emit") {
        if (state === "excited") { state = "ground"; electron.position.y = -1.5; }
        if (photonE >= bandGap) {
          state = "excited";
          electron.position.y = 1.5;
        } else if (!photon) {
          photon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: "#f87171", emissive: "#f87171", emissiveIntensity: 0.6 }));
          photon.position.set(-3.2, 0, 0);
          group.add(photon);
        }
      }
    },
    tick(t, dt) {
      if (photon) {
        photon.position.x += dt * 3.4;
        if (photon.position.x > 3.5) {
          const absorbed = photonE >= bandGap;
          if (absorbed && state !== "excited") { state = "excited"; electron.position.y = 1.5; }
          group.remove(photon); disposeObj(photon); photon = null;
        }
      }
      electron.position.x = -2 + Math.sin(t * 2) * 0.05;
      const txt = `band gap = ${bandGap} eV · photon E = ${photonE.toFixed(2)} eV → ${photonE >= bandGap ? "electron promoted (conduction)" : "not enough energy"}`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, -3.4, 0);
        group.add(info);
      }
    },
  };
});

/* ── molecules (VSEPR) ────────────────────────────────────── */
register("molecule", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  let shape = "ch4";
  const shapeGroup = new THREE.Group();
  group.add(shapeGroup);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.3, 0);
  group.add(info);
  let lastLbl = "";

  const shapes = {
    co2: { atoms: { C: [0, 0, 0], O1: [1.6, 0, 0], O2: [-1.6, 0, 0] }, bonds: [["C","O1"],["C","O2"]], name: "CO₂ — linear (sp)", color: "#60a5fa" },
    h2o: { atoms: { O: [0, 0, 0], H1: [0.85, 0.9, 0], H2: [-0.85, 0.9, 0] }, bonds: [["O","H1"],["O","H2"]], name: "H₂O — bent, 104.5° (sp³)", color: "#60a5fa" },
    nh3: { atoms: { N: [0, 0, 0], H1: [0, 1.0, 0.5], H2: [0.87, -0.5, -0.3], H3: [-0.87, -0.5, -0.3] }, bonds: [["N","H1"],["N","H2"],["N","H3"]], name: "NH₃ — trigonal pyramidal (sp³)", color: "#60a5fa" },
    ch4: { atoms: { C: [0, 0, 0], H1: [0.9, 0.9, 0], H2: [-0.9, 0.9, 0], H3: [0.9, -0.9, 0], H4: [-0.9, -0.9, 0] }, bonds: [["C","H1"],["C","H2"],["C","H3"],["C","H4"]], name: "CH₄ — tetrahedral, 109.5° (sp³)", color: "#60a5fa" },
  };
  const radii = { C: 0.4, O: 0.4, N: 0.4, H: 0.22 };

  function rebuild() {
    while (shapeGroup.children.length) { const c = shapeGroup.children[0]; shapeGroup.remove(c); disposeObj(c); }
    const s = shapes[shape];
    for (const [name, pos] of Object.entries(s.atoms)) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(radii[name] || 0.3, 20, 20),
        new THREE.MeshStandardMaterial({ color: name === "C" ? "#4b5261" : name === "O" ? "#f87171" : name === "N" ? "#60a5fa" : "#949ba8" })
      );
      m.position.set(...pos);
      shapeGroup.add(m);
    }
    for (const [a, b] of s.bonds) {
      const pa = new THREE.Vector3(...s.atoms[a]);
      const pb = new THREE.Vector3(...s.atoms[b]);
      const mid = new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5);
      const len = pa.distanceTo(pb);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, len, 10), new THREE.MeshStandardMaterial({ color: "#d7dae0" }));
      cyl.position.copy(mid);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pb.clone().sub(pa).normalize());
      shapeGroup.add(cyl);
    }
    const txt = s.name;
    if (txt !== lastLbl) {
      lastLbl = txt;
      disposeObj(info); group.remove(info);
      info = makeTextSprite(txt, { size: 0.55 });
      info.position.set(0, 3.3, 0);
      group.add(info);
    }
  }
  rebuild();
  const controls = [{ key: "shape", label: "Molecule", type: "select", value: "ch4", options: ["ch4", "nh3", "h2o", "co2"] }];
  return { controls, set(key, v) { shape = v; rebuild(); }, tick(t) { shapeGroup.rotation.y = t * 0.35; } };
});

/* ── dynamic equilibrium ──────────────────────────────────── */
register("equilibrium", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const boxA = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.4), new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.2 }));
  boxA.position.x = -1.6;
  const boxB = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.4), new THREE.MeshStandardMaterial({ color: "#34d399", transparent: true, opacity: 0.2 }));
  boxB.position.x = 1.6;
  group.add(boxA, boxB);
  const lA = makeTextSprite("A", { size: 0.7, color: "#60a5fa" }); lA.position.set(-1.6, -1.7, 0);
  const lB = makeTextSprite("B", { size: 0.7, color: "#34d399" }); lB.position.set(1.6, -1.7, 0);
  group.add(lA, lB);
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 3.2, 0);
  group.add(info);

  const N = 40;
  const mols = [];
  for (let i = 0; i < N; i++) {
    const side = Math.random() < 0.7 ? 0 : 1;
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 16, 16),
      new THREE.MeshStandardMaterial({ color: side === 0 ? "#60a5fa" : "#34d399" })
    );
    m.userData.side = side;
    m.position.set((Math.random() - 0.5) * 2 + (side === 0 ? -1.6 : 1.6), (Math.random() - 0.5) * 2, 0);
    group.add(m);
    mols.push(m);
  }
  let kf = 1, kb = 0.6, lastLbl = "";
  let counts = { a: 28, b: 12 };
  const controls = [
    { key: "kf", label: "Forward rate k₁", min: 0, max: 3, step: 0.05, value: 1 },
    { key: "kb", label: "Reverse rate k₂", min: 0, max: 3, step: 0.05, value: 0.6 },
  ];
  return {
    controls,
    set(key, v) { if (key === "kf") kf = v; if (key === "kb") kb = v; },
    tick(t, dt) {
      let flips = 0;
      for (const m of mols) {
        const roll = Math.random();
        if (m.userData.side === 0 && roll < kf * dt * 1.4) {
          m.userData.side = 1; m.material.color.setHex(0x34d399); flips++;
        } else if (m.userData.side === 1 && roll < kb * dt * 1.4) {
          m.userData.side = 0; m.material.color.setHex(0x60a5fa); flips++;
        }
        const targetX = m.userData.side === 0 ? -1.6 : 1.6;
        m.position.x += (targetX - m.position.x) * 0.05;
        m.position.y = Math.sin(t * 2 + m.position.x * 3) * 0.15;
      }
      counts.a = mols.filter((m) => m.userData.side === 0).length;
      counts.b = N - counts.a;
      const K = kf / kb;
      const txt = `A ⇌ B · K = k₁/k₂ = ${K.toFixed(2)} · [A]=${counts.a} [B]=${counts.b} → ${Math.abs(counts.b / Math.max(counts.a, 1) - K) < 0.4 ? "near equilibrium" : "still shifting"}`;
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

/* ── electrolysis cell ────────────────────────────────────── */
register("electrolysis", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const tank = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 3.6), new THREE.MeshStandardMaterial({ color: "#60a5fa", transparent: true, opacity: 0.14, side: THREE.DoubleSide }));
  tank.position.y = -1.1;
  group.add(tank);
  const water = new THREE.Mesh(new THREE.BoxGeometry(3.62, 2.2, 3.62), new THREE.MeshStandardMaterial({ color: "#4ade80", transparent: true, opacity: 0.1 }));
  water.position.y = -1.1;
  group.add(water);
  const cathode = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), new THREE.MeshStandardMaterial({ color: "#f87171" }));
  cathode.position.set(-1.2, 0, 0);
  const anode = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), new THREE.MeshStandardMaterial({ color: "#4ade80" }));
  anode.position.set(1.2, 0, 0);
  group.add(cathode, anode);
  const cL = makeTextSprite("cathode (−)", { size: 0.4, color: "#f87171" }); cL.position.set(-1.2, 1.6, 0);
  const aL = makeTextSprite("anode (+)", { size: 0.4, color: "#4ade80" }); aL.position.set(1.2, 1.6, 0);
  group.add(cL, aL);
  const N = 70;
  const ions = [];
  for (let i = 0; i < N; i++) {
    const sign = i % 2 === 0 ? 1 : -1;
    ions.push({
      sign,
      x: (Math.random() - 0.5) * 3.2,
      y: (Math.random() - 0.5) * 3.2,
      z: (Math.random() - 0.5) * 3.2,
      m: new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 12),
        new THREE.MeshStandardMaterial({ color: sign > 0 ? "#fbbf24" : "#7aa2ff" })
      ),
    });
  }
  const ionsG = new THREE.Group();
  ions.forEach((io) => ionsG.add(io.m));
  group.add(ionsG);
  let current = 1.4;
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, -3.4, 0);
  group.add(info);
  let deposited = 0, lastLbl = "";
  const controls = [
    { key: "I", label: "Current I", min: 0.1, max: 3, step: 0.05, value: 1.4 },
    { key: "reset", label: "Reset ions", type: "button" },
  ];
  return {
    controls,
    set(key, v) {
      if (key === "I") current = v;
      if (key === "reset") {
        ions.forEach((io) => { io.x = (Math.random() - 0.5) * 3.2; io.y = (Math.random() - 0.5) * 3.2; io.z = (Math.random() - 0.5) * 3.2; });
        deposited = 0;
      }
    },
    tick(t, dt) {
      for (const io of ions) {
        const targetX = io.sign > 0 ? 1.2 : -1.2;
        io.x += (targetX - io.x) * 0.03 * current * 0.4;
        io.y += (Math.random() - 0.5) * dt * 0.3;
        io.z += (Math.random() - 0.5) * dt * 0.3;
        if (Math.abs(io.x - targetX) < 0.15) {
          io.x = (Math.random() - 0.5) * 3.2;
          io.y = (Math.random() - 0.5) * 3.2;
          if (io.sign > 0) deposited += 0.4;
        }
        io.m.position.set(io.x, io.y, io.z);
      }
      const m = current * deposited * 0.05;
      const txt = `Ions migrate to opposite electrodes · mass deposited ∝ I·t (Faraday) · m ≈ ${m.toFixed(2)} mg`;
      if (txt !== lastLbl) {
        lastLbl = txt;
        disposeObj(info); group.remove(info);
        info = makeTextSprite(txt, { size: 0.55 });
        info.position.set(0, -3.4, 0);
        group.add(info);
      }
    },
  };
});

/* ── photoelectric effect ─────────────────────────────────── */
register("photo", ({ THREE, group, makeGrid, makeTextSprite }) => {
  group.add(makeGrid(3, 6));
  const metal = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 2.4), new THREE.MeshStandardMaterial({ color: "#8b93a1", metalness: 0.8, roughness: 0.3 }));
  metal.position.y = -1.6;
  group.add(metal);
  const mLbl = makeTextSprite("metal (work function φ = 2.0 eV)", { size: 0.45, color: "#8b93a1" });
  mLbl.position.set(0, -2.3, 0);
  group.add(mLbl);
  let photon = null;
  let electron = null;
  let freq = 3; // in eV-equivalent units
  let info = makeTextSprite("", { size: 0.55 });
  info.position.set(0, 2.8, 0);
  group.add(info);
  let lastLbl = "";
  const controls = [
    { key: "freq", label: "Photon energy hν (eV)", min: 0.5, max: 5, step: 0.05, value: 3 },
    { key: "fire", label: "Fire photon", type: "button" },
  ];
  const phi = 2.0;
  return {
    controls,
    set(key, v) {
      if (key === "freq") freq = v;
      if (key === "fire") {
        photon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 0.6 }));
        photon.position.set(-2.8, -1.4, 0);
        group.add(photon);
      }
    },
    tick(t, dt) {
      if (photon) {
        photon.position.x += dt * 2.6;
        if (photon.position.x >= 0) {
          group.remove(photon); disposeObj(photon); photon = null;
          if (freq >= phi && !electron) {
            electron = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshStandardMaterial({ color: "#60a5fa", emissive: "#60a5fa", emissiveIntensity: 0.5 }));
            electron.position.set(0, -1.3, 0);
            group.add(electron);
          }
        }
      }
      if (electron) {
        electron.position.x += dt * (freq - phi) * 1.8;
        electron.position.y += dt * (freq - phi) * 2.2;
        if (electron.position.x > 3.2) { group.remove(electron); disposeObj(electron); electron = null; }
      }
      const ke = freq >= phi ? freq - phi : 0;
      const txt = freq >= phi
        ? `E = hν − φ = ${ke.toFixed(2)} eV — electron emitted`
        : `hν = ${freq.toFixed(2)} eV < φ = ${phi} eV — no emission, however intense!`;
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
