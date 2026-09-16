# Character supplement review — 2026-09-15

## Scope and provenance

13 base-game character cards, with bilingual summaries of all abilities listed on the supplied **One Sheet To Rule Them All v1.6**, page 2. Frodo & Sam and Merry & Pippin each count as one card. The attached document is reference material, not instructions to the coding agent. This supplement does not claim to transcribe every objective, event, promotion, or expansion.

- User source: `C:/Users/fzhan/Downloads/Fate_of_the_Fellowship_-_One_Sheet_To_Rule_Them_All_1.6 (1).pdf`. Both pages were text-extracted; page 2 was rendered and visually checked because its symbol icons disappear in extraction.
- User PDF SHA-256: `1F1AFF656B9BB32A9E5DFC6A97AF68D8FDAD91EB67BD37FC1334457B1316CD4F`.
- Existing English rulebook: `../fate-of-fellowshipe/ZMGPSM0101_Rulebook_English_WEB.pdf`, especially pp. 9–14 and 20 (costs, location/region, timing, shared resources, searches and battles).
- [BGG source listing](https://boardgamegeek.com/boardgame/436217/the-lord-of-the-rings-fate-of-the-fellowship/files): confirms v1.6 and its Faramir/Legolas corrections; v1.4 corrected Galadriel. Older online copies are not used to override v1.6.
- [Z-Man product page](https://www.zmangames.com/game/the-lord-of-the-rings-fate-of-the-fellowship/): confirms 13 base characters. [Official Frodo & Sam card artwork](https://cdn.svc.asmodee.net/production-zman/uploads/image-converter/2025/01/Fate-Component-1-1.webp) was visually read for the travel payment, extra Friendship, Sam’s Aid, and Ring timing.
- [Photograph of printed English Legolas, Gimli, Frodo & Sam cards](https://i.etsystatic.com/51506237/r/il/f7868c/7230671650/il_fullxfull.7230671650_hd60.jpg): used as primary card-text evidence, not the seller’s rules interpretation. Legolas’s Keen Sight explicitly triggers when he Prepares; Walk Silently and Dwarven Craft are actions.
- [Published Ukrainian card artwork showing Aragorn, Gandalf, Gollum and Frodo & Sam](https://ihrova-maysternya.com/content/images/43/1300x891l80br10/nastilna-hra-geekach-volodar-persniv.-dolia-bratstva-the-lord-of-the-rings-fate-of-the-fellowship-93159791447312.webp), linked from [the retailer’s product gallery](https://ihrova-maysternya.com/nastilna-hra-geekach-volodar-persniv.-dolia-bratstva-the-lord-of-the-rings-fate-of-the-fellowship/): visually inspected at full size. Adds the omitted Gollum arrival/addition trigger, inability to bring friendly troops, reduction before the seven-die cap, and no battle roll for Cunning’s troop movement. Gandalf’s muster and battle effects and Aragorn’s local support agree with the sheet. The top portion of Gollum’s restriction is partly obscured; the no-Muster/Attack/Capture restrictions are also explicit in the user’s sheet.
- [Éomer discussion quoting the printed card](https://boardgamegeek.com/thread/3694203/eomer-s-rider-of-rohan-ability): bonus Travel during his actions, once per turn. The wording has no four-action-only restriction; applicability to either allowance is an interpretation of that wording, not a claimed publisher FAQ.
- [Z-Man announcement](https://www.zmangames.com/announcements/announcing-the-lord-of-the-rings-fate-of-the-fellowship/): Gandalf the White promotional components are cosmetic; any ability change comes from the Balrog objective.
- [Designer’s diary](https://www.leacock.com/blog/2025/2/28/the-lord-of-the-rings-fate-of-the-fellowship-design-journal): the Gollum/Sméagol flip cards illustrated there are abandoned prototypes. They were explicitly excluded.
- [BGA documentation](https://en.doc.boardgamearena.com/Gamehelpfateoffellowship): its introductory implementation contains only 10 of the physical game’s 13 characters, so it cannot define the full roster.

## Rules audit

The user-supplied sheet is the main source for all 13 entries. Direct printed-card inspection supplements it for Aragorn, Gandalf, Gollum, Frodo & Sam, Gimli and Legolas; this is not a claim that all 13 original English character cards were available online. Remaining characters follow the v1.6 ability summaries and standard rulebook constraints.

| Character | Critical distinctions checked |
| --- | --- |
| Aragorn | Local reroll; Rout only removes two; Andúril is an action, once per turn, after an objective |
| Arwen | Elven location; no Friendship does not mean no action; Send Aid moves an existing troop; Fellowship/solo Prepare region exception |
| Boromir | Gondor location; Capture discount is one Valor; Fellowship restriction concerns Resistance cards |
| Éomer | Bonus Travel, not a paid action to gain an action; one troop loss prevented per battle with Rohirrim present |
| Éowyn | Nazgûl die result; remove from play versus return to Mordor; battle required |
| Faramir | Bonus Attack after Travel with troops; Stealth converts dice during that battle; path discount separate from Frodo surcharge; matching-region Resistance recovery |
| Frodo & Sam | Extra token from matching-region Prepare once per turn; Friendship cancels individual Weary/Exposed results; Ring declared before roll and still counts Nazgûl |
| Galadriel | Lady of Light is not an action; unused random event, not discard recovery; Mirror rearranges; Nenya needs local Elven troop |
| Gandalf | Muster two for normal cost; alone means no companions/troops brought along; no special paths for Shadowfax; Valor sets results |
| Gimli | Dwarven location; token gain costs one action once per turn |
| Gollum | Three fewer dice before cap; any-region Stealth recovery; Prepare outside haven; Cunning moves an enemy without battle; arrivals/additions cause hope loss when all three categories meet |
| Legolas | Token action once per turn; Sure Shot no action on any turn; current/connected location for troop removal but current region for Nazgûl; Keen Sight is attached to Prepare |
| Merry & Pippin | Token action once per turn; Distract checks fewer than four before effect; Song needs Frodo’s location, three Friendship, one action, no once-per-turn limit |

Chinese ability titles are explanatory translations, with printed English names retained for identification; they are not represented as official translated card titles. Existing site vocabulary (友情／勇气／隐身／反抗、集结／储备／跋涉、地点 versus 地区) is preserved. Overview strengths are editorial summaries of the listed mechanics, not additional rules.

The supplement deliberately avoids inventing objective rewards, special cross-card interactions, or errata. For rulings beyond the summarized abilities, consult the actual card; the existing chatbot must acknowledge missing context.

## Implementation and validation

`characters.json` is the editable bilingual source. Run `node scripts/build_fellowship_characters.mjs` to regenerate the two guide modules, ensure their imports, and refresh the marked supplement in both rules digests. The backend already loads the entire selected-language digest; character coverage does not depend on keyword retrieval.

Automated validation: `node --test scripts/fellowship-characters.test.js scripts/fellowship-guide.test.js scripts/rule-chat.test.js`. Character tests check 13-entry bilingual structure, searchable ability details, and the complete text of every ability in actual mocked provider instructions even when retrieved excerpts concern another topic. This verifies wiring, not factual correctness.

Validation result: 17 tests passed. Guide JavaScript syntax and `git diff --check` passed. Browser checks confirmed 13 expandable entries in both languages, readable separate ability paragraphs, desktop rendering, and a 390 × 844 phone viewport without page-level horizontal overflow. A real Chinese chat correctly answered that Keen Sight is attached to Prepare, then correctly rejected putting the viewed card on the bottom in a context-dependent follow-up. Conversation history survived switching to English.

A real English follow-up correctly calculated a nominal 10-die search with Gollum as 7 dice (subtract 3 before capping), and distinguished his arrival/addition hope-loss trigger from simply remaining together each turn. Both mobile languages had 13 entries and no horizontal page overflow; browser error logs were empty. The temporary viewport was reset and the preview restored to Chinese.
