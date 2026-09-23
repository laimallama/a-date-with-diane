/**
 * Maps game tags → location label + on-stage cast.
 *
 * The current shell uses a shared stage background, with data-location available for styling.
 * Cast is an allowlist: default Diane alone; duo only when the beat
 * literally has that second woman with Diane (or as the watch focus).
 */
(function (root) {
  "use strict";

  var LOC = {
    title: { id: "title" },
    street: { id: "street" },
    restaurant: { id: "restaurant" },
    theatre: { id: "theatre" },
    foyer: { id: "foyer" },
    pub: { id: "pub" },
    riverside: { id: "riverside" },
    pavilion: { id: "pavilion" },
    bus: { id: "bus" },
    taxi: { id: "taxi" },
    carpark: { id: "carpark" },
    home: { id: "home" },
    bathroom: { id: "bathroom" },
    church: { id: "church" },
    bridge: { id: "bridge" },
    night: { id: "night" },
  };

  function dayKey() {
    if (typeof saturday !== "undefined" && saturday) return "saturday";
    if (typeof thursday !== "undefined" && thursday) return "thursday";
    if (typeof tuesday !== "undefined" && tuesday) return "tuesday";
    return "";
  }

  function match(tag, parts) {
    tag = String(tag || "");
    for (var i = 0; i < parts.length; i++) {
      // Numbered route families must not capture a different number (3 vs 31).
      if (/^luckytrip\d+$/.test(parts[i])) {
        if (new RegExp("^" + parts[i] + "(?![0-9])").test(tag)) return true;
      } else if (tag.indexOf(parts[i]) !== -1) return true;
    }
    return false;
  }

  function exact(tag, list) {
    tag = String(tag || "");
    for (var i = 0; i < list.length; i++) {
      if (tag === list[i]) return true;
    }
    return false;
  }

  function starts(tag, prefixes) {
    tag = String(tag || "");
    for (var i = 0; i < prefixes.length; i++) {
      if (tag === prefixes[i] || tag.indexOf(prefixes[i]) === 0) return true;
    }
    return false;
  }

  function locationFor(tag) {
    tag = String(tag || "");
    if (
      !tag ||
      tag === "start" ||
      match(tag, ["start1", "info", "tuesdaydate", "thursdaydate", "saturdaydate"])
    ) {
      return LOC.title;
    }

    // Explicit exceptions take precedence over legacy name-based location rules.
    if (exact(tag, ["gothere", "flirt_l", "flirt_m", "flirt_h"]))
      return dayFlag("saturday") ? LOC.theatre : LOC.foyer;
    if (exact(tag, ["ontoilet2", "fifthplace"])) return LOC.home;
    if (exact(tag, ["luckytrip18", "luckytrip18a", "luckytrip20", "luckytrip20a"])) return LOC.home;
    if (exact(tag, ["traintalka", "stamptalka", "musictalka", "theatretalka"]))
      return LOC.riverside;
    if (tag === "carpark3" || tag === "carpark2") return LOC.bus;
    if (exact(tag, ["underskirt", "underskirt1", "underskirt2"])) return LOC.theatre;
    if (exact(tag, ["ownjob", "herjob", "stamptalk", "cartalk"])) return LOC.restaurant;
    if (match(tag, ["luckytrip31"])) return LOC.home;
    if (match(tag, ["luckytrip19"])) return LOC.night;
    if (starts(tag, ["search", "goleft", "passage"])) return LOC.night;

    // —— Specific places first (avoid broad substring traps) ——
    if (match(tag, ["church", "lych", "bushome", "luckytrip17", "peestop"])) return LOC.church;
    if (match(tag, ["underbridge", "luckytrip3"])) return LOC.bridge;
    if (match(tag, ["carpark", "camper", "peep", "gentleman", "luckytrip7"])) return LOC.carpark;

    if (
      match(tag, [
        "bathpee",
        "bathroom",
        "gobathroom",
        "hiddencamera",
        "lootogether",
        "ontoilet",
        "sofatoilet",
        "asklooneed",
      ]) ||
      exact(tag, ["gobathroom", "gobathroom1", "gobathroom2", "gobathroom3"])
    ) {
      return LOC.bathroom;
    }

    // Home / lounge / prize endings
    if (
      match(tag, [
        "sofa",
        "scenario",
        "arrivehome",
        "coffeereal",
        "stampalbum",
        "sofatrain",
        "lounge",
        "story",
        "nicelydesp",
        "secondplace",
        "triumph",
        "disaster",
        "walkhome",
        "watching",
        "goupstairs",
        "luckytrip31",
        "luckytrip10",
        "luckytrip11",
        "breasts",
        "bottom",
        "skirt",
        "givebrooch",
        "gameover",
        "showover",
        "ending",
        "consolation",
        "chess",
        "cupoftea",
        "coffeeinstant",
        "godownstairs",
        "sendbrother",
        "offerglass",
        "offercoffee",
        "readytoleave",
        "cuddle",
        "givechance",
        "excuseme",
        "cheat",
        "stophergoing",
      ])
    ) {
      if (match(tag, ["watching", "chloe"]) || starts(tag, ["luckytrip19"])) return LOC.night;
      if (match(tag, ["search", "goleft", "passage", "consolation", "ending5"])) return LOC.night;
      if (match(tag, ["walkhome", "disaster", "showover"])) return LOC.night;
      return LOC.home;
    }

    if (match(tag, ["taxihome", "taxi"])) return LOC.taxi;
    if (
      match(tag, ["busqueue", "queue", "watchblonde", "lastgamble", "luckytrip28", "luckytrip29"])
    )
      return LOC.bus;
    if (match(tag, ["pavilion", "luckytrip8", "luckytrip6", "buywaterpav", "notime", "morewater"]))
      return LOC.pavilion;

    // Riverside walk / outdoor toilets / bushes
    if (
      match(tag, [
        "riverside",
        "portaloo",
        "toilet",
        "helpdiane",
        "together",
        "justclosed",
        "urinal",
        "luckytrip16",
        "luckytrip4",
        "luckytrip5",
        "choosewalk",
        "sitonbench",
        "helphersquat",
      ]) ||
      exact(tag, ["goforpee", "goforpee1"])
    ) {
      return LOC.riverside;
    }

    if (match(tag, ["pubdrink", "choosepub", "leavepub"])) return LOC.pub;

    // Theatre foyer / interval (Ladies, programme seller) — NOT "Town"
    if (
      match(tag, ["interval", "foyer", "theatreask", "buywaterfoyer"]) ||
      exact(tag, [
        "gotheatre",
        "lethergo",
        "stopher",
        "gotoo",
        "gotoo1",
        "askloo",
        "askwait",
        "askwait1",
        "keepquiet",
        "keepquiet1",
        "luckytrip0",
        "luckytrip0a",
        "luckytrip0b",
        "luckytrip1",
        "luckytrip1a",
        "testtue",
        "testtue1",
      ])
    ) {
      return LOC.foyer;
    }

    // Auditorium / stage door
    if (
      match(tag, [
        "theatre",
        "act2",
        "stagedoor",
        "holdhand",
        "leanclose",
        "dianechoice",
        "leavetheatre",
      ]) ||
      exact(tag, ["handonthigh", "handonthigh1", "handonthigh2"])
    ) {
      return LOC.theatre;
    }

    // Restaurant meal / wine list (explicit buy* food & drink tags — not bare "buy")
    if (
      match(tag, [
        "eatmeal",
        "winelist",
        "puddings",
        "espresso",
        "filtercoffee",
        "traintalk",
        "asklootalk",
        "steak",
        "cappuccino",
      ]) ||
      starts(tag, [
        "buy", // buypinot, buytort, … — street shopping excluded below
      ])
    ) {
      if (exact(tag, ["buysth", "buywater", "buybrooch"]) || starts(tag, ["buysth"]))
        return LOC.street;
      if (exact(tag, ["buywaterfoyer"])) return LOC.foyer;
      if (exact(tag, ["buywaterpav"])) return LOC.pavilion;
      return LOC.restaurant;
    }

    // Pre-date high street shopping
    if (exact(tag, ["buysth", "buywater", "buybrooch", "start2"])) {
      return LOC.street;
    }

    return LOC.street;
  }

  /**
   * Cast rules (intentional):
   * - Default: Diane alone.
   * - When Diane shares the stage with anyone, Diane is always primary (left);
   *   the other woman stays on the right even if she is the one peeing.
   * - Solo others only when Diane is not in the scene (Molly peep, Debbie alone,
   *   Chloe house-watch, Amanda upstairs).
   */
  function castFor(tag) {
    tag = String(tag || "");

    // After watching Debbie pee: bus stop again — Diane impatient; brunette relieved.
    // Spagbol route: Diane already left on the bus; only the brunette remains.
    if (tag === "carpark2") {
      if (dayFlag("spagbol")) return { primary: "debbie", focus: ["debbie"] };
      return { primary: "diane", secondary: "debbie", focus: ["diane"] };
    }
    // Back in the queue with Diane after the camper watch.
    if (tag === "carpark3") return { primary: "diane", focus: ["diane"] };

    // —— Chloe: watching her house (you alone / luckshot) ——
    if (starts(tag, ["watching", "luckytrip19"]) || exact(tag, ["leavechloe", "gonow"])) {
      return { primary: "chloe", focus: ["chloe"] };
    }

    // —— Home with brother: Diane + Chloe in the room ——
    if (starts(tag, ["scenario4"]) || exact(tag, ["scenario5a", "scenario5aa", "scenario5b"])) {
      return { primary: "diane", secondary: "chloe", focus: ["diane", "chloe"] };
    }

    // —— Amanda upstairs (Diane gone / her prize) ——
    if (
      starts(tag, ["goupstairs", "luckytrip31"]) ||
      exact(tag, ["scenario8", "scenario5", "scenario6", "scenario6a", "scenario6b", "scenario6c"])
    ) {
      return { primary: "amanda", focus: ["amanda"] };
    }

    // —— Debbie (brunette) ——
    // Alone: queue / camper alone / luckshot7 (Diane not on stage)
    if (
      exact(tag, ["carparkalone", "watchblonde", "queue1a", "queue1b"]) ||
      starts(tag, ["luckytrip7"]) ||
      (starts(tag, ["carpark"]) && !starts(tag, ["carparka"]))
    ) {
      return { primary: "debbie", focus: ["debbie"] };
    }
    // Together with Diane — Diane always left
    if (
      exact(tag, ["peepround", "peepunder", "peepround1", "gentleman"]) ||
      starts(tag, ["carparka"])
    ) {
      return { primary: "diane", secondary: "debbie", focus: ["diane", "debbie"] };
    }

    // —— Molly ——
    // Voyeur: Molly alone (Diane stayed on the path)
    if (exact(tag, ["luckytrip4", "luckytrip4a"])) {
      return { primary: "molly", focus: ["molly"] };
    }
    // After peeping: back with Diane only
    if (exact(tag, ["luckytrip4b", "luckytrip4c", "luckytrip4d", "riverside13", "riverside13b"])) {
      return { primary: "diane", focus: ["diane"] };
    }
    // Under bridge / foyer / stage door / pub — Diane left, Molly right
    if (
      starts(tag, ["underbridge"]) ||
      exact(tag, ["luckytrip3"]) ||
      starts(tag, ["foyerbar", "pubdrink"]) ||
      starts(tag, ["stagedoor"])
    ) {
      return { primary: "diane", secondary: "molly", focus: ["diane", "molly"] };
    }

    return { primary: "diane", focus: ["diane"] };
  }

  /** Ending / prize cards — never start a pee or wet clip here. */
  function isPrizeTag(tag) {
    tag = String(tag || "");
    return (
      exact(tag, [
        "consolation",
        "watching6",
        "ending5",
        "triumph",
        "secondplace",
        "secondplace1",
        "fifthplace",
      ]) || starts(tag, ["ending"])
    );
  }

  /** Involuntary / through-clothes wetting — clip on the page she actually wets. */
  function isWetBeat(tag) {
    tag = String(tag || "");
    /* disaster1 = realises it has started; disaster2 = watching the stream */
    if (/^disaster[12]$/.test(tag)) return true;
    /* Chloe: wetting only when tiramisu — else intentional squat (pee) */
    if (tag === "watching5") return dayFlag("tiramisu");
    return exact(tag, ["bathpee1", "nicelydesp8", "passage2aa"]);
  }

  function dayFlag(name) {
    try {
      var g = typeof globalThis !== "undefined" ? globalThis : root;
      return !!(g && g[name]);
    } catch (e) {
      return false;
    }
  }

  /**
   * blad emptied / afterpee fired but nobody should animate:
   * off-screen Ladies, prize cards, player pee, etc.
   */
  function isSilentEmpty(tag) {
    tag = String(tag || "");
    if (isPrizeTag(tag)) return true;
    return (
      exact(tag, [
        "gothere",
        "goforpee",
        "goforpee1",
        "luckytrip17b",
        "skirtremove1h",
        /* off-screen toilet returns — meter only */
        "nicelydesp",
        "asklootalk1",
        "emergency",
        "suddenend",
        "stampalbum8",
        "dampness",
        "gotoilet1",
        "walkhome1b",
        "walkhomeXa",
        "walkhomeXb",
        "pubdrink1",
        "pubdrink6",
        "pubdrink7",
        "pubdrink9",
        "foyerbar1",
        "pavilion1",
        "pavilion10",
        "notime",
        "carparka1",
        "riversidewalk",
        "riversidepath11",
        "stagedoor3",
        "dianechoice",
        "arrivehome0",
        "offercoffeeagain2",
        "keepquiet1",
        "lethergo",
        "loungedesp1",
        "toiletgo",
        "sofabreasts2a",
        "sofapee",
        "helpdiane2a",
        "helpdiane4a",
        "helpdiane1a",
        "helpdiane3a",
        "helpdiane",
        "riverside13a",
        "justcloseda",
        "toiletclosed2c",
        "gentleman",
        "lethergo",
        "stopher",
        "gotoo",
        "gotoo1",
        "hiddencamera",
        "givechancea",
        "givechanceb2",
        "givechanceb4",
        "givechancec",
        "gotoo",
        "askwait1",
        "relaxedstampalbum",
        "relaxedtrainalbum",
        "luckytrip0b",
        "luckytrip1a",
        "luckytrip4c",
        "luckytrip5cb",
        "luckytrip6a",
        "luckytrip8a",
        "luckytrip11a",
        "luckytrip12sat",
        "luckytrip12thurs",
        "luckytrip12tues",
        "luckytrip13",
        "luckytrip16a1",
        "luckytrip16a2",
        "luckytrip16ba",
        "luckytrip16c",
        "luckytrip18a",
        "luckytrip20a",
        "luckytrip21a",
        /* Already back / returns after pee — meter only */
        "sofakiss1",
        "sofatoilet2",
        "story2",
      ]) || starts(tag, ["start"])
    );
  }

  /**
   * Pee / wetting stage directions for a tag.
   * Only the page where it happens — never prize/summary cards.
   */
  function peeBeat(tag, cast) {
    tag = String(tag || "");
    cast = cast || {};
    var primary = cast.primary || "diane";

    if (isPrizeTag(tag) || isSilentEmpty(tag)) return null;

    // —— Wetting (on the page it happens) ——
    if (tag === "disaster1" || tag === "disaster2") {
      return { mode: "solo", keys: [primary], clip: "wetting", outcome: "wet", status: "wetting" };
    }
    if (exact(tag, ["bathpee1", "nicelydesp8", "passage2aa"])) {
      return { mode: "solo", keys: ["diane"], clip: "wetting", outcome: "wet", status: "wetting" };
    }
    /* legsz1: damp discovered after the fact — wet idle only, no accident replay */
    if (tag === "legsz1") {
      return {
        mode: "solo",
        keys: ["diane"],
        clip: "wetIdle",
        outcome: "wet",
        status: "wet",
      };
    }
    /* Chloe watching5: tiramisu → wetting; else intentional roadside squat → pee */
    if (tag === "watching5") {
      if (dayFlag("tiramisu")) {
        return {
          mode: "solo",
          keys: ["chloe"],
          clip: "wetting",
          outcome: "wet",
          status: "wetting",
        };
      }
      return { mode: "solo", keys: ["chloe"], clip: "peeA", outcome: "calm", status: "peeing" };
    }

    // —— Intentional peeing (on the page it happens) ——
    /* Molly behind the skip: longer fidget / looks around first → pee A */
    if (exact(tag, ["luckytrip4a"])) {
      return { mode: "solo", keys: ["molly"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    /* Molly under the bridge after Diane: shorter, straight into it → pee B */
    if (exact(tag, ["underbridge2"])) {
      return { mode: "solo", keys: ["molly"], clip: "peeB", outcome: "calm", status: "peeing" };
    }
    if (exact(tag, ["carpark1", "carparkalone"])) {
      return { mode: "solo", keys: ["debbie"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    if (exact(tag, ["underbridge"])) {
      return { mode: "solo", keys: ["diane"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    /* Amanda upstairs bathroom — urgent toilet squat → pee A (not standing B) */
    if (exact(tag, ["luckytrip31b"])) {
      return { mode: "solo", keys: ["amanda"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    if (exact(tag, ["peepround", "peepunder"])) {
      return {
        mode: "together",
        /* Stage order: Diane left, Debbie right — puddles follow this */
        keys: ["diane", "debbie"],
        clips: ["peeA", "peeA"],
        outcome: "calm",
        status: "peeing",
      };
    }
    /* lootogether1: she pees here only when inti < 110; else grin → ontoilet */
    if (tag === "lootogether1") {
      try {
        var g = typeof globalThis !== "undefined" ? globalThis : root;
        if (typeof g.inti === "number" && g.inti >= 110) return null;
      } catch (eLoot) {}
      return { mode: "solo", keys: ["diane"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    if (
      exact(tag, [
        "together2",
        "together1a",
        "helpdiane1aa",
        "toiletclosed2a",
        "toiletclosed2b",
        "helphersquat1",
        "goleft2",
        "search1a",
        "passage2b",
        "urinal",
        "ontoilet",
        "ontoilet1",
        "gobathroom",
        "gobathroom1",
        "sofatalkb",
        "sofatalkc",
        "story5",
        "luckytrip29a",
      ])
    ) {
      return { mode: "solo", keys: ["diane"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    /* justclosed3: cubicle pee Tue/Thu only; Sat leads to urinal choice */
    if (tag === "justclosed3" && !dayFlag("saturday")) {
      return { mode: "solo", keys: ["diane"], clip: "peeA", outcome: "calm", status: "peeing" };
    }
    /* luckytrip5a: spyhole pee on Tuesday only */
    if (tag === "luckytrip5a" && dayFlag("tuesday")) {
      return { mode: "solo", keys: ["diane"], clip: "peeA", outcome: "calm", status: "peeing" };
    }

    return null;
  }

  function resolve(tag) {
    var loc = locationFor(tag);
    var cast = castFor(tag);
    return {
      tag: tag,
      location: loc,
      cast: cast,
      pee: peeBeat(tag, cast),
    };
  }

  root.ADWDSceneMap = {
    resolve: resolve,
    locationFor: locationFor,
    castFor: castFor,
    peeBeat: peeBeat,
    isWetBeat: isWetBeat,
    isSilentEmpty: isSilentEmpty,
    isPrizeTag: isPrizeTag,
    dayKey: dayKey,
  };
})(typeof window !== "undefined" ? window : globalThis);
