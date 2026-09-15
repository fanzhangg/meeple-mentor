import {getLanguage} from './i18n.js';

// Keep the long contents list out of the reading flow on smaller screens.
// Native details/summary still works when this enhancement is unavailable.
const contents = document.querySelector('.rule-menu');
const wideLayout = matchMedia('(min-width: 80rem)');
let navigatedSection = null;

if (contents) {
  const syncContents = () => { contents.open = wideLayout.matches || Boolean(contents.closest('.contents-dialog')); };
  syncContents();
  wideLayout.addEventListener('change', syncContents);
  contents.addEventListener('click', event => {
    const link = event.target.closest('nav a');
    if (!link) return;
    if (!wideLayout.matches && !contents.closest('.contents-dialog')) contents.open = false;
    // Collapse before scrolling, so the removed menu height cannot shift the target.
    const section = document.getElementById(link.hash.slice(1));
    if (section) {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      section.querySelector('h3')?.focus({preventScroll: true});
      section.scrollIntoView({block: 'start'});
      // Near the page end a short section cannot reach the reading line.
      // Keep an explicitly chosen section current until the reader scrolls.
      navigatedSection = {id: section.id, y: scrollY};
      updateCurrentSection();
    }
  });
}

// Move the existing panels into native mobile dialogs, preserving state and listeners.
const desktopLayout = matchMedia('(min-width: 60rem)');
function createMobilePopup(panel, kind, labels, icon) {
  if (!panel || typeof window.HTMLDialogElement?.prototype.showModal !== 'function') return null;
  const anchor = document.createComment(`Desktop ${kind} position`);
  panel.before(anchor);
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = `guide-launcher ${kind}-launcher`;
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', `rules-${kind}-dialog`);
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = icon;

  const dialog = document.createElement('dialog');
  dialog.id = `rules-${kind}-dialog`;
  dialog.className = `guide-dialog ${kind}-dialog`;
  dialog.setAttribute('aria-labelledby', `rules-${kind}-title`);
  dialog.innerHTML = `<header class="guide-dialog-header"><h2 id="rules-${kind}-title"></h2><button class="guide-dialog-close" type="button" autofocus><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></header>`;
  const title = dialog.querySelector('h2');
  const closeButton = dialog.querySelector('button');
  document.body.append(launcher, dialog);

  function updateLabels() {
    const chinese = getLanguage() === 'zh';
    const [heading, closeLabel] = labels[chinese ? 'zh' : 'en'];
    title.textContent = heading;
    launcher.setAttribute('aria-label', title.textContent);
    launcher.title = title.textContent;
    closeButton.setAttribute('aria-label', closeLabel);
  }
  updateLabels();
  new MutationObserver(updateLabels).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});

  let readingPosition = null;
  function fitViewport() {
    if (!dialog.open) return;
    const viewport = window.visualViewport;
    dialog.style.setProperty('--guide-viewport-height', `${viewport?.height ?? innerHeight}px`);
    dialog.style.setProperty('--guide-viewport-top', `${viewport?.offsetTop ?? 0}px`);
  }
  function restoreReadingPosition() {
    if (!readingPosition) return;
    document.body.classList.remove('guide-popup-open');
    document.body.style.removeProperty('--guide-page-top');
    document.body.style.removeProperty('--guide-page-width');
    window.scrollTo(readingPosition.x, readingPosition.y);
    readingPosition = null;
    launcher.setAttribute('aria-expanded', 'false');
  }
  function closePopup() {
    dialog.close();
    restoreReadingPosition();
    if (!desktopLayout.matches) launcher.focus({preventScroll: true});
  }
  launcher.addEventListener('click', () => {
    if (desktopLayout.matches || dialog.open) return;
    updateCurrentSection();
    readingPosition = {x: scrollX, y: scrollY};
    document.body.style.setProperty('--guide-page-top', `${-readingPosition.y}px`);
    document.body.style.setProperty('--guide-page-width', `${document.body.getBoundingClientRect().width}px`);
    document.body.classList.add('guide-popup-open');
    dialog.showModal();
    launcher.setAttribute('aria-expanded', 'true');
    fitViewport();
    // Focus the close control, leaving the software keyboard closed until typing.
    closeButton.focus({preventScroll: true});
    if (panel === contents) {
      const current = panel.querySelector('a[aria-current="location"]');
      if (current) {
        panel.scrollTop += current.getBoundingClientRect().top - panel.getBoundingClientRect().top
          - (panel.clientHeight - current.offsetHeight) / 2;
      }
    }
  });
  closeButton.addEventListener('click', closePopup);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closePopup(); });
  dialog.addEventListener('close', () => { if (!dialog.open) restoreReadingPosition(); });
  const outsideDialog = event => {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = outsideDialog(event); });
  dialog.addEventListener('click', event => {
    if (backdropPress && outsideDialog(event)) closePopup();
    backdropPress = false;
  });
  window.visualViewport?.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('scroll', fitViewport);

  function syncPanelLayout() {
    if (desktopLayout.matches) {
      if (dialog.open) closePopup();
      anchor.after(panel);
    } else {
      dialog.append(panel);
    }
    if (panel === contents) contents.open = !desktopLayout.matches || wideLayout.matches;
  }
  syncPanelLayout();
  desktopLayout.addEventListener('change', syncPanelLayout);
  document.body.classList.add(`${kind}-popup-ready`);
  return {dialog, close: closePopup};
}

