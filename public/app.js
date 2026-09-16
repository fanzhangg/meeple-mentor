import {updateQuizFeedback, initializeQuizFeedback} from './quiz-feedback.js';
import {createRuleChat} from './rule-chat.js';
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
let currentLessonSteps = [];
const checkpointResults = new Map();

const elements = {
  title: document.querySelector("#game-title"),
  cover: document.querySelector("#game-cover"),
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
};

const chat = createRuleChat({
  slug: 'huang', log: elements.chatLog, form: elements.chatForm,
  input: elements.question, button: elements.askButton,
  getLabels: () => ({intro: t('game.assistantIntro'), checking: t('game.checking')}),
});

setLanguage(getLanguage());
renderLanguageMenu(elements.languageMenu, () => {
  renderAll();
});

async function loadGame() {
  currentGame = await fetchJson(["api/games/huang", "data/games/huang.json"]);
  renderAll();
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
  chat.refresh();
}

function renderStaticText() {
  elements.homeLink.querySelector('.home-link-label').textContent = t("common.allGames").replace(/^<\s*/, '');
  elements.mobileTabs.setAttribute("aria-label", t("game.tabLabel"));
  elements.rulesTab.textContent = t("game.rulesTab");
  elements.askTab.textContent = t("game.askTab");
  elements.ruleSummaryLabel.textContent = t("game.ruleSummary");
  elements.askButton.textContent = t("game.askButton");
  elements.askButton.title = t("game.askButtonTitle");
}

function renderGame() {
  const metadata = getHuangMetadata(currentGame.metadata);
  elements.title.textContent = metadata.title;

  if (metadata.thumbnail) {
    elements.cover.src = resolveAsset(metadata.thumbnail);
    elements.cover.alt = t("game.coverAlt", { title: metadata.title });
  }

}

function renderArticle() {
  const collapsed = new Map([...elements.sections.querySelectorAll('.checkpoint')]
    .map(el => [el.dataset.checkId, el.classList.contains('is-collapsed')]));
  const lesson = getHuangLesson(currentGame.lesson);
  currentLessonSteps = lesson.steps;
  elements.overview.textContent = lesson.overview;
  elements.nav.innerHTML = lesson.steps
    .map((step) => `<a href="#${step.id}">${escapeHtml(step.title)}</a>`)
    .join("");
  elements.sections.innerHTML = `${lesson.steps.map(renderRuleSection).join("")}`;
  initializeQuizFeedback(elements.sections);
  elements.sections.querySelectorAll('.checkpoint').forEach(el => {
    const result = checkpointResults.get(el.dataset.checkId);
    if (result) updateQuizFeedback(el, result.correct, {immediate: true});
    const wasCollapsed = collapsed.get(el.dataset.checkId);
    if (wasCollapsed !== undefined && el.classList.contains('is-collapsed') !== wasCollapsed) {
      el.querySelector('.checkpoint-review').click();
    }
  });
}

function renderRuleSection(step) {
  return `
    <section class="rule-section" id="${step.id}">
      <h3 tabindex="-1">${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.summary)}</p>
      ${step.bullets?.length ? `<ul>${step.bullets.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>` : ''}
      ${renderCheckpoint(step)}
    </section>
  `;
}

function renderCheckpoint(step) {
  if (!step.check?.options) {
    return '';
  }

  const result = checkpointResults.get(step.id);
  const options = step.check.options
    .map((option, index) => {
      const checked = result?.selected?.includes(index) ? " checked" : "";
      const status = checked ? (result.correct ? "correct" : "incorrect") : "";
      return `
        <label class="checkpoint-option${status ? ` ${status}` : ""}">
          <input type="radio" name="checkpoint-${escapeHtml(step.id)}" value="${index}"${checked} />
          <span>${escapeHtml(option.text)}</span>
          <span class="checkpoint-option-icon" aria-hidden="true">${status ? (result.correct ? "✓" : "✕") : ""}</span>
        </label>
      `;
    })
    .join("");

  return `
    <div class="rule-check checkpoint" data-check-id="${escapeHtml(step.id)}">
      <p class="checkpoint-prompt" id="checkpoint-prompt-${escapeHtml(step.id)}">${escapeHtml(step.check.prompt)}</p>
      <div class="checkpoint-options" role="radiogroup" aria-labelledby="checkpoint-prompt-${escapeHtml(step.id)}" aria-describedby="checkpoint-feedback-${escapeHtml(step.id)}">${options}</div>
      <p class="checkpoint-feedback ${result ? (result.correct ? "correct" : "incorrect") : ""}" id="checkpoint-feedback-${escapeHtml(step.id)}" aria-live="polite" aria-atomic="true">${result ? escapeHtml(checkpointFeedback(step, result.correct)) : ""}</p>
    </div>
  `;
}

function handleCheckpointChange(input) {
  const container = input.closest(".checkpoint");
  const checkId = container.dataset.checkId;
  const step = currentLessonSteps.find((item) => item.id === checkId);
  if (!step?.check?.options) return;

  const selected = [Number(input.value)];
  const feedback = container.querySelector(".checkpoint-feedback");

  const correctIndexes = step.check.options
    .map((option, index) => (option.correct ? index : -1))
    .filter((index) => index >= 0);
  const correct = selected.length === 1 && selected[0] === correctIndexes[0];
  const feedbackText = checkpointFeedback(step, correct);

  checkpointResults.set(checkId, { correct, selected, feedback: feedbackText });
  container.querySelectorAll(".checkpoint-option").forEach((option) => {
    const checked = option.querySelector("input").checked;
    option.classList.toggle("correct", checked && correct);
    option.classList.toggle("incorrect", checked && !correct);
    option.querySelector(".checkpoint-option-icon").textContent = checked ? (correct ? "✓" : "✕") : "";
  });
  feedback.textContent = feedbackText;
  feedback.className = `checkpoint-feedback ${correct ? "correct" : "incorrect"}`;
  updateQuizFeedback(container, correct);
}

function checkpointFeedback(step, correct) {
  const answers = step.check.options.filter(option => option.correct).map(option => option.text).join('; ');
  return `${correct ? t('game.correctAnswer') : t('game.incorrectAnswer', {answers})} ${step.check.explanation}`;
}

function resolveAsset(path) {
  return new URL(String(path).replace(/^\//, ""), appRoot).href;
}

function selectTab(name) {
  elements.tabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
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
elements.sections.addEventListener("change", (event) => {
  const input = event.target.closest(".checkpoint input[type='radio']");
  if (input) handleCheckpointChange(input);
});
loadGame().catch((error) => {
  chat.addMessage("assistant", t("game.loadError", { message: error.message }));
});
