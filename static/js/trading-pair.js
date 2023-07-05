const changeTradingPairBtn = document.querySelector(".change-trading-pair-btn");
const tradeTable = document.querySelector(".crypto-trade-table-trading-pair");
const changeTradingPairBtnIcon = document.querySelector(".change-trading-pair-btn-icon");

const canvas = document.querySelector('.trading-pair-price-chart-wrapper');
const canvasContainer = document.querySelector('.trading-pair-price-chart-container');

const crosshair = document.querySelector('.trading-pair-chart-crosshair-container');
const timestampCrosshairLabel = document.querySelector('.timestamp-crosshair-label');
const priceCrosshairLabel = document.querySelector('.price-crosshair-label');

const verticalLineContainer = document.querySelector(".crosshair-vertical-line-container");
const verticalLines = document.querySelectorAll(".vertical-line");
const horizontalLineContainer = document.querySelector(".crosshair-horizontal-line-container");
const horizontalLines = document.querySelectorAll(".horizontal-line");

const chartTooltip = document.querySelector('.chart-tooltip');

let globalFormattedData = [];
let globalPriceRange = [];
let globalTimeRange = [];
let globalXValues = [];
let globalYValues = [];
let globalCandlestickData = [];
let nextFiveData = [];

let globalCurrentPrice;
let globalBuySellMinMax = [];

const updateLastPrice = () => {
    const lastPriceElement = document.querySelector('.last-price-text');

    let currentPrice = globalCurrentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    
    lastPriceElement.innerHTML = `€${currentPrice}`;
}

const getOrderBookPriceData = () => {
    let maxNum = (globalCurrentPrice * 0.0005);
    let maxRange = [(maxNum - (maxNum * 0.25)), (maxNum + (maxNum * 0.25))];
    let maxPrice = ((Math.random() * (maxRange[1] - maxRange[0])) + maxRange[0]);
    let stepPrice = maxPrice / 17;
    let halfStepPrice = stepPrice / 2;
    let arr = [];
    for (let i = 0; i < 17; i++) {
        let currentStepPrice = stepPrice * (i + 1);
        let max = currentStepPrice + halfStepPrice;
        let min = currentStepPrice - halfStepPrice;
        let price = ((Math.random() * (max - min)) + min);
        arr.push(price);
    }
    return arr;
}

function randn_bm(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() 
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 
    if (num > 1 || num < 0) 
      num = randn_bm(min, max, skew) 
    
    else{
      num = Math.pow(num, skew) 
      num *= max - min 
      num += min 
    }
    return num
  }

const getOrderBookAmountData = () => {
    let maxAmount = 0.8;
    let minAmount = 0.01;

    let arr = [];
    for (let i = 0; i < 17; i++) {
        let amount = randn_bm(minAmount, maxAmount, 3);
        arr.push(amount);
    }
    return arr;
}

getOrderBookAmountData();

const updateOrderBook = () => {
    const sellPriceList = document.querySelector(".sell-price-numbers-list");
    const sellAmountList = document.querySelector(".sell-amount-numbers-list");
    const buyPriceList = document.querySelector(".buy-price-numbers-list");
    const buyAmountList = document.querySelector(".buy-amount-numbers-list");
    const currentNumberPrice = document.querySelector(".current-number-price");
    const currentNumberAmount = document.querySelector(".current-number-amount");

    const prices = document.querySelectorAll(".order-book-num");
    if (prices.length > 0) {
        prices.forEach(price => {
            price.remove();
        })
    }

    currentNumberPrice.innerHTML = globalCurrentPrice;
    currentNumberAmount.innerHTML = ((Math.random() * (7.99 - 2.00)) + 2.00).toFixed(2);

    let buyPrices = getOrderBookPriceData();
    let sellPrices = getOrderBookPriceData();
    let buyAmounts = getOrderBookAmountData();
    let sellAmounts = getOrderBookAmountData();

    for (let i = 0; i < sellPrices.length; i++) {
        let buyPriceElement = document.createElement("div");
        let sellPriceElement = document.createElement("div");
        let sellAmountElement = document.createElement("div");
        let buyAmountElement = document.createElement("div");
        
        buyPriceElement.classList.add("order-book-num");
        sellPriceElement.classList.add("order-book-num");
        sellAmountElement.classList.add("order-book-num");
        buyAmountElement.classList.add("order-book-num");

        let buyPrice = (parseFloat(globalCurrentPrice) - buyPrices[i]).toFixed(2);
        let sellPrice = (parseFloat(globalCurrentPrice) + sellPrices[i]).toFixed(2);
        let sellAmount = sellAmounts[i].toFixed(8);
        let buyAmount = buyAmounts[i].toFixed(8);

        buyPriceElement.innerHTML = buyPrice;
        sellPriceElement.innerHTML = sellPrice;
        sellAmountElement.innerHTML = sellAmount;
        buyAmountElement.innerHTML = buyAmount;

        buyPriceList.appendChild(buyPriceElement);
        sellPriceList.appendChild(sellPriceElement);
        sellAmountList.appendChild(sellAmountElement);
        buyAmountList.appendChild(buyAmountElement);

        if (i == sellPrices.length - 1) {
            globalBuySellMinMax = [buyPrice, sellPrice];
        }
    }
}

