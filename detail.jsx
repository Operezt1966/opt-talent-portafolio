// DETALLE screen — refined version of the screenshot

function DetailScreen({ ticker, setRoute, portfolio, addToPortfolio }) {
  const s = STOCKS[ticker] || STOCKS.AAPL;
  const [tf, setTf] = useState("4H");
  const inPortfolio = portfolio.includes(s.ticker);
  const positive = s.changePct >= 0;

  return (
    <div className="detail-screen" data-screen-label="Detalle">
      {/* Hero */}
      <div className="detail-hero">
        <div>
          <div className="detail-tags">
            <span className="tag cyan">LIVE QUOTE</span>
            <span className="tag">{s.exchange}</span>
            <span className="tag">{s.sector.toUpperCase()}</span>
          </div>
          <h1 className="detail-name">
            {s.name}
            <span className="ticker mono">{s.ticker}</span>
          </h1>
          <p className="detail-thesis">{s.thesis}</p>
        </div>
        <div className="detail-price">
          <div className="big mono">{fmtMoney(s.price)}</div>
          <div className={"change mono " + (positive ? "up" : "down")}>
            {positive ? "▲" : "▼"} {fmtPct(s.changePct)} hoy
          </div>
          <div className="ticker-row">
            <span className="eyebrow">Bid <span className="mono" style={{ color: "var(--text)" }}>{(s.price - 0.02).toFixed(2)}</span></span>
            <span className="eyebrow">Ask <span className="mono" style={{ color: "var(--text)" }}>{(s.price + 0.02).toFixed(2)}</span></span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Chart card */}
        <div className="card chart-card bracketed">
          <div className="card-head">
            <div>
              <div className="eyebrow">Terminal</div>
              <div className="card-title">Price stream</div>
            </div>
            <div className="toggle-group">
              {["1H","4H","1D","1W"].map(t => (
                <button key={t} className={tf === t ? "on" : ""} onClick={() => setTf(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="chart-canvas">
            <PriceChart ticker={s.ticker} height={340} />
          </div>
          <div className="chart-stats">
            <div className="stat"><div className="label">Open</div><div className="val">${s.open.toFixed(2)}</div></div>
            <div className="stat"><div className="label">High</div><div className="val">${s.high.toFixed(2)}</div></div>
            <div className="stat"><div className="label">Low</div><div className="val">${s.low.toFixed(2)}</div></div>
            <div className="stat"><div className="label">Vol</div><div className="val">{s.volume}</div></div>
          </div>
        </div>

        {/* Right column: signals + news */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card signals-card">
            <div className="card-head">
              <div>
                <div className="eyebrow">Fundamental</div>
                <div className="card-title">Key signals</div>
              </div>
            </div>
            <div className="signals-table">
              {[
                ["Market cap", s.metrics.marketCap],
                ["Volumen",    s.metrics.volume],
                ["Dividendo",  s.metrics.dividend],
                ["P/E",        s.metrics.pe],
                ["RSI",        s.metrics.rsi],
                ["Float",      s.metrics.float],
              ].map(([k, v]) => (
                <div key={k} className="signals-row">
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>
            <button
              className={"btn-primary " + (inPortfolio ? "added" : "")}
              onClick={() => !inPortfolio && addToPortfolio(s.ticker)}
              style={{ marginTop: 18 }}
            >
              {inPortfolio ? "✓ En portafolio" : "Anadir al portafolio"}
            </button>
          </div>

          <div className="card">
            <div className="news-feed-head">
              <div>
                <div className="eyebrow">Market feed</div>
                <div className="card-title">Noticias recientes</div>
              </div>
              <button className="news-link" onClick={() => setRoute("news")}>Radar completo</button>
            </div>
            {NEWS.filter(n => n.ticker === s.ticker || n.ticker === "MERCADO").slice(0, 3).map(n => (
              <div key={n.id} className="news-item">
                <div className="news-thumb"><div className={"ph " + n.phColor}></div></div>
                <div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-meta">{n.source} · {n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.DetailScreen = DetailScreen;
