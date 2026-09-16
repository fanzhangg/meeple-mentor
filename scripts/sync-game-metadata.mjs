import {readFile, writeFile, rename, mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {XMLParser, XMLValidator} from 'fast-xml-parser';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const number = value => value !== undefined && value !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined;
const normalized = value => String(value).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const range = (min, max) => min === max ? String(min) : `${min}–${max}`;
const json = async file => JSON.parse(await readFile(file, 'utf8'));

// Use reviewed IDs, never fuzzy title search: expansions and editions have different records.
export function parseBggMetadata(xml, games, fetchedAt = new Date().toISOString()) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) throw new Error('Invalid or unsafe BGG XML. No metadata written.');
  const parsed = new XMLParser({ignoreAttributes:false, attributeNamePrefix:'@_', parseTagValue:false}).parse(xml);
  const items = list(parsed.items?.item);
  if (items.length !== games.length) throw new Error('BGG returned an incomplete batch. No metadata written.');
  return games.map(game => {
    const matches = items.filter(item => Number(item['@_id']) === game.bgg.id);
    if (matches.length !== 1 || matches[0]['@_type'] !== 'boardgame') throw new Error(`Unexpected BGG record for ${game.slug}.`);
    const item = matches[0];
    const primary = list(item.name).find(name => name['@_type'] === 'primary')?.['@_value'];
    if (normalized(primary) !== normalized(game.bgg.name || game.title)) throw new Error(`BGG title mismatch for ${game.slug}. Review its configured ID/name.`);
    const value = key => number(item[key]?.['@_value']);
    const links = type => [...new Set(list(item.link).filter(link => link['@_type'] === type).map(link => link['@_value']).filter(Boolean))];
    const metadata = {};
    for (const [key, tag] of Object.entries({yearPublished:'yearpublished', minPlayers:'minplayers', maxPlayers:'maxplayers', minPlayTime:'minplaytime', maxPlayTime:'maxplaytime', minAge:'minage'})) {
      const n = value(tag);
      if (n > 0) metadata[key] = n;
    }
    if (!metadata.yearPublished || !metadata.minPlayers || !metadata.maxPlayers || metadata.minPlayers > metadata.maxPlayers) throw new Error(`Invalid BGG facts for ${game.slug}.`);
    metadata.players = range(metadata.minPlayers, metadata.maxPlayers);
    if (metadata.minPlayTime && metadata.maxPlayTime) {
      if (metadata.minPlayTime > metadata.maxPlayTime) throw new Error(`Invalid playing time for ${game.slug}.`);
      metadata.playTime = `${range(metadata.minPlayTime, metadata.maxPlayTime)} min`;
    }
    if (metadata.minAge) metadata.age = `${metadata.minAge}+`;
    for (const [key, type] of Object.entries({designers:'boardgamedesigner', artists:'boardgameartist', publishers:'boardgamepublisher', categories:'boardgamecategory', mechanisms:'boardgamemechanic', families:'boardgamefamily'})) {
      const names = links(type);
      if (names.length) metadata[key] = names;
    }
    if (!metadata.designers?.length) throw new Error(`Missing BGG designer for ${game.slug}.`);
    const ratings = item.statistics?.ratings;
    if (!ratings) throw new Error(`Missing BGG statistics for ${game.slug}.`);
    const bgg = {id:game.bgg.id, name:primary, url:`https://boardgamegeek.com/boardgame/${game.bgg.id}`, fetchedAt};
    for (const [key, tag] of Object.entries({averageRating:'average', bayesAverage:'bayesaverage', ratingCount:'usersrated', weight:'averageweight', weightVotes:'numweights'})) {
      const n = number(ratings[tag]?.['@_value']);
      if (n !== undefined) bgg[key] = n;
    }
    bgg.weightScale = 5;
    bgg.rank = number(list(ratings.ranks?.rank).find(rank => rank['@_name'] === 'boardgame')?.['@_value']) ?? null;
    bgg.strategyRank = number(list(ratings.ranks?.rank).find(rank => rank['@_name'] === 'strategygames')?.['@_value']) ?? null;
    metadata.bgg = bgg;
    const source = {provider:'BoardGameGeek XML API2', url:bgg.url, checkedAt:fetchedAt, method:'api', fields:Object.keys(metadata)};
    return {...game, ...metadata, metadataSources:[...(game.metadataSources || []).filter(source => source.method !== 'api'), source]};
  });
}

export async function fetchBggMetadata(games, token, {fetcher = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms))} = {}) {
  if (!token) throw new Error('Set BGG_API_TOKEN in .env.local (register at https://boardgamegeek.com/applications). No files changed.');
  const ids = games.map(game => game.bgg?.id);
  if (ids.some(id => !Number.isSafeInteger(id) || id <= 0) || new Set(ids).size !== ids.length || !ids.length) throw new Error('Each game needs a unique, reviewed BGG ID.');
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(',')}&stats=1`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetcher(url, {headers:{Authorization:`Bearer ${token}`, Accept:'application/xml'}, redirect:'error', signal:AbortSignal.timeout(30000)});
    if ([202,429,503].includes(response.status) && attempt < 3) {
      const retry = Number(response.headers.get('retry-after'));
      await response.body?.cancel();
      await sleep(Math.min(60000, Math.max(5000 * 2 ** attempt, Number.isFinite(retry) ? retry * 1000 : 0)));
      continue;
    }
    if (response.status !== 200) throw new Error(`BGG returned HTTP ${response.status}. Check the token/API access; no files changed.`);
    return parseBggMetadata(await response.text(), games);
  }
}

async function atomicJson(file, data) {
  await mkdir(path.dirname(file), {recursive:true});
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(data, null, 2) + '\n');
  await rename(temporary, file);
}

// Keep server metadata and the static-site fallback in sync; never touch rules or guide HTML.
export async function writeMetadata(games, directory = root) {
  const writes = [[path.join(directory, 'content/games/index.json'), games], [path.join(directory, 'public/data/games.json'), games]];
  for (const game of games) {
    if (!/^[a-z0-9-]+$/.test(game.slug)) throw new Error('Invalid game slug.');
    const file = path.join(directory, 'content/games', game.slug, 'metadata.json');
    if (!existsSync(file)) continue; // Bilingual guides intentionally use index.json.
    const metadata = {...await json(file), ...game};
    writes.push([file, metadata]);
    const fallback = path.join(directory, 'public/data/games', `${game.slug}.json`);
    if (existsSync(fallback)) writes.push([fallback, {...await json(fallback), metadata}]);
  }
  // Read/validate every target before any write. Each file is replaced atomically.
  for (const [file, data] of writes) await atomicJson(file, data);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !['--write', '--export'].includes(arg))) throw new Error('Usage: npm run metadata:sync -- [--write | --export]');
  for (const name of ['.env.local', '.env']) {
    const file = path.join(root, name);
    if (!existsSync(file)) continue;
    for (const line of (await readFile(file, 'utf8')).split(/\r?\n/)) {
      const match = line.match(/^\s*BGG_API_TOKEN\s*=\s*(.*?)\s*$/);
      if (match && process.env.BGG_API_TOKEN === undefined) process.env.BGG_API_TOKEN = match[1].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  const games = await json(path.join(root, 'content/games/index.json'));
  const updated = args.includes('--export') ? games : await fetchBggMetadata(games, process.env.BGG_API_TOKEN);
  if (args.includes('--write') || args.includes('--export')) await writeMetadata(updated);
  console.log(JSON.stringify(updated, null, 2));
  console.log(args.includes('--write') || args.includes('--export') ? 'Metadata and static fallbacks updated.' : 'Preview only. Add --write to save.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
