// Shared components and charts

const { useState, useEffect, useMemo, useRef } = React;

// ============================================
// TopNav
// ============================================
function TopNav({ route, setRoute, searchQuery, setSearchQuery, currentTicker }) {
  const links = [
    { id: "detail",    label: "Detalle" },
    { id: "analysis",  label: "Analisis" },
    { id: "news",      label: "Noticias" },
    { id: "portfolio", label: "Portafolio", cta: true },
  ];
  return (
    <header className="topnav">
      <div className="logo">
        <span className="pulse"></span>
        <span>Pulse<span className="trade">Trade</span></span>
      </div>
      <div className="search">
        <span className="search-label">Buscar<br />Ticker</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
          placeholder={currentTicker}
          spellCheck={false}
        />
        <span className="kbd">/</span>
      </div>
      <nav className="navlinks">
        {links.map((l) => (
          <button
            key={l.id}
            className={"navlink " + (l.cta ? "cta " : "") + (route === l.id ? "active" : "")}
            onClick={() => setRoute(l.id)}
          >{l.label}</button>
        ))}
      </nav>
    </header>
  );
}

// ============================================
// StatusBar
// ============================================
function StatusBar({ ticker }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  return (
    <div className="statusbar">
      <div className="live">Live · Mercado abierto · NASDAQ</div>
      <div className="right">
        <span>FOCO · {ticker}</span>
        <span>LATENCIA · 14ms</span>
        <span>{hh}:{mm}:{ss} EST</span>
      </div>
    </div>
  );
}

