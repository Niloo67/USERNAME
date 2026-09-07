# System architecture — building something big

Target: a durable **Portfolio Intelligence** system that emails Niloo midweek and end-of-week, grounded in a growing knowledge base.

## North-star diagram

```text
┌─────────────────────────────────────────────────────────────┐
│  KNOWLEDGE BASE (this repo)                                 │
│  sources · educators · signal rules · allocation policy     │
└───────────────────────────┬─────────────────────────────────┘
                            │ loads every run
┌───────────────────────────▼─────────────────────────────────┐
│  CURSOR AUTOMATION (Wed 10:00 ET · Fri 16:05 ET)            │
│  skill: portfolio-digest · Memories · optional computer use │
└───────┬───────────┬───────────┬───────────┬─────────────────┘
        │           │           │           │
   Trends MCP   Market MCP   X/Grok MCP   Web/research
   (Google+X)   (prices,     (mentions)   (EDGAR, FRED,
                 sectors)                  outlooks)
        │           │           │           │
        └───────────┴─────┬─────┴───────────┘
                          ▼
                 Score + conflict check
                          ▼
        ┌─────────────────┴─────────────────┐
        │  OUTPUTS                            │
        │  1. Email (Resend) → niloo@…        │
        │  2. digests/YYYY-MM-DD-*.md         │
        │  3. Memories update                 │
        └─────────────────────────────────────┘
```

## Repo layout (big knowledge base)

```text
knowledge-base/          ← durable doctrine (read first)
.cursor/skills/          ← agent runtime instructions
automations/             ← Cursor Automation prompts
digests/                 ← historical outputs (learning set)
.cursor/mcp.json.example ← tool wiring
SETUP.md                 ← human activation checklist
```

## Build phases

### Phase 1 — Foundation (now)

- [x] Skill + automation prompt
- [x] Knowledge base (sources, people, signals, architecture)
- [ ] Connect Trends + Resend + FinancialMCP keys
- [ ] Activate Wed/Fri automation; one successful test email

### Phase 2 — Quality loop (after 4+ digests)

- Tag each digest idea later as hit / miss / early / wrong-regime in Memories
- Add a “critic” paragraph: strongest bear case for every buy nudge
- Expand watchlist tickers/sectors the agent always checks

### Phase 3 — Depth (optional, when you want “big”)

| Add-on | Purpose |
|--------|---------|
| SEC EDGAR / 8-K watcher | Hard facts on catalysts |
| FinBERT or news MCP | Cleaner news polarity than raw X |
| FRED series pack | Regime dashboard every run |
| Multi-agent debate | Bull vs bear synthesizer (Pattern B) |
| Simple dashboard | Render digests as HTML in-repo |

### Phase 4 — Explicitly out of scope (for this investor profile)

- Auto-trading / Alpaca live orders
- Leveraged ETFs as core
- Minute-level X firehose day trading

## Allocation policy (locked defaults)

| Sleeve | Target | Vehicles |
|--------|--------|----------|
| US core | 40–50% | VTI / ITOT |
| International | 15–25% | VXUS / EFA+EEM |
| Quality / dividend | 5–10% | SCHD / QUAL / VTV |
| Growth tilt | 5–15% | QQQ (prefer over concentrated SMH) |
| Cyclical satellite | 0–10% | XLF, XLE, XLI, XLV tactically |
| Ballast | 10–20% | SHY / BND (prefer shorter duration when yields hostile) |
| Gold optional | 0–5% | GLD / IAU |

## Ops checklist

1. Keys only in Cursor MCP / Automation secrets — never commit.
2. After each month, skim `digests/` and update `knowledge-base/` if a rule was wrong.
3. Rebalance real brokerage quarterly; digests are nudges.
4. If Trends or X MCP is down, still send email using Tier 1–2 data + say what failed.

## Success metrics

| Metric | Target |
|--------|--------|
| Emails delivered Wed + Fri | ≥90% of scheduled weeks |
| Ideas with cited sources | 100% |
| Core allocation drift | Agent reminds when >5% off target |
| Hype traps avoided | Explicit “what NOT to chase” every digest |
| Knowledge base growth | ≥1 improvement note / month |
