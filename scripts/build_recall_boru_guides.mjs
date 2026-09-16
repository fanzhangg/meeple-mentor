// Reviewed bilingual source. Regenerate the two guides with node scripts/build_recall_boru_guides.mjs.
import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
const games = {};
let current;
const pair = (en,zh) => ({en,zh});
function game(slug,title,zh,overview,overviewZh) { current=games[slug]={slug,title,zh,overview,overviewZh,topics:[],questions:[]}; }
function topic(id,title,zh,key,keyZh,bullets=[],extra={}) { current.topics.push({id,title:pair(title,zh),key:pair(key,keyZh),bullets:bullets.map(([en,zh])=>pair(en,zh)),...extra}); }
function table(headers,rows) { return {headers:headers.map(([en,zh])=>pair(en,zh)),rows:rows.map(row=>row.map(([en,zh])=>pair(en,zh)))}; }
function question(id,topic,prompt,zh,options,answer,explanation,explanationZh) {current.questions.push({id,topic,prompt:pair(prompt,zh),options:options.map(([en,zh])=>pair(en,zh)),answer,explanation:pair(explanation,explanationZh)});}
function figure(image,en,zh,fold=false) {return {image,caption:pair(en,zh),fold};}

game('brian-boru','Brian Boru: High King of Ireland','布莱恩·博鲁：爱尔兰至高王',[
  'Lead a noble house in medieval Ireland. Win towns through card play, forge marriages, repel Vikings and support the church to gain influence across eight regions.',
  'Winning a trick claims its town; losing lets you use a secondary action to build your position elsewhere. After three rounds with three players, or four rounds with four or five, add final scoring to your points. The highest total wins.'
],[
  '你领导中世纪爱尔兰的一个贵族家族，通过出牌取得城镇、缔结婚姻、抵抗维京人和支持教会，在八个区域中争取影响力。',
  '赢下一墩可以取得目标城镇，输家则用次要行动积累其他优势。三人游戏进行三轮，四至五人进行四轮；最后把终局得分加到已有分数上，总分最高者获胜。'
]);
topic('round','Round structure and drafting','轮次流程与轮抽','Each round: Preparation → Draft → Action → Upkeep. Draft two cards at a time, pass left, then play all but one card.','每轮依次进行准备、轮抽、行动、维持。每次轮抽保留两张并向左传牌，行动阶段最后一张手牌不打出。',[
 ['Preparation: reveal one Viking card, add its indicated raiders to the battle area, then discard the card. Reveal the next marriage card. The Princess of Denmark is always last.','准备：翻开一张维京牌，把指定数量的袭击者放入战斗区，再弃掉该牌；翻开下一张婚姻牌。丹麦公主始终最后出现。'],
 ['Shuffle all 25 action cards. Deal 8 each with 3 players, 6 with 4, or 5 with 5. With 3 or 4 players, set the undealt card aside unseen.','洗混全部25张行动牌。三人每人8张、四人6张、五人5张。三或四人时，将未发出的那张牌面朝下放旁边，不得查看。'],
 ['Simultaneously keep two face down and pass the rest left; repeat. If only one or two arrive, keep them all. You may review your selections but cannot exchange them.','同时选两张面朝下保留，其余向左传，重复此过程。收到的牌只剩一至两张时全部保留；可以查看已选牌，但不能换回。'],
 ['Play tricks until everyone has one card left, then discard that card. This gives 7 / 5 / 4 tricks per round for 3 / 4 / 5 players. Do not look through the shared discard pile.','进行到每人只剩一张牌时弃掉该牌，进入维持阶段。因此三／四／五人每轮分别打7／5／4墩；不得翻看公共弃牌堆。']
]);
topic('trick','Who wins, and who acts first?','谁赢墩，谁先结算？','The leader selects a town with no disc and leads its colour or white. Others may play any card. Highest matching colour or white wins; everyone then acts in ascending card value.','领出者选择没有圆片的城镇，并打出同色牌或白牌。其他人可出任意牌。同色及白牌中数字最大者赢墩；之后所有人按牌面数字由小到大结算。',[
 ['There is no obligation to follow suit. An off-colour card cannot win, even if it has the largest number. White royal cards count as the town’s colour.','没有跟色义务。异色牌即使数字最大也不能赢墩；白色王室牌视作目标城镇的颜色。'],
 ['The winner performs the primary action at the top of their card. Each loser chooses one complete secondary action at the bottom. Resolve that action’s symbols left to right.','赢家执行牌顶主要行动；每位输家选择牌底的一整项次要行动。所选行动的图标必须从左到右结算。'],
 ['The primary town symbol claims the active town with your disc and gives you the active town marker. You normally lead the next trick. Discard your card after resolving it.','主要行动的城镇图标让你在目标城镇放自己的圆片，并取得目标城镇标记，通常由你领出下一墩。行动结算后弃掉出牌。']
],{figures:[figure('trick-cards.webp','For a red town, red 11, red 2, white 13 and yellow 17 are played. White 13 wins. Resolve the cards in order 2 → 11 → 13 → 17.','争夺红色城镇时，四人分别出红11、红2、白13、黄17。白13赢墩，但结算顺序为2→11→13→17。')]});
topic('actions','Card actions and extra payments','牌面行动与追加付费','Church, battle and courtship symbols each give one step or token, then allow extra steps or tokens at two coins each. Expansion costs five coins and needs its own action symbol.','教会、战斗和求婚图标各提供一次基础效果，之后可每付2金币追加一次。扩张必须由对应图标触发，花费5金币。',[],{table:table([['Symbol','图标'],['Resolve','结算']], [
 [['Coin / crossed-out coin','金币／划掉的金币'],['Gain / return one coin. Only the forced loss symbol substitutes a loss of 2 points when you have no coins; if you also have no points it does nothing.','获得／归还1金币。只有强制失去金币图标允许在没有金币时改失去2分；连分数也没有则无事发生。']],
 [['Renown','声望'],['Take one renown token. It remains yours and is scored by battle rewards and at game end.','获得1枚声望，保留在自己面前，用于战斗奖励与终局计分。']],
 [['Church cross','教会十字架'],['Put one disc in the church area; optionally pay 2 coins per additional disc.','在教会区放1枚圆片，可每付2金币再放1枚。']],
 [['Battle axe','战斧'],['Take one raider from the battle area; optionally pay 2 coins for each extra. An empty battle area gives nothing.','从战斗区拿1枚袭击者，可每付2金币多拿1枚；战斗区已空则无效。']],
 [['Courtship seal','求婚印章'],['Move up one marriage space; optionally pay 2 coins for each extra step. You cannot move past the top.','婚姻轨前进1格，可每付2金币再前进1格；到顶后不能继续前进。']],
 [['Expansion arrow with 5','带5的扩张箭头'],['Optionally spend 5 coins to claim a town with no disc, directly connected by road to a town you control. You cannot jump over any intervening town.','可付5金币，占领与自己控制的城镇有道路直接相连、且没有圆片的城镇，不能越过任何中间城镇。']],
 [['Crossed-out Viking control','划掉的维京控制标记'],['Remove a Viking control token anywhere on the board. The player whose disc is uncovered regains the town.','移除版图上一枚维京控制标记，下面圆片的主人重新控制该城镇。']]
 ]),figures:[figure('expansion.webp','The blue town can expand to the empty town on its right. The purple town blocks expansion along the other road; you cannot skip it.','蓝色城镇可沿路扩张到右侧空城镇。另一方向被紫色城镇隔断，不能跳过它。')]});
