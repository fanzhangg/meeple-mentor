import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnvFile(path.join(__dirname, ".env.local"));
loadEnvFile(path.join(__dirname, ".env"));
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const CONTENT_DIR = path.join(__dirname, "content", "games");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function send(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType });
  res.end(body);
}

function json(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}

async function readTextIfExists(filePath) {
  return existsSync(filePath) ? readFile(filePath, "utf-8") : "";
}

function safeSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

async function loadGame(slug) {
  const safe = safeSlug(slug);
  if (!safe) return null;
  const gameDir = path.join(CONTENT_DIR, safe);
  const metadataPath = path.join(gameDir, "metadata.json");
  if (!existsSync(metadataPath)) return null;
  const [metadata, lesson, sections, clean, rulesEn, rulesZh] = await Promise.all([
    readJson(metadataPath),
    readJson(path.join(gameDir, "lesson.json")),
    readJson(path.join(gameDir, "sections.json")),
    readFile(path.join(gameDir, "clean.md"), "utf-8"),
    readTextIfExists(path.join(gameDir, "rules-review.md")),
    readTextIfExists(path.join(gameDir, "rules.zh.md")),
  ]);
  return {
    metadata,
    lesson,
    sections: sections.sections || [],
    clean,
    rulebooks: {
      en: rulesEn || clean,
      zh: rulesZh || rulesEn || clean,
    },
  };
}

function keywords(text) {
  const normalized = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);
  const source = text.toLowerCase();
  const aliases = [];
  if (/怎么玩|玩法|规则|教我|play|learn|teach/.test(source)) {
    aliases.push("play", "goal", "setup", "turn", "action", "leader", "tile", "state", "conflict", "winner");
  }
  if (/几个人|多少人|玩家人数|人数|players?|player count/.test(source)) {
    aliases.push("players", "game info", "components");
  }
  if (/谁.*设计|设计师|designer|designed by|who designed/.test(source)) {
    aliases.push("designer", "credits", "reiner", "knizia");
  }
  if (/多久|时长|时间|play ?time|duration|how long/.test(source)) {
    aliases.push("minutes", "game info", "play time");
  }
  if (/出版|发行|publisher|published by/.test(source)) {
    aliases.push("publisher", "credits", "phalanx");
  }
  if (/行动|动作|action/.test(source)) aliases.push("action", "turn");
  if (/获胜|赢|胜利|winner|win|score/.test(source)) aliases.push("winner", "victory", "score", "goal");
  if (/设置|准备|开局|setup|start/.test(source)) aliases.push("setup", "board", "draw");
  if (/领袖|leader/.test(source)) aliases.push("leader", "positioning");
  if (/版块|板块|tile/.test(source)) aliases.push("tile", "place");
  if (/冲突|战争|叛乱|conflict|war|revolt/.test(source)) aliases.push("conflict", "war", "revolt");
  if (/宝塔|pagoda/.test(source)) aliases.push("pagoda", "pagodas", "triangle");
  if (/农民|暴动|起义|riot|peasants?/.test(source)) aliases.push("peasants", "riot", "farmer", "blue");
  if (/叛乱|内乱|revolt/.test(source)) aliases.push("revolt", "attacker", "defender", "yellow", "governor");
  if (/战争|战斗|war/.test(source)) aliases.push("war", "unification", "red", "soldier", "strength");
  if (/市场|market/.test(source)) aliases.push("market", "trader", "green");
  if (/白色|万能|artisan|wild/.test(source)) aliases.push("artisan", "white", "wild");
  if (/结束|终局|游戏结束|end/.test(source)) aliases.push("game end", "winner", "victory", "white");
  return new Set([...normalized, ...aliases]);
}

