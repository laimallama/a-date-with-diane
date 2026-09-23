var currentLanguage = "alt";
var renderBuffers = null;
function setLanguage(lang) {
  currentLanguage = lang === "en" ? "en" : "alt";
  document.documentElement.setAttribute("lang", currentLanguage === "en" ? "en" : UI.setLanguage_6);
  document.body.classList.toggle("lang-en", currentLanguage === "en");
  document.body.classList.toggle("lang-alt", currentLanguage !== "en");
  var button = document.getElementById("languageToggle");
  if (button) button.textContent = currentLanguage === "en" ? UI.setLanguage_13 : "English";
  var galleryBtn = document.getElementById("galleryToggle");
  if (galleryBtn) galleryBtn.textContent = currentLanguage === "en" ? "Gallery" : UI.setLanguage_18;
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn)
    themeBtn.textContent =
      currentLanguage === "en"
        ? darkMode
          ? "Dark Mode: On"
          : "Dark Mode: Off"
        : darkMode
          ? UI.setLanguage_23
          : UI.setLanguage_24;
  if (typeof syncGuideDisplay === "function") syncGuideDisplay();
}
function toggleLanguage() {
  setLanguage(currentLanguage === "en" ? "alt" : "en");
}
function beginRender() {
  renderBuffers = {
    en: "",
    alt: "",
  };
}
function finishRender() {
  var box = document.getElementById("box");
  var enLayer = document.createElement("div");
  var altLayer = document.createElement("div");
  enLayer.className = "lang lang-en";
  enLayer.setAttribute("lang", "en");
  altLayer.className = "lang lang-alt";
  altLayer.setAttribute("lang", UI.finishRender_8);
  enLayer.innerHTML = renderBuffers.en;
  altLayer.innerHTML = renderBuffers.alt;
  box.innerHTML = "";
  box.appendChild(enLayer);
  box.appendChild(altLayer);
  renderBuffers = null;
  setLanguage(currentLanguage);
}
function goback() {
  if (!gameHistory.length) return;
  var snapshot = gameHistory.pop();
  var g = guideHistory.pop();
  restoreGame(snapshot);
  if (g) {
    guideIndex = g.index;
    guideActive = g.active;
  }
  try {
    document.getElementById("galleryToggle").style.display = currentTag ? "" : "none";
  } catch (e) {}
  try {
    document.getElementById("themeToggle").style.display = currentTag ? "" : "none";
  } catch (e) {}
  syncGuideDisplay();
  presentScreen();
}
if (document.addEventListener) {
  document.addEventListener("keydown", function (e) {
    var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var overlay = document.getElementById("galleryOverlay");
    var galleryOpen = !!(overlay && overlay.classList.contains("open"));
    if (e.key === "Escape") {
      if (!claimStoryActionKey("Escape")) return;
      if (galleryOpen) {
        e.preventDefault();
        closeGallery();
      }
      return;
    }
    if (e.key === "l" || e.key === "L") {
      if (e.repeat) return;
      if (!claimStoryActionKey(e.key)) return;
      var langBtn = document.getElementById("languageToggle");
      if (langBtn && langBtn.offsetParent !== null) {
        toggleLanguage();
      }
      return;
    }
    if (e.key === "g" || e.key === "G") {
      if (e.repeat) return;
      if (!claimStoryActionKey(e.key)) return;
      if (galleryOpen) {
        closeGallery();
        return;
      }
      var galleryBtn = document.getElementById("galleryToggle");
      if (galleryBtn && galleryBtn.offsetParent !== null) {
        openGallery();
      }
      return;
    }
    if (galleryOpen) {
      if (e.key === "Enter" && e.repeat) e.preventDefault();
      trapGalleryFocus(e, overlay);
      return;
    }
    if (e.key === "Enter") {
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (tag === "a" || (tag === "button" && !e.target.classList.contains("choice"))) {
        if (e.repeat) e.preventDefault();
        return;
      }
      e.preventDefault();
      if (guideActive && guideOn) {
        if (e.repeat) return;
        if (!claimStoryActionKey("Enter")) return;
        pressGuidedChoice();
        clearEnterHold();
        enterHoldTimer = setTimeout(function () {
          enterHoldTimer = null;
          enterFastTimer = setInterval(function () {
            if (!(guideActive && guideOn)) {
              clearEnterHold();
              return;
            }
            pressGuidedChoice(true);
          }, HOLD_FF_INTERVAL_MS);
        }, HOLD_FF_DELAY_MS);
        return;
      }
      if (!e.repeat && e.target && e.target.classList && e.target.classList.contains("choice")) {
        if (!claimStoryActionKey("Enter")) return;
        e.target.click();
      }
      return;
    }
    if (e.repeat) return;
    if (e.key === "b" || e.key === "B") {
      if (!document.querySelector(".back-button")) return;
      if (!claimStoryActionKey(e.key)) return;
      e.preventDefault();
      goback();
      clearBackHold();
      backHoldTimer = setTimeout(function () {
        backHoldTimer = null;
        backFastTimer = setInterval(function () {
          if (!document.querySelector(".back-button") || !gameHistory.length) {
            clearBackHold();
            return;
          }
          goback();
        }, HOLD_FF_INTERVAL_MS);
      }, HOLD_FF_DELAY_MS);
      return;
    }
    if (e.key === "h" || e.key === "H") {
      if (!claimStoryActionKey(e.key)) return;
      if (document.querySelector(".guide-toggle-button")) {
        toggleGuideDisplay();
      }
      return;
    }
    if (e.key === "s" || e.key === "S") {
      if (!claimStoryActionKey(e.key)) return;
      if (canSkipToClimax()) skipToClimax();
      return;
    }
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      toggleTheme();
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      if (!claimStoryActionKey(e.key)) return;
      pressChoiceByNumber(parseInt(e.key, 10));
      return;
    }
  });
  document.addEventListener("keyup", function (e) {
    if (e.key === "Enter") clearEnterHold();
    if (e.key === "b" || e.key === "B") clearBackHold();
    if (
      heldActionKey &&
      (e.key === heldActionKey ||
        (isStoryActionKey(e.key) && e.key.toLowerCase() === String(heldActionKey).toLowerCase()))
    ) {
      heldActionKey = null;
    }
  });
  window.addEventListener("blur", clearAllHolds);
}
try {
  if (sessionStorage.getItem("dianeDarkMode") === "1") {
    darkMode = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }
} catch (e) {}
function syncThemeButton() {
  try {
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent =
        currentLanguage === "en"
          ? darkMode
            ? "Dark Mode: On"
            : "Dark Mode: Off"
          : darkMode
            ? UI.syncThemeButton_4
            : UI.syncThemeButton_5;
      btn.className = "theme-toggle-button" + (darkMode ? " theme-toggle-on" : " theme-toggle-off");
      if (document.activeElement === btn) btn.blur();
    }
  } catch (e) {}
}
function syncGuideDisplay() {
  try {
    var hls = document.querySelectorAll("button.choice.guide-highlight");
    for (var i = 0; i < hls.length; i++) {
      hls[i].className = hls[i].className.replace(/\s*guide-highlight/, "");
    }
    if (guideOn) applyGuideHighlight();
    var toggles = document.querySelectorAll(".guide-toggle-button");
    for (var i = 0; i < toggles.length; i++) {
      var lang = toggles[i].getAttribute("data-lang");
      var onText = lang === "alt" ? UI.syncGuideDisplay_5 : "Guide: On";
      var offText = lang === "alt" ? UI.syncGuideDisplay_8 : "Guide: Off";
      toggles[i].textContent = guideOn ? onText : offText;
      toggles[i].className =
        "guide-toggle-button" + (guideOn ? " guide-toggle-on" : " guide-toggle-off");
    }
    syncSkipButton();
  } catch (e) {}
}
function climaxSkipLabel(lang) {
  return lang === "alt" ? UI.climaxSkipLabel_1 : "Skip to the good bit!";
}
function syncSkipButton() {
  var rows = document.querySelectorAll("#box .nav-row");
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    var existing = row.querySelector(".climax-skip-button");
    var layer = row.closest(".lang-alt") ? "alt" : row.closest(".lang-en") ? "en" : currentLanguage;
    if (canSkipToClimax()) {
      if (!existing) {
        var btn = document.createElement("button");
        btn.className = "climax-skip-button";
        btn.setAttribute("onclick", "skipToClimax()");
        btn.textContent = climaxSkipLabel(layer);
        row.appendChild(btn);
      } else {
        existing.textContent = climaxSkipLabel(layer);
      }
    } else if (existing) {
      existing.parentNode.removeChild(existing);
    }
  }
}
var climaxIndex = -1;
function initGuideFromStorage() {
  try {
    var raw = sessionStorage.getItem("dianeGuide");
    if (!raw) return;
    sessionStorage.removeItem("dianeGuide");
    var data = JSON.parse(raw);
    if (data.lang) setLanguage(data.lang);
    guideTags = data.tags;
    guideIndex = 0;
    guideActive = true;
    guideOn = true;
    climaxIndex = typeof data.climaxIndex === "number" ? data.climaxIndex : -1;
    climaxSkipUsed = false;
    var baseLength = data.baseLength || 0;
    for (var i = 0; i < baseLength; i++) {
      go(guideTags[i]);
    }
    syncGuideDisplay();
  } catch (e) {}
}
function bootBilingualPage() {
  setLanguage(currentLanguage);
  initGuideFromStorage();
  if (!currentTag) go("start");
  syncThemeButton();
}
function applyGuideHighlight() {
  if (!guideActive || guideIndex >= guideTags.length) return;
  var expected = guideTags[guideIndex];
  var buttons = document.getElementById("box").querySelectorAll("button.choice");
  for (var i = 0; i < buttons.length; i++) {
    var m = (buttons[i].getAttribute("onclick") || "").match(/go\(['"]([^'"]+)['"]\)/);
    if (m && m[1] === expected && buttons[i].offsetParent !== null) {
      buttons[i].className += " guide-highlight";
      return;
    }
  }
}
function galleryEntryTitle(item) {
  return currentLanguage === "en" ? item.title : item.titleAlt || item.title;
}
function startGuidedRoute(kind, index, variantIndex) {
  var item = GALLERY_DATA[kind][index];
  if (item.variants) {
    if (typeof variantIndex !== "number") return;
    item = item.variants[variantIndex];
  }
  var payload = {
    tags: item.tags,
    baseLength: item.baseLength,
    lang: currentLanguage,
  };
  if (typeof item.climaxIndex === "number") payload.climaxIndex = item.climaxIndex;
  sessionStorage.setItem("dianeGuide", JSON.stringify(payload));
  location.reload();
}
function backbutton(lang) {
  if (!gameHistory.length) return "";
  var text = lang === "alt" ? UI.backbutton_2 : "Back";
  var back = "<button class='back-button' onclick='goback()'>" + text + "</button>";
  var onText = lang === "alt" ? UI.backbutton_7 : "Guide: On";
  var offText = lang === "alt" ? UI.backbutton_10 : "Guide: Off";
  var toggle = guideActive
    ? "<button class='guide-toggle-button" +
      (guideOn ? " guide-toggle-on" : " guide-toggle-off") +
      "' data-lang='" +
      lang +
      "' onclick='toggleGuideDisplay()'>" +
      (guideOn ? onText : offText) +
      "</button>"
    : "";
  var skipLabel = lang === "alt" ? UI.backbutton_20 : "Skip to the good bit!";
  var skip = canSkipToClimax()
    ? "<button class='climax-skip-button' onclick='skipToClimax()'>" + skipLabel + "</button>"
    : "";
  return "<div class='nav-row'>" + back + toggle + skip + "</div>";
}
function finishChoiceBlock() {
  if (ulopen) {
    renderBuffers.en += "</div>";
    renderBuffers.alt += "</div>";
  }
  ulopen = 0;
}
function sAlt(en, alt) {
  renderBuffers.en += en;
  renderBuffers.alt += alt;
}
function cAlt(tag, enDesc, altDesc) {
  if (!ulopen) {
    renderBuffers.en += "<div class='choices'>";
    renderBuffers.alt += "<div class='choices'>";
  }
  ulopen = 1;
  var prefix = "<button class='choice' onclick=\"go('" + tag + "')\">";
  renderBuffers.en += prefix + enDesc + "</button>";
  renderBuffers.alt += prefix + altDesc + "</button>";
}
function go(tag) {
  if (!Object.prototype.hasOwnProperty.call(SCENES, tag)) throw new Error("Unknown scene: " + tag);
  try {
    clearChoiceKeyArm();
  } catch (e) {}
  if (currentTag) {
    gameHistory.push(snapshotGame());
    guideHistory.push({
      index: guideIndex,
      active: guideActive,
    });
  }
  if (guideActive) {
    if (tag === guideTags[guideIndex]) {
      guideIndex++;
      if (guideIndex >= guideTags.length) {
        guideActive = false;
      }
    } else {
      guideActive = false;
    }
  }
  currentTag = tag;
  try {
    document.getElementById("galleryToggle").style.display = "";
  } catch (e) {}
  try {
    document.getElementById("themeToggle").style.display = "";
  } catch (e) {}
  var hideDateStats = HIDE_DATE_STATS_TAGS.indexOf(tag) !== -1;
  var showStats;
  if (tag === "gameover") {
    showStats = !holdDateStatsOff;
  } else {
    holdDateStatsOff = hideDateStats ? 1 : 0;
    showStats = PREGAME_TAGS.indexOf(tag) === -1 && !hideDateStats;
  }
  if (showStats) {
    if (!pregameCaughtUp) {
      pregameCaughtUp = true;
      pregameCatchupTick();
      pregameCatchupTick();
      pregameCatchupTick();
      pregameCatchupTick();
    }
    digestionTick();
  }
  beginRender();
  SCENES[tag]();
  finishChoiceBlock();
  if (showStats) {
    renderBuffers.en +=
      "<aside class='status-bar'>" +
      "<div class='status-row status-row-main'>" +
      "<span>Pounds <b>" +
      formatPounds(pounds, "en") +
      "</b></span>" +
      "<span>Luckshots <b>" +
      luckshots +
      "</b></span>" +
      "<span>Intimacy <b>" +
      inti +
      "</b></span>" +
      "</div>" +
      "<div class='status-row status-row-money'>" +
      "<span>Tummy <b>" +
      proc +
      "ml</b></span>" +
      "<span>Bladder <b>" +
      blad +
      "ml</b></span>" +
      "<span>Shyness <b>" +
      points +
      "</b></span>" +
      "</div>" +
      "</aside>";
    renderBuffers.alt +=
      "<aside class='status-bar'>" +
      "<div class='status-row status-row-main'>" +
      UI.go_26 +
      formatPounds(pounds, UI.go_27) +
      "</b></span>" +
      UI.go_29 +
      luckshots +
      "</b></span>" +
      UI.go_31 +
      inti +
      "</b></span>" +
      "</div>" +
      "<div class='status-row status-row-money'>" +
      UI.go_35 +
      proc +
      "ml</b></span>" +
      UI.go_37 +
      blad +
      "ml</b></span>" +
      UI.go_39 +
      points +
      "</b></span>" +
      "</div>" +
      "</aside>";
  }
  renderBuffers.en += backbutton("en");
  renderBuffers.alt += backbutton("alt");
  finishRender();
  syncGuideDisplay();
  presentScreen();
}
function getinti(p) {
  renderBuffers.en += intimacyNotice(p, INTIMACY_EN);
  renderBuffers.alt += intimacyNotice(p, INTIMACY);
  inti += p;
}
function captureDesp(fn) {
  var last = "";
  var original = sAlt;
  sAlt = function (en, alt) {
    if (en || alt)
      last = {
        en: en,
        alt: alt,
      };
  };
  try {
    fn();
  } finally {
    sAlt = original;
  }
  return last;
}
function printCapturedDesp(html) {
  if (html) {
    var print = sAlt;
    print(html.en, html.alt);
  }
}
