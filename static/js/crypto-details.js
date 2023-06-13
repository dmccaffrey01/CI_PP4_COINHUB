const getChartData = async () => {
    try {
      const response = await fetch(`/crypto_detail_price_data_from_api/day/BTC/1217/3`);
      const results = await response.text();
      return results;
    } catch (error) {
      return null;
    }
  };
  
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
    return formattedData;
};

function filterArray(array) {
    const filteredArray = [array[0]];
  
    for (let i = 2; i < array.length; i += 14) {
      filteredArray.push(array[i]);
    }
  
    filteredArray.push(array[array.length - 1]);
  
    return filteredArray;
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

    const ctx = document.querySelector('.historical-price-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                backgroundColor: 'transparent',
                borderColor: '#044a72',
                borderWidth: 4,
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

    const container = document.querySelector('.historical-price-chart-section-container');
    container.style.display = 'flex';
    console.log("show");
};

const loadDataAndCreateChart = async () => {
    const data = formatChartData(await getChartData());
    await createHistoricalPriceChart(data);
};

// loadDataAndCreateChart();
  