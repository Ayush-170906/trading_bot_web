from http.server import BaseHTTPRequestHandler
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from bot.client import BinanceFuturesClient
from bot.orders import OrderManager


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        client = BinanceFuturesClient(
            api_key=os.environ["BINANCE_API_KEY"],
            api_secret=os.environ["BINANCE_API_SECRET"],
        )
        manager = OrderManager(client)
        try:
            req = manager.build_request(**body)
            result = manager.place(req)
            response = {
                "success": result.success,
                "orderId": result.order_id,
                "status": result.status,
                "executedQty": result.executed_qty,
                "avgPrice": result.avg_price,
                "error": result.error_message,
            }
        except ValueError as e:
            response = {"success": False, "error": str(e)}

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
