import {
  getHuangLesson,
  getHuangMetadata,
  getLanguage,
  renderLanguageMenu,
  setLanguage,
  t,
} from "./i18n.js";

const appRoot = new URL("./", import.meta.url);
let currentGame = null;
let introMessage = null;
let currentLessonSteps = [];
const checkpointResults = new Map();

const elements = {
  title: document.querySelector("#game-title"),
  year: document.querySelector("#game-year"),
  subtitle: document.querySelector("#game-subtitle"),
  credits: document.querySelector("#game-credits"),
  cover: document.querySelector("#game-cover"),
  mechanism: document.querySelector("#game-mechanism"),
  mechanismLabel: document.querySelector("#mechanism-label"),
  nav: document.querySelector("#lesson-nav"),
  overview: document.querySelector("#lesson-overview"),
  sections: document.querySelector("#lesson-sections"),
  chatLog: document.querySelector("#chat-log"),
  chatForm: document.querySelector("#chat-form"),
  question: document.querySelector("#question"),
  askButton: document.querySelector("#ask-button"),
  homeLink: document.querySelector("#home-link"),
  languageMenu: document.querySelector("#language-menu"),
  rulesTab: document.querySelector("#rules-tab"),
  askTab: document.querySelector("#ask-tab"),
  tabs: document.querySelectorAll(".mobile-tabs button"),
  panels: document.querySelectorAll("[data-panel]"),
  mobileTabs: document.querySelector(".mobile-tabs"),
  ruleSummaryLabel: document.querySelector("#rule-summary-label"),
  ruleArticleTitle: document.querySelector("#rule-article-title"),
  chatEyebrow: document.querySelector("#chat-eyebrow"),
  chatTitle: document.querySelector("#chat-title"),
};

setLanguage(getLanguage());
renderLanguageMenu(elements.languageMenu, () => {
  checkpointResults.clear();
  renderAll();
});

async function loadGame() {
  currentGame = await fetchJson(["api/games/huang", "data/games/huang.json"]);
  renderAll();
  introMessage = addMessage("assistant", t("game.assistantIntro"));
}

async function fetchJson(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(new URL(path, appRoot));
      if (response.ok) return await response.json();
    } catch {
      // Try the next source. GitHub Pages uses static JSON instead of /api routes.
    }
  }
  throw new Error("Could not load HUANG");
}

function renderAll() {
  renderStaticText();
  if (!currentGame) return;
  renderGame();
  renderArticle();
  if (introMessage) introMessage.textContent = t("game.assistantIntro");
}

function renderStaticText() {
  elements.homeLink.textContent = t("common.allGames");
  elements.mechanismLabel.textContent = `${t("game.mechanism")}:`;
  elements.mobileTabs.setAttribute("aria-label", t("game.tabLabel"));
  elements.rulesTab.textContent = t("game.rulesTab");
  elements.askTab.textContent = t("game.askTab");
  elements.ruleSummaryLabel.textContent = t("game.ruleSummary");
  elements.ruleArticleTitle.textContent = t("game.articleTitle");
  elements.chatEyebrow.textContent = t("game.chatEyebrow");
  elements.chatTitle.textContent = t("game.chatTitle");
  elements.question.placeholder = t("game.chatPlaceholder");
  elements.askButton.textContent = t("game.askButton");
  elements.askButton.title = t("game.askButtonTitle");
}

