(() =>
 {
  "use strict";
  const tabs = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".menu-item")];
  const search = document.querySelector("#menu-search");
  const empty = document.querySelector("#menu-empty");
  let activeFilter = "all";
  const apply = () =>
 {
    const term = (search?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach(card =>
 {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesText = !term || `${card.dataset.name} ${card.textContent}`.toLowerCase().includes(term);
      const visible = matchesCategory && matchesText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  };
  tabs.forEach(tab =>
 tab.addEventListener("click", () =>
 {
    activeFilter = tab.dataset.filter;
    tabs.forEach(other =>
 {
      const active = other === tab;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    apply();
  }));
  search?.addEventListener("input", apply);
})();