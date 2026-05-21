// PulseTrade — mock market data
// Note: using real public ticker symbols (AAPL, NVDA, etc) is factual market data,
// not branded UI. No company logos or proprietary visual identities are recreated.

const STOCKS = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Tecnologia",
    price: 213.76,
    changePct: 1.28,
    thesis: "Momentum positivo, liquidez alta y catalizadores de producto en seguimiento.",
    open: 211.08, high: 215.44, low: 209.90, volume: "61.4M",
    metrics: { marketCap: "$3.28T", volume: "61.4M", dividend: "0.49%", pe: "32.7", rsi: "58.2", float: "15.4B" },
  },
  NVDA: { ticker: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", sector: "Semiconductores",
    price: 142.86, changePct: 3.42,
    thesis: "Demanda sostenida en data center; pipeline de Blackwell en aceleracion.",
    open: 138.50, high: 144.10, low: 138.10, volume: "284.2M",
    metrics: { marketCap: "$3.51T", volume: "284.2M", dividend: "0.03%", pe: "68.4", rsi: "72.1", float: "24.6B" },
  },
  TSLA: { ticker: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotriz",
    price: 248.50, changePct: -2.15,
    thesis: "Volatilidad elevada, dependencia de catalizadores de FSD y entregas Q4.",
    open: 254.20, high: 256.80, low: 246.30, volume: "98.4M",
    metrics: { marketCap: "$792B", volume: "98.4M", dividend: "0.00%", pe: "78.2", rsi: "44.6", float: "3.18B" },
  },
  MSFT: { ticker: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", sector: "Tecnologia",
    price: 418.32, changePct: 0.84,
    thesis: "Crecimiento Azure consistente, margen operativo en expansion.",
    open: 415.10, high: 419.80, low: 414.20, volume: "21.8M",
    metrics: { marketCap: "$3.11T", volume: "21.8M", dividend: "0.72%", pe: "36.1", rsi: "61.4", float: "7.43B" },
  },
};

// generate smooth-ish price series for a chart
function genSeries(seed, n, base, vol) {
  const out = [];
  let v = base;
  let rand = seed;
  for (let i = 0; i < n; i++) {
    rand = (rand * 9301 + 49297) % 233280;
    const noise = (rand / 233280 - 0.5) * vol;
    v = v + noise + Math.sin(i / 4) * vol * 0.15;
    out.push(v);
  }
  return out;
}

const CHART_SERIES = {
  AAPL: genSeries(42, 32, 210, 1.8),
  NVDA: genSeries(17, 32, 140, 1.8),
  TSLA: genSeries(9, 32, 250, 3.5),
  MSFT: genSeries(123, 32, 416, 2.2),
};

// volume bars
const VOLUME_BARS = {
  AAPL: [0.45, 0.6, 0.42, 0.7, 0.55, 0.5, 0.75, 0.62, 0.85, 0.7, 0.92, 0.78, 0.6, 0.95],
  NVDA: [0.7, 0.85, 0.6, 0.92, 0.78, 0.88, 0.95, 0.7, 0.82, 0.92, 0.88, 0.75, 0.9, 0.98],
  TSLA: [0.85, 0.62, 0.78, 0.55, 0.72, 0.5, 0.68, 0.92, 0.55, 0.78, 0.6, 0.85, 0.72, 0.58],
  MSFT: [0.4, 0.55, 0.42, 0.6, 0.52, 0.48, 0.7, 0.58, 0.45, 0.72, 0.6, 0.55, 0.62, 0.7],
};