const displayToolTip = (x, y, price, timestamp) => {
    chartTooltip.style.display = 'flex';
    chartTooltip.innerHTML = `<div>${timestamp}</div>
                                <div>O: ${price["o"]}</div>
                                <div>H: ${price["h"]}</div>
                                <div>L: ${price["l"]}</div>
                                <div>C: ${price["c"]}</div>`;
    
    let height = chartTooltip.offsetHeight;
    chartTooltip.style.left = x + 20 + 'px';
    chartTooltip.style.top = y - 20 - height + 'px';
}

const updateTimestampLabel = (x, timestamps, y) => {
    let min = globalXValues[0];
    let max = globalXValues[1];
    let numOfPoints = timestamps.length - 1;

    let chartWidth = max - min;

    let pointWidth = chartWidth / numOfPoints;

    let timeIndex;
    if (x >= max) {
        timeIndex = numOfPoints;
    } else if (x <= min) {
        timeIndex = 0
    } else {
        timeIndex = Math.round((x - min) / pointWidth);
    }
    let timestamp = timestamps[timeIndex];

    timestampCrosshairLabel.innerHTML = timestamp;

    let candlestickTops = globalCandlestickData[0];
    let candlestickBottoms = globalCandlestickData[1];
    if (y >= candlestickTops[timeIndex] && y <= candlestickBottoms[timeIndex]) {
        let price = globalFormattedData[timeIndex];
        displayToolTip(x, y, price, timestamp);
    } else {
        chartTooltip.style.display = 'none';
    }
}

const updatePriceLabel = (y, prices) => {
    let min = globalYValues[0];
    let max = globalYValues[1];
    let numOfPoints = prices.length;
    let chartHeight = min - max;
    let pointHeight = chartHeight / numOfPoints;
    let priceIndex;
    if (y <= max) {
        priceIndex = 0;
    } else if (y >= min) {
        priceIndex = numOfPoints - 1
    } else {
        priceIndex = Math.floor((y - max) / pointHeight);
    }
    let price = prices[priceIndex];

    priceCrosshairLabel.innerHTML = price;
}

const dataOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
}

const updateTimestampAndPriceLabel = (x, y) => {
    let timestamps = [];
    for (let i = 0; i < globalFormattedData.length; i++) {
        let timestamp = globalFormattedData[i]["t"].toLocaleString("en", dataOptions);
        timestamps.push(timestamp);
    }
    
    let prices = [];
    let maxPrice = globalPriceRange[1];
    let minPrice = globalPriceRange[0];
    let length = maxPrice - minPrice;

    for (let i = maxPrice; i >= minPrice; i -= 1) {
        prices.push(i);
    }

    updateTimestampLabel(x, timestamps, y);

    updatePriceLabel(y, prices);

}

