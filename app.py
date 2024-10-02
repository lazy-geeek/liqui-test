from flask import Flask, render_template, jsonify
import ccxt

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_data/<timeframe>")
def get_data(timeframe):
    exchange = ccxt.binanceusdm()
    ohlcv = exchange.fetch_ohlcv("BTC/USDT", timeframe, limit=100)
    return jsonify(ohlcv)


if __name__ == "__main__":
    app.run(debug=True)
