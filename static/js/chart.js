const chartContainer = document.getElementById('chart-container');

const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff',
        textColor: '#343a40',
    },
    grid: {
        vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
        },
        horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        color: '#808080',
    },
    priceScale: {
        borderColor: '#363C4E',
        minTickCount: 5, // Allow for more ticks on the y-axis
        precision: 8, // Set precision to 8 decimal places
    },
    timeScale: {
        borderColor: '#363C4E',
        timeVisible: true,
        secondsVisible: false,
    },
});

const candleSeries = chart.addCandlestickSeries();

function fetchData(symbol, timeframe) {
    fetch(`/get_data/${symbol}/${timeframe}`)
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
            updatePriceScalePrecision(formattedData); // Refresh price scale precision
        });
}

function updatePriceScalePrecision(data) {
    const prices = data.map(d => [d.open, d.high, d.low, d.close]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Adjust precision based on price range
    if (priceRange < 0.01) {
        chart.priceScale().applyOptions({ precision: 8 });
    } else if (priceRange < 1) {
        chart.priceScale().applyOptions({ precision: 4 });
    } else {
        chart.priceScale().applyOptions({ precision: 2 });
    }
}

document.getElementById('timeframe').addEventListener('change', function () {
    const symbol = document.getElementById('symbol').value;
    fetchData(symbol, this.value);
});

document.getElementById('symbol').addEventListener('change', function () {
    const timeframe = document.getElementById('timeframe').value;
    fetchData(this.value, timeframe);
});

function loadSymbols() {
    fetch('/symbols')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const symbolSelect = document.getElementById('symbol');
            data.forEach(symbol => {
                const option = document.createElement('option');
                option.value = symbol;
                option.textContent = symbol;
                symbolSelect.appendChild(option);
            });
        })
        .catch(error => {
            // Log error to a file on the server
            fetch('/log_error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ error: error.message }),
            });
        });
}

function resizeChart() {
    chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
}

window.addEventListener('resize', resizeChart);

loadSymbols();
fetchData('BTCUSDT', '15m');

const darkTheme = {
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
chart.applyOptions(darkTheme.chart);
candleSeries.applyOptions(darkTheme.series);
