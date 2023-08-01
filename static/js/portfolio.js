const verticalLine = document.querySelector('.vertical-line');
const verticalLineContainer = document.querySelector('.vertical-line-container');
const timestampDate = document.querySelector('.timestamp-date');
const canvasContainer = document.querySelector('.historical-price-chart-container');
const chartOverlay = document.querySelector('.historical-price-chart-overlay');
const historicalPriceChartWrapper = document.querySelector('.historical-price-chart-wrapper');


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


const getUserData = async () => {
    try {
      const response = await fetch(`/get_user_data/`);
      const results = await response.text();
      return results;
    } catch (error) {
      return null;
    }
};

const convertToEpoch = (timestamp) => {
    const date = new Date(timestamp);
    const epochTime = date.getTime();
    return epochTime;
};



const formatBalanceHistory = (balanceHistory) => {
    let formattedBalanceHistory = [];
    let userBalance = {};

    balanceHistory.forEach(balanceUpdate => {
        const { timestamp, symbol, new_balance } = balanceUpdate;
        let balanceEntry = {
            timestamp: timestamp,
        };

        if (symbol in userBalance) {
            userBalance[symbol] = new_balance;
        } else {
            userBalance[symbol] = new_balance;
        }

        // Create an array of asset entries from the userBalance object
        let assetEntries = [];
        for (const assetSymbol in userBalance) {
            assetEntries.push({
                symbol: assetSymbol,
                new_balance: userBalance[assetSymbol]
            });
        }

        // Add the asset entries to the balance entry
        balanceEntry.assets = assetEntries;

        formattedBalanceHistory.push(balanceEntry);
    });
    return formattedBalanceHistory;
};

const getAssetApiData = async (timePeriod, symbol) => {
    try {
      const response = await fetch(`/crypto_detail_price_data_from_api/${timePeriod}/${symbol}/`);
      const results = await response.text();
      return results;
    } catch (error) {
      return null;
    }
};


let priceHistoryAssets = [
    {
        'symbol': 'EUR',
        'price': 1
    }
];

const parseAssetApiData = (apiData) => {
    const parsedData = JSON.parse(apiData);
    return parsedData.map(entry => ({
        timestamp: entry.time,
        last_price: entry.last_price
    }));
};

const getAssetPrice = async (timestamp, symbol, counter) => {
    if (symbol === 'EUR') {
        return 1;
    }

    const timePeriod = getTimePeriod();
    const asset = priceHistoryAssets.find(asset => asset.symbol === symbol && asset.timePeriod === timePeriod);
    
    if (asset && asset.timePeriod == timePeriod) {
        const assetPriceData = asset.priceHistory;
        const lastIndex = assetPriceData.length - 1;

        // Find the price data that matches or is closest to the input timestamp
        for (let i = lastIndex; i >= 0; i--) {
            const currentTimestamp = assetPriceData[i].timestamp * 1000;
            
            if (timestamp >= currentTimestamp) {
                return assetPriceData[i].last_price;
            }
        }

        // If the input timestamp is earlier than the first recorded timestamp, return the first price
        return assetPriceData[0].last_price;
    }

    const apiResponse = await getAssetApiData(timePeriod, symbol);
    const assetPriceData = parseAssetApiData(apiResponse);
    const priceHistoryEntry = {
        'symbol': symbol,
        'priceHistory': assetPriceData,
        'timePeriod': timePeriod
    };
    priceHistoryAssets.push(priceHistoryEntry);

    // The data is assumed to be sorted by timestamp, so the last price will be the latest one
    return assetPriceData[assetPriceData.length - 1].last_price;
}

const formatAssets = async (assets, timestamp, counter) => {
    let totalBalance = 0;
    for (const asset of assets) {
        const assetPrice = await getAssetPrice(timestamp, asset.symbol, counter);
        totalBalance += asset.new_balance * assetPrice;
    }
    return totalBalance;
}

const getBalanceHistory = async (data) => {
    let parsedData = JSON.parse(data);
    let assets = parsedData.assets;
    
    let balanceHistory = [];

    // Define an asynchronous function to process each asset
    const processAsset = async (asset) => {
        let asset_history = asset.amount_history;
        asset_history = asset_history.replace(/'/g, '"');
        let parsedHistory = JSON.parse(asset_history);

        for (let i = 0; i < parsedHistory.length; i++) {
            let timestamp = parsedHistory[i].timestamp;

            let newBalance = parsedHistory[i].new_amount;
            let balanceEntry = {
                timestamp: timestamp,
                new_balance: newBalance,
                symbol: asset.symbol
            };

            balanceHistory.push(balanceEntry);
        }
    };

    // Use a for...of loop to process each asset one by one
    for (const asset of assets) {
        await processAsset(asset);
    }

    // Sort the balanceHistory array by timestamps in ascending order
    balanceHistory.sort((a, b) => a.timestamp - b.timestamp);
    let formattedBalanceHistory = formatBalanceHistory(balanceHistory);

    return formattedBalanceHistory;
};


const formatChartData = async (data) => {
    let formattedData = [];
    let lastBalanceArr = [];
    let timeArr = [];

    let balanceHistory = await getBalanceHistory(data);
    for (let i = 0; i < balanceHistory.length; i++) {
        let lastBalance = balanceHistory[i]['assets'];
        let time = balanceHistory[i]['timestamp'];
        time = convertToEpoch(time);
        lastBalanceArr.push(lastBalance);
        timeArr.push(time);
    }
    formattedData.push(lastBalanceArr);
    formattedData.push(timeArr);
    return formattedData;
};



const roundTime = (currentTime, timeInterval) => {
    let roundedTime;
  
    switch (timeInterval) {
        case 'minute':
            roundedTime = Math.floor(currentTime / (1000 * 60)) * (1000 * 60);
            break;
        case '5minute':
            roundedTime = Math.floor(currentTime / (1000 * 60 * 5)) * (1000 * 60 * 5);
            break;
        case 'hour':
            roundedTime = Math.floor(currentTime / (1000 * 60 * 60)) * (1000 * 60 * 60);
            break;
        default:
            roundedTime = currentTime;
            break;
    }
  
    return roundedTime;
};

const roundTimestamps = (arr, timeInterval) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let newTime = roundTime(arr[i], timeInterval);
        newArr.push(newTime);
    }

    return newArr;
}

