// Captions remain selectable and localized; the artwork comes from the rulebook.
const figure = (image, en, zh, steps) => ({image, caption: {en, zh}, steps});
const icon = (name, en, zh) => figure(`icon-${name}.webp`, en, zh);

const illustrations = {
  symbols: [figure('board-features.webp',
    'Read the map: the blue highlight marks a region containing several locations. White circles are ordinary locations; colored emblems are muster locations. White lines are normal paths, symbols mark special-path costs, and colored arrows are battle lines. Hope is tracked on the left; the threat rate is along the top.',
    '认识地图：蓝色高亮是一整个地区，里面包含多个地点。白圈是普通地点，彩色徽记是集结地点；白线是普通路径，符号标明特殊路径费用，彩色箭头是战线。希望记录轨在左侧，威胁度记录轨在上方。')],
  travel: [
    figure('travel-characters.webp',
      'Aragorn brings Arwen and Éowyn from Rivendell to Carrock. He pays the path’s 1 Stealth once for all three characters, using a card or a token.',
      '亚拉冈带亚玟和伊欧玟从瑞文戴尔前往卡洛克。他用卡牌或标记支付路径要求的 1 隐身，三位角色一起通过，只支付一次。'),
    figure('travel-troops.webp',
      'Gimli brings three Dwarven troops from Hollin to Moria. He pays 1 Friendship once for the whole group. The card’s region does not need to match the path.',
      '金雳带三个矮人士兵从和林前往摩瑞亚，为整组支付一次 1 友情。用于支付的卡牌不需要与路径所在地区相符。')
  ],
  fellowship: [figure('fellowship.webp',
    'Gandalf and Frodo are both in the Shire, in Eriador. If their players agree, Gandalf spends one action to hand Frodo an Eriador card. Sharing a region alone would not be enough: their characters must share the exact location.',
    '甘道夫和佛罗多都在伊利雅德的夏尔。双方玩家同意后，甘道夫花一个行动，把一张伊利雅德卡交给佛罗多。仅在同一地区还不够，两位角色必须在同一地点。')],
  prepare: [figure('prepare.webp',
    'At the haven of Rivendell, Frodo spends an action and discards a card showing Resistance to take one Resistance token from the supply. In multiplayer, the card’s region need not match; in solo, it must.',
    '佛罗多在瑞文戴尔这个避风港花一个行动，弃掉带反抗符号的卡，从供应堆取得一个反抗标记。多人游戏不要求卡牌地区匹配；单人游戏则必须匹配。')],
  muster: [figure('muster.webp',
    'Éowyn spends one action and 1 Friendship in Lórien to add one green Elven troop. The location determines the troop color, regardless of the character or the region printed on the card used to pay.',
      '伊欧玟在罗瑞安花一个行动和 1 友情，加入一个绿色精灵士兵。士兵颜色由地点决定，不由角色或支付卡牌的地区决定。')],
  battle: [figure('battle-after.webp',
    'After the attack, one friendly troop and one Shadow troop remain together at Helm’s Deep. The Eye is now in Rohan. The attack ends; continuing to attack would require another action.',
    '攻击结束后，圣盔谷仍有一个盟友士兵和一个暗影士兵共存，索伦之眼已移到洛汗。本次攻击结束；若要继续攻击，必须再花一个行动。', {
      en: ['Arwen chooses two dice and rolls Rout and Nazgûl!: remove one Shadow troop and, because Nazgûl are in the region, two friendly troops.', 'Legolas is also at Helm’s Deep. He spends 1 Valor to remove one more Shadow troop, without spending another action.'],
      zh: ['亚玟选择投两颗骰，得到“击溃”和“戒灵！”：移除一个暗影士兵；由于该地区有戒灵，再移除两个盟友士兵。', '勒苟拉斯也在圣盔谷，他支付 1 勇气，再移除一个暗影士兵；这笔支付不额外消耗行动。']
    })],
  shadow: [
    figure('shadow-halves.webp',
      'In each pair, the left card is the new top of the deck and the right card is the card just flipped. A: a red flag selects the upper Advance half. B: a black banner selects the lower Reinforce half. Resolve only the highlighted half.',
      '每组图中，左边是牌库的新顶牌，右边是刚翻开的卡。A：新顶牌露出红旗，执行上半部“推进”；B：露出黑色布条，执行下半部“增援”。只结算框出的那一半。'),
    figure('shadow-flow.webp',
      'C: place each flipped card in the resolve area and finish it before drawing the next. D: after resolving the number of cards shown by the threat rate, move them all to the discard area.',
      'C：每次翻出的卡先放到结算区，完整结算后才抽下一张。D：按当前威胁度结算足够数量的卡后，再把这些卡一起移到弃牌区。')
  ],
  advance: [figure('advance-battle.webp',
    'After all movement, resolve the battle at Rivendell and check whether the haven falls.',
    '所有移动完成后，再结算瑞文戴尔的战斗，并检查避风港是否失守。', {
      en: ['5: Rivendell now has three Shadow troops, so this Shadow-initiated battle rolls three dice.', '6: two Exchange results remove two Shadow troops and the only Elven troop. Ignore the Overrun result because the battle is in a haven; excess friendly losses are also ignored.', '7: one Shadow troop remains with no friendly troops. Rivendell becomes a stronghold: place the stronghold token and lose 3 hope.'],
      zh: ['5：瑞文戴尔现在有三个暗影士兵，因此这场由暗影方触发的战斗投三颗骰。', '6：两个“交换”结果移除两个暗影士兵和唯一的精灵士兵。在避风港忽略“肆虐”结果；超出在场数量的盟友损失也忽略。', '7：还剩一个暗影士兵，却已没有盟友士兵。瑞文戴尔变为暗影要塞：放上要塞标记，失去 3 希望。']
    })],
  reinforce: [
    figure('reinforce-battle.webp',
      'Reinforce Rhûn: add one Shadow troop, then battle because friendly troops are present. Roll one die for the one Shadow troop, without moving the Eye. Only after this battle do you execute the special order.',
      '在卢恩增援：先加入一个暗影士兵。因为当地有盟友士兵，接着进行战斗；按一个暗影士兵投一颗骰，不移动索伦之眼。战斗完成后才执行特殊指令。'),
    figure('nazgul-deploy.webp',
      'Deploy three Nazgûl directly to the Eye’s region, Gondor. Take them one at a time and reassess the largest group after each move.',
      '将三个戒灵直接部署到索伦之眼所在的刚铎。一次移动一个，每次移动后重新判断哪一组最多。', {
        en: ['1: move the only Nazgûl in Mordor to Gondor.', '2: Mordor is now empty. Rohan has four Nazgûl, Dale three, and Rhudaur one, so take the next from Rohan.', '3: Rohan and Dale now each have three. The current player chooses either region for the last Nazgûl.'],
        zh: ['1：先把魔多仅有的一个戒灵移到刚铎。', '2：魔多已空。洛汗有四个戒灵，河谷镇有三个，鲁道尔有一个，因此第二个从洛汗取。', '3：此时洛汗与河谷镇各剩三个。当前玩家可以选择从其中任一地区取最后一个戒灵。']
      }),
    figure('nazgul-approach.webp',
      'Isengard was captured, so add no Shadow troop there. Its special order still moves two Nazgûl closer to Frodo, who is in Eriador.',
      '艾辛格已被占领，因此不在那里加入暗影士兵；但仍执行特殊指令，让两个戒灵靠近位于伊利雅德的佛罗多。', {
        en: ['1: the closest Nazgûl is in the Misty Mountains. Move it one region closer, to Enedwaith or Rhudaur.', '2: the next closest are in Rhovanion and Haradwaith. Choose one: move it from Rhovanion to Rohan, or from Haradwaith to Gondor. Each selected Nazgûl moves only one region.'],
        zh: ['1：最近的戒灵在迷雾山脉。让它靠近一个地区，进入伊宁威治或鲁道尔。', '2：接下来最近的戒灵分别在罗马尼安和哈拉德威治。选其中一个：从罗马尼安移到洛汗，或从哈拉德威治移到刚铎。选中的每个戒灵只移动一个地区。']
      })
  ],
  setup: [
    figure('setup-board.webp',
      'Starting board before the nine additional Shadow-card placements: 3 Dwarven, 4 Elven, 3 Rohirrim, 5 Gondor and 18 Shadow troops. Numbered circles identify starting positions, not troop quantities. Place Nazgûl by the printed regional icons: 2 in Eriador, 1 each in Rhudaur, the Misty Mountains and Gondor, and 4 in Mordor. The Eye starts in Eriador.',
      '这是额外抽取九张暗影卡增兵之前的起始图板：矮人 3、精灵 4、洛汗 3、刚铎 5、暗影士兵 18。图中的数字圆圈是位置编号，不是士兵数量。按地区印刷图标放戒灵：伊利雅德 2，鲁道尔、迷雾山脉、刚铎各 1，魔多 4；索伦之眼在伊利雅德。'),
    figure('player-deck.webp',
      'After dealing starting hands, divide the remaining player cards into roughly equal piles. Shuffle one Skies Darken into each pile, then stack the piles with larger piles on top. The illustration shows the introductory game’s four piles; other difficulties use five or six.',
      '分发起始手牌后，把剩余玩家卡尽量均分；每堆洗入一张群鸦蔽日，再叠起来，较大的堆放上方。图示为入门难度的四堆；其他难度使用五堆或六堆。')
  ]
};

