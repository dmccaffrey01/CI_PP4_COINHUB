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
            if (price.classList.contains("trending-crypto-price")) {
                price.innerHTML = `${currencySymbol}0.00`;
            } else {
                price.innerHTML = `<i class="fa-solid fa-infinity"></i>`;
            }
            
        }
    })
}

function commaFormatNumbers(elements) {
    elements.forEach(element => {
        let num = element.innerText;
        let symbol = '';
        if (num[0] == '€') {
            num = num.slice(1);
            symbol = '€';
        }

        if (num.includes('.')) {
            const [integerPart, decimalPart] = num.split('.');

            const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            element.innerText = `${symbol}${formattedIntegerPart}.${decimalPart}`;
        } else {
            element.innerText = `${symbol}${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }
    })
}

function addPositiveOrNegative(elements) {
    elements.forEach(element => {
        let num = parseFloat(element.innerText.replace('%', ''));
        console.log(num);
        if (num > 0) {
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

document.addEventListener('DOMContentLoaded', function() {
    const marketsTable = document.querySelector('.markets-table-wrapper');
    const tradeTable = document.querySelector('.trading-pairs-table-wrapper');
    const cryptoDetails = document.querySelector('.crypto-details-heading-section');
    const letterFormats = document.querySelectorAll('.letter-format');
    const commaFormats = document.querySelectorAll('.comma-format');
    const changes = document.querySelectorAll('.pos-neg-change');

    window.setTimeout(function() {
        if (marketsTable) {
            const trendingPrices = document.querySelectorAll('.trending-crypto-price');
            const marketCaps = document.querySelectorAll('.crypto-market-cap');
            const volume = document.querySelectorAll('.crypto-volume');
            
            formatPrices(trendingPrices);
            formatPrices(marketCaps);
            formatPrices(volume);
            marketsTable.style.display = 'flex';
        } else if (cryptoDetails) {
            formatPrices(letterFormats);
            commaFormatNumbers(commaFormats);
            addPositiveOrNegative(changes);
        } else if (tradeTable) {
            formatPrices(letterFormats);
            commaFormatNumbers(commaFormats);
            addPositiveOrNegative(changes);
            console.log(changes);
        }
    }, 800);
});