const createVerticalLine = (num, x, y) => {

    verticalLines.forEach((verticalLine, index) => {
        let verticalLineHeight = verticalLineContainer.offsetHeight;

        let yHeightRatio = Math.abs(index - (y / verticalLineHeight));

        verticalLine.style.height = yHeightRatio * verticalLineHeight + 'px';

        let newNum = Math.round(num * yHeightRatio);

        let ratioNum = Math.round(newNum * 0.33);
        
        let totalRatio = newNum + ratioNum;

        let totalSectionHeight = ((verticalLineHeight * yHeightRatio) * newNum) / totalRatio;

        let totalGapHeight = ((verticalLineHeight * yHeightRatio) * ratioNum) / totalRatio;

        let sectionHeight = totalSectionHeight / newNum;

        let gapHeight = totalGapHeight / (newNum - 1);
        for (let i = 0; i < newNum - 1; i++) {
            let section = document.createElement('div');
            section.classList.add('vertical-line-section');
            section.style.height = sectionHeight + 'px';
            section.style.top = (sectionHeight * i) + (gapHeight * i) + 'px';

            verticalLine.appendChild(section);
        }

        let lastSection = document.createElement('div');
        lastSection.classList.add('vertical-line-section');
        lastSection.style.height = sectionHeight + 'px';
        lastSection.style.top = (sectionHeight * (newNum - 1)) + (gapHeight * (newNum - 1)) + 'px';

        verticalLine.appendChild(lastSection);

        verticalLineContainer.style.left = (x - 1) + 'px';
    })

    return [x, y]
}

const clearVerticalLine = () => {
    const verticalLineSections = document.querySelectorAll('.vertical-line-section');
    verticalLineSections.forEach(section => {
        section.remove();
    })
}

const createHorizontalLine = (num, x, y) => {
    horizontalLines.forEach((horizontalLine, index) => {
        let horizontalLineWidth = horizontalLineContainer.offsetWidth;

        let xWidthRatio = Math.abs(index - (x / horizontalLineWidth));

        horizontalLine.style.width = xWidthRatio * horizontalLineWidth + 'px';

        let newNum = Math.round(num * xWidthRatio);

        let ratioNum = Math.round(newNum * 0.33);
        
        let totalRatio = newNum + ratioNum;

        let totalSectionWidth = ((horizontalLineWidth * xWidthRatio) * newNum) / totalRatio;

        let totalGapWidth = ((horizontalLineWidth * xWidthRatio) * ratioNum) / totalRatio;

        let sectionWidth = totalSectionWidth / newNum;

        let gapWidth = totalGapWidth / (newNum - 1);
        
        for (let i = 0; i < newNum - 1; i++) {
            let section = document.createElement('div');
            section.classList.add('horizontal-line-section');
            section.style.width = sectionWidth + 'px';
            section.style.left = (sectionWidth * i) + (gapWidth * i) + 'px';

            horizontalLine.appendChild(section);
        }
        
        let lastSection = document.createElement('div');
        lastSection.classList.add('horizontal-line-section');
        lastSection.style.width = sectionWidth + 'px';
        lastSection.style.left = (sectionWidth * (newNum - 1)) + (gapWidth * (newNum - 1)) + 'px';

        horizontalLine.appendChild(lastSection);

        horizontalLineContainer.style.top = (y - 1) + 'px';
    })

    return [x, y]
}

const clearHorizontalLine = () => {
    const horizontalLineSections = document.querySelectorAll('.horizontal-line-section');
    horizontalLineSections.forEach(section => {
        section.remove();
    })
}

const createCrosshair = (num, x, y) => {
    clearVerticalLine();
    createVerticalLine(num, x, y);
    clearHorizontalLine();
    createHorizontalLine((2.66 * num), x, y);
}

canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    createCrosshair(30, x, y);
    updateTimestampAndPriceLabel(x, y);
});

canvas.addEventListener('mouseenter', function () {
    crosshair.style.display = 'flex';
    timestampCrosshairLabel.style.display = 'flex';
    priceCrosshairLabel.style.display = 'flex';
});

canvas.addEventListener('mouseleave', function () {
    crosshair.style.display = 'none';
    timestampCrosshairLabel.style.display = 'none';
    priceCrosshairLabel.style.display = 'none';
});

changeTradingPairBtn.addEventListener("click", () => {

    if (tradeTable.classList.contains("active")) {
        tradeTable.classList.remove("active");
        changeTradingPairBtnIcon.classList.remove("active");
    } else {
        tradeTable.classList.add("active");
        changeTradingPairBtnIcon.classList.add("active");
    }
    
})

const getCurrentCryptoSymbol = () => {
    const url = window.location.href;
    const urlParts = url.split('/');
    const endOfUrl = urlParts[urlParts.length - 2];
    return endOfUrl
}

const getChartData = async () => {
    let symbol = getCurrentCryptoSymbol();

    try {
        const response = await fetch(`/get_trading_pair_data/${symbol}`);
        const results = await response.json();
        return results;
      } catch (error) {
        throw error;
      }
}

const convertTime = (time) => {
    return new Date(time * 1000);
}

