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

const lastPriceElement = document.querySelector('.last-price-text');

const updateLastPrice = () => {
    
    let currentPrice = globalCurrentPrice;
    
    lastPriceElement.innerHTML = `€${currentPrice}`;
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

                myChart.update();

                globalCurrentPrice = newPrice;

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

createChart();

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