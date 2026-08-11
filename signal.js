(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DJ Sir Gay.exe is the final visual layer. Loading it from the already-stable
  // core runtime keeps the existing content, playlist sync and carousel behavior intact.
  document.title = 'DJ Sir Gay.exe — Personal Operating System';
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = '#008080';
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = 'DJ Sir Gay.exe';
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = 'A personal operating system built from queer memory, pop archaeology and unauthorized emotion.';
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.content = 'DJ Sir Gay.exe';
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) twitterDescription.content = 'A personal operating system built from queer memory, pop archaeology and unauthorized emotion.';

  if (!document.querySelector('link[data-djsg-os95]')) {
    const osStyle = document.createElement('link');
    osStyle.rel = 'stylesheet';
    osStyle.href = '/os95.css?v=20260810-2';
    osStyle.dataset.djsgOs95 = '1';
    document.head.appendChild(osStyle);
  }
  if (!document.querySelector('link[data-djsg-evolution]')) {
    const evolutionStyle = document.createElement('link');
    evolutionStyle.rel = 'stylesheet';
    evolutionStyle.href = '/os95-evolution.css?v=20260810-1';
    evolutionStyle.dataset.djsgEvolution = '1';
    document.head.appendChild(evolutionStyle);
  }

  const topbar = document.querySelector('.topbar');
  const progress = document.getElementById('signal-progress');

  const updateViewportSignal = () => {
    topbar?.classList.toggle('scrolled', scrollY > 18);
    if (!progress) return;
    const maximum = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    progress.style.width = `${Math.min(100, Math.max(0, scrollY / maximum * 100))}%`;
  };
  updateViewportSignal();
  addEventListener('scroll', updateViewportSignal, { passive: true });
  addEventListener('resize', updateViewportSignal, { passive: true });

  const boot = document.getElementById('signal-boot');
  if (boot) {
    let seen = false;
    try { seen = sessionStorage.getItem('djsg-signal-seen') === '1'; } catch (_) {}
    if (seen || reducedMotion) {
      boot.remove();
    } else {
      setTimeout(() => {
        boot.classList.add('done');
        try { sessionStorage.setItem('djsg-signal-seen', '1'); } catch (_) {}
        setTimeout(() => boot.remove(), 450);
      }, 980);
      boot.addEventListener('click', () => boot.classList.add('done'));
    }
  }

  const timecode = document.getElementById('timecode');
  const renderTimecode = () => {
    if (!timecode) return;
    const now = new Date();
    timecode.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(value => String(value).padStart(2, '0'))
      .join(':');
  };
  renderTimecode();
  setInterval(renderTimecode, 1000);

  const censorToggle = document.getElementById('censor-toggle');
  censorToggle?.addEventListener('click', () => {
    const active = document.body.classList.toggle('is-censored');
    censorToggle.setAttribute('aria-pressed', String(active));
    censorToggle.textContent = active ? 'Censorship: on (bad idea)' : 'Censorship: off';
  });

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const setMenu = open => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.addEventListener('click', event => {
    if (event.target === mobileMenu || event.target.closest('a')) setMenu(false);
  });
  addEventListener('resize', () => {
    if (innerWidth > 950) setMenu(false);
  }, { passive: true });

  const rails = [...document.querySelectorAll('[data-rail]')];
  rails.forEach(rail => {
    const name = rail.dataset.rail;
    const current = document.querySelector(`[data-current="${name}"]`);
    const total = current?.parentElement?.querySelector('span');
    const shell = rail.closest('.carousel-shell');
    const edgeArrow = shell?.querySelector('.edge-arrow');
    const items = () => [...rail.children];
    const step = () => {
      const first = items()[0];
      if (!first) return rail.clientWidth * .82;
      return first.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap || '0');
    };

    document.querySelector(`[data-prev="${name}"]`)?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    document.querySelector(`[data-next="${name}"]`)?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

    const updateCurrent = () => {
      const cards = items();
      if (!cards.length) return;
      const railLeft = rail.getBoundingClientRect().left;
      let bestIndex = 0;
      let bestDistance = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      if (current) current.textContent = String(bestIndex + 1).padStart(2, '0');
      if (total) total.textContent = String(cards.length).padStart(2, '0');
      if (edgeArrow) edgeArrow.style.opacity = rail.scrollLeft > 20 ? '.22' : '1';
    };

    rail.addEventListener('scroll', () => requestAnimationFrame(updateCurrent), { passive: true });
    new MutationObserver(updateCurrent).observe(rail, { childList: true });
    updateCurrent();

    // Mouse drag remains horizontal. Touch and trackpad gestures stay native,
    // so a vertical swipe or mouse wheel over a card continues down the page.
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    rail.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('dragging');
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener('pointermove', event => {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (event.clientX - startX);
    });
    const stopDrag = () => {
      dragging = false;
      rail.classList.remove('dragging');
    };
    rail.addEventListener('pointerup', stopDrag);
    rail.addEventListener('pointercancel', stopDrag);
  });

  const modal = document.getElementById('player-modal');
  const player = document.getElementById('modal-player');
  const openPlayer = videoId => {
    if (!modal || !player || !videoId) return;
    player.src = videoId.startsWith('videoseries')
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closePlayer = () => {
    if (!modal || !player) return;
    modal.classList.remove('open');
    player.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', event => {
    const play = event.target.closest('[data-video]');
    if (!play) return;
    event.preventDefault();
    openPlayer(play.dataset.video);
  });
  modal?.querySelector('.player-close')?.addEventListener('click', closePlayer);
  modal?.addEventListener('click', event => { if (event.target === modal) closePlayer(); });
  addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closePlayer();
      setMenu(false);
    }
  });

  const imageFallback = 'https://i.ytimg.com/vi/5QEXd8XTPM0/hqdefault.jpg';
  document.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === '1') return;
      image.dataset.fallbackApplied = '1';
      image.src = imageFallback;
    });
  });

  document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));

  if (!document.querySelector('script[data-djsg-os95]')) {
    // Suppress the old fake security warning before the OS script can create it.
    try { sessionStorage.setItem('djsg-exe-booted', '1'); } catch (_) {}

    const osScript = document.createElement('script');
    osScript.src = '/os95.js?v=20260810-2';
    osScript.dataset.djsgOs95 = '1';
    osScript.addEventListener('load', () => {
      if (document.querySelector('script[data-djsg-evolution]')) return;
      const evolutionScript = document.createElement('script');
      evolutionScript.src = '/os95-evolution.js?v=20260810-1';
      evolutionScript.dataset.djsgEvolution = '1';
      document.body.appendChild(evolutionScript);
    });
    document.body.appendChild(osScript);
  }
})();
