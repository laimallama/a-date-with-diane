/**
 * Visual shell adapter — hooks go/goback, drives stage + organ meters.
 * Keeps the text engine (#box, Gallery, guides) intact.
 */
(function (root) {
  "use strict";

  var ui = root.ADWDVisualUI;

  var ASSET_BASE = "../../assets/";

  var CAST = {
    diane: { folder: "diane" },
    molly: { folder: "molly" },
    debbie: { folder: "debbie" },
    amanda: { folder: "amanda" },
    chloe: { folder: "chloe" },
  };

  var GIF = {
    calm: "01_calm.gif",
    need: "02_need_pee.gif",
    desperate: "03_desperate_pee.gif",
    critical: "04_critical_pee.gif",
    wetIdle: "05_wet_idle.gif",
    wetting: "06_wetting.gif",
    peeA: "07_pee_a.gif",
    peeB: "08_pee_b.gif",
  };

  /** Casts that ship a pee_b variant (Molly / Amanda). */
  var PEE_B_CAST = { molly: true, amanda: true };

  var URINE_RAMP = [
    { at: 0, lit: "#f9f0d0", mid: "#f3e5a8", deep: "#e6d078" },
    { at: 25, lit: "#f7e8b8", mid: "#f0d878", deep: "#e0c050" },
    { at: 40, lit: "#f4e090", mid: "#edd060", deep: "#d8b038" },
    { at: 55, lit: "#f2dc7a", mid: "#e8c848", deep: "#d0a828" },
    { at: 68, lit: "#f0d468", mid: "#e8b840", deep: "#c89820" },
    { at: 88, lit: "#eac050", mid: "#e0a028", deep: "#c08014" },
    { at: 100, lit: "#e0b040", mid: "#d49018", deep: "#b07010" },
  ];

  var state = {
    wet: false,
    playingEvent: false,
    /** Intentional pee: first loop drained; further loops are replay (REC). */
    peeReplay: false,
    /** Looping pee drain levels (visual refill each cycle). */
    drainFromMl: null,
    /**
     * Sticky pre-pee bladder ml for Back/restore. afterpee() often leaves a
     * residual (25–180); history snapshots of the pee page store that residual,
     * so we remember the last real full level separately from nav resets.
     */
    reliefFromMl: null,
    lastBlad: null,
    peeTimer: null,
    wetIdleTimer: null,
    puddleEntries: null,
    activePeeBeat: null,
    /** While set, organ meter uses this ml instead of game `blad` (drain animation). */
    visualBlad: null,
    /** Back / restoreGame — rebuild stage from scratch (no “continue” pee state). */
    forceFreshVisual: false,
  };

  var DRAIN_MS = 5200; // fallback only if clip meta missing
  /** Forward-only multi-spurt wetting length (frames × 100ms) before wet idle. */
  var WET_ONESHOT_MS = {
    diane: 2200,
    molly: 3000,
    debbie: 2900,
    amanda: 2500,
    chloe: 2700,
  };

  var el = {};

  function $(id) {
    return document.getElementById(id);
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [0, 2, 4].map(function (i) {
      return parseInt(h.slice(i, i + 2), 16);
    });
  }
  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map(function (n) {
          return Math.round(n).toString(16).padStart(2, "0");
        })
        .join("")
    );
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function lerpHex(a, b, t) {
    var A = hexToRgb(a),
      B = hexToRgb(b);
    return rgbToHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t));
  }
  function urineAt(pct) {
    var p = Math.max(0, Math.min(100, pct));
    var i = 0;
    while (i < URINE_RAMP.length - 1 && URINE_RAMP[i + 1].at <= p) i++;
    var a = URINE_RAMP[i],
      b = URINE_RAMP[Math.min(i + 1, URINE_RAMP.length - 1)];
    var t = (p - a.at) / Math.max(1, b.at - a.at);
    return {
      lit: lerpHex(a.lit, b.lit, t),
      mid: lerpHex(a.mid, b.mid, t),
      deep: lerpHex(a.deep, b.deep, t),
    };
  }

  /**
   * Map game ml → meter % against the late-game story ladder
   * (sitting_desp / standing_desp / queue_desp + walk-home disaster):
   *   Comfortable  ~0–430 ml   → 0–39%
   *   Needs to go  ~430–700 ml → 39–68%   (early need / “dying for”)
   *   Desperate    ~700–880 ml → 68–88%   (*_desp desperate territory)
   *   Critical     ~880–1000 ml→ 88–100%  (absolute / near-wet; disaster >975)
   * Visual full = 1000 ml. Organ / colour / band / sprite / .urgent|.full|.crit
   * all derive from this same %.
   */
  function displayBlad() {
    if (state.visualBlad != null) return state.visualBlad;
    return typeof blad === "number" ? blad : 0;
  }

  /**
   * Bladder ml on the page before the current one (top of Back stack).
   * After goback onto a pee page, that snapshot is the full-bladder predecessor.
   */
  function peekHistoryBlad() {
    try {
      if (typeof gameHistory === "undefined" || !gameHistory || !gameHistory.length) return null;
      var snap = gameHistory[gameHistory.length - 1];
      if (!snap || !snap.state) return null;
      var b = snap.state.blad;
      return typeof b === "number" ? b : null;
    } catch (eHist) {
      return null;
    }
  }

  /** Best pre-relief ml for replaying a drain on an already-emptied pee page. */
  function resolveReliefFromMl(fallback) {
    var hist = peekHistoryBlad();
    if (typeof hist === "number" && hist > 200) return hist;
    if (typeof state.reliefFromMl === "number" && state.reliefFromMl > 200)
      return state.reliefFromMl;
    if (typeof state.drainFromMl === "number" && state.drainFromMl > 200) return state.drainFromMl;
    return typeof fallback === "number" ? fallback : 820;
  }

  function rememberReliefFrom(fromMl) {
    fromMl = Number(fromMl) || 0;
    if (fromMl > 200) state.reliefFromMl = fromMl;
  }

  /** Same ladder as Diane’s organ meter — usable for any ml (e.g. mollyblad). */
  function bladPctFromMl(b) {
    b = Math.max(0, Number(b) || 0);
    if (b <= 0) return 0;
    if (b <= 430) return Math.round((b / 430) * 39);
    if (b <= 700) return Math.round(39 + ((b - 430) / 270) * 29);
    if (b <= 880) return Math.round(68 + ((b - 700) / 180) * 20);
    if (b <= 1000) return Math.round(88 + ((b - 880) / 120) * 12);
    return 100;
  }

  function bladPct() {
    return bladPctFromMl(displayBlad());
  }

  /**
   * Story ml for a cast, when the game tracks one.
   * Diane → blad (with visual drain). Molly → mollyblad. Others → null (heuristics).
   */
  function castBladMl(castKey) {
    if (castKey === "diane") return displayBlad();
    if (castKey === "molly") {
      try {
        if (typeof mollyblad === "number") return mollyblad;
      } catch (eM) {}
      return 550;
    }
    return null;
  }

  /**
   * Desperation band for a specific character sprite (not always Diane’s blad).
   */
  function bandForCast(castKey, tag) {
    tag = String(tag || "");
    castKey = castKey || "diane";

    // Diane’s accident idle only applies to Diane
    if (castKey === "diane" && state.wet) {
      return { key: "wet", file: GIF.wetIdle };
    }

    var ml = castBladMl(castKey);
    if (ml != null) {
      var pct = bladPctFromMl(ml);
      // Molly: prefer Desperate+; Critical on pee-focus beats (need reads too mild)
      if (castKey === "molly") {
        if (ml > 850 && pct < 88) pct = 90;
        else if (ml > 600 && pct < 68) pct = 74;
        // Solo skip voyeur: blad already >600 to unlock; 4 leads straight into 4a
        if (/^luckytrip4a?$/.test(tag) && pct < 88) pct = 90;
        // Under-bridge wait / Diane's pee only — not Molly's pee page or the reunion
        if ((tag === "luckytrip3" || tag === "underbridge") && pct < 68) pct = 74;
        if (/^(stagedoor|foyerbar|pubdrink)/.test(tag) && pct < 68) pct = 74;
      }
      return bandFromPct(pct);
    }

    // No story bladder — tag heuristics. Prefer Desperate/Critical over mild Need.
    if (castKey === "debbie") {
      // Aftermath: she has already peed / walked back relieved
      if (/^(carpark2|carpark3|peepround1|gentleman)$/.test(tag)) {
        return bandFromPct(20);
      }
      if (/carpark|luckytrip7|watchblonde|queue1|peepround|peepunder/.test(tag)) {
        return bandFromPct(90); // Critical — camper / duo pee
      }
      return bandFromPct(74); // Desperate
    }
    if (castKey === "chloe") {
      // Prize / leave pages after the house watch
      if (/^(watching6|leavechloe)$/.test(tag)) {
        return bandFromPct(20);
      }
      if (/watching|luckytrip19|gonow|leavechloe|scenario4/.test(tag)) {
        return bandFromPct(92); // Critical
      }
      return bandFromPct(74);
    }
    if (castKey === "amanda") {
      // Out of the bathroom, flushed but no longer desperate
      if (/^luckytrip31[c-e]$/.test(tag)) {
        return bandFromPct(20);
      }
      if (/goupstairs|luckytrip31|scenario[568]/.test(tag)) {
        return bandFromPct(90); // Critical
      }
      return bandFromPct(74);
    }
    return bandFromPct(40);
  }

  function tummyPct() {
    var p = typeof proc === "number" ? proc : 0;
    return Math.max(0, Math.min(100, Math.round(p)));
  }
  /**
   * Intimacy bar: scale to 180 (not 200).
   * Highest story branch that still matters is `inti > 180` (bathroom favour /
   * post-date follow-up); above that, further points don't change gameplay.
   * 180 fills the bar at that gate with no unreachable headroom. Start 20 ≈ 11%.
   * Number display stays raw `inti`.
   */
  function intiPct() {
    var v = typeof inti === "number" ? inti : 0;
    return Math.max(0, Math.min(100, Math.round((v / 180) * 100)));
  }
  /**
   * Shyness (`points`): starts 20, floored at 0.
   * Highest story gate is `points > 30` (several late branches); scale to 30 so
   * the bar fills at that gate — same rule as intimacy / 180. Raw number still shown.
   * Start 20 ≈ 67%. Values above 30 clamp the fill at 100%.
   */
  function shyPct() {
    var v = typeof points === "number" ? points : 0;
    return Math.max(0, Math.min(100, Math.round((v / 30) * 100)));
  }

  /** Band cutovers align with bladPct: 40%≈450 ml, 68%≈700, 88%≈880. */
  function bandFromPct(pct) {
    if (pct >= 88) return { key: "critical", file: GIF.critical };
    if (pct >= 68) return { key: "desperate", file: GIF.desperate };
    if (pct >= 40) return { key: "need", file: GIF.need };
    return { key: "calm", file: GIF.calm };
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  function spriteUrl(castKey, file) {
    var c = CAST[castKey] || CAST.diane;
    var name = file;
    if (prefersReducedMotion() && /\.gif$/i.test(file)) {
      name = file.replace(/\.gif$/i, ".still.png");
    }
    return ASSET_BASE + c.folder + "/" + name;
  }

  var puddleEngine = null;
  function getPuddleEngine() {
    if (puddleEngine) return puddleEngine;
    if (root.ADWDPuddleSync && root.ADWDPuddleSync.create) {
      puddleEngine = root.ADWDPuddleSync.create();
      if (el.puddle) puddleEngine.bind(el.puddle, el.stage);
    }
    return puddleEngine;
  }

  function clearPuddle() {
    state.puddleEntries = null;
    var eng = getPuddleEngine();
    if (eng) eng.stop();
  }

  /** Wipe pee/puddle/drain so Back/restore can rebuild the page beat cleanly. */
  function resetVisualFxForNav() {
    clearPeeTimer();
    clearWetIdleTimer();
    clearPuddle();
    state.playingEvent = false;
    state.activePeeBeat = null;
    state.peeReplay = false;
    state.visualBlad = null;
    state.wet = false;
    showRecBadge(false);
    setBladFillTransition(true);
  }

  function holdPuddleFull() {
    var eng = getPuddleEngine();
    if (eng) eng.holdFull();
  }

  function preloadImage(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = img.onerror = function () {
        resolve();
      };
      img.src = url;
    });
  }

  /**
   * Frame-locked grow bank — same timing as the puddle sync engine.
   * Prepares maps, then starts character GIFs + puddle clock on the same tick.
   */
  function startSyncedPuddle(entries, kind, continuing) {
    state.puddleEntries = entries || state.puddleEntries || null;
    var eng = getPuddleEngine();
    if (!eng) return Promise.resolve();
    if (el.puddle && el.stage) eng.bind(el.puddle, el.stage);
    var list = entries || state.puddleEntries || [];
    return eng.start(list, kind === "wet" ? "wet" : "pee", !!continuing);
  }

  /** After sprites are on screen, kick the puddle scrub clock (aligned with GIF t=0). */
  function syncPuddleClock() {
    var eng = getPuddleEngine();
    if (eng && eng.beginClock) eng.beginClock();
  }

  /** Ensure a full puddle is showing (wet idle / aftermath). */
  function ensureHeldPuddle(castKey) {
    var eng = getPuddleEngine();
    if (eng && eng.isActive()) {
      eng.holdFull();
      return Promise.resolve();
    }
    var key = castKey || "diane";
    var entries = state.puddleEntries || [{ castKey: key, charFile: GIF.wetting }];
    return startSyncedPuddle(entries, "wet", false).then(function () {
      holdPuddleFull();
    });
  }

  function setOrganFill(rect, pct) {
    if (!rect) return;
    rect.style.transform = "scaleY(" + Math.max(0, Math.min(100, pct)) / 100 + ")";
  }

  function setBladColour(pct) {
    var c = urineAt(state.wet ? 8 : pct);
    var lit = $("blad-stop-lit"),
      mid = $("blad-stop-mid"),
      deep = $("blad-stop-deep");
    if (lit) lit.setAttribute("stop-color", c.lit);
    if (mid) mid.setAttribute("stop-color", c.mid);
    if (deep) deep.setAttribute("stop-color", c.deep);
  }

  function organMlTip(ml) {
    return ui.text("volume").replace("{value}", typeof ml === "number" ? ml : "—");
  }

  function setOrganTip(node, tip) {
    if (!node) return;
    node.setAttribute("data-tip", tip);
    node.setAttribute("aria-label", tip);
    node.removeAttribute("title");
  }

  function renderMeters() {
    var bp = bladPct();
    var tp = tummyPct();
    setOrganFill(el.tummyRect, tp);
    setOrganFill(el.bladRect, bp);
    setBladColour(bp);
    var tummyMl = typeof proc === "number" ? proc : null;
    var bladMl = displayBlad();
    setOrganTip(el.tummyOrg, organMlTip(tummyMl));
    setOrganTip(el.bladOrg, organMlTip(Math.round(bladMl)));
    if (el.tummyOrg) {
      el.tummyOrg.setAttribute(
        "aria-label",
        ui.text("tummy") + ui.text("separator") + organMlTip(tummyMl),
      );
    }
    if (el.bladOrg) {
      el.bladOrg.setAttribute(
        "aria-label",
        ui.text("bladder") + ui.text("separator") + organMlTip(Math.round(bladMl)),
      );
    }
    // Tips only on .organ hover — labels stay clear of ml popovers
    if (el.tummyLabel) {
      el.tummyLabel.removeAttribute("data-tip");
      el.tummyLabel.removeAttribute("aria-label");
      el.tummyLabel.removeAttribute("title");
    }
    if (el.bladLabel) {
      el.bladLabel.removeAttribute("data-tip");
      el.bladLabel.removeAttribute("aria-label");
      el.bladLabel.removeAttribute("title");
    }
    if (el.intiFill) el.intiFill.style.width = intiPct() + "%";
    if (el.shyFill) el.shyFill.style.width = shyPct() + "%";
    if (el.intiN) el.intiN.textContent = typeof inti === "number" ? inti : "—";
    if (el.shyN) el.shyN.textContent = typeof points === "number" ? points : "—";
    if (el.pounds)
      el.pounds.textContent =
        typeof pounds === "number" ? formatPounds(pounds, ui.language()) : "—";
    if (el.coins) {
      var luck = typeof luckshots === "number" ? luckshots : 0;
      el.coins.innerHTML = [0, 1, 2]
        .map(function (i) {
          return '<i class="coin' + (i < luck ? "" : " off") + '"></i>';
        })
        .join("");
    }
    var hot = !state.wet && bp >= 78;
    var crit = !state.wet && bp >= 88;
    if (el.bladOrg) {
      el.bladOrg.classList.toggle("full", hot);
      el.bladOrg.classList.toggle("crit", crit);
    }
    if (el.stage) el.stage.classList.toggle("urgent", hot);
  }

  function renderCast(scene, clipOverrides) {
    if (!el.cast) return;
    var primary = scene.cast.primary || "diane";
    var secondary = scene.cast.secondary || null;

    clipOverrides = clipOverrides || null;
    var tag = scene.tag || (typeof currentTag !== "undefined" ? currentTag : "");

    // Per-cast desperation — Molly uses mollyblad, etc. (not Diane’s blad for everyone)
    var primaryBand = bandForCast(primary, tag);
    var primaryFile = (clipOverrides && clipOverrides[primary]) || primaryBand.file;
    var html = "";
    html +=
      '<img class="sprite sprite-primary' +
      (spriteShouldTremor(primaryBand, primaryFile) ? " tremor" : "") +
      '" data-cast="' +
      primary +
      '" id="spritePrimary" alt="' +
      ui.text("names." + primary) +
      '" src="' +
      spriteUrl(primary, primaryFile) +
      '" />';
    if (secondary) {
      var secondaryBand = bandForCast(secondary, tag);
      var secondaryFile = (clipOverrides && clipOverrides[secondary]) || secondaryBand.file;
      html +=
        '<img class="sprite sprite-secondary' +
        (spriteShouldTremor(secondaryBand, secondaryFile) ? " tremor" : "") +
        '" data-cast="' +
        secondary +
        '" alt="' +
        ui.text("names." + secondary) +
        '" src="' +
        spriteUrl(secondary, secondaryFile) +
        '" />';
    }
    el.cast.innerHTML = html;
    el.cast.classList.toggle("duo", !!secondary);
    el.cast.classList.remove("tremor");
    el.wrap = el.cast;
    el.sprite = $("spritePrimary");
  }

  /** CSS tremor is for desperate/critical idle only — never on pee/wet action clips. */
  function isReliefClip(file) {
    return file === GIF.peeA || file === GIF.peeB || file === GIF.wetting || file === GIF.wetIdle;
  }

  function spriteShouldTremor(band, file) {
    if (prefersReducedMotion() || state.wet) return false;
    if (isReliefClip(file)) return false;
    return !!(band && (band.key === "desperate" || band.key === "critical"));
  }

  /** Keep duo partners independent: only this cast’s idle desperation may shake. */
  function syncSpriteTremor(castKey, file) {
    if (!el.cast) return;
    var img = el.cast.querySelector('[data-cast="' + castKey + '"]');
    if (!img) return;
    var tag = typeof currentTag !== "undefined" ? currentTag : "";
    var band = bandForCast(castKey, tag);
    img.classList.toggle("tremor", spriteShouldTremor(band, file));
  }

  function setSpriteClip(castKey, file, bustCache) {
    if (!el.cast) return;
    var img = el.cast.querySelector('[data-cast="' + castKey + '"]');
    if (!img) return;
    var url = spriteUrl(castKey, file);
    if (bustCache) url += (url.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
    // Skip no-op src writes — reassigning the same URL can still reset some browsers
    if (!bustCache && img.getAttribute("src") === url) {
      syncSpriteTremor(castKey, file);
      return;
    }
    img.setAttribute("src", url);
    syncSpriteTremor(castKey, file);
  }

  function clearPeeTimer() {
    if (state.peeTimer) {
      window.clearTimeout(state.peeTimer);
      window.clearInterval(state.peeTimer);
      state.peeTimer = null;
    }
    var eng = getPuddleEngine();
    if (eng && eng.setOnScrub) eng.setOnScrub(null);
  }

  function clearWetIdleTimer() {
    if (state.wetIdleTimer) {
      window.clearTimeout(state.wetIdleTimer);
      state.wetIdleTimer = null;
    }
  }

  function setBladFillTransition(on) {
    if (!el.bladRect) return;
    el.bladRect.style.transition = on ? "" : "none";
  }

  /**
   * Bladder ml for one pee pong frame.
   * Drain on gushes → refill during end-of-arc hold/tidy → full again before next floor land.
   */
  function mlAtPeeLoopFrame(i, info, fromMl, toMl, loopLen) {
    var stream = info.streamStart != null ? info.streamStart | 0 : info.gush1 | 0;
    var g2 =
      info.gush2Scrub != null
        ? info.gush2Scrub | 0
        : info.gush2 != null
          ? info.gush2 | 0
          : stream + 8;
    var fullAt =
      info.gush2FullAt != null
        ? info.gush2FullAt | 0
        : info.streamEnd != null
          ? info.streamEnd | 0
          : g2 + 8;
    if (fullAt <= g2) fullAt = g2 + 1;
    loopLen = loopLen | 0;
    if (loopLen < fullAt + 2) loopLen = fullAt + 2;
    var growSpan = Math.max(12, (info.gush1Cap != null ? info.gush1Cap | 0 : 12) + 9);
    var g1Ratio =
      info.gush1Cap != null ? Math.max(0.35, Math.min(0.75, (info.gush1Cap | 0) / growSpan)) : 0.55;

    // Wait / prep before floor land — already topped up from previous arc's hold refill
    if (i < stream) return fromMl;

    // Gush 1 + 2 — drain with the puddle
    if (i < g2) {
      var t1 = (i - stream) / Math.max(1, g2 - stream);
      t1 = 1 - (1 - t1) * (1 - t1);
      return fromMl + (toMl - fromMl) * (g1Ratio * t1);
    }
    if (i <= fullAt) {
      var t2 = (i - g2) / Math.max(1, fullAt - g2);
      return fromMl + (toMl - fromMl) * (g1Ratio + (1 - g1Ratio) * t2);
    }

    // End-of-loop hold / tidy / clear — refill so the next arc starts full seamlessly
    var refillStart = fullAt + 1;
    var refillEnd = loopLen - 1;
    var span = Math.max(1, refillEnd - refillStart);
    var tr = (i - refillStart) / span;
    if (tr < 0) tr = 0;
    if (tr > 1) tr = 1;
    // Ease-in so it starts gentle on the hold, lands full by loop wrap
    tr = tr * tr;
    return toMl + (fromMl - toMl) * tr;
  }

  /**
   * Animate bladder with puddle gushes. Pee loops: refill + drain every pong cycle.
   * Wetting: oneshot drain then hold empty.
   */
  function startGushSyncedDrain(fromMl, toMl, info, kind) {
    clearPeeTimer();
    fromMl = Math.max(0, Number(fromMl) || 0);
    toMl = Math.max(0, Number(toMl) || 0);
    var eng = getPuddleEngine();
    if (eng && eng.setOnScrub) eng.setOnScrub(null);

    if (fromMl <= toMl + 1) {
      state.visualBlad = null;
      state.drainFromMl = null;
      setBladFillTransition(true);
      renderMeters();
      return;
    }
    if (!info) {
      startBladderDrainLinear(fromMl, toMl);
      return;
    }

    setBladFillTransition(false);
    state.drainFromMl = fromMl;

    rememberReliefFrom(fromMl);
    state.visualBlad = fromMl;
    renderMeters();

    if (prefersReducedMotion()) {
      state.visualBlad = toMl;
      state.lastBlad = toMl;
      setBladFillTransition(false);
      renderMeters();
      return;
    }

    if (kind === "wet") {
      // Oneshot — same as before, no refill loop
      var stream = info.streamStart != null ? info.streamStart | 0 : info.gush1 | 0;
      var g2 = info.gush2 != null ? info.gush2 | 0 : stream + 6;
      var fullAt = info.streamEnd != null ? info.streamEnd | 0 : g2 + 6;
      if (fullAt <= g2) fullAt = g2 + 1;
      var growSpan = Math.max(12, (info.gush1Cap != null ? info.gush1Cap | 0 : 12) + 9);
      var g1Ratio =
        info.gush1Cap != null
          ? Math.max(0.35, Math.min(0.75, (info.gush1Cap | 0) / growSpan))
          : 0.55;
      var t0 =
        (eng && eng.getT0 && eng.getT0()) ||
        (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());
      state.peeTimer = window.setInterval(function () {
        var now =
          typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
        var scrub = Math.floor((now - t0) / 100);
        var ml;
        if (scrub < stream) ml = fromMl;
        else if (scrub < g2) {
          var t1 = (scrub - stream) / Math.max(1, g2 - stream);
          t1 = 1 - (1 - t1) * (1 - t1);
          ml = fromMl + (toMl - fromMl) * (g1Ratio * t1);
        } else if (scrub <= fullAt) {
          var t2 = (scrub - g2) / Math.max(1, fullAt - g2);
          ml = fromMl + (toMl - fromMl) * (g1Ratio + (1 - g1Ratio) * t2);
        } else {
          ml = toMl;
          clearPeeTimer();
          state.visualBlad = toMl;
          state.lastBlad = toMl;
          setBladFillTransition(true);
          renderMeters();
          return;
        }
        state.visualBlad = ml;
        renderMeters();
      }, 40);
      return;
    }

    // Pee: drive from puddle scrub so refill/drain stay locked to the grow map forever
    var loopLen =
      info.loopFrames != null
        ? info.loopFrames | 0
        : info.srcFrames | 0
          ? (info.srcFrames | 0) * 2 - 2
          : 68;
    if (loopLen < 20) loopLen = 68;

    function onPeeScrub(scrub) {
      var i = ((scrub % loopLen) + loopLen) % loopLen;
      state.visualBlad = mlAtPeeLoopFrame(i, info, fromMl, toMl, loopLen);
      state.lastBlad = state.visualBlad;
      renderMeters();
      // REC after the first complete arc (scrub hits loop length)
      if (!state.peeReplay && scrub >= loopLen) {
        state.peeReplay = true;
        state.playingEvent = false;
        showRecBadge(true);
        setStageStatus("peeing");
      }
    }

    if (eng && eng.setOnScrub) {
      eng.setOnScrub(onPeeScrub);
      // Also poll in case tick is quiet before first interval
      onPeeScrub(0);
    } else {
      var t0b =
        (eng && eng.getT0 && eng.getT0()) ||
        (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());
      state.peeTimer = window.setInterval(function () {
        var now =
          typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
        onPeeScrub(Math.floor((now - t0b) / 100));
      }, 40);
    }
  }

  /** Fallback linear drain when clip meta is unavailable. */
  function startBladderDrainLinear(fromMl, toMl) {
    clearPeeTimer();
    fromMl = Math.max(0, Number(fromMl) || 0);
    toMl = Math.max(0, Number(toMl) || 0);
    if (fromMl <= toMl + 1) {
      state.visualBlad = null;
      setBladFillTransition(true);
      renderMeters();
      return;
    }
    setBladFillTransition(false);
    rememberReliefFrom(fromMl);
    state.drainFromMl = fromMl;
    state.visualBlad = fromMl;
    renderMeters();
    if (prefersReducedMotion()) {
      state.visualBlad = toMl;
      state.lastBlad = toMl;
      setBladFillTransition(false);
      renderMeters();
      return;
    }
    var t0 = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
    state.peeTimer = window.setInterval(function () {
      var now =
        typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
      var t = Math.min(1, (now - t0) / DRAIN_MS);
      var eased = 1 - Math.pow(1 - t, 2.2);
      state.visualBlad = fromMl + (toMl - fromMl) * eased;
      renderMeters();
      if (t >= 1) {
        clearPeeTimer();
        state.visualBlad = toMl;
        state.lastBlad = toMl;
        setBladFillTransition(true);
        renderMeters();
      }
    }, 40);
  }

  /** Resolve beat clip id → filename for a cast (peeB falls back to peeA). */
  function resolveClipFile(castKey, clipId) {
    clipId = clipId || "peeA";
    if (clipId === "peeB") {
      return PEE_B_CAST[castKey] ? GIF.peeB : GIF.peeA;
    }
    if (clipId === "peeA" || clipId === "pee") return GIF.peeA;
    if (clipId === "wetIdle" || clipId === "idle") return GIF.wetIdle;
    if (
      clipId === "wetting" ||
      clipId === "wetEvent" ||
      clipId === "wetStream" ||
      clipId === "event" ||
      clipId === "stream"
    ) {
      return GIF.wetting;
    }
    return GIF.peeA;
  }

  function clipForKey(beat, keyIndex, castKey) {
    if (beat.clips && beat.clips[keyIndex]) return resolveClipFile(castKey, beat.clips[keyIndex]);
    return resolveClipFile(castKey, beat.clip);
  }

  /**
   * Puddle slots in stage cast order (primary left → secondary right).
   * Duo with one pee-er: spacer under the other so the puddle stays under the right feet.
   * Duo both peeing: two live puddles, one under each.
   */
  function buildPuddleEntries(scene, peeingKeys, overrides) {
    peeingKeys = peeingKeys || [];
    overrides = overrides || {};
    var primary = (scene && scene.cast && scene.cast.primary) || "diane";
    var secondary = scene && scene.cast && scene.cast.secondary;
    if (!secondary) {
      return peeingKeys.map(function (k) {
        return { castKey: k, charFile: overrides[k] };
      });
    }
    var order = [primary, secondary];
    var out = [];
    for (var i = 0; i < order.length; i++) {
      var k = order[i];
      if (peeingKeys.indexOf(k) >= 0) {
        out.push({ castKey: k, charFile: overrides[k] });
      } else {
        out.push({ castKey: k, spacer: true });
      }
    }
    return out;
  }

  function beatClipId(beat) {
    if (!beat) return "";
    if (beat.clip) return beat.clip;
    if (beat.clips && beat.clips[0]) return beat.clips[0];
    return "";
  }

  /** Same ongoing pee/wet act across consecutive pages — don't restart the GIF. */
  function beatsContinue(prev, next) {
    if (!prev || !next) return false;
    if (prev.outcome !== next.outcome) return false;
    var pk = (prev.keys || []).join(",");
    var nk = (next.keys || []).join(",");
    if (pk !== nk) return false;
    if (prev.outcome === "wet") {
      var pc = beatClipId(prev);
      var nc = beatClipId(next);
      // wetIdle after wetting is a settle, not a continue of the stream
      if (pc === "wetIdle" || nc === "wetIdle") return pc === nc;
      return true;
    }
    var a = beatClipId(prev);
    var b = beatClipId(next);
    if (a === b) return true;
    if ((a === "peeA" || a === "pee") && (b === "peeA" || b === "pee")) return true;
    return false;
  }

  function showRecBadge(on) {
    if (!el.rec) el.rec = $("stageRec");
    if (!el.rec) return;
    if (on) {
      el.rec.hidden = false;
      el.rec.setAttribute("aria-hidden", "false");
    } else {
      el.rec.hidden = true;
      el.rec.setAttribute("aria-hidden", "true");
    }
  }

  /** End a looping pee/wet page: apply wet idle or return to calm meters. */
  function finalizePeeBeat(beat) {
    clearPeeTimer();
    clearWetIdleTimer();
    state.playingEvent = false;
    state.activePeeBeat = null;
    state.peeReplay = false;
    showRecBadge(false);
    state.visualBlad = null;
    setBladFillTransition(true);
    if (!beat) {
      clearPuddle();
      return;
    }
    state.wet = beat.outcome === "wet";
    if (typeof blad === "number" && blad <= 0 && beat.outcome !== "wet") {
      state.wet = false;
    }
    if (state.wet) {
      holdPuddleFull();
      if (!getPuddleEngine() || !getPuddleEngine().isActive()) {
        var sc =
          root.ADWDSceneMap && root.ADWDSceneMap.resolve
            ? root.ADWDSceneMap.resolve(typeof currentTag !== "undefined" ? currentTag : "")
            : null;
        ensureHeldPuddle((sc && sc.cast && sc.cast.primary) || "diane");
      }
    } else {
      clearPuddle();
    }
  }

  function scheduleWetIdle(scene, castKey) {
    clearWetIdleTimer();
    var ms = prefersReducedMotion() ? 0 : WET_ONESHOT_MS[castKey] || 2400;
    state.wetIdleTimer = window.setTimeout(function () {
      state.wetIdleTimer = null;
      if (!state.playingEvent) return;
      state.wet = true;
      state.playingEvent = false;
      // Keep activePeeBeat so disaster2 can still "continue" as wet idle visually
      setSpriteClip(castKey, GIF.wetIdle, false);
      holdPuddleFull();
      setStageStatus("wet");
      el.cast.classList.remove("tremor");
      renderMeters();
    }, ms);
  }

  /**
   * REC badge is armed from the looping pee scrub (first full arc).
   * Kept as a named hook so playPeeBeat can document the replay contract.
   */

  /**
   * Play pee (07/08) or wetting (06) clips.
   * Pee: loops with puddle sync; bladder refills+drains each arc; [REC] after first arc.
   * Wetting: oneshot multi-spurt → wet idle, puddle held.
   * @param {number|null} prevBlad bladder ml on the previous page (before afterpee).
   * @param {boolean} continuing same act as previous page — keep GIF, don't restart drain.
   */
  function playPeeBeat(scene, beat, prevBlad, continuing) {
    if (!beat) {
      refreshStage(scene);
      return;
    }

    syncSceneLabels(scene);

    // Aftermath / already-wet idle beat (e.g. legsz1)
    if (beatClipId(beat) === "wetIdle") {
      clearWetIdleTimer();
      clearPeeTimer();
      state.wet = true;
      state.playingEvent = false;
      state.activePeeBeat = beat;
      state.visualBlad = null;
      setBladFillTransition(true);
      refreshStage(scene);
      ensureHeldPuddle((beat.keys && beat.keys[0]) || "diane");
      return;
    }

    // Already wet after leaving an accident sequence — idle only
    // (skip when continuing disaster1→2 mid-stream)
    if (
      !continuing &&
      beat.outcome === "wet" &&
      state.wet &&
      !state.playingEvent &&
      !state.activePeeBeat
    ) {
      refreshStage(scene);
      ensureHeldPuddle((beat.keys && beat.keys[0]) || scene.cast.primary || "diane");
      return;
    }

    if (continuing) {
      state.activePeeBeat = beat;
      if (el.stageBand) {
        setStageStatus(beat.status || (beat.outcome === "wet" ? "wetting" : "peeing"));
      }
      // Settled oneshot / replay: keep idle or looping pee + held puddle
      if (!state.playingEvent && beat.outcome === "wet") {
        state.wet = true;
        var idleKey = (beat.keys && beat.keys[0]) || scene.cast.primary || "diane";
        setSpriteClip(idleKey, GIF.wetIdle, false);
        holdPuddleFull();
        showRecBadge(false);
        setStageStatus("wet");
      } else if (!state.playingEvent && state.peeReplay) {
        var replayKeys =
          beat.keys && beat.keys.length ? beat.keys : [scene.cast.primary || "diane"];
        for (var ri = 0; ri < replayKeys.length; ri++) {
          setSpriteClip(replayKeys[ri], clipForKey(beat, ri, replayKeys[ri]), false);
        }
        // Keep puddle clock looping (do not freeze on full)
        startSyncedPuddle(state.puddleEntries || [], "pee", true);
        showRecBadge(true);
        setStageStatus("peeing");
      } else {
        startSyncedPuddle(
          state.puddleEntries || [],
          beat.outcome === "wet" ? "wet" : "pee",
          true,
        ).then(function (res) {
          if (res && res.ok) syncPuddleClock();
        });
      }
      return;
    }

    clearPeeTimer();
    clearWetIdleTimer();
    state.playingEvent = true;
    state.peeReplay = false;
    showRecBadge(false);
    state.activePeeBeat = beat;
    // Fresh wetting oneshot — not yet "already wet"
    if (beat.outcome === "wet") state.wet = false;

    var status = beat.status || (beat.outcome === "wet" ? "wetting" : "peeing");
    var keys = beat.keys && beat.keys.length ? beat.keys.slice() : [scene.cast.primary || "diane"];
    var mode = beat.mode || "solo";
    if (mode === "sequence") mode = "together";

    var overrides = {};
    var list = mode === "solo" ? [keys[0]] : keys;
    var preload = [];
    for (var t = 0; t < list.length; t++) {
      overrides[list[t]] = clipForKey(beat, t, list[t]);
      preload.push(preloadImage(spriteUrl(list[t], overrides[list[t]])));
    }
    // Cast-order puddle slots (spacers keep solo pees aligned in duo layouts)
    var puddleEntries = buildPuddleEntries(scene, list, overrides);
    state.puddleEntries = puddleEntries;
    setStageStatus(status);
    el.cast.classList.remove("tremor");
    // Show pee clips immediately — don't wait on puddle decode (duo spacers used to abort this)
    renderCast(scene, overrides);

    // Decode grow bank + preload char GIFs, THEN start puddle clock aligned to GIFs
    var dianePeeing = list.indexOf("diane") >= 0;
    var fromMl = typeof prevBlad === "number" ? prevBlad : displayBlad();
    // Intentional Diane pee empties the organ visually even if story blad lags a page
    var toMl = typeof blad === "number" ? blad : 0;
    if (dianePeeing && beat.outcome !== "wet" && toMl > fromMl) toMl = 0;
    if (dianePeeing && beat.outcome !== "wet" && fromMl > 40 && toMl > fromMl * 0.5) toMl = 0;
    // Back/restore: pee-page snapshots already include afterpee() residual (often 25–180).
    // That is not a real “full” fromMl — recover predecessor ml and replay the arc.
    if (dianePeeing && !(fromMl > toMl + 100)) {
      fromMl = resolveReliefFromMl(820);
      if (beat.outcome !== "wet") toMl = Math.min(toMl, 40);
      if (!(fromMl > toMl + 100)) {
        fromMl = 820;
        toMl = beat.outcome === "wet" ? 0 : Math.min(toMl, 40);
      }
      rememberReliefFrom(fromMl);
    }
    var drainKind = beat.outcome === "wet" ? "wet" : "pee";

    Promise.all([startSyncedPuddle(puddleEntries, drainKind, false)].concat(preload))
      .then(function (results) {
        if (state.activePeeBeat !== beat) return;
        var puddleRes = results[0] || {};
        syncPuddleClock();
        // Organ meter is Diane’s only — never drain it for Molly/Debbie/Chloe/Amanda pees
        if (dianePeeing) {
          if (fromMl > toMl + 1) {
            startGushSyncedDrain(fromMl, toMl, puddleRes.info || null, drainKind);
          } else if (fromMl > 80) {
            startGushSyncedDrain(fromMl, 0, puddleRes.info || null, drainKind);
          } else {
            state.visualBlad = null;
            renderMeters();
          }
        } else {
          state.visualBlad = null;
          state.peeReplay = false;
          showRecBadge(false);
          renderMeters();
        }
        if (beat.outcome === "wet" && beatClipId(beat) === "wetting") {
          scheduleWetIdle(scene, list[0]);
        }
      })
      .catch(function (err) {
        console.warn("[pee]", err);
        if (state.activePeeBeat !== beat) return;
        renderCast(scene, overrides);
        renderMeters();
      });
  }

  // Scene metadata must refresh on animated pages too, including Back from a farewell.
  function syncSceneLabels(scene) {
    if (el.stage) el.stage.setAttribute("data-location", scene.location.id);
    if (el.locLabel) el.locLabel.textContent = ui.text("locations." + scene.location.id);
    if (el.focusLabel)
      el.focusLabel.textContent = (scene.cast.focus || ["diane"])
        .map(function (key) {
          return ui.text("names." + key);
        })
        .join(ui.text("join"));
  }

  function refreshStage(scene) {
    if (!scene)
      scene = root.ADWDSceneMap.resolve(typeof currentTag !== "undefined" ? currentTag : "");
    var tag = scene.tag || (typeof currentTag !== "undefined" ? currentTag : "");
    var focusKey = (scene.cast && scene.cast.primary) || "diane";
    var band = bandForCast(focusKey, tag);

    syncSceneLabels(scene);
    syncRailBrand(typeof currentTag !== "undefined" ? currentTag : "");

    if (!state.playingEvent) {
      var pregameNow = document.body.classList.contains("pregame");
      if (el.stageBand) {
        setStageStatus(pregameNow ? "" : state.peeReplay ? "peeing" : band.key);
      }
      if (state.peeReplay && state.activePeeBeat) {
        var beat = state.activePeeBeat;
        var rKeys = beat.keys && beat.keys.length ? beat.keys : [scene.cast.primary || "diane"];
        var rMode = beat.mode || "solo";
        if (rMode === "sequence") rMode = "together";
        var rList = rMode === "solo" ? [rKeys[0]] : rKeys;
        var rOverrides = {};
        for (var rk = 0; rk < rList.length; rk++) {
          rOverrides[rList[rk]] = clipForKey(beat, rk, rList[rk]);
        }
        renderCast(scene, rOverrides);
        // Puddle keeps scrubbing with the GIF — never freeze on full during replay
        var rPuddles =
          state.puddleEntries && state.puddleEntries.length
            ? state.puddleEntries
            : buildPuddleEntries(scene, rList, rOverrides);
        if (!getPuddleEngine() || !getPuddleEngine().isActive()) {
          startSyncedPuddle(rPuddles, "pee", false).then(function () {
            syncPuddleClock();
          });
        }
        showRecBadge(true);
      } else {
        showRecBadge(false);
        renderCast(scene);
        if (state.wet) {
          holdPuddleFull();
          if (!getPuddleEngine() || !getPuddleEngine().isActive()) {
            ensureHeldPuddle(scene.cast.primary || "diane");
          }
        } else clearPuddle();
      }
    }
    renderMeters();
  }

  /** Top-left rail: title until start2 (meeting Diane), then weekday for the rest. */
  function syncRailBrand(tag) {
    var brand = $("railBrand");
    if (!brand) return;
    tag = String(tag || "");
    var day = root.ADWDSceneMap && root.ADWDSceneMap.dayKey ? root.ADWDSceneMap.dayKey() : "";
    var titlePhase =
      !tag || tag === "start" || /^(start1|tuesdaydate|thursdaydate|saturdaydate)/.test(tag);
    brand.textContent = !titlePhase && day ? ui.text("days." + day) : ui.text("title");
  }

  function afterGo(tag) {
    var fresh = !!state.forceFreshVisual;
    if (fresh) {
      // Keep sticky relief + last drain start across the wipe (pee-page Back replay)
      var savedDrainFrom = state.drainFromMl;
      var savedReliefFrom = state.reliefFromMl;
      resetVisualFxForNav();
      if (typeof savedReliefFrom === "number" && savedReliefFrom > 200) {
        state.reliefFromMl = savedReliefFrom;
      }
      if (typeof savedDrainFrom === "number" && savedDrainFrom > 100) {
        state.drainFromMl = savedDrainFrom;
      }
      state.forceFreshVisual = false;
    }

    var scene = root.ADWDSceneMap.resolve(tag);
    var rawBlad = typeof blad === "number" ? blad : 0;
    var prize = root.ADWDSceneMap.isPrizeTag && root.ADWDSceneMap.isPrizeTag(tag);
    var silent = prize || (root.ADWDSceneMap.isSilentEmpty && root.ADWDSceneMap.isSilentEmpty(tag));
    var wetTag = root.ADWDSceneMap.isWetBeat && root.ADWDSceneMap.isWetBeat(tag);

    var pregame = typeof PREGAME_TAGS !== "undefined" && PREGAME_TAGS.indexOf(tag) !== -1;
    var hideDateStats = false;
    if (typeof HIDE_DATE_STATS_TAGS !== "undefined") {
      if (tag === "gameover") hideDateStats = !!holdDateStatsOff;
      else hideDateStats = HIDE_DATE_STATS_TAGS.indexOf(tag) !== -1;
    }
    document.body.classList.toggle("pregame", !!pregame);
    document.body.classList.toggle("hide-date-stats", !!hideDateStats);

    // Explicit map only — never fire clips from afterpee alone on the wrong page,
    // and never on prize / off-screen-relief tags.
    var beat = null;
    if (!pregame && !silent) {
      beat =
        (root.ADWDSceneMap.peeBeat && root.ADWDSceneMap.peeBeat(tag, scene.cast)) ||
        scene.pee ||
        null;
    }

    // Prefer mid-drain level so multi-page pees don't flash full again.
    // On Back/restore onto a pee page, snapshot blad is already post-afterpee —
    // pull the predecessor page’s blad (or sticky relief) so the empty arc replays.
    var prevBlad;
    if (fresh) {
      prevBlad = null;
      if (beat) {
        var histBlad = peekHistoryBlad();
        if (typeof histBlad === "number" && histBlad > rawBlad + 100) prevBlad = histBlad;
        else if (typeof state.reliefFromMl === "number" && state.reliefFromMl > rawBlad + 100) {
          prevBlad = state.reliefFromMl;
        } else if (typeof state.drainFromMl === "number" && state.drainFromMl > rawBlad + 100) {
          prevBlad = state.drainFromMl;
        } else if (rawBlad < 250) {
          prevBlad = resolveReliefFromMl(820);
        }
      }
    } else {
      prevBlad = state.visualBlad != null ? state.visualBlad : state.lastBlad;
    }

    // Back/restore always rebuilds the page beat; forward may continue multi-page acts
    var continuing =
      !fresh && !!(state.activePeeBeat && beat && beatsContinue(state.activePeeBeat, beat));

    // Leaving a pee/wet page: stop the loop unless the next page continues the same act
    if (state.activePeeBeat && !continuing) {
      finalizePeeBeat(state.activePeeBeat);
    }

    // Toilet relief empties blad — calm unless this page is the wetting itself
    if (rawBlad <= 0 && !wetTag && !(beat && beat.outcome === "wet")) state.wet = false;

    state.lastBlad = rawBlad;

    if (beat) {
      playPeeBeat(scene, beat, prevBlad, continuing);
    } else {
      refreshStage(scene);
    }

    syncRailBrand(tag);
    ui.syncChrome();

    polishStoryBox();
    try {
      var storyBox = $("box");
      if (storyBox) storyBox.scrollTop = 0;
    } catch (eScroll) {}

    try {
      var bars = document.querySelectorAll("#box .status-bar, #box .nav-row");
      for (var i = 0; i < bars.length; i++) bars[i].style.display = "none";
    } catch (e) {}
  }

  /**
   * Opening page: drop the yellow title + HR so the goal paragraph
   * reads as the first line of a normal page.
   */
  function polishStoryBox() {
    var box = $("box");
    if (!box) return;
    box.querySelectorAll("h1.game-title").forEach(function (h1) {
      var next = h1.nextElementSibling;
      h1.remove();
      if (next && next.tagName === "HR") next.remove();
    });
    var layers = box.querySelectorAll(".lang");
    (layers.length ? Array.from(layers) : [box]).forEach(function (layer) {
      while (layer.firstElementChild && layer.firstElementChild.tagName === "HR") {
        layer.firstElementChild.remove();
      }
    });
  }

  function setStageStatus(key) {
    if (!el.stageBand) return;
    el.stageBand.dataset.status = key;
    el.stageBand.textContent = key ? ui.text("status." + key) : "";
  }

  function refreshLanguage() {
    var tag = typeof currentTag !== "undefined" ? currentTag : "";
    syncSceneLabels(root.ADWDSceneMap.resolve(tag));
    syncRailBrand(tag);
    if (el.stageBand) setStageStatus(el.stageBand.dataset.status || "");
    document.querySelectorAll(".sprite[data-cast]").forEach(function (sprite) {
      sprite.alt = ui.text("names." + sprite.dataset.cast);
    });
    renderMeters();
    ui.syncChrome();
  }

  function bindDom() {
    el.stage = $("visualStage");
    el.cast = $("stageCast");
    el.puddle = $("stagePuddle");
    el.rec = $("stageRec");
    el.stageBand = $("stageBand");
    el.locLabel = $("locLabel");
    el.railBrand = $("railBrand");
    el.focusLabel = $("focusLabel");
    el.tummyRect = $("tummy-fill-rect");
    el.bladRect = $("blad-fill-rect");
    el.tummyOrg = $("carafe");
    el.bladOrg = $("vessel");
    el.tummyLabel = $("tummy-label");
    el.bladLabel = $("blad-label");
    el.intiFill = $("inti-fill");
    el.shyFill = $("shy-fill");
    el.intiN = $("inti-n");
    el.shyN = $("shy-n");
    el.coins = $("coins");
    el.pounds = $("pounds");
  }

  function hookEngine() {
    if (typeof go === "function") {
      var _go = go;
      root.go = function (tag) {
        _go(tag);
        try {
          afterGo(tag);
        } catch (e) {
          console.error(e);
        }
      };
    }
    if (typeof goback === "function") {
      var _back = goback;
      // restoreGame (called inside goback) already runs afterGo once — don't double-fire
      root.goback = function () {
        state.forceFreshVisual = true;
        _back();
        ui.syncChrome();
      };
    }
    if (typeof restoreGame === "function") {
      var _restore = restoreGame;
      root.restoreGame = function (snapshot) {
        state.forceFreshVisual = true;
        _restore(snapshot);
        try {
          afterGo(typeof currentTag !== "undefined" ? currentTag : "");
        } catch (e) {
          console.error(e);
        }
      };
    }
  }

  function boot() {
    bindDom();
    hookEngine();
    ui.hookEngine();
    document.body.classList.add("visual-edition");
    if (root.ADWDPuddleSync && root.ADWDPuddleSync.preload) {
      root.ADWDPuddleSync.preload().catch(function () {});
    }
    afterGo(typeof currentTag !== "undefined" && currentTag ? currentTag : "start");
  }

  root.VisualShell = {
    afterGo: afterGo,
    refresh: function () {
      afterGo(typeof currentTag !== "undefined" ? currentTag : "");
    },
    refreshLanguage: refreshLanguage,
    boot: boot,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    // Game script may still be parsing; delay one tick
    setTimeout(boot, 0);
  }
})(typeof window !== "undefined" ? window : globalThis);
