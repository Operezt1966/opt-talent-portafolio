// ANALISIS screen

function AnalysisScreen({ ticker }) {
  const s = STOCKS[ticker] || STOCKS.AAPL;
  const [period, setPeriod] = useState("3M");

  const signals = [
    { kind: "bull",    title: "Cruce dorado 50/200 ema confirmado",       desc: "SMA50 cruzo sobre SMA200 hace 4 sesiones, momentum sostenido.", meta: "TECNICO · 4 D" },
    { kind: "bull",    title: "Volumen acumulando en velas verdes",       desc: "On-balance volume marcando maximos 3 meses; presion compradora.", meta: "VOLUMEN · 1 D" },
    { kind: "neutral", title: "RSI en zona alta, no sobrecomprado",       desc: "RSI 58.2 con espacio antes de techo 70; vigilar divergencia.",  meta: "MOMENTUM · 12 H" },
    { kind: "bear",    title: "Resistencia historica en $218",            desc: "Tres rechazos previos en este nivel; ruptura clean abriria $235.", meta: "PRICE ACTION · 1 D" },
    { kind: "bull",    title: "Estimaciones EPS revisadas al alza",       desc: "Consenso 7.42 vs 7.18 hace 30 dias; +3.3% en revisiones.",      meta: "FUNDAMENTAL · 6 D" },
  ];

  const fundamentals = [
    { k: "Revenue",     v: "$394B", fill: 78 },
    { k: "Net income",  v: "$99B",  fill: 64 },
    { k: "FCF",         v: "$108B", fill: 82 },
    { k: "Op margin",   v: "32.1%", fill: 68 },
    { k: "ROE",         v: "172%",  fill: 92 },
    { k: "D/E ratio",   v: "1.87",  fill: 45 },
  ];

  const peers = [
    { sym: "AAPL", chg:  1.28, mcap: 3.28, featured: true },
    { sym: "MSFT", chg:  0.84, mcap: 3.11 },
    { sym: "GOOGL",chg:  0.62, mcap: 2.24 },
    { sym: "META", chg:  1.84, mcap: 1.34 },
    { sym: "NVDA", chg:  3.42, mcap: 3.51 },
    { sym: "AMZN", chg:  0.42, mcap: 2.05 },
  ];
  const maxMcap = Math.max(...peers.map(p => p.mcap));

  return (
    <div data-screen-label="Analisis">
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{s.ticker} · Analisis</div>
          <h1>Disecando el {s.ticker.toLowerCase()}</h1>
          <p className="sub">Senales tecnicas, fundamentales y comparativos vs sector. Construido sobre data de las ultimas 90 sesiones de mercado.</p>
        </div>
        <div className="toggle-group cyan">
          {["1M","3M","6M","1A","5A"].map(t => (
            <button key={t} className={period === t ? "on" : ""} onClick={() => setPeriod(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="analysis-grid">
        {/* gauges row */}
        <div className="card col-3">
          <div className="eyebrow">Momentum</div>
          <Gauge value={58} label="RSI 14" />
        </div>
        <div className="card col-3">
          <div className="eyebrow">Volatilidad</div>
          <Gauge value={32} label="ATR pct"
            zones={[
              { from: 0,  to: 30, color: "#4ade80" },
              { from: 30, to: 60, color: "#fbbf24" },
              { from: 60, to: 100, color: "#f87171" },
            ]}
          />
        </div>
        <div className="card col-3">
          <div className="eyebrow">Tendencia</div>
          <Gauge value={74} label="ADX" />
        </div>
        <div className="card col-3">
          <div className="eyebrow">Sentiment AI</div>
          <Gauge value={68} label="Bullish score"
            zones={[
              { from: 0,  to: 35, color: "#f87171" },
              { from: 35, to: 65, color: "#fbbf24" },
              { from: 65, to: 100, color: "#00e8ff" },
            ]}
          />
        </div>

        {/* Signals list (left) */}
        <div className="card col-7">
          <div className="card-head">
            <div>
              <div className="eyebrow">Detectado por radar</div>
              <div className="card-title">Senales activas</div>
            </div>
            <span className="tag cyan">5 ACTIVAS</span>
          </div>
          {signals.map((sig, i) => (
            <div key={i} className="signal-item">
              <div className={"dot " + sig.kind}></div>
              <div className="body">
                <div className="title">{sig.title}</div>
                <div className="desc">{sig.desc}</div>
                <div className="meta">{sig.meta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Fundamentals card (right) */}
        <div className="card col-5">
          <div className="card-head">
            <div>
              <div className="eyebrow">Vs sector tecnologia</div>
              <div className="card-title">Fundamentales · LTM</div>
            </div>
          </div>
          {fundamentals.map((f, i) => (
            <div key={i} className="fund-row">
              <div className="k">{f.k}</div>
              <div className="fund-bar"><div className="fill" style={{ width: f.fill + "%" }}></div></div>
              <div className="v">{f.v}</div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className="eyebrow">EPS estimado FY26</div>
              <div className="mono" style={{ fontSize: 20, marginTop: 4 }}>$7.42</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="eyebrow">Variacion 30d</div>
              <div className="mono up" style={{ fontSize: 20, marginTop: 4 }}>+3.34%</div>
            </div>
          </div>
        </div>

        {/* Peer comparator */}
        <div className="card col-7">
          <div className="card-head">
            <div>
              <div className="eyebrow">Performance hoy · sector</div>
              <div className="card-title">Comparador de peers</div>
            </div>
            <span className="tag">6 ACCIONES</span>
          </div>
          {peers.map((p, i) => {
            const w = (p.mcap / maxMcap) * 100;
            return (
              <div key={p.sym} className={"peer-row" + (p.featured ? " featured" : "")}>
                <div className="sym">{p.sym}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: w + "%", background: p.featured ? "var(--cyan)" : "var(--magenta)" }}></div>
                </div>
                <div className="px">${p.mcap}T</div>
                <div className={"chg " + (p.chg >= 0 ? "up" : "down")}>{fmtPct(p.chg)}</div>
              </div>
            );
          })}
        </div>

        {/* MACD card */}
        <div className="card col-5">
          <div className="card-head">
            <div>
              <div className="eyebrow">Indicador tecnico</div>
              <div className="card-title">MACD · 12/26/9</div>
            </div>
            <span className="tag up">CRUCE ALCISTA</span>
          </div>
          <MacdChart />
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><div className="eyebrow">MACD</div><div className="mono" style={{ fontSize: 16, marginTop: 4 }}>+1.84</div></div>
            <div><div className="eyebrow">Signal</div><div className="mono" style={{ fontSize: 16, marginTop: 4 }}>+1.62</div></div>
            <div><div className="eyebrow">Histo</div><div className="mono up" style={{ fontSize: 16, marginTop: 4 }}>+0.22</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacdChart() {
  // synthetic MACD histogram
  const bars = [];
  let v = -1.5;
  let r = 99;
  for (let i = 0; i < 28; i++) {
    r = (r * 9301 + 49297) % 233280;
    const noise = (r / 233280 - 0.4) * 0.6;
    v += noise + Math.sin(i / 5) * 0.15;
    bars.push(v);
  }
  const w = 400, h = 120;
  const max = Math.max(...bars.map(Math.abs));
  const zero = h / 2;
  const barW = (w / bars.length) * 0.7;
  const gap = w / bars.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 120, marginTop: 12 }}>
      <line x1="0" x2={w} y1={zero} y2={zero} stroke="#25253d" strokeWidth="1" />
      {bars.map((b, i) => {
        const bh = (Math.abs(b) / max) * (h / 2 - 4);
        const x = i * gap + (gap - barW) / 2;
        const y = b >= 0 ? zero - bh : zero;
        const color = b >= 0 ? "#4ade80" : "#f87171";
        return <rect key={i} x={x} y={y} width={barW} height={bh} fill={color} opacity="0.85" />;
      })}
    </svg>
  );
}

window.AnalysisScreen = AnalysisScreen;