const getFormattedChartData = async () => {
    let data = await getChartData();

    let formattedData = [];

    for (let i = 25; i < data.length; i++) {
        let d = data[i];
        let fD = {};

        fD["t"] = convertTime(d["time"] + (60 * 5));
        if (i === 0) {
            fD["o"] = d["open"];
        } else {
            fD["o"] = data[i - 1]["close"];
        }
        fD["h"] = d["high"];
        fD["l"] = d["low"];
        fD["c"] = d["close"];
        fD["s"] = [fD["o"], fD["c"]];

        formattedData.push(fD);
    }

    nextFiveData = formattedData.slice(formattedData.length - 5, formattedData.length);
    globalFormattedData = formattedData.slice(0, formattedData.length - 5);;

    return globalFormattedData
}

const getPriceMovements = (index) => {
    let data = nextFiveData[index];

    let maxIndex = 600;

    let openPrice = data["o"];
    let highPrice = data["h"];
    let lowPrice = data["l"];
    let closePrice = data["c"];

    let lowIndex = Math.floor(Math.random() * (525 - 75 + 1) + 75);
    let highIndex;
    let prices, startIndex, endIndex;

    if (lowIndex < 175) {
        highIndex = lowIndex + Math.floor(Math.random() * ((525 - lowIndex) - 100 + 1)) + 100;
        prices = [openPrice, lowPrice, highPrice, closePrice];
        startIndex = [0, lowIndex, highIndex];
        endIndex = [lowIndex, highIndex, maxIndex];
      } else if (lowIndex > 425) {
        highIndex = lowIndex - Math.floor(Math.random() * ((lowIndex - 75) - 100 + 1)) + 100;
        prices = [openPrice, highPrice, lowPrice, closePrice];
        startIndex = [0, highIndex, lowIndex];
        endIndex = [highIndex, lowIndex, maxIndex];
      } else {
        let addOrTakeaway = Math.random() > 0.5;
        if (addOrTakeaway) {
          highIndex = lowIndex + Math.floor(Math.random() * ((525 - lowIndex) - 100 + 1)) + 100;
          prices = [openPrice, lowPrice, highPrice, closePrice];
          startIndex = [0, lowIndex, highIndex];
          endIndex = [lowIndex, highIndex, maxIndex];
        } else {
          highIndex = lowIndex - Math.floor(Math.random() * ((lowIndex - 75) - 100 + 1)) + 100;
          prices = [openPrice, highPrice, lowPrice, closePrice];
          startIndex = [0, highIndex, lowIndex];
          endIndex = [highIndex, lowIndex, maxIndex];
        }
      }
    
      let priceMovements = [openPrice];
    
      for (let k = 0; k < endIndex.length; k++) {
        let targetPrice = prices[k + 1];
        let startingPrice = prices[k];
    
        let firstDifference = targetPrice - startingPrice;
        let firstAvg = firstDifference / (endIndex[k] - startIndex[k]);
        let mean = firstAvg;
        let stdDev = mean + 2;
        let sample_size = 1;
    
        let price = startingPrice;
        let avgPrice = startingPrice;
        let avgPriceMovement = firstAvg;
    
        for (let i = 0; i < (endIndex[k] - startIndex[k]) - 1; i++) {
          let randomNumber;
          do {
            randomNumber = Math.random() * (stdDev * 2) - stdDev;
          } while (randomNumber < -stdDev || randomNumber > stdDev);
    
          avgPrice += avgPriceMovement;
          price = avgPrice + randomNumber;
    
          if (!((startIndex[k] === 0) && (i === 0))) {
            priceMovements.push(price.toFixed(2));
          }
        }
    
        priceMovements.push(targetPrice.toFixed(2));
      }

      return priceMovements;
}

const getBackgroundColors = () => {
    let globalData = globalFormattedData;

    let bgColors = [];

    globalData.forEach((d) => {
        let c = d["c"];
        let o = d["o"];

        let color;

        if (c >= o) {
            color = '#4ec437';
        } else {
            color = '#d31d1d';
        }

        bgColors.push(color);
    });

    return bgColors;
}



