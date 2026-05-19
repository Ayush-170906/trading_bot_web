import { useState } from "react";

const ORDER_TYPES = ["MARKET", "LIMIT", "STOP_MARKET"];

const labelClass =
  "block font-[family-name:var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-500/80";

export default function OrderForm({ onOrderPlaced }) {
  const [symbol, setSymbol] = useState("BTCUSDT");
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
      symbol: symbol.trim().toUpperCase(),
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

      const entry = {
        id: data.orderId || `local-${Date.now()}`,
        time: new Date().toLocaleString(),
        symbol: body.symbol,
        side: body.side,
        type: orderType,
        quantity: body.quantity,
        price:
          orderType === "LIMIT"
            ? body.price
            : orderType === "STOP_MARKET"
              ? body.stop_price
              : data.avgPrice || "—",
        status: data.success ? data.status : "FAILED",
        executedQty: data.executedQty ?? "0",
        avgPrice: data.avgPrice ?? "—",
        success: data.success,
        error: data.error || "",
      };

      onOrderPlaced?.(entry);

      if (data.success) {
        setMessage({
          type: "success",
          text: `Order ${data.orderId} — ${data.status}`,
        });
      } else {
        setMessage({ type: "error", text: data.error || "Order failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-glass corner-accent p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-sans)] text-sm font-bold uppercase tracking-[0.15em] text-white">
            Execute Order
          </h2>
          <p className="mt-1 text-xs text-slate-500">Route → Binance Futures testnet</p>
        </div>
        <span className="font-mono text-[10px] text-cyan-500/60">v2.0</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Symbol</label>
          <input
            type="text"
            className="input-neon"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Side</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {["BUY", "SELL"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`rounded-lg border py-2.5 font-[family-name:var(--font-sans)] text-xs font-bold uppercase tracking-widest transition ${
                  side === s
                    ? s === "BUY"
                      ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.25)]"
                      : "border-rose-400/60 bg-rose-500/20 text-rose-300 shadow-[0_0_16px_rgba(251,113,133,0.25)]"
                    : "border-slate-700/80 bg-black/30 text-slate-500 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Type</label>
            <select
              className="input-neon cursor-pointer"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              {ORDER_TYPES.map((t) => (
                <option key={t} value={t} className="bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              className="input-neon"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        {orderType === "LIMIT" && (
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              step="any"
              min="0"
              className="input-neon"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        )}

        {orderType === "STOP_MARKET" && (
          <div>
            <label className={labelClass}>Stop price</label>
            <input
              type="number"
              step="any"
              min="0"
              className="input-neon"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={side === "BUY" ? "btn-glow-buy w-full" : "btn-glow-sell w-full"}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Transmitting…
            </span>
          ) : (
            `${side} · ${symbol}`
          )}
        </button>
      </form>

      {message && (
        <p
          role="alert"
          className={`mt-4 rounded-lg border px-3 py-2.5 font-mono text-xs ${
            message.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
              : "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.15)]"
          }`}
        >
          {message.type === "success" ? "▸ " : "✕ "}
          {message.text}
        </p>
      )}
    </section>
  );
}
