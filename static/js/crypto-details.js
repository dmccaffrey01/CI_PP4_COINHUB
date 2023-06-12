/**
 * Get the last price data and the timestamp data from the views 
 */

const getChartData = async () => {
    try {
        const response = await fetch(`/crypto_detail_price_data_from_api/hour/BTC/1217/3`);
        const results = await response.json();
        return results;
        console.log(results);
      } catch (error) {
        return null;
      }
}

const formatChartData = (data) => {
    let formattedData = [];
    let lastPriceArr = [];
    let timeArr = [];
    for (let i = 0; i < data.length; i++) {
        let lastPrice = JSON.parse(data[i]['last_price']);
        let time = JSON.parse(data[i]['time']);
        lastPriceArr.push(parseFloat(lastPrice));
        timeArr.push(parseFloat(time));
    }
    formattedData.push(lastPriceArr);
    formattedData.push(timeArr);
    return formattedData
}

/**
 * Create the charts for the historical price data
 * Gets the data for the historical price and plots a chart to represent the data
 */

const data = formatChartData(getChartData());
const timestamps = data[1];
const prices = data[0];
const labels = timestamps.map(timestamp => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
});

const ctx = document.querySelector('.historical-price-chart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Price',
      data: prices,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Timestamp'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price'
        }
      }
    }
  }
});