# Activate your Wed + Fri portfolio emails

Do these steps in order. About 10 minutes. You need a **paid Cursor plan** (Cloud Agents / Automations).

## 1) Get free API keys

| Service | Why | Link |
|---------|-----|------|
| **Trends MCP** | Google Trends + X trending feeds | [trendsmcp.ai](https://trendsmcp.ai) → enter `niloo.shayan@gmail.com` → key emailed |
| **Resend** | Send the digest email | [resend.com/api-keys](https://resend.com/api-keys) → create key `re_…` |
| **xAI** (optional) | Deeper X stock sentiment | [console.x.ai](https://console.x.ai) → API key |

**Resend tip (fastest):** for testing you can send *to yourself* from `onboarding@resend.dev` without verifying a domain. Later, verify your own domain for nicer From addresses.

## 2) Add MCPs in Cursor (global)

On your computer, open **Cursor Settings → Tools & MCP → Add new global MCP server**  
(or edit `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "trends-mcp": {
      "url": "https://api.trendsmcp.ai/mcp",
      "headers": {
        "Authorization": "Bearer PASTE_TRENDS_KEY"
      }
    },
    "resend": {
      "url": "https://mcp.resend.com/mcp",
      "headers": {
        "Authorization": "Bearer PASTE_RESEND_KEY"
      }
    },
    "financial-mcp": {
      "command": "uvx",
      "args": ["financial-mcp-server"]
    }
  }
}
```

Replace the two `PASTE_…` values. Restart Cursor. Confirm each server shows green/connected.

> Cloud Automations need **HTTP** MCPs with Bearer keys (Trends + Resend above). Also add the same MCP connections under the automation’s **Tools → MCP** (or Dashboard → Integrations & MCP) so the scheduled agent can use them.

## 3) Create the Automation (easiest: `/automate`)

1. Open Cursor **Agent** chat (desktop or [cursor.com/agents](https://cursor.com/agents)).
2. Paste this **exactly**:

```text
/automate

Create a private automation named "Portfolio Digest (Wed + Fri)".

Triggers (two schedules):
- Every Wednesday at 10:00 America/New_York
- Every Friday at 16:05 America/New_York

Repository: none (no repo).
Tools: Memories ON. Attach MCPs: trends-mcp, resend, financial-mcp (if available). Optional: Send to Slack as fallback.

Instructions for each run:
You are my recurring portfolio research agent for a balanced-growth investor in their 30s.
Investor: Niloo (niloo.shayan@gmail.com). Prefer ETFs for core; single stocks as 1–3% satellites.
Target mix: ~45% VTI, 20% VXUS, 10% QQQ, 8% SCHD, 5% cyclical satellite, 10% BND, 2% GLD optional.

1. Read Memories for prior recommendations.
2. Market regime: SPY/VTI, QQQ, IWM, sector ETFs, BND, GLD (financial-mcp or web).
3. Google Trends / search interest via trends-mcp (1W vs prior) for sectors + watchlist.
4. X trending / mentions via trends-mcp X feed (and grok-x if present); ignore meme pumps.
5. Cross-check price, news, fundamentals.
6. Midweek digest on Wed; end-of-week digest on Fri.
7. ALWAYS email the digest with Resend MCP to niloo.shayan@gmail.com
   (from onboarding@resend.dev until a domain is verified). If Resend fails, Send to Slack if available, else put the full digest in the final message.
8. Update Memories with top ideas and next-run watch items.

Rules: no leverage/options/pennies; max 7 ideas; include "what NOT to chase"; not financial advice; never invent prices.
Email subject: "[Midweek|Weekend] Portfolio Digest — YYYY-MM-DD"
```

3. Review the draft Cursor builds → **Create / Save / Activate**.
4. Open the automation → confirm **both** schedules → click **Run now** once.

### Alternative: web UI

1. Go to [cursor.com/automations/new](https://cursor.com/automations/new) (log in as yourself).
2. Paste the instructions from `automations/weekly-portfolio-digest.md`.
3. Add two **Scheduled** triggers (Wed 10:00 ET, Fri 16:05 ET).
4. Repo: **No repository**. Memories: on. Add MCP tools.
5. Save → **Run now**.

## 4) Confirm the first email

- Check inbox (and spam) for `niloo.shayan@gmail.com`
- If Resend fails: open the automation run log → usually “domain/API key”; fix key and re-run
- If Trends fails: agent should still send a digest using market data + web research

## 5) Done when…

- [ ] Trends MCP connected (free key)
- [ ] Resend MCP connected (`re_…` key)
- [ ] Automation active with Wed + Fri schedules
- [ ] Test run delivered an email
- [ ] Memories retained a watchlist after the test

## If you want me (the cloud agent) to finish in the browser

Reply **“I’m logged into Cursor in the browser”** after signing in at [cursor.com/automations](https://cursor.com/automations) in a session I can use, and I’ll complete the UI clicks. Do **not** paste API keys into chat — add them only in Cursor MCP settings.
