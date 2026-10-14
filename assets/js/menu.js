/* Menu preview: category filter + text search with an announced result count. */
(() => {
  "use strict";
  const tabs = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".menu-item")];
  const search = document.querySelector("#menu-search");
  const empty = document.querySelector("#menu-empty");
  const count = document.querySelector("#menu-count");
  if (!cards.length) return;
  let activeFilter = "all";

  const apply = () => {
    const term = (search?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const inCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const inText = !term || `${card.dataset.name} ${card.textContent}`.toLowerCase().includes(term);
      const visible = inCategory && inText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
    if (count) count.textContent = shown === 0 ? "" : `Showing ${shown} of ${cards.length} dishes`;
  };

  tabs.forEach(tab => tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    tabs.forEach(other => {
      const active = other === tab;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    apply();
  }));
  search?.addEventListener("input", apply);
  apply();
})();