const legends = {
  symbols: [
    icon('friendship', 'Friendship — Muster; some paths and objectives.', '友情：用于集结，以及部分路径与目标。'),
    icon('valor', 'Valor — remove Shadow troops after a battle roll; Capture.', '勇气：战斗掷骰后移除暗影士兵；占领要塞。'),
    icon('stealth', 'Stealth — avoid a search when traveling with Frodo; some paths.', '隐身：佛罗多跋涉时避免搜索；通过部分路径。'),
    icon('resistance', 'Resistance — reroll dice; attempt to destroy the Ring.', '反抗：重投骰子；尝试摧毁魔戒。')
  ],
  search: [
    icon('slip', 'Slip By — no effect.', '逃离：没有效果。'),
    icon('weary', 'Weary — lose 1 hope, even in a haven.', '疲惫：失去 1 希望，即使在避风港也生效。'),
    icon('exposed', 'Exposed — lose 1 hope; ignore in a haven.', '暴露：失去 1 希望；在避风港忽略。'),
    icon('recall', 'Recall — move 1 Nazgûl from Frodo’s region to Mordor, if present. No effect if Frodo is in Mordor.', '召回：将佛罗多所在地区的一个戒灵移回魔多（若有）；佛罗多在魔多时无效果。')
  ],
  battle: [
    icon('rout', 'Rout — remove 1 Shadow troop.', '击溃：移除一个暗影士兵。'),
    icon('exchange', 'Exchange — remove 1 Shadow and 1 friendly troop.', '交换：移除一个暗影士兵和一个盟友士兵。'),
    icon('overrun', 'Overrun — remove 1 friendly troop; ignore in a haven.', '肆虐：移除一个盟友士兵；在避风港忽略。'),
    icon('nazgul', 'Nazgûl! — remove 2 friendly troops if any Nazgûl are in the region; otherwise no effect.', '戒灵！：该地区有戒灵时移除两个盟友士兵，否则无效果。')
  ],
  muster: [
    icon('dwarven-location', 'Dwarven location → grey Dwarven troop.', '矮人地点 → 灰色矮人士兵。'),
    icon('elven-location', 'Elven location → green Elven troop.', '精灵地点 → 绿色精灵士兵。'),
    icon('rohirrim-location', 'Rohirrim location → brown Rohirrim troop.', '洛汗地点 → 棕色洛汗士兵。'),
    icon('gondor-location', 'Gondor location → blue Gondor troop.', '刚铎地点 → 蓝色刚铎士兵。')
  ],
  capture: [
    icon('haven', 'Haven — ignore Exposed and Overrun results here.', '避风港：在这里忽略暴露与肆虐结果。'),
    icon('stronghold', 'Shadow stronghold — may be captured with a friendly troop present and no Shadow troops.', '暗影要塞：有盟友士兵、没有暗影士兵时，可执行占领。')
  ],
  reinforce: [
    icon('eye', 'Eye of Sauron — marks Sauron’s current region of attention.', '索伦之眼：标示索伦当前注视的地区。'),
    icon('nazgul-piece', 'Nazgûl — occupy a whole region, not a single location.', '戒灵：位于整个地区，而非单一地点。')
  ]
};

function localize(example, language) {
  return {...example, caption: example.caption[language], steps: example.steps?.[language]};
}

const advanceSteps = {
  en: ['1: move the two Shadow troops from the Weather Hills to Rivendell, joining the one already there.', '2: move the one Shadow troop from Hollin to Tharbad.', '3: move all four Shadow troops from Moria to Hollin.', '4: the troop already at Rivendell stays at the end of the line. Troops in Dunland do not move because they are off this green battle line.'],
  zh: ['1：先把风云丘的两个暗影士兵移到瑞文戴尔，与原有的一个会合。', '2：把和林的一个暗影士兵移到塔巴德。', '3：把摩瑞亚的四个暗影士兵全部移到和林。', '4：原本就在瑞文戴尔的士兵留在战线终点；登兰德的士兵不在这条绿色战线上，因此不移动。']
};

export function examplesFor(topic, language = 'en') {
  const original = topic.image ? [{image: topic.image, caption: topic.caption}] : [];
  if (topic.id === 'advance' && original.length) original[0].steps = advanceSteps[language];
  return [...original, ...(illustrations[topic.id] ?? []).map(example => localize(example, language))];
}

export function iconsFor(topic, language = 'en') {
  return (legends[topic.id] ?? []).map(example => localize(example, language));
}
