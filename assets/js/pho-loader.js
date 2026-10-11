/* Lightweight, short multi-page transition system for Pho Ngoc Yen. */
(() => {
  "use strict";
  const KEY = "pho-ngoc-yen-transition";
  const loader = document.querySelector("[data-pho-loader]");
  if (!loader) return;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let navigating = false;
  let entryTimer = 0;

  const show = () => {
    loader.setAttribute("aria-hidden", "false");
    loader.classList.add("is-active");
    document.body.classList.add("pho-loader-lock");
  };
  const hide = () => {
    loader.classList.remove("is-active");
    root.classList.remove("pho-loader-entry");
    loader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pho-loader-lock");
  };

  window.PhoLoader = { show, hide };

  // Direct visits and refreshes do not show the loader. Only a matching navigation marker does.
  if (root.classList.contains("pho-loader-entry")) {
    show();
    entryTimer = window.setTimeout(hide, reducedMotion ? 520 : 680);
    window.setTimeout(hide, 1800);
  }

  const isEligibleLink = (link, event) => {
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.hasAttribute("download") || (link.target && link.target.toLowerCase() !== "_self")) return false;
    if (link.hasAttribute("data-no-transition") || /(^|\s)external($|\s)/i.test(link.rel || "")) return false;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return false; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return false;
    if (url.pathname === location.pathname) return false;
    return true;
  };

  document.addEventListener("click", event => {
    const link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!isEligibleLink(link, event) || navigating) return;
    const url = new URL(link.href, location.href);
    try { sessionStorage.setItem(KEY, JSON.stringify({ to: url.pathname, at: Date.now() })); } catch (_) {}
    event.preventDefault();
    navigating = true;
    if (entryTimer) window.clearTimeout(entryTimer);
    show();
    window.setTimeout(() => location.assign(url.href), reducedMotion ? 180 : 300);
    window.setTimeout(() => {
      if (document.visibilityState === "visible" && location.pathname !== url.pathname) {
        navigating = false;
        try { sessionStorage.removeItem(KEY); } catch (_) {}
        hide();
      }
    }, 1400);
  }, true);

  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      navigating = false;
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      hide();
    }
  });
  window.addEventListener("pagehide", () => {
    if (!navigating) {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
    }
  });
})();
