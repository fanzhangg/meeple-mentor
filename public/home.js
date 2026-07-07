import { getLanguage, renderLanguageMenu, setLanguage, t } from "./i18n.js";

const appRoot = new URL("./", import.meta.url);
const grid = document.querySelector("#game-grid");
const title = document.querySelector("#home-title");
const languageMenu = document.querySelector("#language-menu");
let currentGames = [];

setLanguage(getLanguage());
renderLanguageMenu(languageMenu, renderPage);

async function loadGames() {
  const games = await fetchJson(["api/games", "data/games.json"]);
  currentGames = Array.isArray(games) ? games : [games];
  renderPage();
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
  throw new Error(t("home.loadError"));
}

function renderPage() {
  title.textContent = t("home.title");
  grid.innerHTML = currentGames.map(renderGameCard).join("");
}

function renderGameCard(game) {
  const href = new URL(`games/${game.slug}/`, appRoot).href;
  const thumbnail = resolveAsset(game.thumbnail || `game-assets/${game.slug}/cover-art.png`);
  return `
    <a class="game-card" href="${href}" aria-label="${escapeHtml(t("home.openRules", { title: game.title }))}">
      <img src="${thumbnail}" alt="${escapeHtml(t("home.coverAlt", { title: game.title }))}" loading="lazy" />
      <div class="game-card-body">
        <h3>${escapeHtml(game.title)}</h3>
      </div>
    </a>
  `;
}

function resolveAsset(path) {
  return new URL(String(path).replace(/^\//, ""), appRoot).href;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadGames().catch((error) => {
  grid.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
});