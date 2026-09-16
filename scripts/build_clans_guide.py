"""Build the bilingual Clans guide and organized rules from paired, audited text.

Source: supplied English CC15 and Chinese 2025-06-08 base-game rulebooks.
The Chinese edition and the publisher's port-7 erratum resolve the edition change.
Each pair below is English, Simplified Chinese. Source page numbers are internal only.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = 'clans-of-caledonia'
DEST = ROOT / 'public/games' / SLUG
CONTENT = ROOT / 'content/games' / SLUG
topics = {'en': [], 'zh': []}
questions = {'en': [], 'zh': []}


def topic(id, page, title, key, bullets=(), table=None, details=(), image=None, caption=None, appendix=False):
    for i, lang in enumerate(topics):
        item = dict(id=id, title=title[i], key=key[i], bullets=[b[i] for b in bullets])
        if table:
            item['table'] = dict(headers=table[0][i], rows=[r[i] for r in table[1]])
        if details:
            item['details'] = [dict(title=d[0][i], text=d[1][i]) for d in details]
        if image:
            item.update(image=image, caption=caption[i])
        if appendix:
            item['appendix'] = True
        topics[lang].append(item)
    sources[id] = page


def quiz(id, prompt, options, answer, explanation):
    for i, lang in enumerate(questions):
        questions[lang].append(dict(id='q-'+id, topic=id, prompt=prompt[i], options=[o[i] for o in options], answer=answer, explanation=explanation[i]))


sources = {}
topic('turn', '4, 6', ('Five rounds; one action per turn', '五轮游戏，每次一个行动'),
      ('Take one main action when your turn comes around. Keep taking turns until everyone passes, then produce and score.',
       '每次轮到你时执行一个主要行动。按顺位轮流行动，直到所有人都跳过，再进行生产和计分。'), [
          ('Each round: Preparation → Action → Production → Scoring. Skip Preparation in round 1; still produce and score in round 5.', '每轮顺序：准备 → 行动 → 生产 → 计分。第一轮跳过准备阶段；第五轮仍然生产和计分。'),
          ('Preparation: turn over the previous scoring tile, refill empty export-board spaces for the player count, and retrieve your merchants from the market.', '准备阶段：翻面上一轮计分板块，按人数补满出口版图的空位，并从市场收回商人。'),
          ('Actions other than Pass may be repeated on later turns, provided you can pay and meet their requirements. Port bonuses are additional free actions on your own turn.', '除跳过外，其他行动可在之后轮到你时重复执行，但必须满足条件并支付费用。港口奖励是自己行动轮内的额外免费行动。')],
      table=((['Action', 'Main requirement / cost'], ['行动', '主要条件／费用']), [
          (['Trade', 'One good type; one merchant per unit traded'], ['贸易', '一种货物；每个货物派出一个商人']),
          (['Obtain an export contract', 'Empty export box; round-dependent cost'], ['获取出口合同', '出口货箱有空位；按当前轮次付费']),
          (['Expand', 'Unit cost + land cost; legal reachable empty space'], ['扩张', '单位费用＋土地费用；合法且可达的空格']),
          (['Upgrade shipping', '£4 for one step'], ['升级航行能力', '£4，前进一格']),
          (['Upgrade technology', '£10 for one worker type'], ['升级科技', '£10，升级一种工人']),
          (['Hire a merchant', '£4; move one from your board to your stock'], ['雇佣商人', '£4；从玩家版图拿一个到可用区']),
          (['Fulfil an export contract', 'Pay all its required goods and slaughter any required animals'], ['完成出口合同', '支付全部指定货物，屠宰所需牛羊']),
          (['Pass', 'Take pass money; leave the action phase for this round'], ['跳过', '获得跳过奖励，本轮不再行动'])]))

topic('trade', '4', ('Trade: pay first, then change the price', '贸易：先结算，再调价'),
      ('Buy or sell one type of good at its current market price. Use one available merchant for each unit traded; change the price only after the entire trade.',
       '按当前市场价格买入或卖出一种货物。每交易一个货物需要一个可用商人，整笔交易结算后才调整价格。'), [
          ('Only merchants beside your board are available. Merchants still on the player board must be hired first; merchants at the market stay there until retrieved.', '只有玩家版图旁的商人可用。版图上的商人要先雇佣；市场里的商人在收回前不能再次派出。'),
          ('Pay or receive quantity × the current price. Buying moves the price up that many steps; selling moves it down that many steps, within the printed market track.', '支付或获得“数量×当前价格”的金额。买入后价格上升相应格数；卖出后下降相应格数，以市场记录轨范围为限。'),
          ('Your merchants may not occupy both the buy and sell areas of the same good. You can repeat a trade in the same direction if you have merchants.', '自己的商人不能同时占据同一种货物的买入区和卖出区。有商人时可以继续同方向交易。'),
          ('Goods come from or return to the common supply, not another player. The market trades wool, milk, grain, cheese, bread, and whisky—not meat or imported goods.', '货物从公共供应堆拿取或归还，不与其他玩家直接交易。市场交易羊毛、牛奶、谷物、乳酪、面包和威士忌，不交易肉类或进口货物。')],
      image='trade.png', caption=('Two whisky at £10 each cost £20 and use two merchants. Only then does the price rise to £12.', '以£10单价买两桶威士忌，支付£20并派出两个商人；之后单价才涨至£12。'))
quiz('trade', ('Whisky costs £10. How much do two barrels cost in one trade?', '威士忌当前单价£10，一笔交易买两桶要付多少？'),
     [('£20', '£20'), ('£21', '£21'), ('£22', '£22')], 0,
     ('Both barrels use the price at the start of the trade. The price rises afterward.', '两桶都按交易开始时的价格结算，完成后才涨价。'))

topic('contracts', '4; board image 2', ('Obtain an export contract', '获取出口合同'),
      ('You normally have room for one unfulfilled contract. Take one from the export board as an action; you must fulfil it before taking another.', '通常只能持有一个未完成合同。花一个行动从出口版图拿取合同，完成后才能再拿一个。'), [
          ('You cannot discard an unfulfilled contract. Clan Buchanan has two export boxes and special rules.', '不能丢弃未完成的合同。布坎南氏族有两个出口货箱，适用特殊规则。'),
          ('Empty public contract spaces refill during the next Preparation phase, not immediately after taking one.', '公共合同被拿走后的空位在下一轮准备阶段补充，不立即补充。'),
          ('Obtaining and fulfilling a contract are different main actions. A building bonus can obtain a contract during another action, but still uses the normal round cost.', '获取与完成合同是两个不同的主要行动。建筑奖励可以在其他行动中获取合同，但仍按当前轮次支付费用。')],
      table=((['Round', 'Cost to obtain'], ['轮次', '获取费用']), [
          (['1', 'Receive £5'], ['1', '获得£5']), (['2', '£0'], ['2', '£0']), (['3', 'Pay £5'], ['3', '支付£5']), (['4', 'Pay £10'], ['4', '支付£10']), (['5', 'Pay £15'], ['5', '支付£15'])]))

topic('expand', '3–5; player-board icons', ('Expand: reach, terrain and costs', '扩张：范围、地形与费用'),
      ('Deploy one unit from the top of its column to an empty space neighbouring or within shipping reach of one of your units. Pay the unit cost plus the printed land cost.', '从玩家版图对应栏最上方拿一个单位，放到与己方单位相邻或在航行范围内的空格，并支付单位费用加土地费用。'), [
          ('Each space holds at most one unit. Neighbouring means directly adjacent with no river between the spaces.', '每格最多一个单位。“相邻”指直接相连且中间没有河流。'),
          ('Grassland supports sheep, cows and all four building types; forests support woodcutters; mountains support miners. On mixed terrain, any matching unit is legal.', '草地可放绵羊、奶牛及四种建筑；森林可放伐木工；山脉可放采矿工。混合地形可放任一符合其中地形的单位。'),
          ('Land costs £1–£6. Clan discounts and explicit bonus rules may change the total. Initial workers also cost money.', '土地费用为£1–£6，氏族折扣和明确的奖励可改变费用。初始工人也要付费。'),
          ('An exhausted column cannot supply another unit. Slaughtered animals return to your board and may be deployed again by a later Expand action.', '对应栏用完就不能再拿该类单位。屠宰后动物返回版图，之后可通过扩张重新部署。')],
      table=((['Unit', 'Normal unit cost', 'Required terrain'], ['单位', '正常单位费用', '所需地形']), [
          (['Sheep', '£8', 'Grassland'], ['绵羊', '£8', '草地']), (['Cow', '£9', 'Grassland'], ['奶牛', '£9', '草地']),
          (['Cheese dairy', '£12', 'Grassland'], ['乳酪工厂', '£12', '草地']), (['Bakery', '£8', 'Grassland'], ['面包店', '£8', '草地']),
          (['Field', '£18', 'Grassland'], ['田地', '£18', '草地']), (['Distillery', '£10', 'Grassland'], ['酿酒厂', '£10', '草地']),
          (['Woodcutter', '£6', 'Forest'], ['伐木工', '£6', '森林']), (['Miner', '£10', 'Mountain'], ['采矿工', '£10', '山脉'])]))

topic('shipping', '5; publisher FAQ', ('Shipping crosses water, not land', '航行跨水，不跳陆地'),
      ('Pay £4 to advance shipping by one step. River-crossing reaches the adjacent space across a river; later levels also cross the indicated number of loch spaces.', '花费£4提升一级航行能力。跨河级可到河对岸紧邻的格子；后续等级还可跨越相应数量的湖泊格。'), [
          ('Without shipping, you cannot expand across water. Levels progress from none to river-crossing, then 1-, 2-, 3- and 4-loch shipping.', '无航行能力时不能跨水扩张。等级依次为无、跨河、跨1、2、3、4块湖泊。'),
          ('You can never leap over land, including when following a river. A longer shipping range does not turn an intervening land hex into water.', '任何等级都不能跳过陆地，即使沿着河流也不行。航行距离再远也不能把中间的陆地当作水域。'),
          ('On one Expand action, use either a loch crossing or an adjacent river crossing; do not combine the two into a longer route.', '一次扩张可跨湖泊，或跨河到紧邻格，不能把两者串成更长的路径。')],
      image='shipping.png', caption=('Red reaches “1” without shipping, “2” after river-crossing, and “3” with 1-loch shipping. Crossed-out spaces require jumping land. Only “1*” neighbours the blue dairy without a river.', '红色无航行可到“1”，跨河后可到“2”，跨1块湖泊可到“3”。红叉格需要跳过陆地，不能到达。“1*”才与蓝色乳酪工厂无河相邻。'))
quiz('shipping', ('With 4-loch shipping, can you leap over a land hex along a river?', '航行可跨4块湖泊时，能沿河跳过一块陆地吗？'),
     [('Yes, if the destination is empty', '可以，只要终点是空格'), ('No, land cannot be skipped', '不可以，不能跳过陆地'), ('Only if your own unit occupies it', '仅当中间是己方单位时可以')], 1,
     ('Shipping range crosses water; no level permits jumping land.', '航行距离用于跨水，任何等级都不能跳陆地。'))

topic('neighbours', '5; publisher FAQ', ('Neighbourhood bonus: discounted buying', '相邻奖励：折扣买入'),
      ('After expanding next to an opponent with no river between you, you may immediately buy the good that their unit produces from the common supply at a discount.', '扩张后与对手单位无河相邻，可立即以折扣价从公共供应堆买入该单位生产的货物。'), [
          ('Basic goods cost £2 less per unit; processed goods cost £3 less. Use one available merchant per good and move the market price normally afterward.', '基础货物每个减£2，加工货物每个减£3。每个货物仍需一个可用商人，交易后照常调价。'),
          ('The limit is three of the same good per turn, or four in a two-player game—even if you neighbour two units that produce the same good.', '同一行动轮内同种货物最多买3个；双人游戏最多4个。即使邻接两个生产同种货物的单位，也不翻倍。'),
          ('Neighbouring several different producers can let you buy several good types, each with the usual merchant requirement. Workers produce money, not a market good.', '邻接不同货物的生产单位可分别购买多种货物，每种都要有足够商人。工人生产金钱，不对应可购买的市场货物。'),
          ('This is an immediate bonus, not a permanent discount. Shipping reach across a river does not grant it. The normal prohibition on buying and selling the same good with your merchants still applies.', '这是立即使用的奖励，不是永久折扣。隔河处于航行范围内不触发。自己的商人不能同时买卖同种货物的限制仍适用。')])
quiz('neighbours', ('In a 3-player game you expand beside two enemy dairies. How much cheese can this bonus buy?', '三人游戏中扩张到两个对手乳酪工厂旁，这次奖励最多买多少乳酪？'),
     [('3 total', '总共3个'), ('6 total', '总共6个'), ('Unlimited', '不限数量')], 0,
     ('The per-turn cap is three per good type, even beside identical producers.', '每个行动轮每种货物上限3个，邻接同类单位也不累加上限。'))

topic('building-bonus', '5, 11', ('Fourth factory: building bonus', '第四座工厂：建筑奖励'),
      ('Deploying the fourth cheese dairy, bakery or distillery can give a building bonus if your export box is empty.', '放置第四座同类乳酪工厂、面包店或酿酒厂时，若出口货箱为空，可获得建筑奖励。'), [
          ('Draw three contracts from the draw pile. Keep zero or one and return the others to the bottom; pay the normal current-round cost if you take one.', '从合同堆抽3个，保留0或1个，其余放回堆底。拿取时照常按当轮费用结算。'),
          ('This is part of the Expand action. Fields, sheep, cows and workers do not trigger this fourth-factory bonus.', '奖励是扩张行动的一部分。田地、绵羊、奶牛和工人不会触发第四座工厂奖励。'),
          ('Buchanan draws six and may keep up to two, limited by available export boxes. Taking two in the same bonus costs only once.', '布坎南氏族抽6个，按货箱空位最多保留2个。同一次奖励拿2个只结算一次费用。')])

topic('upgrades', '5–6', ('Technology, shipping and merchants', '科技、航行与商人'),
      ('Each upgrade or merchant hire normally uses its own action. Technology improves every deployed worker of one type; hiring makes one new merchant available.', '通常每次升级或雇佣各用一个行动。科技提升同类全部已部署工人的收入，雇佣则增加一个可用商人。'), [
          ('Technology costs £10: flip the corresponding woodcutter or miner tile. That type earns £2 more per worker in each Production phase; it does not pay immediate income.', '科技升级£10，翻面伐木工或采矿工的科技板块。以后每个生产阶段，该类型每个工人多收入£2，不是立刻获得收入。'),
          ('Shipping costs £4 per step. Hire a merchant for £4 by moving one from the player board to your available stock; there are seven merchants in your colour, two normally available at the start.', '航行每级£4。雇佣商人£4，从版图移一个到可用区；每个颜色共有7个商人，通常初始可用2个。'),
          ('A bonus upgrade instead offers: technology for £5, shipping free, a new merchant free, or retrieval of one merchant from the market. MacDonald cannot upgrade technology.', '奖励升级可选：£5升级科技、免费升级航行、免费雇佣一个商人，或从市场收回一个商人。麦当劳氏族不能升级科技。')])
quiz('upgrades', ('Does a bonus upgrade make technology completely free?', '奖励升级会让科技升级完全免费吗？'),
     [('Yes', '会'), ('No, technology still costs £5', '不会，科技仍需£5'), ('No, it still costs £10', '不会，仍需£10')], 1,
     ('The technology option is discounted to £5; shipping and merchant options are free.', '科技选项优惠到£5；航行和商人选项免费。'))

topic('fulfil', '6', ('Fulfil a contract and slaughter animals', '完成合同与屠宰牛羊'),
      ('Pay all goods on the left of your contract, take the benefits on its right, and move the completed contract beside your export box to free it.', '支付合同左侧全部要求，获得右侧收益，再把已完成合同正面朝上放到货箱旁，空出货箱。'), [
          ('Beef requires slaughtering a cow; mutton requires slaughtering a sheep. Return each animal from the map to its player-board column. This is part of fulfilling the contract, not a separate action.', '牛肉必须屠宰奶牛，羊肉必须屠宰绵羊。将地图上对应动物放回玩家版图。屠宰是完成合同的一部分，不另占行动。'),
          ('You may not slaughter animals just to clear land or stockpile meat. Slaughter reduces future milk or wool production and frees the space for any legal expansion.', '不能为了腾地或囤肉而屠宰。屠宰会减少之后的牛奶或羊毛产量，并让该格可被任何玩家合法扩张进入。'),
          ('Contracts never request milk or grain. Imported goods are recorded on fulfilled contracts; they are scoring rewards, not market goods in your stock.', '合同不要求牛奶或谷物。进口货物记在已完成合同上，用于计分，不是放入库存买卖的市场货物。'),
          ('For cotton, tobacco and sugar cane, advance that good’s global import marker by the amount imported. Reaching or passing a marked reward space grants £1; resolve the marker at fulfilment, not retroactively.', '获得棉花、烟草或甘蔗时，按数量推进该货物的全局进口指示物。到达或经过奖励格获得£1，完成合同时立即记录，不能事后追领奖励。')],
      image='contract.png', caption=('This contract asks for 1 bread, 1 cheese and 1 whisky. It awards 3 tobacco, 2 bonus upgrades and £10.', '这份合同要求1面包、1乳酪、1威士忌；奖励3烟草、2次奖励升级和£10。'))
quiz('fulfil', ('May you slaughter a sheep simply to empty its space?', '可以只为了腾空格子而屠宰绵羊吗？'),
     [('Yes, as a free action', '可以，免费行动'), ('Yes, as your main action', '可以，占主要行动'), ('No, only to fulfil a contract requiring meat', '不可以，只能为完成要求肉类的合同而屠宰')], 2,
     ('Slaughtering is allowed only as part of fulfilling an export contract.', '屠宰只能作为完成出口合同的一部分。'))

topic('export-bonuses', '6', ('Resolve export bonuses immediately', '立即结算出口奖励'),
      ('Direct export bonuses are money, free land for an expansion, and bonus upgrades. You may resolve these bonuses in any order.', '直接出口奖励有金钱、免费土地扩张和奖励升级，可自行决定这些奖励的结算顺序。'), [
          ('Money comes from the supply immediately. Free land permits an immediate Expand action without land cost; the unit itself still costs money and all reach/terrain rules apply.', '金钱立即从供应堆拿取。免费土地允许立即扩张一次，免土地费，但单位仍要付费，范围和地形规则照常适用。'),
          ('A free-land expansion can trigger neighbourhood and building bonuses when their conditions are met.', '免费土地扩张满足条件时，仍可触发相邻奖励与建筑奖励。'),
          ('For each bonus upgrade choose technology at £5, free shipping, a free merchant hire, or retrieving one merchant. With multiple bonus upgrades you may repeat the same eligible option.', '每次奖励升级可选择£5科技、免费航行、免费雇佣商人或收回一个商人。有多次奖励升级时，可重复选择仍合法的同一选项。')])

topic('ports', '6, 10', ('Ports: a bonus once per game', '港口：每处每局一次'),
      ('A port neighbouring or within shipping reach of one of your units is available as a free bonus on your turn, before or after your main action.', '港口与己方单位相邻或处于其航行范围内时，可在自己的主要行动前或后免费使用奖励。'), [
          ('Use it now or on a later turn, provided you still have access then. You may use several different ports on the same turn.', '可当时使用，也可留到以后自己的行动轮，但使用时仍需可达。同一行动轮可以使用多个不同港口。'),
          ('After using a port, place your marker by it. Each player may use each port once per game; another player’s marker does not block you.', '使用后放自己的港口标记。每位玩家每处港口每局限用一次；别人的标记不会阻止你使用。'),
          ('The meat-discount port must be used with a contract requiring meat. The price-adjustment port changes one good by three steps before trading it.', '减肉港口须配合要求肉类的合同使用；调价港口在交易该货物前把其价格调整3格。')],
      image='port-reach.png', caption=('Black is directly next to this port. Red needs at least 2-loch shipping to use it from the pictured cow.', '黑色直接邻接港口；红色要从图中奶牛位置使用该港口，需至少跨2块湖泊的航行能力。'))

topic('pass', '3, 6', ('Pass money and next round’s order', '跳过奖励与下轮顺位'),
      ('Passing ends your actions for this round. Put your order marker in the next available position and immediately take the printed pass money.', '跳过后本轮不再行动。将顺位标记移到下轮最靠前的空位，并立即拿取该位置的跳过奖励。'), [
          ('The first player to pass is first next round, the second is second, and so on. With four players, pass rewards in order are £16, £14, £12 and £10.', '先跳过者下轮先行动，之后依次排序。四人游戏按跳过顺序分别获得£16、£14、£12、£10。'),
          ('Use the turn-order track for your player count. If others have passed, the remaining player continues taking one action each turn until also passing.', '按人数使用对应顺位轨。其他人都跳过后，剩余玩家仍可每次执行一个行动，直到自己也跳过。'),
          ('You still collect production and round scoring after passing. The passing money in round 5 also matters for the final money score.', '跳过后仍参加生产与当轮计分。第五轮跳过所得金钱也计入最终金钱得分。')])

topic('production', '7', ('Production: income → basics → processing', '生产：收入 → 基础货物 → 加工'),
      ('Only units deployed on the map produce. Collect worker income, then basic goods, then optionally process goods once per factory.', '只有地图上已部署的单位生产。先拿工人收入，再拿基础货物，最后可选择让每座工厂加工一次。'), [
          ('The empty slots on your player board show deployed production. Money values below workers show cumulative income, not an extra payment to add for each exposed number.', '版图空出的格子显示已部署产能。工人下方标的是累计收入，不要把每个露出的累计数值再相加。'),
          ('Processing is optional. You can use milk or grain produced this phase, saved earlier, or bought from the market.', '加工是可选的。可使用本阶段刚生产、以前储存或从市场买来的牛奶和谷物。'),
          ('Each dairy, bakery or distillery processes at most one input per Production phase. Having extra inputs does not let one factory process repeatedly.', '每座乳酪工厂、面包店或酿酒厂每个生产阶段最多加工一个原料。原料多也不能让同一工厂无限加工。')],
      table=((['Deployed unit', 'Production per round'], ['已部署单位', '每轮产出']), [
          (['Woodcutter', '£4; £6 with its technology'], ['伐木工', '£4；对应科技升级后£6']), (['Miner', '£6; £8 with its technology'], ['采矿工', '£6；对应科技升级后£8']),
          (['Sheep / cow / field', '1 wool / 1 milk / 2 grain'], ['绵羊／奶牛／田地', '1羊毛／1牛奶／2谷物']),
          (['Cheese dairy', '1 milk → 1 cheese'], ['乳酪工厂', '1牛奶 → 1乳酪']), (['Bakery', '1 grain → 1 bread'], ['面包店', '1谷物 → 1面包']), (['Distillery', '1 grain → 1 whisky'], ['酿酒厂', '1谷物 → 1威士忌'])]),
      image='production.png', caption=('Each factory consumes its input. One grain used for bread cannot also become whisky.', '每座工厂都会消耗原料。同一个谷物做了面包，就不能再用来酿威士忌。'))

topic('round-scoring', '7, 10', ('Round scoring happens after production', '生产后进行当轮计分'),
      ('Score only the current round’s scoring tile, using your state after production. Add its Glory to your track; goods counted are not spent.', '只按当前轮次的计分板块，以生产后的状态获得荣誉分并推进记录轨；用于计分的货物不消耗。'), [
          ('Five scoring tiles are selected and ordered during setup. Some count current stock or units; others count symbols on all your fulfilled contracts.', '设置时随机选择并排列5个计分板块。有的看当前库存或单位，有的看所有已完成合同上的符号。'),
          ('For every-two conditions, count complete pairs. A leftover single does not score that pair reward.', '“每两个”条件只计算完整的一对，剩余单个不获得该组奖励。'),
          ('Round scoring is separate from final scoring. Goods kept now can contribute to both if still in stock at the end.', '当轮计分与最终计分分别结算。保留下来的货物，若终局仍在库存，可在两者中分别得分。')])

topic('final-scoring', '7–8', ('Final score and imported goods', '最终计分与进口货物'),
      ('After round 5 production and scoring, total Glory, remaining goods and money, imports, export ranking and settlement ranking. Highest VP wins.', '第五轮生产及计分后，汇总荣誉、剩余货物与金钱、进口货物、出口排名和定居点排名。胜利点最多者获胜。'), [
          ('Cotton, tobacco and sugar cane values depend on everyone’s combined imports. Most imported is worth 3 VP each, middle 4, least 5.', '棉花、烟草、甘蔗按全体玩家合计进口量定价：最多者每个3分，中间4分，最少5分。'),
          ('When import quantities tie, cotton is considered rarer than tobacco, and tobacco rarer than sugar cane. Count your own quantities on completed contracts.', '进口量相同时，棉花比烟草稀有，烟草比甘蔗稀有。你的得分按自己已完成合同上的数量计算。'),
          ('For ranking ties, share the total points for the occupied places equally, rounding down. In a 3-player export tie for first, two players receive (12+6)/2 = 9 VP each.', '排名并列时，将占用名次的分数相加后均分，向下取整。例如三人游戏出口并列第一，两人各得(12＋6)÷2＝9分。'),
          ('Money left after converting each full £10 to 1 VP breaks a tie on total VP.', '每满£10兑换1分后剩余的零钱，用于打破总分平局。')],
      table=((['Category', 'VP'], ['类别', '胜利点']), [
          (['Glory', '1 per Glory'], ['荣誉', '每点1分']), (['Basic / processed goods in stock', '1 / 2 per good'], ['库存基础／加工货物', '每个1／2分']),
          (['Money', '1 per full £10'], ['金钱', '每满£10得1分']), (['Hops on completed contracts', '1 per hops'], ['已完成合同上的啤酒花', '每个1分']),
          (['Cotton / tobacco / sugar cane', '3, 4 or 5 each by global rarity'], ['棉花／烟草／甘蔗', '按全局稀有度，每个3、4或5分']),
          (['Export ranking, 3–4 players', '12 / 6 / 0 / 0'], ['出口合同数量排名，3–4人', '12／6／0／0']), (['Export ranking, 2 players', '8 / 0'], ['出口合同数量排名，2人', '8／0'])]))

topic('settlements', '8', ('Settlements: count the connected groups', '定居点：数连通的聚落'),
      ('A settlement is a connected cluster of your units with no river between neighbours. Count how many settlements your largest shipping-connected network contains.', '一个定居点是一组无河相邻、彼此连接的己方单位。最终比较的是你最大航行连通网络包含多少个定居点。'), [
          ('An isolated unit is a settlement too. Adjacent units separated by a river are in different settlements, but shipping may connect them for scoring.', '单独一个单位也算定居点。两格之间有河，即使紧邻也属于不同定居点，但可通过航行连接计分。'),
          ('Use your actual shipping level. Connections may run through other settlements in the network; disconnected groups are not added together.', '按自己实际航行等级判断，可经网络中的其他定居点逐段连接；彼此断开的网络不能相加。'),
          ('Do not count occupied hexes or the size of one settlement. Slaughtering may split a settlement into more groups, or break the network.', '不比较占格总数，也不比较单个定居点的大小。屠宰可能把一个聚落拆成多个，也可能切断网络。')],
      table=((['Players', 'Settlement ranking VP'], ['人数', '定居点排名得分']), [
          (['3–4', '18 / 12 / 6 / 0'], ['3–4', '18／12／6／0']), (['2', '12 / 0'], ['2', '12／0']), (['Ties', 'Share the occupied places, round down'], ['并列', '均分占用名次分数，向下取整'])]),
      image='settlements.png', caption=('Red has four settlements but only three in one network with 1-loch shipping. Black connects five with 2-loch shipping. The circled red group is one settlement.', '红色共有4个定居点，但跨1块湖泊只能把其中3个连成网络；黑色跨2块湖泊可连接5个。圈内的红色单位合计只算1个定居点。'))
quiz('settlements', ('Three of your units touch without rivers between them. How many settlements is that?', '三个己方单位彼此相连且没有河流分隔，算几个定居点？'),
     [('Three', '3个'), ('Two', '2个'), ('One', '1个')], 2,
     ('A connected cluster of same-colour neighbouring units is one settlement.', '同色单位通过无河相邻连成一组，就是一个定居点。'))

topic('setup', '1–3, 8', ('Setup and player counts', '设置与人数差异'),
      ('Assemble the four map modules with A–D clockwise at the centre, choose four ports and five scoring tiles, then select clans and place paid starting workers.', '拼好四块地图，让中心A–D按顺时针排列；选4个港口及5个计分板块，再选氏族并付费放置初始工人。'), [
          ('Use the market, export board and export boxes on the side for your player count. Set prices to the circled starting positions; fill contract spaces, leaving one empty in solo and 3-player games.', '市场、出口版图与货箱均使用对应人数面，价格放在圈出的起始格；补满指定合同位，单人及三人游戏留一个货箱空位。'),
          ('Place each colour’s four of each non-worker unit and eight workers on the player board. Put five merchants on the board, two in the available stock; start with no shipping and unupgraded worker technology unless your clan says otherwise.', '每种非工人单位各4个、工人8个放在玩家版图。5个商人放在版图，2个可用；通常航行从无开始，科技未升级，氏族另有规定则遵照氏族。'),
          ('Choose a starting player at random. Draw player count + 1 clans and pair each with a random starting tile. Choose pairs in reverse turn order and take the money and goods printed on the selected starting tile.', '随机决定起始玩家。抽“人数＋1”个氏族，各随机配一个起始板块。按逆顺位选择组合，获得所选起始板块上的钱与货物。'),
          ('Place one starting worker each in turn order, then a second each in reverse order. Pay worker + land cost both times; the two workers need not neighbour one another. Clan setup exceptions still apply.', '按顺位各放第一个初始工人，再按逆顺位各放第二个。每个都付工人＋土地费用，两者不必相邻；氏族设置特例仍适用。'),
          ('With 1–2 players, mist-shaded edge land is outside the active map, but all lochs remain active. The newly exposed edge is the border for Fergusson and border scoring. Two-player neighbourhood buying caps at four per good.', '1–2人使用小地图，边缘带雾阴影陆地不属于有效地图，但全部湖泊仍有效。由此形成的新边缘用于弗格森和边界计分。双人相邻奖励每种货物上限4个。'),
          ('Keep game information public. Money and goods are unlimited; use substitutes if the physical tokens run out.', '游戏信息公开。金钱和货物数量不限，实物耗尽时可用替代物。')],
      image='player-board.png', caption=('The starting board holds units and five un-hired merchants. Two additional merchants begin beside the board, ready to trade.', '初始版图放置单位与5个尚未雇佣的商人，另外2个商人在版图旁，可直接用于贸易。'), appendix=True)

topic('clans', '11–12', ('The eight standard clans', '八个标准氏族'),
      ('Apply your clan’s exceptions to the normal rules. The ninth clan, MacEwen, is a separately marked Kickstarter variant.', '氏族能力覆盖相应普通规则。第九个麦克尤恩氏族属于单独标明的众筹变体。'), details=[
          (('Buchanan · two export boxes', '布坎南 Buchanan · 两个出口货箱'),
           ('You have two export boxes. One obtain action can take up to two contracts; one fulfil action can complete up to two. Taking two together costs the round fee once (or gives £5 once in round 1). The building bonus draws six and keeps up to two, including the £5/building-bonus port. Pay separately for separate main/bonus instances: taking one through a port and another through a main action is not one combined purchase.', '拥有两个货箱，一次获取可拿至多2个合同，一次完成可完成至多2个。同一次拿2个只结算一次当轮费用（第一轮只得一次£5）。建筑奖励改为抽6个、保留至多2个，也适用于£5加建筑奖励港口。不同主要／奖励行动分别收费，例如港口拿1个再主要行动拿1个，不合并成一次购买。')),
          (('Campbell · cheaper factories', '坎贝尔 Campbell · 工厂折扣'),
           ('For each processed-good factory type separately, the first costs £3 less, the second and third £4 less, the fourth £5 less. This affects cheese dairies, bakeries and distilleries, not fields or land cost. For example, the first bakery costs £5 before land.', '每种加工货物工厂分别计算：第一座减£3，第二和第三座减£4，第四座减£5。适用于乳酪工厂、面包店、酿酒厂，不适用于田地或土地费用。例如第一座面包店本体付£5。')),
          (('Cunningham · butter from milk', '坎宁安 Cunningham · 牛奶制黄油'),
           ('At the end of Production, discard any amount of milk from your stock for £8 each. No merchants are needed and the milk market price does not change.', '生产阶段结束时，可弃掉库存任意数量牛奶，每个获得£8。不需商人，也不改变牛奶市价。')),
          (('Fergusson · three border workers', '弗格森 Fergusson · 三个边界工人'),
           ('Start with three workers, all on border spaces and fully paid. Place the third after everyone else has placed their two; the three need not neighbour each other. Start with 2-loch shipping in 3–4 players, or 1-loch in 1–2 players.', '初始有3个工人，都放在有效地图边界且全额付费。其他玩家放完两个后再放第三个，三者不必相邻。3–4人初始航行为跨2块湖泊，1–2人为跨1块湖泊。')),
          (('MacDonald · fishermen and rowing', '麦当劳 MacDonald · 渔夫与划船'),
           ('Cover the normal worker area with your clan tile and leave the technology area empty; technology upgrades are unavailable. All eight workers can be woodcutters, miners or fishermen, cost £6 and earn £4 each. Fishermen deploy on empty lochs or port tiles, with no land cost on lochs; no two fishermen may be adjacent. Once per turn, before your main action, row one fisherman to an adjacent loch, obeying placement restrictions. Rowing does not grant a neighbourhood bonus; deploying can. Adjacent land is neighbouring to a fisherman, but crossing lochs to expand still needs shipping. In 1–2 players start with river-crossing shipping.', '用氏族板块覆盖普通工人区，科技区留空，不能升级科技。8个工人可作伐木工、采矿工或渔夫，均花£6、产£4。渔夫可放空湖泊或港口板块，湖泊免土地费；两个渔夫不能相邻。每个行动轮一次，在主要行动前可划一名渔夫到紧邻湖泊并遵守放置限制。划船不触发相邻奖励，部署渔夫可以。渔夫紧邻陆地视为相邻，但跨湖扩张仍需航行。1–2人初始拥有跨河航行。')),
          (('MacKenzie · whisky and the cellar', '麦肯基 MacKenzie · 威士忌与酒窖'),
           ('Gain £3 for each whisky produced without discarding it. At the start of Production move cellar barrels one step right; a barrel already at the rightmost position exits to stock. Barrels may be withdrawn to stock at any time: aged positions award £7 or £15 when withdrawn. At the end of Production put at most one freshly produced whisky in the leftmost cellar position. Cellar whisky counts for the processed-goods round-scoring tile.', '每生产1威士忌额外获得£3，不弃掉威士忌。生产开始时酒窖酒桶右移一格，原已在最右格的酒桶取回库存。随时可取酒回库存，陈酿位置取出时分别得£7或£15。生产结束时最多将1桶刚生产的威士忌放入酒窖最左格。酒窖里的威士忌也参与加工货物当轮计分。')),
          (('Robertson · river deltas', '罗伯森 Robertson · 河口三角洲'),
           ('When placing a unit on a river-delta space (next to a river directly entering a loch), reduce the total unit-plus-land cost by £3 in 3–4 players or £2 in 1–2 players. This also applies to starting workers.', '在河口三角洲格（紧邻直接汇入湖泊的河流）放单位，单位加土地总费用在3–4人减£3、1–2人减£2。初始工人同样适用。')),
          (('Stewart · trading income', '斯图亚特 Stewart · 贸易收入'),
           ('Start with five available merchants and river-crossing shipping. Each market trade gives £1, before paying for a purchase, regardless of the quantity. If a neighbourhood bonus trades several good types, gain £1 for each type.', '初始可用商人5个且拥有跨河航行。每次市场交易获得£1，买入时先拿这£1再付款，不论数量多少。相邻奖励交易多种货物时，每种获得£1。'))], appendix=True)

topic('port-tiles', '10; 2025 Chinese and publisher port-7 erratum', ('Port tile effects', '港口板块效果'),
      ('Each effect below is a once-per-player-per-game bonus from a reachable port. The exchange port uses the updated rule allowing both placement bonuses.', '以下每个效果都需港口可达，且每位玩家每局限用一次。交换港口按新版规则，允许触发两种放置奖励。'), details=[
          (('1 · One less animal', '1 · 少屠宰一个动物'), ('On a turn fulfilling a contract requiring meat, that contract requires one fewer slaughtered animal.', '在完成需要肉类的合同时使用，该合同可少屠宰一个动物。')),
          (('2 · Exchange basic goods', '2 · 交换基础货物'), ('Discard one basic good and gain any three basic goods, including the type discarded.', '弃掉1个基础货物，获得任意3个基础货物，可包含刚弃掉的种类。')),
          (('3 · Exchange processed goods', '3 · 交换加工货物'), ('Discard one processed good and gain any two processed goods, including the type discarded.', '弃掉1个加工货物，获得任意2个加工货物，可包含刚弃掉的种类。')),
          (('4 · Upgrade and Glory', '4 · 升级与荣誉'), ('Gain one bonus upgrade and 3 Glory. Technology still costs £5 if chosen.', '获得1次奖励升级及3荣誉；选择科技仍需£5。')),
          (('5 · Money', '5 · 金钱'), ('Gain £10.', '获得£10。')),
          (('6 · Market adjustment', '6 · 市场调价'), ('Move one good’s price up or down three steps before trading that good.', '在交易某种货物前，将其价格上调或下调3格。')),
          (('7 · Exchange two units', '7 · 交换两个单位'), ('Exchange two units from your board with two of your units on the map for free, excluding fields on both sides. The new units must differ from the old ones and obey terrain restrictions. You may gain building and neighbourhood bonuses when eligible. Do not use the old English rule forbidding the neighbourhood bonus.', '从玩家版图拿2个单位，与地图上己方2个单位免费交换，两边都不能是田地。新单位必须不同于旧单位并符合地形限制。满足条件可获得建筑奖励和相邻奖励，不采用旧英文版禁止相邻奖励的规定。')),
          (('8 · Money and building bonus', '8 · 金钱与建筑奖励'), ('Gain £5. If the export box has space, you may take the building bonus, still paying the current-round contract cost if you choose a contract.', '获得£5。若出口货箱有空位，可执行建筑奖励，选择合同时仍按当前轮次结算费用。'))], appendix=True)

topic('scoring-tiles', '10', ('The eight standard scoring tiles', '八种标准计分板块'),
      ('Apply the tile chosen for this round after production. “Stock” means goods you currently hold; “fulfilled contracts” includes all contracts you have completed so far.', '生产后结算本轮所选板块。“库存”看当前持有货物，“已完成合同”包括截至目前完成的全部合同。'),
      table=((['Tile', 'Glory earned'], ['板块', '获得荣誉']), [
          (['1 · Basic goods', '1 per basic good in stock'], ['1 · 基础货物', '库存每个基础货物1荣誉']),
          (['2 · Processed goods', '3 per complete pair in stock'], ['2 · 加工货物', '库存每满2个加工货物3荣誉']),
          (['3 · Production units', '1 per sheep, cow, dairy, bakery or distillery; 2 per field'], ['3 · 生产单位', '每只绵羊、奶牛及每座乳酪工厂、面包店、酿酒厂1荣誉；每块田地2荣誉']),
          (['4 · Workers', '2 per deployed worker, including MacDonald fishermen'], ['4 · 工人', '每个已部署工人2荣誉，包括麦当劳渔夫']),
          (['5 · Border spaces', '3 per complete pair of units on active-map borders'], ['5 · 边界', '有效地图边界每满2个单位3荣誉']),
          (['6 · Imported goods', '1 per cotton, tobacco and sugar cane on completed contracts'], ['6 · 进口货物', '已完成合同每个棉花、烟草、甘蔗1荣誉']),
          (['7 · Meat', '2 per meat symbol on completed contracts'], ['7 · 肉类', '已完成合同每个肉类符号2荣誉']),
          (['8 · Upgrades', '1 per technology flip, shipping step and hired merchant; clan starting upgrades count'], ['8 · 升级', '每个已翻面科技、航行升级及已雇佣商人1荣誉；氏族初始升级也算'])]), appendix=True)

topic('solo', '8–9; publisher FAQ', ('Solo game', '单人游戏'),
      ('Use the small map and block every active £1 land space with neutral workers. There is no neighbourhood bonus; aim for the highest score.', '使用小地图，以中立工人封住有效地图上所有£1陆地格；没有相邻奖励，目标是尽可能高分。'), [
          ('Start with five face-up contracts and receive £16 every time you pass. From rounds 2–5, after retrieving merchants, change the prices of three different randomly rolled goods.', '初始摆5个正面合同，每次跳过获得£16。第2–5轮收回商人后，用骰子随机调整3种不同货物价格。'),
          ('For a low price below the bracket, increase by the price die’s magnitude; for a high price above it, decrease by the magnitude. Within the bracket use the signed result. Reroll a good already changed this phase.', '价格低于括号区间时按变价骰绝对值上涨，高于时按绝对值下降，区间内按正负结果调整。同阶段重复掷出已调价货物则重掷货物骰。'),
          ('Refill all six contract slots, then remove the one indicated by the final price die’s sign and number; each action phase starts with five.', '先补满6个合同位，再按最后一次变价骰的正负号和数字移除对应合同，让每次行动阶段开始都有5个。'),
          ('You need not move import markers: compare quantities on your own completed contracts. Rarity still determines 3/4/5 VP; solo does not automatically use the static-value variant.', '不必移动进口标记，直接比较自己已完成合同的数量。稀有度仍决定3／4／5分，单人不自动采用固定价格变体。')],
      table=((['Solo ranking category', 'VP'], ['单人排名项', '得分']), [
          (['Completed contracts: 7+ / 6 / 5 / fewer', '12 / 8 / 4 / 0'], ['完成合同：7+／6／5／更少', '12／8／4／0']),
          (['Connected settlements: 14+ / 11–13 / 8–10 / fewer', '18 / 12 / 6 / 0'], ['连通定居点：14+／11–13／8–10／更少', '18／12／6／0']),
          (['Total score bands', '0–115 Newbie; 116–130 Rookie; 131–145 Average; 146–160 Expert; 161+ Genius'], ['总分评级', '0–115初出茅庐；116–130沙场新兵；131–145渐入佳境；146–160出类拔萃；161+绝顶高手'])]), appendix=True)

topic('variants', '9–10', ('Optional variants and Kickstarter tiles', '可选变体与众筹板块'),
      ('These are optional rules agreed before setup. Keep them separate from the standard game and from the Industria expansion.', '以下规则须在设置前约定，属于可选变体，与标准规则及Industria扩展分开。'), details=[
          (('Static import values', '固定进口货物价格'), ('Each cotton, tobacco and sugar cane is always worth 4 VP. Do not track rarity.', '棉花、烟草、甘蔗每个固定4分，不追踪稀有度。')),
          (('Simplify the board', '简化板块'), ('You may omit scoring tiles and/or port tiles. For a tighter 2–3-player map, cover four land spaces with spare port tiles, preferably one per module.', '可不使用计分板块和／或港口板块。2–3人想让地图更紧，可用备用港口板块封4个陆地格，最好每块地图一个。')),
          (('Without clans', '不使用氏族'), ('Ignore clan powers. Choose starting tiles and add £0/£2/£4/£6 in starting order to their normal money and goods.', '忽略氏族能力。在起始板块正常钱与货物外，按顺位额外获得£0／£2／£4／£6。')),
          (('Clan auction', '氏族拍卖'), ('Draw exactly one clan per player and pair each with a starting tile. Bid VP for first choice, starting with a random player, then clockwise. Bids range from 0 to 30 and must increase; declining to raise removes you from that auction. The winner records the bid as negative VP, selects a pair and takes the next starting-order position. Begin the next auction to their left. The last player takes the remaining pair and last position without losing VP.', '抽与人数相同的氏族，各配起始板块。随机玩家起拍，顺时针用VP竞拍优先选择权。出价0至30且须加价，不跟价则退出该轮拍卖。胜者记下对应负VP，选一组并取得下一个顺位。由其左手边开始下一轮拍卖。最后玩家免费拿剩余组合并列最后顺位。')),
          (('Kickstarter additions', '众筹追加板块'), ('The extra port costs £3 and a marker to use one of the other three ports. The extra scoring tile gives 2 Glory per occupied £5/£6 space. MacEwen can use imported hops immediately to brew up to three beer per contract, spending one grain per beer for £9 each in the supplied 2025 Chinese rules; this value is explicitly provisional. Agree to these additions before play.', '追加港口支付£3并放标记，使用另三个港口之一的效果。追加计分板块为每个已占据的£5／£6格给2荣誉。麦克尤恩可用刚进口的啤酒花立即酿啤酒，每杯花1谷物，每合同最多3杯；所附2025中文规则每杯£9，并明确这是暂定值。使用前先约定加入这些内容。'))], appendix=True)


def build():
    DEST.mkdir(parents=True, exist_ok=True)
    for lang in topics:
        filename = 'guide-data.en.js' if lang == 'en' else 'guide-data.js'
        (DEST / filename).write_text('export const topics = ' + json.dumps(topics[lang], ensure_ascii=False, indent=2) + ';\n\nexport const questions = ' + json.dumps(questions[lang], ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
        title = 'Clans of Caledonia — organized rules' if lang == 'en' else '加勒多尼亚 — 整理版规则'
        note = ('Edition: supplied Chinese 2025-06-08 base game, checked against supplied English CC15. This organized rules translation covers setup, core actions, production, scoring, standard clans, ports and optional variants; it is not a verbatim transcription. Source page references are internal. Port 7 follows the 2025 correction. Industria is not included.' if lang == 'en' else '版本：所附2025-06-08中文基础版，对照所附英文CC15。本文为整理版规则，覆盖设置、主要行动、生产、计分、标准氏族、港口与可选变体，并非逐字全文翻译。页码用于内部追溯，7号港口采用2025修订，不包含Industria扩展。')
        lines = ['# '+title, '', '> '+note, '']
        for t in topics[lang]:
            lines += ['## '+t['title'], '', t['key'], '']
            lines += ['- '+b for b in t['bullets']]
            if 'table' in t:
                table=t['table']
                lines += ['', '| '+' | '.join(table['headers'])+' |', '| '+' | '.join(['---']*len(table['headers']))+' |']
                lines += ['| '+' | '.join(row)+' |' for row in table['rows']]
            for d in t.get('details',[]):
                lines += ['', '### '+d['title'], '', d['text']]
            if 'image' in t:
                lines += ['', f"![{t['caption']}](images/{t['image']})", '', t['caption']]
            lines += ['', ('Source pages: ' if lang=='en' else '来源页：')+sources[t['id']], '']
        (CONTENT / f'rules.{lang}.md').write_text('\n'.join(lines), encoding='utf-8')
    (CONTENT/'source-map.json').write_text(json.dumps(sources, ensure_ascii=False, indent=2)+'\n',encoding='utf-8')
    print(f'Built {len(topics["en"])} bilingual topics and {len(questions["en"])} questions.')


if __name__ == '__main__':
    build()
