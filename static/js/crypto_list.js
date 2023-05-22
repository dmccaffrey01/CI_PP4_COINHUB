const priceChanges = document.querySelectorAll('.crypto-change');

priceChanges.forEach(priceChange => {
    let num = parseInt(priceChange.innerText.replace('%', ''));

    if (num > 0 ) {
        if (priceChange.classList.contains('negative')) {
            priceChange.classList.remove('negative');
        }
        priceChange.classList.add('positive');
    } else if (num <= 0) {
        if (priceChange.classList.contains('positive')) {
            priceChange.classList.remove('positive');
        }
        priceChange.classList.add('negative');
    }
});

const prices = document.querySelectorAll('.crypto-price');

const priceConversion = async (usdAmount) => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const exchangeRate = data.rates.EUR;

    const eurAmount = usdAmount * exchangeRate;

    return ['€', eurAmount.toFixed(2)];
  } catch (error) {
    return ['$', usdAmount.toFixed(2)];
  }
};

const convertPrices = async () => {
  for (const price of prices) {
    const convertedPrice = await priceConversion(parseFloat(price.innerText));
    price.innerText = `${convertedPrice[0]}${convertedPrice[1]}`;
  }
};

convertPrices();