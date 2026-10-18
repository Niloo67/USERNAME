# System of record — Jira · Agile LM · GitLab · Confluence · SharePoint · Teams

One fact, one home. The agent **joins** facts; it does not invent a second wiki of truth.

## Canonical fields on the release manifest

Every platform release keeps a manifest (in git `releases/…/manifest.md` and/or Jira release ticket) with:

| Field | Source | Example |
|-------|--------|---------|
| Release ID / codename | Platform DRI | `2026-11-plat-checkout` |
| Target launch date | Agile LM + product | `2026-11-12` |
| Mode | DRI | `hybrid` |
| Workstream | Team name | `payments-api` |
| Manager | Org | `A. Example` |
| DRI (person) | Named human | `@alice` |
| Jira fix version / epic | Jira | `PLAT-2026.11` / `PLAT-441` |
| Agile LM train / milestone | Agile LM | `ART-Platform / PI3-IT1` |
| GitLab project + target SHA | GitLab | `group/payments` @ `abc1234` |
| Pipeline URL | GitLab | link |
| Runbook | Confluence | link |
| Approval pack | SharePoint | link |
| Flag / launch key | Config/flag system | `checkout_v2` |
| Ready? | DRI claim + evidence | `amber` |
| Rollback | Confluence or GitLab | link + last rehearsal date |

## Per-tool rules

### Jira
- **Owns:** scope, acceptance, blockers, assignments, fix-version membership.
- **Agent reads:** JQL for the fix version / epic; status categories; flagged blockers; linked issues.
- **Agent may write (with confirm):** comment with status-pack link; label `release-risk`.
- **Never:** transition issues to Done because a pipeline was green.

### Agile LM
- **Owns:** train membership, PI/milestone dates, ALM stage (planned / boarded / released).
- **Agent reads:** which components are on the train vs slipped to next.
- **Treat drift** (Jira says in-scope, Agile LM says not boarded) as a **P1 process risk**.

### GitLab
- **Owns:** code, MR approval state, pipeline, environments, tags, deploy jobs.
- **Agent reads:** open MRs for labels/milestones; default-branch pipelines; last deploy to staging/prod; failing jobs.
- Prefer [GitLab MCP](https://docs.gitlab.com/user/model_context_protocol/mcp_server/) or project access tokens (read_api).
- **Never:** merge, approve, or trigger prod deploy.

### Confluence
- **Owns:** runbooks, architecture decisions, release-note drafts, comms copy.
- **Agent checks:** linked pages exist and were updated after scope freeze (stale runbook = risk).

### SharePoint
- **Owns:** formal approval artifacts (CAB, security sign-off, business acceptance).
- **Agent checks:** link resolves + metadata (approver, date) present in manifest.
- Silence in Teams ≠ SharePoint approval.

### Microsoft Teams
- **Owns:** human attention and decision thread — not archival truth.
- **Agent posts:** daily pulse, escalation pings, go/no-go summary with links back to Jira/Confluence/SharePoint/git manifest.
- Integration path: Power Automate “When an HTTP request is received” → Post message in channel (same pattern GitLab/Jira docs use).
- Optional later: Teams Channel Agent + Jira MCP (tenant-dependent; GitLab often still needs separate MCP/API).

## Join keys (how the agent correlates)

```text
Jira issue key  ←→  GitLab MR description / commit trailer (e.g. PLAT-123)
Jira fix version  ←→  Agile LM train board item
GitLab project  ←→  Workstream row on manifest
Confluence runbook URL  ←→  Workstream.ready evidence
SharePoint approval URL  ←→  Release-level or workstream-level gate
```

If a join key is missing, the agent files a **tracking defect** (risk: `orphaned-change`) instead of guessing.