function findRelevantSections(question, sections, limit = 4) {
  const terms = keywords(question);
  const ruleSections = sections.filter((section) => {
    const content = section.content.toLowerCase();
    return !["introduction", "review-notes", "source"].includes(section.id) &&
      !content.includes("no selectable text extracted");
  });
  const scored = ruleSections.map((section) => {
    const haystack = `${section.title} ${section.content}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (haystack.includes(term)) score += section.title.toLowerCase().includes(term) ? 4 : 1;
    }
    return { ...section, score };
  });
  const matches = scored.filter((section) => section.score > 0).sort((a, b) => b.score - a.score);
  return (matches.length ? matches : ruleSections.slice(0, limit)).slice(0, limit);
}

const HUANG_ZH_TEACHING_CONTEXT = {
  title: "学习 HUANG",
  overview: "HUANG 是一款板块放置与冲突处理游戏。玩家建立国家、放置王朝领袖、获得不同颜色的胜利点，并在同色领袖相遇时解决冲突。",
  goal: "通过均衡发展王朝来获胜。白色胜利点可在终局补到黄、红、蓝、绿中，最终分数取决于补完后最弱的颜色。",
  steps: [
    ["先抓住目标", "HUANG 不是比总分，而是比补完白色胜利点后黄、红、蓝、绿四种颜色中的最低分。"],
    ["认识五种颜色", "黄色总督支撑领袖并可替代得分；红色士兵决定战争；蓝色农民与河流和农民暴动有关；绿色商人影响市场和宝塔；白色工匠是终局万能分。"],
    ["设置版图", "7 个战国都城格各放 1 个黄色总督板块；每位玩家拿 5 个领袖，暗抽 6 个板块；市场公开 6 个板块。"],
    ["什么是国家", "国家由一个或多个相连板块和至少一个相连领袖组成。只有板块、没有领袖还不算国家。"],
    ["每回合两个行动", "每回合执行 2 个行动，可重复。行动包括操作领袖、放置板块、弃 2 蓝发动农民暴动、弃 2 绿建立宝塔、替换最多 6 个板块。"],
    ["先放好领袖", "领袖可放置、移动或撤回；必须在空的非河流格并邻接黄色总督板块，且不能用领袖连接国家并造成冲突。"],
    ["再用板块得分", "放置板块扩展地图。通常同色领袖得该颜色 1 分；若无同色领袖但有黄色总督领袖，则总督领袖替代得分。"],
    ["记住放置例外", "放置板块连接国家并导致冲突时，这次放置不得分。绿色板块可拿市场板块，蓝色板块可在同一行动中连续放置相邻蓝色板块。"],
    ["三个辅助行动", "农民暴动弃 2 蓝移除版图 1 个板块；建立宝塔弃 2 绿在已有同色三角形上放宝塔；替换板块可弃最多 6 个再抽同数。"],
    ["宝塔是持续得分", "放置板块形成 3 个同色板块三角形时可建同色宝塔；回合结束时，同色领袖与同色宝塔在同一国家就得分。"],
    ["冲突分两种", "一个国家中出现两个同色领袖就冲突。放领袖造成叛乱，主要看黄色总督；放板块连接国家造成战争，主要看红色士兵。"],
    ["均衡四色，白色补弱", "袋中无板块可抽时游戏结束；分配白色胜利点后比较最低颜色，平手再比较第二低、第三低、第四低。"],
  ],
};

function lessonContext(game, language = "en") {
  if (language === "zh" && game.metadata.slug === "huang") {
    const steps = HUANG_ZH_TEACHING_CONTEXT.steps
      .map(([title, summary]) => `- ${title}: ${summary}`)
      .join("\n");
    return [
      `# ${HUANG_ZH_TEACHING_CONTEXT.title}`,
      HUANG_ZH_TEACHING_CONTEXT.overview,
      "",
      `目标: ${HUANG_ZH_TEACHING_CONTEXT.goal}`,
      "",
      "已审核规则的教学提纲:",
      steps,
    ].join("\n");
  }

  const steps = game.lesson.steps
    .map((step) => `- ${step.title}: ${step.summary}`)
    .join("\n");
  return [
    `# ${game.lesson.title}`,
    game.lesson.overview,
    "",
    `Goal: ${game.lesson.goal}`,
    "",
    "Teaching outline from reviewed rules:",
    steps,
  ].join("\n");
}

