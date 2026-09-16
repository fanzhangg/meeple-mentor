import {createDisclosureIcon, initializeDisclosures, setDisclosureExpanded} from './disclosure.js';
import {getLanguage} from './i18n.js';

const pending = new WeakMap();


function cancelCollapse(checkpoint) {
  clearTimeout(pending.get(checkpoint));
  pending.delete(checkpoint);
}

function setCollapsed(checkpoint, collapsed, options = {}) {
  const toggle = checkpoint.querySelector('.checkpoint-review');
  const status = checkpoint.classList.contains('is-correct')
    ? (getLanguage() === 'zh' ? '回答正确：' : 'Correct: ')
    : checkpoint.classList.contains('is-incorrect')
      ? (getLanguage() === 'zh' ? '回答有误：' : 'Incorrect: ')
      : '';
  toggle.setAttribute('aria-label', status + toggle.querySelector('.disclosure-title').textContent);
  checkpoint.classList.toggle('is-collapsed', collapsed);
  setDisclosureExpanded(checkpoint, !collapsed, options);
}

// Every question can be toggled; only correct answers automatically collapse.
export function updateQuizFeedback(checkpoint, correct, {immediate = false} = {}) {
  cancelCollapse(checkpoint);
  let body = checkpoint.querySelector('.checkpoint-body');
  if (!body) {
    const focused = checkpoint.contains(document.activeElement) ? document.activeElement : null;
    body = document.createElement('div');
    body.className = 'checkpoint-body disclosure-body';
    checkpoint.classList.add('ui-disclosure');
    body.id = `quiz-answer-${checkpoint.dataset.checkId}`;
    body.append(...checkpoint.childNodes);
    checkpoint.append(body);
    focused?.focus({preventScroll: true});

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'checkpoint-review disclosure-trigger';
    toggle.setAttribute('aria-controls', body.id);
    const prompt = document.createElement('span');
    prompt.className = 'checkpoint-review-prompt disclosure-title';
    prompt.textContent = body.querySelector('.checkpoint-prompt').textContent;
    toggle.append(prompt, createDisclosureIcon());
    checkpoint.prepend(toggle);
    toggle.addEventListener('click', () => {
      cancelCollapse(checkpoint);
      setCollapsed(checkpoint, !checkpoint.classList.contains('is-collapsed'), {animate: true});
    });
  }
  checkpoint.classList.toggle('is-correct', correct === true);
  checkpoint.classList.toggle('is-incorrect', correct === false);
  setCollapsed(checkpoint, false);
  if (!correct) return;

  const collapse = () => {
    pending.delete(checkpoint);
    if (!checkpoint.isConnected) return;
    setCollapsed(checkpoint, true, {animate: !immediate});
  };
  if (immediate) collapse();
  else pending.set(checkpoint, setTimeout(collapse, 1600));
}

export function initializeQuizFeedback(container) {
  initializeDisclosures(container);
  container.querySelectorAll('.checkpoint').forEach(checkpoint => {
    if (!checkpoint.querySelector('.checkpoint-body')) updateQuizFeedback(checkpoint, null);
  });
}

export function resetQuizFeedback(container) {
  container.querySelectorAll('.checkpoint').forEach(checkpoint => {
    cancelCollapse(checkpoint);
    if (!checkpoint.querySelector('.checkpoint-body')) return;
    checkpoint.classList.remove('is-correct', 'is-incorrect');
    setCollapsed(checkpoint, false);
  });
}
