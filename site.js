(() => {
  const topbar = document.querySelector('.topbar');
  const updateTopbar = () => topbar?.classList.toggle('scrolled', window.scrollY > 18);
  updateTopbar();
  addEventListener('scroll', updateTopbar, { passive: true });

  const rails = [...document.querySelectorAll('[data-rail]')];
  rails.forEach(rail => {
    const name = rail.dataset.rail;
    const current = document.querySelector(`[data-current="${name}"]`);
    const items = () => [...rail.children];
    const step = () => Math.min(rail.clientWidth * .88, 920);

    document.querySelector(`[data-prev="${name}"]`)?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    document.querySelector(`[data-next="${name}"]`)?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

    const updateCurrent = () => {
      const cards = items();
      if (!cards.length || !current) return;
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
      current.textContent = String(bestIndex + 1).padStart(2, '0');
      const total = current.nextElementSibling;
      if (total) total.textContent = String(cards.length).padStart(2, '0');
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
    const stop = () => {
      dragging = false;
      rail.classList.remove('dragging');
    };
    rail.addEventListener('pointerup', stop);
    rail.addEventListener('pointercancel', stop);
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
  modal?.addEventListener('click', event => {
    if (event.target === modal) closePlayer();
  });
  addEventListener('keydown', event => {
    if (event.key === 'Escape') closePlayer();
  });

  document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
})();