topic('courtship','Marriage track: finish on an empty space','婚姻轨：行动结束时不能重叠','Finish your entire action, including extra payments, before checking your marriage position. If occupied, move down to the next empty space; the bottom space may hold everyone.','先完成整项行动及追加付费，再检查婚姻轨位置。若与他人重叠，向下退到最近的空格；起始格允许多人共存。',[
 ['You may move through occupied spaces. An extra 2-coin payment can avoid ending on an occupied space.','途中可以经过有人占据的格子；可追加2金币避免停在占用格。'],
 ['Upkeep always resolves Marriage → Battle → Church → Claim regions, in that order. Resolve the final upkeep as normal before final scoring.','维持阶段固定按婚姻→战斗→教会→宣称区域的顺序结算。最后一轮仍完整结算维持，再终局计分。'],
 ['At the marriage step, the player highest on the track takes the marriage card, immediately gains its rewards, and returns to the bottom. If everyone is at the bottom, discard the card with no winner.','婚姻步骤中，位置最高者拿婚姻牌、立即领取奖励，再回到起始格。若全员都在起始格，无人获牌，直接弃掉。'],
 ['Then each player receives the reward printed beside their current space. The marriage winner, now at the bottom, gets no further track reward. Other players keep their positions.','随后各人领取当前格旁的奖励；获牌者已经回到底部，不再获得轨道奖励。其他玩家不重置位置。'],
 ['Marriage rewards can grant points, renown or an unoccupied town in the named region. If no eligible town exists, that town reward has no effect. Track rewards may give coins, renown or any unoccupied town as pictured.','婚姻牌奖励包括分数、声望、指定区域内无圆片的城镇。若没有合法城镇，该项奖励无效。轨道按图标奖励金币、声望或任意无圆片的城镇。']
],{figures:[figure('courtship.webp','Peer advances three spaces and would land on Kate. Paying 2 more coins puts him one space ahead; without that payment he retreats past Georgios to the next empty space.','Peer前进三格后会与Kate重叠。再付2金币可前进到她前面；不付则必须向后退，越过Georgios，停到最近的空格。')]});
topic('battle','Viking invasion, then battle rewards','维京入侵，再发战斗奖励','If raiders remain in the battle area, every player tied for the fewest captured raiders loses one town. Then clear the battle area and award spoils, even if the invasion succeeded.','战斗区若还留有袭击者，持有袭击者最少的每位玩家各失去一个城镇。随后清空战斗区，并发战利品；即使维京入侵成功仍会发奖励。',[
 ['A sole player with the most captured raiders chooses which town each loser gives up. If the lead is tied, each losing player chooses their own lost town. Cover its disc with a Viking control token; the disc stays underneath.','若持有袭击者最多者唯一，由其选择每位输家失去的城镇；若最多者并列，由失城玩家自己选。用维京控制标记盖住圆片，保留下面的原主圆片。'],
 ['If the battle area is empty, no town is lost. Clear all remaining raiders from that area before awarding spoils. Players’ captured raiders are separate from this area.','战斗区为空则无人失城。奖励前清除该区剩余袭击者；玩家已拿到面前的袭击者与公共战斗区分开计算。'],
 ['First reward: the unique player with the most captured raiders gains 1 renown, scores 1 point per renown now owned, and returns all their raiders. If tied for most, skip this entire reward.','第一档：独自持有最多袭击者者获得1声望，按此时全部声望每枚得1分，并归还自己的全部袭击者。若最多者并列，整档跳过。'],
 ['Second reward: recount the raiders still held by players. Every player now tied for most gains 1 point and returns 1 raider. A player with zero raiders never receives battle rewards. All other captured raiders carry over.','第二档：重新比较玩家手中剩余袭击者，此时最多者（含并列）各得1分并归还1枚。持有0枚者不获战斗奖励，其余未归还的袭击者保留到以后。']
]);
topic('church','Church rewards: recalculate after each step','教会奖励：每档重新比较','Resolve the sole leader first, then the remaining leaders, then players still holding at least four church discs. A monastery makes its town count as two for region claims.','先结算唯一领先者，再重新比较剩余领先者，最后检查仍有至少四枚教会圆片的玩家。带修道院的城镇在区域宣称时算作两个城镇。',[
 ['The unique player with the most church discs places a monastery around a town they control, if possible; takes the active town marker; and retrieves all their church discs. If tied, skip all these effects.','教会圆片最多且唯一的玩家，在自己控制的城镇周围放修道院（若可行），取得目标城镇标记，并收回自己全部教会圆片。若并列，整档跳过。'],
 ['Recount: each remaining leader gains 1 point and retrieves 1 church disc.','重新比较：此时教会圆片最多者（含并列）各得1分并收回1枚圆片。'],
 ['Finally, clockwise from the active town marker holder, anyone still with at least 4 church discs places a monastery if possible. Only players who place one this way retrieve all their remaining discs.','最后，从目标城镇标记持有者开始顺时针结算：仍有至少4枚教会圆片的人可在可行时放修道院，成功放置后才收回全部剩余圆片。'],
 ['A town can have only one monastery. You must currently control that town to build one. Unreturned church discs stay for future rounds.','每个城镇最多一个修道院；建造时必须正控制该城镇。未收回的教会圆片保留到以后。']
]);
topic('regions','Unlock and claim regions','解锁与宣称区域','First check whether occupied towns meet the region’s threshold, counting monasteries twice and Viking towns too. Then a sole majority takes the face-up claim token; a tie leaves it where it is.','先看区域内已控制的城镇总数是否达到门槛：修道院算两个，维京城镇也计入。再由单独控制最多城镇者拿走已翻面的宣称标记；并列则标记留在原处。',[
 ['For each face-down token, reaching or exceeding the printed threshold flips it face up. It never needs to be unlocked again. Face-down tokens cannot be claimed or scored.','逐个检查背面朝上的标记，达到或超过印刷门槛即翻面，之后无需重新解锁。未翻面标记不能取得或计分。'],
 ['Check every face-up token, whether on the board or held by a player. A challenger needs strictly more towns than the current holder to take it. A tie does not remove an existing claim.','所有已翻面标记都要检查，包括玩家已持有的。挑战者必须严格多于原持有人才能夺走；并列不会让已有宣称失效。'],
 ['Without a military alliance, the Vikings compete as their own side. If they have the sole majority, the token stays on or returns to the board.','没有军事同盟时，维京人单独比较城镇数；若其独占最多，标记留在或归还版图。'],
 ['Monasteries count twice for both the unlocking threshold and the majority comparison, including monasteries in Viking-controlled towns.','修道院在翻面门槛和多数比较中都算两城，维京人控制的修道院城镇也一样。']
]);
topic('princess','Princess of Denmark: choose one alliance','丹麦公主：三选一','The final marriage winner immediately chooses military support, trade, or 4 points. Military and trade count Viking towns for different scoring purposes.','最后的婚姻获胜者立即在军事支援、建立贸易、直接4分中选一。军事与贸易让维京城镇参与的计分项目不同。',[],{table:table([['Choice','选择'],['Viking towns count for…','维京城镇计入…']], [
 [['Military support','军事支援'],['Your town count when claiming regions, and when scoring face-up claim tokens on the board. They do not increase your final number of regions with a town.','你的区域宣称城镇数，以及版图上已翻面宣称标记的终局计分；不增加终局分布区域数。']],
 [['Establish trade','建立贸易'],['Your final number of different regions containing a town. They do not count for your claim-token scoring or region claims.','你的终局城镇分布区域数；不用于你的宣称标记计分或区域宣称。']],
 [['Spurn her','拒绝婚姻'],['Discard the card and gain 4 points immediately.','弃掉该牌，立即获得4分。']]
 ])});
topic('scoring','Final scoring and ties','终局计分与平局','After the final upkeep, add coins, initiative, renown, claims and regional spread to your existing score. Highest total wins.','最后一次维持结束后，将金币、先手标记、声望、宣称与区域分布得分加到已有分数，总分最高者获胜。',[
 ['Most coins, only if unique: 1 point. Active town marker: 1 point. Each renown: 1 point.','金币独自最多：1分；持有目标城镇标记：1分；每枚声望：1分。'],
 ['Each face-up claim token you hold scores its printed value, even if the region is currently tied. Face-down tokens score nothing.','你持有的每枚已翻面宣称标记得印刷分数，即使该区域此时并列。未翻面的标记不计分。'],
 ['For a face-up claim token still on the board, all players tied for the most towns in that region score half its printed value, rounded down. Viking control and the chosen Princess alliance still matter.','仍留在版图上的已翻面宣称标记，由该区域城镇数并列最多的所有玩家各得印刷分数的一半，向下取整。仍须计入维京控制及公主同盟的影响。'],
 ['Tied total: most held claim tokens → most marriage cards → shared victory.','总分平局：先比较持有的宣称标记数，再比较婚姻牌数，仍同分则共享胜利。']
],{table:table([['Regions with at least one town','至少控制一城的区域数'],['Points','分数']], [['1–2','0'],['3–4','1'],['5','3'],['6','5'],['7','7'],['8','10']].map(([a,b])=>[[a,a],[b,b]]))});
topic('setup','Setup reference','开局设置速查','Start with 3 coins, 1 renown and 10 points. Each player places one starting town in a different region.','每人以3金币、1声望、10分开始；各人的起始城镇必须位于不同区域。',[
 ['Give each player all 25 discs of a colour and a reference card. Put one disc at the marriage track’s bottom and another at 10 points. Tokens and discs are not intended to be limited.','每人取一种颜色的全部25枚圆片及一张速查牌；婚姻轨起点和计分轨10分各放一枚圆片。标记与圆片不视为数量限制。'],
 ['Place all eight claim tokens face down in their region slots. Sort the coins, renown, monasteries, Viking raiders and Viking control tokens into supplies.','八枚宣称标记背面朝上放对应槽位；金币、声望、修道院、维京袭击者与维京控制标记分类放公共供应区。'],
 ['Put the English Princess of Denmark at the bottom of the marriage deck; remove the German duplicate. Shuffle the other marriage cards and put 2 random cards above her with 3 players, or 3 with 4–5 players. Return the rest unseen.','将英文丹麦公主放婚姻牌堆底，移除德文重复牌。其余婚姻牌洗混，三人随机放2张在上面，四至五人放3张；其余不看地移除。'],
 ['Shuffle the Viking deck. Randomly choose the starting player and give them the active town marker. In clockwise order choose one empty starting town each, never in another player’s starting region.','洗混维京牌。随机选起始玩家，交给他目标城镇标记；顺时针各占一个空城镇，不得选别人已选的起始区域。']
],{appendix:true});
question('off-colour','trick','A red town is active. Red 11, red 2, white 13 and yellow 17 are played. Who wins, and which card resolves first?','目标为红色城镇，出牌为红11、红2、白13、黄17。谁赢墩，哪张先结算？',[
 ['Yellow 17 wins; red 2 resolves first.','黄17赢，红2先结算。'],['White 13 wins; red 2 resolves first.','白13赢，红2先结算。'],['White 13 wins and resolves first.','白13赢且先结算。']],1,'Only matching-colour and white cards can win. All cards then resolve by ascending value, regardless of the winner.','只有同色和白牌能赢墩，结算则不看胜负，所有牌按数字从小到大进行。');