function gameContext(game, language = "en") {
  const metadata = game.metadata;
  if (language === "zh") {
    return [
      `标题: ${metadata.title}`,
      `玩家人数: ${metadata.players || [metadata.minPlayers, metadata.maxPlayers].filter(Boolean).join("-")}`,
      `游戏时长: ${metadata.playTime || ""}`,
      `年龄: ${metadata.age || ""}`,
      `复杂度: ${metadata.complexity || ""}`,
      `设计师: ${metadata.designers?.join(", ") || ""}`,
      `美术: ${metadata.artists?.join(", ") || ""}`,
      `出版商: ${metadata.publishers?.join(", ") || ""}`,
      `简介: ${metadata.description || metadata.subtitle || ""}`,
    ].filter((line) => !line.endsWith(": ")).join("\n");
  }

  return [
    `Title: ${metadata.title}`,
    `Players: ${metadata.players || [metadata.minPlayers, metadata.maxPlayers].filter(Boolean).join("-")}`,
    `Play time: ${metadata.playTime || ""}`,
    `Age: ${metadata.age || ""}`,
    `Complexity: ${metadata.complexity || ""}`,
    `Designer: ${metadata.designers?.join(", ") || ""}`,
    `Artist: ${metadata.artists?.join(", ") || ""}`,
    `Publisher: ${metadata.publishers?.join(", ") || ""}`,
    `Description: ${metadata.description || metadata.subtitle || ""}`,
  ].filter((line) => !line.endsWith(": ")).join("\n");
}

function hasUsableOpenAiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.startsWith("sk-") && apiKey !== "sk-your-api-key-here";
}

function rulebookContext(game, language = "en") {
  const rulebook = language === "zh" ? game.rulebooks.zh : game.rulebooks.en;
  return rulebook.trim().slice(0, 50000);
}

function chatPrompt({ question, game, context, rulebook, language = "en" }) {
  if (language === "zh") {
    return [
      `你是 ${game.metadata.title} 的细心桌游规则导师。`,
      "网页语言是中文，因此默认用户会用中文提问；请用简体中文回答。",
      "你只能使用下方提供的游戏资料、已审核中文教学提纲、完整中文规则和相关规则摘录来回答。",
      "如果相关规则摘录与完整中文规则冲突，以完整中文规则为准。",
      "如果提供的上下文没有回答这个问题，请明确说“提供的规则上下文没有说明”，不要猜测或编造。",
      "回答要简洁、具体、适合边玩边查。必要时可以提到相关规则章节名。",
      "不要把可选规则当作基础规则，除非用户明确询问可选规则。",
      "",
      "游戏资料:",
      gameContext(game, language),
      "",
      "已审核规则的教学提纲:",
      lessonContext(game, language),
      "",
      "完整中文规则:",
      rulebook,
      "",
      "可能相关的规则摘录:",
      context,
      "",
      `用户问题: ${question}`,
    ].join("\n");
  }

  return [
    `You are a careful board game tutor for ${game.metadata.title}.`,
    "The page language is English, so assume the learner is asking in English unless their message clearly says otherwise.",
    "Teach casual players using only the provided game metadata, curated English teaching context, complete English rules, and reviewed rule excerpts.",
    "If likely relevant excerpts conflict with the complete English rules, trust the complete English rules.",
    "If the provided context does not answer the question, say that the provided context does not specify it.",
    "Be concise, concrete, and friendly. Include relevant section names when useful.",
    "Do not treat optional rules as base-game rules unless the learner explicitly asks about optional rules.",
    "Answer in English.",
    "",
    "Game metadata:",
    gameContext(game, language),
    "",
    "Curated teaching context from reviewed rules:",
    lessonContext(game, language),
    "",
    "Complete English rules:",
    rulebook,
    "",
    "Likely relevant rule excerpts:",
    context,
    "",
    `Learner question: ${question}`,
  ].join("\n");
}

async function callOpenAI({ question, game, context, language = "en" }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!hasUsableOpenAiKey(apiKey)) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = chatPrompt({
    question,
    game,
    context,
    rulebook: rulebookContext(game, language),
    language,
  });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      max_output_tokens: 700,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  return (
    data.output_text ||
    data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("").trim() ||
    ""
  );
}

