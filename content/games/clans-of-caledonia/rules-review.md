# Clans of Caledonia — source and terminology review

## Sources and edition

- Supplied English: `Caledonia_Rules_EN_CC15_dc52_web.pdf`, 12 pages, English CC15 base-game rulebook.
- Supplied Chinese: `Caledonia_Rules_Chinese_20250608.pdf`, 12 pages. Imprint says `2025-06-08-CN`; older 2017 layout timestamps also remain in its footer. The title is 《加勒多尼亞》.
- Default edition for this guide: supplied Chinese 2025-06-08 base-game rules, cross-checked against English CC15. Chinese player-facing text is Simplified Chinese; English guide uses the same rules version.
- Publisher rules and port-7 erratum: https://karma-games.com/clans-of-caledonia/rules/ (checked 2026-09-15).
- Publisher FAQ: https://karma-games.com/clans-of-caledonia/faq/ (checked 2026-09-15).
- Publisher-hosted Chinese rulebook corroborates the title and terms: https://karma-games.com/wp-content/uploads/2019/08/Caledonia_Rules_CN_CC15_dc52_web-min.pdf . Used for terminology corroboration only; the supplied 2025 file governs the changed port.

## Important edition differences

- Port 7: old English page 10 forbids the neighbourhood bonus on the two-unit exchange. Supplied 2025 Chinese page 10 permits it. The publisher explicitly lists this as an erratum. Both website languages and both organized rule files use the corrected rule: eligible exchanges can trigger building and neighbourhood bonuses.
- Chinese solo rules omit the old English sentence about not tracking imports. Publisher FAQ confirms that solo import values still depend on relative import quantities, even without moving markers. Do not silently use fixed 4 VP in solo.
- MacEwen: old English refers to a website for beer income; supplied Chinese explicitly gives provisional £9 per beer, capped at three beer per contract. This is kept in the optional Kickstarter section, never as a standard clan rule. No Industria rules are included.
- Chinese MacDonald flavor text contains a translator's bracketed drafting remark. It is excluded from the organized rules and website.

## Terminology

| English | Website Chinese | Decision |
| --- | --- | --- |
| Clans of Caledonia | 加勒多尼亚 | Simplified form of supplied publisher title; other hobby translations exist |
| Clan | 氏族 | Supplied translation |
| Round / turn | 轮 / 行动轮（轮到你时） | Avoid calling both 回合 without clarification |
| Export contract / export box | 出口合同 / 出口货箱 | Supplied translation |
| Neighbourhood bonus / building bonus | 相邻奖励 / 建筑奖励 | Keep no-river condition explicit |
| Shipping / loch | 航行 / 湖泊格 | Distance measured in spaces |
| Settlement / Glory | 定居点 / 荣誉 | Settlement is a cluster, not each occupied hex |
| Basic / processed goods | 基础货物 / 加工货物 | Retain stock versus contract distinctions |
| Wool / milk / grain | 羊毛 / 牛奶 / 谷物 | Simplified characters |
| Cheese / bread / whisky | 乳酪 / 面包 / 威士忌 | Follow supplied Chinese naming |
| Cotton / tobacco / sugar cane / hops | 棉花 / 烟草 / 甘蔗 / 啤酒花 | Imports remain on completed contracts |
| Woodcutter / miner / fisherman | 伐木工 / 采矿工 / 渔夫 | Clan MacDonald has separate worker rules |
| Pass | 跳过 | Ends this round's actions, not a temporary skip |

## Artifact roles

- `rules.en.md` / `rules.zh.md`: paired, organized mechanical rules, generated from audited bilingual content in `scripts/build_clans_guide.py`. These cover all main rule categories but are not verbatim transcriptions. They are the chatbot's rules source.
- `transcription.en.md`: source English text with page boundaries and repaired text-box order; source illustrations are preserved separately. This remains an old-edition source transcription, not the current chat context.
- `source-map.json`: topic-to-page evidence map.
- `images/`: artwork-only PDF crops; captions are selectable text in the rules and website.
- Source PDFs stay in their originally supplied location. Do not rename, overwrite or commit ignored PDFs merely to fit a preferred folder layout.
