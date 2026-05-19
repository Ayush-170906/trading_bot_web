import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function StatsCard({
  title,
  value,
  sub,
  icon = "Activity",
  trend,
  className = "",
  delay = 0,
}) {
  const Icon = Icons[icon] || Icons.Activity;
  const up = trend === "up";
  const down = trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`glass-card group relative overflow-hidden rounded-2xl p-4 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-1 font-mono text-xl font-semibold text-white">{value}</p>
          {sub && (
            <p
              className={`mt-1 text-xs font-medium ${
                up ? "text-emerald-400" : down ? "text-rose-400" : "text-slate-500"
              }`}
            >
              {sub}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-cyan-400 transition group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

