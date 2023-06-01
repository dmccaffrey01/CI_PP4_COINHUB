function formatNumber(number) {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixIndex = 0;
  
    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000;
      suffixIndex++;
    }
    const formattedNumber = number.toFixed(1) + suffixes[suffixIndex];
    return formattedNumber;
}

function formatPrices(prices) {
    prices.forEach(price => {
        let oldPrice = price.innerText;
        let currencySybmol = oldPrice.charAt(0);
        let number = parseFloat(oldPrice.slice(1));
        if (number > 999) {
            let newPrice = formatNumber(number);
            price.innerText = currencySybmol + newPrice;
        }
    })
}

window.addEventListener('load', function() {
    const table = document.querySelector('.markets-table-wrapper')
    this.window.setTimeout(function() {
        const trendingPrices = document.querySelectorAll('.trending-crypto-price');
        const marketCaps = document.querySelectorAll('.crypto-market-cap');
        const volume = document.querySelectorAll('.crypto-volume');
        
        formatPrices(trendingPrices);
        formatPrices(marketCaps);
        formatPrices(volume);
        table.style.display = 'flex';
    }, 800);
});