const historicalSectionContainer = document.querySelector('.historical-price-chart-section-container');
const historicalSectionWrapper = document.querySelector('.historical-section-container-wrapper');
const verticalLine = document.querySelector('.vertical-line');
const verticalLineContainer = document.querySelector('.vertical-line-container');

const createVerticalLine = (num) => {
     
    let verticalLineHeight = verticalLine.height - 40;

    let num = num - 0.33;

    

    let spaceBetweenLines = Math.floor(verticalLineHeight / num);

    for (let i =0; i < num; i++) {

    }
}

const getChartData = async (timePeriod, symbol) => {
    try {
      const response = await fetch(`/crypto_detail_price_data_from_api/${timePeriod}/${symbol}/`);
      const results = await response.text();
      return results;
    } catch (error) {
      return null;
    }
};

var formattedHistoricalPriceData;

const formatChartData = (data) => {
    let formattedData = [];
    let lastPriceArr = [];
    let timeArr = [];

    let parsedData = JSON.parse(data);

    for (let i = 0; i < parsedData.length; i++) {
        let lastPrice = parsedData[i]['last_price'];
        let time = parsedData[i]['time'];
        lastPriceArr.push(lastPrice);
        timeArr.push(time);
    }
    formattedData.push(lastPriceArr);
    formattedData.push(timeArr);
    formattedHistoricalPriceData = formattedData;
    return formattedData;
};

const timePeriodBtns = document.querySelectorAll('.historical-price-time-periods-btn');

const getFilterNum = () => {
    let num;
    
    timePeriodBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            let timePeriod = btn.getAttribute('data-time-period');

            if (timePeriod == '1h') {
                num = 1;
            } else if (timePeriod == '1d') {
                num = 5;
            } else if (timePeriod == '1w') {
                num = 1;
            } else if (timePeriod == '1m') {
                num = 3;
                return num;
            } else if (timePeriod =='1y') {
                num = 2;
            } else if (timePeriod == 'all') {
                num = 14;
            }
        }
    });

    return num;
}

function filterArray(array) {
    const filteredArray = [array[0]];

    let filterNum = getFilterNum();
    for (let i = 2; i < array.length; i += filterNum) {
      filteredArray.push(array[i]);
    }
  
    filteredArray.push(array[array.length - 1]);
  
    return filteredArray;
}

const historicalPriceChange = document.querySelector('.historical-crypto-change');
const historicalPrice = document.querySelector('.historical-crypto-price');

const updateHistoricalPriceChange = () => {
    const originPrice = formattedHistoricalPriceData[0][0];

    const currentPrice = historicalPrice.innerText.slice(1);
    const difference = (currentPrice - originPrice).toFixed(2);
    const change = ((difference / originPrice) * 100).toFixed(2);

    if (change >= 0) {
        historicalPriceChange.innerHTML = `<i class="fa-solid fa-up-long"></i> €${difference}   ${change}%`;
        if (historicalPriceChange.classList.contains('negative')) {
            historicalPriceChange.classList.remove('negative');
        }
        historicalPriceChange.classList.add('positive');
    } else {
        historicalPriceChange.innerHTML = `<i class="fa-solid fa-down-long"></i> €${difference}   ${change}%`;
        if (historicalPriceChange.classList.contains('positive')) {
            historicalPriceChange.classList.remove('positive');
        }
        historicalPriceChange.classList.add('negative');
    }
}

const updateHistoricalPrice = (price) => {
    historicalPrice.innerHTML = `€${price.toFixed(2)}`;
}

const createHistoricalPriceChart = async (data) => {

    const timestamps = filterArray(data[1]);
    const prices = filterArray(data[0]);
    const labels = timestamps.map((timestamp) => {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: 'short' });
        return `${month} ${year}`;
    });

    let oldCanvas = document.querySelector('.historical-price-chart');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    const canvasContainer = document.querySelector('.historical-price-chart-container');
    canvasContainer.innerHTML = '';

    const newCanvas = document.createElement('canvas');
    newCanvas.classList.add('historical-price-chart');

    canvasContainer.appendChild(newCanvas);

    const ctx = newCanvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                backgroundColor: 'transparent',
                borderColor: '#044a72',
                borderWidth: 5,
                pointRadius: 0,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Timestamp',
                    },
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Price',
                    },
                },
            },
            elements: {
                line: {
                  tension: 0,
                },
            },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
            },
        },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    let loadingIcon = document.querySelector('.loading-icon');
    loadingIcon.remove();
    historicalSectionContainer.style.display = 'flex';
    updateHistoricalPriceChange();

    console.log(prices);
    
    newCanvas.addEventListener('mousemove', function (event) {
        let rect = newCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        let canvasWidth = rect.width;

        let numOfDataPoints = prices.length;
        let numOfPixelsPerDataPoint = canvasWidth / (numOfDataPoints - 2);
        let priceIndex = Math.round(x / numOfPixelsPerDataPoint)
        let price = prices[priceIndex];

        updateHistoricalPrice(price);
        updateHistoricalPriceChange();

        verticalLineContainer.style.left = x + 'px';
      });
};

const loadDataAndCreateChart = async (timePeriod) => {
    let symbol = getCurrentCryptoSymbol();
    displayLoadingIcon();
    const data = formatChartData(await getChartData(timePeriod, symbol));
    await createHistoricalPriceChart(data);
};

const loadingIconContainer = document.querySelector('.loading-icon-container');

const displayLoadingIcon = () => {
    
    historicalSectionContainer.style.display = 'none';

    const loadingIcon = document.createElement('div');
    loadingIconContainer.appendChild(loadingIcon);
    loadingIcon.classList.add('loading-icon');
}

const getCurrentCryptoSymbol = () => {
    const url = window.location.href;
    const urlParts = url.split('/');
    const endOfUrl = urlParts[urlParts.length - 2];
    return endOfUrl
}

const switchTimePeriod = (event) => {
    const clickedBtn = event.target;

    const timePeriod = clickedBtn.getAttribute('data-time-period');

    if (clickedBtn.classList.contains('active')) {
        return;
    } else {
        timePeriodBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
            }
        });
        
        clickedBtn.classList.add('active');

        loadDataAndCreateChart(timePeriod);
    }

}

timePeriodBtns.forEach(btn => {
    btn.addEventListener('click', switchTimePeriod)
})

loadDataAndCreateChart('1m');



