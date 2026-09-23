(function () {
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  var wikiTitle = document.title;
  var THEME_KEY = "diane-wiki-theme";
  var SCROLL_KEY = "diane-wiki-index-scroll";
  var FROM_KEY = "diane-wiki-from-index";
  function applyTheme(on) {
    if (on) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (btn) {
      btn.textContent = on ? btn.dataset.themeOn : btn.dataset.themeOff;
      btn.className = "theme-toggle-button " + (on ? "theme-toggle-on" : "theme-toggle-off");
      if (document.activeElement === btn) btn.blur();
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
    try {
      sessionStorage.setItem(THEME_KEY, on ? "dark" : "light");
    } catch {}
  }
  function toggleTheme() {
    applyTheme(root.getAttribute("data-theme") !== "dark");
  }
  var saved = null;
  try {
    saved = sessionStorage.getItem(THEME_KEY);
  } catch {}
  applyTheme(saved === "dark");
  if (btn) btn.addEventListener("click", toggleTheme);
  var indexPage = document.getElementById("page-index");
  var allPages = document.querySelectorAll(".wiki-page");
  function showIndex() {
    for (var i = 0; i < allPages.length; i++) allPages[i].classList.remove("active");
    indexPage.classList.add("active");
    document.title = wikiTitle;
    var fromIdx = null,
      y = null;
    try {
      fromIdx = sessionStorage.getItem(FROM_KEY);
      y = sessionStorage.getItem(SCROLL_KEY);
      sessionStorage.removeItem(FROM_KEY);
    } catch {}
    if (fromIdx === "1" && y != null) {
      var n = parseInt(y, 10);
      if (!isNaN(n)) {
        requestAnimationFrame(function () {
          window.scrollTo(0, n);
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }
  window.showIndex = showIndex;
  window.showPage = function (stem) {
    var target = document.getElementById("page-" + stem);
    if (!target) return;
    try {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || window.pageYOffset || 0));
      sessionStorage.setItem(FROM_KEY, "1");
    } catch {}
    for (var i = 0; i < allPages.length; i++) allPages[i].classList.remove("active");
    target.classList.add("active");
    document.title = target.getAttribute("data-title") + " | " + wikiTitle;
    window.scrollTo(0, 0);
  };
  showIndex();
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.repeat) return;
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      toggleTheme();
    }
    if (e.key === "b" || e.key === "B") {
      e.preventDefault();
      showIndex();
    }
  });
})();
