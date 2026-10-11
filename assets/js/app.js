(() =>
 {
  "use strict";
  const $ = (selector, root = document) =>
 root.querySelector(selector);
  const $$ = (selector, root = document) =>
 [...root.querySelectorAll(selector)];

  // Current year in footer
  $$("[data-year]").forEach(node =>
 node.textContent = new Date().getFullYear());

  // Accessible mobile navigation
  const toggle = $(".menu-toggle");
  const nav = $("#primary-nav");
  if (toggle && nav) {
    const closeNav = () =>
 {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };
    toggle.addEventListener("click", () =>
 {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach(link =>
 link.addEventListener("click", closeNav));
    document.addEventListener("keydown", event =>
 { if (event.key === "Escape") closeNav(); });
    document.addEventListener("click", event =>
 {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });
  }

  // Subtle header state on scroll
  const header = $("[data-header]");
  if (header) {
    let ticking = false;
    const updateHeader = () =>
 {
      header.classList.toggle("is-scrolled", window.scrollY >
 18);
      ticking = false;
    };
    window.addEventListener("scroll", () =>
 {
      if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
    updateHeader();
  }

  // Progressive reveal; content remains visible if JS or IntersectionObserver is unavailable.
  const revealItems = $$(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries =>
 {
      entries.forEach(entry =>
 {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item =>
 observer.observe(item));
  } else {
    revealItems.forEach(item =>
 item.classList.add("is-visible"));
  }

  // Current navigation page
  const current = location.pathname.split("/").pop() || "index.html";
  $$("#primary-nav a").forEach(link =>
 {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
})();