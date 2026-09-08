# Fix Trends MCP for Cloud Agent digests

Desktop Cursor can show Trends MCP as connected while **this Cloud Agent** still fails with `Invalid API key`. Digests must use the key attached to the **cloud / dashboard** MCP config.

## Quick check

From an agent that should use Trends, a call like “get Google Trends top US” should return rows — not `Invalid API key`.

## Fix

1. Open [cursor.com](https://cursor.com) → **Dashboard → Cloud Agents / Integrations & MCP** (or the MCP panel used by Cloud Agents).
2. Find **trends-mcp** (URL should be `https://api.trendsmcp.ai/mcp`).
3. Set header: `Authorization: Bearer <your real Trends key>`  
   Get/rotate the key at [trendsmcp.ai](https://trendsmcp.ai) (check the email that received the key).
4. Save, then **restart / re-open this Cloud Agent** (or start a new follow-up) so it picks up the new key.
5. Reply here: **“Trends key fixed — regenerate digest”** and I’ll rerun the attention layer on the latest digest.

## Notes

- Local `~/.cursor/mcp.json` does **not** automatically fix Cloud Agent MCP auth.
- Free Trends tier is limited (~100 req/mo) — digests should call a small fixed set of tools each run.
- Skill/timers now say **auth/quota failed** instead of “not connected” when this happens.