question('expansion-cost','actions','You have 3 coins and 10 points, and your chosen action offers expansion but no coin gain. Can you spend points to pay the missing 2 coins?','你有3金币和10分，所选行动有扩张但不给金币。能用分数补足缺少的2金币吗？',[
 ['Yes, lose 4 points and pay 3 coins.','可以，失去4分并付3金币。'],['No; optional expansion requires 5 coins.','不行，可选扩张需要实付5金币。'],['Yes, pay 2 points.','可以，付2分。']],1,'Only the forced crossed-out-coin symbol allows losing points when you have no coins. That exception cannot finance optional purchases.','仅强制失去金币图标允许在无金币时失分，不能用该例外支付可选购买。');
question('battle-tie','battle','The battle area is empty. Captured raiders are A: 4, B: 4, C: 2. What do A and B receive?','战斗区为空。A持4枚、B持4枚、C持2枚袭击者。A与B获得什么？',[
 ['Each gains renown, scores all renown, and returns all raiders.','各获声望，按声望得分，并归还全部袭击者。'],['Neither receives any reward.','均不获奖励。'],['Each gains 1 point and returns 1 raider.','各得1分并归还1枚袭击者。']],2,'The tied lead skips the first reward completely. The second reward includes ties, so both retain three raiders.','最多者并列时跳过第一档；第二档允许并列，两人各结算一次并各留下3枚袭击者。');
question('claim-tie','regions','You already hold a face-up claim token. At upkeep, you and one rival are tied for most towns, with the Vikings behind. What happens?','你已持有某区域翻面的宣称标记。维持时你与一位对手城镇数并列最多，维京人更少。标记怎么办？',[
 ['Keep the token.','继续持有。'],['Return it to the board.','退回版图。'],['Both take a token.','两人各拿一个。']],0,'A tie leaves the claim token where it is. A rival must have strictly more towns to take it.','并列时标记留原处，对手必须严格更多才可夺走。');
question('princess-trade','princess','You chose the Princess’s trade alliance. What do Viking-controlled towns add to your final scoring?','你选择丹麦公主的贸易同盟。维京控制的城镇用于哪项终局计分？',[
 ['Both claims and regional spread.','宣称与区域分布都算。'],['Regional spread only.','只算区域分布。'],['Claims only.','只算宣称。']],1,'Trade counts Viking towns for the number of regions containing your towns. Military support is the separate claim-related choice.','贸易只把维京城镇计入你的分布区域数；宣称相关用途属于另一项军事支援选择。');

game('recall','Recall','忆迹寻踪',[
 'Guide a tribe through the remains of earlier civilizations. Explore a shared map, build workshops and monuments, and recover ancient knowledge to add new abilities to your tribe.',
 'On each regular turn, insert a keycard to activate both the card and an action box, or Recall your used cards to produce resources and recharge abilities. After 13 regular turns and four special rounds, the most culture points wins. All six paths score; your three specializations add bonuses.'
],[
 '你带领一个部落探索先民遗迹，在共享地图上修建工坊与纪念碑，发掘古代知识，逐渐获得其他部落的能力。',
 '普通回合插入密钥卡，同时启动卡牌和行动格，或者进行回溯，收回卡牌、生产资源并恢复能力。经过13个普通轮次和4个特殊轮次后，文化分最高者获胜。六条道路都计分，你选择专精的三条额外加分。'
]);
topic('turn','Keycard or Recall','使用密钥卡，或回溯','On a regular turn choose exactly one: insert an available keycard into an empty slot, or Recall. Free actions may accompany either choice on your turn.','普通回合二选一：把可用密钥卡插入空槽，或进行回溯。两种回合中都可搭配自由行动。',[
 ['A keycard activates its own effects and the action box immediately above its slot. Effects are optional and may be resolved in any order; a single movement effect must finish before another effect interrupts it.','密钥卡同时启动自身效果和插槽正上方的行动格。各效果可选，顺序自定；但一整项移动效果必须先完成，不能被其他效果打断。'],
 ['The two white starting keycards have no effects of their own. Used cards occupy their slots until retrieved. A slash between effects means choose one of the listed effects.','两张白色起始密钥卡自身没有效果。用过的卡留在槽内直到取回；效果间的斜杠表示从列出的选项中选一。'],
 ['Play clockwise; the starting player never changes. After everyone acts, advance the hourglass before the starting player’s next turn. There are 13 regular and 4 special rounds.','按顺时针行动，起始玩家始终不变。所有人完成回合后，起始玩家开始下一回合前推进沙漏。全局有13个普通轮次和4个特殊轮次。']
],{figures:[figure('keycard.webp','The card goes into the slot below C. Resolve both its effects and C’s water movement and develop action, in your chosen order.','卡牌插入C格下方的槽，卡牌效果与C格的水路移动、发展行动都会启动，顺序自定。')]});
topic('action-boxes','Starting action boxes A–F','起始行动格 A–F','Choose a vacant slot for the action you need. Crystals and followers gained earlier in your turn can pay for later effects.','选择仍有空槽的行动格。回合中先获得的水晶与追随者可用于支付后续效果。',[],{table:table([['Box','行动格'],['Starting effect','起始效果']], [
 [['A','A'],['Gain 2 followers; buy up to 4 more in total at 1 white crystal for 1, 1 red for 2, or 1 purple for 4. You may also remove any number of followers from anywhere on the map for 1 white crystal each.','获得2名追随者；可按1白买1名、1红买2名、1紫买4名的比例额外购买，合计最多加4名。还可从地图任意位置移除任意数量追随者，每名换1白水晶。']],
 [['B','B'],['Move 2 times, or pay one white / red / purple crystal to move 3 / 4 / 5 times instead. Also develop once. Pay at most one crystal for movement.','移动2次，或付1白／红／紫水晶改为移动3／4／5次，另外发展一次。最多付1颗水晶增强移动。']],
 [['C','C'],['One water movement and one develop action.','一次水路移动和一次发展行动。']],
 [['D','D'],['Two moves, two develop actions, or one of each.','移动两次、发展两次，或各一次。']],
 [['E','E'],['One move, one reveal, and one develop action.','移动一次、揭示一块区域板块、发展一次。']],
 [['F','F'],['Pay 1 white crystal to copy an action box already activated by a keycard. You need at least one other used box; this copies the box, not that card.','付1白水晶复制一个已用密钥卡启动的行动格。必须已有至少一个其他用过的格；复制行动格效果，不复制其卡牌。']]
 ])});
