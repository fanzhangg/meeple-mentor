const animations = new WeakMap();
let nextId = 0;

export function createDisclosureIcon() {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  icon.classList.add('disclosure-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  for (const [name, value] of Object.entries({d: 'm6 9 6 6 6-6', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'})) path.setAttribute(name, value);
  icon.append(path);
  return icon;
}

// Both native details and quiz cards share this reversible height transition.
export function setDisclosureExpanded(root, expanded, {animate = false} = {}) {
  const trigger = root.querySelector(':scope > .disclosure-trigger');
  const body = root.querySelector(':scope > .disclosure-body');
  const previousHeight = root.getBoundingClientRect().height;
  animations.get(root)?.cancel();
  animations.delete(root);
  body.getAnimations().forEach(effect => effect.cancel());
  const moveFocus = !expanded && body.contains(document.activeElement);
  const native = root.tagName === 'DETAILS';
  if (native) root.open = true;
  root.dataset.disclosureExpanded = String(expanded);
  trigger.setAttribute('aria-expanded', String(expanded));
  body.hidden = !expanded;
  body.inert = !expanded;
  body.setAttribute('aria-hidden', String(!expanded));
  if (moveFocus) trigger.focus({preventScroll: true});
  const finish = () => {
    body.hidden = !expanded;
    if (native) root.open = expanded;
    body.getAnimations().forEach(effect => effect.cancel());
  };
  if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }
  const nextHeight = root.getBoundingClientRect().height;
  const tokens = getComputedStyle(root);
  const duration = Number.parseFloat(tokens.getPropertyValue('--disclosure-duration')) || 320;
  const easing = tokens.getPropertyValue('--disclosure-easing').trim() || 'ease-out';
  body.hidden = false;
  body.animate([{opacity: expanded ? 0 : 1}, {opacity: expanded ? 1 : 0}], {
    duration: duration * (expanded ? .8 : .55), fill: 'forwards', easing: 'ease-out',
  });
  const animation = root.animate([
    {height: `${previousHeight}px`, overflow: 'hidden'},
    {height: `${nextHeight}px`, overflow: 'hidden'},
  ], {duration, easing});
  animations.set(root, animation);
  animation.finished.then(() => {
    if (animations.get(root) !== animation) return;
    finish();
    animations.delete(root);
  }).catch(() => {});
}

export function initializeDisclosures(container) {
  container.querySelectorAll('.rule-section details:not(.ui-disclosure)').forEach(root => {
    const trigger = root.querySelector(':scope > summary');
    if (!trigger) return;
    const expanded = root.open;
    root.classList.add('ui-disclosure');
    trigger.classList.add('disclosure-trigger');
    const title = document.createElement('span');
    title.className = 'disclosure-title';
    title.append(...trigger.childNodes);
    trigger.append(title, createDisclosureIcon());
    const body = document.createElement('div');
    body.className = 'disclosure-body';
    body.id = `disclosure-content-${++nextId}`;
    body.append(...[...root.childNodes].filter(node => node !== trigger));
    root.append(body);
    trigger.setAttribute('aria-controls', body.id);
    setDisclosureExpanded(root, expanded);
    trigger.addEventListener('click', event => {
      event.preventDefault();
      setDisclosureExpanded(root, root.dataset.disclosureExpanded !== 'true', {animate: true});
    });
    // Guide navigation and language restoration may change native open directly.
    root.addEventListener('toggle', () => {
      if (!animations.has(root) && root.open !== (root.dataset.disclosureExpanded === 'true')) {
        setDisclosureExpanded(root, root.open);
      }
    });
  });
}
