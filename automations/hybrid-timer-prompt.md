# Timer prompts — Weekly Decision Agent (hybrid)

Source of truth for Cloud Agent `subscribe_timer` follow-ups.  
Full pipeline: [`weekly-decision-agent.md`](weekly-decision-agent.md) · human map: [`../WEEKLY-WORKFLOW.md`](../WEEKLY-WORKFLOW.md)

---

## Sunday — week ahead

**Name:** `portfolio-week-ahead`  
**Cron (UTC):** `0 22 * * 0` → Sun 18:00 ET (EDT)

```text
Run the Weekly Decision Agent (Sunday week-ahead) for Niloo.

Follow automations/weekly-decision-agent.md + WEEKLY-WORKFLOW.md + knowledge-base/07-weekly-decision-framework.md + portfolio-digest skill.

1. Load knowledge-base/, WEEKLY-WORKFLOW.md, HYBRID.md, last digest.
2. Sense: Yahoo prices for core + sleeve watchlist; Trends MCP (get_growth + Google Trends + X Trending). If Invalid API key → say auth/quota failed (never "not connected").
3. Web research: week calendar (Fed, CPI, earnings, geopolitics) + AI/oil/copper themes.
4. Write digests/YYYY-MM-DD-week-ahead.md (week-ahead template from weekly-decision-agent.md).
5. Commit, push, update PR.
6. Paste the full brief in chat.
7. Refresh Sun/Wed/Fri timers if near expiry.
8. Rules: not financial advice; no leverage/options/pennies; never invent prices; never mention age; prefer explanations Niloo can understand.
```

---

## Wednesday — midweek pulse

**Name:** `portfolio-digest-wed`  
**Cron (UTC):** `0 14 * * 3` → Wed 10:00 ET (EDT)

```text
Run the Weekly Decision Agent (Wednesday midweek) for Niloo.

Follow automations/weekly-decision-agent.md + WEEKLY-WORKFLOW.md + knowledge-base/07-weekly-decision-framework.md + portfolio-digest skill.

1. Load knowledge-base/, WEEKLY-WORKFLOW.md, HYBRID.md, last digests.
2. Sense: live Yahoo prices; Trends MCP first. Auth/quota failed if key errors — never "not connected".
3. Short regime + theme check (oil, rates, AI power/hardware).
4. Write digests/YYYY-MM-DD-midweek.md in EASY-READ skill format (one sentence, do/skip tables, short context — no dense price dumps).
5. Commit, push, update PR.
6. Paste the full digest in chat.
7. Refresh timers if near expiry.
8. Rules: max 5 do-rows; always include skips; not financial advice; never invent prices; never mention age.
```

---

## Friday — full decision report

**Name:** `portfolio-digest-fri`  
**Cron (UTC):** `5 20 * * 5` → Fri 16:05 ET (EDT)

```text
Run the Weekly Decision Agent (Friday decision report) for Niloo.

Follow automations/weekly-decision-agent.md + WEEKLY-WORKFLOW.md + knowledge-base/07-weekly-decision-framework.md + portfolio-digest skill.

1. Load knowledge-base/, WEEKLY-WORKFLOW.md, HYBRID.md, prior midweek + last Friday.
2. Sense: full Yahoo watchlist; Trends MCP; web research on regime + world themes.
3. Decide: Core / Sleeve / Skip with size caps. Include world-theme scan (oil, AI hardware, AI power, copper, defense). Optional CMPS only as tiny curiosity.
4. Write digests/YYYY-MM-DD-eow.md with:
   - Easy-read one sentence + do/skip tables
   - Explained shopping list (what / why / how much / what could go wrong)
   - What worked / didn’t
   - Learning tags vs prior week when possible
   - Look at next
5. Commit, push, update PR.
6. Paste the FULL report in chat (explanations included — Niloo finds short tables alone too thin).
7. Refresh Sun/Wed/Fri timers.
8. Rules: not financial advice; no leverage/options/pennies; never invent prices; never mention age; speculative biotech ≤1.5%.
```

---

## DST note

EDT = UTC−4 (crons above). In EST (UTC−5), add +1 hour to each UTC cron minute/hour as needed.
