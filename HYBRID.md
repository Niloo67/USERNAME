# Hybrid delivery plan (Option C)

Chosen path while Cursor Automations email is deferred.

**Start here for the weekly system:** [`WEEKLY-WORKFLOW.md`](WEEKLY-WORKFLOW.md)

## Phase 1 — Now (this Cloud Agent)

| Cadence (ET) | Agent run | Output |
|--------------|-----------|--------|
| **Sunday ~18:00** | Week-ahead brief | chat + `digests/YYYY-MM-DD-week-ahead.md` |
| **Wednesday ~10:00** | Midweek pulse | chat + `digests/YYYY-MM-DD-midweek.md` |
| **Friday ~16:05** | Full decision report | chat + `digests/YYYY-MM-DD-eow.md` |

Implementation: `cursor-subscriptions` timers on this agent run (`subscribe_timer`).  
Prompts: [`automations/hybrid-timer-prompt.md`](automations/hybrid-timer-prompt.md)  
Pipeline: [`automations/weekly-decision-agent.md`](automations/weekly-decision-agent.md)

**You review:** open this agent chat, or browse `digests/` on GitHub.

**Caveat:** timers live with **this** Cloud Agent conversation. If the run is archived/killed, recreate timers (or move to Phase 2). Subscriptions expire ~7 days — agent refreshes after deliveries.

## Phase 2 — In ~1 month (dashboard)

GitHub Actions + static site under `docs/` → GitHub Pages:

- Scheduled weekday/after-close job
- Rebuilds a simple HTML dashboard (latest digest, target mix, watchlist, avoid list)
- Optional model key in GitHub Secrets for richer narrative

## Phase 3 — Later

Cursor Automations + Resend email (when Agents Window `/automate` works), or n8n.  
See [`automations/weekly-portfolio-digest.md`](automations/weekly-portfolio-digest.md).

## Timer UTC mapping (EDT = UTC−4)

| Local (ET) | Cron (UTC) | Name |
|------------|------------|------|
| Sun 18:00 | `0 22 * * 0` | `portfolio-week-ahead` |
| Wed 10:00 | `0 14 * * 3` | `portfolio-digest-wed` |
| Fri 16:05 | `5 20 * * 5` | `portfolio-digest-fri` |

If DST shifts (EST = UTC−5), update crons by +1 hour UTC.

## Digest rules

Follow `.cursor/skills/portfolio-digest/SKILL.md` + `knowledge-base/` (esp. `07-weekly-decision-framework.md`).
Not financial advice. Keep digests **plain English**; Friday includes an **explained shopping list**.

## Trends key for this Cloud Agent

Desktop “connected” is not enough. Follow [`docs/fix-trends-mcp-cloud.md`](docs/fix-trends-mcp-cloud.md), then reply: `Trends key fixed — regenerate digest`.
