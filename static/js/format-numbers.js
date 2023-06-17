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
        let currencySymbol = oldPrice.charAt(0);
        let number = parseFloat(oldPrice.slice(1));
        if (number > 999) {
            let newPrice = formatNumber(number);
            price.innerText = currencySymbol + newPrice;
        }

        if (number == 0) {
            price.innerHTML = `<i class="fa-solid fa-infinity"></i>`;
        }
    })
}

function commaFormatNumbers(elements) {
    elements.forEach(element => {
        let num = element.innerText;
        if (num[0] == '€') {
            num = num.slice(1);
            newNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            element.innerText = `€${newNum}`
        } else {
            element.innerText = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    })
}

function addPositiveOrNegative(elements) {
    elements.forEach(element => {
        let num = parseFloat(element.innerText.replace('%', ''));
  
        if (num > 0 ) {
            if (element.classList.contains('negative')) {
                element.classList.remove('negative');
            }
            element.classList.add('positive');
        } else if (num < 0) {
            if (element.classList.contains('positive')) {
                element.classList.remove('positive');
            }
            element.classList.add('negative');
        }
    });
}

window.addEventListener('load', function() {
    const marketsTable = document.querySelector('.markets-table-wrapper');
    const tradeTable = document.querySelector('.trading-pairs-table-wrapper');
    const cryptoDetails = document.querySelector('.crypto-details-heading-section');
    const letterFormats = document.querySelectorAll('.letter-format');
    const commaFormats = document.querySelectorAll('.comma-format');
    const decimals = document.querySelectorAll('.remove-decimals');
    const changes = document.querySelectorAll('.pos-neg-change');

    this.window.setTimeout(function() {
        if (marketsTable) {
            const trendingPrices = document.querySelectorAll('.trending-crypto-price');
            const marketCaps = document.querySelectorAll('.crypto-market-cap');
            const volume = document.querySelectorAll('.crypto-volume');
            
            formatPrices(trendingPrices);
            formatPrices(marketCaps);
            formatPrices(volume);
            table.style.display = 'flex';
        } else if (cryptoDetails) {
            formatPrices(letterFormats);
            commaFormatNumbers(commaFormats);
            addPositiveOrNegative(changes);
        } else if (tradeTable) {
            formatPrices(letterFormats);
            commaFormatNumbers(commaFormats);
            addPositiveOrNegative(changes);
        }
    }, 800);
});