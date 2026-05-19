import { useEffect, useState } from "react";
import { MOCK_BTC_PRICE } from "../utils/constants";

export function useMarketData() {
  const [btcPrice, setBtcPrice] = useState(MOCK_BTC_PRICE);
  const [change24h, setChange24h] = useState(2.34);

  useEffect(() => {
    const id = setInterval(() => {
      setBtcPrice((p) => {
        const delta = (Math.random() - 0.48) * 120;
        return Math.round((p + delta) * 100) / 100;
      });
      setChange24h((c) => Math.round((c + (Math.random() - 0.5) * 0.1) * 100) / 100);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return { btcPrice, change24h, sentiment: change24h >= 0 ? "Bullish" : "Bearish" };
}
