# Recommended MCP / agent stack

## Must-have (balanced research + email)

| Layer | Tool | Why |
|-------|------|-----|
| Trends (Google + multi-source) | [Trends MCP](https://trendsmcp.ai) / [google-trends-mcp](https://github.com/trendsmcp/google-trends-mcp) | Daily/weekly search interest, breakout keywords, X trending feed |
| X / Twitter sentiment | [xai-market-sentiment-mcp](https://github.com/JChan2787/xai-market-sentiment-mcp) or [grok-x-search-mcp](https://github.com/0xnicholasy/grok-x-search-mcp) | Stock mention discovery + sentiment via xAI Grok `x_search` |
| Market data | [FinancialMCP](https://github.com/arnavbhatia1/FinancialMCP) or [yfnhanced-mcp](https://github.com/kanishka-namdeo/yfnhanced-mcp) or [Alpha Vantage MCP](https://github.com/big-main/alpha_vantage_mcp) | Quotes, sectors, fundamentals, news, regime |
| Email delivery | [Resend MCP](https://resend.com/mcp) | Send midweek / EOW digests to your inbox |
| Scheduler | [Cursor Automations](https://cursor.com/automations) | Cron: Wed + Fri (or Sun) cloud agent runs |
| Memory | Automation Memories (built-in) | Compare week-over-week recommendations |

## Nice-to-have

| Tool | Role |
|------|------|
| Browser / computer use (built into Automations) | Manual check of Google Trends UI if MCP down |
| Slack Send tool | Instant alerts if email MCP not configured |
| FRED / macro MCP (inside FinancialMCP) | Rates, inflation context for bond sleeve |
| Official Alpha Vantage MCP | Technicals + cleaner time series (watch free-tier limits) |

## Cursor-native pieces (no install)

- **`/automate` skill** — describe the workflow; Cursor builds the automation
- **`portfolio-digest` skill** (this repo) — scoring rules + email template
- **Scheduled triggers** — cron e.g. `0 14 * * 3` (Wed 14:00 UTC) and `0 20 * * 5` (Fri 20:00 UTC)
- **Memories** — persist watchlist and prior calls across runs

## Example MCP config snippets

Add to Cursor Settings → MCP (or automation MCP tools). Replace API keys.

```json
{
  "mcpServers": {
    "trends-mcp": {
      "url": "https://api.trendsmcp.ai/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TRENDS_KEY"
      }
    },
    "resend": {
      "url": "https://mcp.resend.com/mcp",
      "headers": {
        "Authorization": "Bearer re_YOUR_KEY"
      }
    },
    "financial-mcp": {
      "command": "uvx",
      "args": ["financial-mcp-server"]
    },
    "grok-x": {
      "command": "npx",
      "args": ["-y", "grok-x-search-mcp"],
      "env": {
        "XAI_API_KEY": "xai-YOUR_KEY"
      }
    }
  }
}
```

> See [`SETUP.md`](../../../../SETUP.md) for the full activation path. Trends free tier: 100 req/mo at [trendsmcp.ai](https://trendsmcp.ai).

## Cost notes

- Cursor Automations bill as cloud agent usage
- Grok X search: roughly cents per call (xAI tool invocation)
- Trends MCP: check their pricing tier
- Resend: free tier is enough for 2 emails/week
- Prefer free market data MCPs first; add Alpha Vantage only if you need indicators
