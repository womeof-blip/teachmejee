/* JEE Planner — Three.js simulation engine.
   Mounts a registered simulation into a canvas with orbit controls, lights,
   grid, resize handling and a dispose lifecycle. */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const SIMS = {};

export function register(name, factory) {
  SIMS[name] = factory;
}

export function hasSim(name) {
  return !!SIMS[name];
}

export function makeTextSprite(text, { size = 0.6, color = "#d7dae0", bg = "rgba(13,15,19,0.75)" } = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = "600 42px -apple-system, Segoe UI, Arial, sans-serif";
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 36;
  const h = 64;
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(8, 8, w - 16, h - 16, 12);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  const scale = size * (w / h) * 0.75;
  sprite.scale.set(scale, size * 0.75, 1);
  return sprite;
}

export function makeArrow(from, to, color = "#7aa2ff", headLen = 0.35, headW = 0.22) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  if (len < 1e-6) return new THREE.Group();
  const g = new THREE.Group();
  const cyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, len, 8),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 })
  );
  cyl.position.set(0, len / 2, 0);
  cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.add(cyl);
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(headW, headLen, 12),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 })
  );
  cone.position.copy(to);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.add(cone);
  g.userData.from = from.clone();
  g.userData.to = to.clone();
  return g;
}

export function makePoint(pos, color = "#fbbf24", r = 0.12) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(r, 16, 16),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4 })
  );
  m.position.copy(pos);
  return m;
}

export function makeAxes(scale = 1, labels = true) {
  const g = new THREE.Group();
  const s = scale;
  const colors = { x: "#f87171", y: "#4ade80", z: "#60a5fa" };
  const vecs = { x: new THREE.Vector3(s, 0, 0), y: new THREE.Vector3(0, s, 0), z: new THREE.Vector3(0, 0, s) };
  for (const [k, c] of Object.entries(colors)) {
    g.add(makeArrow(new THREE.Vector3(0, 0, 0), vecs[k], c, 0.18, 0.12));
    if (labels) {
      const t = makeTextSprite(k.toUpperCase(), { size: 0.7, color: c });
      t.position.copy(vecs[k]).multiplyScalar(1.18);
      g.add(t);
    }
  }
  return g;
}

export function makeGrid(size = 5, divisions = 10) {
  return new THREE.GridHelper(size * 2, divisions * 2, "#333a47", "#22262e");
}

export function makeTrail(color = "#7aa2ff", maxPts = 200, width = 3) {
  const pts = [];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(maxPts * 3), 3));
  geo.setDrawRange(0, 0);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  const line = new THREE.Line(geo, mat);
  line.frustumCulled = false;
  const trail = {
    line,
    pts,
    maxPts,
    push(v3) {
      trail.pts.push(v3.clone());
      if (trail.pts.length > maxPts) trail.pts.shift();
      const arr = line.geometry.attributes.position.array;
      trail.pts.forEach((p, i) => arr.set([p.x, p.y, p.z], i * 3));
      line.geometry.attributes.position.needsUpdate = true;
      line.geometry.setDrawRange(0, trail.pts.length);
    },
    clear() {
      trail.pts.length = 0;
      line.geometry.setDrawRange(0, 0);
    },
  };
  return trail;
}

function makeEnv(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x0a0c10, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  camera.position.set(5, 4, 7);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1.6);
  dir.position.set(4, 8, 5);
  scene.add(dir);
  const rim = new THREE.DirectionalLight(0x8ab4ff, 0.6);
  rim.position.set(-6, -2, -6);
  scene.add(rim);

  return { renderer, scene, camera, controls };
}

export function mountSim(canvas, name) {
  const factory = SIMS[name];
  if (!factory) {
    throw new Error(`Unknown simulation "${name}"`);
  }
  const { renderer, scene, camera, controls } = makeEnv(canvas);
  const group = new THREE.Group();
  scene.add(group);

  const ctx = { THREE, scene, group, camera, controls, makeTextSprite, makeArrow, makePoint, makeAxes, makeGrid, makeTrail };
  let sim;
  try {
    sim = factory(ctx);
  } catch (err) {
    renderer.dispose();
    throw err;
  }

  const clock = new THREE.Clock();
  let raf = 0;
  let disposed = false;

  const render = () => {
    if (disposed) return;
    raf = requestAnimationFrame(render);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (sim && typeof sim.tick === "function") {
      try { sim.tick(t, dt); } catch {}
    }
    controls.update();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  render();

  return {
    get controls() { return sim && sim.controls ? sim.controls : []; },
    setControl(key, val) { if (sim && typeof sim.set === "function") sim.set(key, val); },
    resetView() {
      camera.position.set(5, 4, 7);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (sim && typeof sim.dispose === "function") { try { sim.dispose(); } catch {} }
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      renderer.dispose();
    },
  };
}
