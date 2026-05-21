// NOTICIAS screen

function NewsScreen({ setRoute, setTicker }) {
  const [filter, setFilter] = useState("TODAS");
  const [sentFilter, setSentFilter] = useState(null);

  const filters = ["TODAS", "AAPL", "NVDA", "TSLA", "MSFT", "MACRO"];

  let filtered = NEWS;
  if (filter !== "TODAS") {
    filtered = filtered.filter(n => n.ticker === filter || (filter === "MACRO" && (n.ticker === "MACRO" || n.ticker === "MERCADO")));
  }
  if (sentFilter) {
    filtered = filtered.filter(n => n.sentiment === sentFilter);
  }

  const featured = filtered[0];
  const side = filtered.slice(1, 4);
  const grid = filtered.slice(4);

  function openTicker(t) {
    if (STOCKS[t]) {
      setTicker(t);
      setRoute("detail");
    }
  }

  return (
    <div data-screen-label="Noticias">
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Market radar · live</div>
          <h1>Pulso del mercado</h1>
          <p className="sub">Senales editoriales priorizadas. Sentiment inferido por cobertura, tono y precio reactivo en ventana de 30 minutos.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <div className="eyebrow">Filtrar sentiment</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className={"btn-ghost " + (sentFilter === "bull" ? "on" : "")}
              onClick={() => setSentFilter(sentFilter === "bull" ? null : "bull")}>BULL</button>
            <button className={"btn-ghost " + (sentFilter === "neut" ? "on" : "")}
              onClick={() => setSentFilter(sentFilter === "neut" ? null : "neut")}>NEUTRAL</button>
            <button className={"btn-ghost " + (sentFilter === "bear" ? "on" : "")}
              onClick={() => setSentFilter(sentFilter === "bear" ? null : "bear")}>BEAR</button>
          </div>
        </div>
      </div>

      <div className="news-filters" style={{ marginBottom: 22 }}>
        {filters.map(f => (
          <button key={f} className={"btn-ghost " + (filter === f ? "on" : "")} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {!featured ? (
        <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-mute)" }}>
          <div className="mono">SIN RESULTADOS · AJUSTA FILTROS</div>
        </div>
      ) : (
        <>
          <div className="news-grid" style={{ marginBottom: 20 }}>
            {/* Featured */}
            <div className="news-featured" onClick={() => openTicker(featured.ticker)}>
              <div className="img"><div className={"ph " + featured.phColor} data-ph={featured.ticker}></div></div>
              <div className="body">
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                    <span className={"sent " + featured.sentiment}>{
                      featured.sentiment === "bull" ? "Bullish" : featured.sentiment === "bear" ? "Bearish" : "Neutral"
                    }</span>
                    <span className="tag">{featured.ticker}</span>
                  </div>
                  <div className="title-xl">{featured.title}</div>
                  <p className="dim" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5 }}>{featured.summary}</p>
                </div>
                <div className="source-row" style={{ borderTop: "1px solid var(--border)" }}>
                  <span>{featured.source}</span>
                  <span>{featured.time}</span>
                </div>
              </div>
            </div>

            {/* Side stack */}
            <div className="news-list">
              {side.map(n => (
                <div key={n.id} className="news-side-card" onClick={() => openTicker(n.ticker)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className={"sent " + n.sentiment}>{n.sentiment === "bull" ? "Bull" : n.sentiment === "bear" ? "Bear" : "Neut"}</span>
                    <span className="tag" style={{ fontSize: 9 }}>{n.ticker}</span>
                  </div>
                  <div className="title-s">{n.title}</div>
                  <div className="meta">{n.source} · {n.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="news-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {grid.map(n => (
              <div key={n.id} className="news-card" onClick={() => openTicker(n.ticker)}>
                <div className="img"><div className={"ph " + n.phColor} data-ph={n.ticker}></div></div>
                <div className="body">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className={"sent " + n.sentiment}>{n.sentiment === "bull" ? "Bull" : n.sentiment === "bear" ? "Bear" : "Neut"}</span>
                    <span className="tag" style={{ fontSize: 9 }}>{n.ticker}</span>
                  </div>
                  <div className="title-l">{n.title}</div>
                  <p className="dim" style={{ fontSize: 12, lineHeight: 1.4 }}>{n.summary}</p>
                  <div className="source-row">
                    <span>{n.source}</span>
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

window.NewsScreen = NewsScreen;
