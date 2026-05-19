import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import MiniCandlestick from "./Charts/MiniCandlestick";
import PortfolioChart from "./Charts/PortfolioChart";
import PriceLineChart from "./Charts/PriceLineChart";
import StatsCard from "./StatsCard";
import {
  MOCK_ACTIVITY,
  MOCK_CANDLES,
  MOCK_PORTFOLIO,
  MOCK_POSITIONS,
  MOCK_PRICE_HISTORY,
} from "../utils/constants";

function Panel({ title, children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -1 }}
      className={`glass-card rounded-2xl p-4 ${className}`}
    >
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export default function MarketWidget({ btcPrice, change24h, sentiment }) {
  const up = change24h >= 0;

  return (
    <div className="flex flex-col gap-4">
      <Panel title="BTCUSDT Live" delay={0.05}>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-2xl font-bold text-white">
              ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className={`mt-1 flex items-center gap-1 text-sm font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
              {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {up ? "+" : ""}
              {change24h}% 24h
            </p>
          </div>
        </div>
        <div className="mt-3 h-24">
          <PriceLineChart data={MOCK_PRICE_HISTORY} />
        </div>
      </Panel>

      <StatsCard
        title="Market sentiment"
        value={sentiment}
        sub={up ? "Momentum building" : "Risk-off flow"}
        icon="Gauge"
        trend={up ? "up" : "down"}
        delay={0.1}
      />

      <Panel title="PnL overview" delay={0.15}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
            <p className="text-[10px] uppercase text-slate-500">Unrealized</p>
            <p className="font-mono text-lg font-semibold text-emerald-400">+$718.20</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
            <p className="text-[10px] uppercase text-slate-500">Today</p>
            <p className="font-mono text-lg font-semibold text-white">+$1,240</p>
          </div>
          </div>
      </Panel>

      <Panel title="Open positions" delay={0.2}>
        <ul className="space-y-2">
          {MOCK_POSITIONS.map((p) => (
            <li
              key={p.symbol}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{p.symbol}</p>
                <p className="text-[10px] text-slate-500">{p.side} · {p.size}</p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm ${p.pnl.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                  {p.pnl}
                </p>
                <p className="text-[10px] text-slate-500">{p.roe}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Mini chart" delay={0.25}>
        <MiniCandlestick data={MOCK_CANDLES} />
      </Panel>

      <Panel title="Recent activity" delay={0.3}>
        <ul className="space-y-2">
          {MOCK_ACTIVITY.map((a) => (
            <li key={a.id} className="flex gap-2 text-xs">
              <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500/60" />
              <div>
                <p className="text-slate-300">{a.text}</p>
                <p className="text-slate-600">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Portfolio allocation" delay={0.35}>
        <PortfolioChart data={MOCK_PORTFOLIO} />
      </Panel>

      <StatsCard
        title="Available balance"
        value="$12,480.50"
        sub="USDT-M wallet"
        icon="Wallet"
        delay={0.4}
      />
    </div>
  );
}