const getChartPointsData = (timePeriod, type) => {
    let points;
    let currentTime = new Date().getTime();
    let originTime;
    let roundedTime;
    let timeFrame;
    let timeInterval;

    if (type === "normal") {
        if (timePeriod == '1h') {
            points = 60;
            timeInterval = "minute"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000;
            originTime = roundedTime - (points * timeFrame);
        } else if (timePeriod == '1d') {
            points = 288;
            timeInterval = "5minute"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000 * 5;
            originTime = roundedTime - (points * timeFrame);
        } else if (timePeriod == '1w') {
            points = 168;
            timeInterval = "hour"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000 * 60;
            originTime = roundedTime - (points * timeFrame);
        } else if (timePeriod == '1m') {
            points = 224;
            timeInterval = "hour"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000 * 60 * 3;
            originTime = roundedTime - (points * timeFrame);
        } else if (timePeriod =='1y') {
            points = 366;
            timeInterval = "hour"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000 * 60 * 24;
            originTime = roundedTime - (points * timeFrame);
        } else if (timePeriod == 'all') {
            points = 366;
            timeInterval = "hour"
            roundedTime = roundTime(currentTime, timeInterval);
            timeFrame = 60000 * 60 * 24;
            originTime = roundedTime - (points * timeFrame);
        }
    } else {
        points = 24;
        timeInterval = "hour"
        roundedTime = roundTime(currentTime, timeInterval);
        timeFrame = 60000 * 60;
        originTime = roundedTime - (points * timeFrame);
    }

    data = {
        "points": points,
        "timeInterval": timeInterval,
        "roundedTime": roundedTime,
        "timeFrame": timeFrame,
        "originTime": originTime
    }

    return data;
}

const getArrayAverage = (arr) => {
    if (arr.length === 0) {
      return 0;
    }
  
    const sum = arr.reduce((acc, num) => acc + num, 0);
    const average = sum / arr.length;
  
    return average;
};

const getMostRecentBalance = (time, data) => {
    let timestamps = data[1];
    let startTime = time / 1000;
    let foundMostRecentTime = false;
    let mostRecentTimeIndex = 0;
    
    for (let i = timestamps.length; i > 0; i--) {
        console.log(timestamps[i], startTime);
        if (timestamps[i] < startTime && !foundMostRecentTime) {
            mostRecentTimeIndex = i;
            foundMostRecentTime = true;
            break;
        }
    }
    let mostRecentBalance = data[0][mostRecentTimeIndex];
    let mostRecentTime = data[1][mostRecentTimeIndex];
    let result = {
        assets: mostRecentBalance,
        time: mostRecentTime
    }
    return result;
}

