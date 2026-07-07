const LANGUAGE_KEY = "meeple-mentor-language";
const SUPPORTED_LANGUAGES = ["en", "zh"];

const huangStepsZh = [
  {
    id: "big-picture",
    title: "整体概念",
    summary: "玩家通过放置领袖和版块在地图上形成国家。一个国家中有对应颜色的领袖时，放置同色版块通常会获得胜利点。",
    check: {
      prompt: "在 HUANG 中，什么是国家？",
      options: [
        { text: "一个或多个相连版块，并且至少有一个相连领袖", correct: true },
        { text: "任意三个同色版块", correct: false },
        { text: "只有领袖、没有版块也可以", correct: false },
        { text: "只有标记出来的都城格", correct: false },
      ],
      explanation: "国家由一个或多个相连版块和至少一个相连领袖组成。",
    },
  },
  {
    id: "setup",
    title: "设置版图",
    summary: "准备游戏版图、起始总督版块、宝塔、胜利点、统一标记、玩家屏风、领袖、版块袋、玩家手牌和市场。",
    check: {
      prompt: "设置时，每位玩家在屏风后抽取多少个版块？",
      options: [
        { text: "4 个", correct: false },
        { text: "5 个", correct: false },
        { text: "6 个", correct: true },
        { text: "7 个", correct: false },
      ],
      explanation: "每位玩家抽取 6 个版块，并隐藏在自己的屏风后。",
    },
  },
  {
    id: "turns",
    title: "执行两个行动",
    summary: "轮到你时，执行两个行动。你可以选择两个不同的行动，也可以重复同一个行动。",
    check: {
      prompt: "你的回合要执行几个行动？",
      options: [
        { text: "1 个行动", correct: false },
        { text: "2 个行动", correct: true },
        { text: "3 个行动", correct: false },
        { text: "只要付得起就可以任意多个", correct: false },
      ],
      explanation: "每个回合正好执行 2 个行动，也可以重复同一个行动。",
    },
  },
  {
    id: "leaders",
    title: "谨慎使用领袖",
    summary: "领袖可以放置、移动或撤回。领袖必须放在空的非河流格，并且邻接黄色总督版块。",
    check: {
      prompt: "你可以把领袖放在哪里？",
      options: [
        { text: "任意河流格", correct: false },
        { text: "邻接黄色总督版块的空非河流格", correct: true },
        { text: "同色版块上方", correct: false },
        { text: "对手国家中的任意位置", correct: false },
      ],
      explanation: "领袖必须放在空的非河流格，并且邻接黄色总督版块。",
    },
  },
  {
    id: "tiles",
    title: "放置版块得分",
    summary: "版块会扩展国家，并可能让对应颜色的领袖得分。有些放置会连接国家并触发冲突。",
    check: {
      prompt: "放置版块通常什么时候得分？",
      options: [
        { text: "放入一个有同色领袖的国家时", correct: true },
        { text: "只要碰到空格就得分", correct: false },
        { text: "只有放到市场时", correct: false },
        { text: "只有造成冲突时", correct: false },
      ],
      explanation: "版块通常在放入含有同色领袖的国家时得分。",
    },
  },
  {
    id: "conflicts",
    title: "解决冲突",
    summary: "当一个国家内出现两个相同颜色的领袖时，就会发生冲突。规则会区分和平国家和同色领袖冲突的国家。",
    check: {
      prompt: "什么会造成冲突？",
      options: [
        { text: "一个国家中有两个同色领袖", correct: true },
        { text: "一个国家没有宝塔", correct: false },
        { text: "玩家少于 6 个版块", correct: false },
        { text: "蓝色版块放在河流上", correct: false },
      ],
      explanation: "当一个国家中出现两个同色领袖时，就会发生冲突。",
    },
  },
  {
    id: "endgame",
    title: "关注五种颜色",
    summary: "HUANG 鼓励玩家在各种颜色中均衡得分。留意你最低的颜色，并用领袖和版块选择来补强它。",
    check: {
      prompt: "你的最终分数如何决定？",
      options: [
        { text: "使用最高的颜色分数", correct: false },
        { text: "把所有颜色相加", correct: false },
        { text: "分配白色分后，取黄、红、蓝、绿中最低的分数", correct: true },
        { text: "只计算白色胜利点", correct: false },
      ],
      explanation: "分配白色分后，你的最终分数是黄、红、蓝、绿四种颜色中最低的那个分数。",
    },
  },
]

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
      checkAnswer: "Check answer",
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
      chatUnavailable: "Live chat needs the backend server. The static GitHub Pages version can still teach the summary and checkpoints.",
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
      checkAnswer: "检查答案",
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
      chatUnavailable: "实时问答需要后端服务。静态 GitHub Pages 版本仍可使用规则摘要和检查点。",
      loadError: "无法加载 HUANG 示例：{message}",
      subtitle: "统一中华，击败敌人，夺取皇帝宝座！",
      lessonOverview:
        "HUANG 是一款关于版块放置与冲突的游戏：玩家建立国家、放置王朝领袖、获得不同颜色的胜利点，并在同色领袖相遇时处理冲突。",
    },
    huangLesson: {
      steps: huangStepsZh,
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
  container.innerHTML = `
    <label for="language-select">${t("common.languageLabel")}</label>
    <select id="language-select" aria-label="${t("common.languageLabel")}">
      <option value="en">${t("common.english")}</option>
      <option value="zh">${t("common.chinese")}</option>
    </select>
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
  if (activeLanguage !== "zh") return lesson;
  return {
    ...lesson,
    overview: t("game.lessonOverview"),
    steps: dictionaries.zh.huangLesson.steps,
  };
}

export function getHuangMetadata(metadata) {
  if (activeLanguage !== "zh") return metadata;
  return {
    ...metadata,
    subtitle: t("game.subtitle"),
  };
}




