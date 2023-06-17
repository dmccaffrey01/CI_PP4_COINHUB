const searchForm = document.querySelector(".crypto-search-form");
const searchInput = document.querySelector(".crypto-search-input");

const searchIcon = document.querySelector(".search-icon");
const closeIcon = document.querySelector(".close-icon");

const table = document.querySelector(".crypto-list-trading-pairs-table");
const trLinks = document.querySelectorAll(".tr-link");

let removedTrLinksArr = [];
let currentTrLinks = [trLinks];

searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    let removedTrLinks = [];
    let workingTrLinks = [];
    for (let i = 0; i < currentTrLinks.length; i++) {
        const trLink = currentTrLinks[i];
        const name = trLink.getAttribute("data-name");
        const symbol = trLink.getAttribute("data-symbol");
        const euroTradingPair = trLink.getAttribute("data-euro-trading-pair");

        if (name.includes(query) )
    }
});


closeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.style.display = 'none';
    closeIcon.classList.remove("search");
    searchIcon.classList.remove("search");
    searchInput.classList.remove("search");
});

searchInput.addEventListener("focus", () => {
    closeIcon.classList.add("search");
    searchIcon.classList.add("search");
    searchInput.classList.add("search");
});