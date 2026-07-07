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
