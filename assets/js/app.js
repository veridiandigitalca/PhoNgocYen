/* Phở Ngọc Yến — shared site behaviour: navigation, header state, reveal, footer year. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  $$("[data-year]").forEach(node => { node.textContent = new Date().getFullYear(); });

  /* ---------- Mobile navigation ---------- */
  const header = $("[data-header]");
  const toggle = $(".menu-toggle");
  const nav = $("#primary-nav");
  const mobile = window.matchMedia("(max-width: 780px)");

  if (header && toggle && nav) {
    const backgroundRegions = () => $$("main, .site-footer, .announcement, .skip-link");
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    // The menu starts exactly where the header ends, whatever the scroll position
    // or whether the announcement bar is on screen.
    const placeMenu = () => {
      nav.style.setProperty("--nav-top", Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + "px");
    };

    const setState = open => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      root.classList.toggle("nav-open", open);
      backgroundRegions().forEach(el => { el.inert = open && mobile.matches; });
    };

    const open = () => { placeMenu(); setState(true); };
    const close = (returnFocus = false) => {
      if (!isOpen()) return;
      setState(false);
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => (isOpen() ? close() : open()));
    nav.addEventListener("click", event => { if (event.target.closest("a")) close(); });

    document.addEventListener("keydown", event => {
      if (!isOpen()) return;
      if (event.key === "Escape") { close(true); return; }
      if (event.key !== "Tab") return;
      // Keep keyboard focus inside the header + menu while the overlay is open.
      const items = $$("a[href], button", header).filter(el => el.offsetParent !== null || el === toggle);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    // Scroll lock for iOS versions that ignore overflow:hidden on the root.
    document.addEventListener("touchmove", event => {
      if (!isOpen()) return;
      if (nav.contains(event.target) && nav.scrollHeight > nav.clientHeight) return;
      event.preventDefault();
    }, { passive: false });

    // Keep the menu glued to the header if the viewport scroll position ever shifts while it is open.
    window.addEventListener("scroll", () => { if (isOpen()) placeMenu(); }, { passive: true });

    const sync = () => { if (!mobile.matches) close(); else if (isOpen()) placeMenu(); };
    mobile.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    // Back/forward cache restores the page exactly as it was left: never restore an open menu.
    window.addEventListener("pageshow", event => { if (event.persisted) close(); });
  }

  /* ---------- Header shadow once scrolled ---------- */
  if (header) {
    let ticking = false;
    const update = () => { header.classList.toggle("is-scrolled", window.scrollY > 18); ticking = false; };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Scroll reveal (content is visible by default without JS) ---------- */
  const revealItems = $$(".reveal");
  const showAll = () => revealItems.forEach(item => item.classList.add("is-visible"));
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    // threshold 0: tall sections must reveal even on short landscape screens.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    showAll();
  }
  window.addEventListener("beforeprint", showAll);

  /* ---------- Current page in navigation ---------- */
  let current = location.pathname.split("/").pop() || "index.html";
  if (!/\.html$/.test(current)) current = current ? current + ".html" : "index.html";
  $$("#primary-nav a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
