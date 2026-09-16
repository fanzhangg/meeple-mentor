import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessons} from '../public/games/huang/guide-data.js';
const read = path => JSON.parse(readFileSync(new URL('../'+path, import.meta.url), 'utf8'));

test('HUANG source, published bilingual guide, API and static fallback stay synchronized', () => {
  assert.deepEqual(lessons, read('content/games/huang/guide.json'));
  assert.deepEqual(lessons.en, read('content/games/huang/lesson.json'));
  assert.deepEqual(lessons.en, read('public/data/games/huang.json').lesson);
});

test('HUANG languages use the same navigation and five focused, unambiguous recaps', () => {
  assert.deepEqual(lessons.zh.steps.map(s => s.id), lessons.en.steps.map(s => s.id));
  assert.equal(new Set(lessons.en.steps.map(s => s.id)).size, lessons.en.steps.length);
  for (const [index, en] of lessons.en.steps.entries()) {
    const zh = lessons.zh.steps[index];
    assert.equal(zh.bullets.length, en.bullets.length);
    assert.equal(Boolean(en.check), Boolean(zh.check));
    if (!en.check) continue;
    for (const step of [en, zh]) {
      assert.equal(step.check.options.filter(o => o.correct).length, 1);
      assert.ok(step.check.prompt && step.check.explanation);
    }
    assert.deepEqual(en.check.options.map(o => o.correct), zh.check.options.map(o => o.correct));
  }
  assert.deepEqual(lessons.en.steps.filter(s => s.check).map(s => s.id),
    ['tile-exceptions', 'pagodas', 'revolts', 'wars', 'endgame']);
});
