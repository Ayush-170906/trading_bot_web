function StatusBadge({ status, success }) {
  const normalized = (status || "").toUpperCase();
  let classes =
    "border border-slate-600/50 bg-slate-800/50 text-slate-400 shadow-none";

  if (!success) {
    classes =
      "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_10px_rgba(251,113,133,0.2)]";
  } else if (normalized === "FILLED") {
    classes =
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]";
  } else if (normalized === "NEW" || normalized.includes("PARTIAL")) {
    classes =
      "border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]";
  }

  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${classes}`}
    >
      {success ? status : "FAILED"}
    </span>
  );
}

export default function OrderHistory({ orders }) {
  return (
    <section className="panel-glass corner-accent p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-sans)] text-sm font-bold uppercase tracking-[0.15em] text-white">
            Order Feed
          </h2>
          <p className="mt-1 text-xs text-slate-500">Live session log</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/70">
            {orders.length} entries
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cyan-500/20 bg-black/30 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
            <svg
              className="h-8 w-8 text-cyan-500/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 002-2V7l-5-5H5a2 2 0 00-2 2v15a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="font-[family-name:var(--font-sans)] text-xs uppercase tracking-[0.2em] text-slate-500">
            Awaiting transmission
          </p>
          <p className="mt-2 text-[11px] text-slate-600">
            Executed orders will appear in this feed
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-black/40">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-cyan-500/10 bg-gradient-to-r from-cyan-950/40 to-violet-950/30 font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.15em] text-cyan-500/80">
                <th className="px-3 py-3.5 font-semibold">Time</th>
                <th className="px-3 py-3.5 font-semibold">Pair</th>
                <th className="px-3 py-3.5 font-semibold">Side</th>
                <th className="px-3 py-3.5 font-semibold">Type</th>
                <th className="px-3 py-3.5 text-right font-semibold">Qty</th>
                <th className="px-3 py-3.5 text-right font-semibold">Price</th>
                <th className="px-3 py-3.5 font-semibold">Status</th>
                <th className="px-3 py-3.5 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr
                  key={o.id}
                  className="row-glow border-b border-slate-800/50 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-slate-500">
                    {o.time}
                  </td>
                  <td className="px-3 py-3 font-semibold text-cyan-100">{o.symbol}</td>
                  <td
                    className={`px-3 py-3 font-[family-name:var(--font-sans)] text-xs font-bold tracking-wider ${
                      o.side === "BUY"
                        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        : "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]"
                    }`}
                  >
                    {o.side}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-violet-300/90">
                    {o.type}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-slate-300">
                    {o.quantity}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-slate-300">
                    {o.price}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={o.status} success={o.success} />
                    {o.error && (
                      <p
                        className="mt-1 max-w-[120px] truncate font-mono text-[10px] text-rose-400/90"
                        title={o.error}
                      >
                        {o.error}
                      </p>
                    )}
                  </td>
                  <td className="max-w-[80px] truncate px-3 py-3 font-mono text-[10px] text-slate-600">
                    {o.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
