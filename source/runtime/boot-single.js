if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootPage);
} else if (typeof start === "function" && typeof PREGAME_TAGS !== "undefined") {
  bootPage();
}
if (window.addEventListener) {
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) bootPage();
  });
}
