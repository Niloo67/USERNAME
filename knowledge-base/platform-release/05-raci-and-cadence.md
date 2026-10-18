# RACI and meeting cadence

## RACI (platform release)

| Activity | Platform DRI (you) | Workstream DRI | Workstream manager | Launch owner | Approver (CAB/Sec/Biz) |
|----------|--------------------|----------------|--------------------|--------------|------------------------|
| Scope freeze | A | C | C | C | I |
| Dependency board | A | R | C | I | I |
| Code + pipeline evidence | I | R | A (team delivery) | I | I |
| Runbook + rollback | C | R | A | I | I |
| Formal approval pack | R (assemble links) | C | I | C | A |
| Go/no-go decision | R (facilitate) | C | C | C | A |
| User-facing launch | C | C | I | A/R | I |
| Comms to org | A/R | I | I | C | I |
| Post-release review | A | R (their slice) | C | C | I |

R = does the work · A = accountable · C = consulted · I = informed

**Managers** are accountable for staffing and priority inside their team; they are **not** a substitute for a workstream DRI on the board.

## Cadence (replace status theater)

| Ritual | Length | Who | Input | Output |
|--------|--------|-----|-------|--------|
| Daily pulse (async) | 5 min read | All DRIs | Agent pulse | Thread replies only if red/amber on you |
| Dependency sync | 25 min, 2×/week | Platform DRI + blocked DRIs | Critical path | Updated deps + escalations |
| Manager steerco | 30 min, weekly | Managers + Platform DRI | One-page RAG | Date/scope tradeoffs only |
| Go/no-go | 30–45 min at T−2 | Approvers + DRIs | Go/no-go pack | Recorded decision |
| Hotwash | 30 min at T+3 | DRIs | Post-release notes | 1–3 doctrine updates |

If a meeting has no decision or unblock, cancel it and keep the pulse.

## Escalation path

```text
Workstream DRI blocked
    → ping peer DRI (same day)
    → Platform DRI (same day if P0/P1)
    → Workstream manager (priority / people)
    → Steerco (date/scope tradeoff)
```

Agent drafts the escalation text; humans send it.
