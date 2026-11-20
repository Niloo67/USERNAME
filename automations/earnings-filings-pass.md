# Earnings / filings pass (research desk — leveraged safely)

Inspired by open-source “AI desk” stacks (Dexter, yfinance, edgartools, FinRobot, etc.).  
**We keep the research roles. We discard options, leverage, and lottery-call outcomes.**

> Not financial advice. Fits Niloo’s balanced-growth rules.

## What we steal vs what we reject

| Steal | Reject |
|-------|--------|
| Read **8-K / earnings releases** before promoting a sleeve name | Buying **calls** / options / leverage |
| **Bull vs bear** written debate | Star counts as proof of edge |
| Fact-check every number to a source | Sentiment / price forecasts as buy signals |
| Yahoo / filings / IR as Tier 1–2 data | “$82 → $1,200 in a week” as a repeatable model |

Reference post / video UI: `https://x.com/mika_systems/status/2118770148374905287`  
(Screenshots saved under conversation assets — “earnings-desk” graph is a **demo UI**, not required software.)

## Pipeline shown in the video (overnight loop)

```text
dexter (plan)
  → yfinance (prices / earnings dates)
  → FinGPT (headline sentiment)          ← attention only for us
  → ai-berkshire (committee debate)      ← BULL vs BEAR / READER
  → FinRobot (write-up)
  → FinanceToolkit (ratios)              ← nice-to-have, not required
  → nixtla TimeGPT (forecasts)           ← do NOT drive buys
  → quant-mind (index facts)
  → edgartools (read 10-K / 10-Q / 8-K) ← core for us
  → ai-financial-agent (fact check)
  → ≤3 picks
```

Demo artifacts named in the UI: `research_plan.md`, `earnings_dates.csv`, `premarket_sentiment.json`, `committee_votes.md`, `equity_report.pdf`, `ratios.parquet`, `revenue_forecast.csv`, `filings_index.db`, `filings_214.jsonl`, `fact_check.md`.

**Important:** the flashy graph + star counts are presentation. The durable idea is **ordered research with filings + adversarial debate + fact check**. We already do that in digests; this file makes the gate explicit. **No calls/options.**

## Role map → this repo

| Desk role (video) | Tool examples (optional) | Our agent step |
|-------------------|--------------------------|----------------|
| 01 Researcher | Dexter | Weekly Decision Agent plan |
| 02 Data desk | yfinance / Yahoo chart API | Sense (prices) — already |
| 03 News reader | FinGPT | Attention only (bottom of hierarchy) |
| 04 Committee | ai-berkshire (BULL/BEAR) | Bear case + verdict every buy |
| 05 Report writer | FinRobot | Friday explained shopping list |
| 06 Math desk | FinanceToolkit | Optional ratios; never invent |
| 07 Forecaster | nixtla TimeGPT | **Do not** use for buy decisions |
| 08 Librarian | quant-mind | Optional; digests + KB memory |
| 09 Filings clerk | edgartools / SEC / IR | **This pass** — FCF, capex, guide |
| 10 Fact checker | ai-financial-agent | Source every number; no vibes |

## When to run

- **Friday** decision report (required for any *new* single-name sleeve promote)
- **Wednesday** if a mega-cap / sleeve name printed since Sunday
- **Must-buy** only if this pass already cleared (or can be cleared same morning from a just-released 8-K)

## Checklist (per candidate ticker)

Fill before any **Buy / small add** on a single name:

```text
Ticker:
Filing / release date + source URL:
Revenue / EPS vs consensus (if available):
Free cash flow (quarter + note):
Capex / guidance language:
One bull sentence:
One bear sentence:
Fits size caps? (quality ≤3.5%, theme ≤2%, biotech ≤1.5%)
Price-soft ≠ value-soft check: (down week alone is NOT enough)
Verdict: Buy small / Hold / Skip
```

### Hard gates (examples already used)

- Hyperscaler with **Meta-repeat negative FCF** → **Skip new cash** (GOOGL Oct 2026)
- Hyperscaler **FCF-positive** + growth intact → **small sleeve only** (MSFT Oct 2026)
- Earnings **miss + guide cut** → **Skip new** until dust settles (CCJ Oct 2026)

## Output

Append a short “Filings pass” subsection in the Friday digest when sleeve names are discussed, or write:

`digests/YYYY-MM-DD-filings-pass.md` when running a dedicated earnings weekend.

## Personal vs generic

- **Generic digests** use this pass on the shared watchlist.
- **TFSA / RRSP** notes also apply concentration rules from `portfolio/niloo-*-holdings.md` — a name can clear filings and still be **Skip** if the account is already overweight.
