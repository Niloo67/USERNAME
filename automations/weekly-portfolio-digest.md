# Cursor Automation: Weekly Portfolio Digest

Create at [cursor.com/automations](https://cursor.com/automations) or via `/automate` in Cursor.

## Settings

| Field | Value |
|-------|--------|
| Name | Portfolio Digest (Midweek + EOW) |
| Triggers | **Two schedules**: Wednesday 10:00 America/New_York; Friday 16:00 America/New_York |
| Repository | This repo (so the `portfolio-digest` skill + `digests/` folder are available) **or** No repository if you only want email |
| Tools | Memories ON · MCP: Trends + market data + Resend · optional Send to Slack |
| Model | Strong reasoning model (default is fine) |

Suggested cron (UTC equivalents of US Eastern — adjust for DST):

- Midweek: `0 14 * * 3`
- End of week: `0 20 * * 5`

## Prompt (paste into automation instructions)

```text
You are my recurring portfolio research agent. Follow the project skill
`.cursor/skills/portfolio-digest/SKILL.md` (portfolio-digest).

Investor: Niloo, early/mid 30s. Goal: balanced-growth portfolio —
not ultra-conservative, not speculative. Prefer ETFs for core; single stocks
as small satellites. Email: niloo.shayan@gmail.com

Each run:
1. Read Memories for prior recommendations and open watch items.
2. Pull market regime + sector performance (SPY/VTI, QQQ, IWM, sector ETFs, BND, GLD).
3. Pull Google Trends / search interest for major sectors + watchlist tickers (1W and compare to prior week).
4. Pull X/Twitter mention & sentiment movers for stocks/ETFs (ignore pure meme pumps).
5. Cross-check with price context, news, and fundamentals where available.
6. Produce either a MIDWEEK or END-OF-WEEK digest based on today's weekday.
7. Email the digest via Resend MCP to niloo.shayan@gmail.com.
   If Resend is unavailable, Send to Slack (if configured) and still write
   digests/YYYY-MM-DD-midweek.md or digests/YYYY-MM-DD-eow.md in the repo and commit.
8. Update Memories: top ideas, false positives, tickers to re-check next run.

Hard rules:
- No leverage, options, or penny stocks as primary ideas.
- Max 7 actionable ideas. Include "what NOT to chase".
- Label clearly: not financial advice.
- Never invent prices or trend stats.
```

## One-time setup checklist

1. [ ] Connect MCPs in Cursor (Trends, market data, Resend) — see `.cursor/skills/portfolio-digest/references/mcp-stack.md`
2. [ ] Verify Resend domain/sender (or use Slack as interim delivery)
3. [ ] Create automation with the prompt above + Wed/Fri schedules
4. [ ] Enable Memories
5. [ ] Run once manually (“Test”) and confirm email arrives
6. [ ] Optionally tune risk mix in Memories (e.g. “max 15% single-stock sleeve”)
