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

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-video]')) return;
    setTimeout(() => { document.body.style.overflow = ''; }, 0);
  }, true);

  const loadPolish = () => {
    if (!document.querySelector('link[data-desktop-polish]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/desktop-polish.css?v=20260810-2';
      css.dataset.desktopPolish = '1';
      document.head.appendChild(css);
    }
    if (!document.querySelector('script[data-desktop-polish]')) {
      const js = document.createElement('script');
      js.src = '/desktop-polish.js?v=20260814-5';
      js.dataset.desktopPolish = '1';
      document.body.appendChild(js);
    }
  };

  const launchDesktop = () => {
    if (!document.querySelector('link[data-desktop-reality]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/desktop-reality.css?v=20260819-1';
      css.dataset.desktopReality = '1';
      document.head.appendChild(css);
    }
    if (!document.querySelector('script[data-desktop-reality]')) {
      const js = document.createElement('script');
      js.src = '/desktop-reality.js?v=20260819-1';
      js.dataset.desktopReality = '1';
      js.addEventListener('load', loadPolish, { once:true });
      document.body.appendChild(js);
    } else {
      loadPolish();
    }
  };

  if ($('#djsg-paint-launch')) {
    launchDesktop();
  } else {
    const apps = document.querySelector('script[data-djsg-apps]');
    if (apps) apps.addEventListener('load', launchDesktop, { once:true });
    setTimeout(launchDesktop, 900);
  }
})();
