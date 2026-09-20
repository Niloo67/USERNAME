# Timer prompt — Portfolio Digest (hybrid)

Copy used by Cloud Agent `subscribe_timer` follow-ups.

```text
Run the portfolio-digest skill for Niloo (balanced-growth).

1. Read knowledge-base/ (esp. 04-signal-philosophy, 05-architecture) and HYBRID.md.
2. Fetch live market data (Yahoo chart API or available MCPs): SPY/VTI, QQQ, IWM, VXUS/EFA, sector ETFs, BND/SHY, GLD, VIX, 10Y (^TNX), oil if relevant.
3. Always call Trends MCP first when available (get_growth for a few watchlist keywords; get_top_trends for Google Trends and X (Twitter) Trending). If Invalid API key / rate limit, say auth/quota failed — never "not connected" — continue without inventing scores.
4. Add brief macro/news context from reputable web sources.
5. Write the digest in the skill's EASY-READ format (one sentence, What to do / What to leave alone tables, short context — no dense price dumps).
   Wed → digests/YYYY-MM-DD-midweek.md
   Fri → digests/YYYY-MM-DD-eow.md (same shape + what worked / what didn’t).
6. Commit and push; update the PR if one exists.
7. Put the full easy-read digest in the chat reply.
8. Rules: no leverage/options/pennies; max 5 “do this” rows; always include skips; not financial advice; never invent prices; never mention investor age.
```
