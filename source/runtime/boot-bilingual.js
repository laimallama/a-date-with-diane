if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootBilingualPage);
} else if (typeof start === "function" && typeof PREGAME_TAGS !== "undefined") {
  bootBilingualPage();
}
if (window.addEventListener) {
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) bootBilingualPage();
  });
}
