from flask import Flask, render_template, jsonify, request
import ccxt
import os
import requests
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s:%(levelname)s:%(message)s",
)

LIQS_API_BASE_URL = os.getenv("LIQS_API_BASE_URL")


@app.route("/")
def index():
    return render_template("index.html")


def fetch_liquidation_data(symbol, timeframe, start_time, end_time):
    try:
        response = requests.get(
            f"{LIQS_API_BASE_URL}/liquidations",
            params={
                "symbol": symbol,
                "timeframe": timeframe,
                "start_timestamp": start_time,
                "end_timestamp": end_time,
            },
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logging.error(f"Error fetching liquidation data: {e}")
        return []


@app.route("/get_data/<symbol>/<timeframe>")
def get_data(symbol, timeframe):
    exchange = ccxt.binanceusdm()
    ohlcv = exchange.fetch_ohlcv(
        symbol, timeframe, limit=50
    )  # Fetch only the latest 50 candlesticks

    # Use Unix millisecond timestamps for liquidation data
    start_time = ohlcv[0][0]
    end_time = ohlcv[-1][0]

    liquidation_data = fetch_liquidation_data(symbol, timeframe, start_time, end_time)

    # Log the data for debugging
    logging.info(f"OHLCV Data: {ohlcv}")
    logging.info(f"Liquidation Data: {liquidation_data}")

    return jsonify({"ohlcv": ohlcv, "liquidations": liquidation_data})


@app.route("/symbols")
def symbols():
    try:
        response = requests.get(f"{LIQS_API_BASE_URL}/symbols")
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        logging.error(f"Error fetching symbols: {e}")
        return jsonify({"error": "Failed to fetch symbols"}), 500


if __name__ == "__main__":
    # Delete app.log if it exists
    if os.path.exists("app.log"):
        os.remove("app.log")
    app.run(debug=True)
