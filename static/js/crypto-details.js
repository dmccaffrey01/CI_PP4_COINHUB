const historicalSectionContainer = document.querySelector('.historical-price-chart-section-container');
const historicalSectionWrapper = document.querySelector('.historical-section-container-wrapper');
const historicalPriceChartWrapper = document.querySelector('.historical-price-chart-wrapper');
const verticalLine = document.querySelector('.vertical-line');
const verticalLineContainer = document.querySelector('.vertical-line-container');
const timestampDate = document.querySelector('.timestamp-date');
const canvasContainer = document.querySelector('.historical-price-chart-container');
const chartOverlay = document.querySelector('.historical-price-chart-overlay');

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

const getTimePeriod = () => {
    let timePeriod;
    
    timePeriodBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            timePeriod = btn.getAttribute('data-time-period');
        }
    });

    return timePeriod;

}

const getFilterNum = () => {
    let num;
    
    let timePeriod = getTimePeriod();

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

const getCryptoDetailData = async () => {
    try {
      const response = await fetch(`/get_crypto_detail_json/`);
      const results = await response.json();
      return results;
    } catch (error) {
      throw error;
    }
};

const getCryptoDetailLinksData = async () => {
    let data = await getCryptoDetailData();
    let links = data['links'];
    return links;
};

const updateResourceLinks = (links) => {
    const extraContainer = document.querySelector('.extra-resource-link-container');
    const officialContainer = document.querySelector('.official-resource-link-container');
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        
        let name;
        let icon;
        if (link.type == 'whitepaper') {
            name = `White Paper - ${link.url}`;
            icon = `<i class="fa-solid fa-file"></i>`;
        } else if (link.type == 'website' && i != 0) {
            name = `${link.name} - ${link.url}`;
            icon = `<i class="fa-solid fa-globe"></i>`;
        } else if (i == 0 && link.type == 'website') {
            name = `Official Website - ${link.url}`;
            icon = `<i class="fa-solid fa-globe"></i>`;
        } else if (link.type == 'reddit') {
            name = `Reddit - ${link.url}`;
            icon = `<i class="fa-brands fa-reddit"></i>`;
        } else if (link.type == 'github') {
            name = `Github - ${link.url}`;
            icon = `<i class="fa-brands fa-github"></i>`
        } else if (link.type == 'explorer') {
            name = `Blockchain Explorer - ${link.url}`;
            icon = `<i class="fa-brands fa-hive"></i>`;
        } else if (link.type == 'telegram') {
            name = `Telegram - ${link.url}`;
            icon = `<i class="fa-brands fa-telegram"></i>`;
        } else if (link.type == 'facebook') {
            name = `Facebook - ${link.url}`;
            icon = `<i class="fa-brands fa-facebook"></i>`;
        } else if (link.type == 'instagram') {
            name = `Instagram - ${link.url}`;
            icon = `<i class="fa-brands fa-instagram"></i>`;
        } else if (link.type == 'youtube') {
            name = `Youtube - ${link.url}`;
            icon = `<i class="fa-brands fa-youtube"></i>`;
        } else if (link.type == 'twitter') {
            name = `Twitter - ${link.url}`;
            icon = `<i class="fa-brands fa-twitter"></i>`;
        } else if (link.type == 'bitcointalk') {
            name = `Bitcointalk - ${link.url}`;
            icon = `<i class="fa-brands fa-bitcoin"></i>`;
        } else if (link.type == 'linkedin') {
            name = `LinkedIn - ${link.url}`;
            icon = `<i class="fa-brands fa-linkedin"></i>`;
        } else if (link.type == 'medium') {
            name = `Medium - ${link.url}`;
            icon = `<i class="fa-brands fa-medium"></i>`;
        } else {
            name = link.url;
            icon = `<i class="fa-solid fa-globe"></i>`;
        }

        const linkContainer = document.createElement('div');

        linkContainer.innerHTML = `<a href="${link.url}" class="dark-text" target="_blank">${icon} ${name}</a>`;

        if (name == `Official Website - ${link.url}` || name == `White Paper - ${link.url}`) {
            officialContainer.appendChild(linkContainer);
        } else {
            extraContainer.appendChild(linkContainer);
        }
    }
};

(async () => {
    try {
      let links = await getCryptoDetailLinksData();
      parsedLinks = JSON.parse(links)
      updateResourceLinks(parsedLinks);
    } catch (error) {
      console.error(error);
    }
})();

const sideNavLinks = document.querySelectorAll('.side-nav-link');

window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPositionHalfWay = (viewportHeight / 2) + scrollPosition;
    
    document.querySelectorAll("section").forEach((section) => {
        const sectionTop = section.offsetTop;
        const targetScrollPosition = sectionTop;
        const sectionId = section.getAttribute("id");
        const arr = [sectionId, targetScrollPosition, scrollPositionHalfWay];
        
        if (targetScrollPosition < scrollPositionHalfWay) {
            sideNavLinks.forEach((link) => {
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }
    });

    const sideNavWrapper = document.querySelector(".side-nav-wrapper");
    if (scrollPosition <= 1 || scrollPosition + viewportHeight >= documentHeight - 1) {
        sideNavWrapper.style.height = "calc(100vh - 200px)";
    } else {
        sideNavWrapper.style.height = "100vh";
    }
});
  
loadDataAndCreateChart('1m');



