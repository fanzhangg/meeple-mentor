// Keep the long contents list out of the reading flow on smaller screens.
// Native details/summary still works when this enhancement is unavailable.
const contents = document.querySelector('.rule-menu');
const wideLayout = matchMedia('(min-width: 80rem)');

if (contents) {
  const syncContents = () => { contents.open = wideLayout.matches; };
  syncContents();
  wideLayout.addEventListener('change', syncContents);
  contents.addEventListener('click', event => {
    const link = event.target.closest('nav a');
    if (!link || wideLayout.matches) return;
    contents.open = false;
    // Collapse before scrolling, so the removed menu height cannot shift the target.
    const section = document.getElementById(link.hash.slice(1));
    if (section) {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      section.querySelector('h3')?.focus({preventScroll: true});
      section.scrollIntoView({block: 'start'});
    }
  });
}
