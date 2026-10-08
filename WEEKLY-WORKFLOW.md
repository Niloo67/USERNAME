# Weekly agentic investment workflow

Niloo’s recurring system: an agent researches the world + markets, scores ideas against your rules, and delivers a **decision pack** you can act on — without day-trading noise.

> Not financial advice. Research workflow only.

---

## What you get each week

| When (ET) | Agent run | You get | Your job (~10–20 min) |
|-----------|-----------|---------|------------------------|
| **Sunday ~18:00** | Week-ahead brief | Themes + calendar + “watch these” | Skim; note questions in chat |
| **Wednesday ~10:00** | Midweek pulse | Short do / skip tables | Nudge contributions if soft |
| **Friday ~16:05** | Full decision report | Explained shopping list + what worked | Place or skip buys for next week |

Files land in `digests/` and in this Cloud Agent chat. Later: email (Phase 3) + dashboard (Phase 2).

**Generic vs personal:** weekly digests are for a generic balanced-growth reader. Niloo’s TFSA holdings live in `portfolio/` and must stay out of Sun/Wed/Fri reports unless she asks for a personalized review (`digests/*-tfsa-*.md`).

---

## Agentic loop (every run)

```text
┌─────────────┐
│ 1. LOAD     │  knowledge-base/ + WEEKLY-WORKFLOW.md + last 2 digests
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. SENSE    │  Prices (Yahoo) · Trends MCP · news/macro · world themes
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. REASON   │  Hierarchy: allocation → regime → fundamentals → price → attention
└──────┬──────┘
       ▼
┌─────────────┐
│ 4. DECIDE   │  Core / sleeve / skip · size caps · bear cases
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. DELIVER  │  digests/*.md + chat · commit/push · refresh timers
└──────┬──────┘
       ▼
┌─────────────┐
│ 6. LEARN    │  Tag hit/miss next Friday · update watchlist in digest footer
└─────────────┘
```

Full agent instructions: [`automations/weekly-decision-agent.md`](automations/weekly-decision-agent.md)  
Decision rules: [`knowledge-base/07-weekly-decision-framework.md`](knowledge-base/07-weekly-decision-framework.md)  
Runtime skill: [`.cursor/skills/portfolio-digest/SKILL.md`](.cursor/skills/portfolio-digest/SKILL.md)

---

## Your locked portfolio shape

| Bucket | Target | Examples |
|--------|--------|----------|
| Canada core | Meaningful | VCN / XIC |
| US core | Largest growth engine | VFV / VUN (or VTI) |
| International | Diversifier | XEF / VIU / VXUS |
| Ballast | 10–20% | Short CAD bonds (prefer over long TLT when yields hostile) |
| Risk sleeve | ~**10%** total | Quality (GOOGL/MSFT) + world themes + optional tiny biotech |

**Hard caps**

- No leverage / options / pennies as primary ideas  
- Single speculative name (e.g. CMPS) ≤ **1.5%** of total  
- Theme satellites (oil, copper, nuclear, defense) usually **0.5–2%** each  
- Risk sleeve trim if it drifts above ~**12%**

---

## World-theme scan (every Friday at minimum)

Agent always checks these bottleneck maps:

| Theme | Bottleneck | Example vehicles |
|-------|------------|------------------|
| Energy security / conflict | Oil | SU.TO, XLE (tiny; don’t chase spikes) |
| AI hardware | Memory / semis | SMH, MU (small) |
| AI power | Nuclear / uranium / grid | CEG, CCJ, URA |
| Electrification | Copper | COPX, TECK.B.TO |
| Rearmament | Defense / cyber | ITA; CRWD on dips only |
| Optional curiosity | Psychedelics | CMPS ≤1.5% |

Detail: latest `digests/*-world-themes.md` when present.

---

## How you use the system (human workflow)

### Sunday
1. Open the week-ahead brief in chat or `digests/`.  
2. Reply with anything personal: “I have $X to invest,” “I’m heavy Canada,” “skip oil.”  
3. Agent will fold that into Wed/Fri (or reply immediately if you ask).

### Wednesday
1. Read the midweek pulse (2 minutes).  
2. Keep scheduled ETF contributions unless the digest says pause (rare).

### Friday / weekend
1. Read the **explained shopping list**.  
2. Act in TFSA/RRSP/taxable: core first, then sleeve.  
3. Optional: reply “bought X / skipped Y” so next week can score hits/misses.

### Anytime
Ask in this chat: “must buy today?”, “update on CMPS”, “world themes?” — same skill + framework, on demand.

---

## Activation (this Cloud Agent)

Timers use `cursor-subscriptions` → `subscribe_timer`:

| Name | Cron (UTC) | Local (ET, EDT) |
|------|------------|-----------------|
| `portfolio-week-ahead` | `0 22 * * 0` | Sun 18:00 |
| `portfolio-digest-wed` | `0 14 * * 3` | Wed 10:00 |
| `portfolio-digest-fri` | `5 20 * * 5` | Fri 16:05 |

Prompt source of truth: [`automations/hybrid-timer-prompt.md`](automations/hybrid-timer-prompt.md).

**Caveats**

- Timers die if this agent run is archived — recreate from that file.  
- Subscriptions expire ~7 days — agent should refresh after each delivery.  
- Trends MCP needs Cloud Agent API key ([`docs/fix-trends-mcp-cloud.md`](docs/fix-trends-mcp-cloud.md)).

---

## Success = better decisions, not more trades

| Good week | Bad week |
|-----------|----------|
| You funded core on schedule | You skipped core to chase a spike |
| Sleeve adds had a written bear case | You bought after +10% days with no size cap |
| Skip list prevented FOMO | Digest ignored; bought SNDK/energy at the top |

Review monthly: skim `digests/` and update `knowledge-base/` if a rule was wrong.
