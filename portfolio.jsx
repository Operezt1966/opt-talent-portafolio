// PORTAFOLIO screen

function PortfolioScreen({ setTicker, setRoute, portfolio }) {
  const [perfTab, setPerfTab] = useState("3M");
  const [sortKey, setSortKey] = useState("value");
  const [sortDir, setSortDir] = useState("desc");

  // Compute derived values
  const enriched = HOLDINGS.map(h => {
    const value = h.qty * h.price;
    const cost = h.qty * h.avgCost;
    const pl = value - cost;
    const plPct = (pl / cost) * 100;
    return { ...h, value, cost, pl, plPct, owned: portfolio.includes(h.sym) };
  });

  const sorted = [...enriched].sort((a, b) => {
    const m = sortDir === "desc" ? -1 : 1;
    if (sortKey === "sym") return a.sym.localeCompare(b.sym) * m;
    if (sortKey === "change") return (a.change - b.change) * m;
    if (sortKey === "pl") return (a.plPct - b.plPct) * m;
    return (a.value - b.value) * m;
  });

  const totalValue   = enriched.reduce((s, h) => s + h.value, 0);
  const totalCost    = enriched.reduce((s, h) => s + h.cost, 0);
  const totalPL      = totalValue - totalCost;
  const totalPLPct   = (totalPL / totalCost) * 100;
  const dayChange    = enriched.reduce((s, h) => s + (h.value * h.change / 100), 0);
  const dayChangePct = (dayChange / totalValue) * 100;

  function toggleSort(k) {
    if (sortKey === k) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(k); setSortDir("desc"); }
  }

  function openTicker(t) {
    if (STOCKS[t]) {
      setTicker(t);
      setRoute("detail");
    }
  }

  return (
    <div data-screen-label="Portafolio">
      <div className="port-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Mi cartera · live</div>
          <h1>Portafolio</h1>
          <p className="sub" style={{ marginTop: 12 }}>{enriched.length} posiciones activas · ultima sincronizacion hace 12 segundos · todo P&L en USD.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost">EXPORTAR CSV</button>
          <button className="btn-ghost on">+ NUEVA POSICION</button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="metrics">
        <div className="metric bracketed">
          <div className="k">Valor total</div>
          <div className="v">{fmtMoney(totalValue, 0)}</div>
          <div className={"d " + (dayChangePct >= 0 ? "up" : "down")}>
            {dayChangePct >= 0 ? "▲" : "▼"} {fmtPct(dayChangePct)} hoy
          </div>
          <div className="spark"><Sparkline data={[10,11,10,12,11,13,12,14,13,15,14,16,15,17]} color="#00e8ff" width={200} height={28} /></div>
        </div>
        <div className="metric">
          <div className="k">Total invertido</div>
          <div className="v">{fmtMoney(totalCost, 0)}</div>
          <div className="d dim">8 posiciones</div>
          <div className="spark"><Sparkline data={[12,12,13,13,13,14,14,14,15,15,15,15,16,16]} color="#8a8aa6" width={200} height={28} /></div>
        </div>
        <div className="metric">
          <div className="k">Ganancia / Perdida</div>
          <div className={"v " + (totalPL >= 0 ? "up" : "down")}>{totalPL >= 0 ? "+" : ""}{fmtMoney(totalPL, 0)}</div>
          <div className={"d " + (totalPLPct >= 0 ? "up" : "down")}>{fmtPct(totalPLPct)} all-time</div>
          <div className="spark"><Sparkline data={[8,9,10,11,10,12,11,13,12,14,15,14,16,18]} color="#c5f538" width={200} height={28} /></div>
        </div>
        <div className="metric">
          <div className="k">Cash disponible</div>
          <div className="v mono">$28,420</div>
          <div className="d dim">10.0% de la cartera</div>
          <div className="spark"><Sparkline data={[14,14,14,14,14,14,14,14,14,14,14,14,14,14]} color="#e845c8" width={200} height={28} /></div>
        </div>
      </div>

      {/* Performance + Distribution */}
      <div className="port-grid">
        <div className="card perf-card">
          <div className="card-head">
            <div>
              <div className="eyebrow">Performance acumulada</div>
              <div className="card-title">Curva de equity</div>
            </div>
            <div className="toggle-group">
              {["1S","1M","3M","6M","1A","ALL"].map(t => (
                <button key={t} className={perfTab === t ? "on" : ""} onClick={() => setPerfTab(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="perf-canvas"><PerfChart height={260} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, paddingTop: 18, borderTop: "1px solid var(--border)", marginTop: 16 }}>
            <div className="stat"><div className="label">Retorno {perfTab}</div><div className="val up">+18.42%</div></div>
            <div className="stat"><div className="label">Vs SPX</div><div className="val up">+6.18%</div></div>
            <div className="stat"><div className="label">Sharpe</div><div className="val">1.84</div></div>
            <div className="stat"><div className="label">Max DD</div><div className="val down">-8.42%</div></div>
          </div>
        </div>

        <div className="card donut-card">
          <div className="card-head">
            <div>
              <div className="eyebrow">Asignacion</div>
              <div className="card-title">Distribucion por sector</div>
            </div>
          </div>
          <div className="donut-wrap"><Donut data={SECTOR_DIST} size={200} thickness={26} /></div>
          <div className="donut-legend">
            {SECTOR_DIST.map(s => (
              <div key={s.sector} className="donut-legend-row">
                <span className="swatch" style={{ background: s.color }}></span>
                <span className="lbl">{s.sector}</span>
                <span className="pct">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings + Watchlist */}
      <div className="port-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="eyebrow">Posiciones</div>
              <div className="card-title">Holdings</div>
            </div>
            <div className="tag cyan">{enriched.length} ACTIVAS</div>
          </div>
          <table className="holdings">
            <thead>
              <tr>
                <th onClick={() => toggleSort("sym")} style={{cursor:"pointer"}}>Ticker</th>
                <th>Nombre</th>
                <th className="r">Qty</th>
                <th className="r">Avg cost</th>
                <th className="r">Precio</th>
                <th className="r" onClick={() => toggleSort("change")} style={{cursor:"pointer"}}>Hoy</th>
                <th className="r" onClick={() => toggleSort("value")} style={{cursor:"pointer"}}>Valor</th>
                <th className="r" onClick={() => toggleSort("pl")} style={{cursor:"pointer"}}>P/L</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(h => (
                <tr key={h.sym} onClick={() => openTicker(h.sym)}>
                  <td className="sym">
                    {h.sym}
                    {h.owned && <span className="tag lime" style={{marginLeft: 6, fontSize: 8}}>+</span>}
                  </td>
                  <td className="name">{h.name}</td>
                  <td className="r">{h.qty}</td>
                  <td className="r dim">${h.avgCost.toFixed(2)}</td>
                  <td className="r">${h.price.toFixed(2)}</td>
                  <td className={"r " + (h.change >= 0 ? "up" : "down")}>{fmtPct(h.change)}</td>
                  <td className="r">${h.value.toLocaleString("en-US", {maximumFractionDigits: 0})}</td>
                  <td className={"r " + (h.pl >= 0 ? "up" : "down")}>
                    {h.pl >= 0 ? "+" : ""}${Math.abs(h.pl).toLocaleString("en-US", {maximumFractionDigits: 0})}
                    <div style={{fontSize: 10, opacity: 0.7}}>{fmtPct(h.plPct, 1)}</div>
                  </td>
                  <td className="sparkcell"><Sparkline data={h.spark} color={h.change >= 0 ? "#4ade80" : "#f87171"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="eyebrow">En la mira</div>
                <div className="card-title">Watchlist</div>
              </div>
              <button className="btn-ghost">+ ADD</button>
            </div>
            {WATCHLIST.map(w => (
              <div key={w.sym} className="watch-row" onClick={() => openTicker(w.sym)}>
                <div className="sym">{w.sym}</div>
                <div className="nm">{w.name}</div>
                <div className="px">${w.price.toFixed(2)}</div>
                <div className={"ch " + (w.change >= 0 ? "up" : "down")}>{fmtPct(w.change)}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="eyebrow">Alertas activas</div>
                <div className="card-title">Triggers</div>
              </div>
              <span className="tag magenta">3</span>
            </div>
            {[
              { sym: "AAPL", cond: "Cierre > $218", state: "en vigilancia" },
              { sym: "NVDA", cond: "RSI > 75",      state: "muy cerca" },
              { sym: "TSLA", cond: "Volumen > 120M",state: "en vigilancia" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: i === 0 ? "0" : "1px solid var(--border)" }}>
                <div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{a.sym}</div>
                  <div className="dim" style={{ fontSize: 12, marginTop: 2 }}>{a.cond}</div>
                </div>
                <div className="eyebrow" style={{ color: a.state === "muy cerca" ? "var(--warn)" : "var(--text-mute)" }}>
                  {a.state}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.PortfolioScreen = PortfolioScreen;
