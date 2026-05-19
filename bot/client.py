"""
Binance Futures Testnet REST client.

Provides a thin wrapper around the USDT-M Futures Testnet API using only
the standard library (hmac, hashlib, urllib) plus `requests`.  No third-party
Binance SDK is required, which makes the dependency surface minimal and the
code easy to audit.
"""

from __future__ import annotations

import hashlib
import hmac
import logging
import time
from typing import Any
from urllib.parse import urlencode

import requests

BASE_URL = "https://testnet.binancefuture.com"
RECV_WINDOW = 5000  # milliseconds

logger = logging.getLogger("trading_bot.client")


class BinanceClientError(Exception):
    """Raised when the Binance API returns an error response."""


class BinanceFuturesClient:
    """
    Lightweight wrapper for the Binance USDT-M Futures Testnet REST API.

    Usage:
        client = BinanceFuturesClient(api_key="...", api_secret="...")
        resp = client.place_order(symbol="BTCUSDT", side="BUY",
                                  order_type="MARKET", quantity=0.001)
    """

    def __init__(self, api_key: str, api_secret: str, timeout: int = 10) -> None:
        self._api_key = api_key
        self._api_secret = api_secret
        self._timeout = timeout
        self._session = requests.Session()
        self._session.headers.update(
            {
                "X-MBX-APIKEY": self._api_key,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        )
        logger.debug("BinanceFuturesClient initialised (base_url=%s)", BASE_URL)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _timestamp(self) -> int:
        return int(time.time() * 1000)

    def _sign(self, params: dict[str, Any]) -> str:
        """Return the HMAC-SHA256 signature for the given parameter dict."""
        query = urlencode(params)
        signature = hmac.new(
            self._api_secret.encode("utf-8"),
            query.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        logger.debug("Signing payload: %s → %s…", query[:80], signature[:16])
        return signature

    def _signed_params(self, params: dict[str, Any]) -> dict[str, Any]:
        signed = dict(params)
        signed["timestamp"] = self._timestamp()
        signed["recvWindow"] = RECV_WINDOW
        signed["signature"] = self._sign(signed)
        return signed

    def _parse_response(self, response: requests.Response) -> dict[str, Any] | list[Any]:
        logger.debug("Response status: %s", response.status_code)
        logger.debug("Response body: %s", response.text[:500])

        try:
            data = response.json()
        except ValueError:
            logger.error("Non-JSON response received: %s", response.text[:200])
            raise BinanceClientError(f"Unexpected non-JSON response: {response.text[:200]}")

        if isinstance(data, dict) and (not response.ok or ("code" in data and data["code"] != 200)):
            code = data.get("code", response.status_code)
            msg = data.get("msg", "Unknown error")
            logger.error("Binance API error %s: %s", code, msg)
            raise BinanceClientError(f"API error {code}: {msg}")

        if not response.ok:
            raise BinanceClientError(f"HTTP {response.status_code}: {response.text[:200]}")

        return data

    def _get(self, endpoint: str, params: dict[str, Any]) -> dict[str, Any] | list[Any]:
        signed = self._signed_params(params)
        url = BASE_URL + endpoint
        logger.info("GET %s | params: %s", endpoint, {k: v for k, v in signed.items() if k != "signature"})

        try:
            response = self._session.get(url, params=signed, timeout=self._timeout)
        except requests.exceptions.ConnectionError as exc:
            logger.error("Network error while reaching %s: %s", url, exc)
            raise
        except requests.exceptions.Timeout:
            logger.error("Request to %s timed out after %ds", url, self._timeout)
            raise

        return self._parse_response(response)

    def _post(self, endpoint: str, params: dict[str, Any]) -> dict[str, Any]:
        """
        Sign and POST a request to *endpoint*.

        Raises:
            BinanceClientError: if the API returns a non-2xx status or an
                                 error JSON body.
            requests.exceptions.RequestException: on network-level failures.
        """
        signed = self._signed_params(params)
        url = BASE_URL + endpoint
        logger.info("POST %s | params: %s", endpoint, {k: v for k, v in signed.items() if k != "signature"})

        try:
            response = self._session.post(url, data=signed, timeout=self._timeout)
        except requests.exceptions.ConnectionError as exc:
            logger.error("Network error while reaching %s: %s", url, exc)
            raise
        except requests.exceptions.Timeout:
            logger.error("Request to %s timed out after %ds", url, self._timeout)
            raise

        data = self._parse_response(response)
        if isinstance(data, list):
            raise BinanceClientError("Expected object response from POST")
        logger.info("Order accepted — orderId=%s status=%s", data.get("orderId"), data.get("status"))
        return data

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def place_order(
        self,
        symbol: str,
        side: str,
        order_type: str,
        quantity: float,
        price: float | None = None,
        stop_price: float | None = None,
        time_in_force: str = "GTC",
    ) -> dict[str, Any]:
        """
        Place a new order on Binance USDT-M Futures Testnet.

        Args:
            symbol:        Trading pair, e.g. BTCUSDT.
            side:          BUY or SELL.
            order_type:    MARKET, LIMIT, or STOP_MARKET.
            quantity:      Contract quantity.
            price:         Required for LIMIT orders.
            stop_price:    Required for STOP_MARKET orders.
            time_in_force: GTC / IOC / FOK (ignored for MARKET orders).

        Returns:
            Raw order response dict from Binance.
        """
        params: dict[str, Any] = {
            "symbol": symbol,
            "side": side,
            "type": order_type,
            "quantity": quantity,
        }

        if order_type == "LIMIT":
            params["price"] = price
            params["timeInForce"] = time_in_force

        if order_type == "STOP_MARKET":
            params["stopPrice"] = stop_price

        return self._post("/fapi/v1/order", params)

    def get_all_orders(self, symbol: str, limit: int = 50) -> list[dict[str, Any]]:
        """Return recent orders for *symbol* (up to *limit*, max 1000)."""
        data = self._get(
            "/fapi/v1/allOrders",
            {"symbol": symbol, "limit": min(max(limit, 1), 1000)},
        )
        if isinstance(data, dict):
            raise BinanceClientError("Expected list response from allOrders")
        return data

    def get_account_info(self) -> dict[str, Any]:
        """Return futures account information (balance, positions, etc.)."""
        data = self._get("/fapi/v2/account", {})
        if isinstance(data, list):
            raise BinanceClientError("Expected object response from account")
        return data
