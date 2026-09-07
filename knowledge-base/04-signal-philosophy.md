# Signal philosophy — Trends, X, and logic

How to combine Google Trends, X mentions, and market data **without** pretending social buzz is alpha.

## The hierarchy

```text
1. Risk capacity & target allocation   (age 30s → equity-heavy but diversified)
2. Market regime                       (rates, VIX, breadth, oil, USD)
3. Fundamentals / valuations           (earnings, balance sheet, filings)
4. Price context                       (52w range, relative strength)
5. Attention sensors                   (Google Trends, X, news volume)
```

Steps 5 **never** override steps 1–3. Attention only ranks *what to investigate* and flags crowding.

## Google Trends — what research actually says

**Useful for:** measuring rising public attention; comparing tickers/sectors week-over-week; spotting retail FOMO early.

**Not reliable alone for:** predicting next-week returns. Academic work shows:

- Keyword choice dominates results; random finance keywords often add no edge ([arXiv:1307.4643](https://arxiv.org/abs/1307.4643) and related)
- Famous “debt → DJIA” style results often **collapse once look-ahead bias is removed** (“Big Data, Small Pickings,” *Journal of Index Investing*)
- Data are **relative** (0–100), revised, noisy (~rounding/error), and biased toward Google users
- Search spikes can mean good news *or* fear — ambiguous without news/price context ([arXiv:1403.1715](https://ar5iv.labs.arxiv.org/html/1403.1715))
- Investor-attention papers (e.g. Da–Engelberg–Gao “In Search of Attention”) support Trends as an *attention* proxy — not a standalone alpha factory
- Look-ahead / normalization issues break naive backtests

### Agent rules for Trends

| Do | Don’t |
|----|-------|
| Prefer **WoW / MoM change**, not absolute level | Treat “100” as “must buy” |
| Require ≥2 consecutive rising weeks for “momentum” | Trade a 1-day spike |
| Pair with news polarity (good vs bad attention) | Ignore why people search |
| Compare peers on the same query window | Mix daily and weekly scales carelessly |
| Mark data unavailable if API fails | Invent a Trends score |

## X / Twitter — what it’s good for

**Useful for:** narrative detection, meme-risk flags, event awareness, influencer-driven volume spikes.

**Dangerous for:** buy signals. Retail X is crowded with hindsight, bots, and paid promotion.

### Agent rules for X

1. Measure **mention volume change** + theme clustering, not follower-count vibes.
2. Down-rank tickers where discussion is mostly emojis / “to the moon” / options lotto.
3. Up-rank (for *investigation*) when mentions cite earnings, filings, or macro facts — then verify those facts in Tier 1–2 sources.
4. If X is hot and fundamentals are weak → **Avoid / trim candidate**, not buy.
5. Optional: require verified / high-engagement accounts for “quality social” score.

## Logical scoring (used by the skill)

Each idea scored 0–5 on:

1. Trend momentum (sustained, not spike)
2. Social quality (informed vs meme)
3. Fundamental setup
4. Risk fit for 30s balanced sleeve
5. Crowding risk (invert euphoria)

**Promote only when** fundamentals + risk fit are solid; Trends/X may boost priority or warn of crowding.

## Worked examples (logic)

| Situation | Interpretation | Action bias |
|-----------|----------------|-------------|
| Trends ↑, X meme ↑, PE extreme, no earnings support | FOMO | Avoid |
| Trends ↑, X cites earnings beat, RS strong, fits satellite sleeve | Investigate | Small add / watch |
| Trends flat, X quiet, valuation reasonable, sector in institutional rotation, price confirms | Quiet opportunity | Core/satellite OK |
| Trends ↑ on “bankruptcy” + price crash | Fear attention | Not a buy signal |
| Oil shock narrative + XLE already +15% in 1m | Story priced in | Wait / small size |

## Portfolio implication for your 30s

- **~70–85% equities** in boring broad ETFs (VTI, VXUS, quality tilt)
- **~15–30% ballast** (short/intermediate bonds; optional small gold)
- **Satellites ≤20–25% of equities**, each name 1–3%
- Digests suggest **nudges**, not weekly wholesale portfolio rebuilds

This matches evidence-based practice (Felix / Bogleheads / lifecycle portfolio research): high equity share while human capital is large, diversification over stock-picking skill.