function renderGame() {
  const metadata = getHuangMetadata(currentGame.metadata);
  elements.title.textContent = metadata.title;
  elements.year.textContent = metadata.yearPublished ? `(${metadata.yearPublished})` : "";
  elements.subtitle.textContent = metadata.subtitle;

  if (metadata.thumbnail) {
    elements.cover.src = resolveAsset(metadata.thumbnail);
    elements.cover.alt = t("game.coverAlt", { title: metadata.title });
  }

  elements.mechanism.textContent = metadata.mechanisms?.includes("Area Majority / Influence")
    ? t("game.areaMajority")
    : "";

  elements.credits.innerHTML = [
    [t("game.designer"), metadata.designers?.join(", ")],
    [t("game.artist"), metadata.artists?.join(", ")],
    [t("game.publisher"), metadata.publishers?.join(", ")],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
}

function renderArticle() {
  const lesson = getHuangLesson(currentGame.lesson);
  currentLessonSteps = lesson.steps;
  elements.overview.textContent = lesson.overview;
  elements.nav.innerHTML = lesson.steps
    .map((step) => `<a href="#${step.id}">${escapeHtml(step.title)}</a>`)
    .join("");
  elements.sections.innerHTML = `${lesson.steps.map(renderRuleSection).join("")}${renderScoreCard()}`;
  updateCheckpointScore();
}

function renderRuleSection(step) {
  return `
    <section class="rule-section" id="${step.id}">
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.summary)}</p>
      ${renderCheckpoint(step)}
    </section>
  `;
}

function renderCheckpoint(step) {
  if (!step.check?.options) {
    return `<div class="rule-check"><strong>${escapeHtml(t("game.checkpoint"))}</strong><span>${escapeHtml(step.check || "")}</span></div>`;
  }

  const result = checkpointResults.get(step.id);
  const options = step.check.options
    .map((option, index) => {
      const checked = result?.selected?.includes(index) ? " checked" : "";
      return `
        <label class="checkpoint-option">
          <input type="radio" name="checkpoint-${escapeHtml(step.id)}" value="${index}"${checked} />
          <span>${escapeHtml(option.text)}</span>
        </label>
      `;
    })
    .join("");

  return `
    <div class="rule-check checkpoint" data-check-id="${escapeHtml(step.id)}">
      <strong>${escapeHtml(t("game.checkpoint"))}</strong>
      <p class="checkpoint-instruction">${escapeHtml(t("game.selectAll"))}</p>
      <p class="checkpoint-prompt">${escapeHtml(step.check.prompt)}</p>
      <div class="checkpoint-options">${options}</div>
      <button class="checkpoint-submit" type="button" data-check-id="${escapeHtml(step.id)}">${escapeHtml(t("game.checkAnswer"))}</button>
      <p class="checkpoint-feedback ${result ? (result.correct ? "correct" : "incorrect") : ""}" data-feedback-for="${escapeHtml(step.id)}">${result ? escapeHtml(result.feedback) : ""}</p>
    </div>
  `;
}

function renderScoreCard() {
  return `
    <section class="checkpoint-score" id="checkpoint-score" aria-live="polite">
      <h3>${escapeHtml(t("game.scoreTitle"))}</h3>
      <p id="checkpoint-score-text"></p>
    </section>
  `;
}

function handleCheckpointSubmit(button) {
  const checkId = button.dataset.checkId;
  const step = currentLessonSteps.find((item) => item.id === checkId);
  if (!step?.check?.options) return;

  const container = button.closest(".checkpoint");
  const selected = [...container.querySelectorAll("input[type='radio']:checked")].map((input) => Number(input.value));
  const feedback = container.querySelector(".checkpoint-feedback");

  if (selected.length === 0) {
    feedback.textContent = t("game.selectOne");
    feedback.className = "checkpoint-feedback incorrect";
    return;
  }

  const correctIndexes = step.check.options
    .map((option, index) => (option.correct ? index : -1))
    .filter((index) => index >= 0);
  const correct = selected.length === 1 && selected[0] === correctIndexes[0];
  const correctAnswers = correctIndexes.map((index) => step.check.options[index].text).join("; ");
  const feedbackText = correct
    ? `${t("game.correctAnswer")} ${step.check.explanation}`
    : `${t("game.incorrectAnswer", { answers: correctAnswers })} ${step.check.explanation}`;

  checkpointResults.set(checkId, { correct, selected, feedback: feedbackText });
  feedback.textContent = feedbackText;
  feedback.className = `checkpoint-feedback ${correct ? "correct" : "incorrect"}`;
  updateCheckpointScore();
}

function updateCheckpointScore() {
  const scoreText = document.querySelector("#checkpoint-score-text");
  if (!scoreText) return;
  const total = currentLessonSteps.filter((step) => step.check?.options).length;
  const answered = checkpointResults.size;
  const correct = [...checkpointResults.values()].filter((result) => result.correct).length;
  scoreText.textContent = answered === 0
    ? t("game.scoreEmpty", { total })
    : t("game.scoreValue", { correct, answered, total });
}

function resolveAsset(path) {
  return new URL(String(path).replace(/^\//, ""), appRoot).href;
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  elements.chatLog.append(message);
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
  return message;
}

async function askTutor(question) {
  addMessage("user", question);
  const pending = document.createElement("div");
  pending.className = "message assistant";
  pending.textContent = t("game.checking");
  elements.chatLog.append(pending);

  try {
    const response = await fetch(new URL("api/chat", appRoot), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: "huang", question, language: getLanguage() }),
    });
    if (!response.ok) throw new Error("Chat backend unavailable");
    const data = await response.json();
    pending.textContent = data.answer || data.error || t("game.noAnswer");
  } catch {
    pending.textContent = t("game.chatUnavailable");
  }
}

function selectTab(name) {
  elements.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  elements.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab.dataset.tab)));
elements.sections.addEventListener("click", (event) => {
  const button = event.target.closest(".checkpoint-submit");
  if (button) handleCheckpointSubmit(button);
});
elements.chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = elements.question.value.trim();
  if (!question) return;
  elements.question.value = "";
  await askTutor(question);
});

loadGame().catch((error) => {
  addMessage("assistant", t("game.loadError", { message: error.message }));
});
