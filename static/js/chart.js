const chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
    width: 600,
    height: 300,
    layout: {
        backgroundColor: '#ffffff',
        textColor: 'rgba(0, 0, 0, 0.9)',
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
    },
    priceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
    },
    timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
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