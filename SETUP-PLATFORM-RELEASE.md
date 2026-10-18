# Setup — platform release agent

## Phase 1 (today, no IT tickets)

1. Copy `releases/_templates/manifest.md` → `releases/YYYY-MM-DD-<codename>/manifest.md`.
2. Fill workstreams with **real people** as DRIs (not team names).
3. In this Cloud Agent chat: `Track platform release YYYY-MM-DD-codename`.
4. Optional: schedule a weekday timer that runs `automations/platform-release-daily-pulse.md`.
5. Keep formal docs in Confluence/SharePoint; paste links into the manifest.

## Phase 2 — read tools

1. Enable GitLab MCP or create a `read_api` token in Cursor secrets.
2. Connect Jira (Atlassian MCP or API token + base URL).
3. Export Agile LM boarding to `releases/<id>/alm.json` twice a week if no API.
4. Copy `.cursor/mcp.json.example` → local MCP config (do not commit secrets).

## Phase 3 — Teams delivery

1. Create Power Automate webhook into the release channel.
2. Set secret `TEAMS_RELEASE_WEBHOOK`.
3. Set `teams_webhook: confirmed` on the manifest.
4. Agent posts only pulses with P0/P1 or go-week packs (see daily prompt).

## Phase 4 — harden

1. Add T−5 / T−2 / T−0 timers from `automations/platform-release-go-nogo.md`.
2. After each release, move 1–2 lessons into `knowledge-base/platform-release/`.
3. Optionally split specialist subagents (scope / pipelines / approvals).

## Sanity check

Ask: “What do I need to do for sample-checkout?”  
Expect: ≤5 actions grounded in `releases/2026-11-12-sample-checkout/`.