createMobilePopup(document.querySelector('.game-chat'), 'chat', {
  zh: ['规则提问', '关闭提问窗口'],
  en: ['Ask about the rules', 'Close rules chat'],
}, '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H8l-5 3V8a4 4 0 0 1 4-4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="11" r="1" fill="currentColor"/><circle cx="12" cy="11" r="1" fill="currentColor"/><circle cx="16" cy="11" r="1" fill="currentColor"/></svg>');

const contentsPopup = createMobilePopup(contents, 'contents', {
  zh: ['规则目录', '关闭目录'],
  en: ['Contents', 'Close contents'],
}, '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M9 6h12M9 12h12M9 18h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>');

// Release modal focus and restore the page before game-specific navigation runs.
contentsPopup?.dialog.addEventListener('click', event => {
  if (event.target.closest('nav a')) contentsPopup.close();
}, {capture: true});

// Track the section crossing the upper reading area, without changing the URL
// or moving keyboard focus. Freeze while a modal locks the background page.
let sectionLinks = [];
let sectionFrame = 0;
function updateCurrentSection() {
  if (document.body.classList.contains('guide-popup-open')) return;
  const readingLine = Math.min(120, innerHeight * .2);
  const visibleSections = sectionLinks.filter(({section}) => section.getClientRects().length);
  let current = null;
  for (const entry of visibleSections) {
    if (entry.section.getBoundingClientRect().top <= readingLine) current = entry;
    else break;
  }
  const last = visibleSections.at(-1);
  if (last && scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2
      && last.section.getBoundingClientRect().top < innerHeight) current = last;
  if (navigatedSection && Math.abs(scrollY - navigatedSection.y) <= 2) {
    current = visibleSections.find(({section}) => section.id === navigatedSection.id) ?? current;
  } else {
    navigatedSection = null;
  }
  for (const entry of sectionLinks) {
    if (entry === current) entry.link.setAttribute('aria-current', 'location');
    else entry.link.removeAttribute('aria-current');
  }
}
function scheduleSectionUpdate() {
  if (sectionFrame) return;
  sectionFrame = requestAnimationFrame(() => {
    sectionFrame = 0;
    updateCurrentSection();
  });
}
function refreshSectionLinks() {
  sectionLinks = [...(contents?.querySelectorAll('nav a[href^="#"]') ?? [])]
    .map(link => ({link, section: document.getElementById(link.hash.slice(1))}))
    .filter(({section}) => section);
  scheduleSectionUpdate();
}
const article = document.querySelector('.rule-article');
if (contents && article) {
  refreshSectionLinks();
  const contentObserver = new MutationObserver(refreshSectionLinks);
  contentObserver.observe(contents.querySelector('nav'), {childList: true, subtree: true});
  contentObserver.observe(article, {childList: true, subtree: true});
  new ResizeObserver(scheduleSectionUpdate).observe(article);
  window.addEventListener('scroll', scheduleSectionUpdate, {passive: true});
  window.addEventListener('resize', scheduleSectionUpdate);
  window.addEventListener('hashchange', scheduleSectionUpdate);
}
