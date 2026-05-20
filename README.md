# PrimeTrade AI — Binance Futures Trading Bot

A Python CLI + React web dashboard to place MARKET, LIMIT, and STOP_MARKET orders on Binance USDT-M Futures Testnet.

**Live Demo:** https://trading-bot-web-beryl.vercel.app

## Project Structure
trading_bot_web/
├── api/place_order.py       # Vercel Python serverless function
├── bot/
│   ├── client.py            # Binance REST API client (HMAC-signed)
│   ├── orders.py            # Order logic + dataclasses
│   ├── validators.py        # Input validation
│   └── logging_config.py   # Logging setup
├── cli.py                   # CLI entry point (argparse)
├── src/                     # React 19 frontend
├── logs/                    # Sample log files
└── requirements.txt

## Setup

```bash
git clone https://github.com/Ayush-170906/trading_bot_web.git
cd trading_bot_web
pip install -r requirements.txt
```

Set environment variables:
```bash
# Windows PowerShell
$env:BINANCE_API_KEY="your_testnet_api_key"
$env:BINANCE_API_SECRET="your_testnet_api_secret"
```

## CLI Usage

```bash
# Market Buy
python cli.py --symbol BTCUSDT --side BUY --type MARKET --quantity 0.01

# Limit Sell
python cli.py --symbol BTCUSDT --side SELL --type LIMIT --quantity 0.01 --price 70000

# Stop-Market (Bonus)
python cli.py --symbol BTCUSDT --side BUY --type STOP_MARKET --quantity 0.01 --stop-price 72000
```

## Web Dashboard

```bash
npm install
npm run dev
```

## Features

- MARKET, LIMIT, STOP_MARKET order types
- BUY and SELL sides
- Input validation and error handling
- Structured logging to daily log files
- Live React dashboard with order history
- Deployed on Vercel

## Assumptions

- Only USDT-M Futures Testnet supported
- timeInForce defaults to GTC for LIMIT orders
- API credentials via environment variables only