import {updateQuizFeedback, initializeQuizFeedback} from '../../quiz-feedback.js';
import {createRuleChat} from '../../rule-chat.js';
import * as zh from './guide-data.js';
import * as en from './guide-data.en.js';
import {copy} from './guide-copy.js';
import {examplesFor, iconsFor} from './guide-examples.js';
import {imageSizes} from './guide-image-sizes.js';
import {createQuizSession} from './guide-model.js';
import {getLanguage, setLanguage, renderLanguageMenu, t} from '../../i18n.js';
let language = getLanguage();
let {topics, questions} = language === 'zh' ? zh : en;
let labels = copy[language];
const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), labels[key]);
const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const asset = name => new URL(`../../guide-assets/fate-of-the-fellowship/${name}`, import.meta.url).href;
const inlineExampleImages = new Set([
  'travel.png', 'search.png', 'capture.png',
  'fellowship.webp', 'prepare.webp', 'muster.webp',
  'shadow-halves.webp', 'shadow-flow.webp', 'reinforce-battle.webp',
]);
const quiz = createQuizSession(questions);
let coreTopics = topics.filter(topic => !topic.appendix);
let appendixTopics = topics.filter(topic => !coreTopics.includes(topic));

function renderTable(table) {
  if (!table) return '';
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(labels.table)}"><table>
    <thead><tr>${table.headers.map(cell => `<th scope="col">${escape(cell)}</th>`).join('')}</tr></thead>
    <tbody>${table.rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function renderRules(topic) {
  const icons = iconsFor(topic, language);
  const legend = icons.length ? `<ul class="rule-icon-grid">${icons.map(icon => `<li>
    <img src="${asset(icon.image)}" alt="" loading="lazy" width="40" height="40" />
    <span>${escape(icon.caption)}</span>
  </li>`).join('')}</ul>` : '';
  // Dice keys already contain every effect in these two tables.
  const table = ['search', 'battle'].includes(topic.id) ? '' : renderTable(topic.table);
  const body = `<div class="topic-rules">
    ${topic.bullets.length ? `<ul>${topic.bullets.map(text => `<li>${escape(text)}</li>`).join('')}</ul>` : ''}
    ${table}${legend}
    ${topic.warning ? `<p class="rule-warning">${escape(labels.note)}${escape(topic.warning)}</p>` : ''}
    ${(topic.details ?? []).map(detail => {
      const paragraphs = detail.text.split('\n').map(line => `<p>${escape(line)}</p>`).join('');
      return topic.appendix
        ? `<details><summary>${escape(detail.title)}</summary>${paragraphs}</details>`
        : `<div class="rule-subsection"><h4>${escape(detail.title)}</h4>${paragraphs}</div>`;
    }).join('')}
  </div>`;
  return topic.id === 'setup'
    ? `<details class="topic-details"><summary>${escape(labels.appendix)}</summary>${body}</details>`
    : body;
}

function renderCheckpoint(question) {
  return `<div class="rule-check checkpoint" data-check-id="${question.id}">
    <p class="checkpoint-prompt" id="prompt-${question.id}">${escape(question.prompt)}</p>
    <div class="checkpoint-options" role="radiogroup" aria-labelledby="prompt-${question.id}" aria-describedby="feedback-${question.id}">
      ${question.options.map((option, index) => `<label class="checkpoint-option">
        <input type="radio" name="checkpoint-${question.id}" value="${index}" />
        <span>${escape(option)}</span><span class="checkpoint-option-icon" aria-hidden="true"></span>
      </label>`).join('')}
    </div>
    <p class="checkpoint-feedback" id="feedback-${question.id}" aria-live="polite" aria-atomic="true"></p>
  </div>`;
}

function renderExamples(topic) {
  const examples = examplesFor(topic, language);
  const renderFigure = example => `<figure class="rule-example">
    <a href="${asset(example.image)}" target="_blank" rel="noopener">
      <img src="${asset(example.image)}" alt="${escape(example.caption)}" loading="lazy" width="${imageSizes[example.image][0]}" height="${imageSizes[example.image][1]}" />
    </a>
    <figcaption>${escape(example.caption)}
      ${example.steps ? `<ul class="example-steps">${example.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ul>` : ''}
    </figcaption>
  </figure>`;
  // Short, self-contained examples stay visible. Longer demonstrations and
  // battle/advance before-and-after sequences remain together in disclosures.
  const inline = examples.filter(example => inlineExampleImages.has(example.image));
  const supplementary = examples.filter(example => !inlineExampleImages.has(example.image));
  return inline.map(renderFigure).join('') + (supplementary.length
    ? `<details class="rule-examples"><summary>${escape(labels.examples)}${language === 'zh' ? '：' : ': '}${escape(topic.title)}</summary>${supplementary.map(renderFigure).join('')}</details>`
    : '');
}

function renderSection(topic) {
  return `<section class="rule-section" id="${topic.id}">
    <h3 tabindex="-1">${escape(topic.title)}</h3>
    <p>${escape(topic.key)}</p>
    ${renderRules(topic)}
    ${renderExamples(topic)}
    ${questions.filter(question => question.topic === topic.id).map(renderCheckpoint).join('')}
  </section>`;
}

function selectTab(name) {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === name));
}

