const historicalSectionContainer = document.querySelector('.historical-price-chart-section-container');
const historicalSectionWrapper = document.querySelector('.historical-section-container-wrapper');
const historicalPriceChartWrapper = document.querySelector('.historical-price-chart-wrapper');
const verticalLine = document.querySelector('.vertical-line');
const verticalLineContainer = document.querySelector('.vertical-line-container');
const timestampDate = document.querySelector('.timestamp-date');
const canvasContainer = document.querySelector('.historical-price-chart-container');
const chartOverlay = document.querySelector('.historical-price-chart-overlay');

/*
const createVerticalLine = (num) => {
    let verticalLineHeight = verticalLine.offsetHeight;
    let ratioNum = Math.round(num * 0.33);
    let totalRatio = num + ratioNum;
    let totalSectionHeight = (verticalLineHeight * num) / totalRatio;
    let totalGapHeight = (verticalLineHeight * ratioNum) / totalRatio;
    let sectionHeight = totalSectionHeight / num;
    let gapHeight = totalGapHeight / (num - 1);

    for (let i = 0; i < num - 1; i++) {
        let section = document.createElement('div');
        section.classList.add('vertical-line-section');
        section.style.height = sectionHeight + 'px';
        section.style.top = (sectionHeight * i) + (gapHeight * i) + 'px';

        verticalLine.appendChild(section);
    }

    let lastSection = document.createElement('div');
    lastSection.classList.add('vertical-line-section');
    lastSection.style.height = sectionHeight + 'px';
    lastSection.style.top = (sectionHeight * (num - 1)) + (gapHeight * (num - 1)) + 'px';

    verticalLine.appendChild(lastSection);

    return [sectionHeight, gapHeight]
}

*/

const getUserData = async () => {
    try {
      const response = await fetch(`/get_user_data/`);
      const results = await response.text();
      return results;
    } catch (error) {
      return null;
    }
};

var formattedHistoricalData;

const formatChartData = (data) => {
    let formattedData = [];
    let lastBalanceArr = [];
    let timeArr = [];

    let parsedData = JSON.parse(data);
    let balanceHistory = parsedData["balance_history"]

    for (let i = 0; i < balanceHistory.length; i++) {
        let lastBalance = balanceHistory[i]['new_balance'];
        let time = parsedData[i]['timestamp'];
        lastBalanceArr.push(lastBalance);
        timeArr.push(time);
    }
    formattedData.push(lastBalanceArr);
    formattedData.push(timeArr);
    formattedHistoricalData = formattedData;
    return formattedData;
};

const timePeriodBtns = document.querySelectorAll('.historical-price-time-periods-btn');

const getTimePeriod = () => {
    let timePeriod;
    
    timePeriodBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            timePeriod = btn.getAttribute('data-time-period');
        }
    });

    return timePeriod;

}

const convertToEpoch = (timestamp) => {
    const date = new Date(timestamp);
    const epochTime = date.getTime();
    return epochTime;
};

const roundTime = (currentTime, timePeriod) => {
    let roundedTime;
  
    switch (timePeriod) {
      case 'minute':
        roundedTime = Math.floor(currentTime / (1000 * 60)) * (1000 * 60);
        break;
      case 'hour':
        roundedTime = Math.floor(currentTime / (1000 * 60 * 60)) * (1000 * 60 * 60);
        break;
      case 'day':
        roundedTime = Math.floor(currentTime / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24);
        break;
      case '5minute':
        roundedTime = Math.floor(currentTime / (1000 * 60 * 5)) * (1000 * 60 * 5);
        break;
      case '3hour':
        roundedTime = Math.floor(currentTime / (1000 * 60 * 60 * 3)) * (1000 * 60 * 60 * 3);
        break;
      default:
        roundedTime = currentTime;
        break;
    }
  
    return roundedTime;
  };
