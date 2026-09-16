# Fate of the Fellowship — player-guide audit

## Character supplement — 2026-09-15

Added an eighteenth topic covering all 13 base character cards in both languages, using the supplied v1.6 player aid and online printed-card checks. The same source generates the guide entries and the full chatbot rules supplement. The original 17-topic audit below is preserved as historical scope; character coverage now extends beyond it. See [character-review.md](character-review.md) for individual sources, corrections, and the distinction between cards directly inspected and abilities summarized from the aid.

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

## Illustration coverage follow-up — 2026-09-15

Added 15 source figures and 20 symbol keys, bringing the guide to 20 figures plus 20 icons. Both languages expose the same assets and equivalent captions/step explanations in their related rule sections.

| Addition | English rulebook pages | Evidence checked |
| --- | --- | --- |
| Board features and initial setup | 3–5 | Region vs location; path and battle-line types; starting troops and Nazgûl; numbered circles are location references, not quantities |
| Player-deck construction | 8 | Deal hands first; one Skies Darken per pile; stack larger piles above smaller ones; four-pile diagram is introductory difficulty |
| Special-path payments | 11 | One payment for the entire group; symbol payment ignores card region |
| Fellowship, Prepare, Muster | 12–13 | Exact shared location and matching-region transfer; haven requirement and token type; muster color follows the location |
| Attack outcome | 14 | Two dice chosen; Rout and Nazgûl losses; Legolas pays Valor; one troop of each side remains |
| Shadow cards | 16 | New top card back determines one half; resolve area before discard |
| Full advance sequence | 17 | Front-first movement, endpoints and off-line troops; three-die battle; Overrun ignored in a haven; last friendly troop lost; stronghold token and 3 hope lost |
| Reinforcement and Nazgûl examples | 18–19 | Troop then battle then special order; take Nazgûl one at a time and recalculate largest group; nearest Nazgûl move one region; captured stronghold still resolves its order |
| Resource, dice and map symbol keys | 24 | Actual artwork matched against meanings, especially framed search/battle faces and muster emblems |

Chinese place names and dice terminology were cross-checked against the supplied Chinese pages 11, 13, 17–19 and the guide's established vocabulary. All added figures and icons were visually inspected; cropped prose fragments and initially mistaken troop-vs-location icon selections were corrected before delivery.

Validation: `node --test scripts/fellowship-guide.test.js` passes all 6 tests; guide JavaScript syntax and `git diff --check` pass. Checks include bilingual image/step parity, source provenance, identical source/public assets and intrinsic image dimensions. Browser checks at 1366 × 900 and 390 × 844 confirmed readable figures and symbol keys without horizontal overflow, all 40 guide images loaded, Chinese/English captions switch correctly, and correct/incorrect quiz selections survive a language change. No browser warnings or errors were reported. Full-size image links point to the same successfully loaded source assets. Image dimensions reserve space for lazy loading so chapter navigation does not jump as images arrive.
