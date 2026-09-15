// Artwork-only crops from the supplied rulebook; captions stay selectable and localized.
export const extraExamples = {
  turn: [{image:'building-types.png', captions:{
    zh:'工坊可升级为公会；公会可升级为学校或宫殿，学校可升级为大学。',
    en:'Workshops upgrade to Guilds. Guilds upgrade to Schools or a Palace; Schools upgrade to a University.'
  }}],
  build: [{image:'terraform-build-cost.png', captions:{
    zh:'山岳改为沙漠需 2 把铲子。每铲 3 工具时，改造花 6 工具；再建工坊需另付 1 工具和 2 钱币。',
    en:'Mountains to Desert requires two Spades. At three Tools per Spade, terraforming costs six Tools; building the Workshop costs another Tool and two Coins.'
  }}],
  power: [{image:'power-cycle.png', captions:{
    zh:'先将 I 盘标记移入 II 盘；I 盘清空后，才能将 II 盘标记移入 III 盘。只有 III 盘的魔力可支付。',
    en:'Cycle tokens from Bowl I to II first. Once I is empty, cycle from II to III. Only power in Bowl III can be spent.'
  }}],
  science: [{image:'science-display.png', captions:{
    zh:'到达 3、5、7、12 级获得魔力；进入 8 级需要城市之钥，9 级起提供收入。每门学科只有一人可到 12 级。',
    en:'Levels 3, 5, 7 and 12 grant power. Entering Level 8 requires a Key to the City; Level 9 provides income. Only one player may reach Level 12 in each Discipline.'
  }}],
  resources: [{image:'power-sacrifice.png', captions:{
    zh:'牺牲魔力：从 II 盘移除 1 枚标记，将另一枚从 II 盘移到 III 盘。',
    en:'Sacrifice power: remove one token from Bowl II to move another token from II to III.'
  }}]
};

export function examplesFor(topic, language) {
  const extra = (extraExamples[topic.id] ?? []).map(example => ({image:example.image, caption:example.captions[language]}));
  const original = topic.image ? [{image:topic.image, caption:topic.caption}] : [];
  return topic.id === 'power' ? [...extra, ...original] : [...original, ...extra];
}
