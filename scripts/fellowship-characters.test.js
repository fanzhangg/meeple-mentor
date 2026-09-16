import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadGame, callOpenAI} from '../server.js';
import * as en from '../public/games/fate-of-the-fellowship/guide-data.en.js';
import * as zh from '../public/games/fate-of-the-fellowship/guide-data.js';
import {searchTopics} from '../public/games/fate-of-the-fellowship/guide-model.js';

const source = JSON.parse(await readFile(new URL('../content/games/fate-of-the-fellowship/characters.json', import.meta.url), 'utf8'));

test('all 13 character summaries reach both guide languages and their searchable details', () => {
  for (const [language, guide] of [['en', en], ['zh', zh]]) {
    const characters = guide.topics.filter(t => t.id === 'characters');
    assert.equal(characters.length, 1);
    assert.deepEqual(characters[0], source[language]);
    assert.equal(characters[0].details.length, 13);
    assert.equal(characters[0].table.rows.length, 13);
    assert.ok(searchTopics(guide.topics, 'Keen Sight', 'turn').some(t => t.id === 'characters'));
  }
  assert.deepEqual(source.en.details.map(d => d.text.split('\n').length), source.zh.details.map(d => d.text.split('\n').length));
});

test('full character context reaches model even when the question retrieves a different topic', async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'sk-test-not-a-real-key';
  try {
    const game = await loadGame('fate-of-the-fellowship');
    for (const language of ['en', 'zh']) {
      const requests = [];
      await callOpenAI({game, language, question:'How many actions?', context:'Turn structure only.'}, async (_url, options) => {
        requests.push(JSON.parse(options.body));
        return Response.json({output:[{content:[{type:'output_text', text:'Test response.'}]}]});
      });
      const prompt = requests[0].instructions;
      for (const character of source[language].details) {
        assert.ok(prompt.includes(character.title));
        for (const ability of character.text.split('\n')) {
          assert.ok(prompt.includes(ability), `${language}: missing ${ability}`);
          assert.ok(game.localizedSections[language].find(s => s.id === 'characters').content.includes(ability));
        }
      }
      assert.ok(!prompt.includes('## Reconciled source issue'), 'audit notes are not the rules context');
    }
  } finally {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});
