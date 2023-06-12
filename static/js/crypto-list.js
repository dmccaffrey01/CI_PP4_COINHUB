const priceChanges = document.querySelectorAll('.crypto-change');

/**
 * Change the color of the price change
 */
const changePriceColors = () => {
  priceChanges.forEach(priceChange => {
      let num = parseFloat(priceChange.innerText.replace('%', ''));

      if (num > 0 ) {
          if (priceChange.classList.contains('negative')) {
              priceChange.classList.remove('negative');
          }
          priceChange.classList.add('positive');
      } else if (num < 0) {
          if (priceChange.classList.contains('positive')) {
              priceChange.classList.remove('positive');
          }
          priceChange.classList.add('negative');
      }
  });
};

changePriceColors();

const cryptoPrices = document.querySelectorAll('.crypto-price');
const marketCaps = document.querySelectorAll('.crypto-market-cap');
const volumes = document.querySelectorAll('.crypto-volume');

/**
 * Change the price from USD to EUR
 */
const priceConversion = async (usdAmount) => {
  try {
    /*
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const exchangeRate = data.rates.EUR;
    */
    const exchangeRate = 1;
    const eurAmount = usdAmount * exchangeRate;

    return ['€', eurAmount.toFixed(2)];
  } catch (error) {
    return ['$', usdAmount.toFixed(2)];
  }
};

/**
 * Update the price from USD to EUR
 */
const convertPrices = async (prices, type) => {
  for (const price of prices) {
    const marketList = document.querySelector('.crypto-list-markets-section');
    const homeList = document.querySelector('.crypto-list-home-section');
    if (marketList) {
      if (marketList.contains(price)) {
        var parent = 'normal';
      } else {
        var parent = 'letter';
      }
    } else if (homeList) {
      if (homeList.contains(price)) {
        var parent = 'normal';
      } else {
        var parent = 'letter';
      }
    }
    let num = parseFloat(price.innerText);
    const convertedPrice = await priceConversion(num);
    if (type === "normal" && parent === "normal") {
      convertedPrice[1] = addCommasToNumber(convertedPrice[1])
      console.log(convertedPrice[1]);
    }
    price.innerText = `${convertedPrice[0]}${convertedPrice[1]}`;
  }
};

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const currencyConversion = function () {
  convertPrices(cryptoPrices, "normal");
  if (marketCaps) {
    convertPrices(marketCaps, "letter");
  }

  if (volumes) {
    convertPrices(volumes, "letter");
  }
}

currencyConversion();


/**
 * Get the popular crypto in the form json string
 */
const getPopularCrypto = async () => {
  try {
    const response = await fetch(`/get_popular_crypto/`);
    const results = await response.json();
    return results;
  } catch (error) {
    return null;
  }
};

/**
 * Get the crytocurrencies in the form json string
 */

const createCryptoList = async () => {
  try {
    const response = await fetch(`/create-crypto-list/`);
    const results = await response.json();
    return results;
  } catch (error) {
    return null;
  }
};


/**
 * Create the sparklines for the crypto list
 * Gets the data for the sparkline and plots a chart to represent the data
 */
const createSparklines = async (coins, changeIndex) => {
  var sparklineData = coins;
  $('.price-sparkline').each(function (index, sparkline) {
    let change = $('.crypto-change')[index + changeIndex];
    let computedStyle = getComputedStyle(change);
    let color = computedStyle.color;
    var priceData = sparklineData[index]['sparkline'];
    if (!Array.isArray(priceData)) {
      priceData = JSON.parse(priceData);
    }
    priceData = priceData.map((price) => parseFloat(price));
    var ctx = sparkline.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: priceData.map(function (_, index) {
          return index;
        }),
        datasets: [
          {
            data: priceData,
            borderColor: color,
            backgroundColor: 'transparent',
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            pointRadius: 0,
            borderWidth: 3,
            label: '',
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        legend: {
          display: false,
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        layout: {
          padding: {
            left: -100,
            right: -100,
            top: -100,
            bottom: -100,
          },
        },
      },
    });
  });
};


/**
 * Get popular crypto then create sparklines
 */
(async () => {
  let homeList = document.querySelector('.crypto-list-home-section');
  let marketsList = document.querySelector('.crypto-list-markets-section');
  if (homeList) {
    let changeIndex = 1;
    let popularCrypto = await getPopularCrypto();
    await createSparklines(popularCrypto, changeIndex);
  } else if (marketsList) {
    let changeIndex = 10;
    let crypto = await createCryptoList();
    await createSparklines(crypto, changeIndex);
  } else {
  }
})();