# Must-buy alert agent

Pushes a **short notification in this Cloud Agent chat** when something crosses the “must buy” bar.  
Not financial advice. No military/defense. No leverage/options/pennies.

## Delivery (Phase 1 — now)

| Channel | Status |
|---------|--------|
| **This chat** (timer follow-up) | **Active** — you get a Cursor notification when the agent posts |
| Email (Resend) | Later — when Resend MCP / Automations email is wired (`HYBRID.md` Phase 3) |
| Slack | Optional later if you connect a channel |

Timers live on **this** conversation. Keep the chat open / unarchived so alerts keep firing.

## Timer

| Name | Cron (UTC) | Local (EDT) |
|------|------------|-------------|
| `portfolio-must-buy` | `30 13 * * 1-5` | Mon–Fri **9:30am ET** |

Prompt source: `automations/hybrid-timer-prompt.md` → Must-buy alert section.

## What counts as MUST BUY (strict)

Promote to **MUST BUY** only if **all** of these hold:

1. **Fits the plan** — core ETF on schedule, or quality/theme inside size caps (`knowledge-base/07-weekly-decision-framework.md`)
2. **Setup is better than yesterday’s noise** — e.g. pullback with thesis intact, soft entry on a live bottleneck, or post-print clarity (not “it went down so buy”)
3. **Actionable today** — liquid ticker; CAD-friendly when possible; bear case one sentence
4. **Not on the skip list** — no defense, no oil chase after spikes, no CEG/MU/SNDK chase, no CRWD pile-on, no CMPS beyond ≤1.5%

**Core DCA** (VFV/VCN/XEF on a normal Tuesday) is usually **“keep funding”**, not a must-buy alert — only upgrade to MUST BUY when the tape is soft enough that delaying is clearly worse than buying (e.g. down week into scheduled cash).

Max **3** must-buy lines. Prefer **“No must-buy today.”** over stretching.

## Output format (chat — keep short)

```text
# Must-buy alert — Mon DD, YYYY
Not financial advice.

## MUST BUY (act if you have cash)
| Ticker | Why today | Size tip |
|--------|-----------|----------|
| VFV.TO | … | … |

## Not today
| Skip | Why |
|------|-----|
| … | … |

(or: **No must-buy today.** Core plan unchanged: VFV/VCN/XEF on schedule.)
```

Also write `digests/YYYY-MM-DD-must-buy.md` when there is at least one MUST BUY (skip file if none — avoids clutter).  
Commit/push/update PR only when a file was written or rules changed.

## Preferences

- Niloo: explanations when alerting; no defense  
- Personalized TFSA/RRSP only if cash context known — otherwise generic + “check your account sets”  
- Trends: auth/quota failed if key errors — never invent scores
