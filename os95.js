(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const svgIcon = type => {
    const icons = {
      computer: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="3" width="25" height="18" fill="#c0c0c0" stroke="#fff"/><rect x="5" y="5" width="21" height="14" fill="#000080" stroke="#000"/><rect x="10" y="22" width="12" height="3" fill="#808080"/><rect x="7" y="25" width="18" height="3" fill="#c0c0c0" stroke="#000"/><rect x="8" y="7" width="3" height="2" fill="#00ffff"/></svg>`,
      music: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="22" fill="#c0c0c0" stroke="#000"/><rect x="6" y="7" width="20" height="7" fill="#001000"/><rect x="8" y="9" width="12" height="3" fill="#00ff00"/><rect x="7" y="18" width="3" height="3" fill="#000"/><rect x="12" y="18" width="3" height="3" fill="#000"/><rect x="17" y="18" width="3" height="3" fill="#000"/><rect x="22" y="18" width="3" height="3" fill="#000"/></svg>`,
      folder: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9h10l2 3h14v15H3z" fill="#ffd633" stroke="#000"/><path d="M4 7h10l2 3H4z" fill="#ffe979" stroke="#000"/><rect x="5" y="14" width="22" height="11" fill="#f5c400"/></svg>`,
      document: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 3h14l5 5v21H7z" fill="#fff" stroke="#000"/><path d="M21 3v6h6" fill="#c0c0c0" stroke="#000"/><rect x="10" y="12" width="13" height="2" fill="#000080"/><rect x="10" y="16" width="11" height="2" fill="#808080"/><rect x="10" y="20" width="13" height="2" fill="#808080"/></svg>`,
      mail: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="7" width="26" height="19" fill="#fff" stroke="#000"/><path d="M4 8l12 10L28 8" fill="#c0c0c0" stroke="#000"/><path d="M4 25l9-9M28 25l-9-9" stroke="#808080"/></svg>`,
      trash: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 9h17l-2 20H10z" fill="#e7e7e7" stroke="#000"/><rect x="6" y="6" width="21" height="4" fill="#c0c0c0" stroke="#000"/><rect x="12" y="3" width="9" height="3" fill="#808080" stroke="#000"/><path d="M13 13v12M17 13v12M21 13v12" stroke="#808080"/></svg>`,
      card: `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="3" width="18" height="26" rx="1" fill="#fff" stroke="#000"/><text x="10" y="15" font-size="11" fill="#c00000" font-family="serif">♥</text><text x="17" y="25" font-size="9" fill="#c00000" font-family="serif">A</text></svg>`
    };
    return icons[type] || icons.document;
  };

  const scrollToTarget = target => {
    const node = typeof target === 'string' ? $(target) : target;
    if (!node) return;
    const taskbar = 44;
    const y = node.getBoundingClientRect().top + scrollY - taskbar - 10;
    scrollTo({ top: Math.max(0, y), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const shortcuts = document.createElement('nav');
  shortcuts.className = 'os95-shortcuts';
  shortcuts.setAttribute('aria-label', 'DJ Sir Gay.exe desktop shortcuts');
  shortcuts.innerHTML = [
    ['music', '#fresh', 'Fresh Releases'],
    ['folder', '#projects', 'Project Files'],
    ['document', '#voice', 'Public Record'],
    ['mail', '#booking', 'Book DJ Sir Gay'],
    ['computer', '#top', 'DJ Sir Gay.exe'],
    ['trash', '#site-footer', 'Recycle Bin']
  ].map(([icon, href, label]) => `<a class="os95-shortcut" href="${href}" data-os-target="${href}">${svgIcon(icon)}<span>${label}</span></a>`).join('');
  document.body.prepend(shortcuts);

  shortcuts.addEventListener('click', event => {
    const shortcut = event.target.closest('[data-os-target]');
    if (!shortcut) return;
    event.preventDefault();
    scrollToTarget(shortcut.dataset.osTarget);
    pulseGlitch();
  });

  const taskbar = document.createElement('div');
  taskbar.className = 'os95-taskbar';
  taskbar.innerHTML = `
    <button class="os95-start-btn" type="button" id="os95-start-btn" aria-expanded="false" aria-controls="os95-start-menu">
      <span class="os95-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>Start</strong>
    </button>
    <div class="os95-task-items">
      <a class="os95-task-btn" href="#fresh" data-os-target="#fresh">♫ DJSGAMP</a>
      <a class="os95-task-btn" href="#projects" data-os-target="#projects">▣ Project Files</a>
      <a class="os95-task-btn" href="#voice" data-os-target="#voice">▤ Public Record</a>
      <a class="os95-task-btn" href="#booking" data-os-target="#booking">✉ Booking</a>
    </div>
    <div class="os95-tray"><span class="os95-tray-dot" title="signal online"></span><span id="os95-clock">--:--</span></div>`;
  document.body.append(taskbar);

  const startMenu = document.createElement('div');
  startMenu.id = 'os95-start-menu';
  startMenu.className = 'os95-start-menu';
  startMenu.innerHTML = `
    <div class="os95-start-rail">DJ Sir Gay.exe</div>
    <div class="os95-start-links">
      <a href="#fresh" data-os-target="#fresh"><span class="os95-menu-glyph">♫</span><span><strong>Programs</strong><br>Fresh Releases</span></a>
      <a href="#projects" data-os-target="#projects"><span class="os95-menu-glyph">📁</span><span><strong>Project Files</strong><br>Open archive</span></a>
      <a href="#voice" data-os-target="#voice"><span class="os95-menu-glyph">▤</span><span><strong>Documents</strong><br>Public Record</span></a>
      <a href="#booking" data-os-target="#booking"><span class="os95-menu-glyph">✉</span><span><strong>Booking Wizard</strong><br>Put me in the room</span></a>
      <hr>
      <button type="button" id="os95-solitaire"><span class="os95-menu-glyph">♥</span><span><strong>Solitaire.exe</strong><br>Totally work-related</span></button>
      <a href="https://soundcloud.com/djsirgay" target="_blank" rel="noreferrer"><span class="os95-menu-glyph">▶</span><span>SoundCloud</span></a>
      <a href="https://www.youtube.com/@NostalgAiRec" target="_blank" rel="noreferrer"><span class="os95-menu-glyph">▸</span><span>YouTube</span></a>
      <a href="https://instagram.com/djsirgay" target="_blank" rel="noreferrer"><span class="os95-menu-glyph">◎</span><span>Instagram</span></a>
      <hr>
      <button type="button" id="os95-shutdown"><span class="os95-menu-glyph">⏻</span><span><strong>Shut Down...</strong></span></button>
    </div>`;
  document.body.append(startMenu);

  const startBtn = $('#os95-start-btn');
  const setStartMenu = open => {
    startMenu.classList.toggle('open', open);
    startBtn.setAttribute('aria-expanded', String(open));
  };
  startBtn.addEventListener('click', event => {
    event.stopPropagation();
    setStartMenu(!startMenu.classList.contains('open'));
  });
  startMenu.addEventListener('click', event => {
    const target = event.target.closest('[data-os-target]');
    if (target) {
      event.preventDefault();
      scrollToTarget(target.dataset.osTarget);
      setStartMenu(false);
    }
  });
  document.addEventListener('click', event => {
    if (!startMenu.contains(event.target) && event.target !== startBtn) setStartMenu(false);
  });

  taskbar.addEventListener('click', event => {
    const target = event.target.closest('[data-os-target]');
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target.dataset.osTarget);
  });

  const clock = $('#os95-clock');
  const updateClock = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  updateClock();
  setInterval(updateClock, 1000 * 20);

  const showDialog = ({ title = 'DJ Sir Gay.exe', heading = 'System message', text = '', button = 'OK' } = {}) => {
    $('.os95-dialog-layer')?.remove();
    const layer = document.createElement('div');
    layer.className = 'os95-dialog-layer';
    layer.innerHTML = `<div class="os95-dialog" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="os95-dialog-title">${title}</div>
      <div class="os95-dialog-body"><div class="os95-warning-icon">!</div><div><h2>${heading}</h2><p>${text}</p></div></div>
      <div class="os95-dialog-actions"><button type="button" class="os95-dialog-btn default">${button}</button></div>
    </div>`;
    document.body.append(layer);
    const close = () => layer.remove();
    $('.os95-dialog-btn', layer).focus();
    $('.os95-dialog-btn', layer).addEventListener('click', close);
    layer.addEventListener('click', event => { if (event.target === layer) close(); });
    return layer;
  };

  const launchSolitaireTrail = () => {
    if (reducedMotion) return;
    const suits = ['♥','♠','♦','♣'];
    const values = ['A','7','Q','K','10'];
    const count = innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const card = document.createElement('div');
        const suit = suits[i % suits.length];
        card.className = `os95-card-trail ${suit === '♥' || suit === '♦' ? 'red' : 'black'}`;
        card.textContent = `${values[i % values.length]}${suit}`;
        card.style.left = `${18 + Math.random() * Math.max(80, innerWidth * .3)}px`;
        card.style.top = `${35 + Math.random() * 100}px`;
        card.style.setProperty('--dx', `${(Math.random() * .7 + .2) * innerWidth}px`);
        card.style.setProperty('--dy', `${(Math.random() * .65 + .35) * innerHeight}px`);
        card.style.setProperty('--rot', `${Math.round(Math.random() * 160 - 80)}deg`);
        document.body.append(card);
        setTimeout(() => card.remove(), 1250);
      }, i * 42);
    }
  };

  function pulseGlitch() {
    if (reducedMotion || document.body.classList.contains('os95-glitch')) return;
    document.body.classList.add('os95-glitch');
    setTimeout(() => document.body.classList.remove('os95-glitch'), 450);
  }

  $('#os95-solitaire').addEventListener('click', () => {
    setStartMenu(false);
    launchSolitaireTrail();
  });
  $('#os95-shutdown').addEventListener('click', () => {
    setStartMenu(false);
    showDialog({
      title: 'Shut Down Windows',
      heading: 'DJ Sir Gay.exe cannot be shut down.',
      text: 'The program is still transmitting. Censorship failed successfully.',
      button: 'Fine.'
    });
  });

  // Startup dialog: familiar software warning, but the contents explain the project.
  let bootSeen = false;
  try { bootSeen = sessionStorage.getItem('djsg-exe-booted') === '1'; } catch (_) {}
  if (!bootSeen) {
    const startup = document.createElement('div');
    startup.className = 'os95-startup';
    startup.innerHTML = `<div class="os95-dialog" role="dialog" aria-modal="true" aria-labelledby="os95-boot-title">
      <div class="os95-dialog-title">Open File — Security Warning</div>
      <div class="os95-dialog-body">
        <div class="os95-warning-icon">!</div>
        <div>
          <h2 id="os95-boot-title">Do you want to run DJ Sir Gay.exe?</h2>
          <p><strong>Publisher:</strong> Unknown / self-authorized<br><strong>Type:</strong> Personal operating system<br><strong>Location:</strong> Los Angeles, CA</p>
          <p>This program may contain:</p>
          <ul><li>queer content</li><li>Eastern European pop memory</li><li>unauthorized opinions</li><li>extremely serious transitions</li></ul>
        </div>
      </div>
      <div class="os95-dialog-actions">
        <button type="button" class="os95-dialog-btn default" id="os95-run">Run anyway</button>
        <button type="button" class="os95-dialog-btn" id="os95-cancel">Cancel</button>
      </div>
    </div>`;
    document.body.append(startup);
    const run = $('#os95-run');
    run.focus();
    run.addEventListener('click', () => {
      startup.remove();
      try { sessionStorage.setItem('djsg-exe-booted', '1'); } catch (_) {}
      launchSolitaireTrail();
      setTimeout(pulseGlitch, 220);
    });
    $('#os95-cancel').addEventListener('click', () => {
      showDialog({
        title: 'DJ Sir Gay.exe',
        heading: 'Cancel is not available.',
        text: 'The file has already reclaimed its name. Your safest option is “Run anyway”.',
        button: 'Oh well.'
      });
    });
  }

  // Change section copy that belongs to the new operating-system metaphor.
  const freshTitle = $('#fresh .section-title h2');
  const freshCopy = $('#fresh .section-title p');
  if (freshTitle) freshTitle.textContent = 'Now playing / questionable';
  if (freshCopy) freshCopy.textContent = 'A live playlist read from YouTube. Swipe it like a media library; vertical scrolling stays native.';

  const projectsTitle = $('#projects .section-title h2');
  if (projectsTitle) projectsTitle.textContent = 'Project Files';
  const projectsCopy = $('#projects .section-title p');
  if (projectsCopy) projectsCopy.textContent = 'Four executable worlds. Open the file, play the evidence, or inspect what happened inside.';

  const voiceChannel = $('#voice .channel');
  if (voiceChannel) voiceChannel.textContent = 'My Documents / Public Record';

  const bookingChannel = $('#booking .channel');
  if (bookingChannel) bookingChannel.textContent = 'Booking Wizard / Step 1 of 1';

  // Occasional, restrained old-computer corruption when a program window is opened from navigation.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (Math.random() > .7) setTimeout(pulseGlitch, 180);
    });
  });
})();
