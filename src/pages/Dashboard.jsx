import { motion } from "framer-motion";
import MarketWidget from "../components/MarketWidget";
import Navbar from "../components/Navbar";
import OrderForm from "../components/OrderForm";
import OrderHistory from "../components/OrderHistory";
import Sidebar from "../components/Sidebar";
import { useMarketData } from "../hooks/useMarketData";
import { useOrders } from "../hooks/useOrders";
import { useSidebar } from "../hooks/useSidebar";

export default function Dashboard() {
  const { orders, addOrder, stats } = useOrders();
  const { btcPrice, change24h, sentiment } = useMarketData();
  const sidebar = useSidebar();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B0F19]">
      <div className="pointer-events-none fixed inset-0 bg-mesh" aria-hidden />
      <motion.div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "56px 56px"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      <Navbar btcPrice={btcPrice} change24h={change24h} />

      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebar.collapsed}
          onToggle={sidebar.toggle}
          activeNav={sidebar.activeNav}
          onNavChange={sidebar.setActiveNav}
        />

        <main className="flex flex-1 flex-col overflow-y-auto lg:flex-row">
          <div className="flex flex-1 flex-col gap-4 p-4 lg:max-w-3xl lg:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden"
            >
              {[
                { label: "Orders", value: stats.total },
                { label: "Filled", value: stats.filled },
                { label: "BTC", value: `$${(btcPrice / 1000).toFixed(1)}k` },
                { label: "24h", value: `${change24h}%` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center"
                >
                  <p className="text-[10px] uppercase text-slate-500">{s.label}</p>
                  <p className="font-mono text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </motion.div>

            <OrderForm onOrderPlaced={addOrder} />
            <OrderHistory orders={orders} />
          </div>

          <aside className="hidden w-full shrink-0 border-l border-white/[0.06] bg-[#080c14]/50 p-4 lg:block lg:w-[340px] xl:w-[380px] xl:p-5">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-thin">
              <MarketWidget btcPrice={btcPrice} change24h={change24h} sentiment={sentiment} />
            </div>
          </aside>
        </main>
      </div>

      {/* Mobile bottom market strip */}
      <div className="border-t border-white/[0.06] bg-[#080c14]/90 p-3 lg:hidden">
        <MarketWidget btcPrice={btcPrice} change24h={change24h} sentiment={sentiment} />
      </div>
    </div>
  );
}
