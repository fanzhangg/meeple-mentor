"""Refresh both quick-reference appendices from the reviewed rulebooks."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / 'content/games/age-of-innovation/rules.zh.md').read_text(encoding='utf-8')


def section(start, end):
    return source.split(start, 1)[1].split(end, 1)[0]


def plain(text):
    text = re.sub(r'<a[^>]*></a>', '', text)
    text = re.sub(r'^>.*$', '', text, flags=re.M)
    return re.sub(r'\s+', ' ', text.replace('**', '')).strip()


def headings(text, level='### '):
    result = []
    for match in re.finditer(r'^' + level + r'(.+)\n([\s\S]*?)(?=^' + level + r'|\Z)', text, re.M):
        result.append({'title': match[1], 'text': plain(match[2])})
    return result


def rows(text):
    return [[plain(cell) for cell in line.strip('| ').split('|')]
            for line in text.splitlines() if line.startswith('|')
            and not re.match(r'^\|\s*-', line)]


factions = headings(section('## 第 20 页：', '## 第 21 页：'))
innovations = []
for row in rows(section('## 第 21 页：', '## 第 22 页：')):
    if row[0] != '创造':
        innovations.append({'title': row[0], 'text': ' '.join(row[1:])})
# Table category headings carry timing that must survive conversion to independent entries.
for item in innovations[3:12]:
    item['text'] = '立即一次性：' + item['text']
for item in innovations[12:]:
    item['text'] = '立即一次性：' + item['text'].replace(' 收入', ' 阶段 I 收入').removesuffix(' —')
palace_text = section('## 第 22 页：', '## 第 23 页：')
palace_notes = {item['title'].split(' 号')[0]: item['text'] for item in headings(palace_text)}
palaces = [{'title': f'{row[0]} 号宫殿',
            'text': f'收入：{row[1]}。{row[2]} ' + palace_notes.get(row[0], '')}
           for row in rows(palace_text) if row[0] != '编号']
privileges = [{'title': f'收入：{row[1]}', 'text': row[2]}
              for row in rows(section('### 附录 V：', '### 附录 VI：')) if row[0] != '序号']
competencies = [{'title': row[1].split('。')[0], 'text': row[1]}
                for row in rows(section('### 附录 VIII：', '#### 扩建')) if row[0] != '序号']
annex = plain(section('#### 扩建', '### 附录 IX：'))
competencies[5]['text'] += ' ' + annex
rounds = [{'title': row[0], 'text': f'学术红利：{row[1]}'}
          for row in rows(section('### 附录 IX：', '### 四种末轮计分板块'))
          if not row[0].startswith('阶段 II')]

topics = [
    dict(id='factions', title='我的部族能力', tag='按名称查', keywords='种族 部族 特殊 能力', pages='20',
         key='十二个部族拥有不同的起始学科、资源与独特能力。', bullets=[], details=factions),
    dict(id='palaces', title='宫殿板块速查', tag='按实体编号查', keywords='宫殿 飞行 城市', pages='22',
         key='收入每轮领取；一次性奖励只在建造宫殿时领取。',
         bullets=['写有特殊行动的效果每轮可用一次，用后放 X 标记。'], details=palaces),
    dict(id='innovations', title='创造板块速查', tag='按名称查', keywords='创造 中立建筑 纪念碑', pages='9、21',
         key='先分清立即奖励、持续效果和每轮特殊行动。',
         bullets=['额外建筑类必须立即按中立建筑规则放置，不能保留待用；算作建造，也计入相应计分效果。'], details=innovations),
    dict(id='privileges', title='特权板块速查', tag='按收入图标查', keywords='特权 奖励 pass 结束 收入', pages='23',
         key='手掌是收入，橙色八角形是行动，结束行动图标在宣告结束时结算。',
         bullets=['第 1–5 轮宣告结束时必须换一块特权；第 6 轮不换。'], details=privileges),
    dict(id='competencies', title='能力板块速查', tag='按效果查', keywords='能力 学校 大学 扩建 高塔', pages='13、24',
         key='获得能力时，别忘记展示区位置上的学科升级和／或书籍。',
         bullets=['不能拿自己已经拥有的同种能力。'], details=competencies),
    dict(id='round-scoring', title='本轮做什么得分？', tag='按计分图标查', keywords='轮次 计分 学术 红利 末轮', pages='24',
         key='左侧：本轮行动阶段满足条件就得分。右侧：全员结束后的学术红利。',
         bullets=['同一个行动可同时触发多个计分效果。学术红利按达到门槛的倍数领取。',
                  '第 6 轮没有学术红利，改用末轮计分板块提供的额外行动计分。'], details=rounds,
         image='final-round-tiles.png', caption='四种末轮计分：边缘工坊 3 分、公会 3 分、学校 4 分、工坊 2 分。'),
]
assert [len(t['details']) for t in topics] == [12, 17, 18, 10, 12, 12]
output = ROOT / 'public/games/age-of-innovation/guide-appendix.js'
output.write_text('// Generated from the reviewed rules.zh.md by scripts/build_aoi_appendix.py.\n'
                  + 'export const appendixTopics = ' + json.dumps(topics, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'Updated {len(topics)} appendix topics.')

# English appendix uses the source rulebook wording and matching topic IDs.
source = (ROOT / 'content/games/age-of-innovation/rules.en.md').read_text(encoding='utf-8')
def clean_page(text):
    return re.sub(r'^\[Original page.*$', '', text, flags=re.M)
factions_en = [item for item in headings(clean_page(section('## Page 20 -', '## Page 21 -'))) if not item['title'].startswith('Appendix')]
innovations_en = [item for item in headings(clean_page(section('## Page 21 -', '## Page 22 -'))) if not item['title'].startswith(('Appendix', '1.', '2.', '3.'))]
palaces_en = headings(clean_page(section('## Page 22 -', '## Page 23 -')), '#### ')
bonus_titles = ['River Workshops and Reach +1', 'Scholar income and Scholar actions', 'Power income and Guild construction', 'Tool income and Palace / University scoring', 'Book income and a free Spade', 'Book income and a free Bridge', 'Tool income and a Science advance', 'Coin income and Schools when Passing', '4 power and 2 Coins', '6 Coins']
privileges_en = [dict(title=bonus_titles[i], text=row[1]) for i,row in enumerate(rows(section('### Appendix V:', '### Appendix VI:'))[1:])]
competency_text = section('### Appendix VIII:', '### Appendix IX:')
competency_titles = ['Tool and Science income', 'Two free Spades', 'Points for sending Scholars', 'Border Workshop points', 'Points and Coin income', 'Two Annexes', 'Neutral Tower', 'Book and power income', 'Tools, points and Coins', 'Four-power Special action', 'City points when Passing', 'Lowest Discipline points when Passing']
competencies_en = [dict(title=competency_titles[i],text=plain(match[1])) for i,match in enumerate(re.finditer(r'^\d+\. (.+)$',competency_text,re.M))]
competencies_en[-1]['text'] += ' Example: Levels 9, 7, 7 and 2 score 2 points.'
rounds_en = [dict(title=row[0],text='Science bonus: '+row[1]) for row in rows(section('### Appendix IX:', '### Final Round Score tiles'))[1:]]
en_meta = [
 ('Faction abilities','The twelve Factions have different starting Disciplines, resources and unique abilities.',[]),
 ('Palace tiles','Income is collected every round; one-time bonuses apply when the Palace is built.',['Each Special action is available once per round; cover it with an X-token after use.']),
 ('Innovation tiles','Innovations grant immediate rewards, lasting effects or once-per-round Special actions.',['Additional buildings must be placed immediately under the Neutral building rules. They count as Builds and for applicable scoring effects.']),
 ('Round Bonus tiles','Open hands indicate income, orange octagons indicate actions, and Pass icons resolve when you Pass.',['Exchange your Round Bonus tile when Passing in Rounds 1–5, but not in Round 6.']),
 ('Competency tiles','Taking a Competency also grants the Science advances and/or Books shown at its location.',['You cannot take a duplicate Competency.']),
 ('Round scoring','The left half scores actions this round; the right half grants Science bonuses after everyone passes.',['One action can trigger several scoring effects. Science bonuses are awarded for each multiple of the requirement.','Round 6 has no Science bonus; the Final Round Score tile grants extra action scoring instead.'])]
en_topics=[]
for base,meta,details in zip(topics,en_meta,[factions_en,palaces_en,innovations_en,privileges_en,competencies_en,rounds_en]):
    item=dict(id=base['id'],title=meta[0],tag='Reference',keywords=meta[0],pages=base['pages'].replace('、',', '),key=meta[1],bullets=meta[2],details=details)
    if 'image' in base:
        item.update(image=base['image'],caption='Final-round scoring: border Workshop 3 points; Guild 3; School 4; Workshop 2.')
    en_topics.append(item)
assert [len(t['details']) for t in en_topics] == [12,17,18,10,12,12]
(ROOT / 'public/games/age-of-innovation/guide-appendix.en.js').write_text('// Generated from rules.en.md by scripts/build_aoi_appendix.py.\nexport const appendixTopics = '+json.dumps(en_topics,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Updated English appendix.')
