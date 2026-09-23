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
    document.getElementById("gameToolbar").style.display = currentTag ? "" : "none";
  } catch (e) {}
  syncGuideDisplay();
  presentScreen();
}
if (document.addEventListener) {
  document.addEventListener("keydown", function (e) {
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
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
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
function navRow() {
  if (!gameHistory.length) return "";
  var back = UI.navRow_1;
  var toggle = guideActive
    ? "<button class='guide-toggle-button" +
      (guideOn ? " guide-toggle-on" : " guide-toggle-off") +
      "' onclick='toggleGuideDisplay()'>" +
      (guideOn ? UI.navRow_6 : UI.navRow_7) +
      "</button>"
    : "";
  var skip = canSkipToClimax() ? UI.navRow_10 : "";
  return "<div class='nav-row'>" + back + toggle + skip + "</div>";
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
      btn.textContent = darkMode ? UI.syncThemeButton_1 : UI.syncThemeButton_2;
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
      toggles[i].textContent = guideOn ? UI.syncGuideDisplay_3 : UI.syncGuideDisplay_4;
      toggles[i].className =
        "guide-toggle-button" + (guideOn ? " guide-toggle-on" : " guide-toggle-off");
    }
    syncSkipButton();
  } catch (e) {}
}
function syncSkipButton() {
  var row = document.querySelector("#box .nav-row");
  if (!row) return;
  var existing = row.querySelector(".climax-skip-button");
  if (canSkipToClimax()) {
    if (!existing) {
      var btn = document.createElement("button");
      btn.className = "climax-skip-button";
      btn.setAttribute("onclick", "skipToClimax()");
      btn.textContent = UI.syncSkipButton_6;
      row.appendChild(btn);
    }
  } else if (existing) {
    existing.parentNode.removeChild(existing);
  }
}
var climaxIndex = -1;
function initGuideFromStorage() {
  try {
    var raw = sessionStorage.getItem("dianeGuide");
    if (!raw) return;
    sessionStorage.removeItem("dianeGuide");
    var data = JSON.parse(raw);
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
function bootPage() {
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
    if (m && m[1] === expected) {
      buttons[i].className += " guide-highlight";
      return;
    }
  }
}
function galleryEntryTitle(item) {
  return item.title;
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
  };
  if (typeof item.climaxIndex === "number") payload.climaxIndex = item.climaxIndex;
  sessionStorage.setItem("dianeGuide", JSON.stringify(payload));
  location.reload();
}
var choiceBlockPrefix = "";
var choiceBlockContent = "";
function appendChoiceBlock(html) {
  var box = document.getElementById("box");
  if (!ulopen) {
    choiceBlockPrefix = box.innerHTML;
    choiceBlockContent = "";
  }
  ulopen = 1;
  choiceBlockContent += html;
  box.innerHTML = choiceBlockPrefix + "<div class='choices'>" + choiceBlockContent + "</div>";
}
function finishChoiceBlock() {
  ulopen = 0;
  choiceBlockPrefix = "";
  choiceBlockContent = "";
}
function c(tag, desc) {
  appendChoiceBlock("<button class='choice' onclick=\"go('" + tag + "')\">" + desc + "</button>");
}
function s(html) {
  if (ulopen) appendChoiceBlock(html);
  else document.getElementById("box").innerHTML += html;
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
    document.getElementById("gameToolbar").style.display = "";
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
  document.getElementById("box").innerHTML = "";
  SCENES[tag]();
  finishChoiceBlock();
  if (showStats) {
    document.getElementById("box").innerHTML +=
      "<aside class='status-bar'>" +
      "<div class='status-row status-row-main'>" +
      UI.go_8 +
      formatPounds(pounds, UI.go_9) +
      "</b></span>" +
      UI.go_11 +
      luckshots +
      "</b></span>" +
      UI.go_13 +
      inti +
      "</b></span>" +
      "</div>" +
      "<div class='status-row status-row-money'>" +
      UI.go_17 +
      proc +
      "ml</b></span>" +
      UI.go_19 +
      blad +
      "ml</b></span>" +
      UI.go_21 +
      points +
      "</b></span>" +
      "</div>" +
      "</aside>";
  }
  document.getElementById("box").innerHTML += navRow();
  syncGuideDisplay();
  presentScreen();
}
function getinti(p) {
  s(intimacyNotice(p, INTIMACY));
  inti += p;
}
function captureDesp(fn) {
  var last = "";
  var original = s;
  s = function (html) {
    if (html) last = html;
  };
  try {
    fn();
  } finally {
    s = original;
  }
  return last;
}
function printCapturedDesp(html) {
  if (html) {
    var print = s;
    print(html);
  }
}
