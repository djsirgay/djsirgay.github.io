(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const eyebrow = $('.eyebrow');
  if (eyebrow) eyebrow.textContent = 'DJ Sir Gay / Los Angeles / system online';

  const heroText = $('.hero-text');
  if (heroText) heroText.textContent = 'Mashups, narrative DJ sets and pop memories rebuilt by a queer Eastern European artist in exile. Music first. Lore available.';

  const heroActions = $('.hero-actions');
  if (heroActions) heroActions.innerHTML = `
    <a class="button primary" href="#fresh">▶ Play music</a>
    <a class="button" href="#projects">Open project files</a>
    <a class="button" href="#booking">Book DJ Sir Gay</a>`;

  const freshTitle = $('#fresh .section-title h2');
  const freshCopy = $('#fresh .section-title p');
  if (freshTitle) freshTitle.textContent = 'Fresh Releases';
  if (freshCopy) freshCopy.textContent = 'Pick a file, press play, then leave through YouTube or Telegram only when you actually need to.';

  const projectsTitle = $('#projects .section-title h2');
  const projectsCopy = $('#projects .section-title p');
  if (projectsTitle) projectsTitle.textContent = 'Project Files';
  if (projectsCopy) projectsCopy.textContent = 'Four long-form worlds. Play immediately or open the file for the story behind the mix.';

  const freshHint = $('#fresh .swipe-hint');
  if (freshHint) freshHint.textContent = 'playlist';
  const projectsHint = $('#projects .swipe-hint');
  if (projectsHint) projectsHint.textContent = '4 files';
})();
