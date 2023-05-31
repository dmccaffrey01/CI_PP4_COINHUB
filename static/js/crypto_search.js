const searchForm = document.querySelector(".crypto-search-form");
const searchInput = document.querySelector(".crypto-search-input");
const searchResults = document.querySelector(".crypto-search-results");

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.length > 0) {
    fetch(`/crypto-search-results/?query=${query}`)
      .then((response) => response.json())
      .then((results) => {
        const html = results.map((result) => `<p>${result.name}</p>`).join("");
        searchResults.innerHTML = html;
      });
  } else {
    searchResults.innerHTML = "";
  }
});
