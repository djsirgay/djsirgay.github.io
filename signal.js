(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    timecode.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()].map(value => String(value).padStart(2, '0')).join(':');
  };
  renderTimecode();
  setInterval(renderTimecode, 1000);

  const censorToggle = document.getElementById('censor-toggle');
  censorToggle?.addEventListener('click', () => {
    const active = document.body.classList.toggle('is-censored');
    censorToggle.setAttribute('aria-pressed', String(active));
    censorToggle.textContent = active ? 'Censorship: on (bad idea)' : 'Censorship: off';
  });

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

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    rail.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') return;
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
    rail.addEventListener('wheel', event => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || rail.scrollWidth <= rail.clientWidth) return;
      const atStart = rail.scrollLeft <= 1 && event.deltaY < 0;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    }, { passive: false });
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
  addEventListener('keydown', event => { if (event.key === 'Escape') closePlayer(); });

  document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
})();
