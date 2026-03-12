/**
 * Scroll to Top — detect real scroll container, add .visible when scroll > 80px.
 * Moved from root scroll-to-top.js to js/scroll-to-top.js
 */
(function () {
  function getScrollTop() {
    return window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
  }
  function getScrollTopParent() {
    try {
      if (window !== window.top) {
        var p = window.parent;
        return p.pageYOffset || p.document.documentElement.scrollTop || p.document.body.scrollTop || 0;
      }
    } catch (e) {}
    return 0;
  }
  function findScrollContainer() {
    var main = document.querySelector("main");
    if (main) {
      var cs = document.defaultView.getComputedStyle(main);
      var ov = cs.overflowY || cs.overflow;
      if (ov === "auto" || ov === "scroll" || ov === "overlay") return main;
    }
    for (var i = 0; i < document.body.children.length; i++) {
      var el = document.body.children[i];
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
      if (el.classList && el.classList.contains("Btn")) continue;
      var cs = document.defaultView.getComputedStyle(el);
      var ov = cs.overflowY || cs.overflow;
      if ((ov === "auto" || ov === "scroll" || ov === "overlay") && el.scrollHeight > el.clientHeight)
        return el;
    }
    return document.scrollingElement || document.documentElement;
  }
  function init() {
    var btn = document.querySelector(".Btn");
    if (!btn) return;
    var scrollContainer = findScrollContainer();
    var isWindowScroll = !scrollContainer || scrollContainer === document.documentElement || scrollContainer === document.body;
    function getScrollTopFromContainer() {
      if (isWindowScroll) return getScrollTop();
      return scrollContainer.scrollTop || 0;
    }
    function updateBtn() {
      var scrollTop = Math.max(
        getScrollTop(),
        getScrollTopFromContainer(),
        getScrollTopParent()
      );
      if (scrollTop > 80) btn.classList.add("visible");
      else btn.classList.remove("visible");
    }
    function scrollToTop() {
      try {
        if (window !== window.top) window.parent.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {}
      if (!isWindowScroll && scrollContainer && scrollContainer.scrollTo) scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.addEventListener("scroll", updateBtn, { passive: true });
    if (scrollContainer && scrollContainer !== document.documentElement && scrollContainer.addEventListener) {
      scrollContainer.addEventListener("scroll", updateBtn, { passive: true });
    }
    document.addEventListener("scroll", updateBtn, { passive: true });
    try {
      if (window !== window.top) window.parent.addEventListener("scroll", updateBtn, { passive: true });
    } catch (e) {}
    btn.addEventListener("click", scrollToTop);
    updateBtn();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

