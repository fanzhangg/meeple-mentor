# Board Game Rule Instructor

Local-first V1 for teaching board games from reviewed rule text. HUANG is included as the first hardcoded sample.

## Age of Innovation player guide

Open `/games/age-of-innovation/` from the game library for the Chinese / English reference and 14 recap questions. The shared language selector preserves quiz answers when switching languages and remembers the language preference. Rules and quizzes work with both the Node server and static hosting without an API key. Live rules Q&A uses the Node backend and its configured OpenAI key. Quiz progress lasts while the page remains open.

All three guides share `public/guide.css` for mobile-first typography and layout, and `public/guide-layout.js` for responsive contents navigation. The design roles and maintenance rules are documented in [Guide design system](docs/guide-design-system.md). Guides use continuous rule sections, inline checkpoints with immediate feedback, a score dial, and mobile Rules / Ask views. Costs, examples, and appendix details expand within each section. All three games share `public/rule-chat.js` and `/api/chat` for natural-language rules Q&A. Requests carry the game slug and language; the server supplies that game's rules, teaching outline, and relevant excerpts to the model.

The guide lives in `public/games/age-of-innovation/`. Core rules and questions are in `guide-data.js` and `guide-data.en.js`; interface text and overviews are in `guide-copy.js`. Both searchable appendices are generated from the rulebooks with `python scripts/build_aoi_appendix.py`. Cropped rule illustrations live in `public/guide-assets/age-of-innovation/`.

Run `node --test scripts/aoi-guide.test.js` to check quiz state, search, content references, and assets.

## Fate of the Fellowship player guide

Open `/games/fate-of-the-fellowship/` for the Chinese / English player reference, 15 recap questions, and five rulebook image examples. It follows the shared guide layout with the same rules chatbot as HUANG, setup and solo references, and language switching that preserves quiz answers. Its chatbot uses the supplied rules digests and must acknowledge when a card-specific rule is absent from that context.

Reviewed rules digests and the source audit are in `content/games/fate-of-the-fellowship/`. The supplied English and Chinese PDFs remain in the original `content/games/fate-of-fellowshipe/` folder. The digests are summaries, not verbatim rulebook transcriptions. Website modules are in `public/games/fate-of-the-fellowship/` and image assets are in `public/guide-assets/fate-of-the-fellowship/`.

Run `node --test scripts/fellowship-guide.test.js scripts/aoi-guide.test.js` to check both guides.

## Run

```powershell
& "C:\Users\fzhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Then open `http://localhost:3000`.

## Optional LLM Mode

Copy `.env.example` to `.env.local` or set environment variables before starting the server:

```powershell
$env:OPENAI_API_KEY="..."
$env:OPENAI_MODEL="gpt-4.1-mini"
& "C:\Users\fzhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Without `OPENAI_API_KEY`, the tutor runs in local fallback mode and shows the selected game's relevant rule excerpts. The browser displays a backend-unavailable message on static-only hosting.

Chat includes earlier successful questions and answers from the current page session, including after switching languages. Each game page has its own conversation; reloading starts a new conversation. Introductory messages, loading text, and failed requests are excluded from model context.

Run `node --test scripts/rule-chat.test.js scripts/aoi-guide.test.js scripts/fellowship-guide.test.js` to verify game/language isolation, the model request path, safe answer formatting, and guide behavior. Model API responses are mocked in the automated chat tests.

## Deploy To Render

This repo includes `render.yaml` so Render can create the web service from the repository.

1. Push this repo to GitHub.
2. In Render, choose **New** -> **Blueprint** and connect the GitHub repo.
3. When Render prompts for `OPENAI_API_KEY`, paste your OpenAI API key as a secret value.
4. Deploy the `board-game-rule-instructor` service.

The service uses:

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/`
- Default plan: `free`

For less cold-start latency, change `plan: free` to `plan: starter` in `render.yaml` or upgrade the service in the Render dashboard.

## Content Layout

```text
content/games/
  index.json
  huang/
    metadata.json
    clean.md
    lesson.json
    sections.json
    source/
      rules.pdf
```

- `clean.md` is the canonical reviewed rule text.
- `lesson.json` powers the guided teaching flow.
- `sections.json` powers simple section retrieval for Q&A.
- `source/rules.pdf` is a local reference copy and is gitignored.

## Regenerate HUANG Extraction

```powershell
& "C:\Users\fzhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" scripts\extract_pdf.py "C:\Users\fzhan\workspace\board-game-rule-instructor\GameRulesPDF\Huang-Rules.pdf" content\games\huang
```

The current PDF text extraction is a draft. The rulebook uses a multi-column layout, so review and polish `content/games/huang/clean.md` before considering it canonical.