topic('recall','Recall: production, then recharge','回溯：先生产，再恢复能力','Retrieve all used keycards. For each card retrieved, activate one visible red production space; each space at most once. Finally recharge all ability stones.','取回全部已用密钥卡。每取回一张，可启动一个可见的红色生产格，每格最多一次；最后恢复全部能力石。',[
 ['Only cards retrieved from slots count for production. At the start you have three visible production spaces; building reveals more.','只有从槽中取回的卡牌计入生产次数。初始有三个可见生产格，建造可露出更多。'],
 ['You may use free actions, including ability stones, during Recall before recharging. Once you recharge the stones, you cannot use ability stones again for the rest of that turn.','回溯中可在恢复前使用自由行动，包括能力石；一旦恢复，本回合剩余时间便不能再使用能力石。'],
 ['Retrieving one keycard through a symbol or ION is not Recall: it does not activate a production space or recharge your stones.','通过取回单张卡的图标或ION能力收回卡牌并不等于回溯：不会启动生产格，也不会恢复能力石。']
],{figures:[figure('recall.webp','Three used keycards let you activate three different visible production spaces. After production, return all ability stones to their storage area.','取回三张已用密钥卡，可启动三个不同的可见生产格；生产后将全部能力石放回储存区。')]});
topic('free-actions','Crates, crystals and ability stones','补给箱、水晶与能力石','On your turn you may use crates, convert crystals and spend ready ability stones, including during special rounds and Recall.','自己的回合中可使用补给箱、转换水晶和花费可用能力石，特殊轮次及回溯时也可以。',[
 ['Crates: when gained, look at the tile and keep it secret. To use it, reveal it, resolve its effect and discard it beside the stack.','补给箱：获得时查看并秘密保留；使用时展示，结算效果后弃到牌堆旁。'],
 ['Place stones on your tribe, gadget or unlocked ancient-tribe activation space. Stone colour does not restrict activation. First use of the same ability costs 1 stone, the second 2 more, the third 3 more, and so on until Recall resets its cost.','将能力石放到部落、工具或已解锁的古代部落启动位，颜色不限。同一能力首次花1颗、第二次另花2颗、第三次另花3颗，以此类推，回溯后重置。'],
 ['Abilities with the fixed “1” stone symbol always cost 1 stone. Triggered abilities can activate only once per occurrence of their trigger; paying extra does not repeat the same trigger.','带固定“1”能力石图标的能力每次始终只花1颗。触发式能力每次触发事件只能启动一次，不能靠加付能力石重复同一次触发。'],
 ['Three white → one red; three red → one purple. Breaking down gives one red → two white, or one purple → one red plus one white. A crystal upgrade instead moves one crystal up one tier.','3白换1红，3红换1紫；向下拆分为1红换2白，或1紫换1红加1白。水晶升级则是将一颗水晶提高一级。'],
 ['At the end of your turn keep at most 6 crystals of each type. Crystal markers are unlimited; use substitutes if needed.','回合结束时，每种水晶最多保留6颗。水晶标记不限量，不足时可使用替代物。']
],{figures:[figure('crystals.webp','Upgrading by conversion costs three of the lower type. Breaking down returns fewer: a purple becomes one red plus one white; a red becomes two whites.','向上兑换需要三颗低阶水晶；向下拆分不对称：一紫变一红加一白，一红变两白。')]});
topic('followers','Followers and presence','追随者与在场判定','Place new followers in a hex where you already have followers or a building, or in your starting space. A downward-arrow placement symbol instead places them where that effect occurs.','新追随者放到已有自己追随者或建筑的格子，或自己的起始格。带向下箭头的放置图标则指定放到效果发生的当地格。',[
 ['Spending a follower removes it from the map to your supply. One large figure represents three followers and may be exchanged for three small figures at any time.','花费追随者时，将它从地图放回自己的供应区。一个大棋子代表三名追随者，可随时与三个小棋子互换。'],
 ['Followers are limited by your supply. If none are available you cannot gain another, but you may return your followers to supply at any time. Returning them this way grants no crystal unless an effect says so.','追随者数量受供应区限制，没有可用棋子便不能新增；你可随时收回自己的追随者，但普通收回不给水晶，除非效果明确允许。'],
 ['Presence on a region tile means at least one follower or building anywhere on that tile. A requirement in a particular hex is narrower: pieces elsewhere on the tile do not qualify.','在某区域板块“在场”，指板块任意位置有至少一个自己的追随者或建筑。要求在某个六角格的条件更严格，同板块其他格的棋子不算。']
]);
topic('movement','Movement and compulsory relic pickup','移动与强制拾取遗物','One move shifts any group from one hex to an adjacent hex. Entering or crossing a relicube hex requires enough followers there to pay for the cube; you cannot simply pass it by.','一次移动把一组追随者从一格移到相邻一格。进入或经过遗物方块所在格，必须在当地留下足够追随者支付拾取费用，不能无视遗物直接穿过。',[
 ['A group may contain some or all followers in the starting hex. A multi-move effect can move different groups or the same group repeatedly, picking up or leaving followers along the way. Complete the entire effect before other effects.','一组可包含起点的一部分或全部追随者。多次移动可分给不同组或同组连续使用，途中可合并或留下追随者；整项效果完成前不可穿插其他效果。'],
 ['Normal movement cannot enter water, volcanoes or unrevealed region tiles. Water movement takes one group across connected water from one hex to another. Do not traverse the same water hex twice within that water movement.','普通移动不能进入水域、火山或未揭示区域。水路移动把一整组通过相连水域从一格送到另一格，同一次水路移动不能重复经过同一水格。'],
 ['Upgrade C’s special water movement allows members of the group to end in separate hexes adjacent to the water. This is an upgrade exception to keeping the group together.','C升级的特殊水路移动可让同组追随者分散到水域相邻的不同格，这是整组同行的一项升级例外。'],
 ['Put the cube in its colour’s leftmost empty space on your board and gain the covered reward. Columns cost 1, 2, 2, 3, 3 followers; pay from the cube’s hex. For movement through it, leave them there to pay at the end of movement. Water cubes need water movement.','遗物放到面板同色行最左空位，获得盖住的奖励。五列费用依次为1、2、2、3、3名追随者，必须由遗物所在格支付；途经时留下这些人，于移动结束时拾取。水上遗物必须用水路移动拾取。']
],{figures:[figure('water-movement.webp','The whole group crosses connected water from the monument hex to the vault hex with one water movement.','一次水路移动可让整组从纪念碑格经相连水域到达宝库格。'),figure('relicube.webp','This is the player’s second black cube: pay two followers from its hex, then place it in the second black slot and advance black knowledge twice.','这是该玩家第二个黑色遗物方块，须从当地支付两名追随者，放入黑色第二格，并获得两步黑色知识。')]});
topic('reveal','Reveal a region','揭示新区域','To reveal a tile, have presence anywhere on an adjacent region tile. Turn it face up in any orientation; score 1 point per distinct player present on at least one adjacent region tile, including yourself.','揭示板块需要你在相邻某块区域板块内在场。翻面后方向自选；相邻区域中每有一位不同玩家在场（包括自己），你得1分。',[
 ['Count players, not figures, buildings or adjacent tiles. One player present on several adjacent regions still contributes just 1 point.','数不同玩家，不数棋子、建筑或相邻板块。同一玩家在多块相邻区域出现，也只贡献1分。'],
 ['Draw a random relicube for every printed cube symbol and three ability stones for each excavation site.','在每个遗物图标放一个随机遗物方块，每个发掘点放三颗能力石。'],
 ['A newly revealed camp adjacent to an existing building immediately gives that building’s owner its reward, subject to each player’s once-per-camp limit.','新出现的营地若与既有建筑相邻，该建筑主人立即得到营地奖励，仍遵守每位玩家每个营地只领一次。']
],{figures:[figure('reveal.webp','Red reveals the tile. Yellow, red and blue each have presence on an adjacent region, so red gains 3 points, then fills the new cube spaces and excavation site.','红色揭示板块。黄、红、蓝三位玩家在相邻区域在场，因此红色得3分，再补上遗物方块和发掘点能力石。')]});
topic('develop','Develop: build, excavate or upgrade','发展：建造、发掘或升级','Spend one develop action to build or excavate in a hex with your followers. Alternatively, use it to upgrade one crystal. Building costs 1 local follower plus 1 for each other player’s building in that hex.','一次发展可在有自己追随者的格子建造或发掘，也可改为升级一颗水晶。建造的当地追随者费用为1名，加上该格每位已有建筑的其他玩家各1名。',[
 ['Each player may have at most one building per hex, but different players may share a hex. Pay all followers from the building hex. Each other player already built there gains one follower into that hex.','每位玩家每格最多一座建筑，不同玩家可共处。同格建造的全部追随者费由该格支付；每位已在该格建造的对手各向该格放入一名追随者。'],
 ['Excavating always costs just one local follower, regardless of buildings or other players present. Add the required crystal cost for the chosen build or excavation.','发掘始终只需当地一名追随者，不受其他建筑或玩家影响。建造或发掘还须支付对应水晶费用。'],
 ['Building next to a camp immediately gives its reward, at most once per player per camp. One building can trigger several new camps. Excavating does not trigger camps. You may move onto a camp but cannot build or excavate there.','营地旁建造立即拿奖励，每人每个营地最多一次。一座建筑可触发多个尚未领过的营地。发掘不触发营地；营地格可进入，但不能建造或发掘。']
],{figures:[figure('shared-building.webp','Yellow builds where red and blue already have monuments: yellow pays three local followers; red and blue each gain one follower into this hex.','黄方在红蓝两家已有纪念碑的格子建造，支付当地三名追随者；红蓝各在此格获得一名追随者。'),figure('camps.webp','The new vault touches two camps. Red already received the left camp’s reward from its monument, so only the right camp gives a reward for this new building.','新宝库邻接两个营地。红方之前已通过纪念碑拿过左营地奖励，这次只领取右营地奖励。')]});
topic('buildings','Vaults, workshops and monuments','宝库、工坊与纪念碑','Use the hex’s terrain to choose the building, pay its local follower cost plus any crystal cost, and take the building from your player board.','建筑类型由地形决定。支付当地追随者及所需水晶，从玩家面板取下建筑放到地图。',[],{table:table([['Building','建筑'],['Cost, order and benefit','费用、顺序与奖励']], [
 [['Vault','宝库'],['Vault hex only; no crystals. Choose any remaining vault in any order and immediately gain the reward to its right. The relicube reward takes one cube from the lower-right display without an extra follower cost, then grants its slot reward.','限宝库格；不花水晶。任取一座剩余宝库，无顺序限制，立即获得右侧奖励。遗物奖励从版图右下供应区拿一个方块，不额外花追随者，再领放入面板后的奖励。']],
 [['Workshop','工坊'],['Field / forest / mountain. In that terrain’s column build bottom first and pay its printed crystal cost. Take a yellow / green / gray keycard respectively. Refill a green or gray display immediately. Selection is limited to the display and may run out.','田野／森林／山地。对应地形列自下而上建造并支付印刷水晶费；分别拿黄／绿／灰密钥卡，绿或灰展示区立即补牌。只能从展示区选择，牌可能用完。']],
 [['Monument','纪念碑'],['Monument hex only; take bottommost remaining monument and pay its printed crystal cost. Printed main-board sites score their knowledge track at game end. On a region-tile site, the first builder chooses an available monument tile; all builders there receive its shown reward, using its immediate/endgame timing.','限纪念碑格；取最下方剩余纪念碑，付印刷水晶费。主版图预印地点终局按对应知识轨得分；区域板块上的地点由首位建造者选一块可用纪念碑板块，之后该处建造者都按其图标时机获得奖励（即时或终局）。']]
 ]),figures:[figure('vault.webp','Choosing this vault gives one available relicube from the lower-right supply, with no extra follower payment for that cube.','选择这座宝库后，从右下供应区拿一个可用遗物方块，不为这个方块额外支付追随者。'),figure('monuments.webp','Power scores both pictured monuments. Its B specialization repeats only the monument-tile score on the left, not the knowledge-track site on the right.','力量道路会计算这两种纪念碑；其B面专精只重复左侧纪念碑板块的分数，不重复右侧知识轨地点。')]});
