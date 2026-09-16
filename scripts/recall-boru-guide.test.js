import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRuleConversation} from '../public/rule-chat.js';
import {createAppServer} from '../server.js';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root));
const json=async path=>JSON.parse(await read(path));
for(const slug of ['recall','brian-boru']) {
 const en=await import(`../public/games/${slug}/guide-data.en.js`);
 const zh=await import(`../public/games/${slug}/guide-data.js`);
 const {copy}=await import(`../public/games/${slug}/guide-copy.js`);
 const {createQuizSession}=await import(`../public/games/${slug}/guide-model.js`);
 const {imageSizes}=await import(`../public/games/${slug}/guide-image-sizes.js`);
 test(`${slug}: bilingual topics, table shape, figures and question semantics stay aligned`,()=>{
  assert.deepEqual(en.topics.map(t=>t.id),zh.topics.map(t=>t.id));
  assert.equal(new Set(en.topics.map(t=>t.id)).size,en.topics.length);
  for(const [i,t] of en.topics.entries()) {
   const other=zh.topics[i];
   assert.equal(t.bullets.length,other.bullets.length);
   assert.equal(t.details?.length,other.details?.length);
   assert.equal(t.table?.headers.length,other.table?.headers.length);
   assert.equal(t.table?.rows.length,other.table?.rows.length);
   for(const table of [t.table,other.table]) if(table) for(const row of table.rows) assert.equal(row.length,table.headers.length);
   assert.deepEqual(t.figures?.map(f=>[f.image,f.fold]),other.figures?.map(f=>[f.image,f.fold]));
   assert.equal(t.appendix,other.appendix);
  }
  assert.deepEqual(en.questions.map(q=>[q.id,q.topic,q.answer,q.options.length]),zh.questions.map(q=>[q.id,q.topic,q.answer,q.options.length]));
  assert.deepEqual(Object.keys(copy.en),Object.keys(copy.zh));
  for(const lang of [en,zh]) for(const q of lang.questions) {
   assert.ok(lang.topics.some(t=>t.id===q.topic));
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);
   assert.equal(new Set(q.options).size,q.options.length);
   assert.ok(q.explanation.length>10);
  }
 });
 test(`${slug}: quiz retry, correction, reset and bilingual answer persistence`,()=>{
  const quiz=createQuizSession(en.questions), [first,second]=en.questions;
  assert.equal(quiz.submit(first.id,-1),false);
  assert.equal(quiz.submit('unknown',0),false);
  quiz.submit(first.id,first.answer);
  quiz.submit(second.id,(second.answer+1)%second.options.length);
  assert.equal(quiz.summary().correct,1);
  assert.equal(quiz.summary().wrong.length,1);
  assert.equal(quiz.summary().missing.length,en.questions.length-2);
  assert.equal(quiz.answers.get(first.id).selected,zh.questions[0].answer);
  quiz.submit(second.id,second.answer);
  assert.equal(quiz.summary().correct,2);
  quiz.retry(first.id);
  assert.equal(quiz.summary().correct,1);
  quiz.reset();
  assert.equal(quiz.summary().missing.length,en.questions.length);
 });
 test(`${slug}: artwork is traceable, byte-identical and correctly sized`,async()=>{
  const manifest=await json(`content/games/${slug}/image-sources.json`);
  const refs=en.topics.flatMap(t=>[...(t.figures??[]).map(f=>f.image),...(t.table?.icons??[])]);
  assert.deepEqual([...refs].sort(),manifest.images.map(i=>i.file).sort());
  for(const item of manifest.images) {
   const a=await read(`content/games/${slug}/images/${item.file}`);
   const b=await read(`public/guide-assets/${slug}/${item.file}`);
   assert.deepEqual(a,b);
   assert.equal(a.toString('ascii',12,16),'VP8L');
   const bits=a.readUInt32LE(21);
   assert.deepEqual([1+(bits&0x3fff),1+((bits>>>14)&0x3fff)],imageSizes[item.file]);
   assert.deepEqual(imageSizes[item.file],item.outputSize);
   assert.ok(item.pdfPage>0 && item.crop[2]>item.crop[0] && item.crop[3]>item.crop[1]);
   assert.ok(item.crop[2]<=item.referenceSize[0] && item.crop[3]<=item.referenceSize[1]);
  }
  assert.match(manifest.sourceSha256,/^[a-f0-9]{64}$/);
  try {
   const pdf=await read(`content/games/${slug}/${manifest.source}`);
   assert.equal(createHash('sha256').update(pdf).digest('hex'),manifest.sourceSha256);
  } catch(error) { if(error.code!=='ENOENT') throw error; } // PDFs intentionally ignored in clean checkouts.
 });
 test(`${slug}: catalogs and static-host relative assets resolve`,async()=>{
  const source=await json('content/games/index.json'), published=await json('public/data/games.json');
  const game=source.find(g=>g.slug===slug);
  assert.deepEqual(game,published.find(g=>g.slug===slug));
  await access(new URL(`public/${game.thumbnail}`,root));
  const html=(await read(`public/games/${slug}/index.html`)).toString();
  const js=(await read(`public/games/${slug}/guide.js`)).toString();
  assert.match(html,/guide-layout\.js/);
  assert.match(js,/createRuleChat/);
  assert.ok(js.includes(`slug: '${slug}'`));
  assert.match(js,/checkpointState/);
  for(const ref of [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>x!=='../../')) {
   await access(new URL(`public/games/${slug}/${ref}`,root));
   const deployed=new URL(ref,`https://example.test/meeple/games/${slug}/`);
   assert.ok(deployed.pathname.startsWith('/meeple/'));
  }
 });
 test(`${slug}: multi-turn chat retains ordered history across language and excludes failures`,async()=>{
  const sent=[];
  const ask=createRuleConversation(slug,async request=>{sent.push(request);if(request.question==='fail')throw Error('offline');return 'First answer.';});
  await ask('First question','en');
  await assert.rejects(ask('fail','en'));
  await ask('那之后呢？','zh');
  assert.equal(sent.at(-1).slug,slug);
  assert.equal(sent.at(-1).language,'zh');
  assert.deepEqual(sent.at(-1).history,[{role:'user',content:'First question'},{role:'assistant',content:'First answer.'}]);
  await createRuleConversation(slug,async request=>{assert.deepEqual(request.history,[]);return 'fresh';})('New game','en');
 });
}
test('new guides are served, including every figure and icon',async()=>{
 const server=createAppServer();
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 try {
  for(const slug of ['recall','brian-boru']) {
   for(const name of ['index.html','guide.js','guide-data.js','guide-data.en.js','guide-copy.js','guide-examples.js','guide-image-sizes.js','guide-model.js','guide.css']) assert.equal((await fetch(`${origin}/games/${slug}/${name}`)).status,200);
   for(const item of (await json(`content/games/${slug}/image-sources.json`)).images) assert.equal((await fetch(`${origin}/guide-assets/${slug}/${item.file}`)).status,200);
  }
 } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
