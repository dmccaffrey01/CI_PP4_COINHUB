const changeTradingPairBtn = document.querySelector(".change-trading-pair-btn");
const tradeTable = document.querySelector(".crypto-trade-table-trading-pair");
const changeTradingPairBtnIcon = document.querySelector(".change-trading-pair-btn-icon");

changeTradingPairBtn.addEventListener("click", () => {
    console.log("clicked");

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
        fD["o"] = d["open"];
        fD["h"] = d["high"];
        fD["l"] = d["low"];
        fD["c"] = d["close"];
        fD["s"] = [d["open"], d["close"]];

        formattedData.push(fD);
    }

    return formattedData
}

const createChart = async () => {

    let formattedData = await getFormattedChartData();

    let lows = [];
    let highs = [];
    formattedData.forEach(fD => {
        lows.push(fD["l"]);
        highs.push(fD["h"]);
    })
    const minValue = Math.min(...lows);
    const maxValue = Math.max(...highs);
    const extraSpacing = (maxValue - minValue) / 50;

    const suggestedMin = minValue - extraSpacing;
    const suggestedMax = maxValue + extraSpacing;

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
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

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
  
      // config 
      const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
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
                    }
                },
                y: {
                    beginAtZero: false,
                    min: suggestedMin,
                    max: suggestedMax,
                }
            }
        },
        plugins: [candlestick]
      };
  
      // render init block
      const myChart = new Chart(
        document.querySelector('.trading-pair-chart'),
        config
      );
}

createChart();