import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("trade");

  const toggle = () => setCollapsed((c) => !c);

  return { collapsed, activeNav, setActiveNav, toggle };
}
