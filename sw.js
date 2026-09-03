/* TeachMeJEE service worker v2.
   - Network-first for HTML/JS/CSS so updates always land (cache = offline fallback)
   - Stale-while-revalidate for other same-origin assets
   - Version bump + skipWaiting + clients claim => no stale mixed-version ghosts */
const CACHE = "tmj-v16";
const CORE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./manifest.json",
  "./js/app.js", "./js/views.js", "./js/store.js", "./js/api.js", "./js/data.js",
  "./js/planner.js", "./js/questions.js", "./js/pyq.js", "./js/neet.js", "./js/tutor.js",
  "./js/fx.js", "./js/extras.js", "./js/settings.js", "./js/foundation.js",
  "./js/notes/index.js", "./js/notes/p1.js", "./js/notes/p2.js", "./js/notes/p3.js",
  "./js/notes/c1.js", "./js/notes/c2.js", "./js/notes/c3.js", "./js/notes/m1.js", "./js/notes/m2.js", "./js/notes/advanced.js", "./js/quantum.js", "./js/features.js", "./js/notes/subtopics.js", "./js/sim/factory.js",
  "./js/sim/index.js", "./js/sim/engine.js", "./js/sim/simsA.js", "./js/sim/simsB.js",
  "./js/sim/simsB2.js", "./js/sim/simsC.js", "./js/sim/simsBio.js", "./js/sim/simsD.js",
  "./js/sim/simsE.js", "./js/sim/hero.js",
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (ev) => {
  if (ev.data === "SKIP_WAITING") self.skipWaiting();
});

const isCode = (url) => url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".html") || url.pathname === "/";

self.addEventListener("fetch", (ev) => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (isCode(url)) {
    // Network-first: fresh code wins; fall back to cache only when offline.
    ev.respondWith(
      fetch(ev.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(ev.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(ev.request))
    );
    return;
  }

  // Stale-while-revalidate for everything else same-origin.
  ev.respondWith(
    caches.match(ev.request).then((hit) => {
      const net = fetch(ev.request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(ev.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
