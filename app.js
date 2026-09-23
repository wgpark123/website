(() => {
  const data = window.WGP_RESEARCH?.entries || [];
  const pages = [...document.querySelectorAll("[data-page]")];
  const navLinks = [...document.querySelectorAll("nav a")];
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("nav");
  const publicationCategories = new Set(["books", "articles", "chapters", "blogs"]);
  let publicationFilter = "all";

  const escapeYear = (year) => year || "Other";

  function renderGrouped(targetId, entries) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!entries.length) {
      target.innerHTML = '<p class="empty-state">No matching entries found.</p>';
      return;
    }
    const groups = new Map();
    entries.forEach((entry) => {
      const key = escapeYear(entry.year);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
    const orderedYears = [...groups.keys()].sort((a, b) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return Number(b) - Number(a);
    });
    target.innerHTML = orderedYears.map((year) => `
      <section class="year-group" aria-labelledby="year-${targetId}-${year}">
        <h2 class="year-heading" id="year-${targetId}-${year}">${year}</h2>
        <div class="entries">
          ${groups.get(year).map((entry) => `<article class="archive-entry"><p>${entry.html}</p></article>`).join("")}
        </div>
      </section>`).join("");
  }

  function setResults(id, count, singular, plural) {
    const element = document.getElementById(id);
    if (element) element.textContent = `${count} ${count === 1 ? singular : plural}`;
  }

  function updatePublications() {
    const query = document.getElementById("publication-search").value.trim().toLowerCase();
    const matches = data.filter((entry) =>
      publicationCategories.has(entry.category) &&
      (publicationFilter === "all" || entry.category === publicationFilter) &&
      (!query || entry.search.includes(query))
    );
    renderGrouped("publications-list", matches);
    setResults("publication-results", matches.length, "publication", "publications");
  }

  function updatePresentations() {
    const query = document.getElementById("presentation-search").value.trim().toLowerCase();
    const matches = data.filter((entry) => entry.category === "presentations" && (!query || entry.search.includes(query)));
    renderGrouped("presentations-list", matches);
    setResults("presentation-results", matches.length, "presentation", "presentations");
  }

  function showPage() {
    const requested = location.hash.slice(1) || "home";
    const valid = pages.some((page) => page.dataset.page === requested) ? requested : "home";
    pages.forEach((page) => { page.hidden = page.dataset.page !== valid; });
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${valid}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
    });
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }

  const featured = data
    .filter((entry) => ["books", "articles", "chapters"].includes(entry.category) && entry.year)
    .sort((a, b) => b.year - a.year || a.order - b.order)
    .slice(0, 4);
  document.getElementById("featured-list").innerHTML = featured.map((entry) => `
    <article class="featured-card">
      <span class="year">${entry.categoryLabel} · ${entry.year}</span>
      <p>${entry.html}</p>
    </article>`).join("");

  document.getElementById("publication-count").textContent = data.filter((entry) => publicationCategories.has(entry.category)).length;
  document.getElementById("presentation-count").textContent = data.filter((entry) => entry.category === "presentations").length;
  document.getElementById("project-count").textContent = data.filter((entry) => entry.category === "projects").length;
  document.getElementById("current-year").textContent = new Date().getFullYear();

  document.getElementById("publication-search").addEventListener("input", updatePublications);
  document.getElementById("presentation-search").addEventListener("input", updatePresentations);
  document.getElementById("publication-filters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    publicationFilter = button.dataset.category;
    document.querySelectorAll("#publication-filters .filter").forEach((item) => item.classList.toggle("active", item === button));
    updatePublications();
  });
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  window.addEventListener("hashchange", showPage);

  updatePublications();
  updatePresentations();
  renderGrouped("projects-list", data.filter((entry) => entry.category === "projects"));
  renderGrouped("working-list", data.filter((entry) => entry.category === "working"));
  showPage();
})();
