# How to give this Cloud Agent a working Trends key

Your desktop Cursor can show Trends as “connected” while **this Cloud Agent still has a bad key**. That is why digests said Trends failed.

You only need to do this once.

## Step A — Get your Trends key (2 minutes)

1. Open [https://trendsmcp.ai](https://trendsmcp.ai) in your browser.
2. Enter your email (`niloo.shayan@gmail.com`) and get a free API key emailed to you.
3. Open the email and **copy the key** (a long string). Keep it handy.

If you already have a key and aren’t sure it’s right, request/rotate a new one on the Trends site and use the new one.

## Step B — Add it for Cloud Agents (not desktop)

Desktop Settings → MCP does **not** fix Cloud Agents. Do this on the website:

1. Open [https://cursor.com/agents](https://cursor.com/agents) while logged in.
2. Click the **`+`** button near the chat box (left of the prompt / near the model picker).
3. Hover **MCP Servers** → click **Add MCP** (or **Add**).
4. Choose **HTTP** (not SSE).
5. Fill in:
   - **URL:** `https://api.trendsmcp.ai/mcp`
   - **Header name:** `Authorization`
   - **Header value:** `Bearer ` + your key  
     Example shape only: `Bearer abc123...`  
     (the word `Bearer`, a space, then the key — no quotes)
6. Save / enable it.

Optional team path: [https://cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations) → Team MCP Servers → same URL + header.

## Step C — Tell me it’s done

Reply here with exactly:

`Trends key fixed — regenerate digest`

I will call Trends again and rewrite the digest with Google Trends + X included.

## If it still fails

- Make sure the header value starts with `Bearer ` (with a space).
- Paste a **fresh** key (old keys / typos cause `Invalid API key`).
- Start a new message in this agent after saving (so it reloads tools).

You do **not** need to paste the key into this chat.
