from flask import Flask, render_template
import ccxt

app = Flask(__name__)


@app.route("/")
def index():
    exchange = ccxt.binanceusdm()
    ohlcv = exchange.fetch_ohlcv("BTC/USDT", "15m", limit=100)
    chart_data = [
        {
            "time": candle[0] / 1000,
            "open": candle[1],
            "high": candle[2],
            "low": candle[3],
            "close": candle[4],
        }
        for candle in ohlcv
    ]

    return render_template("index.html", chart_data=chart_data)


if __name__ == "__main__":
    app.run(debug=True)
