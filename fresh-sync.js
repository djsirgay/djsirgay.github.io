(() => {
  const rail = document.getElementById('fresh-rail');
  if (!rail) return;

  const playlistId = 'PL0CwuGTt2ZV2v4CGRTtYyaWYyCEoC2vPU';
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  fetch('/fresh-releases.json?v=' + Date.now(), { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Playlist feed unavailable');
      return response.json();
    })
    .then(data => {
      const items = Array.isArray(data.items) ? data.items.filter(item => item && item.id).slice(0, 6) : [];
      if (!items.length) return;

      const cards = items.map((item, index) => {
        const id = escapeHtml(item.id);
        const title = escapeHtml(item.title || 'DJ Sir Gay release');
        const url = escapeHtml(item.url || `https://www.youtube.com/watch?v=${id}&list=${playlistId}`);
        const thumb = escapeHtml(item.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        const duration = escapeHtml(item.duration || 'Fresh release');
        return `<a class="fresh-card" href="${url}" data-video="${id}">
          <div class="fresh-thumb"><img src="${thumb}" alt="${title}" loading="lazy"><span>PLAY ▶</span></div>
          <div class="fresh-meta"><small>${String(index + 1).padStart(2, '0')} / ${duration}</small><h3>${title}</h3></div>
        </a>`;
      }).join('');

      const playlistCard = `<a class="fresh-card fresh-card--playlist" href="${playlistUrl}" target="_blank" rel="noreferrer">
        <div class="fresh-thumb"><img src="https://i.ytimg.com/vi/${escapeHtml(items[0].id)}/hqdefault.jpg" alt="DJ Sir Gay Fresh Releases playlist" loading="lazy"><span>OPEN ↗</span></div>
        <div class="fresh-meta"><small>Full feed / YouTube</small><h3>Continue through the complete Fresh Releases playlist</h3></div>
      </a>`;

      rail.innerHTML = cards + playlistCard;
    })
    .catch(() => {
      // Keep the honest playlist fallback already embedded in the page.
    });
})();