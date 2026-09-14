/**
 * Frame-locked puddle sync — grow-bank scrub locked to character pee/wet GIFs.
 * Grow banks load as PNG frames via <img> (works on file:// and without ImageDecoder).
 */
(function (root) {
  "use strict";

  var FRAME_MS = 100;
  function assetBase() {
    return (root.ADWD_ASSET_BASE || "../../assets/").replace(/\/?$/, "/");
  }
  function fxBase() { return assetBase() + "fx/"; }

  var metaCache = null;
  var metaPromise = null;
  var growCache = Object.create(null);

  function pongOrder(n) {
    var out = [];
    var i;
    for (i = 0; i < n; i++) out.push(i);
    for (i = n - 2; i >= 1; i--) out.push(i);
    return out;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function buildPuddleMapFromClip(info, growN) {
    var srcN = info.srcFrames | 0;
    var stream = info.streamStart != null ? (info.streamStart | 0) : (info.gush1 | 0);
    var clearBelow = info.clearBelow != null
      ? (info.clearBelow | 0)
      : (info.pantiesDown != null ? (info.pantiesDown | 0) : stream);
    var cycle = pongOrder(srcN);
    var gush2Scrub = info.gush2Scrub != null
      ? (info.gush2Scrub | 0)
      : (info.gush2 != null ? (info.gush2 | 0) : Math.min(srcN - 1, stream + 8));
    var gush2FullAt;
    if (info.gush2FullAt != null) {
      gush2FullAt = info.gush2FullAt | 0;
    } else {
      gush2FullAt = gush2Scrub;
      for (var ri = srcN; ri < cycle.length; ri++) {
        if (cycle[ri] > stream) gush2FullAt = ri;
      }
    }
    var gush1Cap = info.gush1Cap != null
      ? Math.max(0, Math.min(growN - 2, info.gush1Cap | 0))
      : Math.max(1, Math.min(12, Math.floor((growN - 1) * 0.55)));
    if (gush2FullAt <= gush2Scrub) gush2FullAt = Math.min(cycle.length - 1, gush2Scrub + 1);

    var map = [];
    var i, src, inForward, prog, maxProg, t;
    var g1Span = Math.max(1, gush2Scrub - stream);
    var g2Span = Math.max(1, gush2FullAt - gush2Scrub);
    var g2Grow = (growN - 1) - gush1Cap;
    maxProg = -1;
    for (i = 0; i < cycle.length; i++) {
      src = cycle[i];
      inForward = i < srcN;
      if (!inForward && src < clearBelow) {
        maxProg = -1;
        map.push({ prog: -1, phase: "clear" });
        continue;
      }
      if (i < stream) {
        maxProg = -1;
        map.push({ prog: -1, phase: "wait" });
        continue;
      }
      if (i < gush2Scrub) {
        t = (i - stream) / g1Span;
        t = 1 - (1 - t) * (1 - t);
        prog = Math.round(t * gush1Cap);
        prog = Math.max(0, Math.min(gush1Cap, prog));
        if (prog > maxProg) maxProg = prog;
        map.push({ prog: maxProg, phase: "gush1" });
        continue;
      }
      if (i <= gush2FullAt) {
        t = (i - gush2Scrub) / g2Span;
        prog = Math.round(gush1Cap + t * g2Grow);
        prog = Math.max(gush1Cap, Math.min(growN - 1, prog));
        if (prog > maxProg) maxProg = prog;
        map.push({ prog: maxProg, phase: "gush2" });
        continue;
      }
      if (maxProg < growN - 1) maxProg = growN - 1;
      map.push({ prog: maxProg, phase: (!inForward && src < stream) ? "panties" : "hold" });
    }
    return map;
  }

  function buildPuddleMapForWetting(info, growN, eventLen) {
    var stream = info.streamStart != null ? (info.streamStart | 0) : (info.gush1 | 0);
    var peeEnd = info.streamEnd != null ? (info.streamEnd | 0) : Math.max(stream, eventLen - 1);
    stream = Math.max(0, Math.min(eventLen - 1, stream));
    peeEnd = Math.max(stream, Math.min(eventLen - 1, peeEnd));
    var g2 = info.gush2 != null ? (info.gush2 | 0) : Math.min(peeEnd, stream + Math.floor((peeEnd - stream) / 2));
    g2 = Math.max(stream, Math.min(peeEnd, g2));
    var gush1Cap = info.gush1Cap != null
      ? Math.max(0, Math.min(growN - 2, info.gush1Cap | 0))
      : Math.max(1, Math.min(8, Math.floor((growN - 1) * 0.5)));
    var g1Span = Math.max(1, g2 - stream);
    var g2Span = Math.max(1, peeEnd - g2);
    var g2Grow = (growN - 1) - gush1Cap;
    var map = [];
    var i, prog, maxProg, t;
    maxProg = -1;
    for (i = 0; i < eventLen; i++) {
      if (i < stream) {
        maxProg = -1;
        map.push({ prog: -1, phase: "wait" });
        continue;
      }
      if (i < g2) {
        t = (i - stream) / g1Span;
        t = 1 - (1 - t) * (1 - t);
        prog = Math.round(t * gush1Cap);
        prog = Math.max(0, Math.min(gush1Cap, prog));
        if (prog > maxProg) maxProg = prog;
        map.push({ prog: maxProg, phase: "gush1" });
        continue;
      }
      if (i <= peeEnd) {
        t = (i - g2) / g2Span;
        prog = Math.round(gush1Cap + t * g2Grow);
        prog = Math.max(gush1Cap, Math.min(growN - 1, prog));
        if (prog > maxProg) maxProg = prog;
        map.push({ prog: maxProg, phase: "gush2" });
        continue;
      }
      if (maxProg < growN - 1) maxProg = growN - 1;
      map.push({ prog: maxProg, phase: "hold" });
    }
    return map;
  }

  function loadMeta() {
    if (metaCache) return Promise.resolve(metaCache);
    if (root.ADWD_PUDDLE_META) {
      metaCache = root.ADWD_PUDDLE_META;
      return Promise.resolve(metaCache);
    }
    if (!metaPromise) {
      metaPromise = fetch(fxBase() + "puddle_meta.json", { cache: "force-cache" })
        .then(function (r) {
          if (!r.ok) throw new Error("puddle meta missing");
          return r.json();
        })
        .then(function (j) {
          metaCache = j;
          return j;
        })
        .catch(function (e) {
          metaPromise = null;
          throw e;
        });
    }
    return metaPromise;
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("missing " + url)); };
      img.src = url;
    });
  }

  /** PNG frame bank — works on file:// (unlike fetch + ImageDecoder). */
  async function loadGrowFrames(castKey, stem, info) {
    var dir = fxBase() + "grow_frames/" + castKey + "_" + stem + "_grow/";
    if (growCache[dir]) return growCache[dir].slice();
    var count = info && info.growFrames;
    if (typeof count !== "number" || count <= 0 || Math.floor(count) !== count) {
      throw new Error("missing grow-frame count for " + castKey + "/" + stem + "; rebuild the visual edition");
    }
    var frames = [];
    var i;
    for (i = 0; i < count; i++) frames.push(await loadImage(dir + pad2(i) + ".png"));
    growCache[dir] = frames;
    return frames.slice();
  }

  function createEngine() {
    var eng = {
      active: false,
      holding: false,
      gen: 0,
      t0: 0,
      timer: null,
      tracks: [],
      host: null,
      stage: null,
      onScrub: null,
      lastInfo: null,
      lastKind: "pee",
    };

    function stopClock() {
      if (eng.timer) {
        window.clearInterval(eng.timer);
        eng.timer = null;
      }
    }

    function paintTrack(track, scrub) {
      if (track.spacer || !track.ctx) return;
      var ctx = track.ctx;
      var w = track.canvas.width;
      var h = track.canvas.height;
      ctx.clearRect(0, 0, w, h);
      var entry;
      if (eng.holding) {
        entry = { prog: track.growFrames.length - 1, phase: "hold" };
      } else if (track.kind === "wet") {
        if (scrub >= track.map.length) entry = { prog: track.growFrames.length - 1, phase: "hold" };
        else entry = track.map[scrub] || { prog: -1 };
      } else {
        var idx = track.map.length ? ((scrub % track.map.length) + track.map.length) % track.map.length : 0;
        entry = track.map[idx] || { prog: -1 };
      }
      if (!entry || entry.prog < 0 || !track.growFrames[entry.prog]) return;
      ctx.drawImage(track.growFrames[entry.prog], 0, 0, w, h);
    }

    function tick() {
      if (!eng.active) return;
      var now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      var scrub = Math.floor((now - eng.t0) / FRAME_MS);
      for (var i = 0; i < eng.tracks.length; i++) paintTrack(eng.tracks[i], scrub);
      if (typeof eng.onScrub === "function") {
        var lead = null;
        for (var li = 0; li < eng.tracks.length; li++) {
          if (!eng.tracks[li].spacer) { lead = eng.tracks[li]; break; }
        }
        try { eng.onScrub(scrub, lead); } catch (eScrub) {}
      }
    }

    function setHostOn(on) {
      if (!eng.host) return;
      eng.host.classList.toggle("is-on", !!on);
      eng.host.setAttribute("aria-hidden", on ? "false" : "true");
      if (eng.stage) eng.stage.classList.toggle("has-puddle", !!on);
    }

    function destroyTracks() {
      eng.tracks.forEach(function (t) {
        if (t.canvas && t.canvas.parentNode) t.canvas.parentNode.removeChild(t.canvas);
      });
      eng.tracks = [];
      if (eng.host) {
        eng.host.innerHTML = "";
        eng.host.classList.remove("duo");
      }
    }

    function prefersReducedMotion() {
      try {
        return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      } catch (e) { return false; }
    }

    function beginClock() {
      stopClock();
      eng.active = true;
      eng.t0 = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      setHostOn(true);
      if (prefersReducedMotion()) {
        eng.holding = true;
        for (var i = 0; i < eng.tracks.length; i++) paintTrack(eng.tracks[i], 0);
        return eng.t0;
      }
      eng.holding = false;
      tick();
      eng.timer = window.setInterval(tick, FRAME_MS);
      return eng.t0;
    }

    return {
      bind: function (host, stage) {
        eng.host = host;
        eng.stage = stage;
      },
      stop: function () {
        stopClock();
        eng.active = false;
        eng.holding = false;
        eng.onScrub = null;
        eng.gen += 1;
        destroyTracks();
        setHostOn(false);
      },
      holdFull: function () {
        if (!eng.active && !eng.tracks.length) return;
        eng.active = true;
        eng.holding = true;
        setHostOn(true);
        for (var i = 0; i < eng.tracks.length; i++) paintTrack(eng.tracks[i], 0);
      },
      isActive: function () { return eng.active; },
      getT0: function () { return eng.t0; },
      getInfo: function () { return eng.lastInfo; },
      getKind: function () { return eng.lastKind; },
      setOnScrub: function (fn) { eng.onScrub = fn; },
      beginClock: beginClock,
      start: async function (entries, kind, continuing, opts) {
        opts = opts || {};
        if (continuing && eng.active) {
          if (eng.holding) this.holdFull();
          return { continued: true, info: eng.lastInfo, kind: eng.lastKind };
        }
        var myGen = ++eng.gen;
        stopClock();
        destroyTracks();
        eng.holding = false;
        eng.active = false;
        eng.lastInfo = null;
        setHostOn(false);

        entries = entries || [];
        if (!entries.length) return { ok: false };

        var meta;
        try { meta = await loadMeta(); }
        catch (eMeta) { console.warn("[puddle]", eMeta); return { ok: false }; }
        if (myGen !== eng.gen) return { ok: false };

        var tracks = [];
        var primaryInfo = null;
        var liveCount = 0;
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.spacer) {
            var spacer = document.createElement("div");
            spacer.className = "puddle-sprite puddle-spacer";
            spacer.setAttribute("data-cast", e.castKey || "");
            spacer.setAttribute("aria-hidden", "true");
            tracks.push({
              castKey: e.castKey || "",
              spacer: true,
              canvas: spacer,
              ctx: null,
              growFrames: [],
              map: [],
              kind: "pee",
              info: null,
            });
            continue;
          }
          var stem = String(e.charFile || "").replace(/\.gif$/i, "");
          var key = e.castKey + "/" + stem;
          var info = meta.clips && meta.clips[key];
          if (!info) {
            console.warn("[puddle] no meta for", key);
            continue;
          }
          var growFrames;
          try { growFrames = await loadGrowFrames(e.castKey, stem, info); }
          catch (eGrow) {
            console.warn("[puddle]", eGrow);
            continue;
          }
          if (myGen !== eng.gen) return { ok: false };
          if (!growFrames || !growFrames.length) continue;

          var map;
          var trackKind = kind === "wet" || info.kind === "wet" ? "wet" : "pee";
          if (trackKind === "wet") {
            var eventLen = info.srcFrames | 0;
            if (!eventLen) eventLen = growFrames.length;
            map = buildPuddleMapForWetting(info, growFrames.length, eventLen);
          } else {
            map = buildPuddleMapFromClip(info, growFrames.length);
          }

          var canvas = document.createElement("canvas");
          canvas.width = 398;
          canvas.height = 398;
          canvas.className = "puddle-sprite";
          canvas.setAttribute("data-cast", e.castKey);
          canvas.setAttribute("aria-hidden", "true");
          tracks.push({
            castKey: e.castKey,
            kind: trackKind,
            info: info,
            growFrames: growFrames,
            map: map,
            canvas: canvas,
            ctx: canvas.getContext("2d"),
            spacer: false,
          });
          liveCount++;
          if (!primaryInfo) primaryInfo = info;
        }

        if ((!liveCount && !tracks.length) || myGen !== eng.gen) {
          return { ok: false };
        }
        if (!liveCount) return { ok: false };

        eng.tracks = tracks;
        eng.lastInfo = primaryInfo;
        eng.lastKind = (function () {
          for (var k = 0; k < tracks.length; k++) {
            if (!tracks[k].spacer) return tracks[k].kind;
          }
          return "pee";
        })();
        eng.host.classList.toggle("duo", tracks.length > 1);
        for (var t = 0; t < tracks.length; t++) eng.host.appendChild(tracks[t].canvas);

        eng.holding = false;
        for (var c = 0; c < tracks.length; c++) {
          if (tracks[c].spacer || !tracks[c].ctx) continue;
          tracks[c].ctx.clearRect(0, 0, tracks[c].canvas.width, tracks[c].canvas.height);
        }
        setHostOn(true);

        if (opts.autoClock) beginClock();
        else eng.active = false;
        return {
          ok: true,
          deferred: !opts.autoClock,
          info: primaryInfo,
          kind: eng.lastKind,
        };
      },
    };
  }

  root.ADWDPuddleSync = {
    create: createEngine,
    FRAME_MS: FRAME_MS,
    preload: function () { return loadMeta(); },
  };
})(typeof window !== "undefined" ? window : globalThis);
