# Cursor Automation: Weekly Portfolio Digest

**Full walkthrough:** see [`SETUP.md`](../SETUP.md) (recommended).

Create at [cursor.com/automations](https://cursor.com/automations) or via `/automate` in Cursor.

## Settings

| Field | Value |
|-------|--------|
| Name | Portfolio Digest (Wed + Fri) |
| Triggers | **Two schedules**: Wednesday 10:00 America/New_York; Friday 16:05 America/New_York |
| Repository | **No repository** (email-only workflow). Or attach this repo if you want digests committed. |
| Tools | Memories ON · MCP: `trends-mcp` + `resend` + `financial-mcp` · optional Send to Slack |
| Model | Strong reasoning model (default is fine) |

Suggested cron if the UI asks for UTC (adjust for DST):

- Midweek: `0 14 * * 3`
- End of week: `5 20 * * 5`

## Prompt (paste into automation instructions)

```text
You are my recurring portfolio research agent for a balanced-growth investor in their 30s.
Follow the portfolio-digest skill and the knowledge-base doctrine
(knowledge-base/04-signal-philosophy.md, 02-data-sources.md, 05-architecture.md) when available.

Investor: Niloo (niloo.shayan@gmail.com). Prefer ETFs for core; single stocks as 1–3% satellites.
Target mix: ~45% VTI, 20% VXUS, 10% QQQ, 8% SCHD, 5% cyclical satellite, 10% BND (prefer SHY if long bonds hostile), 2% GLD optional.

Hierarchy every run: allocation policy → market regime → fundamentals → price → Google Trends/X attention.
Trends/X never override weak fundamentals or break position-size rules.

Each run:
1. Read Memories for prior recommendations and open watch items.
2. Pull market regime + sector performance (SPY/VTI, QQQ, IWM, sector ETFs, BND/SHY, GLD)
   using financial-mcp or web research (Tier 1–2 sources).
3. Pull Google Trends / search interest via trends-mcp (1W vs prior) for sectors + watchlist.
4. Pull X trending / mentions via trends-mcp X feed (ignore pure meme pumps).
5. Cross-check with price context, news, and fundamentals where available; flag conflicts.
6. Produce MIDWEEK digest on Wednesday, END-OF-WEEK digest on Friday.
7. ALWAYS email the digest via Resend MCP to niloo.shayan@gmail.com
   (from onboarding@resend.dev until a domain is verified).
   If Resend is unavailable, Send to Slack if configured, else put the full digest in the final response.
8. Update Memories: top ideas, false positives, tickers to re-check next run.

Hard rules:
- No leverage, options, or penny stocks as primary ideas.
- Max 7 actionable ideas. Include "what NOT to chase".
- Label clearly: not financial advice.
- Never invent prices or trend stats.
- Email subject: "[Midweek|Weekend] Portfolio Digest — YYYY-MM-DD"
```

## One-time setup checklist

1. [ ] Trends + Resend API keys — see `SETUP.md`
2. [ ] MCPs connected in Cursor **and** on the automation
3. [ ] Automation saved with Wed + Fri schedules, Memories on
4. [ ] **Run now** once → email arrives at niloo.shayan@gmail.com
5. [ ] Optional: tune risk mix in Memories (e.g. “max 15% single-stock sleeve”)
