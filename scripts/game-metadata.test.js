import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {parseBggMetadata, fetchBggMetadata, writeMetadata} from './sync-game-metadata.mjs';

const game = {slug:'example', title:'Local title', titles:{zh:'本地标题'}, thumbnail:'local.webp', subtitle:'Reviewed summary', bgg:{id:123, name:'Example & Friends', rank:9, snapshotNote:'old'}};
const xml = `<items><item type="boardgame" id="123">
  <name type="primary" value="Example &amp; Friends"/><name type="alternate" value="Example"/>
  <yearpublished value="2025"/><minplayers value="1"/><maxplayers value="4"/>
  <minplaytime value="30"/><maxplaytime value="90"/><minage value="12"/>
  <link type="boardgamedesigner" value="A &amp; B"/><link type="boardgameartist" value="Artist"/>
  <link type="boardgamepublisher" value="Publisher"/><link type="boardgamemechanic" value="Tile Placement"/>
  <statistics><ratings><usersrated value="0"/><average value="0"/><averageweight value="0"/>
    <ranks><rank name="boardgame" value="Not Ranked"/></ranks>
  </ratings></statistics>
</item></items>`;

test('BGG parser decodes entities, preserves editorial fields and replaces stale statistics', () => {
  const [result] = parseBggMetadata(xml, [game], '2026-09-15T00:00:00Z');
  assert.equal(result.title, game.title);
  assert.deepEqual(result.titles, game.titles);
  assert.equal(result.thumbnail, game.thumbnail);
  assert.equal(result.subtitle, game.subtitle);
  assert.deepEqual(result.designers, ['A & B']);
  assert.deepEqual(result.mechanisms, ['Tile Placement']);
  assert.equal(result.players, '1–4');
  assert.equal(result.playTime, '30–90 min');
  assert.equal(result.age, '12+');
  assert.equal(result.bgg.rank, null);
  assert.equal(result.bgg.ratingCount, 0);
  assert.equal(result.bgg.snapshotNote, undefined);
  assert.equal(result.metadataSources[0].checkedAt, result.bgg.fetchedAt);
});

test('rejects unsafe, incomplete, wrong-game and invalid XML responses', () => {
  for (const input of [xml.replace('id="123"','id="456"'), xml.replace('Example &amp; Friends','Wrong game'), xml.replace('type="boardgame"','type="boardgameexpansion"'), '<items/>', '<items>', '<!DOCTYPE items>'+xml, xml.replace('<minplayers value="1"/>','<minplayers value="5"/>')]) {
    assert.throws(() => parseBggMetadata(input,[game]));
  }
});

test('authenticated batch fetch handles queued responses and rejects forbidden access without retrying', async () => {
  const calls=[];
  const sleeps=[];
  const results=await fetchBggMetadata([game], 'private-token', {
    fetcher:async (url, options) => {
      calls.push({url,options});
      return calls.length === 1 ? new Response('',{status:202}) : new Response(xml);
    },
    sleep:async ms => sleeps.push(ms),
  });
  assert.equal(results.length,1);
  assert.equal(calls.length,2);
  assert.equal(sleeps.length,1);
  assert.equal(calls[0].url,'https://boardgamegeek.com/xmlapi2/thing?id=123&stats=1');
  assert.equal(calls[0].options.headers.Authorization,'Bearer private-token');
  assert.equal(calls[0].options.redirect,'error');
  let attempts=0;
  await assert.rejects(fetchBggMetadata([game],'token',{fetcher:async()=>{attempts++;return new Response('',{status:403});}}),/HTTP 403/);
  assert.equal(attempts,1);
  await assert.rejects(fetchBggMetadata([game],''),/BGG_API_TOKEN/);
});

test('writer synchronizes legacy metadata and static fallbacks without touching rules', async () => {
  const root=await mkdtemp(path.join(tmpdir(),'meeple-metadata-'));
  try {
    await mkdir(path.join(root,'content/games/example'),{recursive:true});
    await mkdir(path.join(root,'public/data/games'),{recursive:true});
    await writeFile(path.join(root,'content/games/example/metadata.json'),JSON.stringify({description:'Keep this',canonicalRuleFile:'clean.md'}));
    await writeFile(path.join(root,'content/games/example/rules.md'),'Reviewed rules');
    await writeFile(path.join(root,'public/data/games/example.json'),JSON.stringify({metadata:{},sections:['Keep sections']}));
    const updated=parseBggMetadata(xml,[game]);
    await writeMetadata(updated,root);
    const legacy=JSON.parse(await readFile(path.join(root,'content/games/example/metadata.json'),'utf8'));
    const fallback=JSON.parse(await readFile(path.join(root,'public/data/games/example.json'),'utf8'));
    assert.equal(legacy.description,'Keep this');
    assert.equal(legacy.canonicalRuleFile,'clean.md');
    assert.deepEqual(fallback.metadata,legacy);
    assert.deepEqual(fallback.sections,['Keep sections']);
    assert.equal(await readFile(path.join(root,'content/games/example/rules.md'),'utf8'),'Reviewed rules');
    assert.equal(await readFile(path.join(root,'content/games/index.json'),'utf8'),await readFile(path.join(root,'public/data/games.json'),'utf8'));
  } finally {
    await rm(root,{recursive:true,force:true});
  }
});

test('all shipped games have reviewed IDs, basic facts, provenance and matching static data', async () => {
  const games=JSON.parse(await readFile(new URL('../content/games/index.json',import.meta.url),'utf8'));
  const fallback=JSON.parse(await readFile(new URL('../public/data/games.json',import.meta.url),'utf8'));
  assert.deepEqual(games,fallback);
  assert.equal(new Set(games.map(game=>game.bgg.id)).size,games.length);
  for (const game of games) {
    for (const field of ['designers','artists','publishers','yearPublished','minPlayers','maxPlayers','minPlayTime','maxPlayTime','age','metadataSources']) assert.ok(game[field],`${game.slug}: ${field}`);
  }
});
