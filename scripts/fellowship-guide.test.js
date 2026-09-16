import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import * as en from '../public/games/fate-of-the-fellowship/guide-data.en.js';
import * as zh from '../public/games/fate-of-the-fellowship/guide-data.js';
import {copy} from '../public/games/fate-of-the-fellowship/guide-copy.js';
import {createQuizSession, searchTopics} from '../public/games/fate-of-the-fellowship/guide-model.js';
import {examplesFor, iconsFor} from '../public/games/fate-of-the-fellowship/guide-examples.js';
import {imageSizes} from '../public/games/fate-of-the-fellowship/guide-image-sizes.js';

test('languages have matching topics, exceptions, tables and answer meanings', () => {
  assert.deepEqual(en.topics.map(t=>t.id),zh.topics.map(t=>t.id));
  assert.equal(new Set(en.topics.map(t=>t.id)).size,en.topics.length);
  for (const [i,t] of en.topics.entries()) {
    const other=zh.topics[i];
    assert.equal(t.bullets.length,other.bullets.length);
    assert.equal(t.details?.length,other.details?.length);
    assert.equal(t.table?.rows.length,other.table?.rows.length);
    assert.equal(t.image,other.image);
    assert.equal(t.appendix,other.appendix);
  }
  assert.deepEqual(en.questions.map(q=>[q.id,q.topic,q.answer,q.options.length]),zh.questions.map(q=>[q.id,q.topic,q.answer,q.options.length]));
  assert.deepEqual(Object.keys(copy.en).sort(),Object.keys(copy.zh).sort());
});

test('each recap has a valid answer, explanation and reference', () => {
  for (const lang of [en,zh]) {
    assert.equal(new Set(lang.questions.map(q=>q.id)).size,lang.questions.length);
    for (const q of lang.questions) {
      assert.ok(lang.topics.some(t=>t.id===q.topic));
      assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length);
      assert.equal(new Set(q.options).size,q.options.length);
      assert.ok(q.explanation.length>10);
    }
  }
});

test('quiz preserves correct, wrong and unanswered state across languages', () => {
  const q=createQuizSession(en.questions), first=en.questions[0], second=en.questions[1];
  assert.equal(q.submit(first.id,99),false);
  q.submit(first.id,first.answer);
  q.submit(second.id,(second.answer+1)%second.options.length);
  assert.equal(q.summary().correct,1);
  assert.equal(q.summary().wrong.length,1);
  assert.equal(q.summary().missing.length,en.questions.length-2);
  assert.equal(q.answers.get(first.id).selected,zh.questions[0].answer);
  q.submit(second.id,second.answer);
  assert.equal(q.summary().correct,2);
  q.retry(first.id);
  assert.equal(q.summary().correct,1);
  q.reset();
  assert.equal(q.summary().missing.length,en.questions.length);
});

test('lookup returns nested setup rules and localized terminology', () => {
  const result=searchTopics(en.topics,'Heroic','turn');
  assert.equal(result.length,1);
  assert.equal(result[0].id,'setup');
  assert.equal(result[0].details.length,1);
  assert.ok(searchTopics(zh.topics,'群鸦蔽日','turn').some(t=>t.id==='darken'));
  assert.deepEqual(searchTopics(en.topics,'ＳＫＩＥＳ　ＤＡＲＫＥＮ','turn').map(t=>t.id),searchTopics(en.topics,'skies darken','turn').map(t=>t.id));
  assert.deepEqual(searchTopics(en.topics,'zzzz-unmatched','turn'),[]);
});

test('all images, localized captions and both library routes resolve', () => {
  const root=new URL('../public/',import.meta.url);
  for (const [language, lang] of [['en', en], ['zh', zh]]) for (const topic of lang.topics) for (const ex of [...examplesFor(topic, language), ...iconsFor(topic, language)]) {
    assert.ok(ex.caption);
    assert.ok(existsSync(new URL(`guide-assets/fate-of-the-fellowship/${ex.image}`,root)));
  }
  for (const name of ['content/games/index.json','public/data/games.json']) {
    const list=JSON.parse(readFileSync(new URL(`../${name}`,import.meta.url),'utf8'));
    const item=list.find(g=>g.slug==='fate-of-the-fellowship');
    assert.ok(item.titles.en && item.titles.zh);
    assert.ok(existsSync(new URL(item.thumbnail,root)));
    assert.ok(existsSync(new URL(`games/${item.slug}/index.html`,root)));
  }
});

test('illustrations and icon keys preserve bilingual coverage, steps and source assets', () => {
  const sources=JSON.parse(readFileSync(new URL('../content/games/fate-of-the-fellowship/image-sources.json',import.meta.url),'utf8'));
  const used=new Set();
  for (const topic of en.topics) {
    const counterpart=zh.topics.find(t=>t.id===topic.id);
    for (const render of [examplesFor, iconsFor]) {
      const english=render(topic,'en'), chinese=render(counterpart,'zh');
      assert.deepEqual(english.map(e=>e.image),chinese.map(e=>e.image));
      for (const [i,example] of english.entries()) {
        assert.ok(example.caption && chinese[i].caption);
        assert.notEqual(example.caption,chinese[i].caption);
        assert.equal(example.steps?.length,chinese[i].steps?.length);
        for (const step of [...(example.steps ?? []),...(chinese[i].steps ?? [])]) assert.ok(step.length>10);
        assert.ok(sources[example.image],`Source provenance missing for ${example.image}`);
        assert.ok(imageSizes[example.image]?.every(size=>Number.isInteger(size)&&size>0), 'Intrinsic dimensions reserve space before lazy images load');
        const source=new URL(`../content/games/fate-of-the-fellowship/images/${example.image}`,import.meta.url);
        const published=new URL(`../public/guide-assets/fate-of-the-fellowship/${example.image}`,import.meta.url);
        assert.deepEqual(readFileSync(source),readFileSync(published));
        used.add(example.image);
      }
    }
  }
  assert.deepEqual([...used].sort(),Object.keys(sources).sort());
  for (const id of ['battle','advance','shadow','reinforce','setup']) {
    assert.ok(examplesFor(en.topics.find(t=>t.id===id),'en').length>=2,`${id} needs its full visual sequence`);
  }
});
