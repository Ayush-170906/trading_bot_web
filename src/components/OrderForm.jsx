import { useState } from "react";

const ORDER_TYPES = ["MARKET", "LIMIT", "STOP_MARKET"];

export default function OrderForm({ symbol, onSymbolChange, onOrderPlaced }) {
  const [side, setSide] = useState("BUY");
  const [orderType, setOrderType] = useState("MARKET");
  const [quantity, setQuantity] = useState("0.001");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const body = {
      symbol,
      side,
      order_type: orderType,
      quantity: parseFloat(quantity),
    };
    if (orderType === "LIMIT" && price) body.price = parseFloat(price);
    if (orderType === "STOP_MARKET" && stopPrice) body.stop_price = parseFloat(stopPrice);

    try {
      const res = await fetch("/api/place_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `Order ${data.orderId} — ${data.status} (qty ${data.executedQty})`,
        });
        onOrderPlaced?.();
      } else {
        setMessage({ type: "error", text: data.error || data.error_message || "Order failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Place order</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Symbol
          <input
            type="text"
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            required
          />
        </label>

        <div className="row">
          <label>
            Side
            <select value={side} onChange={(e) => setSide(e.target.value)}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </label>
          <label>
            Type
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              {ORDER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Quantity
          <input
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>

        {orderType === "LIMIT" && (
          <label>
            Price
            <input
              type="number"
              step="any"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        )}

        {orderType === "STOP_MARKET" && (
          <label>
            Stop price
            <input
              type="number"
              step="any"
              min="0"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              required
            />
          </label>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Placing…" : "Place order"}
        </button>
      </form>

      {message && (
        <p className={`message message-${message.type}`} role="alert">
          {message.text}
        </p>
      )}
    </div>
  );
}
