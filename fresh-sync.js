(() => {
  const rail = document.getElementById('fresh-rail');
  if (!rail) return;

  const playlistId = 'PL0CwuGTt2ZV2v4CGRTtYyaWYyCEoC2vPU';
  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  fetch('/fresh-releases.json?v=' + Date.now(), { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Playlist feed unavailable');
      return response.json();
    })
    .then(data => {
      const items = Array.isArray(data.items) ? data.items.filter(item => item && item.id) : [];
      if (!items.length) return;

      rail.innerHTML = items.map((item, index) => {
        const id = escapeHtml(item.id);
        const title = escapeHtml(item.title || 'DJ Sir Gay release');
        const url = escapeHtml(item.url || `https://www.youtube.com/watch?v=${id}&list=${playlistId}`);
        const thumb = escapeHtml(item.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        return `<a class="fresh-card js-live-play" href="${url}" data-video="${id}">
          <div class="fresh-thumb"><img src="${thumb}" alt="${title}" loading="lazy"><span>PLAY ▶</span></div>
          <p>${String(index + 1).padStart(2, '0')} / PLAYLIST</p>
          <h3>${title}</h3>
        </a>`;
      }).join('');
    })
    .catch(() => {
      // Keep the curated fallback cards already embedded in the page.
    });

  rail.addEventListener('click', event => {
    const card = event.target.closest('.js-live-play');
    if (!card) return;
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('modal-player');
    if (!modal || !player) return;
    event.preventDefault();
    player.src = `https://www.youtube.com/embed/${card.dataset.video}?autoplay=1&rel=0`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
})();