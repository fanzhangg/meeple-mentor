# Fate of the Fellowship — player-guide audit

## Scope

Manually checked all 17 topics, 15 recap answers and explanations, five example captions, setup tables, and nested reference entries against the supplied English rulebook. The Chinese terminology and corresponding rules were compared with the supplied Chinese edition. Source paths and hashes are recorded in `rules-review.md`.

This review covers the rules published in this guide, not a transcription of every card in the game. Objective, event, and character-specific instructions remain on their cards. No later expansion or unofficial variant is included. No remaining discrepancies were found in the published guide against the supplied rules during this review; this is not a guarantee about every possible card interaction.

## Coverage

| Guide topic | Source pages | Checks |
| --- | --- | --- |
| Turn | 9–10 | Two characters, shared hand, 4 + 1 without interleaving, clockwise sequence |
| Symbols | 9, 20, 24 | Four symbol types, region-independent payment, token supply, seven-card limit |
| Travel | 10–11 | One connection, companions, path fees once, battle-line direction, Frodo surcharge |
| Search | 11, 20 | Region vs location, seven-die cap, haven exception, recall, rerolls, Ring clarification |
| Fellowship / Prepare | 12, 20, 22 | Same location and matching region, no token transfer, available token, solo exception |
| Muster | 13 | One Friendship, matching location color, supply restriction |
| Battle | 13–14, 20 | Friendly vs Shadow dice counts, minimum/maximum, Eye movement, result meanings, paid mitigation |
| Capture / Havens | 14–16, 18, 20 | Three Valor, troops required, two hope gained, three hope lost, remaining special orders |
| Draw / Events | 15, 20 | Draw together, missing-card hope cost, seven-card timing, no interruption without permission |
| Skies Darken | 15 | Ordered four steps, threat-track space vs printed rate, missing troops, discard-only shuffle, no replacement |
| Shadow cards | 16, 19–20 | Newly exposed back, one half only, threat-rate count, special-card override |
| Advance | 16–17 | Whole line, front first, one step per troop, battles after movement, endpoint troops |
| Reinforce | 18–19 | Placement, battle, then order; captured locations; regional Nazgûl movement and deployment |
| Objectives / Finish | 9, 12, 19 | Other objectives first, five Resistance, extra dice for missing hope, seven-die cap, immediate loss at zero |
| Setup / Solo | 4–8, 21–22, 24 | Troop and Nazgûl counts, events/hands, deck piles, five difficulty levels, solo action cycle |

## Corrections made during preparation

- Reconciled the Chinese page 16 “2 Shadow cards” heading with both rulebooks' threat-rate instructions.
- Used the supplied edition's names for the two special Shadow cards: 战鼓响起 and 萨鲁曼之轮.
- Kept search and battle haven exceptions distinct; havens do not ignore every unfavorable result.
- Explicitly retained special orders after a captured stronghold prevents reinforcement.
- Distinguished player-initiated battle dice from Shadow-initiated battle dice and Eye movement.
- Distinguished moving one threat-track space from blindly adding one to the printed threat rate.

## Validation

- `node --test scripts/fellowship-guide.test.js scripts/aoi-guide.test.js`: 12 tests pass.
- New guide JavaScript syntax check and `git diff --check` pass.
- Browser verification: bilingual rendering and title, correct/incorrect feedback, answer revision, unanswered progress, reset, language-switch answer preservation, nested keyword lookup, and expandable references.
- All five cropped illustrations were visually inspected; their captions describe the relevant rule without screenshot prose.
- Phone layout checked at 390 × 844: Rules/Lookup switching, navigation from a lookup result into expanded setup details, and readable tables. Temporary viewport override was reset afterward.

Automated tests establish structural and interaction invariants. The source-based manual comparison establishes the rule checks above.
