const changeTradingPairBtn = document.querySelector(".change-trading-pair-btn");
const tradeTable = document.querySelector(".crypto-trade-table-trading-pair");
const changeTradingPairBtnIcon = document.querySelector(".change-trading-pair-btn-icon");

changeTradingPairBtn.addEventListener("click", () => {
    console.log("clicked");

    if (tradeTable.classList.contains("active")) {
        tradeTable.classList.remove("active");
        changeTradingPairBtnIcon.classList.remove("active");
    } else {
        tradeTable.classList.add("active");
        changeTradingPairBtnIcon.classList.add("active");

    }
    
})