# Brian Boru guide audit — 2026-09-16

Authority: supplied 12-page English Osprey Games rulebook, ©2021 first edition. The exact local PDF hash and reproducible crop geometry are in `image-sources.json`.

## Published rule coverage

| Topics / claims reviewed | PDF evidence | Checks |
| --- | --- | --- |
| Setup and rounds | 2–5 | Three coins, one renown, ten points; separate starting regions; 2/3 random marriages above Princess; 3/4 rounds; deal 8/6/5 and draft two left |
| Trick and action order | 5, 7 | Leader matches town or white; followers may play anything; qualifying highest wins; all resolve ascending; choose one whole secondary action; discard last card even with five players |
| Action icons | 6, 12 | Mandatory left-to-right resolution; only coin-loss icon substitutes points; 2-coin extra actions; expansion needs 5 coins and direct road; liberation restores underlying owner |
| Marriage | 6–8 | Collision after full action and payments; retreat to empty or bottom; winner highest rather than topmost; winner resets before track rewards; all-bottom exception |
| Vikings and spoils | 9, 12 | Public battle area versus captured tokens; all tied least lose one town; tied most changes who chooses; rewards even after invasion; recalculate after unique winner returns all; no rewards with zero raiders |
| Church | 9, 12 | Unique lead reward skipped on ties; next reward recalculates; four-disc check is after the second reward; last-step retrieval only if a monastery was placed; one monastery per town |
| Regions and Princess | 8–10 | Threshold counts Vikings and doubled monasteries; all face-up tokens checked; ties leave ownership unchanged; Viking majority; military and trade scopes; spurn discards |
| Final scoring | 10 | Unique coin lead, active marker and renown; held tokens score full; board face-up ties score half rounded down; regional spread 0/1/3/5/7/10; token then marriage tie breakers |

All ten localized topics, every table row and bullet, all five recap answers/explanations, and all captions were checked. Conditions are included in questions that would otherwise depend on card colour, optional payments, tied leads, Viking majority or Princess choice.

## Visual inventory

All 12 pages rendered and inventoried. Seven artwork-only action-symbol crops from p6 sit beside their bilingual table labels. Three p7 examples explain the four-card winner/ascending order, road-blocked expansion, and the complete marriage collision/pay-or-retreat choice. The original four-card identities are red 11, red 2, white 13 and yellow 17. The rule example’s names remain in explanatory captions only where needed to match positions.

The full p7 story is divided into these self-contained examples; no before-only walkthrough is presented as a complete action sequence. The intervening battle purchase is covered by the action table and battle rules. Large setup/map art, duplicated p12 icon summaries and decorative p11 illustration were not added as redundant figures. The player reference keeps concise setup text in a disclosure.

Every crop has PDF page, reference size, rectangle and output size; no meaningful arrows or component numbers are painted over. All canonical/public assets match. Caption text is selectable HTML in the selected language. Full-size links and intrinsic dimensions are supplied.

## Table-use and browser checks

- Both languages checked at actual 320/390/768/1280 px widths; no document overflow. Desktop Chinese trick example and 390 px English action table were visually reviewed.
- From normal chapter navigation, winning rules, five-coin expansion restrictions and battle tie handling are directly visible before examples. Phone contents opens and closes on chapter selection. Table text remains readable and the icon identifies the effect without embedding English prose.
- Incorrect/correct trick answers, correction, language switching with a checked answer, open setup preservation and independent unanswered questions were verified. Model tests cover retry/reset; reloading gives a fresh session. The current shared site intentionally has no aggregate score UI.
- Live English question: empty battle area; A=4, B=4, C=2 captured raiders. The assistant correctly skipped the tied first reward, gave A and B one point and returned one raider each.
- Switched to Chinese and asked “那他们剩下的袭击者会保留到下一轮吗？” The assistant correctly retained context: A/B keep three each and C keeps two. Mobile chat displayed the conversation, disabled send while waiting and dots-only loading; composer remained visible. It used the already configured live backend on localhost:3011, with no credential changes.
- No browser console errors observed. Mocked integration tests separately exercise exact rules/language, ordered history and game isolation.

These are walkthrough observations, not measured player task-completion times.

## Validation and source boundaries

`node --test scripts/*.test.js`: all 47 tests passed, including new-guide structure/assets/quiz checks and shared chat coverage. Syntax and whitespace checks accompany delivery. Source PDFs remain ignored; user-supplied originals were preserved.

No remaining discrepancies found in the published material against this supplied English edition. The guide does not claim independent inspection of every physical action/marriage card or every track reward. Players read those printed amounts using the verified symbol rules. Different-language five-player variants and later errata were deliberately not mixed into this edition.
