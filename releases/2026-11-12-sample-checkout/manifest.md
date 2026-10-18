# Release manifest — `sample-checkout`

> **Sample only** — replace with a real platform release. Shows field shape for the agent.

| Field | Value |
|-------|-------|
| Release ID | `2026-11-12-sample-checkout` |
| Platform DRI | Niloo |
| Launch owner | Platform PM |
| Target launch date | 2026-11-12 |
| Mode | hybrid |
| Jira fix version / epic | `PLAT-2026.11` / `PLAT-100` |
| Agile LM train / milestone | `ART-Platform / PI-sample` |
| Teams channel | `Platform Releases` |
| teams_webhook | off |
| Scope freeze date | 2026-11-05 |
| Coupling (one sentence, or “none”) | Checkout API request shape changes; payments + edge must see same flag cohort |

## Workstreams

| Workstream | Manager | DRI | Mode | Jira | GitLab project | Runbook (Confluence) | Approval (SharePoint) | Flag / launch key | RAG | Notes |
|------------|---------|-----|------|------|----------------|----------------------|-----------------------|-------------------|-----|-------|
| edge-bff | M. Edge | @edge-dri | train-gated | PLAT-101 | `platform/edge-bff` | /runbooks/edge-bff | /cab/PLAT-100 | `checkout_v2` | amber | Needs final pipeline link |
| payments-api | M. Pay | @pay-dri | train-gated | PLAT-102 | `platform/payments-api` | /runbooks/payments | /cab/PLAT-100 | `checkout_v2` | green | Expand phase done |
| catalog | M. Cat | @cat-dri | independent | PLAT-103 | `platform/catalog` | /runbooks/catalog | — | — | green | No coupling |
| launch-comms | PM | @launch | launch-only | PLAT-104 | — | /comms/checkout-v2 | /biz/accept | `checkout_v2` | amber | Copy draft only |

## Dependencies

| From | To | Need by | Verification | Owner | Status |
|------|----|---------|--------------|-------|--------|
| payments-api expand | edge-bff | 2026-11-07 | Contract tests in GitLab | @pay-dri | open |
| flag key parity | edge-bff + payments-api | 2026-11-10 | Same key + user context | @launch | open |

## Approvers

| Gate | Approver | Artifact (SharePoint) | Status | Date |
|------|----------|-------------------------|--------|------|
| Security | Sec lead | /cab/PLAT-100-sec | pending | |
| CAB / change | CAB chair | /cab/PLAT-100 | pending | |
| Business accept | VP Product | /biz/accept | pending | |
