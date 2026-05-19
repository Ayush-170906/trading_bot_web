export const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "AVAXUSDT",
];

export const ORDER_TYPES = ["MARKET", "LIMIT", "STOP_MARKET"];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "trade", label: "Trade", icon: "ArrowLeftRight" },
  { id: "orders", label: "Orders", icon: "ListOrdered" },
  { id: "analytics", label: "Analytics", icon: "LineChart" },
  { id: "wallet", label: "Wallet", icon: "Wallet" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

export const MOCK_BTC_PRICE = 68420.5;

export const MOCK_CANDLES = [
  { t: "09:00", o: 67800, h: 68200, l: 67650, c: 68100 },
  { t: "10:00", o: 68100, h: 68500, l: 67900, c: 68350 },
  { t: "11:00", o: 68350, h: 68600, l: 68100, c: 68200 },
  { t: "12:00", o: 68200, h: 68800, l: 68150, c: 68650 },
  { t: "13:00", o: 68650, h: 69000, l: 68400, c: 68720 },
  { t: "14:00", o: 68720, h: 68950, l: 68300, c: 68420 },
];

export const MOCK_PRICE_HISTORY = [
  { time: "00:00", price: 67200 },
  { time: "04:00", price: 67550 },
  { time: "08:00", price: 67900 },
  { time: "12:00", price: 68200 },
  { time: "16:00", price: 68650 },
  { time: "20:00", price: 68420 },
];

export const MOCK_POSITIONS = [
  { symbol: "BTCUSDT", side: "LONG", size: "0.12", pnl: "+$842.30", roe: "+12.4%" },
  { symbol: "ETHUSDT", side: "SHORT", size: "2.5", pnl: "-$124.10", roe: "-3.2%" },
];

export const MOCK_ACTIVITY = [
  { id: 1, text: "Limit order filled — BTCUSDT", time: "2m ago", type: "success" },
  { id: 2, text: "Margin ratio updated", time: "8m ago", type: "info" },
  { id: 3, text: "Stop loss triggered — ETHUSDT", time: "24m ago", type: "warn" },
];

export const MOCK_PORTFOLIO = [
  { name: "BTC", value: 45 },
  { name: "ETH", value: 28 },
  { name: "SOL", value: 12 },
  { name: "USDT", value: 15 },
];
