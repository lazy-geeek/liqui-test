from flask import Flask, render_template, jsonify
import ccxt

app = Flask(__name__)

@app.route('/')
def index():
    exchange = ccxt.binanceusdm()
    ohlcv = exchange.fetch_ohlcv('BTC/USDT', timeframe='15m', limit=100)
    processed_ohlcv = [{'time': int(candle[0]) / 1000, 'open': float(candle[1]), 'high': float(candle[2]), 'low': float(candle[3]), 'close': float(candle[4])} for candle in ohlcv]
    return render_template('index.html', ohlcv=processed_ohlcv)

if __name__ == '__main__':
    app.run(debug=True)
