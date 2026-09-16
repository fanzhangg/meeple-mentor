import {getLanguage, t} from './i18n.js';
import {readSse} from './sse.js';
import MarkdownIt from './vendor/markdown-it/markdown-it.js';
const appRoot = new URL('./', import.meta.url);
const markdown = new MarkdownIt({html: false, linkify: false});
// Chat answers render text and links, without automatically loading remote images.
markdown.renderer.rules.image = (tokens, index) => markdown.utils.escapeHtml(
  markdown.renderer.renderInlineAsText(tokens[index].children || [], markdown.options, {})
);
// Keep message headings below the surrounding page and dialog headings.
for (const rule of ['heading_open', 'heading_close']) {
  markdown.renderer.rules[rule] = (tokens, index, options, env, renderer) => {
    const token = tokens[index];
    token.tag = `h${Math.min(6, Number(token.tag.slice(1)) + 2)}`;
    return renderer.renderToken(tokens, index, options);
  };
}
markdown.renderer.rules.table_open = () => '<div class="chat-table-scroll"><table>\n';
markdown.renderer.rules.table_close = () => '</table></div>\n';

export async function requestRuleAnswer({slug, question, language, history = [], onUpdate}, fetcher = fetch) {
  const response = await fetcher(new URL('api/chat', appRoot), {
    method: 'POST', headers: {'content-type':'application/json', accept:'text/event-stream'},
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({slug, question, language, history}),
  });
  if (!response.ok) throw new Error('Chat backend unavailable');
  if (response.headers.get('content-type')?.includes('text/event-stream')) {
    let answer = '';
    for await (const {event, data} of readSse(response.body)) {
      const payload = JSON.parse(data);
      if (event === 'error') throw new Error('Chat request failed');
      if (event === 'delta') {
        if (typeof payload.delta !== 'string') throw new Error('Invalid answer chunk');
        answer += payload.delta;
        onUpdate?.(answer);
      }
      if (event === 'done') {
        if (typeof payload.answer !== 'string' || !payload.answer.trim()) throw new Error('Empty answer');
        if (payload.answer !== answer) onUpdate?.(payload.answer);
        return payload.answer;
      }
    }
    throw new Error('Answer stream interrupted');
  }
  const data = await response.json();
  if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Empty answer');
  return data.answer;
}

export function createRuleConversation(slug, request = requestRuleAnswer) {
  const history = [];
  return async (question, language, onUpdate) => {
    const answer = await request({slug, question, language, onUpdate, history: history.map(message => ({...message}))});
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
    let lastScrollTop = log.scrollTop;
    let frame = null;
    let streamedAnswer = '';
    const stopFollowing = () => { followReply = false; };
    // Touch/wheel intent can precede the actual scroll (including smooth scrolling).
    log.addEventListener('wheel', stopFollowing, {passive: true});
    log.addEventListener('touchmove', stopFollowing, {passive: true});
    const updateFollowReply = () => {
      // Once the reader scrolls manually, leave their position alone for this reply.
      followReply = followReply && Math.abs(log.scrollTop - lastScrollTop) < 2;
    };
    const renderReply = text => {
      updateFollowReply();
      pending.classList.remove('is-typing');
      setMessageContent(pending, 'assistant', text);
      // Keep the start of a long answer in view as more text arrives.
      if (followReply) log.scrollTop = pending.offsetTop - 12;
      lastScrollTop = log.scrollTop;
    };
    try {
      const answer = await converse(question, language, text => {
        streamedAnswer = text;
        if (frame === null) frame = requestAnimationFrame(() => {
          frame = null;
          renderReply(streamedAnswer);
        });
      });
      cancelAnimationFrame(frame);
      renderReply(answer);
    } catch {
      cancelAnimationFrame(frame);
      updateFollowReply();
      pending.classList.add('is-error');
      pending.setAttribute('role', 'alert');
      setMessageContent(pending, 'assistant', `**${failedTitle}**\n\n${unavailable}`);
    } finally {
      log.removeEventListener('wheel', stopFollowing);
      log.removeEventListener('touchmove', stopFollowing);
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

function setMessageContent(message, role, text) {
  if (role === "assistant") {
    message.innerHTML = renderMarkdown(text);
    return;
  }
  message.textContent = text;
}

export function renderMarkdown(value) {
  return markdown.render(String(value ?? ''));
}

