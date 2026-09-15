import {getLanguage, t} from './i18n.js';
const appRoot = new URL('./', import.meta.url);

export async function requestRuleAnswer({slug, question, language, history = []}, fetcher = fetch) {
  const response = await fetcher(new URL('api/chat', appRoot), {
    method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({slug, question, language, history}),
  });
  if (!response.ok) throw new Error('Chat backend unavailable');
  const data = await response.json();
  if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Empty answer');
  return data.answer;
}

export function createRuleConversation(slug, request = requestRuleAnswer) {
  const history = [];
  return async (question, language) => {
    const answer = await request({slug, question, language, history: history.map(message => ({...message}))});
    history.push({role: 'user', content: question}, {role: 'assistant', content: answer});
    return answer;
  };
}

export function createRuleChat({slug, log, form, input, button, getLabels}) {
  const converse = createRuleConversation(slug);
  let busy = false;
  let intro = null;
  function addMessage(role, text) {
    const message = document.createElement('div');
    message.className = `message ${role}`;
    setMessageContent(message, role, text);
    log.append(message);
    log.scrollTop = log.scrollHeight;
    return message;
  }
  function refresh() {
    const labels = getLabels();
    input.placeholder = labels.placeholder;
    input.setAttribute('aria-label', labels.placeholder);
    button.textContent = t('game.askButton');
    button.title = t('game.askButtonTitle');
    if (!intro) intro = addMessage('assistant', labels.intro);
    else setMessageContent(intro, 'assistant', labels.intro);
  }
  async function ask(question) {
    if (busy || !question.trim()) return;
    busy = true;
    button.disabled = true;
    log.setAttribute('aria-busy','true');
    const language = getLanguage();
    const unavailable = t('game.chatUnavailable');
    addMessage('user', question);
    const pending = addMessage('assistant', getLabels().checking);
    try {
      setMessageContent(pending, 'assistant', await converse(question, language));
    } catch {
      setMessageContent(pending, 'assistant', unavailable);
    } finally {
      busy = false;
      button.disabled = false;
      log.removeAttribute('aria-busy');
      log.scrollTop = log.scrollHeight;
    }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    input.value = '';
    void ask(question);
  });
  return {addMessage, ask, refresh};
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMessageContent(message, role, text) {
  if (role === "assistant") {
    message.innerHTML = renderMarkdown(text);
    return;
  }
  message.textContent = text;
}

export function renderMarkdown(value) {
  const lines = String(value ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  let listTag = "ul";

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<${listTag}>${list.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${listTag}>`);
    list = [];
    listTag = "ul";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length + 2;
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (list.length && listTag !== "ul") flushList();
      listTag = "ul";
      list.push(bullet[1]);
      continue;
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      if (list.length && listTag !== "ol") flushList();
      listTag = "ol";
      list.push(numbered[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks.join("");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

