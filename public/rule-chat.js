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
  const local = (en, zh) => getLanguage() === 'zh' ? zh : en;
  log.setAttribute('role', 'log');
  function resizeComposer() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
    button.disabled = busy || !input.value.trim();
  }
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
    input.placeholder = local('Ask me about game rules', '向我询问游戏规则');
    input.setAttribute('aria-label', input.placeholder);
    button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    button.title = local('Send message', '发送消息');
    button.setAttribute('aria-label', button.title);
    log.setAttribute('aria-label', local('Rules conversation', '规则对话'));
    if (!intro) intro = addMessage('assistant', labels.intro);
    else setMessageContent(intro, 'assistant', labels.intro);
    resizeComposer();
  }
  async function ask(question) {
    if (busy || !question.trim()) return;
    busy = true;
    button.disabled = true;
    log.setAttribute('aria-busy','true');
    const language = getLanguage();
    const failedTitle = t('game.chatFailed');
    const unavailable = t('game.chatUnavailable');
    addMessage('user', question);
    const pending = addMessage('assistant', '');
    pending.classList.add('is-typing');
    let followReply = true;
    try {
      const answer = await converse(question, language);
      followReply = log.scrollHeight - log.scrollTop - log.clientHeight < 80;
      setMessageContent(pending, 'assistant', answer);
    } catch {
      followReply = log.scrollHeight - log.scrollTop - log.clientHeight < 80;
      pending.classList.add('is-error');
      pending.setAttribute('role', 'alert');
      setMessageContent(pending, 'assistant', `**${failedTitle}**\n\n${unavailable}`);
    } finally {
      busy = false;
      pending.classList.remove('is-typing');
      resizeComposer();
      log.removeAttribute('aria-busy');
      // Keep the beginning of long replies visible rather than jumping to their end.
      if (followReply) log.scrollTop = pending.offsetTop - 12;
    }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    input.value = '';
    resizeComposer();
    // Dismiss the phone keyboard once a message is accepted for sending.
    if (window.matchMedia('(min-width: 60rem)').matches) input.focus();
    else input.blur();
    void ask(question);
  });
  input.addEventListener('input', resizeComposer);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
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

