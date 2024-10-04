const chartContainer = document.getElementById('chart-container');

const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff', /* Updated background color */
        textColor: '#343a40', /* Updated text color */
    },
    grid: {
        vertLines: {
            color: 'rgba(197, 203, 206, 0.5)', /* Updated color and added transparency */
        },
        horzLines: {
            color: 'rgba(197, 203, 206, 0.5)', /* Updated color and added transparency */
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        color: '#808080', /* Updated color */
    },
    priceScale: {
        borderColor: '#363C4E',
    },
    timeScale: {
        borderColor: '#363C4E',
        timeVisible: true,
        secondsVisible: false,
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


function resizeChart() {
    chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
}

window.addEventListener('resize', resizeChart);

fetchData('15m');


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
