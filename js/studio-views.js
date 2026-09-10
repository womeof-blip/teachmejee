import { h, makeToast } from "./fx.js";
import { load } from "./store.js";
import { fmt } from "./planner.js";
import { disposeActiveSim, onViewCleanup } from "./views.js";
import { SPLINE_SCENES, STUDIO_SIMS, SIM_LABELS, makeSplineFrame } from "./studio.js";

function page(title, subtitle, body) {
  return h("div", {},
    h("div", { class: "stack", style: "gap:6px" },
      h("h1", {}, title),
      subtitle ? h("p", { class: "muted small" }, subtitle) : null),
    h("div", { class: "divider" }),
    body);
}

function mountLabCanvas(host, simId) {
  disposeActiveSim();
  host.innerHTML = "";
  const shell = h("div", { class: "sim-shell", style: "height:440px" },
    h("canvas", { style: "position:absolute;inset:0;width:100%;height:100%" }),
    h("div", { class: "sim-loading" }, "Loading 3D…"),
    h("div", { class: "sim-tag" }, "drag · scroll zoom"));
  const ctrl = h("div", { class: "sim-panel", hidden: true });
  host.append(shell, ctrl);
  import("./sim/index.js").then(({ mountSim, hasSim }) => {
    if (!hasSim(simId)) {
      const loading = shell.querySelector(".sim-loading");
      if (loading) loading.textContent = `Unknown lab: ${simId}`;
      return;
    }
    try {
      const sim = mountSim(shell.querySelector("canvas"), simId);
      onViewCleanup(() => { if (sim && sim.dispose) sim.dispose(); });
      const loading = shell.querySelector(".sim-loading");
      if (loading) loading.remove();
      if (sim.controls && sim.controls.length) {
        ctrl.hidden = false;
        for (const c of sim.controls) {
          const row = h("label");
          const val = h("span", { class: "mono" }, String(c.value));
          row.append(`${c.label}: `, val,
            h("input", { type: "range", min: c.min, max: c.max, step: c.step, value: c.value,
              oninput: (ev) => {
                const v = parseFloat(ev.target.value);
                val.textContent = String(v);
                sim.setControl(c.key, v);
              } }));
          ctrl.append(row);
        }
      }
    } catch (err) {
      const loading = shell.querySelector(".sim-loading");
      if (loading) loading.textContent = err.message;
    }
  });
}

export function StudioView(root) {
  disposeActiveSim();
  const stage = h("div", { class: "studio-stage" });
  const customInp = h("input", { type: "text", placeholder: "Paste a prod.spline.design/…/scene.splinecode URL", style: "flex:1" });

  function showSpline(url, title) {
    disposeActiveSim();
    stage.innerHTML = "";
    stage.append(h("div", { class: "small faint", style: "margin-bottom:8px" }, title), makeSplineFrame(url));
  }
  function showSim(id, title) {
    stage.innerHTML = "";
    stage.append(h("div", { class: "small faint", style: "margin-bottom:8px" }, title));
    const box = h("div");
    stage.append(box);
    mountLabCanvas(box, id);
  }

  root.innerHTML = "";
  root.append(page("Spline studio", "Public Spline scenes in the official viewer, plus local glass models if the CDN is down. Paste your own export URL.",
    h("div", { class: "stack", style: "gap:16px" },
      h("div", { class: "row", style: "gap:8px;align-items:center" },
        customInp,
        h("button", { class: "btn btn-primary btn-sm", onclick: () => {
          const url = customInp.value.trim();
          if (!url.includes("spline")) { makeToast("Need a .splinecode URL", true); return; }
          showSpline(url, "Custom scene");
        } }, "Load")),
      stage,
      h("h3", {}, "Spline scenes"),
      h("div", { class: "studio-grid" },
        ...SPLINE_SCENES.map((sc) =>
          h("button", { class: "card studio-tile", onclick: () => showSpline(sc.url, sc.title) },
            h("strong", {}, sc.title),
            h("span", { class: "small muted" }, sc.blurb)))),
      h("h3", {}, "Local studio models"),
      h("div", { class: "studio-grid" },
        ...STUDIO_SIMS.map((sc) =>
          h("button", { class: "card studio-tile", onclick: () => showSim(sc.id, sc.title) },
            h("strong", {}, sc.title),
            h("span", { class: "small muted" }, sc.blurb)))))));
  showSim("studio-knot", "Glass knot");
}

export function SimLabView(root) {
  disposeActiveSim();
  const stage = h("div");
  const list = h("div", { class: "studio-grid" });
  const search = h("input", { type: "text", placeholder: "Search labs…", style: "max-width:320px" });
  let q = "";
  function paint(ids) {
    list.innerHTML = "";
    const filtered = ids.filter((id) => {
      const [name, sub] = SIM_LABELS[id] || [id, ""];
      return `${id} ${name} ${sub}`.toLowerCase().includes(q);
    });
    for (const id of filtered) {
      const [name, sub] = SIM_LABELS[id] || [id.replace(/-/g, " "), "Lab"];
      list.append(h("button", { class: "card studio-tile", onclick: () => {
        stage.innerHTML = "";
        stage.append(h("h3", { style: "margin-bottom:8px" }, name));
        const box = h("div");
        stage.append(box);
        mountLabCanvas(box, id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } }, h("strong", {}, name), h("span", { class: "small muted" }, `${sub} · ${id}`)));
    }
  }
  root.innerHTML = "";
  root.append(page("3D lab catalog", "Every registered Three.js lab on this device. Click one to mount it.",
    h("div", { class: "stack", style: "gap:14px" }, stage, search, list)));
  search.addEventListener("input", () => { q = search.value.toLowerCase(); import("./sim/index.js").then(({ listSims }) => paint(listSims())); });
  import("./sim/index.js").then(({ listSims }) => {
    const ids = listSims();
    stage.append(h("p", { class: "small muted" }, `${ids.length} labs registered.`));
    paint(ids);
  });
}

export function ClockView(root) {
  const s = load();
  const box = h("div", { class: "clock-big mono" }, "—");
  const sub = h("div", { class: "muted small" }, "");
  let target = "main";
  function tick() {
    const iso = target === "main" ? s.planner.mainDate : s.planner.advDate;
    const end = new Date(iso + "T09:00:00");
    const ms = end - Date.now();
    if (ms <= 0) { box.textContent = "Exam day"; sub.textContent = iso; return; }
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    box.textContent = `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    sub.textContent = `${target === "main" ? "JEE Main" : "JEE Advanced"} · ${fmt(iso)} · 09:00`;
  }
  const id = setInterval(tick, 1000);
  onViewCleanup(() => clearInterval(id));
  tick();
  root.innerHTML = "";
  root.append(page("Exam clock", "Live countdown to the dates in Planner.",
    h("div", { class: "card", style: "text-align:center;padding:36px 18px" },
      h("div", { class: "filter-tabs", style: "justify-content:center;margin-bottom:18px" },
        h("button", { class: "ftab on", onclick: (ev) => { target = "main"; ev.currentTarget.parentElement.querySelectorAll(".ftab").forEach((b) => b.classList.toggle("on", b === ev.currentTarget)); tick(); } }, "Main"),
        h("button", { class: "ftab", onclick: (ev) => { target = "adv"; ev.currentTarget.parentElement.querySelectorAll(".ftab").forEach((b) => b.classList.toggle("on", b === ev.currentTarget)); tick(); } }, "Advanced")),
      box, sub,
      h("div", { style: "margin-top:18px" }, h("a", { class: "btn btn-sm", href: "#/planner" }, "Edit dates")))));
}
