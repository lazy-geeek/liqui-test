var chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
    width: 800,
    height: 600,
    layout: {
        backgroundColor: '#000000',
        textColor: 'rgba(255, 255, 255, 0.9)',
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

var candleSeries = chart.addCandlestickSeries({
    upColor: 'rgba(0, 255, 0, 1)',
    downColor: 'rgba(255, 0, 0, 1)',
    borderDownColor: 'rgba(255, 0, 0, 1)',
    borderUpColor: 'rgba(0, 255, 0, 1)',
    wickDownColor: 'rgba(255, 0, 0, 1)',
    wickUpColor: 'rgba(0, 255, 0, 1)',
});

candleSeries.setData(chartData);
