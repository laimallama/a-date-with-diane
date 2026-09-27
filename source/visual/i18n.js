/** Localized visual chrome. The embedded text edition remains unchanged. */
(function (root) {
  "use strict";
  var config = root.ADWD_VISUAL_CONFIG;

  function language() {
    return config.bilingual && root.currentLanguage === "en" ? "en" : config.locale;
  }

  function text(key) {
    return key.split(".").reduce(function (value, part) {
      return value[part];
    }, config.catalogs[language()]);
  }

  function label(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
    return node;
  }

  function syncChrome() {
    document.title = text(config.bilingual ? "visualBilingualTitle" : "visualTitle");
    document.querySelectorAll("[data-visual-text]").forEach(function (node) {
      node.textContent = text(node.dataset.visualText);
    });
    label("galleryToggle", text("gallery"));
    label("themeToggle", text(root.darkMode ? "darkOn" : "darkOff"));
    var back = label("backBtn", text("back"));
    if (back) back.style.display = root.gameHistory && root.gameHistory.length ? "" : "none";
    var skip = label("skipBtn", text("skip"));
    if (skip) skip.style.display = root.canSkipToClimax() ? "" : "none";
    var guide = label("visualGuide", text(root.guideOn ? "guideOn" : "guideOff"));
    if (guide) {
      guide.style.display = root.guideActive ? "" : "none";
      guide.setAttribute("aria-pressed", String(!!root.guideOn));
      guide.classList.toggle("theme-toggle-on", !!root.guideOn);
      guide.classList.toggle("theme-toggle-off", !root.guideOn);
    }
    var rec = document.getElementById("stageRec");
    if (rec) {
      rec.title = text("replay");
      rec.setAttribute("aria-label", text("replay"));
    }
    var comma = language() === "es" || language() === "fr";
    label("currencyPrefix", comma ? "" : "£ ");
    label("currencySuffix", comma ? "\u00a0£" : "");
    var money = document.querySelector(".footer-stats .pounds");
    if (money)
      money.setAttribute(
        "aria-label",
        text("poundsLabel") + text("separator") + root.formatPounds(root.pounds, language()),
      );
    var coins = document.getElementById("coins");
    if (coins) {
      coins.setAttribute("role", "img");
      coins.setAttribute("aria-label", text("luckshots") + text("separator") + root.luckshots);
    }
  }

  function after(name, refresh) {
    var original = root[name];
    if (typeof original !== "function") return;
    root[name] = function () {
      var result = original.apply(this, arguments);
      refresh();
      return result;
    };
  }

  function hookEngine() {
    after("syncThemeButton", syncChrome);
    after("syncSkipButton", syncChrome);
    if (config.bilingual) {
      after("setLanguage", function () {
        root.VisualShell.refreshLanguage();
      });
    }
  }

  root.ADWDVisualUI = {
    text: text,
    language: language,
    syncChrome: syncChrome,
    hookEngine: hookEngine,
  };
})(window);
