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
      const items = Array.isArray(data.items) ? data.items.filter(item => item && item.id).slice(0, 6) : [];
      if (!items.length) return;

      rail.innerHTML = items.map((item, index) => {
        const id = escapeHtml(item.id);
        const title = escapeHtml(item.title || 'DJ Sir Gay release');
        const url = escapeHtml(item.url || `https://www.youtube.com/watch?v=${id}&list=${playlistId}`);
        const thumb = escapeHtml(item.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        return `<a class="fresh-card carousel-card" href="${url}" data-video="${id}">
          <div class="fresh-thumb"><img src="${thumb}" alt="${title}" loading="lazy"><span>PLAY ▶</span></div>
          <div class="fresh-meta"><small>${String(index + 1).padStart(2, '0')} / PLAYLIST</small><h3>${title}</h3></div>
        </a>`;
      }).join('');
    })
    .catch(() => {
      // Keep the curated fallback cards already embedded in the page.
    });
})();
