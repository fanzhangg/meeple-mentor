# Meeple Mentor

Meeple Mentor helps players recall board game rules after a host teaches the game. It supplements the explanation at the table with concise player guides, recap quizzes, and AI rules Q&A. Players can look up a forgotten action or clarify an exception during play without rereading an entire rulebook.

## Project documentation

- [Guide design system](docs/guide-design-system.md)
- [Game metadata and source management](docs/game-metadata.md)
- [Proposed content architecture](docs/site-architecture.md) and [refactoring plan](docs/refactor-plan.md) (not yet implemented)

The published guides cover HUANG, Age of Innovation, Fate of the Fellowship, and Clans of Caledonia. Fellowship includes bilingual rulebook illustrations, symbol keys, and all 13 base character summaries. Reviewed content and source audits live under `content/games/`; guide modules and published images live under `public/games/` and `public/guide-assets/`.

Run `node --test scripts/*.test.js` for the automated regression suite. Chat tests use mocked model responses.

## Run

```powershell
& "C:\Users\fzhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Then open `http://localhost:3000`.

## Optional LLM Mode

Copy `.env.example` to `.env.local` or set environment variables before starting the server:

```powershell
$env:OPENAI_API_KEY="..."
$env:OPENAI_MODEL="gpt-5.6-luna"
& "C:\Users\fzhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Without `OPENAI_API_KEY`, the tutor runs in local fallback mode and shows the selected game's relevant rule excerpts. The browser displays a backend-unavailable message on static-only hosting.

The default model is `gpt-5.6-luna`, with `medium` reasoning, `low` text verbosity, and an 8,192-token output budget shared by reasoning and answer text. Answers lead with the ruling and normally use 1–3 short sentences, retaining decisive conditions and exceptions. Detailed explanations and examples are provided when requested; the token budget is not a target answer length. SSE displays answer text once generation begins. `OPENAI_MODEL` can override the model, and Luna-specific reasoning and verbosity parameters are omitted for other models.

Chat includes earlier successful questions and answers from the current page session, including after switching languages. Each game page has its own conversation; reloading starts a new conversation. Introductory messages, loading text, and failed requests are excluded from model context.

Chat Markdown uses the locally bundled `markdown-it` parser in `public/vendor/markdown-it` (version and license included). It supports numbered and nested lists, paragraphs inside list items, thematic breaks, links, code and tables. Raw HTML remains escaped, unsafe link schemes are rejected, and images render as alt text without fetching remote assets.

The browser requests SSE from `POST /api/chat` using `fetch` and `Accept: text/event-stream`. The server streams Responses API text into `delta` events, then sends `done` with the complete answer and source-section metadata. The shared chat renders Markdown progressively without moving readers past the start of a long answer. Failed, timed-out, or interrupted streams show the red request-failed message and never enter conversation history. Disconnecting cancels the upstream request; heartbeats and no-buffering headers help proxies deliver events promptly. Clients without the SSE Accept header still receive JSON, and local fallback answers work in both modes. The server allows 90 seconds per model request, with a 120-second browser deadline.

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
