# PulseTrade — Terminal

Dashboard de trading con estilo terminal para seguimiento de acciones del mercado bursátil. Proyecto construido durante el Día 1 del Bootcamp de Claude Code.

## Demo

Abre `PulseTrade.html` directamente en el navegador — no requiere servidor ni instalación.

## Características

- **Vista de detalle** — precio en tiempo real (mock), métricas clave (P/E, RSI, market cap, volumen) y tesis de inversión por acción
- **Análisis técnico** — gráficas de precio con múltiples rangos de tiempo
- **Noticias** — feed de noticias por ticker
- **Portafolio** — gestión de watchlist personal
- **Panel de tweaks** — personalización en vivo: paleta de colores (cian, lima, magenta, violeta), densidad de UI y modo sin glow

## Acciones disponibles

| Ticker | Empresa         | Sector          |
|--------|-----------------|-----------------|
| AAPL   | Apple Inc.      | Tecnología      |
| NVDA   | NVIDIA Corp.    | Semiconductores |
| TSLA   | Tesla Inc.      | Automotriz      |
| MSFT   | Microsoft Corp. | Tecnología      |

## Tecnologías

- React 18 (CDN, sin bundler)
- Babel Standalone (JSX en el navegador)
- CSS custom properties + animaciones
- Datos mock (no requiere API key)

## Estructura

```
PulseTrade.html      # Entrada principal
app.jsx              # Componente raíz y routing
data.jsx             # Datos mock de mercado
detail.jsx           # Vista de detalle de acción
analysis.jsx         # Vista de análisis técnico
news.jsx             # Vista de noticias
portfolio.jsx        # Vista de portafolio
shared.jsx           # Componentes compartidos (TopNav, etc.)
tweaks-panel.jsx     # Panel de personalización
styles.css           # Estilos globales
```

## Uso

1. Clona el repositorio
2. Abre `PulseTrade.html` en tu navegador
3. Busca un ticker (AAPL, NVDA, TSLA, MSFT) en la barra de búsqueda
4. Navega entre las vistas con el menú superior
