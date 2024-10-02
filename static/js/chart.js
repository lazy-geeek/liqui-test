const chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
    width: 600,
    height: 300,
    layout: {
        backgroundColor: '#2B2B43',
        textColor: '#D9D9D9',
    },
    grid: {
        vertLines: {
            color: '#2B2B43',
        },
        horzLines: {
            color: '#363C4E',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        color: '#758696',
    },
    priceScale: {
        borderColor: '#363C4E',
    },
    timeScale: {
        borderColor: '#363C4E',
    },
});

const candleSeries = chart.addCandlestickSeries();

function fetchData(timeframe) {
    fetch(`/get_data/${timeframe}`)
        .then(response => response.json())
        .then(data => {
            const formattedData = data.map(d => ({
                time: d[0] / 1000,
                open: d[1],
                high: d[2],
                low: d[3],
                close: d[4],
            }));
            candleSeries.setData(formattedData);
        });
}

document.getElementById('timeframe').addEventListener('change', function () {
    fetchData(this.value);
});

fetchData('15m');

function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
    var switcherElement = document.createElement('div');
    switcherElement.classList.add('switcher');

    var intervalElements = items.map(function (item) {
        var itemEl = document.createElement('button');
        itemEl.innerText = item;
        itemEl.classList.add('switcher-item');
        itemEl.classList.toggle('switcher-active-item', item === activeItem);
        itemEl.addEventListener('click', function () {
            onItemClicked(item);
        });
        switcherElement.appendChild(itemEl);
        return itemEl;
    });

    function onItemClicked(item) {
        if (item === activeItem) {
            return;
        }

        intervalElements.forEach(function (element, index) {
            element.classList.toggle('switcher-active-item', items[index] === item);
        });

        activeItem = item;

        activeItemChangedCallback(item);
    }

    return switcherElement;
}

var darkTheme = {
    chart: {
        layout: {
            background: {
                type: 'solid',
                color: '#2B2B43',
            },
            lineColor: '#2B2B43',
            textColor: '#D9D9D9',
        },
        watermark: {
            color: 'rgba(0, 0, 0, 0)',
        },
        crosshair: {
            color: '#758696',
        },
        grid: {
            vertLines: {
                color: '#2B2B43',
            },
            horzLines: {
                color: '#363C4E',
            },
        },
    },
    series: {
        topColor: 'rgba(32, 226, 47, 0.56)',
        bottomColor: 'rgba(32, 226, 47, 0.04)',
        lineColor: 'rgba(32, 226, 47, 1)',
    },
};

const lightTheme = {
    chart: {
        layout: {
            background: {
                type: 'solid',
                color: '#FFFFFF',
            },
            lineColor: '#2B2B43',
            textColor: '#191919',
        },
        watermark: {
            color: 'rgba(0, 0, 0, 0)',
        },
        grid: {
            vertLines: {
                visible: false,
            },
            horzLines: {
                color: '#f0f3fa',
            },
        },
    },
    series: {
        topColor: 'rgba(33, 150, 243, 0.56)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
    },
};

var themesData = {
    Dark: darkTheme,
    Light: lightTheme,
};

function syncToTheme(theme) {
    chart.applyOptions(themesData[theme].chart);
    candleSeries.applyOptions(themesData[theme].series);
}

var switcherElement = createSimpleSwitcher(['Dark', 'Light'], 'Dark', syncToTheme);
syncToTheme('Dark');
document.getElementById('theme-switcher').appendChild(switcherElement);
