# Game metadata

`content/games/index.json` is the shared catalog for the four published guides. Chat receives the catalog facts, BGG snapshot and field-level source records along with the rules. HUANG also has legacy `metadata.json`; the exporter keeps that file and static fallbacks in sync.

## Current data

Basic facts were reviewed against publisher pages and the existing guide credits. Each `metadataSources` entry identifies the fields, source, collection method and review time where known. HUANG's older BGG statistics retain an explicit unknown-date archive note. They are **not fresh API results**. The other games have reviewed BGG IDs but no fabricated ratings/ranks. A publisher's advertised duration per player is retained as `playTime`; numerical min/max durations represent the corresponding range.

## Update from BoardGameGeek

1. Register an application at <https://boardgamegeek.com/applications> and obtain an API token. See [BGG's API instructions](https://boardgamegeek.com/using_the_xml_api) and [terms](https://boardgamegeek.com/wiki/page/XML_API_Terms_of_Use) for access and permitted use.
2. Set `BGG_API_TOKEN=...` in `.env.local` (ignored by Git). This credential is only read by the local Node importer, never served to the browser.
3. Run `npm install`, then preview with `npm run metadata:sync`.
4. Review the output and run `npm run metadata:sync -- --write` to save it. Review the Git diff before committing.

The importer makes one authenticated XML API2 `thing` request for the catalog's reviewed BGG IDs with `stats=1`. It imports year, player/time ranges, age, designers, artists, publishers, categories, mechanisms, families, rating counts, average rating, complexity and ranks. `bgg.fetchedAt` records the snapshot time. These community statistics are not live. Publishers can include several language editions; static guide credit cards remain curated for the site's edition.

The primary BGG name must match `bgg.name` after punctuation/accent normalization. When adding a game, verify its base-game BGG ID and primary name first. The importer refuses wrong IDs/titles, incomplete batches, invalid XML or missing core fields. It retries queued/rate-limited responses with a bounded wait; authentication failures leave files untouched. Updates preserve local titles/translations, covers, descriptions, guide HTML and rule text. BGG taxonomy names are imported as supplied (usually English).

Without a token, the existing reviewed metadata remains usable. After manual catalog edits, run `npm run metadata:sync -- --export` to refresh HUANG's legacy metadata and `public/data` fallbacks **without contacting BGG**. The command validates/reads its targets before saving and replaces each JSON file atomically; the multi-file export is not a database transaction.

Run `npm run test:metadata` and `node --test scripts/rule-chat.test.js` to verify parsing, failure handling, data export and chat context. Automated tests use an XML fixture and fake HTTP responses; a live BGG synchronization still requires a valid token.
