# Platform release coordinator — agentic workflow

Niloo’s system for **multi-team, multi-service platform releases**: an agent tracks scope and dependencies across managers, raises risks early, and tells you what *you* need to do next — without becoming the bottleneck that merges every deploy.

> Coordination aid only. Humans keep go/no-go, production changes, and stakeholder commitments.

**Stack (locked):** Jira · Confluence · SharePoint · GitLab · Microsoft Teams · Agile LM (ALM / release-train planning layer)

---

## What you get each release cycle

| When | Agent run | You get | Your job |
|------|-----------|---------|----------|
| **Daily ~09:00** | Status pulse | Red/amber/green by workstream + top 5 risks + your action list | Unblock 1–3 items; nudge owners in Teams |
| **Twice weekly** | Dependency deep-dive | Critical path, slipped handoffs, missing owners | Escalate collisions before they become date slips |
| **T−5 / T−2 / T−0** | Go/no-go pack | Evidence checklist, HOLD reasons, decision log draft | Run the decision; record GO / HOLD / GO-with-conditions |
| **On demand** | “What do I need to do?” | Personal DRI queue for you (not the whole org) | Act, then reply with done/blocked so the agent learns |

Outputs land in `releases/` and in this Cloud Agent chat. Later: Teams Adaptive Card into the release channel.

Master prompt: [`automations/platform-release-coordinator.md`](automations/platform-release-coordinator.md)

---

## Core idea (from industry practice)

Mature platforms do **not** force every service onto one deploy night.

```text
Deploy independently  →  Release (user exposure) on demand
        ↑                         ↑
   GitLab pipelines          Flags / rings / launch owner
```

Use a **platform release train** only when something is genuinely coupled:

- shared schema / unversioned API cutover
- cross-service product launch that must appear atomic
- compliance window that requires a named change set

Otherwise: each team ships behind contracts + flags; the “platform release” is a **coordination and launch event**, not a mega-merge.

Research detail: [`knowledge-base/platform-release/00-research-brief.md`](knowledge-base/platform-release/00-research-brief.md)

---

## Agentic loop (every run)

```text
┌─────────────┐
│ 1. LOAD     │  knowledge-base/platform-release/ + active releases/*.md
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. SENSE    │  Jira fix-version/epic · GitLab MR/pipeline · Agile LM train
│             │  Confluence runbooks · SharePoint approvals · Teams noise
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. JOIN     │  One release manifest: workstreams × owners × evidence × deps
└──────┬──────┘
       ▼
┌─────────────┐
│ 4. SCORE    │  Risk rules (ROAM) · readiness gates · critical path
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. DECIDE   │  SHIP / SHIP WITH CAUTION / HOLD + what Niloo must do today
└──────┬──────┘
       ▼
┌─────────────┐
│ 6. DELIVER  │  releases/*.md + chat (+ Teams later) · never silent mutate prod
└─────────────┘
```

---

## System of record (who owns which truth)

| Concern | Source of truth | Agent use |
|---------|-----------------|-----------|
| Scope, stories, blockers, fix version | **Jira** | Read issues; optional comment with status pack link |
| Release train / PI / ALM milestones | **Agile LM** | Read planned vs actual train boarding |
| Code, MRs, pipelines, tags, deploys | **GitLab** | Read MR + pipeline evidence; never force-merge |
| Runbooks, ADRs, release notes drafts | **Confluence** | Read linked pages; flag missing runbooks |
| Formal approvals, CAB packs, signed PDFs | **SharePoint** | Check linked approval artifacts exist |
| Comms, nudges, decision thread | **Teams** | Post summaries; ask humans; no “approval by emoji” alone |

Full mapping: [`knowledge-base/platform-release/02-system-of-record.md`](knowledge-base/platform-release/02-system-of-record.md)

---

## Roles across managers (keep this thin)

| Role | Who | Accountable for |
|------|-----|-----------------|
| **Platform Release DRI** | You (Niloo) or named peer | Single view of train, risk register, go/no-go facilitation |
| **Workstream DRI** | One person per service/team | Their component’s evidence, rollback, and “ready” claim |
| **Launch owner** | Product / platform PM | User-visible turn-on (flags/comms), not every deploy |
| **Approver** | Per policy (security, CAB, business) | Explicit GO on recorded criteria |
| **Informed** | Other managers | Status packs only — not decision by committee of silence |

RACI detail: [`knowledge-base/platform-release/05-raci-and-cadence.md`](knowledge-base/platform-release/05-raci-and-cadence.md)

---

## How you use the system (human workflow)

### Starting a platform release
1. Create `releases/YYYY-MM-DD-<codename>/manifest.md` from the template.
2. List workstreams (service + manager + DRI + Jira fix version / Agile LM train ID + GitLab project).
3. Tell the agent: “Track Platform Release \<name\>.”

### Daily
1. Skim the pulse (2 minutes): your action list first.
2. Ping only owners of **red** or **aging amber** items.
3. Reply in chat: “Payments DRI said schema lands Thursday” so the next run stays current.

### Go/no-go
1. Open the go/no-go pack.
2. Decide GO / HOLD / GO-with-conditions — agent never decides alone.
3. Paste the decision into Teams + Jira release ticket.

### After ship
1. Agent writes post-release notes: planned vs actual, incidents, lessons.
2. You promote 1–2 lessons into `knowledge-base/platform-release/`.

---

## Activation

See [`SETUP-PLATFORM-RELEASE.md`](SETUP-PLATFORM-RELEASE.md).

Minimum viable: Cloud Agent + manual Jira/GitLab links in the manifest.  
Better: Jira + GitLab MCP (read) + Teams webhook (write summaries).  
Best: scheduled daily pulse + T−n go/no-go timers.

---

## Hard rules

1. **Read-heavy, write-light.** Default tools are read-only. Writes (Jira comment, Teams post) need an explicit human-confirmed step.
2. **No silent production actions.** No deploy, rollback, flag flip, or merge from the agent.
3. **One DRI per workstream.** “The payments team” is not an owner.
4. **Evidence over vibes.** “CI passed” must cite pipeline URL + SHA.
5. **Decouple when possible.** Prefer flags/contracts over synchronized deploys.
6. **Never invent status.** If a system is unreachable, say which one failed.
