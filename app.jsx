// PulseTrade — root app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "cian",
  "density": "comoda",
  "glow": true
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useState("detail");
  const [ticker, setTicker] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState("");
  const [portfolio, setPortfolio] = useState(["NVDA", "MSFT"]);
  const [toast, setToast] = useState(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // search: if exact ticker match, switch
  useEffect(() => {
    if (searchQuery && STOCKS[searchQuery]) {
      setTicker(searchQuery);
      setRoute("detail");
    }
  }, [searchQuery]);

  function addToPortfolio(t) {
    setPortfolio(p => p.includes(t) ? p : [...p, t]);
    setToast(`${t} anadido al portafolio`);
    setTimeout(() => setToast(null), 2200);
  }

  // apply tweaks via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const palettes = {
      cian:    { primary: "#00e8ff", secondary: "#e845c8" },
      lima:    { primary: "#c5f538", secondary: "#00e8ff" },
      magenta: { primary: "#e845c8", secondary: "#00e8ff" },
      violeta: { primary: "#a78bfa", secondary: "#00e8ff" },
    };
    const p = palettes[t.accent] || palettes.cian;
    root.style.setProperty("--cyan", p.primary);
    root.style.setProperty("--magenta", p.secondary);
    document.body.classList.toggle("no-glow", !t.glow);
    document.body.classList.toggle("dense", t.density === "compacta");
    document.body.classList.toggle("aireada", t.density === "aireada");
  }, [t]);

  return (
    <div className="shell">
      <TopNav
        route={route}
        setRoute={setRoute}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentTicker={ticker}
      />
      <main className="main">
        {route === "detail"    && <DetailScreen    ticker={ticker} setRoute={setRoute} portfolio={portfolio} addToPortfolio={addToPortfolio} />}
        {route === "analysis"  && <AnalysisScreen  ticker={ticker} />}
        {route === "news"      && <NewsScreen      setRoute={setRoute} setTicker={setTicker} />}
        {route === "portfolio" && <PortfolioScreen setTicker={setTicker} setRoute={setRoute} portfolio={portfolio} />}
      </main>
      <StatusBar ticker={ticker} />

      {toast && (
        <div style={{
          position: "fixed", bottom: 44, left: "50%", transform: "translateX(-50%)",
          background: "var(--lime)", color: "var(--lime-ink)",
          padding: "12px 24px", fontWeight: 600,
          fontFamily: "Space Grotesk, sans-serif",
          letterSpacing: "0.04em", fontSize: 13,
          boxShadow: "0 0 24px rgba(197, 245, 56, 0.5)",
          zIndex: 100, animation: "toastIn 0.3s ease-out",
        }}>
          ✓ {toast}
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Acento primario">
          <TweakColor
            label="Color"
            value={{ cian: "#00e8ff", lima: "#c5f538", magenta: "#e845c8", violeta: "#a78bfa" }[t.accent] || "#00e8ff"}
            options={["#00e8ff","#c5f538","#e845c8","#a78bfa"]}
            onChange={(v) => {
              const map = { "#00e8ff": "cian", "#c5f538": "lima", "#e845c8": "magenta", "#a78bfa": "violeta" };
              setTweak("accent", map[v.toLowerCase()] || "cian");
            }}
          />
        </TweakSection>
        <TweakSection label="Densidad">
          <TweakRadio
            label="Layout"
            value={t.density}
            options={[
              { value: "aireada",  label: "Air" },
              { value: "comoda",   label: "Med" },
              { value: "compacta", label: "Cmp" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>
        <TweakSection label="Efectos">
          <TweakToggle label="Glow neon" value={t.glow} onChange={(v) => setTweak("glow", v)} />
        </TweakSection>
        <TweakSection label="Navegacion">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["detail","Detalle"],["analysis","Analisis"],["news","Noticias"],["portfolio","Portafolio"]].map(([r,lbl]) => (
              <button key={r}
                className={"btn-ghost " + (route === r ? "on" : "")}
                onClick={() => setRoute(r)}
                style={{ width: "100%" }}>
                {lbl.toUpperCase()}
              </button>
            ))}
          </div>
        </TweakSection>
        <TweakSection label="Ticker activo">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {Object.keys(STOCKS).map(s => (
              <button key={s}
                className={"btn-ghost " + (ticker === s ? "on" : "")}
                onClick={() => setTicker(s)}
                style={{ width: "100%" }}>{s}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