function localTutorFallback(question, matchedSections, game, language = "en") {
  const sectionList = matchedSections.map((section) => `- ${section.title}`).join("\n");
  const excerpt = matchedSections
    .map((section) => `### ${section.title}\n${section.content.slice(0, 650)}`)
    .join("\n\n");

  if (language === "zh") {
    return [
      "设置 OPENAI_API_KEY 后，我可以根据匹配到的上下文生成回答。现在先列出本地匹配到的游戏资料和规则段落：",
      "",
      "游戏资料：",
      gameContext(game, language),
      "",
      "匹配段落：",
      sectionList,
      "",
      "相关摘录：",
      excerpt,
      "",
      `你的问题是：${question}`,
    ].join("\n");
  }

  return [
    "I can answer conversationally once `OPENAI_API_KEY` is set. For now, here is the matched game context and the most relevant rule sections I found locally:",
    "",
    "Game metadata:",
    gameContext(game),
    "",
    "Matched sections:",
    sectionList,
    "",
    "Relevant excerpt:",
    excerpt,
    "",
    `Your question was: ${question}`,
  ].join("\n");
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/api/games" && req.method === "GET") {
    const games = await readJson(path.join(CONTENT_DIR, "index.json"));
    return json(res, 200, games);
  }

  const gameMatch = url.pathname.match(/^\/api\/games\/([a-z0-9-]+)$/);
  if (gameMatch && req.method === "GET") {
    const game = await loadGame(gameMatch[1]);
    if (!game) return json(res, 404, { error: "Game not found" });
    return json(res, 200, game);
  }

  if (url.pathname === "/api/chat" && req.method === "POST") {
    const body = await readRequestBody(req);
    const payload = JSON.parse(body || "{}");
    const game = await loadGame(payload.slug || "huang");
    if (!game) return json(res, 404, { error: "Game not found" });
    if (!payload.question || typeof payload.question !== "string") {
      return json(res, 400, { error: "Question is required" });
    }

    const language = payload.language === "zh" ? "zh" : "en";
    const matchedSections = findRelevantSections(payload.question, game.sections);
    const context = matchedSections
      .map((section) => `## ${section.title}\n${section.content}`)
      .join("\n\n")
      .slice(0, 12000);

    try {
      const modelAnswer = await callOpenAI({ question: payload.question, game, context, language });
      const answer = modelAnswer || localTutorFallback(payload.question, matchedSections, game, language);
      return json(res, 200, {
        answer,
        sections: matchedSections.map((section) => ({ id: section.id, title: section.title })),
        usedModel: Boolean(modelAnswer),
      });
    } catch (error) {
      return json(res, 502, { error: error.message });
    }
  }

  return json(res, 404, { error: "API route not found" });
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function handleGameAsset(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const match = url.pathname.match(/^\/game-assets\/([a-z0-9-]+)\/([a-zA-Z0-9._-]+)$/);
  if (!match) return send(res, 404, "Not found", "text/plain; charset=utf-8");
  const [, slug, fileName] = match;
  const sourceDir = path.join(CONTENT_DIR, slug, "source");
  const filePath = path.normalize(path.join(sourceDir, fileName));
  if (!filePath.startsWith(sourceDir) || !existsSync(filePath)) {
    return send(res, 404, "Not found", "text/plain; charset=utf-8");
  }
  const extension = path.extname(filePath);
  send(res, 200, await readFile(filePath), MIME_TYPES[extension] || "application/octet-stream");
}

async function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
  let finalPath = filePath;
  if (existsSync(finalPath) && statSync(finalPath).isDirectory()) {
    finalPath = path.join(finalPath, "index.html");
  }
  if (!existsSync(finalPath)) return send(res, 404, "Not found", "text/plain; charset=utf-8");
  const extension = path.extname(finalPath);
  send(res, 200, await readFile(finalPath), MIME_TYPES[extension] || "application/octet-stream");
}

createServer(async (req, res) => {
  try {
    if (req.url?.startsWith("/api/")) return await handleApi(req, res);
    if (req.url?.startsWith("/game-assets/")) return await handleGameAsset(req, res);
    return await handleStatic(req, res);
  } catch (error) {
    json(res, 500, { error: error.message });
  }
}).listen(PORT, () => {
  console.log(`Board game rule instructor running at http://localhost:${PORT}`);
});



