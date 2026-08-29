/* TeachMeJEE — welcome hero scene: glossy orbiting solids with mouse parallax.
   Loaded lazily by the Welcome view; silently skipped when three.js is unavailable. */

export async function initHero(canvas) {
  let THREE;
  try { THREE = await import("three"); } catch { return null; }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);
  camera.position.set(0, 0.6, 7.4);

  scene.add(new THREE.AmbientLight(0xfff2dc, 0.75));
  const key = new THREE.DirectionalLight(0xffd9a0, 2.2);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe86f52, 1.1);
  rim.position.set(-5, -3, -4);
  scene.add(rim);

  const group = new THREE.Group();
  scene.add(group);

  const glass = (color, opacity = 0.55) => new THREE.MeshPhysicalMaterial({
    color, metalness: 0.1, roughness: 0.12, transparent: true, opacity,
    clearcoat: 1, clearcoatRoughness: 0.15,
  });

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.3, 160, 24), glass("#f2a33c", 0.85));
  group.add(knot);

  const shells = [];
  for (let i = 0; i < 3; i++) {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.7 + i * 0.42, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#69a7d8", transparent: true, opacity: 0.07 - i * 0.015, side: THREE.DoubleSide }));
    shell.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    group.add(shell);
    shells.push(shell);
  }
  const electrons = [];
  for (let i = 0; i < 6; i++) {
    const e = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 10),
      new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#ffb454", emissiveIntensity: 1.8 }));
    group.add(e);
    electrons.push({ mesh: e, ring: i % 3, phase: (i / 6) * Math.PI * 2, speed: 0.9 + (i % 3) * 0.35 });
  }

  for (let i = 0; i < 26; i++) {
    const dust = new THREE.Mesh(
      new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 6, 6),
      new THREE.MeshBasicMaterial({ color: "#ffd9a0", transparent: true, opacity: 0.5 }));
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 3.4;
    dust.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 3.4, Math.sin(a) * r - 1);
    dust.userData.float = Math.random() * Math.PI * 2;
    group.add(dust);
    electrons.push({ mesh: dust, dust: true, phase: dust.userData.float });
  }

  function resize() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth || 480;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight || 320;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);

  const mouse = { x: 0, y: 0 };
  function onMove(ev) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
  }
  window.addEventListener("mousemove", onMove, { passive: true });

  let raf = 0, disposed = false;
  const clock = new THREE.Clock ? null : null;
  let last = performance.now();
  const loop = () => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;

    knot.rotation.x = t * 0.32 + mouse.y * 0.25;
    knot.rotation.y = t * 0.44 + mouse.x * 0.35;
    knot.position.y = Math.sin(t * 0.8) * 0.14;

    shells.forEach((sh, i) => {
      sh.rotation.y += dt * (0.12 + i * 0.06) * (i % 2 ? -1 : 1);
      sh.rotation.z += dt * 0.04;
    });

    for (const e of electrons) {
      if (e.dust) {
        e.mesh.position.y += Math.sin(t * 0.7 + e.phase) * 0.0012;
        continue;
      }
      const rr = 1.7 + e.ring * 0.42;
      const th = t * e.speed + e.phase;
      e.mesh.position.set(Math.cos(th) * rr, Math.sin(th * 1.3) * 0.5, Math.sin(th) * rr);
    }

    camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (0.6 - mouse.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  loop();

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
    },
  };
}
