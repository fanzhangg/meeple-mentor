# Meeple Mentor

**Keep the game moving, even when the rules slip your mind.**

Meeple Mentor supports the person teaching the game—it is not intended to replace them. It acts as a personal mentor at the table, offering help tailored to each player's questions whenever they need it. After the initial explanation, players can refresh a forgotten rule, clarify an exception, or check their understanding at their own pace.

Concise multilingual guides, recap quizzes, and AI rules Q&A help players build confidence and keep the game moving.

## How to use

1. Choose a game from the library and select English or Chinese.
2. Browse the player guide and try the recap questions to review the essentials.
3. During play, return to a rule section or ask the rules assistant a question about your game.

## Run locally

With Node.js 22 installed, run these commands from the repository folder:

```sh
npm install
npm start
```

Open [localhost:3000](http://localhost:3000). Guides and quizzes work without an API key; the rules assistant returns relevant local rule excerpts.

### Enable AI answers (optional)

Copy `.env.example` to `.env.local`, then replace the placeholder with your OpenAI API key:

```dotenv
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-5.6-luna
```

Restart the server with `npm start`. The assistant uses the selected game's rules and earlier questions in the current page session. Reloading starts a new conversation. You can change `OPENAI_MODEL` to use another model.

## Deploy to Render

1. Push the repository to GitHub.
2. In Render, select **New → Blueprint** and connect the repository.
3. Enter `OPENAI_API_KEY` when prompted, then deploy.

The included [render.yaml](render.yaml) configures installation, startup, and the free plan. The rules assistant requires the Node.js server; it is unavailable on static-only hosting.

## Development

Run the regression suite:

```sh
node --test scripts/*.test.js
```

Chat tests use mocked model responses and do not require an API key.

The project is organized around three areas:

- `content/games/` — the shared game catalog, reviewed rules, and source audits.
- `public/games/` — published game guides; illustrations live in `public/guide-assets/`.
- `server.js` — the local web server and rules Q&A API.

For more detail, see the [guide design system](docs/guide-design-system.md) and [game metadata and source management](docs/game-metadata.md). The [proposed content architecture](docs/site-architecture.md) and [refactoring plan](docs/refactor-plan.md) describe future work, not the current implementation.
