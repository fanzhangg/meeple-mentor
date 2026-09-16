import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {topics, questions} from '../public/games/age-of-innovation/guide-data.js';
import {createQuizSession, searchTopics} from '../public/games/age-of-innovation/guide-model.js';
import * as english from '../public/games/age-of-innovation/guide-data.en.js';
import {examplesFor} from '../public/games/age-of-innovation/guide-examples.js';
import {copy} from '../public/games/age-of-innovation/guide-copy.js';

test('rulebook audit corrections retain costs, availability and reward timing', () => {
  const incomeZh = topics.find(t => t.id === 'income');
  const incomeEn = english.topics.find(t => t.id === 'income');
  assert.match(incomeZh.table.rows[1][1], /平原只需 1 钱币/);
  assert.match(incomeEn.table.rows[1][1], /Plains pays only 1 Coin/);
  assert.equal(incomeZh.details.length, 7);
  assert.equal(incomeEn.details.length, 7);
  assert.match(topics.find(t => t.id === 'build').bullets.join(' '), /计划板上必须还有工坊/);
  assert.match(english.topics.find(t => t.id === 'build').bullets.join(' '), /must have a Workshop available/);
  const innovations = topics.find(t => t.id === 'innovations').details;
  for (const entry of innovations.slice(3)) assert.match(entry.text, /^立即一次性：/);
  assert.match(innovations[12].text, /阶段 I 收入 3 工具/);
  assert.match(topics.find(t => t.id === 'pass').details[1].text, /在设置时/);
  assert.match(english.topics.find(t => t.id === 'pass').details[1].text, /during setup/);
});

test('both languages cover every topic, appendix entry and quiz answer', () => {
  assert.deepEqual(english.topics.map(t => t.id), topics.map(t => t.id));
  assert.deepEqual(english.questions.map(q => [q.id, q.topic, q.answer]), questions.map(q => [q.id, q.topic, q.answer]));
  for (const topic of topics) {
    const translated = english.topics.find(t => t.id === topic.id);
    assert.equal(translated.details?.length, topic.details?.length);
    assert.equal(translated.table?.rows.length, topic.table?.rows.length);
    assert.equal(translated.image, topic.image);
    assert.ok(translated.key && translated.bullets);
  }
  assert.doesNotMatch(JSON.stringify(english), /[\u3400-\u9fff]/);
  assert.deepEqual(Object.keys(copy.en), Object.keys(copy.zh));
  assert.equal(copy.en.overview.length, 3);
  assert.equal(copy.zh.overview.length, 3);
  assert.doesNotMatch(JSON.stringify(copy.zh), /听朋友|试着回答|可以随时|点击结果/);
  assert.equal(searchTopics(english.topics, 'Palace 15', 'turn')[0].details.length, 1);
});

test('all questions have one valid answer and a matching reference topic', () => {
  assert.equal(new Set(topics.map(t => t.id)).size, topics.length);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const question of questions) {
    assert.ok(topics.some(topic => topic.id === question.topic));
    assert.ok(Number.isInteger(question.answer));
    assert.ok(question.options[question.answer]);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.explanation.length > 20);
  }
  assert.equal(questions.length, 6);
  assert.deepEqual(topics.filter(t => !t.appendix).map(t => t.id),
    ['turn', 'income', 'build', 'power', 'reach', 'upgrade', 'city', 'science', 'innovation', 'resources', 'pass']);
  assert.deepEqual(new Set(questions.map(q => q.answer)), new Set([0, 1, 2]));
});

test('specific searches expose matching appendix entries, including fullwidth numbers', () => {
  const results = searchTopics(topics, '１５号宫殿', 'turn');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'palaces');
  assert.equal(results[0].details.length, 1);
  assert.equal(results[0].searchOpen, true);
  assert.match(results[0].details[0].text, /不能彼此穿插/);
  assert.equal(searchTopics(topics, 'PROFESSORS', 'turn')[0].details[0].title, '教授（Professors）');
  assert.equal(searchTopics(topics, 'not-a-real-rule', 'turn').length, 0);
  assert.equal(searchTopics(topics, '', 'city')[0].id, 'city');
});

test('quiz rejects invalid submissions and preserves draft selections until submitted', () => {
  const quiz = createQuizSession(questions);
  const q = questions[0];
  quiz.drafts.set(q.id, 0);
  assert.equal(quiz.summary().missing.length, questions.length);
  assert.equal(quiz.drafts.get(q.id), 0);
  assert.equal(quiz.submit(q.id, null), false);
  assert.equal(quiz.submit(q.id, -1), false);
  assert.equal(quiz.submit(q.id, 99), false);
  assert.equal(quiz.submit('missing', 0), false);
  assert.equal(quiz.submit(q.id, q.answer), true);
  assert.equal(quiz.drafts.has(q.id), false);
  assert.equal(quiz.submit(q.id, (q.answer + 1) % 3), true);
  assert.equal(quiz.summary().correct, 0);
  assert.equal(quiz.answers.size, 1);
  quiz.submit(q.id, q.answer);
  assert.equal(quiz.summary().correct, 1);
});

test('recap distinguishes wrong and skipped questions and supports retry/reset', () => {
  const quiz = createQuizSession(questions);
  quiz.submit(questions[0].id, questions[0].answer);
  quiz.submit(questions[1].id, (questions[1].answer + 1) % 3);
  const result = quiz.summary();
  assert.equal(result.correct, 1);
  assert.equal(result.wrong.length, 1);
  assert.equal(result.missing.length, questions.length - 2);
  quiz.retry(questions[1].id);
  quiz.submit(questions[1].id, questions[1].answer);
  assert.equal(quiz.summary().correct, 2);
  quiz.drafts.set(questions[2].id, 0);
  quiz.reset();
  assert.equal(quiz.answers.size, 0);
  assert.equal(quiz.drafts.size, 0);
});

test('reference artwork and both library entries resolve in static hosting', async () => {
  for (const topic of topics.flatMap(t => examplesFor(t, 'zh'))) {
    assert.ok(!topic.image.startsWith('page-'));
    await access(new URL(`../public/guide-assets/age-of-innovation/${topic.image}`, import.meta.url));
  }
  for (const file of ['../content/games/index.json', '../public/data/games.json']) {
    const games = JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
    const game = games.find(g => g.slug === 'age-of-innovation');
    assert.ok(game);
    await access(new URL(`../public/${game.thumbnail}`, import.meta.url));
    await access(new URL(`../public/games/${game.slug}/index.html`, import.meta.url));
    assert.ok(games.some(g => g.slug === 'huang'));
  }
});
