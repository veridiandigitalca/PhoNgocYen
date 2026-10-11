/* Home page enhancements: intentional, lightweight motion only. */
(() =>
 {
  "use strict";
  const hero = document.querySelector(".hero");
  if (!hero) return;
  // Keep hero motion subtle and avoid pointer-driven effects on touch devices.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) hero.classList.add("reduced-motion");
})();
