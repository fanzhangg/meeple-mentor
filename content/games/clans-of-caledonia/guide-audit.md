# Clans of Caledonia guide audit

## Scope and authority

Reviewed on 2026-09-15 against both supplied 12-page base-game rulebooks. The 2025-06-08 Chinese edition governs port 7, corroborated by the publisher's erratum. `rules-review.md` records links, terminology and edition differences. Industria is excluded; Kickstarter content is explicitly optional. The organized English/Chinese rules describe mechanical rules rather than reproducing every historical paragraph.

## Coverage

| Topics | Evidence | Checks |
| --- | --- | --- |
| Setup, turn sequence, pass | Both PDFs pp. 2–4, 6 | Reverse clan choice; paid snake-order starting workers; round versus turn; eight actions; passing ends actions; fifth-round production still occurs |
| Trade and contracts | pp. 4–6; export-board image p. 2 | One good per trade; one merchant per item; all items use pre-trade price; buy/sell restriction; contract fees +£5/£0/−£5/−£10/−£15; no discarding unfinished contracts |
| Expansion and upgrades | pp. 3–6; player-board artwork p. 3 | Unit and land costs; top-of-column supply; one unit per hex; terrain; shipping; normal £10 technology versus £5 bonus technology |
| Placement bonuses | p. 5; publisher FAQ | No river for neighbouring; same-good cap is total per turn, not per adjacent producer; 3/4 player cap versus 2-player cap; fourth processed-good factory only |
| Fulfilment and direct bonuses | p. 6 | Slaughter only to fulfil meat; no separate slaughter turn; loss of production and freed land; imported markers; free land still pays the unit; bonus order |
| Production | p. 7 | Worker income 4/6, upgraded 6/8; field produces two grain; processing consumes one input per factory; same-phase basics usable |
| Scoring | pp. 7–10 | Production precedes round score; stock not consumed; complete pairs; import rarity and tie priority; contract ranking versus settlement ranking; tie splitting; leftover-money final tie break |
| Settlements | p. 8 and diagram | A no-river cluster is one settlement; count the largest shipping-connected network; red diagram gives 3 connected of 4, black 5; not area size |
| Clans and ports | pp. 10–12; publisher rules/FAQ | Eight standard clans versus optional MacEwen; two-unit port permits both placement bonuses in selected edition; Buchanan separate bonus/main purchases charged separately |
| Solo and variants | pp. 8–10; publisher FAQ | Block £1 land; three different market rolls; five face-up contracts after removal; £16 pass; solo ranking thresholds; rarity remains 3/4/5 unless static variant chosen |

## Visual evidence

Crops were extracted from the English PDF at 180 dpi using rectangles first inspected at 90 dpi. Every crop was visually checked as a contact sheet. Numbers, unit icons and arrows are retained; surrounding headings and prose are excluded. Chinese and English explanations are rendered as text outside the artwork.

| File | PDF page | What it verifies |
| --- | --- | --- |
| map.png | 2 | Extracted map artwork, retained as a source asset |
| coverart.webp | User attachment | User-supplied box cover used in the library and guide header |
| player-board.png | 3 | Unit supply and five un-hired merchants |
| trade.png | 4 | Two whisky at £10 cost £20, then price rises to £12 |
| shipping.png | 5 | No-shipping / river / one-loch reach and illegal jumps over land |
| contract.png | 6 | 1 bread + 1 cheese + 1 whisky → 3 tobacco + 2 bonus upgrades + £10 |
| port-reach.png | 6 | Adjacent black unit versus red requiring two-loch reach |
| production.png | 7 | Milk → cheese; grain → bread or whisky |
| settlements.png | 8 | Count connected settlements rather than occupied spaces |

## Verification performed

- Twenty automated tests passed across the new guide, existing guides and shared chat. These cover language/schema parity, unique valid questions and references, preserved correct/wrong/unanswered quiz state, retry/reset, asset/library resolution, all four game slugs in both languages, isolated rules context, ordered chat history, invalid-history rejection, and safe reply formatting. Provider responses in automated tests are mocked.
- Browser checked in Chinese and English: a correct and incorrect quiz answer, correcting a wrong answer, preserved answers through language switching, reset to zero, working contents links and expandable details.
- Desktop and 390×844 mobile views inspected, including the shipping figure and chat. No horizontal document overflow or broken loaded images; no console errors observed. Viewport override restored afterward.
- Live configured chatbot: a three-player neighbourhood question correctly capped cheese at 3; “What if there are only two players?” correctly followed the previous topic and changed the cap to 4. Chinese port-7 question correctly allowed neighbourhood bonuses under the selected rule version.
- Shared chat has no headings or speaker names, uses localized prompt text, and displays only dots while waiting. New game uses the shared controller and in-memory conversation, not keyword lookup.

No remaining discrepancies were found in the published guide against the selected edition and the explicitly recorded publisher clarifications. This is a source-based review, not a guarantee that generated chatbot responses can never err. MacEwen's supplied £9 amount remains explicitly provisional and optional.
