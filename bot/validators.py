"""
Input validation helpers for CLI arguments.

All validators raise ValueError with a descriptive message on failure so
that the CLI layer can catch them and print a user-friendly error.
"""

from __future__ import annotations

VALID_SIDES = {"BUY", "SELL"}
VALID_ORDER_TYPES = {"MARKET", "LIMIT", "STOP_MARKET"}


def validate_symbol(symbol: str) -> str:
    """Return the symbol in upper-case or raise ValueError."""
    symbol = symbol.strip().upper()
    if not symbol.isalpha() or len(symbol) < 3:
        raise ValueError(
            f"Invalid symbol '{symbol}'. Expected a trading pair like BTCUSDT."
        )
    return symbol


def validate_side(side: str) -> str:
    """Return the side in upper-case or raise ValueError."""
    side = side.strip().upper()
    if side not in VALID_SIDES:
        raise ValueError(
            f"Invalid side '{side}'. Must be one of: {', '.join(sorted(VALID_SIDES))}."
        )
    return side


def validate_order_type(order_type: str) -> str:
    """Return the order type in upper-case or raise ValueError."""
    order_type = order_type.strip().upper()
    if order_type not in VALID_ORDER_TYPES:
        raise ValueError(
            f"Invalid order type '{order_type}'. "
            f"Must be one of: {', '.join(sorted(VALID_ORDER_TYPES))}."
        )
    return order_type


def validate_quantity(quantity: str | float) -> float:
    """Return quantity as a positive float or raise ValueError."""
    try:
        qty = float(quantity)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid quantity '{quantity}'. Must be a positive number.")
    if qty <= 0:
        raise ValueError(f"Quantity must be greater than 0, got {qty}.")
    return qty


def validate_price(price: str | float | None, order_type: str) -> float | None:
    """
    Validate price based on order type.

    - LIMIT / STOP_MARKET: price is required and must be positive.
    - MARKET: price is ignored (returns None).
    """
    order_type = order_type.strip().upper()
    if order_type == "MARKET":
        return None

    if price is None:
        raise ValueError(
            f"A price is required for {order_type} orders."
        )
    try:
        p = float(price)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid price '{price}'. Must be a positive number.")
    if p <= 0:
        raise ValueError(f"Price must be greater than 0, got {p}.")
    return p


def validate_stop_price(stop_price: str | float | None, order_type: str) -> float | None:
    """Validate stop price — only required for STOP_MARKET orders."""
    if order_type.upper() != "STOP_MARKET":
        return None
    if stop_price is None:
        raise ValueError("A stop_price is required for STOP_MARKET orders.")
    try:
        sp = float(stop_price)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid stop_price '{stop_price}'. Must be a positive number.")
    if sp <= 0:
        raise ValueError(f"stop_price must be greater than 0, got {sp}.")
    return sp
