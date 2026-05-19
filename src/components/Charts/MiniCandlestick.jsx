import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MiniCandlestick({ data }) {
  const chartData = data.map((d) => ({
    ...d,
    body: [Math.min(d.o, d.c), Math.max(d.o, d.c)],
    wick: [d.l, d.h],
    bullish: d.c >= d.o,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
          <Tooltip
            cursor={{ fill: "rgba(34,211,238,0.05)" }}
            contentStyle={{
              background: "rgba(11,15,25,0.95)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 10,
              fontSize: 11,
            }}
          />
          <Bar dataKey="c" radius={[2, 2, 0, 0]} maxBarSize={18}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.bullish ? "rgba(52,211,153,0.85)" : "rgba(251,113,133,0.85)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

