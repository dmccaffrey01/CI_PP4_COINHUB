
/*jshint esversion: 9 */


const searchInput = document.querySelector(".crypto-search-input");
const searchResults = document.querySelector(".crypto-search-results");
const minHeight = searchResults.clientHeight;

const searchIcon = document.querySelector(".search-icon");
const closeIcon = document.querySelector(".close-icon");

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.length > 0) {
    fetch(`/crypto-search-results/?query=${query}`)
      .then((response) => response.json())
      .then((results) => {
        if (results.length > 0) {
            const html = results.map(
                (result) => {
                    const url = `/crypto/${result.symbol}`;
                    return `<a href="${url}" class="crypto-search-result content-container-rows">
                        <div class="crypto-search-result-icon-name content-container-rows gp-20">
                            <div class="crypto-search-result-icon-container crypto-icon-container">
                                <img class="crypto-icon" src="${result.icon}" alt="${result.name} icon" />
                            </div>
                            <div class="crypto-search-result-name dark-text">${result.name}</div>
                        </div>
                        <div class="crypto-search-result-symbol dark-text">${result.symbol}</div>
                    </a>`;
                }).join('');
            searchResults.innerHTML = html;
            searchResults.style.display = "flex";
            addScrollbar();
            } else {
                searchResults.innerHTML = `<div class="content-container-rows pb-20 pt-20">
                                                <div class=dark-text">No results found for "${query}";</div>
                                            </div>`;
                searchResults.style.display = "flex";
                addScrollbar();
            }
        });
  } else {
    searchResults.innerHTML = "";
    searchResults.style.display = 'none';
    addScrollbar();
  }
});

const addScrollbar = () => {
    if (searchResults.scrollHeight > minHeight) {
        searchResults.style.overflowY = "scroll";
    } else {
        searchResults.style.overflowY = "auto";
    }
};

closeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.style.display = 'none';
    closeIcon.classList.remove("search");
    searchIcon.classList.remove("search");
    searchInput.classList.remove("search");
    addScrollbar();
});

searchInput.addEventListener("focus", () => {
    closeIcon.classList.add("search");
    searchIcon.classList.add("search");
    searchInput.classList.add("search");
});

const marketChangeElement = document.querySelector(".market-change");

const updateMarketChange = () => {
    if (marketChangeElement) {
        fetch(`/get_market_data/`)
        .then((response) => response.json())
        .then((results) => {
            if (results.totalChange !== undefined) {
                if (results.totalChange > 0) {
                    marketChangeElement.classList.add("positive");
                    marketChangeElement.innerHTML = `up ${results.totalChange}% <i class="fa-solid fa-up-long"></i>`;
                } else {
                    marketChangeElement.classList.add("negative");
                    marketChangeElement.innerHTML = `down ${results.totalChange}% <i class="fa-solid fa-down-long"></i>`;
                }
            }
            else {
                marketChangeElement.innerHTML = "...";
            }
        });
    }
};

updateMarketChange();
