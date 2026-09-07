# Portfolio Research Knowledge Base

A durable knowledge base for building **midweek + end-of-week** investment digests that combine:

- Google Trends / search interest
- X (Twitter) mentions & sentiment
- Market prices + fundamentals
- Logical risk scoring for a **balanced-growth portfolio in your 30s**

This is **research infrastructure**, not personalized financial advice.

## Read in this order

| # | Doc | What you’ll learn |
|---|-----|-------------------|
| 1 | [Successful setup patterns](01-successful-setup-patterns.md) | What actually works for automated research systems |
| 2 | [Data sources & websites](02-data-sources.md) | Primary vs secondary sources; free/paid tiers |
| 3 | [People & channels to follow](03-people-to-follow.md) | Educators worth trusting (and who to ignore) |
| 4 | [Signal philosophy](04-signal-philosophy.md) | How to use Trends/X without fooling yourself |
| 5 | [System architecture](05-architecture.md) | The “big” stack: Cursor Automation + MCPs + knowledge base |

## Related project files

- `.cursor/skills/portfolio-digest/SKILL.md` — agent operating rules for each digest run
- `SETUP.md` — activate Wed/Fri email delivery
- `automations/weekly-portfolio-digest.md` — paste-ready Cursor Automation prompt
- `digests/` — archived digest outputs

## Design principle

```text
Core portfolio (boring, evidence-based, automated contributions)
    ↑
Digest agent (trends + social + market = hypotheses to VERIFY)
    ↑
Knowledge base (sources, educators, signal rules, allocation policy)
```

Trends and X are **attention sensors**, not buy buttons. The knowledge base keeps the agent honest.
