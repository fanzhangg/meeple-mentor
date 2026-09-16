import {renderLanguageMenu} from '../i18n.js';
renderLanguageMenu(document.querySelector('#demo-language'));
const input = document.querySelector('#demo-input');
const send = document.querySelector('#demo-send');
input.addEventListener('input', () => { send.disabled = !input.value.trim(); });
document.querySelector('#demo-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!input.value.trim()) return;
  document.querySelector('#demo-status').textContent = '已完成演示。输入清空后，发送按钮恢复禁用状态。';
  input.value = ''; send.disabled = true;
});
const toggle = document.querySelector('#demo-toggle');
toggle.addEventListener('click', () => {
  const selected = toggle.getAttribute('aria-pressed') !== 'true';
  toggle.setAttribute('aria-pressed', String(selected));
  toggle.textContent = selected ? '已选中' : '未选中';
});
