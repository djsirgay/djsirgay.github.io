(() => {
  const rail = document.getElementById('fresh-rail');
  if (!rail) return;

  const playlistId = 'PL0CwuGTt2ZV2v4CGRTtYyaWYyCEoC2vPU';

  // Keep the rail useful even when YouTube metadata is temporarily unavailable.
  // Gesture handling is intentionally left entirely to the browser so this rail
  // has the same momentum, axis detection and snap behaviour as the other rails.
  if (rail.children.length < 2) {
    rail.innerHTML = `
      <a class="fresh-card" href="https://www.youtube.com/watch?v=24_RoSB5I1w&list=${playlistId}" data-video="24_RoSB5I1w">
        <div class="fresh-thumb"><img src="https://i.ytimg.com/vi/24_RoSB5I1w/hqdefault.jpg" alt="SEREBRO × Peggy Gou — Mama Lover" loading="lazy" draggable="false"><span>PLAY ▶</span></div>
        <div class="fresh-meta"><small>01 / Fresh release</small><h3>SEREBRO × Peggy Gou — Mama Lover</h3></div>
      </a>
      <a class="fresh-card" href="https://youtu.be/0x5QZhKwQPg" data-video="0x5QZhKwQPg">
        <div class="fresh-thumb"><img src="https://i.ytimg.com/vi/0x5QZhKwQPg/hqdefault.jpg" alt="t.A.T.u. — Waste Management Anniversary Version" loading="lazy" draggable="false"><span>PLAY ▶</span></div>
        <div class="fresh-meta"><small>02 / Anniversary rework</small><h3>t.A.T.u. — Waste Management Anniversary Version</h3></div>
      </a>
      <a class="fresh-card" href="https://www.youtube.com/watch?v=tlzmzhLpfMI" data-video="tlzmzhLpfMI">
        <div class="fresh-thumb"><img src="https://i.ytimg.com/vi/tlzmzhLpfMI/hqdefault.jpg" alt="SEREBRO — Song #2: DJ Sir Gay Version" loading="lazy" draggable="false"><span>PLAY ▶</span></div>
        <div class="fresh-meta"><small>03 / DJ Sir Gay version</small><h3>SEREBRO — Song #2: DJ Sir Gay Version</h3></div>
      </a>
      <a class="fresh-card fresh-card--playlist" href="https://www.youtube.com/playlist?list=${playlistId}" target="_blank" rel="noreferrer">
        <div class="fresh-thumb"><img src="https://i.ytimg.com/vi/24_RoSB5I1w/hqdefault.jpg" alt="DJ Sir Gay Fresh Releases playlist" loading="lazy" draggable="false"><span>OPEN ↗</span></div>
        <div class="fresh-meta"><small>Full feed / YouTube</small><h3>Continue through the complete Fresh Releases playlist</h3></div>
      </a>`;
  }

  const prepareCards = () => {
    rail.querySelectorAll('img').forEach(image => {
      image.draggable = false;
    });
  };

  prepareCards();
  new MutationObserver(prepareCards).observe(rail, { childList: true, subtree: true });
})();