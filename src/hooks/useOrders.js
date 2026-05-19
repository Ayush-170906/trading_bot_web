import { useCallback, useMemo, useState } from "react";

export function useOrders() {
  const [orders, setOrders] = useState([]);

  const addOrder = useCallback((entry) => {
    setOrders((prev) => [entry, ...prev]);
  }, []);

  const stats = useMemo(() => {
    const filled = orders.filter((o) => o.success && o.status === "FILLED").length;
    return { total: orders.length, filled };
  }, [orders]);

  return { orders, addOrder, stats };
}