const formatHistoricalData = async (data) => {
    let timePeriod = getTimePeriod();
    let pointsData = getChartPointsData(timePeriod, "normal");
    let roundedTime = pointsData["roundedTime"];
    let timeFrame = pointsData["timeFrame"];
    let originTime = pointsData["originTime"]; 
    let timeInterval = pointsData["timeInterval"];

    let timestamps = roundTimestamps(data[1], timeInterval);
    let balances = data[0];
    let formattedTimestamps = [];
    let formattedBalances = [];

    let formattedData = [];

    let previousBalance;

    let counter = 0;

    for (let i = originTime; i < roundedTime; i += timeFrame) {
        
        let balanceUpdates = [];

        formattedTimestamps.push(i);

        let stopTime;
        if (i == originTime) {
            stopTime = (i - (timeFrame * 60 * 24 * 366)) ;
        } else {
            stopTime = i - timeFrame;
        }
        for (let k = stopTime; k < i; k += timeFrame) {
            for (let j = 0; j < timestamps.length; j++) {
                if (timestamps[j] >= k && timestamps[j] <= k + timeFrame) {
                    let assets = balances[j];
                    balanceUpdates.push(assets);
                }
            }
        }
        let mostRecentBalance;
        if (balanceUpdates.length > 0) {
            let mostRecentUpdate = balanceUpdates[balanceUpdates.length - 1];
            let mostRecentAssets = {
                assets: mostRecentUpdate,
                time: i
            };
            console.log(mostRecentUpdate, originTime);
            console.log(timestamps[balanceUpdates.length - 1], originTime);
            mostRecentBalance = await formatAssets(mostRecentAssets.assets, i, counter);
            previousBalance = mostRecentAssets;
        } else if (i == originTime) {
            mostRecentAssets = getMostRecentBalance(originTime, data);
            mostRecentBalance = await formatAssets(mostRecentAssets.assets, i, counter);
            previousBalance = mostRecentAssets;
        } else {
            mostRecentBalance = await formatAssets(previousBalance.assets, i, counter);
        }

        previousBalance = mostRecentAssets;
        formattedBalances.push(mostRecentBalance);
        counter++;
    }

    if (timePeriod == "1y" || timePeriod == "all") {
        formattedBalances.pop();
        formattedTimestamps.pop();
        
        timePeriod = "1d";
        pointsData = getChartPointsData(timePeriod, "special");
        roundedTime = pointsData["roundedTime"];
        timeFrame = pointsData["timeFrame"];
        originTime = pointsData["originTime"]; 
        timeInterval = pointsData["timeInterval"];
        
        for (let i = originTime; i < roundedTime; i += timeFrame) {
        
            let balanceUpdates = [];
    
            formattedTimestamps.push(i);
    
            let stopTime;
            if (i == originTime) {
                stopTime = (i - (timeFrame * 60 * 24 * 366)) ;
            } else {
                stopTime = i - timeFrame;
            }
            
            for (let k = stopTime; k < i; k += timeFrame) {
                for (let j = 0; j < timestamps.length; j++) {
                    if (timestamps[j] >= k && timestamps[j] <= k + timeFrame) {
                        let assets = balances[j];
                        balanceUpdates.push(assets);
                    }
                }
            }
            let mostRecentBalance;
            if (balanceUpdates.length > 0) {
                let mostRecentUpdate = balanceUpdates[balanceUpdates.length - 1];
                let mostRecentAssets = {
                    assets: mostRecentUpdate,
                    time: i
                };
                mostRecentBalance = await formatAssets(mostRecentAssets.assets, i, counter);
                previousBalance = mostRecentAssets;
            } else if (i == originTime) {
                mostRecentAssets = getMostRecentBalance(originTime, data);
                mostRecentBalance = await formatAssets(mostRecentAssets.assets, i, counter);
                previousBalance = mostRecentAssets;
            } else {
                mostRecentBalance = await formatAssets(previousBalance.assets, i, counter);
            }
    
            previousBalance = mostRecentAssets;
            formattedBalances.push(mostRecentBalance);
            counter++;
        }
    }

    formattedData.push(formattedBalances);
    formattedData.push(formattedTimestamps);
    
    return formattedData;
}

const historicalPriceChange = document.querySelector('.historical-crypto-change');
const historicalPrice = document.querySelector('.historical-crypto-price');

const updateHistoricalPriceChange = (data) => {
    const originPrice = data[0][0];

    const currentPrice = historicalPrice.innerText.slice(1).replace(/,/g, '');
    const difference = (currentPrice - originPrice).toFixed(2);
    let change;
    if (originPrice == 0) {
        change = (((difference / 1) * 100)).toFixed(2);
    } else {
        change = ((difference / originPrice) * 100).toFixed(2);
    }
    

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
    const timestamps = data[1];
    const prices = data[0];
    const labels = timestamps.map((timestamp) => {
        const date = new Date(timestamp);
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

    // updateHistoricalPriceChange();
    
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
        let date = new Date(timestamp);

        updateHistoricalPrice(price);
        // updateHistoricalPriceChange();
        updateTimestampDate(date);

        verticalLineContainer.style.left = x + 'px';
        chartOverlay.style.width = (canvasWidth - x) + 'px';
    });
      
    
    historicalPriceChartWrapper.addEventListener('mouseenter', function () {
        verticalLineContainer.style.display = 'flex';
        createVerticalLine(20);
        chartOverlay.style.display = 'flex';
        timestampDate.style.display = 'flex';
    });

    historicalPriceChartWrapper.addEventListener('mouseleave', function () {
        verticalLineContainer.style.display = 'none';
        chartOverlay.style.display = 'none';
        timestampDate.style.display = 'none';
    });
    
};

const loadDataAndCreateChart = async () => {
    const userData = await getUserData();
    let chartData = await formatChartData(userData);
    let formattedData = await formatHistoricalData(chartData);
    await createHistoricalPriceChart(formattedData);
};

const switchTimePeriod = (event) => {
    const clickedBtn = event.target;

    if (clickedBtn.classList.contains('active')) {
        return;
    } else {
        timePeriodBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
            }
        });
        
        clickedBtn.classList.add('active');

        loadDataAndCreateChart();
    }

}

timePeriodBtns.forEach(btn => {
    btn.addEventListener('click', switchTimePeriod)
})

document.addEventListener('DOMContentLoaded', () => {
    loadDataAndCreateChart();
});




