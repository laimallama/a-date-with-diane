var wine;
var ulopen = 0;
var luckshots = 3;
var inti = 20;
var blad = 100;
var proc = 100;
var points = 20;
var pounds = 100;
var tort = 0;
var lasagne = 0;
var ravioli = 0;
var pizza = 0;
var spagbol = 0;
var merlot = 0;
var rioja = 0;
var chardonnay = 0;
var riesling = 0;
var pinot = 0;
var burgundy = 0;
var squat = 0;
var buyprogramme = 0;
var bottlewater = 0;
var mediumsteak = 0;
var tuesday = 0;
var thursday = 0;
var saturday = 0;
var mollyblad = 150;
var mollyproc = 150;
var buycappuccino = 0;
var buyespresso = 0;
var buyfiltercoffee = 0;
var leavepub1 = 0;
var leavepub2 = 0;
var theatretalking = 0;
var stampstalking = 0;
var traintalking = 0;
var gourinal = 0;
var instantcoffee = 0;
var nicecoffee = 0;
var leavechloe = 0;
var triedbathroom = 0;
var brooch = 0;
var gobehindtoilet = 0;
var admitwetting = 0;
var gopee = 0;
var tiramisu = 0;
var pannacotta = 0;
var icecream = 0;
var gettaxi = 0;
var steak = 0;
var undobra = 0;
var sofaTopicsSeen = 0;
var sofaEveningAsked = 0;
var movingtalking = 0;
var brotherHome = 0;
var carparklie = 0;
var gameHistory = [];
var gameStateVars = [
  "sofaTopicsSeen",
  "sofaEveningAsked",
  "movingtalking",
  "brotherHome",
  "ulopen",
  "luckshots",
  "inti",
  "blad",
  "proc",
  "points",
  "pounds",
  "tort",
  "lasagne",
  "ravioli",
  "pizza",
  "spagbol",
  "merlot",
  "rioja",
  "chardonnay",
  "riesling",
  "pinot",
  "burgundy",
  "squat",
  "buyprogramme",
  "bottlewater",
  "mediumsteak",
  "tuesday",
  "thursday",
  "saturday",
  "mollyblad",
  "mollyproc",
  "buycappuccino",
  "buyespresso",
  "buyfiltercoffee",
  "leavepub1",
  "leavepub2",
  "theatretalking",
  "stampstalking",
  "traintalking",
  "gourinal",
  "instantcoffee",
  "nicecoffee",
  "leavechloe",
  "triedbathroom",
  "brooch",
  "gobehindtoilet",
  "admitwetting",
  "gopee",
  "tiramisu",
  "pannacotta",
  "icecream",
  "gettaxi",
  "steak",
  "undobra",
  "sofaloop",
  "sofaDrinkBand",
  "sofaDrinkBoost",
  "sofaBreastsDone",
  "sofaArm2Done",
  "sofaLegsStage",
  "sofaDressOpened",
  "sofaPeeAskedDone",
  "sofaOfferLooDone",
  "albumdespBand",
  "standingBottomDone",
  "standingBreastsDone",
  "standingLegsDone",
  "carparklie",
  "wine",
  "pregameCaughtUp",
  "holdDateStatsOff",
  "currentTag",
  "despLineIndex",
];
var currentTag = null;
var choiceKeyPending = false;
var choiceKeyTimer = null;
var enterHoldTimer = null;
var enterFastTimer = null;
var backHoldTimer = null;
var backFastTimer = null;
var HOLD_FF_DELAY_MS = 450;
var HOLD_FF_INTERVAL_MS = 70;
var heldActionKey = null;
var darkMode = false;
var guideTags = null;
var guideIndex = 0;
var guideActive = false;
var guideOn = false;
var guideHistory = [];
var climaxSkipUsed = false;
var galleryReturnFocus = null;
var galleryInertNodes = [];
var PREGAME_TAGS = [
  "start",
  "start1",
  "info",
  "start1a",
  "start1b",
  "tuesdaydate",
  "thursdaydate",
  "saturdaydate",
];
var HIDE_DATE_STATS_TAGS = ["showover1", "showover2"];
var pregameCaughtUp = false;
var holdDateStatsOff = 0;
function formatPounds(amount, language) {
  var text = amount.toFixed(amount % 1 === 0 ? 0 : 2);
  return language === "fr" || language === "es" ? text.replace(".", ",") : text;
}
function spendLuckshot() {
  if (luckshots > 0) luckshots--;
}
function capEndgameLuckshots() {
  if (luckshots > 1) luckshots = 1;
}
function snapshotGame() {
  var state = {};
  for (var i = 0; i < gameStateVars.length; i++) {
    var key = gameStateVars[i];
    state[key] = typeof window[key] === "undefined" ? 0 : window[key];
  }
  return {
    state: state,
    html: document.getElementById("box").innerHTML,
  };
}
function restoreGame(snapshot) {
  for (var i = 0; i < gameStateVars.length; i++) {
    var key = gameStateVars[i];
    window[key] = snapshot.state[key];
  }
  document.getElementById("box").innerHTML = snapshot.html;
}
function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {
    return false;
  }
}
function presentScreen() {
  try {
    try {
      var ae = document.activeElement;
      if (ae && ae !== document.body && typeof ae.blur === "function") {
        var aeTag = ae.tagName ? ae.tagName.toLowerCase() : "";
        if (aeTag !== "input" && aeTag !== "textarea" && aeTag !== "select") ae.blur();
      }
    } catch (eBlur) {}
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
    var box = document.getElementById("box");
    if (!box) return;
    box.classList.remove("screen-fade");
    if (prefersReducedMotion()) return;
    void box.offsetWidth;
    box.classList.add("screen-fade");
    var clearFade = function () {
      try {
        box.classList.remove("screen-fade");
      } catch (e2) {}
    };
    if (typeof box.addEventListener === "function") {
      box.addEventListener("animationend", clearFade, {
        once: true,
      });
    }
    setTimeout(clearFade, 220);
  } catch (e) {}
}
function clearChoiceKeyArm() {
  if (choiceKeyTimer !== null) {
    clearTimeout(choiceKeyTimer);
    choiceKeyTimer = null;
  }
  choiceKeyPending = false;
  var box = document.getElementById("box");
  if (box) box.classList.remove("choice-key-armed");
  try {
    var kp = document.querySelectorAll("#box button.choice.key-pressed");
    for (var ki = 0; ki < kp.length; ki++) {
      kp[ki].classList.remove("key-pressed");
    }
  } catch (e) {}
}
function armAndFlashChoice(btn) {
  if (choiceKeyPending || !btn) return false;
  choiceKeyPending = true;
  var box = document.getElementById("box");
  if (box) box.classList.add("choice-key-armed");
  btn.classList.add("key-pressed");
  choiceKeyTimer = setTimeout(function () {
    choiceKeyTimer = null;
    try {
      var overlay = document.getElementById("galleryOverlay");
      if (
        document.body.contains(btn) &&
        btn.offsetParent !== null &&
        !(overlay && overlay.classList.contains("open"))
      ) {
        btn.click();
      }
    } finally {
      clearChoiceKeyArm();
    }
  }, 120);
  return true;
}
function pressGuidedChoice(immediate) {
  if (!(
    typeof guideActive !== "undefined" &&
    guideActive &&
    typeof guideOn !== "undefined" &&
    guideOn
  ))
    return;
  var btn = document.querySelector("#box button.choice.guide-highlight");
  if (!btn || btn.offsetParent === null) return;
  if (choiceKeyPending) return;
  if (immediate) {
    btn.click();
    return;
  }
  armAndFlashChoice(btn);
}
function pressChoiceByNumber(n) {
  if (choiceKeyPending) return;
  var all = document.querySelectorAll("#box button.choice");
  var buttons = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].offsetParent !== null) buttons.push(all[i]);
  }
  var idx = n - 1;
  if (idx < 0 || idx >= buttons.length) return;
  armAndFlashChoice(buttons[idx]);
}
function clearEnterHold() {
  if (enterHoldTimer) {
    clearTimeout(enterHoldTimer);
    enterHoldTimer = null;
  }
  if (enterFastTimer) {
    clearInterval(enterFastTimer);
    enterFastTimer = null;
  }
}
function clearBackHold() {
  if (backHoldTimer) {
    clearTimeout(backHoldTimer);
    backHoldTimer = null;
  }
  if (backFastTimer) {
    clearInterval(backFastTimer);
    backFastTimer = null;
  }
}
function clearAllHolds() {
  clearEnterHold();
  clearBackHold();
  heldActionKey = null;
}
function isStoryActionKey(key) {
  return (
    /^[1-9]$/.test(key) ||
    key === "Enter" ||
    key === "b" ||
    key === "B" ||
    key === "h" ||
    key === "H" ||
    key === "s" ||
    key === "S" ||
    key === "g" ||
    key === "G" ||
    key === "l" ||
    key === "L" ||
    key === "Escape"
  );
}
function claimStoryActionKey(key) {
  if (heldActionKey && heldActionKey !== key) return false;
  heldActionKey = key;
  return true;
}
function canSkipToClimax() {
  return !!(guideActive && guideOn && !climaxSkipUsed && climaxIndex > guideIndex);
}
function toggleGuideDisplay() {
  guideOn = !guideOn;
  if (!guideOn) clearAllHolds();
  syncGuideDisplay();
}
function toggleTheme() {
  darkMode = !darkMode;
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  try {
    sessionStorage.setItem("dianeDarkMode", darkMode ? "1" : "0");
  } catch (e) {}
  syncThemeButton();
}
function skipToClimax() {
  if (!canSkipToClimax()) return;
  climaxSkipUsed = true;
  clearAllHolds();
  var guard = 0;
  while (guideActive && guideIndex < climaxIndex && guard < 500) {
    go(guideTags[guideIndex]);
    guard++;
  }
  syncSkipButton();
}
function renderGalleryEntry(kind, item, index, number) {
  var title = galleryEntryTitle(item);
  var head =
    "<span class='gallery-index'>" +
    number +
    ".</span><span class='gallery-title'>" +
    title +
    "</span>";
  if (item.variants && item.variants.length) {
    var variantsHtml = item.variants
      .map(function (variant, vi) {
        return (
          "<button class='gallery-row gallery-variant' onclick=\"startGuidedRoute('" +
          kind +
          "'," +
          index +
          "," +
          vi +
          ")\"><span class='gallery-index' aria-hidden='true'></span><span class='gallery-title'>" +
          String.fromCharCode(97 + vi) +
          ". " +
          galleryEntryTitle(variant) +
          "</span></button>"
        );
      })
      .join("");
    return (
      "<div class='gallery-group'><button type='button' class='gallery-row gallery-group-toggle' aria-expanded='false' onclick='toggleGalleryGroup(this)'>" +
      head +
      "</button><div class='gallery-variants' hidden>" +
      variantsHtml +
      "</div></div>"
    );
  }
  return (
    "<button class='gallery-row' onclick=\"startGuidedRoute('" +
    kind +
    "'," +
    index +
    ')">' +
    head +
    "</button>"
  );
}
function toggleGalleryGroup(btn) {
  var panel = btn.nextElementSibling;
  if (!panel) return;
  if (panel.hasAttribute("hidden")) {
    panel.removeAttribute("hidden");
    btn.classList.add("gallery-group-open");
    btn.setAttribute("aria-expanded", "true");
  } else {
    panel.setAttribute("hidden", "");
    btn.classList.remove("gallery-group-open");
    btn.setAttribute("aria-expanded", "false");
  }
}
function renderGalleryLists() {
  var endingsHtml = GALLERY_DATA.endings
    .map(function (item, i) {
      return renderGalleryEntry("endings", item, i, i + 1);
    })
    .join("");
  var scenesHtml = GALLERY_DATA.hiddenScenes
    .map(function (item, i) {
      return renderGalleryEntry("hiddenScenes", item, i, i + 1);
    })
    .join("");
  document.getElementById("galleryEndings").innerHTML = endingsHtml;
  document.getElementById("galleryHiddenScenes").innerHTML = scenesHtml;
}
function trapGalleryFocus(e, overlay) {
  if (e.key !== "Tab") return;
  var candidates = overlay.querySelectorAll("button, [href], input, select, textarea, [tabindex]");
  var focusable = [];
  for (var i = 0; i < candidates.length; i++) {
    if (
      !candidates[i].disabled &&
      candidates[i].tabIndex >= 0 &&
      candidates[i].offsetParent !== null
    )
      focusable.push(candidates[i]);
  }
  var first = focusable[0] || overlay;
  var last = focusable[focusable.length - 1] || overlay;
  var active = document.activeElement;
  if (
    !overlay.contains(active) ||
    (e.shiftKey && active === first) ||
    (!e.shiftKey && active === last)
  ) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  }
}
function openGallery() {
  var overlay = document.getElementById("galleryOverlay");
  if (!overlay || overlay.classList.contains("open")) return;
  clearAllHolds();
  clearChoiceKeyArm();
  galleryReturnFocus = document.activeElement;
  renderGalleryLists();
  overlay.removeAttribute("inert");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  galleryInertNodes = [];
  var siblings = document.body.children || [];
  for (var i = 0; i < siblings.length; i++) {
    var node = siblings[i];
    if (node === overlay || /^(SCRIPT|STYLE|LINK)$/.test(node.tagName)) continue;
    galleryInertNodes.push({
      node: node,
      wasInert: node.hasAttribute("inert"),
    });
    node.setAttribute("inert", "");
  }
  var first = overlay.querySelector("button");
  if (first && typeof first.focus === "function") first.focus();
}
function closeGallery() {
  var overlay = document.getElementById("galleryOverlay");
  if (!overlay || !overlay.classList.contains("open")) return;
  clearAllHolds();
  clearChoiceKeyArm();
  overlay.classList.remove("open");
  overlay.setAttribute("inert", "");
  overlay.setAttribute("aria-hidden", "true");
  for (var i = 0; i < galleryInertNodes.length; i++) {
    if (!galleryInertNodes[i].wasInert) galleryInertNodes[i].node.removeAttribute("inert");
  }
  galleryInertNodes = [];
  var target = galleryReturnFocus;
  galleryReturnFocus = null;
  if (
    !target ||
    target === document.body ||
    !document.body.contains(target) ||
    target.offsetParent === null
  )
    target = document.getElementById("galleryToggle");
  if (target && typeof target.focus === "function") target.focus();
}
function digestionTick() {
  if (proc > 10) {
    if (tuesday) {
      if (tiramisu) {
        proc -= 10;
        blad += 12;
      } else {
        proc -= 10;
        blad += 11;
      }
    } else if (thursday) {
      if (icecream) {
        proc -= 10;
        blad += 10;
      } else {
        proc -= 10;
        blad += 12;
      }
    } else {
      if (pannacotta) {
        proc -= 10;
        blad += 12;
      } else {
        proc -= 10;
        blad += 10;
      }
    }
  } else {
    blad += proc;
    proc = 0;
  }
}
function digestMolly(amount) {
  amount = amount | 0;
  if (amount < 0) amount = 0;
  mollyblad += amount;
  mollyproc -= amount;
  if (mollyproc < 0) mollyproc = 0;
}
function pregameCatchupTick() {
  if (proc > 10) {
    if (pannacotta) {
      proc -= 10;
      blad += 12;
    } else {
      proc -= 10;
      blad += 10;
    }
  } else {
    blad += proc;
    proc = 0;
  }
}
function adjpoints(d) {
  points += d;
  if (points < 0) points = 0;
}
function intimacyNotice(p, templates) {
  var n = Math.abs(p);
  var key = (p < 0 ? -1 : 1) * (n === 1 ? 1 : 2);
  if (n === 0) key = 0;
  return templates[key].replace("{amount}", n);
}
function statusGroup(html) {
  return STATUS_GROUPS[typeof html === "string" ? html : html.en];
}