topic('excavate','Excavation costs rise as stones disappear','能力石越少，发掘越贵','One develop action takes one stone. Pay one follower in the excavation hex plus a crystal determined by how many stones are there before that action.','一次发展只拿一颗能力石。支付发掘格内一名追随者，再按本次行动开始时剩余的石头数量支付水晶。',[],{table:table([['Stones remaining','剩余能力石'],['Crystal','水晶'],['Knowledge in the chosen stone’s colour','所取能力石颜色的知识']], [
 [['3','3'],['1 white','1白'],['2 steps','2步']], [['2','2'],['1 red','1红'],['3 steps','3步']], [['1','1'],['1 purple','1紫'],['4 steps','4步']]
 ]),figures:[figure('excavation.webp','With two stones left, the first excavation costs one follower and a red crystal for 3 knowledge. Taking the last stone in a second action costs another follower and a purple crystal for 4 knowledge.','剩两颗时，第一次发掘付一名追随者加一红，得3步知识；第二次行动拿最后一颗，再付一名追随者加一紫，得4步知识。')]});
topic('knowledge','Knowledge unlocks ancient tribes','知识解锁古代部落','At step 3 choose a gadget; the first player also reveals the ancient tribe and gains 1 point. At step 5 gain your coloured ability stone and unlock all that tribe’s abilities.','到第3步拿一件工具，第一位还揭示古代部落并得1分。到第5步拿自己的彩色能力石，并解锁该部落的全部能力。',[
 ['The first player to reach or pass step 3 reveals the tribe and its four gadgets and chooses one. Leave the other three face up for later players reaching step 3. Each later player chooses one remaining gadget.','第一位到达或经过第3步者翻开部落及四件工具并选一件；另外三件保持正面，后续达到该步的玩家各选一件剩余工具。'],
 ['At step 5 move the matching lock tile from your board onto the ancient tribe card. Use its active ability by putting stones on your now-unlocked activation space; its passive abilities also apply. Several players can unlock the same tribe.','第5步把对应锁定板块从面板移到古代部落牌上。主动能力通过自己已解锁的启动位花能力石使用，被动能力也生效；多人可同时解锁同一部落。'],
 ['Reaching or passing a bonus chip gives its reward. Leave the chip for other players. You cannot advance beyond the track end; excess knowledge is lost.','到达或经过奖励标记就拿奖励，标记留给其他玩家继续使用。不能超过轨道末端，多余知识失去。']
]);
topic('culture','Culture and action upgrades','文化分与行动升级','Green points score immediately; purple points wait until final scoring. Reaching or passing a culture-track upgrade symbol gives a tile from that symbol’s adjacent stack.','绿色分数立即获得，紫色分数终局结算。文化轨到达或经过升级图标时，从该处旁边的牌堆拿一块升级板块。',[
 ['Choose either side of the upgrade tile and install it on the matching lettered action box. It permanently improves that box.','升级板块正反面选一面，装到相同字母的行动格，永久增强该格。'],
 ['If you already resolved any effect from that action box this turn, its newly upgraded effect must wait until a later turn. If no original effect has yet been used, you may use the upgrade this turn.','若本回合已用过该行动格的任何效果，新升级效果须等以后回合；若原效果一个都还没用，本回合即可用升级版。'],
 ['Once final scoring begins, culture points no longer grant upgrade tiles.','终局计分开始后，文化分不再触发升级板块。']
]);
topic('special-rounds','Special rounds: paths and objectives','特殊轮次：道路与目标','At each marked time-board space, resolve its special round clockwise. Free actions remain available, but you cannot use a keycard or Recall.','时间板到达图示位置时，顺时针结算该特殊轮次。仍可做自由行动，但不能使用密钥卡或回溯。',[
 ['At each of the three path choices, move your marker to one of that section’s two path cards. Immediately gain its linked dark bonus-chip reward. This also selects your specialization bonus for that card at game end.','三次道路选择分别从该组两张道路卡中选一张放标记，立即领其关联的深色奖励标记效果，并在终局获得该道路的专精加分。'],
 ['At the objective-discard round, discard one of your two objectives and immediately receive its bottom reward. Keep the other secret for final scoring; do not also receive its bottom reward.','弃目标特殊轮次中，从两张目标牌弃一张并立即拿该牌底部奖励；另一张秘密保留用于终局，不能领取保留牌底部奖励。'],
 ['The final time-board space ends the game. The six path cards all score for everyone, not just the three cards you specialized in.','沙漏到最终格结束游戏。六条道路每人都计分，不是只计你专精的三条。']
]);
topic('paths','Six paths: base score and specialization','六条道路：基础分与专精','Score all six cards from bottom to top. Add the lower specialization only on the three cards bearing your markers, using each card’s chosen A or B side.','六张道路卡自下而上全部计分，只有放了自己标记的三张再加下半部专精奖励，并使用开局选定的A或B面。',[],{table:table([['Path','道路'],['Everyone scores','所有人基础分'],['Specialization A / B','专精 A／B']], [
 [['Knowledge','知识'],['Highest reached point symbol on each knowledge track.','每条知识轨已达到的最高分数图标。'],['A: repeat your second-best track score. B: +4 per track at step 7 or beyond.','A：再计一次得分第二高的知识轨。B：每条至少到第7步的轨道加4分。']],
 [['Ancients','先民'],['2 per white, gray or black ability stone; your player-colour stones do not count.','每颗白、灰、黑能力石2分；玩家色能力石不算。'],['A: +2 per qualifying stone. B: +7 per full white/gray/black set.','A：每颗合资格能力石另加2分。B：每套白灰黑加7分。']],
 [['Legends','传奇'],['2 per built vault.','每座已建宝库2分。'],['A: +2 per vault. B: +5 per complete pair of vaults.','A：每座加2分。B：每完整两座加5分。']],
 [['Efficiency','效率'],['Printed points on all your keycards, including cards in slots.','全部密钥卡的印刷分数，槽内卡也算。'],['A: +2 per yellow, green or gray card. B: +3 per gray card.','A：每张黄绿灰卡加2分。B：每张灰卡加3分。']],
 [['Ambition','雄心'],['Score each relicube colour’s rightmost occupied column: 1 / 3 / 6 / 10 / 15.','各色遗物行只计最右已占列的分数：1／3／6／10／15。'],['A: +6 per white/gray/black/brown set. B: repeat your best colour’s score.','A：每套白灰黑棕加6分。B：最高分颜色再计一次。']],
 [['Power','力量'],['Score each monument’s location; printed main-board sites use their corresponding knowledge track.','各纪念碑地点的分数；主版图预印地点按对应知识轨得分。'],['A: +3 per monument. B: repeat monument-tile scores only, excluding knowledge-scoring sites.','A：每座加3分。B：只重复纪念碑板块分数，不重复知识计分地点。']]
 ])});
