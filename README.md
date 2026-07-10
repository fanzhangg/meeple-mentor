# Board Game Rule Instructor

Local-first V1 for teaching board games from reviewed rule text. HUANG is included as the first hardcoded sample.

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

Without `OPENAI_API_KEY`, the tutor runs in local fallback mode and shows the relevant HUANG rule sections it found.

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
