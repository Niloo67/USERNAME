---
name: platform-release
description: >-
  Coordinate multi-team platform releases for Niloo: join Jira/Agile LM/GitLab
  evidence, score risks, emit pulses and go/no-go packs, list her next actions.
  Use when tracking a platform release, raising delivery risks, or asking what
  to do before launch.
---

# Platform release skill

## When to use
- User mentions platform release, release train, go/no-go, multi-team launch
- Timers: daily pulse / T−n go-no-go
- “What do I need to do?” during an active release

## Every run
1. Load `PLATFORM-RELEASE-WORKFLOW.md` + `knowledge-base/platform-release/*` + active `releases/<id>/`.
2. Follow `automations/platform-release-coordinator.md`.
3. Prefer tools in `.cursor/skills/platform-release/references/mcp-stack.md`.
4. Write outputs under `releases/<id>/` using templates.
5. Max 5 actions for Niloo; advisory only; no prod mutations.

## RAG quick meanings
- **Green:** evidence links present and gates clear
- **Amber:** in progress or unverified claim
- **Red:** failed gate or missing DRI/evidence on critical path
