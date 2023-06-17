const searchForm = document.querySelector(".crypto-search-form");
const searchInput = document.querySelector(".crypto-search-input");

const searchIcon = document.querySelector(".search-icon");
const closeIcon = document.querySelector(".close-icon");

const table = document.querySelector(".crypto-list-trading-pairs-table");
const tableBody = document.querySelector(".crypto-list-trading-pairs-table-body");
const trLinks = document.querySelectorAll(".tr-link");
let removedTrLinksArr = [];
let currentTrLinks = Array.from(trLinks);

const handleInput = () => {
    const query = searchInput.value.toLowerCase();
    let removedTrLinks = [];
    let workingTrLinks = [];
    for (let i = 0; i < currentTrLinks.length; i++) {
        const trLink = currentTrLinks[i];
        const name = trLink.getAttribute("data-name").toLowerCase();
        const symbol = trLink.getAttribute("data-symbol").toLowerCase();
        const euroTradingPair = trLink.getAttribute("data-euro-trading-pair").toLowerCase();

        if (name.includes(query) || symbol.includes(query) || euroTradingPair.includes(query)) {
            workingTrLinks.push(trLink);
        } else if (query.length != removedTrLinksArr.length) {
            removedTrLinks.push({"trElement": trLink, "index": i});
        }
    }
    currentTrLinks = workingTrLinks;
    if (query.length != removedTrLinksArr.length) {
        removedTrLinksArr.push(removedTrLinks);
    }
    for (let i = 0; i < removedTrLinks.length; i++) {
        let trLink = removedTrLinks[i].trElement;
        trLink.remove();
    }
}

const addLastRemovedTrLinks = () => {
    let removedTrLinks = removedTrLinksArr.pop();
    for (let i = 0; i < removedTrLinks.length; i++) {
        let trLink = removedTrLinks[i];
        let trElement = trLink.trElement;
        let trIndex = trLink.index;
        currentTrLinks.splice(trIndex, 0, trElement);
        let siblingTr = tableBody.children[trIndex];
        tableBody.insertBefore(trElement, siblingTr);
    }
    setTimeout(() => {
        handleInput();
    }, 0);
}

const addAllRemovedTrLinks = () => {
    while(removedTrLinksArr.length != 0) {
        addLastRemovedTrLinks();
    }
}

const handleBackspaceInput = () => {
    addLastRemovedTrLinks();
}

searchInput.addEventListener("input", handleInput);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" || event.keyCode === 8) {
        handleBackspaceInput();
    }
});


closeIcon.addEventListener("click", () => {
    searchInput.value = "";
    closeIcon.classList.remove("search");
    searchIcon.classList.remove("search");
    searchInput.classList.remove("search");
    addAllRemovedTrLinks();
});

searchInput.addEventListener("focus", () => {
    closeIcon.classList.add("search");
    searchIcon.classList.add("search");
    searchInput.classList.add("search");
});