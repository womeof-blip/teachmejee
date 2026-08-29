/* TeachMeJEE Focus Shield — OS-level blocking without an extension.
   1) Generates a hosts-file blocklist the learner applies once (works machine-wide, survives restarts).
   2) In-app deterrence: while a study session is armed, leaving the tab logs a strike. */

const SITE_PACKS = {
  social: {
    label: "Social media",
    domains: ["instagram.com", "facebook.com", "m.facebook.com", "whatsapp.com", "web.whatsapp.com", "snapchat.com", "x.com", "twitter.com", "threads.net", "pinterest.com"],
  },
  entertainment: {
    label: "Streaming & entertainment",
    domains: ["netflix.com", "hotstar.com", "primevideo.com", "jiocinema.com", "sonyliv.com", "twitch.tv", "mxplayer.in", "zee5.com"],
  },
  gaming: {
    label: "Gaming",
    domains: ["steampowered.com", "epicgames.com", "roblox.com", "chess.com", "lichess.org", "miniclip.com", "poki.com", "crazygames.com"],
  },
  shorts: {
    label: "Short-video feeds",
    domains: ["tiktok.com", "likee.video", "moj.com", "roposo.com"],
  },
};

const DEFAULT_ALLOW = ["localhost", "127.0.0.1"];

export function sitePacks() { return SITE_PACKS; }

export function buildHosts(selectedPacks, extraDomains = [], allow = []) {
  const lines = [
    "# TeachMeJEE Focus Shield blocklist",
    "# Applied to: C:\\Windows\\System32\\drivers\\etc\\hosts  (run Notepad as Administrator)",
    "# Remove these lines any time to unblock.",
    "",
  ];
  const allowSet = new Set([...DEFAULT_ALLOW, ...allow.map((a) => String(a).trim().toLowerCase()).filter(Boolean)]);
  const seen = new Set();
  const push = (d) => {
    d = String(d).trim().toLowerCase().replace(/^www\./, "");
    if (!d || allowSet.has(d) || seen.has(d)) return;
    seen.add(d);
    lines.push(`127.0.0.1  ${d}`);
    lines.push(`127.0.0.1  www.${d}`);
  };
  for (const key of selectedPacks) (SITE_PACKS[key]?.domains || []).forEach(push);
  extraDomains.forEach(push);
  if (seen.size === 0) lines.push("# (nothing selected)");
  return lines.join("\r\n");
}

export function downloadHosts(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "FOCUS-SHIELD-hosts.txt";
  a.click();
  URL.revokeObjectURL(url);
}

/* ── In-app strikes: armed sessions notice tab abandonment ── */
let armedUntil = 0;
let wasHidden = false;

export function armShield(durationMs) {
  armedUntil = Date.now() + durationMs;
}
export function disarmShield() {
  armedUntil = 0;
}

async function registerStrike() {
  try {
    const { bumpDistraction } = await import("./store.js");
    bumpDistraction();
  } catch {}
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Date.now() < armedUntil) wasHidden = true;
    if (!document.hidden && wasHidden && Date.now() < armedUntil) {
      wasHidden = false;
      registerStrike();
      showStrikeOverlay();
    }
  });
  window.addEventListener("blur", () => {
    if (Date.now() < armedUntil) wasHidden = true;
  });
}

function showStrikeOverlay() {
  const el = document.createElement("div");
  el.className = "strike-overlay";
  el.innerHTML = `
    <div class="strike-card">
      <div class="strike-big">!</div>
      <h2>That was a distraction</h2>
      <p>The tab lost focus during an armed study session.<br>This strike is on your record.</p>
      <button id="strikeOk">Back to work</button>
    </div>`;
  document.body.appendChild(el);
  el.querySelector("#strikeOk").addEventListener("click", () => el.remove());
  setTimeout(() => el.remove(), 6000);
}

