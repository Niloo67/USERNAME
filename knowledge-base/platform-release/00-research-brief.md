# Research brief — multi-team platform releases

Synthesized from industry practice (MinimumCD, Azure microservices CI/CD, SAFe release-on-demand, Google/Netflix progressive delivery, enterprise feature-flag release management, and release-manager SOPs). Dated for Niloo’s stack: Jira, Confluence, SharePoint, GitLab, Teams, Agile LM.

## The problem people actually have

When many services and many managers share one “platform release,” failure modes cluster:

1. **Nobody owns the whole.** Each manager is green on their slice; the integration is red.
2. **Deploy = release.** Teams wait on each other’s deploy windows instead of shipping behind flags.
3. **Dependencies are tribal.** “We’ll sync in Slack/Teams” does not create a required-by date or verification method.
4. **Evidence is storytelling.** “QA signed off” without pipeline URL, test report, or runbook link.
5. **Approvals live outside the path.** CAB PDFs in SharePoint and chat thumbs-up diverge from what GitLab actually shipped.
6. **Rollback is a meeting.** If reverse takes hours, blast radius is organizational, not technical.

## Two operating models (use both deliberately)

### Model A — Independent deploy + coordinated launch (default)

- Each team owns GitLab project → pipeline → production deploy.
- API/schema changes use expand/contract and contract tests.
- User-visible platform behavior turns on via **shared feature flags / rings**.
- “Platform release day” = launch owner flips exposure + comms, not a 12-service merge party.

**Used by:** high-maturity microservice orgs (Spotify-style flag discipline; Netflix canary for *deploy* risk; Google progressive launch).

### Model B — Release train / meta-release (exception path)

- Board component releases onto a dated train (Agile LM / Jira fix-version / meta-release).
- Shared readiness board; train publishes when boarded items are green + approved.
- Appropriate for coupled cutovers, regulated change windows, or marketing-locked launches.

**Rule of thumb:** if the only reason for a train is “managers like one date,” prefer Model A. If contracts or data make independent deploy unsafe, use Model B **and** list the coupling explicitly.

## What high-performing orgs standardize

| Layer | Practice | Why |
|-------|----------|-----|
| 1. Separate events | Deploy ≠ release | Stops cross-team deploy queues |
| 2. Contracts | Versioned APIs, contract tests | Independence without breakage |
| 3. Templates | Same rollout stages for every feature | Predictable risk language |
| 4. Embedded approvals | Approvals in workflow + audit trail | SharePoint/CAB sync without theater |
| 5. Signals | Error/latency gates pause rollouts | Less 11pm judgment |
| 6. Control plane | One board of active rollouts | Catch collisions early |

Sources of pattern: Unleash enterprise release management layers; Software Engineering Guide progressive delivery trade-offs; Reloqui-style train boards as coordination *over* independent releases.

## Release manager SOP (8 exits)

Adapted from enterprise release-management playbooks — each stage has an **exit** the agent can check:

1. **Register** — release ID, scope, product owner, committed vs proposed.
2. **Plan dependencies** — each dep has owner, due time, verification method.
3. **Collect evidence** — GitLab SHA/pipeline, test results, security, env parity.
4. **Readiness & risk** — gaps = resolved / accepted / blocking.
5. **Authorized decision** — named approver, time, conditions (no approval-by-silence).
6. **Controlled execution** — runbook + live log; stop if reality ≠ approval.
7. **Validate & hand over** — smoke/health ≠ “deploy job green.”
8. **Close & learn** — planned vs actual; corrective actions with owners.

## Go/no-go — blocking vs negotiable

**Blocking (must be yes):**

- Acceptance criteria met for in-scope P0
- Required automated suites passing (cite runs)
- No open critical/high security findings without waiver
- Monitoring/alerts for new paths
- Rollback/flag-off tested or rehearsed
- Named workstream DRIs confirm ready
- Required SharePoint/CAB approvals recorded

**Negotiable (document conditions):**

- Non-P0 polish
- Load tests at 2× peak
- Perfect docs
- 100% flag cleanup from prior release

## Agentic systems that work (and what fails)

**Works:**

- Freeze a **release manifest** (IDs, SHAs, links).
- Parallel specialist checks (code risk, scope/blockers, ops readiness).
- Structured output: SHIP / CAUTION / HOLD + score + **human action list**.
- Human-in-the-loop before any external write.
- Audit log of packet + decision.

Examples in the wild: release-readiness agents joining GitHub/Linear/Sentry/Slack; AI-gated deploy with Slack approval; read-then-confirm write workflows across issue trackers and chat.

**Fails:**

- Agent with write access to merge + deploy “to be helpful”
- Free-form essays instead of a schema
- Treating Teams reactions as CAB approval
- One giant prompt with every Confluence page (context sludge)

## Implications for Niloo’s stack

| Tool | Agent role |
|------|------------|
| Jira | Scope, blockers, fix versions, comments |
| Agile LM | Train boarding, milestone dates, ALM status |
| GitLab | MR/pipeline/tag/deploy evidence (MCP or API) |
| Confluence | Runbooks, design, release notes |
| SharePoint | Formal approval packets |
| Teams | Daily pulse + decision thread (Power Automate webhook) |

Cursor Cloud Agent can run the loop on a schedule (same pattern as the weekly investment workflow). Prefer **read MCP/API + Teams outbound webhook** over giving the agent broad tenant admin rights.

## Further reading (bookmarks)

- MinimumCD — Independent teams, independent deployables
- Microsoft Learn — CI/CD for microservices
- SAFe — Release on demand / continuous delivery pipeline
- Netflix Tech Blog — Kayenta automated canary analysis
- Google SRE — Reliable product launches
- Unleash — Enterprise release management at scale
- Feature flags across microservices — shared evaluation context
