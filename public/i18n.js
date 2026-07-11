const LANGUAGE_KEY = "meeple-mentor-language";
const SUPPORTED_LANGUAGES = ["en", "zh"];

const huangStepsZh = [
  {
    id: "objective",
    title: "先抓住目标",
    summary: "HUANG 不是比总分，而是比最弱颜色。游戏结束时先把白色胜利点分配到黄、红、蓝、绿四种颜色中，然后用这四种颜色里最低的分数作为最终分数。",
    check: {
      prompt: "HUANG 的最终分数看什么？",
      options: [
        { text: "黄、红、蓝、绿中最低的分数", correct: true },
        { text: "所有颜色直接相加", correct: false },
        { text: "最高颜色的分数", correct: false },
        { text: "只看白色胜利点", correct: false },
      ],
      explanation: "白色胜利点是万能分，可以补到任意颜色；补完后，黄、红、蓝、绿中最低的分数就是最终分数。",
    },
  },
  {
    id: "colors",
    title: "认识五种颜色",
    summary: "黄色总督支撑领袖并在缺少同色领袖时替代得分；红色士兵决定战争强度；蓝色农民与河流和农民暴动有关；绿色商人影响市场和宝塔；白色工匠在终局作为万能分。",
    check: {
      prompt: "战争主要看哪种颜色的板块？",
      options: [
        { text: "红色士兵", correct: true },
        { text: "黄色总督", correct: false },
        { text: "绿色商人", correct: false },
        { text: "白色工匠", correct: false },
      ],
      explanation: "战争强度主要来自参战国家中的红色士兵板块，以及可用的红色士兵领袖效果。",
    },
  },
  {
    id: "setup",
    title: "设置版图",
    summary: "基础游戏在 7 个战国都城格各放 1 个黄色总督板块。每位玩家拿 5 个领袖，暗抽 6 个板块放在屏风后；市场区域公开放 6 个板块。",
    check: {
      prompt: "设置时，每位玩家在屏风后抽取多少个板块？",
      options: [
        { text: "4 个", correct: false },
        { text: "5 个", correct: false },
        { text: "6 个", correct: true },
        { text: "7 个", correct: false },
      ],
      explanation: "每位玩家抽取 6 个板块，并隐藏在自己的屏风后。",
    },
  },
  {
    id: "states",
    title: "什么是国家",
    summary: "共享边的板块和领袖会连接在一起。一个国家必须包含一个或多个相连板块，并且至少有一个相连领袖；只有板块、没有领袖时还不算国家。",
    check: {
      prompt: "在 HUANG 中，什么是国家？",
      options: [
        { text: "一个或多个相连板块，并且至少有一个相连领袖", correct: true },
        { text: "任意三个同色板块", correct: false },
        { text: "只有领袖、没有板块也可以", correct: false },
        { text: "只有标记出来的都城格", correct: false },
      ],
      explanation: "国家由相连板块和至少一个相连领袖组成。之后得分、宝塔和冲突都围绕国家判断。",
    },
  },
  {
    id: "turn-actions",
    title: "每回合两个行动",
    summary: "轮到你时正好执行 2 个行动，可以重复。五种行动是：操作 1 个领袖、放置 1 个板块、弃 2 蓝发动农民暴动、弃 2 绿建立宝塔、替换最多 6 个板块。",
    check: {
      prompt: "下面哪一个是合法行动？",
      options: [
        { text: "弃 2 个绿色商人板块来建立宝塔", correct: true },
        { text: "直接拿任意一个胜利点", correct: false },
        { text: "一次放置任意颜色的多个板块", correct: false },
        { text: "把对手的领袖移动到别处", correct: false },
      ],
      explanation: "每回合从五种行动中执行 2 个；同一种行动也可以做两次。",
    },
  },
  {
    id: "leaders",
    title: "先放好领袖",
    summary: "领袖可以放置、移动或撤回。放置或移动时必须在空的非河流格，且邻接黄色总督板块；如果会连接国家并造成冲突，就不能用领袖这样放。",
    check: {
      prompt: "你可以把领袖放在哪里？",
      options: [
        { text: "任意河流格", correct: false },
        { text: "邻接黄色总督板块的空非河流格", correct: true },
        { text: "同色板块上方", correct: false },
        { text: "对手国家中的任意位置", correct: false },
      ],
      explanation: "领袖必须放在空的非河流格，并且邻接黄色总督板块。领袖可以连接国家，但不能以会造成冲突的方式连接。",
    },
  },
  {
    id: "tiles",
    title: "再用板块得分",
    summary: "放置板块会扩展地图。蓝色农民板块只能放河流格，其他颜色不能放河流格。板块放进国家时，通常由同色领袖得该颜色 1 分；如果没有同色领袖但有黄色总督领袖，则总督领袖得分。",
    check: {
      prompt: "放置板块通常什么时候得分？",
      options: [
        { text: "放入一个有同色领袖的国家时", correct: true },
        { text: "只要碰到空格就得分", correct: false },
        { text: "只有放到市场时", correct: false },
        { text: "只有造成冲突时", correct: false },
      ],
      explanation: "板块放入含有同色领袖的国家时，控制该领袖的玩家得 1 个该颜色胜利点。没有同色领袖但有黄色总督领袖时，由总督领袖替代得分。",
    },
  },
  {
    id: "tile-exceptions",
    title: "记住放置例外",
    summary: "如果放置板块连接两个或更多国家并导致冲突，这次放置本身不得分。绿色商人板块通常可让你拿 1 个市场板块；蓝色农民板块有机会在同一行动中连续放置相邻蓝色板块。",
    check: {
      prompt: "放置板块连接国家并导致冲突时，这次放置怎么得分？",
      options: [
        { text: "不因这次放置获得胜利点", correct: true },
        { text: "立即获得所有颜色各 1 分", correct: false },
        { text: "只获得白色胜利点", correct: false },
        { text: "由起始玩家得分", correct: false },
      ],
      explanation: "导致冲突的连接放置不会获得普通放置得分，行动要先进入冲突解决。",
    },
  },
  {
    id: "special-actions",
    title: "三个辅助行动",
    summary: "农民暴动：弃 2 蓝，移除版图上 1 个板块。建立宝塔：弃 2 绿，在已有同色三角形上放宝塔。替换板块：弃最多 6 个屏风后的板块，再抽同样数量。",
    check: {
      prompt: "农民暴动需要弃掉什么？",
      options: [
        { text: "2 个蓝色农民板块", correct: true },
        { text: "2 个红色士兵板块", correct: false },
        { text: "1 个白色工匠领袖", correct: false },
        { text: "任意 3 个胜利点", correct: false },
      ],
      explanation: "发动农民暴动要展示并弃掉 2 个蓝色农民板块，然后移除版图上任意 1 个板块。",
    },
  },
  {
    id: "pagodas",
    title: "宝塔是持续得分",
    summary: "放置板块形成 3 个同色板块的三角形时，可以建立同色宝塔。回合结束时，如果你的同色领袖和同色宝塔在同一个国家，你获得该颜色胜利点；黄色总督的替代得分不适用于宝塔。",
    check: {
      prompt: "宝塔什么时候提供胜利点？",
      options: [
        { text: "在你的回合结束时检查同色领袖和同色宝塔是否同处一国", correct: true },
        { text: "只要宝塔被建立，所有玩家立刻得分", correct: false },
        { text: "只有黄色总督可以从所有宝塔得分", correct: false },
        { text: "宝塔只用于装饰，不提供胜利点", correct: false },
      ],
      explanation: "宝塔是回合结束时检查的持续得分来源，但必须是你的同色领袖与同色宝塔在同一个国家。",
    },
  },
  {
    id: "conflicts",
    title: "冲突分两种",
    summary: "一个国家中出现两个同色领袖就会冲突。放置或移动领袖造成的是叛乱，看相关领袖邻接的黄色总督板块；放置板块连接国家造成的是战争，看参战国家里的红色士兵板块。",
    check: {
      prompt: "叛乱和战争最核心的区别是什么？",
      options: [
        { text: "叛乱由放领袖造成，战争由放板块连接国家造成", correct: true },
        { text: "叛乱只在游戏结束时发生", correct: false },
        { text: "战争只比较黄色总督板块", correct: false },
        { text: "两者完全一样", correct: false },
      ],
      explanation: "同色领袖同处一国一定要解决，但原因不同：领袖进入国家是叛乱，板块连接国家是战争。",
    },
  },
  {
    id: "endgame",
    title: "均衡四色，白色补弱",
    summary: "当有人需要抽板块但袋中无板块可抽时，游戏结束。所有人公开胜利点，把白色分配到黄、红、蓝、绿中补弱，然后比较最低颜色；平手时依次比较第二低、第三低、第四低。",
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
        "HUANG 是一款关于板块放置与冲突的游戏：玩家建立国家、放置王朝领袖、获得不同颜色的胜利点，并在同色领袖相遇时处理冲突。",
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




