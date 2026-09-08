# Timer prompt — Portfolio Digest (hybrid)

Copy used by Cloud Agent `subscribe_timer` follow-ups.

```text
Run the portfolio-digest skill for Niloo (balanced-growth).

1. Read knowledge-base/ (esp. 04-signal-philosophy, 05-architecture) and HYBRID.md.
2. Fetch live market data (Yahoo chart API or available MCPs): SPY/VTI, QQQ, IWM, VXUS/EFA, sector ETFs, BND/SHY, GLD, VIX, 10Y (^TNX), oil if relevant; plus watchlist names as needed.
3. **Always call Trends MCP first** when available (`get_growth` for watchlist keywords; `get_top_trends` for `Google Trends` and `X (Twitter) Trending`). If the tool errors with Invalid API key / rate limit, say **auth/quota failed** — never “not connected” — and continue with price + macro only (do not invent Trends scores).
4. Add brief macro/news context from reputable web sources (Fed, oil/geopolitics, sector rotation).
5. If weekday is Wed → midweek digest. If Fri → end-of-week digest. Otherwise choose the closer format and label clearly.
6. Write digests/YYYY-MM-DD-midweek.md or digests/YYYY-MM-DD-eow.md with the email-style body from the skill.
7. Commit and push the digest to the current feature branch; update the PR if one exists.
8. Put the full digest summary in your chat reply for Niloo to review here.
9. Rules: no leverage/options/pennies; max 7 ideas; include what NOT to chase; not financial advice; never invent prices. Do not mention the investor's age.
```
