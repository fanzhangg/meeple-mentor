# Recall guide audit — 2026-09-16

Authority: the supplied 16-page English Alion rulebook, ©2025, PDF modified 2026-01-06. Exact source hash, page rectangles and output sizes are recorded in `image-sources.json`. No other edition overrides it.

## Published rule coverage

| Topics / claims reviewed | PDF evidence | Checks |
| --- | --- | --- |
| Setup, draft and supplies | 1–5 | Starting crystals/cards/stones/objectives/followers; reverse-order paired selection; right starting tile face down for 1–2 players; ancient tribe/gadget setup |
| Turn and A–F actions | 5–6; p4 board enlarged | Empty slots, optional effects, copy used box rather than card; A buys 1/2/4 extra followers for white/red/purple, maximum four; B permits one crystal only |
| Recall and free actions | 7–8 | All used cards retrieved; different visible production spaces; stone use before recharge only; 1/2/3 incremental costs and fixed-cost exceptions; once per trigger |
| Crystals and followers | 4, 7–8 | Asymmetric conversion; six per colour at turn end; local/normal/new starting placement; large figure = three; limited follower supply |
| Movement and relicubes | 10 | Complete a movement effect before another effect; compulsory cube pickup; local costs 1/2/2/3/3; water cannot repeat a hex; upgraded C spreading |
| Reveal, camps and presence | 6, 8 | Adjacent REGION presence rather than adjacent hex; one point per different player; fill sites; camp once per player, including newly revealed camps |
| Buildings and excavation | 8–9 | One building per player per hex; local 1 + opponents cost; opponents gain one each; vault order and no crystal cost; workshop terrain/card match; monument scoring timing; excavation 3/2/1 stones → white/red/purple → 2/3/4 knowledge |
| Knowledge and upgrades | 10–11 | Step 3 first-player point and gadget choice; step 5 coloured stone plus both active/passive abilities; no overshoot; already-used box cannot use new upgrade this turn |
| Special rounds and scoring | 11–13 | 13 regular + four special; no keycard/Recall in special rounds; three specializations but all six base scores; A/B distinctions; rightmost cube only; resources combined before rounding; objective 15; white/gray/black tie order |
| Tribes, gadgets, objectives, solo and variants | 13–16 | All 14 named tribes and 9 named rare-gadget clarifications; trigger restrictions; solo two disjoint objectives worth 15 total; optional variants kept separate |

Both localized rule files, all 20 guide topics and their tables/details, all six question answers/explanations, and the eleven figure captions were compared with this source. Quiz counterexamples explicitly exclude special abilities where EXOSUIT or other powers would change an answer.

## Visual inventory and corrections

All 16 pages were rendered and inventoried. Selected source art:

- p6: inserted keycard and complete reveal before/after pair.
- p7: complete Recall retrieval/production/recharge illustration; crystal conversion arrows.
- p8: shared-hex building cost and two-camp example.
- p9: vault/cube reward and the two-stone excavation state (caption supplies the complete two-action cost sequence).
- p10: water route and mandatory cube pickup/slot cost.
- p12: monument-tile versus knowledge-track site comparison, kept with its Power B restriction.

Large setup spreads and duplicate decorative component displays were not reproduced in the player reference; setup remains a folded text reference. Knowledge progression is explicit in text rather than a second illustration of the same rewards. No generated replacement artwork was used.

Corrections during QA: removed surrounding rulebook text from the monument crop; restored the full top of the camp illustration; prevented small artwork from stretching to article width; changed fixed image caps to `min(100%, cap)` after detecting phone overflow. Every used diagram has a complete component/arrow boundary, a selectable translated caption, an intrinsic size and a full-size link. Canonical and public files are byte-identical.

## Table-use and browser checks

- Both languages checked at actual 320, 390, 768 and 1280 px viewport widths; no document horizontal overflow after the image fix.
- Desktop and 390 px screenshots reviewed. Recall timing, local building payment, excavation price and path scoring are visible before supporting figures or questions. A short diagram remains inline; long tribe/gadget entries and setup are folded with specific labels.
- Correct and incorrect answers, changing a wrong answer, independent unanswered state, language switching after answering, and open DORIAN/setup state were checked. Reload starts a fresh quiz; model retry/reset behavior is tested. There is no aggregate score panel, following the current site design.
- Mobile contents navigation, chapter jump, image dimensions and asset URLs checked. Shared UI retains accessible radio groups and the expanding chat composer.
- Real model: asked in English about recalling three cards, then a context-dependent follow-up about using the same production space. Both answers correctly required three different visible spaces. Backend was run with network permission on localhost:3011 after the sandbox-only server returned EACCES. No credentials were changed.
- No browser console errors observed. Automated mocked requests additionally verify Chinese context, both new slugs, ordered HTTP history, game isolation and failure exclusion.

These are inspection observations, not measured player completion times.

## Validation and limitations

`node --test scripts/*.test.js`: 47 tests passed. New-guide checks include bilingual parity, valid question references, retry/reset, matching manifests, asset routes, source provenance, actual lossless WebP dimensions, canonical/public equality and static-subpath URL resolution. Shared chat tests use mocked provider responses; the two-turn check above used the live configured provider separately.

No remaining discrepancies found in the published material against this supplied edition. The physical components are not all reproduced in the PDF: AYNIR’s exchange ratios, individual OMNITOOL options and every keycard/upgrade/objective face were not independently inspected. Printed component values remain authoritative where the rulebook refers to them; the chatbot context explicitly states this coverage limit. Optional companion functionality was not activated or tested.