// News
const NEWS = [
  { id: 1, source: "MARKETWATCH", title: "Opciones de AAPL muestran mayor actividad antes de resultados", time: "HACE 18 MIN", ticker: "AAPL", sentiment: "bull", phColor: "magenta",
    summary: "Volumen inusual en strikes OTM sugiere posicionamiento bullish institucional. Skew comprimido en 30 dias." },
  { id: 2, source: "CNBC", title: "Analistas elevan precio objetivo por crecimiento de servicios", time: "HACE 49 MIN", ticker: "AAPL", sentiment: "bull", phColor: "cyan",
    summary: "Morgan Stanley revisa target a $260 citando margen de servicios y monetizacion AI on-device." },
  { id: 3, source: "REUTERS", title: "Cadena de suministro anticipa ciclo de renovacion mas fuerte", time: "HACE 1 H", ticker: "AAPL", sentiment: "neut", phColor: "magenta",
    summary: "Fuentes en Taiwan reportan pedidos componentes 18% arriba YoY para Q1 calendario." },
  { id: 4, source: "BLOOMBERG", title: "NVIDIA expande capacidad de Blackwell tras demanda excedente", time: "HACE 2 H", ticker: "NVDA", sentiment: "bull", phColor: "cyan",
    summary: "Acuerdo con TSMC asegura wafer allocation extra para H2. Backlog reportado en 12+ meses." },
  { id: 5, source: "WSJ", title: "Tesla retrasa entregas Cybercab por validacion de FSD", time: "HACE 3 H", ticker: "TSLA", sentiment: "bear", phColor: "magenta",
    summary: "Reguladores piden datos adicionales sobre comportamiento en interseccion sin senales." },
  { id: 6, source: "FT", title: "Microsoft consolida Azure como referente de inferencia enterprise", time: "HACE 4 H", ticker: "MSFT", sentiment: "bull", phColor: "lime",
    summary: "Cuotas anuales firmadas con tres financieros tier-1 superan $1B segun fuentes." },
  { id: 7, source: "BARRONS", title: "Rotacion sectorial favorece nombres con flujo libre positivo", time: "HACE 5 H", ticker: "MERCADO", sentiment: "neut", phColor: "cyan",
    summary: "Buy-the-dip persiste en tech megacap. Small-caps continuan underperform vs SPX." },
  { id: 8, source: "REUTERS", title: "Fed minutes apuntan a pausa con sesgo dovish hacia Q1", time: "HACE 6 H", ticker: "MACRO", sentiment: "bull", phColor: "lime",
    summary: "Comite mayoritario favorece mantener tasas; dot plot sugiere 2 cortes para 2026." },
  { id: 9, source: "MARKETWATCH", title: "Volumen institucional en AAPL toca maximo de 6 meses", time: "HACE 7 H", ticker: "AAPL", sentiment: "bull", phColor: "magenta",
    summary: "Block trades agregados superan 18M acciones; net flow positivo segun dark pool data." },
];

// Portfolio holdings
const HOLDINGS = [
  { sym: "AAPL", name: "Apple Inc.",      qty: 124, avgCost: 178.40, price: 213.76, change: 1.28, sector: "Tecnologia",      spark: [10,11,10,12,11,13,12,14,13,15,14,16,15,17] },
  { sym: "NVDA", name: "NVIDIA Corp.",    qty: 86,  avgCost: 98.50,  price: 142.86, change: 3.42, sector: "Semiconductores", spark: [8,9,10,9,11,10,12,11,13,14,13,15,14,16] },
  { sym: "MSFT", name: "Microsoft Corp.", qty: 42,  avgCost: 380.10, price: 418.32, change: 0.84, sector: "Tecnologia",      spark: [12,11,12,13,12,13,14,13,14,15,14,15,14,15] },
  { sym: "TSLA", name: "Tesla Inc.",      qty: 35,  avgCost: 265.20, price: 248.50, change: -2.15, sector: "Automotriz",     spark: [15,14,13,14,12,13,11,12,10,11,10,9,10,9] },
  { sym: "AMD",  name: "AMD Inc.",        qty: 60,  avgCost: 142.30, price: 165.42, change: 2.18, sector: "Semiconductores", spark: [9,10,9,11,10,12,11,13,12,14,13,12,14,13] },
  { sym: "GOOGL",name: "Alphabet Inc.",   qty: 28,  avgCost: 165.80, price: 178.94, change: 0.62, sector: "Tecnologia",      spark: [12,12,13,12,13,13,14,13,14,14,13,14,14,15] },
  { sym: "AMZN", name: "Amazon.com Inc.", qty: 22,  avgCost: 185.20, price: 196.84, change: 0.42, sector: "Consumo",         spark: [11,12,11,12,12,13,12,13,13,13,12,13,13,14] },
  { sym: "META", name: "Meta Platforms",  qty: 18,  avgCost: 478.00, price: 532.18, change: 1.84, sector: "Tecnologia",      spark: [10,11,10,12,11,13,12,14,13,14,14,15,14,16] },
];

const WATCHLIST = [
  { sym: "COIN", name: "Coinbase",        price: 245.80, change:  4.20 },
  { sym: "PLTR", name: "Palantir",        price:  62.45, change:  2.15 },
  { sym: "ARM",  name: "ARM Holdings",    price: 132.18, change: -1.08 },
  { sym: "SHOP", name: "Shopify",         price: 108.42, change:  0.85 },
  { sym: "NET",  name: "Cloudflare",      price:  98.76, change: -0.42 },
];

const SECTOR_DIST = [
  { sector: "Tecnologia",      pct: 42, color: "#00e8ff" },
  { sector: "Semiconductores", pct: 28, color: "#e845c8" },
  { sector: "Automotriz",      pct:  9, color: "#c5f538" },
  { sector: "Consumo",         pct: 11, color: "#a78bfa" },
  { sector: "Cash",            pct: 10, color: "#4a4a66" },
];

// Helpers
function fmtMoney(n, decimals = 2) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtPct(n, decimals = 2) {
  const s = n >= 0 ? "+" : "";
  return s + n.toFixed(decimals) + "%";
}

Object.assign(window, {
  STOCKS, CHART_SERIES, VOLUME_BARS, NEWS, HOLDINGS, WATCHLIST, SECTOR_DIST,
  fmtMoney, fmtPct,
});
