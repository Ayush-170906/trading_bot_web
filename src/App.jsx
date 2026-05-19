import { useState } from "react";
import OrderForm from "./components/OrderForm.jsx";
import OrderHistory from "./components/OrderHistory.jsx";

export default function App() {
  const [orders, setOrders] = useState([]);

  function handleOrderPlaced(entry) {
    setOrders((prev) => [entry, ...prev]);
  }

  const filled = orders.filter((o) => o.success && o.status === "FILLED").length;

  return (
    <div className="scanlines relative min-h-screen overflow-hidden">
      <div className="bg-grid pointer-events-none fixed inset-0" aria-hidden />
      <div className="orb orb-cyan left-[-10%] top-[10%] h-80 w-80" aria-hidden />
      <div className="orb orb-violet right-[-5%] top-[40%] h-96 w-96" aria-hidden />
      <div
        className="orb orb-cyan bottom-[5%] left-[30%] h-64 w-64 opacity-20"
        aria-hidden
      />

      <header className="relative z-10 border-b border-cyan-500/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
              <svg
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13h2l3-9 4 18 4-18 3 9h2"
                />
              </svg>
            </div>
            <div>
              <h1 className="title-shimmer font-[family-name:var(--font-sans)] text-xl font-bold tracking-wider sm:text-2xl">
                NEXUS TRADE
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Binance Futures · Testnet Terminal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-black/50 px-3 py-2 sm:flex">
              <span className="pulse-dot" />
              <span className="text-xs uppercase tracking-wider text-slate-400">
                System online
              </span>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-center">
              <p className="font-mono text-lg font-semibold text-violet-300">{orders.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Orders</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-center">
              <p className="font-mono text-lg font-semibold text-emerald-300">{filled}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Filled</p>
            </div>
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.15em] text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
              TESTNET
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2 lg:items-start">
        <OrderForm onOrderPlaced={handleOrderPlaced} />
        <OrderHistory orders={orders} />
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-4 text-center text-[10px] uppercase tracking-[0.25em] text-slate-600">
        No real funds · API secured server-side
      </footer>
    </div>
  );
}