topic('endgame','Remaining resources, objective and winner','剩余资源、目标与胜负','After paths, score leftover resources and your kept objective. Highest culture wins; break ties by white, then gray, then black knowledge.','道路之后计算剩余资源和保留目标。文化分最高者胜；平局依次比较白、灰、黑知识轨。',[
 ['Convert crystals to white equivalents: white = 1, red = 2, purple = 3. Add followers on the map; score 1 point per complete group of 3 combined units, rounded down once. Ignore crystal storage limits during this conversion.','水晶折白：白=1、红=2、紫=3，加上地图上的追随者总数，每完整3单位得1分，合计后统一向下取整。此次转换忽略储存上限。'],
 ['Reveal the kept objective: meeting all its requirements scores 15 points. Partial completion scores nothing.','展示保留目标，满足其全部要求得15分；未完成不计分。'],
 ['If all three knowledge tracks also tie, share victory. With the optional companion, you may compare scores with ancient tribes and archive your civilization.','三个知识轨也完全平局则共享胜利。使用可选伴侣网站时，可与先民分数比较并存档自己的文明。']
]);
topic('tribes','Tribe abilities','部落能力速查','Active abilities spend ability stones; passive abilities are always free. An unlocked ancient tribe grants both types. Triggered abilities activate only once per trigger.','主动能力花能力石，被动能力始终免费生效；解锁古代部落后两种能力都获得。触发式能力每次触发只可启动一次。',[],{appendix:true,details:[
 ['AYNIR','AYNIR','Activate to trade up to four times using the exchanges printed on the tribe card, mixing followers, crystals and/or culture. Moving backward on culture does not remove upgrades already gained. Passive: convert 2 white to 1 red or 2 red to 1 purple.','主动：按部落牌所列兑换最多四次，可混合追随者、水晶与文化分；文化轨后退不失去已有升级。被动：2白可换1红，2红可换1紫。'],
 ['BISHOP','BISHOP','Activate for one develop action.','主动：执行一次发展行动。'],
 ['COLTERON','COLTERON','Activate to move a group from one volcano hex to another volcano and gain 1 white crystal. Passive: you may enter volcanoes.','主动：将一组追随者从一个火山格移到另一个火山格，并得1白水晶。被动：可以进入火山格。'],
 ['DORIAN','DORIAN','Activate to put a pig farm on a field hex with your followers or buildings, and add as many pigs as printed on that hex. At most one farm per hex. Passive: move pigs with your followers; pigs sharing a hex with your followers can replace your followers for development or cube pickup. Endgame: 2 points per pig farm where you have followers or buildings. Multiple DORIAN users can move the same pigs and score any farm where they have presence, regardless of who placed it.','主动：在有自己追随者或建筑的田野格放猪场，按该格猪图标数放猪，每格最多一个猪场。被动：移动时可带猪；与自己追随者同格的猪可替代追随者支付发展或拾遗物费用。终局：每个有自己追随者或建筑的猪场2分。多位使用DORIAN能力的人均可带走这些猪，并按在场情况计算任意猪场，不看建造者。'],
 ['ENTERIN','ENTERIN','Activate to place an island on a vacant water, field, forest or mountain hex adjacent to one of your followers or buildings. It counts as water and forest; anyone may enter using regular or water movement. For each adjacent hex containing any player’s building, gain 1 white crystal for workshops, 1 follower placed on the island for vaults, or 1 point for monuments. Count hexes, not the number of buildings.','主动：在自己追随者或建筑相邻的空水域、田野、森林或山地格放岛屿。该格同时视为水域和森林，所有人均可用普通或水路移动进入。每个相邻的有任意玩家建筑的格子提供一次奖励：工坊给1白水晶，宝库给一名放在岛上的追随者，纪念碑给1分；数格子，不数建筑数量。'],
 ['FINDER','FINDER','Activate to place or move your raft onto any vacant water hex, without needing adjacency. Put 3 followers from supply on it; they are not yet in play. Passive: whenever any player spends one or more followers in a hex adjacent to the raft, move one follower from the raft to that hex. Remove an empty raft.','主动：将自己的筏放到或移到任意空水格，无需相邻，并从供应区放三名追随者到筏上，他们尚不算在场。被动：任何玩家在筏旁一格花费一名或更多追随者时，从筏上移一名到该格；筏空时移除。'],
 ['GOLIAT','GOLIAT','When you receive a knowledge-track or path bonus-chip effect, activate to receive it a second time. Once per chip trigger.','获得知识轨或道路奖励标记效果时，可启动以再得一次该效果，每次标记触发最多启动一次。'],
 ['HAYLA','HAYLA','Activate for one special move: a group jumps over one hex (including water, volcano or a cube hex), OR every follower in one hex makes an individual move to adjacent hexes, together or separately.','主动二选一：一组跳过一个格（可跳过水域、火山或遗物格）；或一个格里的每名追随者各移动到相邻格，可分散也可同去。'],
 ['ION','ION','Activate to retrieve one used keycard. No production or recharge follows.','主动：取回一张已用密钥卡，不触发生产或恢复能力石。'],
 ['J’HE','J’HE','When using a keycard, activate to gain its card effects a second time. This repeats the keycard, not the action box.','使用密钥卡时可启动，再得一次卡牌效果；重复的是卡牌，不是行动格。'],
 ['K01','K01','When building a vault, activate to repeat the selected vault reward. For the relicube reward take only one cube, but double the reward from placing that cube on your board.','建宝库时可启动，重复所选宝库奖励。若选遗物，只拿一个方块，但该方块放入玩家面板所给奖励翻倍。'],
 ['LEXANDER','LEXANDER','Activate to upgrade one crystal. Passive: each purple crystal spent on an action grants 1 white crystal and 1 point. Breaking down purple to red + white does not trigger this.','主动：升级一颗水晶。被动：行动中每花一紫水晶，得1白水晶和1分；把紫拆成红加白不触发。'],
 ['MAYFAIR','MAYFAIR','Activate and pay 1 white crystal to upgrade a keycard one tier: white → yellow → green → gray.','主动另付1白水晶，将一张密钥卡升一级：白→黄→绿→灰。'],
 ['NORTHER','NORTHER','Activate to move one group once. Passive: on a camp hex spend one follower to place a random ring and gain its reward. At most one ring may be placed on a camp, across all players.','主动：移动一组一次。被动：在营地格花一名追随者放随机圆环并获其奖励；所有玩家合计，每个营地最多放一个圆环。'],
 ['Vacant hex','空格的定义','A vacant hex has no buildings, followers, relicubes or special tiles.','空格指没有建筑、追随者、遗物方块或特殊板块的格子。']
 ].map(([a,b,c,d])=>({title:pair(a,b),text:pair(c,d)}))});
topic('gadgets','Gadgets and keycard symbols','工具与密钥卡图标','Gadgets follow normal ability-stone costs unless their symbol fixes the cost. Pay attention to whether the effect is free to time or tied to a trigger.','工具遵守普通能力石费用，除非图标写明固定费用；注意能力能自由选择时机，还是必须等待特定事件触发。',[
 ['Upgrade a keycard: remove a white starting card from the game; return yellow to its stack or green to the bottom of its stack, and take one card of the next colour from the display. Refill green/gray displays as usual. You may upgrade a used card, but put the replacement in the same slot without activating it.','升级密钥卡：白起始卡移出游戏，黄卡放回其堆，绿卡放到其堆底，再从展示区拿下一颜色一张；绿灰展示区照常补牌。可升级槽内已用卡，但新卡放回原槽，不立即启动。'],
 ['A free-activation symbol activates one gadget or tribe effect without spending ability stones. A retrieve-card symbol takes back one used card without production.','免费启动图标让你不花能力石启动一个工具或部落效果；取卡图标收回一张已用卡，但不生产。']
 ],{appendix:true,details:[
 ['ALEMBIC','ALEMBIC（蒸馏器）','Spend one follower anywhere on the map to gain 1 red crystal.','从地图任意位置花一名追随者，得1红水晶。'],
 ['BOOSTER','BOOSTER（增幅器）','When gaining a relicube, activate to gain 1 red crystal as well.','拿遗物时可启动，额外得1红水晶。'],
 ['DECRYPTOR','DECRYPTOR（解码器）','When building a vault, activate to gain one knowledge.','建宝库时可启动，得一步知识。'],
 ['EXOSUIT','EXOSUIT（外骨骼）','Ignore the entire follower cost of one develop action or one relicube pickup. When building with this effect, other players with buildings there do not gain followers.','免除一次发展或一次拾遗物的全部追随者费。以此建造时，同格已有建筑的对手不获得追随者。'],
 ['GPR','GPR（探地雷达）','When excavating, activate for one extra knowledge in the acquired stone’s colour.','发掘时可启动，额外获得所取石头颜色的一步知识。'],
 ['INTERPRETER','INTERPRETER（译码器）','When a build next to a camp gives its reward, activate for one knowledge. If a build rewards several camps, each camp is a separate trigger.','在营地旁建造并获得营地奖励时，可启动以得一步知识。一座建筑获得多个营地奖励时，每个营地各算一次触发。'],
 ['JOLTWELL','JOLTWELL','During Recall, repeat the reward of one production space. May activate once per production space per Recall.','回溯中重复一个生产格奖励。同一次回溯，每个生产格各可触发一次。'],
 ['OMNITOOL','OMNITOOL（多功能工具）','Treat its four printed abilities as four separate gadgets with separate activation costs.','四项印刷能力视作四件独立工具，分别计算启动费用。'],
 ['PORTAL','PORTAL（传送门）','Place a new follower in a hex with an opponent’s building, or place it normally in a hex with your own follower or building.','将一名新追随者放到有对手建筑的格子，或正常放在有自己追随者或建筑的格子。']
 ].map(([a,b,c,d])=>({title:pair(a,b),text:pair(c,d)}))});
