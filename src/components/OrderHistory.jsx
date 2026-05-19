import { AnimatePresence, motion } from "framer-motion";
import { Inbox, Search } from "lucide-react";
import { useMemo, useState } from "react";

function StatusBadge({ status, success }) {
  const n = (status || "").toUpperCase();
  let cls = "bg-slate-700/50 text-slate-400 border-slate-600/50";
  if (!success) cls = "bg-rose-500/15 text-rose-400 border-rose-500/30";
  else if (n === "FILLED") cls = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  else if (n === "NEW" || n.includes("PARTIAL")) cls = "bg-amber-500/15 text-amber-400 border-amber-500/30";

  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${cls}`}>
      {success ? status : "FAILED"}
    </span>
  );
}

export default function OrderHistory({ orders }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.symbol?.toLowerCase().includes(q) ||
        String(o.id).toLowerCase().includes(q) ||
        o.side?.toLowerCase().includes(q)
    );
  }, [orders, query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card flex min-h-[420px] flex-col rounded-2xl p-5 sm:min-h-[520px] sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Order History</h2>
          <p className="text-xs text-slate-500">{orders.length} orders this session</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search symbol, ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500/40 sm:w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-black/20 py-16"
        >
          <Inbox className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">No orders to display</p>
          <p className="mt-1 text-xs text-slate-600">Place a trade to populate history</p>
        </motion.div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.06]">
          <div className="max-h-[480px] overflow-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#0d121f]/95 backdrop-blur-md">
                <tr className="border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3">Order ID</th>
                  <th className="px-3 py-3">Symbol</th>
                  <th className="px-3 py-3">Side</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3 text-right">Quantity</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Executed</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((o) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`border-b border-white/[0.04] transition ${
                        o.side === "BUY"
                          ? "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]"
                          : "bg-rose-500/[0.04] hover:bg-rose-500/[0.08]"
                      }`}
                    >
                      <td className="max-w-[100px] truncate px-3 py-3 font-mono text-[11px] text-slate-400">
                        {o.id}
                      </td>
                      <td className="px-3 py-3 font-semibold text-white">{o.symbol}</td>
                      <td
                        className={`px-3 py-3 text-xs font-bold ${
                          o.side === "BUY" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {o.side}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-violet-300/90">{o.type}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs">{o.quantity}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs">{o.price}</td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-slate-400">
                        {o.executedQty}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={o.status} success={o.success} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                        {o.timestamp}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
