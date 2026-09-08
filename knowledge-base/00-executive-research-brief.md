# Executive research brief — how to build this the right way

Research summary for Niloo (Sep 2026). Goal: midweek + end-of-week digests using Google Trends, X mentions, market data, and logic — for a **balanced-growth portfolio** — plus a durable knowledge base.

> Not financial advice. Infrastructure and education research only.

## Verdict: most successful setup

**Winner for your use case = Pattern A: scheduled research agent → structured digest → email.**

| Rank | Approach | Why |
|------|----------|-----|
| **1** | **Cursor Automations + MCPs + Resend + Memories + this knowledge base** | Lowest ops for you; already in Cursor; HTTP MCPs work in cloud; Memories improve week-over-week; skill/KB keep the agent honest |
| **2** | **n8n / Make cron + Alpha Vantage/EODHD + AI summarize + Gmail/Resend** | Very common “weekend build”; deterministic fetch → AI narrative; great if you want a visual workflow UI |
| **3** | Multi-agent pipeline (CrewAI / LangGraph / critic agent) | Higher quality later; add after Pattern A runs 4–8 weeks |
| **Skip (for now)** | Kafka streaming / day-trade X firehose / auto-trading bots | Wrong risk profile for a balanced-growth investor |

### Why Pattern A wins specifically for you

1. You already use Cursor Cloud Agents.
2. You want **twice-weekly emails**, not a trading terminal.
3. Successful digests in the wild share the same shape: **deterministic data fetch → AI synthesis → email** (n8n + EODHD + Gmail/Resend is the most copied open template).
4. Production AI playbooks (n8n) stress: **don’t let AI invent prices** — fetch numbers first, then narrate. Our skill already encodes that.

### Critical design rule (academic + practitioner)

Google Trends and X are **attention / crowding sensors**, not buy signals.

- Academic work (Preis et al. claims; critiques in *Journal of Index Investing* “Big Data, Small Pickings”; arXiv 1403.1715) shows Trends signals are noisy, keyword-sensitive, and often fail once look-ahead bias is removed.
- Search spikes can mean **good news or fear** — ambiguous without news + price context.
- Therefore hierarchy is locked: **allocation → regime → fundamentals → price → Trends/X**.

## Best websites & data sources (short list)

### Must bookmark (education + allocation)

| Site | Why |
|------|-----|
| [Bogleheads investing start-up kit](https://www.bogleheads.org/wiki/Bogleheads%C2%AE_investing_start-up_kit) | Evidence-based core portfolio philosophy |
| [Bogleheads investment philosophy](https://www.bogleheads.org/wiki/Bogleheads%C2%AE_investment_philosophy) | Diversify, low cost, stay the course |
| [Damodaran Online](https://pages.stern.nyu.edu/~adamodar/) | Valuation data, equity risk premiums |
| [FRED](https://fred.stlouisfed.org) | Rates, inflation, macro regime |
| [SEC EDGAR](https://www.sec.gov/edgar) | Filings / hard facts |

### Must use in the agent (market + attention)

| Source | Role |
|--------|------|
| Yahoo Finance / FinancialMCP | Prices, sectors, news |
| Finviz | Fast US heatmaps / screens |
| Koyfin (free tier) | Deeper fundamentals when investigating a name |
| TradingView | Charts (ideas tab = social, treat cautiously) |
| Trends MCP | Google Trends + X trending feeds |
| Grok / x_search MCP | Deeper X mention themes |
| Resend | Digest email delivery |

Full tier list: [`02-data-sources.md`](02-data-sources.md).

## People worth following (and why)

### Core curriculum (start here)

| Who | Platform | What you learn |
|-----|----------|----------------|
| **Ben Felix** | YouTube + Rational Reminder podcast | Evidence-based portfolios, behavior, academic citations — best OS for a long-horizon DIY investor |
| **The Plain Bagel** (Richard Coffin) | YouTube | Clear CFA-grounded foundations / myth-busting |
| **Aswath Damodaran** | YouTube + NYU data page | How to value a company if you ever buy a stock satellite |
| **Patrick Boyle** | YouTube | Institutional skepticism; kills hype narratives |
| **Rob Berger** | YouTube / blog | Practical DIY tools, calm analysis (often recommended on Bogleheads) |

### Strong supplements

| Who | Why |
|-----|-----|
| **Paul Merriman** / Sound Investing | Long-horizon education; factor & glide-path literacy |
| **The Money Guy Show** | FOO framework — earn/save/invest system for working earners |
| **Larry Swedroe / Rick Ferri** (books + interviews) | Factor investing, evidence discipline |
| **Bogleheads forum** | Community sanity check |

### Use carefully / skip for buy ideas

- Animal Spirits / Compound → entertainment + narrative, not a plan  
- Most X “finfluencers,” Discord signal groups, leveraged-ETF lifestyle channels → **noise**

Full list: [`03-people-to-follow.md`](03-people-to-follow.md).

## Recommended “big knowledge base” shape

```text
knowledge-base/     doctrine (sources, people, signals, architecture)
.cursor/skills/     what the agent does every Wed/Fri
automations/        Cursor Automation prompt
digests/            archive → learning set
SETUP.md            human activation (keys + /automate)
```

Grow it by: after each month, mark digest ideas hit/miss in Memories and patch a KB rule if the agent was wrong.

## Activation order (after this research)

1. Read KB docs 01 → 05 (this folder).
2. Follow the 5 Tier-S educators above (even 1 video/week compounds).
3. Connect MCP keys + create Wed/Fri automation — see [`../SETUP.md`](../SETUP.md).
4. Run one test digest email before trusting the schedule.

## What “good” looks like in 90 days

- Emails arrive midweek + end of week ≥90% of weeks  
- Every idea cites a Tier 1–2 fact + optional Trends/X attention note  
- Core stays ~70–85% diversified equities; satellites stay small  
- Explicit “what NOT to chase” every digest  
- Knowledge base gained ≥1 rule improvement per month  
