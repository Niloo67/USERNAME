---
name: portfolio-digest
description: Produce midweek and end-of-week balanced portfolio digests using Google Trends, X/Twitter mentions, market data, and logical risk scoring for an investor in their 30s. Use when generating investment research emails, watchlist updates, or scheduled portfolio summaries.
---

# Portfolio Digest Skill

Research what looks attractive to buy or hold for a **growth-balanced** investor in their 30s (moderate risk: enough equity growth to compound, not meme-stock / options speculation). Deliver a clear email-ready summary.

## Knowledge base (load first)

Before scoring ideas, read and follow:

- `knowledge-base/00-executive-research-brief.md` — setup + source priorities
- `knowledge-base/04-signal-philosophy.md` — Trends/X are attention sensors, not buy signals
- `knowledge-base/02-data-sources.md` — Tier 1–2 for facts; Tier 3 for attention
- `knowledge-base/05-architecture.md` — locked allocation policy
- `knowledge-base/03-people-to-follow.md` — evidence-based framing (Felix / Bogleheads / Damodaran)

If paths differ (no-repo automation), apply the same hierarchy from memory: **allocation → regime → fundamentals → price → Trends/X**.

## Investor profile (default)

- Age band: 30s; horizon 10–30 years
- Risk: balanced-growth — roughly **70–85% equities / 15–30% ballast** (bonds, cash-like, gold)
- Prefer liquid ETFs + quality large/mid-caps; avoid leverage, penny stocks, and pure hype
- Single-name satellite sleeve capped at ~20–25% of equities
- Not personalized financial advice; label ideas as research hypotheses

## Data gathering order

1. **Market regime** — broad indexes (SPY/VTI, QQQ, IWM), VIX if available, sector ETF performance (XLK, XLF, XLE, XLI, XLV, XLB, XLU), yields/bonds (BND or TLT/SHY)
2. **Google Trends / search interest** — stock names, sector keywords, tickers via Trends MCP or web research (daily + weekly moves, rising queries)
3. **X / social mentions** — sentiment, volume spikes, narrative themes via Grok/X MCP or Trends MCP X feed; discount pure meme pumps
4. **Fundamentals / price context** — price vs 52w range, recent earnings/news, valuation sanity (PE vs peers when available), analyst or earnings catalysts
5. **Cross-check** — only promote ideas where **trend/social attention + fundamentals + risk fit** align; flag conflicts explicitly

## Scoring rubric (0–5 each)

| Factor | What “5” means |
|--------|----------------|
| Trend momentum | Sustained Google/search interest rising WoW, not a 1-day spike |
| Social quality | Mentions rising with informed discussion, not only meme/hype |
| Fundamental setup | Reasonable growth/earnings path or clear catalyst |
| Risk fit | Fits 30s balanced sleeve (liquidity, size, diversification) |
| Crowding risk | Not already extremely crowded / euphoric (lower score if FOMO-only) |

**Action buckets**

- **Core buy/add**: strong on fundamentals + risk fit; trends supportive
- **Satellite watch / small add**: stronger trends/social but higher volatility
- **Hold / wait**: mixed signals or rich valuation
- **Avoid / trim candidate**: hype-led, weak fundamentals, or concentration risk

## Portfolio construction rules

Suggest a simple target mix unless the user overrides:

| Sleeve | Target | Examples of vehicles |
|--------|--------|----------------------|
| US core equity | 40–50% | VTI / SPY / ITOT |
| Intl equity | 15–25% | VXUS / IXUS / VEA+VWO |
| Quality / dividend ballast | 5–10% | SCHD / DGRO |
| Growth / tech tilt | 5–15% | QQQ / VGT / select mega-caps |
| Broadening / cyclicals | 0–10% | XLI, XLF, XLE, IWM (tactical) |
| Bonds / ballast | 10–20% | BND / BNDW / short Treasuries |
| Gold / diversifier | 0–5% | GLD / IAU |

Keep **3–7 actionable ideas** max per digest. Prefer ETFs for core; use single stocks only as satellites with position-size notes (e.g. 1–3% each).

## Digest types

### Midweek (Wed)

Shorter pulse:

1. Market snapshot (1–3 bullets)
2. Trend & mention movers (Google + X)
3. 2–4 ideas: add / watch / avoid
4. One risk to monitor into Friday

### End of week (Fri or Sun)

Fuller wrap:

1. Week in markets
2. What trends/social got right vs wrong
3. Updated balanced portfolio actions (buy / hold / trim)
4. Watchlist for next week
5. Memory update: what to track next run

## Output format (email body)

```text
Subject: [Midweek|Weekend] Portfolio Digest — YYYY-MM-DD

Hi Niloo —

TL;DR
- ...

Market snapshot
- ...

Trends & mentions (Google / X)
- ...

Ideas ranked for a 30s balanced-growth mix
1) TICKER — Action — Sleeve — Why (2–3 sentences) — Risk
2) ...

Suggested allocation nudges
- ...

What NOT to chase
- ...

Sources & caveats
- Not financial advice. Data as of <timestamp>. Trends ≠ guaranteed returns.
```

## Delivery

1. Prefer **Resend MCP** → email `niloo.shayan@gmail.com` (or user-specified address)
2. Fallback: **Send to Slack** if Resend unavailable
3. Always also write the digest under `digests/YYYY-MM-DD-<midweek|eow>.md` when a repo is available
4. Use **Memories** to store: prior recommendations, open watch items, user preference tweaks, false positives

## Hard constraints

- No leverage, options strategies, or “YOLO” tickers as primary recommendations
- Do not present certainty; use probabilities and conflicting evidence
- If data tools fail, say what failed and use best-effort public web research
- Never invent prices or trend numbers — omit or mark as unavailable
