import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { placeOrder } from "../services/api";
import { ORDER_TYPES, SYMBOLS } from "../utils/constants";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20";

export default function OrderForm({ onOrderPlaced }) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [side, setSide] = useState("BUY");
  const [orderType, setOrderType] = useState("MARKET");
  const [quantity, setQuantity] = useState("0.001");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [marginMode, setMarginMode] = useState("CROSS");
  const [riskPct, setRiskPct] = useState(2);
  const [loading, setLoading] = useState(false);

  const balance = 12480.5;
  const estPrice = orderType === "LIMIT" && price ? parseFloat(price) : 68420;
  const qty = parseFloat(quantity) || 0;
  const estFees = useMemo(() => (qty * estPrice * 0.0004).toFixed(2), [qty, estPrice]);
  const liqPrice = useMemo(() => {
    const lev = parseFloat(leverage) || 10;
    const base = estPrice * (1 - 1 / lev);
    return side === "BUY" ? base.toFixed(2) : (estPrice * (1 + 1 / lev)).toFixed(2);
  }, [estPrice, leverage, side]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = {
      symbol,
      side,
      order_type: orderType,
      quantity: parseFloat(quantity),
    };
    if (orderType === "LIMIT" && price) formData.price = parseFloat(price);
    if (orderType === "STOP_MARKET" && stopPrice) formData.stop_price = parseFloat(stopPrice);

    try {
      const data = await placeOrder(formData);

      const entry = {
        id: data.orderId || `local-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        symbol: formData.symbol,
        side: formData.side,
        type: orderType,
        quantity: formData.quantity,
        price:
          orderType === "LIMIT"
            ? formData.price
            : orderType === "STOP_MARKET"
              ? formData.stop_price
              : data.avgPrice || "—",
        executedQty: data.executedQty ?? "0",
        avgPrice: data.avgPrice ?? "—",
        status: data.success ? data.status : "FAILED",
        success: data.success,
        error: data.error || "",
      };

      onOrderPlaced?.(entry);

      if (data.success) {
        toast.success(`Order ${data.orderId} — ${data.status}`);
      } else {
        toast.error(data.error || "Order failed");
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Place Order</h2>
          <p className="text-xs text-slate-500">Binance Futures testnet</p>
        </div>
        <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] text-cyan-400">
          {symbol}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Symbol</label>
          <select className={inputClass} value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => (
              <option key={s} value={s} className="bg-slate-900">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Side</label>
          <div className="grid grid-cols-2 gap-2">
            {["BUY", "SELL"].map((s) => (
              <motion.button
                key={s}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setSide(s)}
                className={`rounded-xl py-3 text-sm font-bold uppercase tracking-wider transition ${
                  side === s
                    ? s === "BUY"
                      ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/40 shadow-[0_0_24px_rgba(52,211,153,0.2)]"
                      : "bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40 shadow-[0_0_24px_rgba(251,113,133,0.2)]"
                    : "border border-white/[0.06] bg-white/[0.02] text-slate-500"
                }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Order type</label>
          <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-black/30 p-1">
            {ORDER_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                className={`flex-1 rounded-lg py-2 text-[10px] font-bold uppercase tracking-wide transition sm:text-xs ${
                  orderType === t
                    ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 shadow-inner"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              className={inputClass}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Leverage</label>
            <select className={inputClass} value={leverage} onChange={(e) => setLeverage(e.target.value)}>
              {["5", "10", "20", "50", "100"].map((l) => (
                <option key={l} value={l} className="bg-slate-900">
                  {l}x
                </option>
              ))}
            </select>
          </div>
        </div>

        {orderType === "LIMIT" && (
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              step="any"
              className={inputClass}
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
              className={inputClass}
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Margin mode</label>
            <select className={inputClass} value={marginMode} onChange={(e) => setMarginMode(e.target.value)}>
              <option value="CROSS" className="bg-slate-900">Cross</option>
              <option value="ISOLATED" className="bg-slate-900">Isolated</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Risk % — {riskPct}%</label>
            <input
              type="range"
              min="1"
              max="10"
              value={riskPct}
              onChange={(e) => setRiskPct(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.04] bg-black/30 p-3 text-xs">
          <div>
            <p className="text-slate-500">Est. liquidation</p>
            <p className="font-mono text-rose-400">${liqPrice}</p>
          </div>
          <div>
            <p className="text-slate-500">Est. fees</p>
            <p className="font-mono text-slate-300">${estFees}</p>
          </div>
          <div className="col-span-2 border-t border-white/[0.04] pt-2">
            <p className="text-slate-500">Available balance</p>
            <p className="font-mono text-emerald-400">${balance.toLocaleString()} USDT</p>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className={`relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:opacity-50 ${
            side === "BUY"
              ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]"
              : "bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400 shadow-[0_0_40px_rgba(251,113,133,0.35)]"
          }`}
        >
          <motion.span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Place Order
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}

