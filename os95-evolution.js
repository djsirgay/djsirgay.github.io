(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Never make a visitor authorize a fake executable. Keep .exe as identity, not risk language.
  $('.os95-startup')?.remove();
  try { sessionStorage.setItem('djsg-exe-booted', '1'); } catch (_) {}

  const showFriendlyBoot = () => {
    let seen = false;
    try { seen = sessionStorage.getItem('djsg-friendly-boot-v1') === '1'; } catch (_) {}
    if (seen) return;

    const boot = document.createElement('div');
    boot.className = 'djsg-boot-screen';
    boot.setAttribute('aria-hidden', 'true');
    boot.innerHTML = `<div class="djsg-boot-panel">
      <span class="djsg-boot-mark"><i></i><i></i><i></i><i></i></span>
      <h1 class="djsg-boot-title">DJ Sir Gay 95</h1>
      <p class="djsg-boot-sub">Starting DJ Sir Gay.exe<br>Personal operating system / Los Angeles</p>
      <div class="djsg-boot-track"><span class="djsg-boot-bar"></span></div>
      <p class="djsg-boot-status">Loading music… memory… questionable decisions…</p>
    </div>`;
    document.body.append(boot);

    const finish = () => {
      if (!boot.isConnected) return;
      boot.classList.add('done');
      try { sessionStorage.setItem('djsg-friendly-boot-v1', '1'); } catch (_) {}
      setTimeout(() => boot.remove(), 320);
    };
    setTimeout(finish, reducedMotion ? 180 : 1320);
    boot.addEventListener('click', finish, { once: true });
  };

  showFriendlyBoot();

  // The slogan becomes a piece of hardware: a system-status LED in the main program window.
  const signalCard = $('.signal-card');
  if (signalCard && !$('.djsg-led', signalCard)) {
    const led = document.createElement('div');
    led.className = 'djsg-led';
    led.setAttribute('aria-label', 'Stay fucking strong. Signal online.');
    led.innerHTML = '<span class="djsg-led-track">STAY F*CKING STRONG&nbsp;&nbsp;•&nbsp;&nbsp;SIGNAL ONLINE&nbsp;&nbsp;•&nbsp;&nbsp;MUSIC WITHOUT LIMITS&nbsp;&nbsp;•&nbsp;&nbsp;CENSORSHIP FAILED SUCCESSFULLY&nbsp;&nbsp;•&nbsp;&nbsp;</span>';
    const footer = $('footer', signalCard);
    signalCard.insertBefore(led, footer || null);
  }

  const dogSvg = `<svg viewBox="0 0 32 32" aria-hidden="true">
    <rect x="8" y="8" width="16" height="15" fill="#d9b38c" stroke="#000"/>
    <rect x="5" y="6" width="7" height="10" fill="#8a5b3c" stroke="#000"/>
    <rect x="20" y="6" width="7" height="10" fill="#8a5b3c" stroke="#000"/>
    <rect x="11" y="12" width="3" height="3" fill="#000"/><rect x="19" y="12" width="3" height="3" fill="#000"/>
    <rect x="15" y="16" width="3" height="3" fill="#000"/><rect x="13" y="20" width="7" height="2" fill="#7b0000"/>
    <rect x="9" y="23" width="5" height="5" fill="#d9b38c" stroke="#000"/><rect x="19" y="23" width="5" height="5" fill="#d9b38c" stroke="#000"/>
  </svg>`;

  const scrollToProgram = selector => {
    const node = $(selector);
    if (!node) return;
    const y = node.getBoundingClientRect().top + scrollY - 50;
    scrollTo({ top: Math.max(0, y), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const showHelper = () => {
    let dismissed = false;
    try { dismissed = localStorage.getItem('djsg-help-dog-dismissed') === '1'; } catch (_) {}
    if (dismissed || $('.djsg-helper')) return;

    const helper = document.createElement('aside');
    helper.className = 'djsg-helper';
    helper.setAttribute('aria-label', 'HELP.DOG assistant');
    helper.innerHTML = `<div class="djsg-helper-dog">${dogSvg}</div><div>
      <strong>HELP.DOG</strong>
      <p>Hi. I was hired to help. I mostly know where the music is.</p>
      <div class="djsg-helper-actions">
        <button type="button" data-help="#fresh">Play something</button>
        <button type="button" data-help="#projects">Project files</button>
        <button type="button" data-help-close>Leave me alone</button>
      </div>
    </div>`;
    document.body.append(helper);

    helper.addEventListener('click', event => {
      const nav = event.target.closest('[data-help]');
      if (nav) scrollToProgram(nav.dataset.help);
      if (event.target.closest('[data-help-close]')) {
        helper.remove();
        try { localStorage.setItem('djsg-help-dog-dismissed', '1'); } catch (_) {}
      }
    });
  };

  setTimeout(showHelper, reducedMotion ? 350 : 1950);

  // Add one actual game, but keep it inside Start > Games so core content stays clean.
  const startLinks = $('.os95-start-links');
  if (startLinks && !$('#djsg-minesweeper-launch')) {
    const solitaire = $('#os95-solitaire');
    const mineButton = document.createElement('button');
    mineButton.type = 'button';
    mineButton.id = 'djsg-minesweeper-launch';
    mineButton.innerHTML = '<span class="os95-menu-glyph">💣</span><span><strong>Minesweeper.exe</strong><br>10 mines / no productivity</span>';
    solitaire?.insertAdjacentElement('afterend', mineButton);
    mineButton.addEventListener('click', openMinesweeper);
  }

  function openMinesweeper() {
    $('#os95-start-menu')?.classList.remove('open');
    $('#os95-start-btn')?.setAttribute('aria-expanded', 'false');
    $('.djsg-game-window')?.remove();

    const size = 9;
    const mineCount = 10;
    let mines = new Set();
    let opened = new Set();
    let flags = new Set();
    let generated = false;
    let ended = false;
    let flagMode = false;

    const win = document.createElement('section');
    win.className = 'djsg-game-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Minesweeper.exe');
    win.innerHTML = `<div class="djsg-game-title">Minesweeper.exe <button class="djsg-game-close" type="button" aria-label="Close">×</button></div>
      <div class="djsg-game-toolbar">
        <div class="djsg-mine-counter">010</div>
        <button class="djsg-game-face" type="button" title="New game">🙂</button>
        <button class="djsg-flag-mode" type="button">🚩 Flag: off</button>
      </div>
      <div class="djsg-mines" role="grid" aria-label="Minesweeper board"></div>
      <p class="djsg-game-status">Reveal every safe square. On touch screens, use Flag mode.</p>`;
    document.body.append(win);

    const board = $('.djsg-mines', win);
    const counter = $('.djsg-mine-counter', win);
    const face = $('.djsg-game-face', win);
    const flagButton = $('.djsg-flag-mode', win);
    const status = $('.djsg-game-status', win);

    const cells = [];
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'djsg-cell';
      cell.dataset.index = String(i);
      cell.setAttribute('aria-label', `Cell ${i + 1}`);
      board.append(cell);
      cells.push(cell);
    }

    const neighbors = index => {
      const row = Math.floor(index / size);
      const col = index % size;
      const result = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) result.push(r * size + c);
      }
      return result;
    };

    const generate = safeIndex => {
      mines = new Set();
      const forbidden = new Set([safeIndex, ...neighbors(safeIndex)]);
      const candidates = Array.from({ length: size * size }, (_, i) => i).filter(i => !forbidden.has(i));
      while (mines.size < mineCount && candidates.length) {
        const pick = Math.floor(Math.random() * candidates.length);
        mines.add(candidates.splice(pick, 1)[0]);
      }
      generated = true;
    };

    const updateCounter = () => {
      counter.textContent = String(Math.max(0, mineCount - flags.size)).padStart(3, '0');
    };

    const reveal = index => {
      if (ended || flags.has(index) || opened.has(index)) return;
      if (!generated) generate(index);
      if (mines.has(index)) {
        ended = true;
        cells[index].classList.add('open', 'mine');
        cells[index].textContent = '💣';
        mines.forEach(i => { cells[i].classList.add('open', 'mine'); cells[i].textContent = '💣'; });
        face.textContent = '😵';
        status.textContent = 'Fatal exception. Press the face to reboot your career.';
        return;
      }

      opened.add(index);
      const cell = cells[index];
      cell.classList.add('open');
      const number = neighbors(index).filter(i => mines.has(i)).length;
      if (number) {
        cell.textContent = String(number);
        cell.classList.add(`n${number}`);
      } else {
        neighbors(index).forEach(reveal);
      }

      if (opened.size === size * size - mineCount) {
        ended = true;
        face.textContent = '😎';
        status.textContent = 'Censorship cleared. All safe squares remain visible.';
      }
    };

    const toggleFlag = index => {
      if (ended || opened.has(index)) return;
      if (flags.has(index)) {
        flags.delete(index);
        cells[index].classList.remove('flagged');
        cells[index].textContent = '';
      } else if (flags.size < mineCount) {
        flags.add(index);
        cells[index].classList.add('flagged');
        cells[index].textContent = '🚩';
      }
      updateCounter();
    };

    board.addEventListener('click', event => {
      const cell = event.target.closest('.djsg-cell');
      if (!cell) return;
      const index = Number(cell.dataset.index);
      flagMode ? toggleFlag(index) : reveal(index);
    });
    board.addEventListener('contextmenu', event => {
      const cell = event.target.closest('.djsg-cell');
      if (!cell) return;
      event.preventDefault();
      toggleFlag(Number(cell.dataset.index));
    });
    flagButton.addEventListener('click', () => {
      flagMode = !flagMode;
      flagButton.classList.toggle('active', flagMode);
      flagButton.textContent = `🚩 Flag: ${flagMode ? 'on' : 'off'}`;
    });
    face.addEventListener('click', openMinesweeper);
    $('.djsg-game-close', win).addEventListener('click', () => win.remove());
  }
})();
