# Portfolio Digest Automation

Research stack + Cursor Automation setup for **midweek and end-of-week** investment digests aimed at a **balanced-growth portfolio**.

Uses Google Trends / multi-source trends, X (Twitter) mention sentiment, market data, and a simple scoring rubric — then emails you a short actionable summary.

> Not financial advice. Educational research workflow only.

## Start here

1. **[`WEEKLY-WORKFLOW.md`](WEEKLY-WORKFLOW.md)** — **agentic weekly system** (Sun / Wed / Fri decision loop)  
2. **[`HYBRID.md`](HYBRID.md)** — delivery timers + chat/`digests/` archive  
3. **[`knowledge-base/07-weekly-decision-framework.md`](knowledge-base/07-weekly-decision-framework.md)** — buy/hold/skip rules  
4. **[`knowledge-base/`](knowledge-base/README.md)** — full doctrine + 30-day curriculum  
5. **[`SETUP.md`](SETUP.md)** — optional later: Automations + email keys  
6. **`.cursor/skills/portfolio-digest/`** — what the agent does each run  

## What’s in this repo

| Path | Purpose |
|------|---------|
| `WEEKLY-WORKFLOW.md` | Human + agent map for weekly decisions |
| `HYBRID.md` | Option C delivery plan + timer UTC map |
| `automations/weekly-decision-agent.md` | Master agentic pipeline prompt |
| `automations/hybrid-timer-prompt.md` | Sun/Wed/Fri timer prompt copy |
| `docs/fix-trends-mcp-cloud.md` | If digests say Trends auth failed — fix Cloud Agent API key |
| `knowledge-base/` | Research brief, sources, signals, architecture, decision framework |
| `.cursor/skills/portfolio-digest/` | Agent skill: scoring, sleeves, formats |
| `automations/weekly-portfolio-digest.md` | Later: Cursor Automation + email config |
| `.cursor/mcp.json.example` | Example MCP wiring (Trends, X/Grok, market data, Resend) |
| `digests/` | Saved digest archive + `_templates/` |

## Recommended stack

1. **Scheduler** — [Cursor Automations](https://cursor.com/automations) (Wed + Fri cron)
2. **Trends** — [Trends MCP](https://trendsmcp.ai) (Google + X trending feeds)
3. **X sentiment** — [grok-x-search-mcp](https://github.com/0xnicholasy/grok-x-search-mcp) or [xai-market-sentiment-mcp](https://github.com/JChan2787/xai-market-sentiment-mcp)
4. **Prices / fundamentals** — FinancialMCP / Yahoo Finance MCP / Alpha Vantage MCP
5. **Email** — [Resend MCP](https://resend.com/mcp) → your inbox  
   Fallback: Automation **Send to Slack**

Details: `.cursor/skills/portfolio-digest/references/mcp-stack.md`

## Quick start (email digests)

**Follow [`SETUP.md`](SETUP.md)** — keys, MCP config, and a ready `/automate` paste.

## Target risk profile

Default sleeve mix for this balanced-growth profile (adjust in Memories):

- ~45% US total market (VTI)
- ~20% international (VXUS)
- ~10% growth tilt (QQQ)
- ~8% quality dividends (SCHD)
- ~5% cyclical satellite
- ~10% bonds (BND)
- ~2% gold optional

## Sample digest

See [`digests/2026-08-01-sample.md`](digests/2026-08-01-sample.md) for the format and a first pass on current market conditions.
