# Risk rules — how the agent raises alarms

Scoring is deterministic first, LLM narrative second. Never let prose override a hard red gate.

## Severity

| Level | Meaning | Agent behavior |
|-------|---------|----------------|
| **P0** | Blocks launch or safe rollback | HOLD recommendation; page Platform DRI actions |
| **P1** | Likely date slip or partial launch | CAUTION; escalate owner within 24h |
| **P2** | Hygiene / drift | Track; mention in pulse footer |
| **P3** | FYI | Log only |

## ROAM on every active risk

| State | Definition |
|-------|------------|
| **R**esolved | Evidence of fix linked |
| **O**wned | Named human + next check date |
| **A**ccepted | Named approver accepted residual risk in writing |
| **M**itigated | Workaround in place; still watch |

Unowned risks auto-escalate to Platform DRI after **48h** (P1) or **4h** (P0).

## Signal catalog

### Scope & ownership
| Signal | Gate | Severity |
|--------|------|----------|
| Workstream missing DRI person | red | P0 |
| Manager listed but no DRI | amber→red after 48h | P1 |
| Jira scope added after freeze without change control | amber | P1 |
| Agile LM boarded ≠ Jira fix-version set | amber | P1 |

### Delivery evidence (GitLab)
| Signal | Gate | Severity |
|--------|------|----------|
| No pipeline URL for claimed-ready workstream | red | P0 |
| Default-branch pipeline failing | red | P0 |
| Open MR required for train-gated item | red | P0 |
| Staging deploy older than agreed SHA | amber | P1 |
| Migration/job without rollback note | red | P0 |

### Docs & approvals
| Signal | Gate | Severity |
|--------|------|----------|
| Confluence runbook missing/stale (> freeze date) | amber/red if prod-critical | P1/P0 |
| SharePoint approval missing for gated release | red | P0 |
| Teams “LGTM” without SharePoint/Jira record | ignore as approval | — |

### Dependencies
| Signal | Gate | Severity |
|--------|------|----------|
| Upstream due date &lt; 2 business days and not green | amber | P1 |
| Upstream red and downstream claims ready | red | P0 |
| Circular dependency without sequence plan | red | P0 |
| Shared flag key disagreeing across services | red | P0 |

### Timeline
| Signal | Gate | Severity |
|--------|------|----------|
| Critical path slack &lt; 1 day | amber | P1 |
| T−2 with any P0 open | red | P0 |
| Launch date moved twice without re-baseline | amber | P2 |

## Composite recommendation

```text
if any P0 open and not Accepted → HOLD
else if any P1 open → SHIP WITH CAUTION
else → SHIP (still needs human GO)
```

Human can override to GO-with-conditions; agent must record conditions as owned risks.

## “What do I need to do?” ranking (for Niloo)

Personal action queue order:

1. Decisions only she can make (scope cut, date move, accept risk)
2. Escalations to other managers (draft the ask)
3. Missing artifacts she owes (SharePoint pack, Confluence page)
4. Confirmations to collect (one-line pings)
5. FYI reads

Max **5** primary actions per daily pulse.
