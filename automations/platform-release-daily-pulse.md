# Timer prompt — daily platform release pulse

Run ~09:00 local on weekdays while a release is active.

1. Follow `automations/platform-release-coordinator.md` end-to-end.
2. Output type: **daily pulse**.
3. Focus: Niloo’s action list + any new P0/P1 since yesterday.
4. Diff vs previous pulse: call out status flips (green→amber, etc.).
5. Deliver: write `releases/<active-id>/YYYY-MM-DD-pulse.md`, chat summary, commit if in hybrid mode.
6. Do **not** post to Teams unless the release manifest sets `teams_webhook: confirmed` and today’s pulse has P0/P1 (or it is go-week).
