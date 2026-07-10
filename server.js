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

function safeSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

async function loadGame(slug) {
  const safe = safeSlug(slug);
  if (!safe) return null;
  const gameDir = path.join(CONTENT_DIR, safe);
  const metadataPath = path.join(gameDir, "metadata.json");
  if (!existsSync(metadataPath)) return null;
  const [metadata, lesson, sections, clean] = await Promise.all([
    readJson(metadataPath),
    readJson(path.join(gameDir, "lesson.json")),
    readJson(path.join(gameDir, "sections.json")),
    readFile(path.join(gameDir, "clean.md"), "utf-8"),
  ]);
  return { metadata, lesson, sections: sections.sections || [], clean };
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
  if (/行动|动作|action/.test(source)) aliases.push("action", "turn");
  if (/获胜|赢|胜利|winner|win|score/.test(source)) aliases.push("winner", "victory", "score", "goal");
  if (/设置|准备|开局|setup|start/.test(source)) aliases.push("setup", "board", "draw");
  if (/领袖|leader/.test(source)) aliases.push("leader", "positioning");
  if (/版块|板块|tile/.test(source)) aliases.push("tile", "place");
  if (/冲突|战争|叛乱|conflict|war|revolt/.test(source)) aliases.push("conflict", "war", "revolt");
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

function lessonContext(game) {
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

function gameContext(game) {
  const metadata = game.metadata;
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

function directTutorAnswer(question, game, language = "en") {
  const lowerQuestion = question.toLowerCase();
  const metadata = game.metadata;
  const asksHowToPlay = /怎么玩|玩法|规则|教我|how.*play|learn|teach/.test(lowerQuestion);
  const asksPlayers = /几个人|多少人|玩家人数|人数|players?|player count/.test(lowerQuestion);
  const asksDesigner = /谁.*设计|设计师|designer|designed by|who designed/.test(lowerQuestion);
  const asksPlayTime = /多久|时长|时间|play ?time|duration|how long/.test(lowerQuestion);
  const asksPublisher = /出版|发行|publisher|published by/.test(lowerQuestion);

  if (language === "zh") {
    if (asksHowToPlay) {
      return [
        `${metadata.title} 的核心是用领袖和版块建立“国家”，通过放置版块和控制领袖获得不同颜色的胜利点。`,
        "每回合你必须执行 2 个行动，可以选不同行动，也可以重复同一个行动。",
        "常见行动包括调整领袖、放置版块、用蓝色农夫版块发动农民暴动、用绿色商人版块建立宝塔、或更换手牌。",
        "如果一个国家里出现两个同色领袖，就会发生冲突。",
        "获胜关键是均衡得分，因为最终看的是黄色、红色、蓝色、绿色中最低的那一项；白色胜利点可以当作任意颜色补足。",
      ].join(" ");
    }
    if (asksPlayers && metadata.players) return `${metadata.title} 支持 ${metadata.players} 人游玩。`;
    if (asksDesigner && metadata.designers?.length) return `${metadata.title} 的设计师是 ${metadata.designers.join(", ")}。`;
    if (asksPlayTime && metadata.playTime) return `${metadata.title} 的游戏时长大约是 ${metadata.playTime}。`;
    if (asksPublisher && metadata.publishers?.length) return `${metadata.title} 的出版商是 ${metadata.publishers.join(", ")}。`;
    return "";
  }

  if (asksHowToPlay) {
    return [
      `${metadata.title} is about building states with leaders and tiles, scoring victory points in several colors, and staying balanced because your weakest color determines your final score.`,
      "On your turn, take two actions: position a leader, place a tile, start a peasants' riot with blue Farmer tiles, establish a pagoda with green Trader tiles, or replace up to six tiles.",
      "Leaders score when matching tiles are placed in their state, and conflicts happen when same-colored leaders end up in one state.",
    ].join(" ");
  }
  if (asksPlayers && metadata.players) return `${metadata.title} plays ${metadata.players} players.`;
  if (asksDesigner && metadata.designers?.length) return `${metadata.title} was designed by ${metadata.designers.join(", ")}.`;
  if (asksPlayTime && metadata.playTime) return `${metadata.title} takes about ${metadata.playTime}.`;
  if (asksPublisher && metadata.publishers?.length) return `${metadata.title} is published by ${metadata.publishers.join(", ")}.`;
  return "";
}

async function callOpenAI({ question, game, context, language = "en" }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!hasUsableOpenAiKey(apiKey)) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const responseLanguage = language === "zh" ? "Simplified Chinese" : "English";
  const prompt = [
    `You are a careful board game tutor for ${game.metadata.title}.`,
    "Teach casual players using only the provided reviewed rule text.",
    "If the provided text does not answer the question, say that the reviewed rules do not specify it.",
    "Be concise, concrete, and friendly. Include relevant section names when useful.",
    `Answer in ${responseLanguage}.`,
    "",
    "Game metadata:",
    gameContext(game),
    "",
    "Curated teaching context from reviewed rules:",
    lessonContext(game),
    "",
    "Reviewed rule excerpts:",
    context,
    "",
    `Learner question: ${question}`,
  ].join("\n");

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
  const lowerQuestion = question.toLowerCase();
  let directAnswer = directTutorAnswer(question, game, language);
  if (!directAnswer && lowerQuestion.includes("how many") && lowerQuestion.includes("action")) {
    directAnswer = "You resolve two actions on your turn. The rules say you may choose two different actions or take the same action twice.";
  } else if (!directAnswer && (lowerQuestion.includes("same action") || lowerQuestion.includes("twice"))) {
    directAnswer = "Yes. On your turn, you may choose two different actions or the same action twice.";
  } else if (!directAnswer && (lowerQuestion.includes("win") || lowerQuestion.includes("winner"))) {
    directAnswer = game.lesson.goal;
  } else if (!directAnswer && (lowerQuestion.includes("setup") || lowerQuestion.includes("start"))) {
    directAnswer = "Set up the board, starting Governor tiles, pagodas, victory point markers, unification marker, player screens, leaders, tile bag, player hands, and market.";
  }

  if (language === "zh") {
    if (!directAnswer && (lowerQuestion.includes("action") || lowerQuestion.includes("行动"))) {
      directAnswer = "你的回合要执行两个行动。可以选择两个不同的行动，也可以重复同一个行动。";
    } else if (!directAnswer && (lowerQuestion.includes("win") || lowerQuestion.includes("winner") || lowerQuestion.includes("获胜") || lowerQuestion.includes("赢"))) {
      directAnswer = "最终分数取决于你最低的胜利点颜色，所以要让王朝在各颜色上保持均衡。";
    } else if (!directAnswer && (lowerQuestion.includes("setup") || lowerQuestion.includes("start") || lowerQuestion.includes("设置") || lowerQuestion.includes("开始"))) {
      directAnswer = "设置游戏版图、起始总督版块、宝塔、胜利点标记、统一标记、玩家屏风、领袖、版块袋、玩家手牌和市场。";
    }
  }

  const sectionList = matchedSections.map((section) => `- ${section.title}`).join("\n");
  if (language === "zh") {
    const excerpt = matchedSections
      .map((section) => `### ${section.title}\n${section.content.slice(0, 650)}`)
      .join("\n\n");
    return [
      directAnswer || "设置 OPENAI_API_KEY 后，我可以用中文进行完整规则问答。现在先列出本地匹配到的规则段落：",
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
  const excerpt = matchedSections
    .map((section) => `### ${section.title}\n${section.content.slice(0, 650)}`)
    .join("\n\n");
  return [
    directAnswer || "I can answer conversationally once `OPENAI_API_KEY` is set. For now, here are the most relevant rule sections I found locally:",
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
    const directAnswer = directTutorAnswer(payload.question, game, language);

    try {
      const answer = directAnswer ||
        (await callOpenAI({ question: payload.question, game, context, language })) ||
        localTutorFallback(payload.question, matchedSections, game, language);
      return json(res, 200, {
        answer,
        sections: matchedSections.map((section) => ({ id: section.id, title: section.title })),
        usedModel: hasUsableOpenAiKey(process.env.OPENAI_API_KEY),
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



