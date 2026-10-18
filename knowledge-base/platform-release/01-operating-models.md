# Operating models — when to train, when to free-ship

## Decision tree

```text
Is the change user-visible AND cross-service atomic?
          │
          ├─ No → Independent deploy (Model A)
          │         Use contract tests + optional soft launch date
          │
          └─ Yes → Is there a hard coupling (schema/API/data)?
                    │
                    ├─ No → Model A + shared feature flag launch
                    │
                    └─ Yes → Model B release train (board + gates)
```

## Model A checklist (independent)

- [ ] Backward-compatible API or dual-write/expand phase done
- [ ] Consumer contract tests green in GitLab
- [ ] Feature flag (or config) owns user exposure
- [ ] Each workstream can deploy any weekday without platform DRI
- [ ] Launch owner owns % rollout / comms only

## Model B checklist (train)

- [ ] Coupling written in one sentence on the manifest
- [ ] Agile LM / Jira meta-release lists boarded components
- [ ] Each boarded item has DRI + ready criteria + rollback
- [ ] Order of deploy documented (if order matters)
- [ ] Abort criteria: which red item stops the whole train
- [ ] Rehearsal or dry-run completed for the coupled path

## Hybrid (most platform releases)

Many “platform releases” are hybrid:

1. Teams deploy throughout the week (Model A).
2. Train date is the **launch** of the flag + marketing + support readiness (coordination).
3. Only the coupled subset is truly gated on the train.

The agent should label each workstream: `independent` | `train-gated` | `launch-only`.
