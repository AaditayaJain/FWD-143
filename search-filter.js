// Filter existing service-provider cards by text and service category.
const providerSearch = document.getElementById("providerSearch");
const providerCategory = document.getElementById("providerCategory");
const providerCards = document.querySelectorAll(".provider-grid .provider-card");
const providerNoResults = document.getElementById("providerNoResults");

function filterProviders() {
  const searchText = providerSearch.value.trim().toLowerCase();
  const selectedCategory = providerCategory.value;
  let visibleCount = 0;

  providerCards.forEach(function (card) {
    const cardText = card.textContent.toLowerCase();
    const category = card.querySelector(".provider-tag").textContent.toLowerCase();
    const matchesSearch = cardText.includes(searchText);
    const matchesCategory = selectedCategory === "all" ||
      (selectedCategory === "internet" ? category.includes("internet") : category.includes(selectedCategory));
    const visible = matchesSearch && matchesCategory;
    card.hidden = !visible;
    // Some existing CSS layouts set display on cards; override it only when hidden.
    card.style.display = visible ? "" : "none";
    if (visible) visibleCount++;
  });

  providerNoResults.hidden = visibleCount !== 0;
}

providerSearch.addEventListener("input", filterProviders);
providerCategory.addEventListener("change", filterProviders);
