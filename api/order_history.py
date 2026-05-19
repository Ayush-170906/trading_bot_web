"""GET /api/order_history?symbol=BTCUSDT&limit=50 — recent orders."""

from __future__ import annotations

from http.server import BaseHTTPRequestHandler

from api._shared import get_client, handle_options, parse_query, send_json
from bot.validators import validate_symbol


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self) -> None:
        handle_options(self)

    def do_GET(self) -> None:
        if handle_options(self):
            return

        try:
            query = parse_query(self)
            symbol_raw = (query.get("symbol") or [""])[0]
            limit_raw = (query.get("limit") or ["50"])[0]

            symbol = validate_symbol(symbol_raw)
            limit = int(limit_raw)
            if limit < 1 or limit > 1000:
                raise ValueError("limit must be between 1 and 1000")

            client = get_client()
            orders = client.get_all_orders(symbol=symbol, limit=limit)
            orders.sort(key=lambda o: o.get("updateTime", o.get("time", 0)), reverse=True)

            send_json(
                self,
                200,
                {
                    "success": True,
                    "symbol": symbol,
                    "count": len(orders),
                    "orders": orders,
                },
            )

        except ValueError as exc:
            send_json(self, 400, {"success": False, "error": str(exc)})
        except RuntimeError as exc:
            send_json(self, 500, {"success": False, "error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            send_json(self, 500, {"success": False, "error": f"Server error: {exc}"})

    def do_POST(self) -> None:
        send_json(self, 405, {"success": False, "error": "Method not allowed. Use GET."})
