import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { NAV_ITEMS } from "../utils/constants";

export default function Sidebar({ collapsed, onToggle, activeNav, onNavChange }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="relative z-30 hidden shrink-0 flex-col border-r border-white/[0.06] bg-[#080c14]/90 backdrop-blur-xl lg:flex"
    >
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-3">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              Menu
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={onToggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-cyan-400"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </motion.button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          const active = activeNav === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              whileHover={{ x: 2 }}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                active
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-cyan-300 shadow-[inset_0_0_20px_rgba(34,211,238,0.08)]"
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}

