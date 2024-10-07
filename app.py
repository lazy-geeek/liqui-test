from flask import Flask, render_template, jsonify
import ccxt
import os
import requests
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.ERROR, 
                    format='%(asctime)s:%(levelname)s:%(message)s')

LIQS_API_BASE_URL = os.getenv('LIQS_API_BASE_URL')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_data/<symbol>/<timeframe>")
def get_data(symbol, timeframe):
    exchange = ccxt.binanceusdm()
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=1000)
    return jsonify(ohlcv)

@app.route("/symbols")
def symbols():
    try:
        response = requests.get(f"{LIQS_API_BASE_URL}/symbols")
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())
    except Exception as e:
        logging.error(f"Error fetching symbols: {e}")
        return jsonify({"error": "Failed to fetch symbols"}), 500

if __name__ == "__main__":
    # Delete app.log if it exists
    if os.path.exists('app.log'):
        os.remove('app.log')
    app.run(debug=True)
