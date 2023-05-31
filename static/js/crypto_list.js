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

const prices = document.querySelectorAll('.crypto-price');

/**
 * Change the price from USD to EUR
 */
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

/**
 * Update the price from USD to EUR
 */
const convertPrices = async () => {
  for (const price of prices) {
    const convertedPrice = await priceConversion(parseFloat(price.innerText));
    price.innerText = `${convertedPrice[0]}${convertedPrice[1]}`;
  }
};

convertPrices();

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
 * Create the sparklines for the crypto list
 * Gets the data for the sparkline and plots a chart to represent the data
 */
const createSparklines = async (coins) => {
  var sparklineData = coins;
  $('.price-sparkline').each(function (index, sparkline) {
    let change = $('.crypto-change')[index + 1];
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

(async () => {
  let popularCrypto = await getPopularCrypto();
  await createSparklines(popularCrypto);
})();