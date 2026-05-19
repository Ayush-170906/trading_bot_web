"""
Order placement logic.

This module sits between the CLI layer and the raw API client.
It validates inputs, delegates to BinanceFuturesClient, and returns a
clean OrderResult dataclass that the CLI can format and display.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from bot.client import BinanceFuturesClient, BinanceClientError
from bot.validators import (
    validate_symbol,
    validate_side,
    validate_order_type,
    validate_quantity,
    validate_price,
    validate_stop_price,
)

logger = logging.getLogger("trading_bot.orders")


@dataclass
class OrderRequest:
    """Validated parameters for a single order."""

    symbol: str
    side: str
    order_type: str
    quantity: float
    price: float | None = None
    stop_price: float | None = None


@dataclass
class OrderResult:
    """Outcome of an order placement attempt."""

    success: bool
    request: OrderRequest
    raw_response: dict[str, Any] = field(default_factory=dict)
    error_message: str = ""

    # Convenience accessors populated from raw_response on success
    @property
    def order_id(self) -> str:
        return str(self.raw_response.get("orderId", "N/A"))

    @property
    def status(self) -> str:
        return self.raw_response.get("status", "N/A")

    @property
    def executed_qty(self) -> str:
        return self.raw_response.get("executedQty", "0")

    @property
    def avg_price(self) -> str:
        return self.raw_response.get("avgPrice", self.raw_response.get("price", "N/A"))


class OrderManager:
    """
    Orchestrates order validation and placement.

    Keeps the client as a dependency so it can be swapped in tests.
    """

    def __init__(self, client: BinanceFuturesClient) -> None:
        self._client = client

    def build_request(
        self,
        symbol: str,
        side: str,
        order_type: str,
        quantity: str | float,
        price: str | float | None = None,
        stop_price: str | float | None = None,
    ) -> OrderRequest:
        """
        Validate raw CLI input and return a typed OrderRequest.

        Raises:
            ValueError: with a descriptive message on any validation failure.
        """
        validated_symbol = validate_symbol(symbol)
        validated_side = validate_side(side)
        validated_order_type = validate_order_type(order_type)
        validated_quantity = validate_quantity(quantity)
        validated_price = validate_price(price, validated_order_type)
        validated_stop_price = validate_stop_price(stop_price, validated_order_type)

        return OrderRequest(
            symbol=validated_symbol,
            side=validated_side,
            order_type=validated_order_type,
            quantity=validated_quantity,
            price=validated_price,
            stop_price=validated_stop_price,
        )

    def place(self, request: OrderRequest) -> OrderResult:
        """
        Submit an OrderRequest to Binance and return an OrderResult.

        Never raises — all exceptions are caught and returned in the result
        so the CLI can decide how to present the error.
        """
        logger.info(
            "Placing %s %s order | symbol=%s qty=%s price=%s",
            request.side,
            request.order_type,
            request.symbol,
            request.quantity,
            request.price,
        )
        try:
            response = self._client.place_order(
                symbol=request.symbol,
                side=request.side,
                order_type=request.order_type,
                quantity=request.quantity,
                price=request.price,
                stop_price=request.stop_price,
            )
            logger.info("Order placed successfully — orderId=%s", response.get("orderId"))
            return OrderResult(success=True, request=request, raw_response=response)

        except BinanceClientError as exc:
            logger.error("BinanceClientError: %s", exc)
            return OrderResult(success=False, request=request, error_message=str(exc))

        except Exception as exc:  # noqa: BLE001
            logger.exception("Unexpected error during order placement: %s", exc)
            return OrderResult(
                success=False,
                request=request,
                error_message=f"Unexpected error: {exc}",
            )
