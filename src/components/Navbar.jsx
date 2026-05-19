import { motion } from "framer-motion";
import { Bitcoin, Moon, User } from "lucide-react";

export default function Navbar({ btcPrice, change24h, connected = true }) {
  const up = change24h >= 0;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B0F19]/80 backdrop-blur-xl"
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20"
          >
            <span className="font-bold text-white text-sm">P</span>
          </motion.div>
          <div>
            <h1 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              PrimeTrade AI
            </h1>
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">
              Futures Terminal
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 md:flex"
        >
          <Bitcoin className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-sm font-semibold text-white">
            ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
            {up ? "+" : ""}
            {change24h}%
          </span>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1"
            animate={{ boxShadow: connected ? ["0 0 0 rgba(52,211,153,0)", "0 0 12px rgba(52,211,153,0.25)", "0 0 0 rgba(52,211,153,0)"] : "none" }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-400 sm:inline">
              Live
            </span>
          </motion.div>

          <span className="hidden items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] text-slate-400 sm:flex">
            <Moon className="h-3 w-3" />
            Dark
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400"
          >
            <User className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

