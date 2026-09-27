const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
// Deterministic DOM/image/clock harness; it does not render browser pixels.
const ROOT = path.resolve(__dirname, "..");
const { readSource } = require("./text_sources");
const { loadRuntime, leaves, choices } = require("./audit_state_space");
const sources = new Map();
function element(tag = "div") {
  const attrs = {},
    classes = new Set();
  let html = "";
  const n = {
    tagName: tag.toUpperCase(),
    style: {},
    dataset: {},
    children: [],
    parentNode: null,
    classList: {
      add(...xs) {
        xs.forEach((x) => classes.add(x));
      },
      remove(...xs) {
        xs.forEach((x) => classes.delete(x));
      },
      contains(x) {
        return classes.has(x);
      },
      toggle(x, on = !classes.has(x)) {
        on ? classes.add(x) : classes.delete(x);
        return on;
      },
    },
    setAttribute(k, v) {
      attrs[k] = String(v);
      if (k.startsWith("data-")) this.dataset[k.slice(5)] = String(v);
      if (k === "class") this.className = v;
    },
    getAttribute(k) {
      return attrs[k] ?? null;
    },
    removeAttribute(k) {
      delete attrs[k];
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((x) => x !== child);
      child.parentNode = null;
    },
    querySelector(s) {
      return this.querySelectorAll(s)[0] || null;
    },
    querySelectorAll(s) {
      const key = s.match(/data-cast="([^"]+)"/)?.[1];
      return this.children.filter((x) =>
        key ? x.dataset.cast === key : s.includes("sprite") && x.tagName === "IMG",
      );
    },
    getContext() {
      return { clearRect() {}, drawImage() {} };
    },
    addEventListener() {},
    blur() {},
    get outerHTML() {
      const a = { ...attrs };
      if (this.className) a.class = this.className;
      return `<${tag}${Object.entries(a)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join("")}>${html}</${tag}>`;
    },
    get className() {
      return [...classes].join(" ");
    },
    set className(v) {
      classes.clear();
      String(v)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((x) => classes.add(x));
    },
    get innerHTML() {
      return html;
    },
    set innerHTML(v) {
      html = String(v);
      this.children = [];
      for (const m of html.matchAll(/<img\b([^>]+)>/g)) {
        const img = element("img");
        for (const a of m[1].matchAll(/([\w-]+)="([^"]*)"/g)) img.setAttribute(a[1], a[2]);
        this.appendChild(img);
      }
    },
  };
  return n;
}
function create({ lang = "en", bilingual = false, reduced = false, boot = true } = {}) {
  const key = lang + "/" + bilingual;
  if (!sources.has(key)) sources.set(key, readSource(lang, bilingual));
  const game = loadRuntime(sources.get(key));
  const c = game.context,
    doc = c.document,
    originalGet = doc.getElementById.bind(doc),
    originalCreate = doc.createElement;
  const visual = new Map();
  const ids = [
    "visualStage",
    "stageCast",
    "stagePuddle",
    "stageRec",
    "stageBand",
    "locLabel",
    "railBrand",
    "focusLabel",
    "tummy-fill-rect",
    "blad-fill-rect",
    "carafe",
    "vessel",
    "tummy-label",
    "blad-label",
    "inti-fill",
    "shy-fill",
    "inti-n",
    "shy-n",
    "coins",
    "pounds",
    "blad-stop-lit",
    "blad-stop-mid",
    "blad-stop-deep",
  ];
  ids.forEach((id) => visual.set(id, element()));
  doc.getElementById = (id) =>
    id === "spritePrimary"
      ? visual.get("stageCast").children[0]
      : visual.get(id) || originalGet(id);
  doc.createElement = (tag) =>
    ["canvas", "div"].includes(tag) ? element(tag) : originalCreate(tag);
  doc.querySelectorAll = (s) =>
    s === ".sprite[data-cast]" ? visual.get("stageCast").children : [];
  let now = 100,
    timerId = 0;
  const timers = new Map(),
    pendingImages = [],
    messages = [];
  c.console = {
    log() {},
    warn(...x) {
      messages.push(x.join(" "));
    },
    error(...x) {
      messages.push(x.join(" "));
    },
  };
  c.matchMedia = () => ({ matches: reduced });
  c.performance = { now: () => now };
  c.Date = class extends Date {
    static now() {
      return now;
    }
  };
  c.setTimeout = (fn, ms = 0) => {
    timers.set(++timerId, { fn, at: now + ms, ms, repeat: false });
    return timerId;
  };
  c.setInterval = (fn, ms) => {
    timers.set(++timerId, { fn, at: now + ms, ms, repeat: true });
    return timerId;
  };
  c.clearTimeout = c.clearInterval = (id) => timers.delete(id);
  c.Image = class {
    set src(url) {
      this.url = url;
      pendingImages.push(this);
    }
  };
  c.location = { reload() {} };
  const output = path.join(
    ROOT,
    `outputs/${lang}/dianedate_visual_${lang}${bilingual ? "_bilingual" : ""}.html`,
  );
  const html = fs.readFileSync(output, "utf8");
  for (const id of ["adwd-visual-config", "adwd-i18n"])
    vm.runInContext(html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`))[1], c);
  for (const name of ["scene-map", "puddle-sync", "adapter"])
    vm.runInContext(fs.readFileSync(path.join(ROOT, "source/visual/" + name + ".js"), "utf8"), c);
  if (boot) c.VisualShell.boot();
  async function flush() {
    for (let i = 0; i < 100; i++) {
      pendingImages.splice(0).forEach((im) => im.onload?.());
      await Promise.resolve();
    }
  }
  async function advance(ms) {
    const end = now + ms;
    let count = 0;
    while (true) {
      const next = [...timers].filter(([, x]) => x.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      if (++count > 10000) throw Error("Clock runaway");
      const [id, t] = next;
      now = t.at;
      if (t.repeat) t.at += Math.max(1, t.ms);
      else timers.delete(id);
      t.fn();
      await flush();
    }
    now = end;
    await flush();
  }
  function view() {
    return {
      tag: c.currentTag,
      location: visual.get("visualStage").getAttribute("data-location"),
      status: visual.get("stageBand").dataset.status,
      rec: visual.get("stageRec").hidden === false,
      sprites: visual.get("stageCast").children.map((x) => ({
        cast: x.dataset.cast,
        src: x.getAttribute("src"),
        tremor: x.classList.contains("tremor"),
      })),
      puddles: visual.get("stagePuddle").children.map((x) => ({
        cast: x.dataset.cast,
        spacer: x.classList.contains("puddle-spacer"),
      })),
      meter: visual.get("vessel").getAttribute("data-tip"),
      timers: timers.size,
    };
  }
  return { ...game, c, visual, flush, advance, view, messages, pendingImages, timers };
}
module.exports = { create, leaves, choices };
