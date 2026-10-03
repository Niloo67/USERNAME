# Hybrid delivery plan (Option C)

Chosen path while Cursor Automations email is deferred.

## Phase 1 — Now (this Cloud Agent)

| Cadence | What happens |
|---------|----------------|
| **Wednesday ~10:00 America/New_York** | Midweek digest → this chat + `digests/YYYY-MM-DD-midweek.md` |
| **Friday ~16:05 America/New_York** | End-of-week digest → this chat + `digests/YYYY-MM-DD-eow.md` |

Implementation: `cursor-subscriptions` timers on this agent run (`subscribe_timer`).

**You review:** open this agent chat, or browse `digests/` on GitHub.

**Caveat:** timers live with **this** Cloud Agent conversation. If the run is archived/killed, recreate timers (or move to Phase 2).

## Phase 2 — In ~1 month (dashboard)

GitHub Actions + static site under `docs/` → GitHub Pages:

- Scheduled weekday/after-close job
- Rebuilds a simple HTML dashboard (latest digest, target mix, watchlist, avoid list)
- Optional model key in GitHub Secrets for richer narrative

## Phase 3 — Later

Cursor Automations + Resend email (when Agents Window `/automate` works), or n8n.

## Timer UTC mapping (EDT = UTC−4)

| Local (ET) | Cron (UTC) |
|------------|------------|
| Wed 10:00 | `0 14 * * 3` |
| Fri 16:05 | `5 20 * * 5` |

If DST shifts (EST = UTC−5), update crons by +1 hour UTC.

## Digest rules

Follow `.cursor/skills/portfolio-digest/SKILL.md` + `knowledge-base/`.
Not financial advice. Keep digests **plain English**: one-sentence summary, small “do this / skip this” tables, no dense price dumps.

## Latest digest

→ [`digests/2026-09-09-midweek.md`](digests/2026-09-09-midweek.md)

## Trends key for this Cloud Agent

Desktop “connected” is not enough. Follow [`docs/fix-trends-mcp-cloud.md`](docs/fix-trends-mcp-cloud.md), then reply: `Trends key fixed — regenerate digest`.