const getChartPointsData = () => {
    let points;
    let currentTime = new Date().getTime();
    let originTime;
    let roundedTime;
    let timePeriod = getTimePeriod();

    if (timePeriod == '1h') {
        points = 60;
        roundedTime = roundTime(currentTime, "minute");
    } else if (timePeriod == '1d') {
        points = 288;
        roundedTime = roundTime(currentTime, "5minute");
    } else if (timePeriod == '1w') {
        points = 168;
        roundedTime = roundTime(currentTime, "hour");
    } else if (timePeriod == '1m') {
        points = 224;
        roundedTime = roundTime(currentTime, "3hour");
    } else if (timePeriod =='1y') {
        points = 365;
        roundedTime = roundTime(currentTime, "day");
    } else if (timePeriod == 'all') {
        points = 365;
        roundedTime = roundTime(currentTime, "day");
    }

    data = {
        "points": points,
        
    }
    return data;
}

const filterArray = (arr, type) => {
    let pointsData = getChartPointsData();

    let timestamps = [];
    for (let i = 0; i < pointsData["num"]; i++) {

    }
}

const historicalPriceChange = document.querySelector('.historical-crypto-change');
const historicalPrice = document.querySelector('.historical-crypto-price');

const updateHistoricalPriceChange = () => {
    const originPrice = formattedHistoricalData[0][0];

    const currentPrice = historicalPrice.innerText.slice(1).replace(/,/g, '');
    const difference = (currentPrice - originPrice).toFixed(2);
    const change = ((difference / originPrice) * 100).toFixed(2);

    if (change >= 0) {
        historicalPriceChange.innerHTML = `<i class="fa-solid fa-up-long"></i> €${addCommasToNumber(difference)}   ${change}%`;
        if (historicalPriceChange.classList.contains('negative')) {
            historicalPriceChange.classList.remove('negative');
        }
        historicalPriceChange.classList.add('positive');
    } else {
        historicalPriceChange.innerHTML = `<i class="fa-solid fa-down-long"></i> €${addCommasToNumber(difference)}   ${change}%`;
        if (historicalPriceChange.classList.contains('positive')) {
            historicalPriceChange.classList.remove('positive');
        }
        historicalPriceChange.classList.add('negative');
    }
}

const updateTimestampDate = (date) => {
    let year = date.getFullYear();
    let month = date.toLocaleString('en-UK', { month: 'short' });
    let day = date.getDate();
    let time = date.toLocaleTimeString('en-UK');

    let timePeriod = getTimePeriod();

    let formattedDate;
    if (timePeriod == '1h' || timePeriod == '1d' || timePeriod == '1w' || timePeriod == '1m' || timePeriod == '1y') {
        formattedDate = `${day} ${month} ${time}`;
    } else {
        formattedDate = `${day} ${month} ${year}`;
    }

    timestampDate.innerText = formattedDate;
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const updateHistoricalPrice = (num) => {
    let price = addCommasToNumber(num.toFixed(2));
    historicalPrice.innerHTML = `€${price}`;
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

    newCanvas.addEventListener('mousemove', function (event) {
        let rect = newCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        let canvasWidth = rect.width;

        let numOfDataPoints = prices.length;
        let numOfPixelsPerDataPoint = canvasWidth / (numOfDataPoints - 2);
        let priceIndex = Math.round(x / numOfPixelsPerDataPoint)
        let price = prices[priceIndex];
        let timestamp = timestamps[priceIndex];
        let date = new Date(timestamp * 1000);

        updateHistoricalPrice(price);
        updateHistoricalPriceChange();
        updateTimestampDate(date);

        verticalLineContainer.style.left = x + 'px';
        chartOverlay.style.width = (canvasWidth - x) + 'px';
      });

    historicalPriceChartWrapper.addEventListener('mouseenter', function () {
        verticalLineContainer.style.display = 'flex';
        createVerticalLine(40);
        chartOverlay.style.display = 'flex';
        timestampDate.style.display = 'flex';
    });

    historicalPriceChartWrapper.addEventListener('mouseleave', function () {
        verticalLineContainer.style.display = 'none';
        chartOverlay.style.display = 'none';
        timestampDate.style.display = 'none';
    });
};

const loadDataAndCreateChart = async (timePeriod) => {
    const data = formatChartData(await getChartData(timePeriod, symbol));
    await createHistoricalPriceChart(data);
};

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



