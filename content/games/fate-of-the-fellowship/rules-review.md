# Fate of the Fellowship — source and terminology review

## Sources

The user supplied two 24-page image-based rulebooks and cover art in the existing `../fate-of-fellowshipe/` folder. That folder and its original spelling were preserved. The public route uses `fate-of-the-fellowship`.

- English: `../fate-of-fellowshipe/ZMGPSM0101_Rulebook_English_WEB.pdf`
- Chinese: `../fate-of-fellowshipe/ZMGPSM0101_Rulebook__Chinese_WEB.pdf`
- English SHA-256: `37137B287AECBAE264595265465DE217F3A4B66B175A5ECFEB06EDEFB0AECBCD`
- Chinese SHA-256: `E592A0CC56FA8609D39F7AEEC700222E9EE8FD6797A520C3E21AEE2E721CC081`

The PDFs contain no extractable text. Rules and numeric/icon values were read from rendered pages. `rules.en.md` and `rules.zh.md` are structured source-based digests for the guide, explicitly labeled as summaries, not full verbatim transcriptions. They do not reproduce every objective, event, or character card. Those cards retain their printed instructions.

## Chinese naming

Use the supplied Traditional Chinese edition's title and terminology, rendered in Simplified Chinese to match this website. The Chinese title is **魔戒：远征队的宿命**. The alternative **魔戒：命运同盟** exists in Simplified Chinese listings but is not mixed into this edition's vocabulary.

Online terminology checks:

- [Asmodee Taiwan product listing](https://www.gokids.com.tw/product/detail2593) confirms the Traditional Chinese title and publisher edition.
- [Board Game Arena Chinese game page](https://zh.boardgamearena.com/gamepanel?game=fateoffellowship) uses the same title.
- [Board Game Arena Simplified Chinese help](https://zh-cn.doc.boardgamearena.com/Gamehelpfateoffellowship) uses the alternative 命运同盟 title; this is recorded as a naming difference, not used to override the supplied rulebook.

| English | Guide Chinese |
| --- | --- |
| Travel | 跋涉 |
| Fellowship | 远征队（转交卡牌行动） |
| Prepare | 储备 |
| Muster | 集结 |
| Attack / Capture | 攻击／占领 |
| Friendship / Valor / Stealth / Resistance | 友情／勇气／隐身／反抗 |
| Haven / Shadow stronghold | 避风港／暗影要塞 |
| Friendly troop / Shadow troop | 盟友士兵／暗影士兵 |
| Nazgûl / Eye of Sauron | 戒灵／索伦之眼 |
| Skies Darken | 群鸦蔽日 |
| Advance / Reinforce | 推进／增援 |
| The Drums of War / The Wheels of Saruman | 战鼓响起／萨鲁曼之轮 |
| Weary / Exposed / Recall | 疲惫／暴露／召回 |
| Rout / Exchange / Overrun | 击溃／交换／肆虐 |

## Reconciled source issue

The supplied Chinese page 16 heading says to draw **2** Shadow cards. Its body, Chinese page 10, and English page 16 specify the **current threat rate**. The guide consistently follows the threat rate. This is also documented as a heading misprint by the [Chinese edition retailer](https://bgwalker.com/product/Pandemic-The-Lord-Of-The-Rings-Fate-Of-The-Fellowship-%E7%98%9F%E7%96%AB%E5%8D%B1%E6%A9%9F-%E9%AD%94%E6%88%92%EF%BC%9A%E9%81%A0%E5%BE%81%E9%9A%8A%E7%9A%84%E5%AE%BF%E5%91%BD-%28%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E7%89%88%29-1yRhJSGyzRCfm3vv).

## Illustrations

The guide now contains 20 illustrated figures and 20 individual symbol keys. The five original examples remain: Travel (10), Search (11), Battle (14), Capture (15), Advance (17). Fifteen additional figures cover the board (3), starting setup spread (4–5), player-deck construction (8), special-path payments (11), Fellowship and Prepare (12), Muster (13), the battle outcome (14), Shadow-card selection and handling (16), post-advance battle and haven loss (17), reinforcement and Nazgûl deployment (18), and Nazgûl approach after a captured stronghold skips reinforcement (19). Symbol keys come from page 24.

Crops exclude surrounding rules prose. Printed component labels, symbols, diagram letters/numbers and the payment-alternative “OR” labels remain part of the source artwork. Captions, numbered explanations and icon meanings are separate selectable text in both languages. `image-sources.json` records source-page coordinates; new WebP assets use 2400-pixel-high page renders with crop coordinates expressed at height 1600. Two small areas of intrusive prose are excluded with transparency and recorded in the manifest. The setup board is assembled from the two halves of the original spread.

Rebuild new crops and intrinsic image dimensions with `python scripts/build_fellowship_illustrations.py`. Bilingual figure and icon explanations are maintained in `public/games/fate-of-the-fellowship/guide-examples.js`; this focused builder does not overwrite existing topics, quizzes, character content or the page shell.