export function ShieldView(root) {
  function pageShell(title, subtitle, body) {
    return h("div", {},
      h("div", { class: "stack", style: "gap:6px" },
        h("h1", {}, title),
        subtitle ? h("p", { class: "muted small" }, subtitle) : null),
      h("div", { class: "divider" }),
      body);
  }

  const packsEl = h("div", { class: "stack", style: "gap:8px" });
  const selected = new Set(Object.keys(SITE_PACKS));
  const customIn = h("textarea", { class: "note-editor", style: "min-height:64px", placeholder: "Extra domains, one per line…" });

  function paintPacks() {
    packsEl.innerHTML = "";
    for (const [key, pack] of Object.entries(SITE_PACKS)) {
      const cb = h("input", { type: "checkbox", checked: selected.has(key), onchange: (ev) => { ev.target.checked ? selected.add(key) : selected.delete(key); } });
      packsEl.append(h("label", { style: "display:flex;align-items:center;gap:10px;font-size:13.5px;cursor:pointer" },
        cb,
        h("span", {}, h("b", {}, pack.label), h("span", { class: "small faint" }, ` · ${pack.domains.length} sites`))));
    }
  }
  paintPacks();

  const previewBtn = h("button", { class: "btn btn-sm" }, "Preview list");
  const downloadBtn = h("button", { class: "btn btn-primary btn-sm" }, "Download hosts file");
  const copyBtn = h("button", { class: "btn btn-sm" }, "Copy to clipboard");
  const previewBox = h("pre", { class: "mono small", style: "background:var(--surface-2);border:1px solid var(--border);border-radius:9px;padding:12px;max-height:220px;overflow:auto;white-space:pre-wrap;display:none;margin-top:10px" });

  function currentText() {
    const extras = customIn.value.split(/\n+/).map((x) => x.trim()).filter(Boolean);
    return buildHosts([...selected], extras, []);
  }
  previewBtn.addEventListener("click", () => {
    previewBox.style.display = previewBox.style.display === "none" ? "block" : "none";
    previewBox.textContent = currentText();
  });
  downloadBtn.addEventListener("click", () => downloadHosts(currentText()));
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(currentText()); makeToastLocal("Blocklist copied."); } catch {}
  });

  root.innerHTML = "";
  root.append(pageShell(
    "Focus shield",
    "Two honest layers of blocking — no extension needed.",
    h("div", { class: "stack", style: "gap:18px;max-width:680px" },

      /* Layer 1 */
      h("div", { class: "card" },
        h("h3", {}, "Layer 1 · Hosts-file blocker"),
        h("p", { class: "small muted", style: "margin-bottom:10px" },
          "Generates entries for Windows' hosts file. Once applied, the blocked websites stop loading in every browser on this PC — even after restarts."),
        h("div", { class: "field" }, h("label", { class: "lbl" }, "What to block"), packsEl),
        h("div", { class: "field" }, h("label", { class: "lbl" }, "Custom additions"), customIn),
        h("div", { class: "row", style: "gap:8px" }, previewBtn, downloadBtn, copyBtn),
        previewBox,
        h("div", { class: "hint-box", style: "margin-top:12px" },
          h("b", {}, "How to apply (one time):"),
          h("ol", { style: "margin:6px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:3px" },
            h("li", {}, "Download the file above."),
            h("li", {}, "Open Notepad as Administrator."),
            h("li", {}, "Open ", h("code", {}, "C:\\Windows\\System32\\drivers\\etc\\hosts")),
            h("li", {}, "Paste the contents at the bottom and save.")),
          h("p", { class: "small faint", style: "margin:8px 0 0" }, "To unblock later: delete the lines marked “TeachMeJEE Focus Shield”."))),

      /* Layer 2 */
      h("div", { class: "card" },
        h("h3", {}, "Layer 2 · Session guard"),
        h("p", { class: "small muted", style: "margin-bottom:6px" }, "While a study timer is running, switching tabs or windows logs a strike and flashes this screen on your return."),
        (() => {
          const today = todayStr();
          const n = (load().focusStrikes || {})[today] || 0;
          return h("div", { class: "stat rec" }, h("div", { class: "k" }, String(n)), h("div", { class: "l" }, "strikes today"));
        })(),
        h("p", { class: "hint", style: "margin-top:8px" }, "Arms automatically with the focus timer, zen mode and boss battles.")),

      h("p", { class: "hint" }, "YouTube is intentionally not in any pack — lecture embeds live here. Add it under Custom additions only if you must."))));
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function makeToastLocal(msg) {
  const t = h("div", { class: "toast good" }, msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

function h(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === "class") e.className = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}
