import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22d3ee", "#8b5cf6", "#34d399", "#64748b"];

export default function PortfolioChart({ data }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={62}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(11,15,25,0.95)",
              border: "1px solid rgba(34,211,238,0.2)",
              borderRadius: 10,
              fontSize: 11,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {data.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
            {d.name} {d.value}%
          </span>
        ))}
      </div>
    </motion.div>
  );
}

