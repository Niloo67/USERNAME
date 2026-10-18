# Architecture — platform release agent

Mirrors the portfolio weekly-agent pattern in this repo: knowledge base + automation prompts + dated outputs + optional MCP.

## North-star diagram

```text
┌──────────────────────────────────────────────────────────────┐
│  KNOWLEDGE BASE                                              │
│  operating models · risk rules · RACI · system-of-record     │
└────────────────────────────┬─────────────────────────────────┘
                             │ load every run
┌────────────────────────────▼─────────────────────────────────┐
│  CURSOR CLOUD AGENT / AUTOMATION                             │
│  skill: platform-release · manifest in releases/             │
└──────┬──────────┬──────────┬──────────┬──────────┬───────────┘
       │          │          │          │          │
    Jira API   GitLab MCP  Agile LM   Confluence  SharePoint
    / MCP      / API       export/API  links       links
       │          │          │          │          │
       └──────────┴─────┬────┴──────────┴──────────┘
                        ▼
              Join → Score → Action list
                        ▼
        ┌───────────────┴────────────────┐
        │  OUTPUTS                         │
        │  1. releases/.../pulse.md        │
        │  2. Chat to Niloo                │
        │  3. Teams channel (webhook)      │
        │  4. Optional Jira comment        │
        └──────────────────────────────────┘
```

## Repo layout

```text
PLATFORM-RELEASE-WORKFLOW.md          ← human entry + cadence
SETUP-PLATFORM-RELEASE.md             ← activation checklist
knowledge-base/platform-release/      ← doctrine
automations/                          ← agent prompts
releases/                             ← per-release manifests + pulses
.cursor/skills/platform-release/      ← runtime skill
.cursor/mcp.json.example              ← tool wiring sample
```

## Build phases

### Phase 1 — Manual-sense (now)
- Manifest + templates in git
- Agent reads links you paste / pages you attach
- Daily “what do I need to do?” from manifest + risk rules
- No production credentials required

### Phase 2 — Read integrations
- GitLab MCP or `read_api` token (MRs, pipelines)
- Jira Cloud/DC API or Atlassian MCP (fix version JQL)
- Agile LM export or API → train boarding CSV/JSON dropped in `releases/…/alm.json`
- Confluence/SharePoint: validate URLs + last-modified when APIs allow

### Phase 3 — Delivery to Teams
- Power Automate HTTP trigger → release channel Adaptive Card
- Separate **decision** thread for go/no-go (not the noise channel)

### Phase 4 — Optional specialists
- Parallel subagents: scope auditor · pipeline auditor · docs/approvals auditor
- Critic pass: “strongest reason to HOLD”
- Post-release learning tags into knowledge base

### Out of scope
- Auto-merge, auto-deploy, auto flag flip
- Replacing CAB/SharePoint policy
- Scraping private Teams chats broadly

## Permission model

| Surface | Default | Elevated (confirm) |
|---------|---------|--------------------|
| GitLab | read | none |
| Jira | read | comment / label |
| Agile LM | read | none |
| Confluence | read | none |
| SharePoint | read metadata | none |
| Teams | none | post to one webhook |
| Git repo `releases/` | write | commit pulses |

## Runtime shapes

### A. Cursor Cloud Agent timers (recommended start)
Same as weekly investment workflow: `subscribe_timer` → load automation prompt → write `releases/` → chat Niloo.

### B. Cursor Automation / scheduled agent
When Agents Window email/Teams delivery is ready, point it at `automations/platform-release-daily-pulse.md`.

### C. Teams-first (org-standard)
Power Automate orchestrates; Cursor/BDK agent is the brain behind an HTTP webhook. Use if IT restricts outbound agents but allows PA.

## Success metrics

- % workstreams with named DRI before T−10
- Age of oldest unowned P1
- Go/no-go packs delivered on T−5 and T−2 without scramble
- Post-release: count of “we didn’t know X was in” incidents → should trend to 0
- Human time in status meetings (goal: cut ruthlessly; replace with pulses)