function openTopic(id, expand = false) {
  const section = document.getElementById(id);
  if (!section) return;
  selectTab('summary');
  if (expand) section.querySelectorAll('details').forEach(detail => { detail.open = true; });
  document.querySelectorAll('#lesson-nav a').forEach(link => {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  section.querySelector('h3')?.focus();
  section.scrollIntoView({block: 'start'});
}

$('#lesson-sections').addEventListener('change', event => {
  const input = event.target.closest('.checkpoint input[type="radio"]');
  if (!input) return;
  const checkpoint = input.closest('.checkpoint');
  const question = questions.find(item => item.id === checkpoint.dataset.checkId);
  const selected = Number(input.value);
  quiz.submit(question.id, selected);
  const correct = selected === question.answer;
  checkpoint.querySelectorAll('.checkpoint-option').forEach(option => {
    const checked = option.querySelector('input').checked;
    option.classList.toggle('correct', checked && correct);
    option.classList.toggle('incorrect', checked && !correct);
    option.querySelector('.checkpoint-option-icon').textContent = checked ? (correct ? '✓' : '✕') : '';
  });
  const feedback = checkpoint.querySelector('.checkpoint-feedback');
  feedback.className = `checkpoint-feedback ${correct ? 'correct' : 'incorrect'}`;
  feedback.textContent = `${correct ? labels.correct : text('incorrect', {answer:question.options[question.answer]})} ${question.explanation}`;
  updateQuizFeedback(checkpoint, correct, {immediate: !event.isTrusted});
});


document.querySelectorAll('[data-tab]').forEach(tab => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));
$('#lesson-nav').addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link) openTopic(link.hash.slice(1));
});
const chat = createRuleChat({
  slug: 'fate-of-the-fellowship', log: $('#chat-log'), form: $('#chat-form'),
  input: $('#question'), button: $('#ask-button'),
  getLabels: () => ({
    intro: language === 'zh' ? `我会依据《${labels.title}》的规则回答问题。` : `I answer questions using the rules for ${labels.title}.`,
    checking: language === 'zh' ? '正在查阅游戏规则…' : 'Checking the game rules…',
  }),
});

function renderAll() {
  const expanded = [...document.querySelectorAll('.rule-section details')].map(detail => detail.open);
  language = getLanguage();
  ({topics, questions} = language === 'zh' ? zh : en);
  labels = copy[language];
  coreTopics = topics.filter(topic => !topic.appendix);
  appendixTopics = topics.filter(topic => !coreTopics.includes(topic));
  document.title = `${labels.title} | Meeple Mentor`;
  document.querySelector('meta[name="description"]').content = labels.description;
  $('.home-link-label').textContent = labels.home.replace(/^<\s*/, '');
  $('.game-title-row h1').textContent = labels.title;
  $('.game-cover-compact').alt = labels.cover;
  $('#game-overview').innerHTML = labels.overview.map(paragraph => `<p class="article-lead">${escape(paragraph)}</p>`).join('');
  $('.rule-menu .eyebrow').textContent = labels.summary;
  $('.rule-menu').setAttribute('aria-label',labels.summary);
  $('.mobile-tabs').setAttribute('aria-label',labels.summary);
  $('#rules-tab').textContent = labels.rules;
  $('#ask-tab').textContent = t('game.askTab');
  chat.refresh();
  $('#lesson-nav').innerHTML = [...coreTopics, ...appendixTopics]
  .map(topic => `<a href="#${topic.id}">${escape(topic.title)}</a>`).join('');
  $('#lesson-sections').innerHTML = coreTopics.map(renderSection).join('') + appendixTopics.map(renderSection).join('');
  initializeQuizFeedback($('#lesson-sections'));


  document.querySelectorAll('.rule-section details').forEach((detail,index) => {detail.open = expanded[index] ?? false;});
  for (const [id, result] of quiz.answers) {
    const input = document.querySelector(`[data-check-id="${id}"] input[value="${result.selected}"]`);
    input.checked = true;
    input.dispatchEvent(new Event('change', {bubbles:true}));
  }
}
setLanguage(language);
renderLanguageMenu($('#language-menu'),renderAll);
renderAll();
if (location.hash) openTopic(location.hash.slice(1));
