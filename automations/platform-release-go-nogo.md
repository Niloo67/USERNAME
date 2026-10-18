# Timer prompt — go/no-go pack

Run at **T−5**, **T−2**, and morning of **T−0** (launch day) per dates in the active manifest.

1. Follow `automations/platform-release-coordinator.md`.
2. Output type: **go/no-go pack** using `releases/_templates/go-nogo.md`.
3. Re-verify every blocking gate with fresh links (pipelines, approvals, runbooks).
4. Include a “strongest reason to HOLD” critic paragraph even if recommendation is SHIP.
5. Leave **Decision** blank for humans; draft proposed conditions if CAUTION.
6. Deliver file + chat; ask Niloo before any Teams/Jira write.
