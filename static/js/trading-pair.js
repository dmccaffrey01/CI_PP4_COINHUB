const changeTradingPairBtn = document.querySelector(".change-trading-pair-btn");
const tradeTable = document.querySelector(".crypto-trade-table-trading-pair");
const changeTradingPairBtnIcon = document.querySelector(".change-trading-pair-btn-icon");

const verticalLineContainer = document.querySelector(".crosshair-vertical-line-container");
const verticalLines = document.querySelectorAll(".vertical-line");

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

const horizontalLineContainer = document.querySelector(".crosshair-horizontal-line-container");
const horizontalLines = document.querySelectorAll(".horizontal-line");

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

const canvas = document.querySelector('.trading-pair-price-chart-wrapper');

canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    createCrosshair(30, x, y);
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

    for (let i = 30; i < data.length; i++) {
        let d = data[i];
        let fD = {};

        fD["t"] = convertTime(d["time"]);
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

    return formattedData
}

const createChart = async () => {

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

    const lastDate = formattedData[formattedData.length - 1]["t"];
    const maxDate = new Date(lastDate);
    maxDate.setMinutes(maxDate.getMinutes() + 5);


    const data = {
        datasets: [{
            data: formattedData,
            borderColor: 'black',
            backgroundColor: (ctx) => {
                const { raw: { o, c} } = ctx;
                let color;
                if (c >= o) {
                    color = '#4ec437';
                } else {
                    color = '#d31d1d';
                }
                return color;
            },
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

            data.datasets[0].data.forEach((datapoint, index) => {
                ctx.beginPath();
                ctx.moveTo(chart.getDatasetMeta(0).data[index].x, chart.getDatasetMeta(0).data[index].y);
                ctx.lineTo(chart.getDatasetMeta(0).data[index].x, y.getPixelForValue(datapoint.h));
                ctx.stroke();
    
                ctx.beginPath();
                ctx.moveTo(chart.getDatasetMeta(0).data[index].x, chart.getDatasetMeta(0).data[index].y);
                ctx.lineTo(chart.getDatasetMeta(0).data[index].x, y.getPixelForValue(datapoint.l));
                ctx.stroke();
            })
        }
    }

    const customScale = {
        id: 'customScale',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: {x, y} } = chart;

            ctx.save();

            let lastDate;

            const datapointXDiff = x.getPixelForValue(data.datasets[0].data[1].t) - x.getPixelForValue(data.datasets[0].data[0].t);

            data.datasets[0].data.forEach((datapoint, index) => {
                let date = (datapoint.t).toLocaleString('en', dataOptions);
                
                let minute = parseInt(date.slice(-2));

                if (minute % 5 == 0) {
                    ctx.textAlign = 'center';
                    ctx.font = 'normal 16px sans-serif';
                    ctx.fillStyle = '#333333';
                    ctx.fillText(date, x.getPixelForValue(datapoint.t), bottom + 30)
                    lastDate = datapoint;
                }

                if (index == data.datasets[0].data.length - 1) {
                    date = new Date(datapoint.t);
                    let minutes = date.getMinutes();
                    let newMinutes;
                    if (minutes % 5 == 0) {
                        newMinutes = minutes + 5;
                    } else {
                        newMinutes = Math.ceil(minutes / 5) * 5
                    }
                    date.setMinutes(newMinutes);
                    date = date.toLocaleString('en', dataOptions);

                    let xVal = x.getPixelForValue(lastDate.t) + (datapointXDiff * 5);

                    ctx.textAlign = 'center';
                    ctx.font = 'normal 16px sans-serif';
                    ctx.fillStyle = '#333333';
                    ctx.fillText(date, xVal, bottom + 30)
                }
            });


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
                    callbacks: {
                        beforeBody: (ctx) => {
                            const bodyArr = [
                                `O: ${ctx[0].raw.o.toFixed(2)}`,
                                `H: ${ctx[0].raw.h.toFixed(2)}`,
                                `L: ${ctx[0].raw.l.toFixed(2)}`,
                                `C: ${ctx[0].raw.c.toFixed(2)}`,
                            ]; 
                            return bodyArr;
                        },
                        label: (ctx) => {
                            return "";
                        }
                    }
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
                    max: maxDate,
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
}

createChart();