// ============================================
// PriceChart — line + bars combo
// ============================================
function PriceChart({ ticker, height = 360 }) {
  const series = CHART_SERIES[ticker] || CHART_SERIES.AAPL;
  const bars = VOLUME_BARS[ticker] || VOLUME_BARS.AAPL;
  const w = 800, h = height, padL = 0, padR = 0, padT = 20, padB = 30;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const min = Math.min(...series), max = Math.max(...series);
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = padL + (i / (series.length - 1)) * innerW;
    const y = padT + innerH - ((v - min) / range) * innerH * 0.85;
    return [x, y];
  });
  // smooth path via cubic-ish
  const path = pts.map((p, i) => i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`).join(" ");
  const areaPath = path + ` L ${pts[pts.length-1][0]} ${h - padB} L ${pts[0][0]} ${h - padB} Z`;

  const barW = innerW / bars.length * 0.5;
  const barGap = innerW / bars.length;

  // gridlines
  const gridY = [0.25, 0.5, 0.75].map(f => padT + innerH * f);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00e8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00e8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal grid */}
      {gridY.map((y, i) => (
        <line key={i} x1={padL} x2={w-padR} y1={y} y2={y} stroke="#1a1a2e" strokeDasharray="2 4" />
      ))}
      {/* volume bars */}
      {bars.map((b, i) => {
        const x = padL + i * barGap + (barGap - barW) / 2;
        const bh = innerH * 0.55 * b;
        const y = h - padB - bh;
        return <rect key={i} x={x} y={y} width={barW} height={bh} fill="#e845c8" opacity="0.85" />;
      })}
      {/* line area */}
      <path d={areaPath} fill="url(#lineGrad)" />
      {/* line */}
      <path d={path} fill="none" stroke="#00e8ff" strokeWidth="2.5"
        style={{ filter: "drop-shadow(0 0 6px rgba(0, 232, 255, 0.6))" }} />
      {/* last-point dot */}
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="5" fill="#00e8ff"
        style={{ filter: "drop-shadow(0 0 8px #00e8ff)" }} />
    </svg>
  );
}

// ============================================
// Sparkline — small inline chart
// ============================================
function Sparkline({ data, color = "#00e8ff", width = 80, height = 24 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height * 0.9 - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </svg>
  );
}

// ============================================
// Donut — sector distribution
// ============================================
function Donut({ data, size = 200, thickness = 30 }) {
  const r = size / 2 - thickness / 2;
  const cx = size / 2, cy = size / 2;
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cum = 0;
  const arcs = data.map((d) => {
    const start = (cum / total) * Math.PI * 2 - Math.PI / 2;
    cum += d.pct;
    const end = (cum / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + Math.cos(start) * r;
    const y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r;
    const y2 = cy + Math.sin(end) * r;
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: d.color, pct: d.pct, sector: d.sector };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((a, i) => (
        <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={thickness} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#e6e6f0"
        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 22, fontWeight: 600 }}>
        $284k
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#8a8aa6"
        style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: 2 }}>
        VALOR
      </text>
    </svg>
  );
}

// ============================================
// Gauge — RSI etc
// ============================================
function Gauge({ value, label, max = 100, zones }) {
  // semi-circle gauge
  const w = 140, h = 80;
  const cx = w / 2, cy = h - 4;
  const r = 56;
  const startA = Math.PI, endA = 0;
  const valueA = startA - (value / max) * Math.PI;
  const polar = (a) => [cx + Math.cos(a) * r, cy + Math.sin(-a) * r + 0];
  const arc = (a1, a2) => {
    const [x1, y1] = polar(a1);
    const [x2, y2] = polar(a2);
    const large = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
    const sweep = a2 < a1 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
  };
  // build zones (default: 0-30 down, 30-70 neutral, 70-100 up)
  const z = zones || [
    { from: 0,  to: 30, color: "#f87171" },
    { from: 30, to: 70, color: "#fbbf24" },
    { from: 70, to: 100, color: "#4ade80" },
  ];
  const fillColor = z.find(zn => value >= zn.from && value < zn.to)?.color || z[z.length-1].color;
  return (
    <div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* zones (track) */}
        {z.map((zn, i) => {
          const a1 = startA - (zn.from / max) * Math.PI;
          const a2 = startA - (zn.to / max) * Math.PI;
          return <path key={i} d={arc(a1, a2)} fill="none" stroke={zn.color} strokeWidth="6" opacity="0.18" />;
        })}
        {/* value */}
        <path d={arc(startA, valueA)} fill="none" stroke={fillColor} strokeWidth="6" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${fillColor})` }} />
        {/* needle */}
        <line x1={cx} y1={cy} x2={polar(valueA)[0]} y2={polar(valueA)[1]} stroke="#e6e6f0" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="3" fill="#e6e6f0" />
      </svg>
      <div className="gauge-value">{value}</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

// ============================================
// Perf chart for portfolio (area)
// ============================================
function PerfChart({ height = 240 }) {
  const w = 900, h = height;
  // generate fake portfolio value over 90 days
  const data = [];
  let v = 100;
  let r = 7;
  for (let i = 0; i < 90; i++) {
    r = (r * 9301 + 49297) % 233280;
    const noise = (r / 233280 - 0.45) * 4;
    v += noise + Math.sin(i / 10) * 1.2;
    data.push(Math.max(60, v));
  }
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const padT = 20, padB = 20;
  const innerH = h - padT - padB;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = padT + innerH - ((d - min) / range) * innerH;
    return [x, y];
  });
  const linePath = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const areaPath = linePath + ` L ${w} ${h - padB} L 0 ${h - padB} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="perfGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c5f538" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c5f538" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1="0" x2={w} y1={padT + innerH * f} y2={padT + innerH * f}
          stroke="#1a1a2e" strokeDasharray="2 4" />
      ))}
      <path d={areaPath} fill="url(#perfGrad)" />
      <path d={linePath} fill="none" stroke="#c5f538" strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 6px rgba(197, 245, 56, 0.5))" }} />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill="#c5f538"
        style={{ filter: "drop-shadow(0 0 6px #c5f538)" }} />
    </svg>
  );
}

Object.assign(window, {
  TopNav, StatusBar, PriceChart, Sparkline, Donut, Gauge, PerfChart,
});
