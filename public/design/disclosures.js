import {initializeQuizFeedback, updateQuizFeedback, resetQuizFeedback} from '../quiz-feedback.js';
import {setLanguage} from '../i18n.js';
setLanguage('zh');
initializeQuizFeedback(document);
const checkpoint = document.querySelector('.checkpoint');
const feedback = document.querySelector('.checkpoint-feedback');
checkpoint.addEventListener('change', event => {
  if (!event.target.matches('input')) return;
  const correct = event.target.value === 'yes';
  checkpoint.querySelectorAll('.checkpoint-option').forEach(option => {
    const checked = option.querySelector('input').checked;
    option.classList.toggle('correct', checked && correct);
    option.classList.toggle('incorrect', checked && !correct);
  });
  feedback.className = `checkpoint-feedback ${correct ? 'correct' : 'incorrect'}`;
  feedback.textContent = correct ? '答对了。任何状态下都可手动展开或收起。' : '任何状态下都可手动收起，答案和解释会保留。';
  updateQuizFeedback(checkpoint, correct);
});
document.querySelector('#reset').addEventListener('click', () => {
  checkpoint.querySelectorAll('input').forEach(input => { input.checked = false; });
  checkpoint.querySelectorAll('.checkpoint-option').forEach(option => option.classList.remove('correct', 'incorrect'));
  feedback.textContent = '';
  resetQuizFeedback(document);
});