const createChart = async () => {
    let canvasElement = document.createElement('canvas');
    canvasElement.classList.add('trading-pair-chart');
    canvasContainer.appendChild(canvasElement);

    let formattedData = await getFormattedChartData();

    const dataOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }

    let lows = [];
    let highs = [];
    formattedData.forEach(fD => {
        lows.push(fD["l"]);
        highs.push(fD["h"]);
    })
    const minValue = Math.min(...lows);
    const maxValue = Math.max(...highs);

    const suggestedMin = Math.floor(minValue / 20) * 20;
    const suggestedMax = Math.ceil(maxValue / 20) * 20;

    globalPriceRange = [suggestedMin, suggestedMax];

    const lastDate = formattedData[formattedData.length - 1]["t"];
    const maxDate = new Date(lastDate);
    maxDate.setMinutes(maxDate.getMinutes() + 5);

    globalTimeRange = [formattedData[0]["t"], maxDate];

    let backgroundColors = getBackgroundColors();

    const data = {
        datasets: [{
            data: formattedData,
            borderColor: 'black',
            backgroundColor: backgroundColors,
            borderWidth: 1,
            borderSkipped: false,
        }]
        };

    const candlestick = {
        id: 'candlestick',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: {x, y} } = chart;
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333333';

            let topValues = [];
            let bottomValues = [];

            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.beginPath();
                ctx.moveTo(chart.getDatasetMeta(0).data[index].x, chart.getDatasetMeta(0).data[index].y);
                ctx.lineTo(chart.getDatasetMeta(0).data[index].x, y.getPixelForValue(datapoint.h));
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(chart.getDatasetMeta(0).data[index].x, chart.getDatasetMeta(0).data[index].y);
                ctx.lineTo(chart.getDatasetMeta(0).data[index].x, y.getPixelForValue(datapoint.l));
                ctx.stroke();

                let open = datapoint.o;
                let close = datapoint.c;
                let arrOC = [open, close];
                let max = Math.max(...arrOC);
                let min = Math.min(...arrOC);
                let topValue = y.getPixelForValue(max);
                let bottomValue = y.getPixelForValue(min);
                
                topValues.push(topValue + 25);
                bottomValues.push(bottomValue + 25);
            })

            globalCandlestickData = [topValues, bottomValues];
        }
    }

    const customScale = {
        id: 'customScale',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: {x, y} } = chart;

            ctx.save();

            let maxTick = y.max;
            let minTick = y.min;
            let maxTickPixel = y.getPixelForValue(maxTick);
            let minTickPixel = y.getPixelForValue(minTick);
            globalYValues = [438, 38];

            let lastDate;

            const datapointXDiff = x.getPixelForValue(data.datasets[0].data[1].t) - x.getPixelForValue(data.datasets[0].data[0].t);

            let xValues = [];

            data.datasets[0].data.forEach((datapoint, index) => {
                if (index == 0 || index == data.datasets[0].data.length - 1) {
                    let xValue = x.getPixelForValue(datapoint.t);
                    xValues.push(xValue);
                }
                
                let date = (datapoint.t).toLocaleString('en', dataOptions);
                
                let minute = parseInt(date.slice(-2));

                if (minute % 5 == 0) {
                    ctx.textAlign = 'center';
                    ctx.font = 'normal 16px sans-serif';
                    ctx.fillStyle = '#333333';
                    ctx.fillText(date, x.getPixelForValue(datapoint.t), bottom + 30)
                }
            });

            globalXValues = xValues;
        }
    }

    // config 
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    bottom: 30,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    display: false,
                }
            },
            parsing: {
                xAxisKey: 't',
                yAxisKey: 's',
            },
            scales: {
                x: {
                    type: 'timeseries',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'hh:mm',
                    },
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: false,
                    border: {
                        display: false,
                    },
                    grid: {
                        borderColor: '#d8d8d8',
                    },
                    ticks: { 
                        font: {
                            size: 16,
                        },
                        color: '#333333',
                    },
                    min: suggestedMin,
                    max: suggestedMax,
                }
            }
        },
        plugins: [candlestick, customScale]
        };

        // render init block
        const myChart = new Chart(
        document.querySelector('.trading-pair-chart'),
        config
        );

        const getFilteredPriceMovements = (arr) => {
            let newArr = [];
            for (let i = 0; i < arr.length; i++) {
                if (i % 10 === 0) {
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        }
        
        const createNewDataPoint = (i, newDataPoint) => {
            let d = nextFiveData[i];
            let priceMovements = getPriceMovements(i);
            let filteredPriceMovements = getFilteredPriceMovements(priceMovements);
            let updatedDataPoint = newDataPoint;
            let k = 0;
            let msInterval = window.setInterval(() => {
                let newPrice = filteredPriceMovements[k];

                updatedDataPoint["s"] = [updatedDataPoint["o"], newPrice];
                updatedDataPoint["c"] = newPrice;

                if (newPrice >= updatedDataPoint["h"]) {
                    updatedDataPoint["h"] = newPrice;
                } else if (newPrice <= updatedDataPoint["l"]) {
                    updatedDataPoint["l"] = newPrice;
                }

                if (newPrice >= updatedDataPoint["o"]) {
                    myChart.data.datasets[0].backgroundColor[myChart.data.datasets[0].data.length - 1] = "#4ec437";
                } else {
                    myChart.data.datasets[0].backgroundColor[myChart.data.datasets[0].data.length - 1] = "#d31d1d";
                }

                myChart.data.datasets[0].data[myChart.data.datasets[0].data.length - 1] = updatedDataPoint;

                let chartMax = myChart.scales['y'].max;
                let chartMin = myChart.scales['y'].min;
                let maxDiff = chartMax - updatedDataPoint["h"];
                let minDiff = chartMin - updatedDataPoint["l"];

                let newMax;
                let newMin;
                if (maxDiff < 20) {
                    newMax = Math.ceil(updatedDataPoint["h"] / 20) * 20;
                } else {
                    newMax = chartMax;
                }
                
                if (minDiff < 20) {
                    newMin = Math.floor(updatedDataPoint["l"] / 20) * 20;
                } else {
                    newMin = chartMin;
                }

                myChart.scales['y'].max = newMax;
                myChart.scales['y'].min = newMin;

                myChart.update();

                globalCurrentPrice = newPrice;

                updateOrderBook();

                k++;
                if (k >= 59) {
                    clearInterval(msInterval);
                }
            }, 1000);
        }

    window.setTimeout(() => {
        let i = 0;

        const addNewDataPoint = () => {
            let newDataPoint = { ...nextFiveData[i] };
            newDataPoint["h"] = newDataPoint["o"];
            newDataPoint["l"] = newDataPoint["o"];
            newDataPoint["c"] = newDataPoint["o"];
            newDataPoint["s"] = [newDataPoint["o"], newDataPoint["o"]];
            
            myChart.data.datasets[0].data.push(newDataPoint);
            myChart.data.datasets[0].backgroundColor.push("#4ec437");

            if (myChart.data.datasets[0].data.length >= 30) {
                myChart.data.datasets[0].data.shift();
                myChart.data.datasets[0].backgroundColor.shift();
            }
            myChart.update();

            createNewDataPoint(i, newDataPoint);
            i++;

            if (i < 5) {
                setTimeout(addNewDataPoint, 60000);
            } else {
                setTimeout(() => {
                    canvasContainer.removeChild(canvasElement);
                    canvasElement.remove();
                    createChart();
                }, 60000)
                
            }
        };

        addNewDataPoint();
    }, 500);
    
}

document.addEventListener('DOMContentLoaded', function() {
    createChart();
});


window.setInterval(() => {
    updateLastPrice();
}, 30000)

const headerElement = document.querySelector('header');
const menuBtn = document.querySelector('.trading-pair-menu-btn');
const hamburgerTradingPair = document.querySelector('.hamburger-trading-pair');
let moving = false;

const toggleFooter = () => {
    const footerElement = document.querySelector('footer');
    if (footerElement.classList.contains("active")) {
        footerElement.classList.remove("active");
        footerElement.style.display = 'none';
        footerElement.style.bottom = "-100px";
        menuBtn.style.bottom = 30 + 'px';
        moving = false;
    } else {
        footerElement.style.height = 100 + 'px';
        footerElement.classList.add("active");
        footerElement.style.display = 'flex';
        
        let bottom = -100;
        let opacity = 0;
        let menuBtnBottom = 30;

        let showFooterInterval = window.setInterval(() => {
            if (bottom > -1) {
                clearInterval(showFooterInterval);
                footerElement.style.bottom = 0 + 'px';
                footerElement.style.opacity = 1;
                menuBtn.style.bottom = 130 + 'px';
                moving = false;
            } else {
                bottom++;
                opacity++;
                menuBtnBottom++;
                footerElement.style.bottom = bottom + 'px';
                footerElement.style.opacity = opacity;
                menuBtn.style.bottom = menuBtnBottom + 'px';
            }
        }, 5);
    }
}

const toggleHeader = () => {
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (headerElement.classList.contains("active")) {
        headerElement.classList.remove("active");
        headerElement.style.display = 'none';
        menuOverlay.style.display = 'none';
        headerElement.style.top = "-100px";
    } else {
        headerElement.style.height = 100 + 'px';
        headerElement.classList.add("active");
        headerElement.style.display = 'flex';
        menuOverlay.style.display = 'flex';
        
        let top = -100;
        let opacity = 0;

        let showHeaderInterval = window.setInterval(() => {
            if (top > -1) {
                clearInterval(showHeaderInterval);
                headerElement.style.top = 0 + 'px';
                headerElement.style.opacity = 1;
                menuOverlay.style.filter = `blur(10px)`;
            } else {
                top++;
                opacity++;
                headerElement.style.top = top + 'px';
                headerElement.style.opacity = opacity;
                let blurEffect = (Math.round(opacity / 20))
                let overlayOpacity = Math.round(blurEffect / 100)
                menuOverlay.style.backgroundColor = `rgba(245, 245, 245, ${overlayOpacity})`;
                menuOverlay.style.backdropFilter = `blur(${blurEffect}px)`;
            }
        }, 5);
    }
}

const hideFooter = () => {
    const footerElement = document.querySelector('footer');
    footerElement.style.display = 'none';
    footerElement.style.bottom = '-100px';
}

const hideHeader = () => {
    let headerHeight = headerElement.offsetHeight;

    menuBtn.style.display = 'flex';

    header.style.overflow = 'hidden';

    let newHeight = headerHeight;

    let headerOpacity = 1;

    let menuBtnOpacity = 0;

    let i = 0;

    let msIncrement = Math.round((1500 / headerHeight));
    let hideHeaderInterval = setInterval(() => {
        
        if (newHeight <= 2) {
            clearInterval(hideHeaderInterval);
            headerElement.style.height = 0 + 'px';
            headerElement.style.opacity = 0;
            headerElement.style.display = 'none';
            headerElement.style.top = '-100px';
            menuBtn.style.opacity = 1;

            menuBtn.addEventListener('click', () => {
                if (!moving) {
                    moving = true;
                    hamburgerTradingPair.classList.toggle("active");
                    menuBtn.classList.toggle("active");
                    toggleHeader();
                    toggleFooter();
                }
            });
        } else {
            newHeight = (headerHeight - (1 * (i + 1)));
            headerElement.style.height = newHeight + 'px';
            headerOpacity = 1 - ((1 / headerHeight) * (i + 1));
            headerElement.style.opacity = headerOpacity;
            menuBtnOpacity = 0 + ((1 / headerHeight) * (i + 1));
            menuBtn.style.opacity = menuBtnOpacity;
            i++;
        }

    }, msIncrement);
}

document.addEventListener('DOMContentLoaded', () => {
    hideHeader();
    hideFooter();
});

const insufficientFundsBtn = document.querySelector(".insufficient-funds-btn");
const insufficientFundsBtnText = document.querySelector(".insufficient-funds-btn-text");
const buySellBtn = document.querySelector(".buy-sell-tab-btn");
const buySellBtnText = document.querySelector(".buy-sell-btn-text");

const getUserEuro = async () => {
    let response = await fetch('/get_user_data');
    let userData = await response.json();
    let euroData = userData.euro;
    let euro = 0;
    if (euroData.length > 0) {
        euro = euroData["total_amount"];
    }
    return euro;
}

const getUserAsset = async () => {
    let response = await fetch('/get_user_data');
    let userData = await response.json();
    let assetsData = userData.assets;
    let symbol = getCurrentCryptoSymbol();
    let userHasAsset = false;
    let assetIndex;
    for (let i = 0; i < assetsData.length; i++) {
        let asset = assetsData[i];
        if (asset.symbol === symbol) {
            userHasAsset = true;
            assetIndex = i;
            break;
        }
    }

    let assetAmount = 0;
    if (userHasAsset) {
        assetAmount = assetsData[assetIndex]["total_amount"];
        console.log("success");
    }
    return assetAmount;
}

const updateBuySellBtn = async (symbol) => {
    if (symbol == "EUR") {
        let euro = await getUserEuro();
        if (euro < 1) {
            buySellBtn.style.display = "none";
            insufficientFundsBtn.style.display = "flex";
        } else {
            buySellBtn.style.display = "flex";
            insufficientFundsBtn.style.display = "none";
        }
    } else {
        let amount = await getUserAsset();
        if (amount === 0) {
            buySellBtn.style.display = "none";
            insufficientFundsBtn.style.display = "flex";
        } else {
            buySellBtn.style.display = "flex";
            insufficientFundsBtn.style.display = "none";
        }
    }
}

const buyTabButton = document.querySelector(".buy-tab-heading");
const sellTabButton = document.querySelector(".sell-tab-heading");

const switchToBuyTab = async () => {
    await updateBuySellBtn("EUR");
    
    sellTabButton.classList.remove("active");
    buyTabButton.classList.add("active");

    if (buySellBtn.style.display === "flex") {
        buySellBtn.classList.remove("sell");
        buySellBtn.classList.add("buy");
        buySellBtnText.innerText = "Buy";
    }
}

const switchToSellTab = async () => {
    await updateBuySellBtn("CRYPTO");

    buyTabButton.classList.remove("active");
    sellTabButton.classList.add("active");

    if (buySellBtn.style.display === "flex") {
        buySellBtn.classList.remove("buy");
        buySellBtn.classList.add("sell");
        buySellBtnText.innerText = "Sell";
    }
}

buyTabButton.addEventListener('click', () => {
    switchToBuyTab();
});

sellTabButton.addEventListener('click', () => {
    switchToSellTab();
});

const limitOrderBtn = document.querySelector(".limit-order-btn");
const marketOrderBtn = document.querySelector(".market-order-btn");
const limitOrderContianer = document.querySelector(".limit-price-input-container");

limitOrderBtn.addEventListener('click', () => {
    marketOrderBtn.classList.remove("active");
    limitOrderBtn.classList.add("active");
    limitOrderContianer.classList.add("active");
});

marketOrderBtn.addEventListener('click', () => {
    limitOrderBtn.classList.remove("active");
    marketOrderBtn.classList.add("active");
    limitOrderContianer.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', () => {
    updateBuySellBtn("EUR");
});

const amountTotalBar = document.querySelector(".amount-total-bar");
const barOverlay = document.querySelector(".bar-overlay");
const barSlider = amountTotalBar.querySelector(".bar-slider");
const barSliderMarker = amountTotalBar.querySelector(".bar-slider-marker");

barOverlay.addEventListener("mousedown", (e) => {
    e.preventDefault();

    let barWidth = barOverlay.offsetWidth;
    let markerWidth = barSliderMarker.offsetWidth;
    
    let sliderRect = barOverlay.getBoundingClientRect();

    let initialX = e.pageX - sliderRect.left;

    barSlider.style.width = initialX + "px";

    barSliderMarker.style.left = (initialX - (markerWidth / 2)) + "px";

    const mousemoveHandler = (e) => {
        let currentX = e.pageX - sliderRect.left;

        let barWidthPercent = barWidth / 100;

        let minMax25 = [(barWidthPercent * 20), (barWidthPercent * 30), (barWidthPercent * 25)];
        let minMax50 = [(barWidthPercent * 45), (barWidthPercent * 55), (barWidthPercent * 50)];
        let minMax75 = [(barWidthPercent * 70), (barWidthPercent * 80), (barWidthPercent * 75)];

        if (currentX < 5) {
            return;
        } else if (currentX > barWidth - 5) {
            return;
        } else if (currentX > minMax25[0] && currentX < minMax25[1]) {
            barSlider.style.width = minMax25[2] + "px";
            barSliderMarker.style.left = (minMax25[2] - (markerWidth / 2)) + "px";
            console.log(currentX, minMax25);
        } else if (currentX > minMax50[0] && currentX < minMax50[1]) {
            barSlider.style.width = minMax50[2] + "px";
            barSliderMarker.style.left = (minMax50[2] - (markerWidth / 2)) + "px";
        } else if (currentX > minMax75[0] && currentX < minMax75[1]) {
            barSlider.style.width = minMax75[2] + "px";
            barSliderMarker.style.left = (minMax75[2] - (markerWidth / 2)) + "px";
        } else {
            barSlider.style.width = currentX + "px";
            barSliderMarker.style.left = (currentX - (markerWidth / 2)) + "px";
        }
    }

    document.addEventListener("mousemove", mousemoveHandler);

    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", mousemoveHandler);
    });
})








document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible') {
        window.location.reload();
    }
});