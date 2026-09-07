# Successful setup patterns

What works when people build automated stock research / digest systems (2024–2026 open-source and institutional patterns).

## Pattern A — Scheduled research agent + email (best fit for you)

**Winner for a busy person in their 30s.**

| Piece | Choice |
|-------|--------|
| Scheduler | Cursor Automations (Wed + Fri cron) or GitHub Actions cron |
| Brain | Cloud agent with a written skill + memories |
| Data | HTTP MCPs (Trends, market data) + web research fallback |
| Delivery | Resend email (or Slack) |
| Memory | Persist prior calls, false positives, watchlist |

**Why it wins:** low ops, human-readable output, easy to improve the prompt/skill over time, no need to run servers 24/7.

**Examples of the pattern:** thesis-engine (multi-layer monitor + email), Firecrawl+Cursor Automations digests, Resend MCP email from agents.

## Pattern A2 — n8n / Make low-code digest (strong alternative)

The most-copied open DIY pattern (2024–2026 blog/templates):

```text
Cron → watchlist (Sheets) → EODHD/Alpha Vantage prices+news
     → Code node (classify movers) → AI summarize → Gmail/Resend
```

**Pros:** visual debugging; deterministic fetch before AI; cheap to run.  
**Cons:** you maintain another platform; weaker “Memories / knowledge base” unless you add Airtable/DB.  
**When to pick A2:** you prefer drag-and-drop workflows over Cursor Automations.  
**Shared rule with A:** fetch numbers first; AI only narrates (n8n production AI playbook).

## Pattern B — Multi-agent research pipeline

Separate agents for: prices → news/sentiment → fundamentals → synthesizer → critic.

Seen in weekend builds with n8n multi-agent steps, CrewAI/LangGraph, FinSight-style stacks.

**Pros:** higher quality, conflict detection.  
**Cons:** more cost/complexity. Add this *after* Pattern A works for 4–8 weeks.

## Pattern C — Real-time streaming platform

Kafka + sentiment scoring + Grafana (e.g. stock-sentiment-platform).

**Pros:** production-grade monitoring.  
**Cons:** overkill for twice-weekly digests. Skip unless you later want day-trading alerts (you don’t, for a 30s balanced portfolio).

## Cursor vs n8n (decision table)

| Need | Prefer Cursor Automations | Prefer n8n |
|------|---------------------------|------------|
| Already in Cursor daily | ✓ | |
| Want visual workflow editor | | ✓ |
| Knowledge base + skill in git | ✓ | harder |
| Cross-week Memories | ✓ built-in | DIY store |
| Strict cost predictability | | often cheaper |
| Trends + X MCP already in Cursor | ✓ | re-wire APIs |

**Recommendation:** start with **Cursor Pattern A** (this repo). Revisit n8n only if you outgrow it or want a second redundant email path.

## What successful systems share

1. **Layered signals** — never one source alone (price + news + social + macro).
2. **Evidence discipline** — don’t invent numbers; mark missing data; cite sources.
3. **Deterministic data, then AI** — prices/news fetched by tools; model writes the narrative.
4. **Risk engine / position rules** — allocation caps before “what’s hot.”
5. **Memory / learning** — track which calls were wrong so the agent improves.
6. **Human-in-the-loop delivery** — email/Slack summary, not auto-trading for this profile.
7. **Cost control** — cache quotes, use cheap models for scraping, expensive models for synthesis.
8. **Idempotency** — don’t double-send the same digest on retries.

## What fails

| Failure mode | Fix |
|--------------|-----|
| Trading off X hype alone | Require fundamental + risk-fit confirmation |
| Overfitting Google Trends keywords | Use Trends as *attention*, not alpha; prefer week-over-week change |
| No allocation policy | Lock 70–85% equity core *before* satellite ideas |
| No archive | Write every digest to `digests/` |
| Auto-executing trades | Out of scope for v1 — research only |
| Ignoring macro (rates, oil, VIX) | Always start with regime snapshot |

## Recommended path for this project

```text
Week 0  Knowledge base + skill (this repo)     ← you are here
Week 1  MCP keys + Cursor Automation + test email
Week 2–4  Tune prompt from real digests; grow Memories
Month 2+  Optional: multi-agent critic, FinBERT, EDGAR depth
```

Do **not** start with Kafka or LSTM price predictors. Start with Pattern A.
