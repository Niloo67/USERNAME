# Data sources & websites

Prioritize **primary** sources, then reputable aggregators. Use social/trends last as attention filters.

## Tier 1 — Primary / official (trust highest)

| Source | Use for | URL |
|--------|---------|-----|
| **SEC EDGAR** | 10-K / 10-Q / 8-K filings, insider Form 4 | https://www.sec.gov/edgar |
| **FRED** | Rates, CPI, unemployment, Fed policy series | https://fred.stlouisfed.org |
| **BLS** | CPI, jobs, PPI | https://www.bls.gov |
| **Treasury / Fed** | Yield curve, policy statements | https://www.treasury.gov / federalreserve.gov |
| **Company IR pages** | Earnings decks, guidance | per-issuer |

## Tier 2 — Market data aggregators (daily digests)

| Source | Use for | Notes |
|--------|---------|-------|
| **Yahoo Finance** | Quotes, history, basic fundamentals, news | Free; good agent default |
| **Google Finance** | Quick quotes / comparison | Cross-check |
| **TradingView** | Charts, breadth, idea discovery | Free tier enough; treat “ideas” as social |
| **Finviz** | Screening (value, momentum, sector), heatmaps | Best free US visual scan |
| **Koyfin** | Deep fundamentals, estimates, global screen | Strong free/paid research terminal |
| **TIKR** | Filings-friendly research | Good free fundamental deep-dives |
| **Macrotrends** | Long fundamental history | Good for multi-year context |
| **StockAnalysis.com** | Clean statements / peers | Free tier useful |
| **Alpha Vantage** | Cleaner time series / indicators / news | Free tier rate-limited; official MCP |
| **EODHD** | Prices + news (popular in n8n digests) | Stable APIs for automation |
| **Finnhub** | News, earnings, basics | Free tier available |
| **Nasdaq Data Link** | Structured historical / alt datasets | When Yahoo isn’t enough |

## Tier 3 — Attention & narrative (Google Trends + X)

| Source | Use for | Caveat |
|--------|---------|--------|
| **Google Trends** | Search interest WoW / rising queries | Relative 0–100 scale; not absolute demand; noisy for common words |
| **Trends MCP** | Unified Google + X trending + multi-source | https://trendsmcp.ai — 100 free req/mo |
| **X via Grok / x_search MCP** | Mentions, themes, sentiment | Heavy meme bias; require quality filters |
| **Reddit** (r/investing, r/stocks) | Retail narrative | Extremely noisy; optional secondary |
| **GDELT** | Geopolitical event streams | Good macro/conflict context |

## Tier 4 — Research & education sites

| Source | Why |
|--------|-----|
| **Bogleheads wiki / forum** | Evidence-based allocation, costs, behavior |
| **Bogleheads start-up kit** | Best first read for a 30s DIY investor |
| **Aswath Damodaran data** (NYU Stern) | Equity risk premiums, industry betas, valuation datasets |
| **SSRNs / academic papers** | When checking a “strategy” claim (e.g. Trends predictability) |
| **Broker research** (Vanguard, Fidelity, Schwab) | Asset allocation frameworks |
| **Institutional outlooks** (Amundi, JPM, HSBC, VanEck, Franklin) | Regime narratives — always cross-check vs price |
| **Rob Berger / Doughroller tools** | Practical DIY portfolio tracking literacy |

## MCP / API stack mapped to tiers

| Need | MCP / tool |
|------|------------|
| Trends + top feeds | Trends MCP (`https://api.trendsmcp.ai/mcp`) |
| X depth | grok-x-search-mcp or xai-market-sentiment-mcp |
| Prices / sectors / news | `uvx financial-mcp-server` or Yahoo chart API |
| Macro | FRED via FinancialMCP env key |
| Email | Resend MCP (`https://mcp.resend.com/mcp`) |

See also: `.cursor/mcp.json.example`, `SETUP.md`.

## Source hygiene rules (for the agent)

1. Prefer Tier 1–2 for **facts** (price, filings, macro).
2. Use Tier 3 only for **attention / crowding / narrative**.
3. If Tier 3 and Tier 2 disagree → flag conflict; do not auto-promote.
4. Never invent a price, PE, or Trends score — omit or mark unavailable.
5. Timestamp every digest (“data as of …”).