topic('objectives','Objective requirements','目标条件速查','Complete every requirement pictured on your kept objective for 15 points. A number next to a symbol is a minimum, not an exact total.','保留目标的全部图示条件都满足才得15分。图标旁数字是最低要求，不是恰好等于。',[
 ['Cube symbols ask for 2 or 3 of the same colour, 3 different colours, or all 4 colours, as pictured.','遗物图标依图示要求同色至少2或3个、至少3种不同颜色，或四种颜色齐全。'],
 ['Ability-stone symbols require at least one white, gray and black, or at least 5 stones among those colours. Player-colour stones do not qualify.','能力石图标要求白灰黑各至少一颗，或这三色合计至少5颗；不包含玩家色能力石。'],
 ['Other symbols require the shown minimum upgrades, built vaults, built monuments, or different camps adjacent to your buildings; 7 total keycards including starting cards; all three ancient tribes unlocked; or buildings on at least 6 different region tiles.','其他图标要求至少指定数量升级、已建宝库、已建纪念碑或建筑相邻的不同营地；至少7张密钥卡（含起始卡）；解锁全部三个古代部落；或在至少六块不同区域板块有建筑。']
],{appendix:true});
topic('setup','Setup reference','开局设置速查','Start with 3 white crystals, 2 white keycards, 1 ready ability stone, 2 secret objectives and 3 followers in your numbered starting hex. Choose a tribe paired with a gadget.','起始拥有3白水晶、2白密钥卡、1颗可用能力石、2张秘密目标，以及自己序号起始格中的3名追随者；选择一组部落与配套工具。',[
 ['Shuffle six light bonuses onto knowledge bonus spaces and six dark bonuses onto the left-side bonus spaces. Randomize the six path cards, using A sides for a first game. Put five of the eight monument tiles in their spaces; return three to the box. Shuffle 24 crates face down.','六个浅色奖励随机放知识奖励位，六个深色奖励随机放版图左侧奖励位。六张道路卡随机排列，初玩全用A面。八块纪念碑板块随机留五块入场，其余归盒；24个补给箱洗混成背面堆。'],
 ['Sort upgrades by letters A–F and randomly assign the six stacks to the culture track’s upgrade symbols. Sort yellow keycards into three face-up types; shuffle green and gray separately and display three of each.','升级按A–F字母分类成六堆，随机配到文化轨升级图标旁。黄卡按三种类型正面堆放；绿、灰分别洗混，各展示三张。'],
 ['Put one relicube of each colour in the lower-right supply; put the other 24 cubes and 27 white/gray/black stones into the bag. Place both S starting regions face up in random orientations; for 1–2 players the right-hand starting tile is face down instead. Randomize the remaining ten tiles face down. Populate each revealed cube symbol and excavation site.','右下供应区放四色遗物各一个；其余24方块及27颗白灰黑能力石入袋。两块S起始区域正面随机方向放置；单人及双人时，右侧起始板块改背面朝上。其余十块洗混背面放置，给已揭示板块的遗物符号和发掘点补组件。'],
 ['Place one of your four coloured stones on your board and one beside each knowledge track. Set markers at culture start, each knowledge start and each path-choice section. Fill the board with six vaults, six workshops, five monuments and three locks. Keep the followers and remaining crystal markers in supply.','四颗玩家色能力石，一颗放面板，三颗各放一条知识轨旁。标记放文化起点、三条知识起点、三组道路选择区。面板摆六宝库、六工坊、五纪念碑、三锁。其余追随者与水晶标记放供应区。'],
 ['Randomly select the permanent starting player and set the hourglass to the first space. Place three followers per player in the hex numbered by clockwise player order.','随机选永久起始玩家，沙漏放第一格。按顺时针序号，每人向对应起始格放三名追随者。'],
 ['Reveal player count + 1 random tribes and pair each with one random gadget. From the player right of the starting player, choose a pair counterclockwise. Return the unchosen pair to the pools. For beginners, random tribe/gadget dealing is an alternative.','展示玩家人数+1张随机部落，各配一件随机工具。从起始玩家右手边开始逆时针各选一组；未选组归回各池。新玩家也可改为随机发部落和工具。'],
 ['Shuffle remaining tribes: place one face down at each of the three ancient tribe spaces. Shuffle remaining gadgets: place four face down at each gadget space. Return extras unseen. With the optional companion, register starting tribes and wait until discovery to set up the ancient ones.','剩余部落洗混，三个古代部落位各背放一张；剩余工具洗混，每处工具位各背放四块，其余不看地归盒。使用可选伴侣网站时登记初始部落，古代部落可等发现再设置。'],
 ['Keep the tribe-specific rafts, islands, rings, pig farms and pigs aside until their tribe enters play.','筏、岛屿、圆环、猪场和猪等专属组件先放旁边，相关部落入场才使用。']
],{appendix:true});
topic('solo-variants','Solo and optional variants','单人与可选变体','Solo: choose starting hex 1 or 2 and draw three objectives. Discard one at the normal special round; complete both remaining objectives to win, for only 15 objective points total.','单人：起始格可选1或2，起始抽三张目标；正常特殊轮次弃一张，必须完成留下的两张才获胜，但目标合计仍只得15分。',[
 ['No single element can count toward both solo objectives. Two objectives asking for three different cubes need two separate sets; two requirements for four vaults cannot both be met with only six vaults available. Failing either kept objective loses the solo game.','同一组件不能同时用于两张单人目标。两张各要三色遗物，需两套；两张各要四宝库时，供应只有六座，无法同时完成。任一保留目标未达成即单人失败。']
],{appendix:true,details:[
 {title:pair('Boomerang draft','回旋轮抽'),text:pair('Instead of choosing pairs, choose one tribe or gadget counterclockwise from the player right of the starting player. Then reverse: starting player first, clockwise, choose the other type. Everyone ends with one tribe and one gadget.','不选固定配对，先从起始玩家右侧开始逆时针各选一个部落或工具，再从起始玩家开始顺时针各选另一种，最后每人各一。')},
 {title:pair('Known ancient tribes','已知古代部落'),text:pair('Reveal all three tribes and their gadgets before play. First to step 3 still receives 1 point.','开始前展示三个古代部落及工具；各轨首达第3步者仍得1分。')},
 {title:pair('Free choice of upgrades','自由选择升级'),text:pair('Keep a personal set of A–F upgrades. At each upgrade symbol choose which tile to install instead of taking the assigned stack.','每人持一套A–F升级；达到升级图标时，自选安装哪块，不按该处固定牌堆取。')}
 ]});
question('recharge-timing','recall','You have just recharged your ability stones at the end of Recall. Can you spend one now before ending this same turn?','你刚在回溯末尾恢复能力石，能在结束本回合前立刻用一颗吗？',[
 ['Yes, free actions can always use the recharged stones.','能，自由行动总能使用刚恢复的石头。'],['No, not for the remainder of this turn.','不能，本回合剩余时间不能再使用。'],['Only a white stone.','只有白色能力石可以。']],1,'Free stone use is allowed before the recharge. After recharging, ability stones cannot be used again that turn.','可在恢复前使用能力石；恢复后，本回合不能再次使用。');
question('build-cost','develop','No special abilities apply. You build where two opponents already have buildings. What is the follower payment?','无特殊能力时，你在两位对手已有建筑的格子建造，要付多少追随者？',[
 ['One follower from anywhere.','任意位置一名。'],['Three from this hex; each opponent gains one here.','该格三名，两位对手各在此格获一名。'],['Three from anywhere; no opponent gains followers.','任意位置三名，对手不获人。']],1,'The cost is one local follower plus one per other player’s building. Each of those players gains a local follower.','当地基础费一名，加上两位对手各一名；这些对手各在当地获得一名。');
question('cube-entry','movement','Your next black cube costs two followers. Without special abilities, can a lone follower move through its hex without taking it?','你的下一个黑色遗物要花两名追随者。无特殊能力，一名追随者能不拿遗物而直接穿过吗？',[
 ['Yes, pickup is optional.','可以，拾取是可选的。'],['No, you must be able to pay the pickup cost to enter or pass through.','不行，进入或经过都须付得起拾取费。'],['Yes, pay a crystal instead.','可以，改付水晶。']],1,'Relic pickup is compulsory when entering or crossing the hex. Without enough followers for the cost, that movement is illegal.','进入或经过必须拾取，没有足够追随者支付便不能进行该移动。');
question('excavate-price','excavate','Without special abilities, you take the last two stones at one site using two develop actions. What crystals do you pay?','无特殊能力，用两次发展拿走同一发掘点最后两颗石头，水晶费用是什么？',[
 ['Two red crystals.','两红。'],['One white and one red.','一白一红。'],['One red and one purple.','一红一紫。']],2,'Recalculate before each action: two stones costs red; the last stone costs purple. Also spend one local follower per action.','每次行动重新计算：剩两颗时付红，最后一颗付紫；每次还各付一名当地追随者。');
question('upgrade-timing','culture','You already used one effect of box B this turn, then gain its upgrade. May you now use the upgraded B effects as well?','本回合已用B格的一项效果，然后获得B升级，还能追加使用升级版效果吗？',[
 ['No; the upgrade waits until a later turn.','不能，升级版须等以后回合。'],['Yes, immediately use all new effects.','能，立即用全部新效果。'],['Only by paying another white crystal.','再付一白就能。']],0,'An upgrade can apply during the current activation only if none of that box’s original effects have been used.','只有原行动格的效果一个都还没用时，升级才能在当前启动中生效。');
