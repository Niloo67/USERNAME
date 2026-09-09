# How to give this Cloud Agent a working Trends key

Your desktop can show Trends as connected while **this Cloud Agent still fails** with `Invalid API key`. That is what is happening right now (tools appear, calls fail).

## Do this on the website (not desktop Settings)

1. Get/copy your key from [trendsmcp.ai](https://trendsmcp.ai) (email to you).
2. Open **[https://cursor.com/agents](https://cursor.com/agents)** (same account as this chat).
3. Click **`+`** near the chat box → **MCP Servers** → **Add MCP**.
4. Choose **HTTP**.
5. Set:
   - **URL:** `https://api.trendsmcp.ai/mcp`
   - **Header name:** `Authorization`
   - **Header value:** `Bearer YOUR_KEY`  
     Must look like: `Bearer abc123...`  
     Common mistakes: missing `Bearer `, extra quotes, leftover `PASTE_TRENDS_KEY`.
6. Save / enable.
7. If an older Trends MCP already exists, **delete it** and add a fresh one (stale keys stick around).
8. Send a new message here: `Trends key fixed — regenerate digest`

Optional: also add the same HTTP + header under [Dashboard → Integrations & MCP](https://cursor.com/dashboard/integrations).

## How we’ll know it worked

I’ll call Trends and get real Google/X rows instead of `Invalid API key`.

## Do not

- Paste your API key into this chat  
- Only edit desktop **Settings → MCP** / local `mcp.json` (that won’t fix this Cloud Agent)
