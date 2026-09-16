import {lessons as huangLessons} from './games/huang/guide-data.js';
import {languageFlags} from './icons/language-flags.js';

const LANGUAGE_KEY = "meeple-mentor-language";
const SUPPORTED_LANGUAGES = ["en", "zh"];

const dictionaries = {
  en: {
    common: {
      languageLabel: "Language",
      english: "English",
      chinese: "Chinese",
      allGames: "< All games",
    },
    home: {
      title: "Game Rule Library",
      openRules: "Open {title} rules",
      coverAlt: "{title} cover",
      loadError: "Could not load game library",
    },
    game: {
      loading: "Loading game...",
      coverAlt: "{title} board game cover",
      designer: "Designer",
      artist: "Artist",
      publisher: "Publisher",
      mechanism: "Mechanism",
      areaMajority: "Area Majority / Influence",
      rulesTab: "Rules",
      askTab: "Ask",
      tabLabel: "HUANG page views",
      ruleSummary: "Rule summary",
      articleTitle: "How HUANG Works",
      checkpoint: "Checkpoint",
      selectAll: "Choose one answer.",
      selectOne: "Choose one answer.",
      correctAnswer: "Correct.",
      incorrectAnswer: "Not quite. Correct answers: {answers}.",
      scoreTitle: "Checkpoint Score",
      scoreEmpty: "Answer the checkpoints to see your score out of {total}.",
      scoreValue: "You have {correct} correct out of {answered} answered checkpoints. Total checkpoints: {total}.",
      chatEyebrow: "Rules Q&A",
      chatTitle: "Ask while you play",
      chatPlaceholder: "Ask about setup, turns, leaders, scoring...",
      askButton: "Ask",
      askButtonTitle: "Ask tutor",
      assistantIntro: "Ask about the exact rule you need right now. I will answer from the reviewed HUANG rule text.",
      checking: "Checking the reviewed HUANG rules...",
      noAnswer: "No answer returned.",
      chatFailed: "Request failed",
      chatUnavailable: "We couldn't get an answer right now. Please send your question again in a moment.",
      loadError: "Could not load the HUANG sample: {message}",
      subtitle: "Unite China under your banner, quash your enemies, and claim the Emperor's throne!",
      lessonOverview:
        "HUANG is a tile-placement and conflict game about building states, placing dynasty leaders, earning colored victory points, and managing conflicts when same-colored leaders meet.",
    },
  },
  zh: {
    common: {
      languageLabel: "语言",
      english: "English",
      chinese: "中文",
      allGames: "< 全部游戏",
    },
    home: {
      title: "桌游规则库",
      openRules: "打开 {title} 规则",
      coverAlt: "{title} 封面",
      loadError: "无法加载游戏库",
    },
    game: {
      loading: "正在加载游戏...",
      coverAlt: "{title} 桌游封面",
      designer: "设计师",
      artist: "美术",
      publisher: "出版商",
      mechanism: "机制",
      areaMajority: "区域多数 / 影响力",
      rulesTab: "规则",
      askTab: "提问",
      tabLabel: "HUANG 页面视图",
      ruleSummary: "规则摘要",
      articleTitle: "HUANG 怎么玩",
      checkpoint: "检查点",
      selectAll: "请选择一个答案。",
      selectOne: "请选择一个答案。",
      correctAnswer: "正确。",
      incorrectAnswer: "还不完全对。正确答案：{answers}。",
      scoreTitle: "检查点得分",
      scoreEmpty: "完成检查点后会显示你的总分，满分 {total} 分。",
      scoreValue: "你已回答 {answered} 个检查点，其中 {correct} 个正确。总检查点数：{total}。",
      chatEyebrow: "规则问答",
      chatTitle: "边玩边问",
      chatPlaceholder: "询问设置、回合、领袖、计分等规则...",
      askButton: "提问",
      askButtonTitle: "询问导师",
      assistantIntro: "随时问你现在需要的具体规则。我会根据已整理的 HUANG 规则文本回答。",
      checking: "正在检查已整理的 HUANG 规则...",
      noAnswer: "没有返回答案。",
      chatFailed: "请求失败",
      chatUnavailable: "暂时无法获取回答，请稍后重新发送问题。",
      loadError: "无法加载 HUANG 示例：{message}",
      subtitle: "统一中华，击败敌人，夺取皇帝宝座！",
      lessonOverview:
        "HUANG 是一款关于板块放置与冲突的游戏：玩家建立国家、放置王朝领袖、获得不同颜色的胜利点，并在同色领袖相遇时处理冲突。",
    },
    huangLesson: {
      steps: huangLessons.zh.steps,
    },
  },
};

let activeLanguage = readStoredLanguage();

function readStoredLanguage() {
  try {
    const stored = window.localStorage?.getItem(LANGUAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

function writeStoredLanguage(language) {
  try {
    window.localStorage?.setItem(LANGUAGE_KEY, language);
  } catch {
    // Ignore storage failures; the current page can still switch languages.
  }
}

function getValue(path, language = activeLanguage) {
  const parts = path.split(".");
  let value = dictionaries[language];
  for (const part of parts) value = value?.[part];
  return value ?? parts.reduce((value, part) => value?.[part], dictionaries.en) ?? path;
}

export function getLanguage() {
  return activeLanguage;
}

export function setLanguage(language) {
  activeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
  writeStoredLanguage(activeLanguage);
  document.documentElement.lang = activeLanguage === "zh" ? "zh-Hans" : "en";
}

export function t(path, replacements = {}) {
  let text = String(getValue(path));
  for (const [key, value] of Object.entries(replacements)) {
    text = text.replaceAll(`{${key}}`, value ?? "");
  }
  return text;
}

export function renderLanguageMenu(container, onChange) {
  if (!container) return;
  container.className = "language-menu";
  const languageName = t(activeLanguage === 'zh' ? 'common.chinese' : 'common.english');
  container.innerHTML = `
    <span class="language-picker ui-button ui-button--glass" title="${languageName}">
      ${languageFlags[activeLanguage]}
      <svg class="language-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <select class="language-native-select" id="language-select" aria-label="${t("common.languageLabel")}">
        <option value="en">${t("common.english")}</option>
        <option value="zh">${t("common.chinese")}</option>
      </select>
    </span>
  `;
  const select = container.querySelector("select");
  select.value = activeLanguage;
  select.addEventListener("change", () => {
    setLanguage(select.value);
    renderLanguageMenu(container, onChange);
    onChange?.(activeLanguage);
  });
}

export function getHuangLesson(lesson) {
  return {...lesson, ...huangLessons[activeLanguage]};
}

export function getHuangMetadata(metadata) {
  if (activeLanguage !== "zh") return metadata;
  return {
    ...metadata,
    subtitle: t("game.subtitle"),
  };
}