question('all-paths','paths','You specialized in three paths. Which path cards give their base score at game end?','你专精了三条道路，终局哪些道路计算基础分？',[
 ['Only those three.','只有这三条。'],['All six; your three add specialization bonuses.','六条都算，所选三条另加专精。'],['The single best path.','只算最高一条。']],1,'Every player scores all six base categories. Markers select extra specialization scoring, not permission to score the base category.','所有玩家都计算六项基础分，标记只决定额外专精计分。');

function localize(value,language) {
 if (Array.isArray(value)) return value.map(item=>localize(item,language));
 if (value && typeof value==='object') {
   if ('en' in value && 'zh' in value) return value[language];
   return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,localize(item,language)]));
 }
 return value;
}
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const write=(path,value)=>writeFile(new URL(path,root),value);
const prototype=await read('public/games/clans-of-caledonia/guide.js');
const shell=await read('public/games/clans-of-caledonia/index.html');
const model=await read('public/games/clans-of-caledonia/guide-model.js');
const metadata=JSON.parse(await read('content/games/index.json'));
games['brian-boru'].topics.find(t=>t.id==='actions').table.icons=['icon-coin.webp','icon-renown.webp','icon-church.webp','icon-battle.webp','icon-courtship.webp','icon-expand.webp','icon-liberate.webp'];
for(const [slug,g] of Object.entries(games)) {
 await mkdir(new URL(`public/games/${slug}/`,root),{recursive:true});
 await mkdir(new URL(`public/guide-assets/${slug}/`,root),{recursive:true});
 const localized={};
 for(const language of ['en','zh']) {
  localized[language]=localize({topics:g.topics,questions:g.questions},language);
  const {topics,questions}=localized[language];
  await write(`public/games/${slug}/guide-data${language==='en'?'.en':''}.js`,`// Generated by scripts/build_recall_boru_guides.mjs\nexport const topics = ${JSON.stringify(topics,null,2)};\nexport const questions = ${JSON.stringify(questions,null,2)};\n`);
  const heading=language==='en'?g.title:g.zh;
  const scope=language==='en'
    ? 'Reviewed, reorganized rules reference from the supplied English rulebook. Includes all core procedures and the rulebook’s appendix abilities, but is not a transcription of every physical card or tile. Follow a component’s printed numbers where this text refers to them; do not invent an unprovided card effect.'
    : '依据所提供英文说明书整理的核对后规则文本，含核心流程与书中附录能力；并非所有实体卡牌与板块的逐张转录。文中指定读取组件数值时，以其印刷内容为准，不得臆测未提供的卡牌效果。';
  const md=[`# ${heading}`,scope,...topics.flatMap(t=>[
   `\n## ${t.title}`,t.key,...t.bullets.map(b=>`- ${b}`),
   ...(t.table?[`| ${t.table.headers.join(' | ')} |`,`| ${t.table.headers.map(()=> '---').join(' | ')} |`,...t.table.rows.map(r=>`| ${r.join(' | ')} |`)]:[]),
   ...(t.details??[]).flatMap(d=>[`### ${d.title}`,d.text]),
   ...(t.figures??[]).map(f=>`![${f.caption}](images/${f.image})\n\n${f.caption}`)
  ])].join('\n\n')+'\n';
  await write(`content/games/${slug}/rules.${language}.md`,md);
 }
 const labels={};
 for(const language of ['en','zh']) {
  const z=language==='zh';
  labels[language]={title:z?g.zh:g.title,home:z?'< 所有游戏':'< All games',summary:z?'规则摘要':'Rule summary',rules:z?'规则':'Rules',overview:z?g.overviewZh:g.overview,appendix:z?'开局设置详情':'Setup details',table:z?'规则速查表':'Rules reference table',note:z?'注意：':'Note: ',correct:z?'答对了。':'Correct.',incorrect:z?'正确答案是：{answer}':'Correct answer: {answer}',cover:z?`${g.zh}游戏封面`:`${g.title} cover`,description:z?`${g.zh}中英文玩家指南：规则速查、图例、规则回顾与问答。`:`${g.title} player reference with rules, examples, recap questions and rules Q&A.`};
 }
 await write(`public/games/${slug}/guide-copy.js`,`export const copy = ${JSON.stringify(labels,null,2)};\n`);
 await write(`public/games/${slug}/guide-model.js`,model);
 await write(`public/games/${slug}/guide-examples.js`,'export function examplesFor(topic) { return topic.figures ?? []; }\n');
 let js=prototype.replaceAll('clans-of-caledonia',slug).replace("['clans', 'variants'].includes(topic.id)","['tribes', 'gadgets', 'solo-variants'].includes(topic.id)");
 js=js.replace("import {updateQuizFeedback", "import {setDisclosureExpanded} from '../../disclosure.js';\nimport {updateQuizFeedback");
 js=js.replace('height="${imageSizes[example.image][1]}"', 'height="${imageSizes[example.image][1]}" style="max-width: min(100%, ${Math.min(560, Math.max(150, imageSizes[example.image][0] / 2))}px)"');
 js=js.replace('table.rows.map(row =>', 'table.rows.map((row, rowIndex) =>').replace('row.map(cell => `<td>${escape(cell)}</td>`)','row.map((cell, cellIndex) => `<td>${cellIndex === 0 && table.icons?.[rowIndex] ? `<img class="rule-symbol" src="${asset(table.icons[rowIndex])}" width="${imageSizes[table.icons[rowIndex]][0]}" height="${imageSizes[table.icons[rowIndex]][1]}" alt="" />` : \'\'}${escape(cell)}</td>`)');
 js=js.replace('const expanded = [...document.querySelectorAll', 'const checkpointState = new Map([...document.querySelectorAll(\'.checkpoint\')].map(node => [node.dataset.checkId, node.classList.contains(\'is-collapsed\')]));\n  const expanded = [...document.querySelectorAll');
 js=js.replace("input.dispatchEvent(new Event('change', {bubbles:true}));\n  }", "input.dispatchEvent(new Event('change', {bubbles:true}));\n  }\n  for (const [id, collapsed] of checkpointState) {\n    const node = document.querySelector(`[data-check-id=\"${id}\"]`);\n    node.classList.toggle('is-collapsed', collapsed);\n    setDisclosureExpanded(node, !collapsed);\n  }");
 await write(`public/games/${slug}/guide.js`,js);
 await write(`public/games/${slug}/index.html`,shell.replaceAll('clans-of-caledonia',slug).replaceAll('clans-page',`${slug}-page`).replaceAll('加勒多尼亚',g.zh).replace('<link rel="stylesheet" href="../../buttons.css" />','<link rel="stylesheet" href="../../buttons.css" />\n    <link rel="stylesheet" href="./guide.css" />'));
 await write(`public/games/${slug}/guide.css`,`.${slug}-page .rule-symbol {display: block; width: 3rem; height: 3rem; object-fit: contain; margin-bottom: .5rem;}\n`);
 const suppliedCover=slug==='recall'?'cover-art.webp':'pic6149105.webp';
 await copyFile(new URL(`content/games/${slug}/${suppliedCover}`,root),new URL(`public/guide-assets/${slug}/coverart.webp`,root));
 const isRecall=slug==='recall';
 const facts={slug,title:g.title,titles:{en:g.title,zh:g.zh},subtitle:g.overview[0],thumbnail:`guide-assets/${slug}/coverart.webp`,yearPublished:isRecall?2025:2021,players:isRecall?'1–4':'3–5',minPlayers:isRecall?1:3,maxPlayers:isRecall?4:5,playTime:isRecall?'90 min':'60–90 min',minPlayTime:isRecall?90:60,maxPlayTime:90,age:'14+',minAge:14,designers:isRecall?['Kristian Amundsen Østby','Helge Meissner','Anna Wermlund','Kjetil Svendsen']:['Peer Sylvester'],artists:isRecall?['Gjermund Mørkved Bohne','Reese Keefe']:['Deirdre de Barra'],publishers:isRecall?['Alion Games']:['Osprey Games'],bgg:{id:isRecall?446493:337765,name:g.title,url:`https://boardgamegeek.com/boardgame/${isRecall?446493:337765}`},metadataSources:[{provider:'Supplied English rulebook',path:`content/games/${slug}/source/${isRecall?'Recall_Englishrules_compressed.pdf':'Brian_Boru_Rulebook.pdf'}`,method:'reviewed-local',fields:['designers','artists','publishers','yearPublished'],checkedAt:'2026-09-16'}, {provider:isRecall?'BoardGameGeek':'Publisher',url:isRecall?'https://boardgamegeek.com/boardgame/446493/recall':'https://www.ospreypublishing.com/us/brian-boru-9781472844842/',method:'reviewed-web',fields:['players','minPlayers','maxPlayers','playTime','minPlayTime','maxPlayTime','age','minAge'],checkedAt:'2026-09-16'}]};
 const i=metadata.findIndex(x=>x.slug===slug); if(i<0)metadata.push(facts);else metadata[i]={...metadata[i],...facts};
 console.log(`${slug}: ${g.topics.length} topics, ${g.questions.length} recap questions`);
}
await write('content/games/index.json',JSON.stringify(metadata,null,2)+'\n');
await write('public/data/games.json',JSON.stringify(metadata,null,2)+'\n');
