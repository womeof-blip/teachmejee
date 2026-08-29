/* TeachMeJEE — shared DOM helper + effects kit (confetti, XP fly, modals, toasts). */

export function h(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k === "dataset") Object.assign(e.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}

export function makeToast(msg, good = false, action = null) {
  const t = h("div", { class: `toast${good ? " good" : ""}` }, msg);
  if (action) {
    const b = h("button", { class: "chip", style: "margin-left:10px" }, action.label);
    b.addEventListener("click", () => { action.fn(); t.remove(); });
    t.append(b);
  }
  document.body.appendChild(t);
  setTimeout(() => t.remove(), action ? 6000 : 2600);
}

export function notifySync() {
  try { window.dispatchEvent(new Event("tmj-progress")); } catch {}
}

const FX_COLORS = ["#f2a33c", "#ffc476", "#8fbf6f", "#e86f52", "#69a7d8", "#f5eddc"];

export function confettiBurst(x = innerWidth / 2, y = innerHeight * 0.32, count = 90) {
  const cv = document.createElement("canvas");
  cv.className = "confetti-canvas";
  cv.width = innerWidth; cv.height = innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const parts = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 4 + Math.random() * 9;
    parts.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 5,
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .3,
      col: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      life: 60 + Math.random() * 55,
    });
  }
  let frames = 0;
  (function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = 0;
    for (const p of parts) {
      if (p.life <= 0) continue;
      alive++;
      p.life--;
      p.x += p.vx; p.y += p.vy; p.vy += 0.16; p.vx *= 0.99; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    frames++;
    if (alive > 0 && frames < 200) requestAnimationFrame(loop);
    else cv.remove();
  })();
}

export function xpFly(amount, fromEl) {
  const pill = document.getElementById("xpPill");
  if (!pill) return;
  const fly = h("span", { class: "xp-fly" }, `+${amount} XP`);
  const fr = (fromEl || document.body).getBoundingClientRect();
  const tr = pill.getBoundingClientRect();
  fly.style.left = `${fr.left + fr.width / 2}px`;
  fly.style.top = `${fr.top}px`;
  document.body.appendChild(fly);
  requestAnimationFrame(() => {
    fly.style.left = `${tr.left + tr.width / 2}px`;
    fly.style.top = `${tr.top}px`;
    fly.style.opacity = "0";
    fly.style.transform = "scale(.5)";
  });
  setTimeout(() => fly.remove(), 900);
}

const modalQueue = [];
let modalOpen = false;
export function showModal({ icon = "✦", title, rows = [], cta = "Keep going" }) {
  modalQueue.push({ icon, title, rows, cta });
  pumpModals();
}
function pumpModals() {
  if (modalOpen || !modalQueue.length) return;
  modalOpen = true;
  const m = modalQueue.shift();
  const overlay = h("div", { class: "modal-overlay" },
    h("div", { class: "modal" },
      h("div", { class: "modal-icon" }, m.icon),
      h("h2", {}, m.title),
      m.rows.length ? h("div", { class: "modal-rows" }, ...m.rows.map((r) => h("div", { class: "modal-row" }, r))) : null,
      h("button", { class: "btn btn-primary", style: "margin-top:16px;width:100%", onclick: () => { overlay.remove(); modalOpen = false; pumpModals(); } }, m.cta)));
  document.body.appendChild(overlay);
}
