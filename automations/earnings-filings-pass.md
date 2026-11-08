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

Reference post (marketing claim, not a template): `https://x.com/mika_systems/status/2118770148374905287`

## Role map → this repo

| Desk role | Tool examples (optional) | Our agent step |
|-----------|--------------------------|----------------|
| Data desk | yfinance / Yahoo chart API | Already in Sense (prices) |
| Filings clerk | SEC EDGAR, company IR, edgartools | **This pass** — FCF, capex, guide |
| Researcher | Dexter-style plan | Weekly Decision Agent pipeline |
| Committee | Bull / bear personas | Bear case rule + verdict |
| Fact checker | Primary sources only | Never invent prices / Trends |
| News / FinGPT | Headlines | Attention only (bottom of hierarchy) |
| TimeGPT forecasts | — | **Do not** use for buy decisions |

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
