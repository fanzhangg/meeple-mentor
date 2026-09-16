# HUANG guide review — 2026-09-15

## Source and scope

Reviewed the base-game guide against `source/rules.pdf`, printed pp. 2–9 (PDF spreads 2–5). Read the extracted text and visually checked the conflict/endgame spreads. Optional modules, credits and exact component inventories are not newly certified by this review; their existing review notes remain in the chat reference.

## Accuracy findings

| Finding | Applied correction | Printed pages |
| --- | --- | --- |
| English chat reference incorrectly resolved a separate war per conflicting color. | Compare states once, then simultaneously remove all losing conflicting leaders; clarify support order, ties, all committed tiles, highest losing strength and winner's board losses. Chinese context and both guides agree. | 6–9 |
| English reference used orthogonal adjacency on a hex board. | Adjacency means sharing an edge; links may pass through tiles and leaders. | 2–3 |
| English reference left Market refill timing and available pagoda priority unresolved. | Refill Market after hands at turn end; first use an available matching pagoda, otherwise relocate one. | 4–6 |
| Sparse and unequal English/Chinese coverage left important procedures to quiz explanations. | Both languages now cover the same 13 topics: full turn order, leader restrictions, scoring recipient, blue-chain stopping conditions, paid actions, pagodas, revolts, wars, failed-draw ending and white-point tie-break. | 2–9 |
| Final white-point tie-break wording allowed “unassigned” points. | Compare originally white points after comparing all four adjusted totals; fewer wins, then no winner if still tied. | 8 |

## Fit to README scenarios

The guide supports returning to a forgotten rule after the host's explanation. Costs, conditions and resolution steps appear directly in the relevant section. Five recaps target blue-chain termination, Governor/pagoda scoring, revolt ties, war losses and the failed-draw end trigger. Each rule is stated before its question; the war question specifies sufficient board tiles. No empty question cards remain on the other eight sections.

`guide.json` is the bilingual guide source. Run `node scripts/build_huang_guide.mjs` after editing it to synchronize the browser module, API lesson and static fallback. The English and Chinese chat contexts remain separate full references and must be updated when a rule changes.

## Verification

Structural tests check bilingual IDs, answer alignment, one correct answer, and source/API/static synchronization. Browser checks cover desktop and narrow-screen reading, navigation, incorrect/correct answers and language switching. Automated checks establish integration, not rulebook accuracy. No new rulebook illustrations were created in this pass.
