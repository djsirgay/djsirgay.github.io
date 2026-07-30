(() => {
  const rail = document.getElementById('fresh-rail');
  if (!rail) return;

  const playlistId = 'PL0CwuGTt2ZV2v4CGRTtYyaWYyCEoC2vPU';

  // The live playlist feed normally replaces this immediately. Keeping several
  // honest fallback cards means the rail is still scrollable when YouTube
  // temporarily blocks metadata during a Pages build.
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

  // Direction lock for iOS/Safari: vertical movement remains native page
  // scrolling; a clearly horizontal movement scrolls this rail manually.
  let tracking = false;
  let horizontal = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let moved = false;

  rail.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    tracking = true;
    horizontal = null;
    moved = false;
    startX = touch.clientX;
    startY = touch.clientY;
    startScroll = rail.scrollLeft;
  }, { passive: true });

  rail.addEventListener('touchmove', event => {
    if (!tracking || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      horizontal = Math.abs(dx) > Math.abs(dy) * 1.12;
    }

    if (!horizontal) return;
    moved = moved || Math.abs(dx) > 8;
    event.preventDefault();
    rail.scrollLeft = startScroll - dx;
  }, { passive: false });

  const finish = () => {
    tracking = false;
    horizontal = null;
  };
  rail.addEventListener('touchend', finish, { passive: true });
  rail.addEventListener('touchcancel', finish, { passive: true });

  // A swipe that starts on an <a> must not accidentally open the video.
  rail.addEventListener('click', event => {
    if (!moved) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    moved = false;
  }, true);

  const prepareCards = () => {
    rail.querySelectorAll('img').forEach(image => {
      image.draggable = false;
    });
  };
  prepareCards();
  new MutationObserver(prepareCards).observe(rail, { childList: true, subtree: true });
})();
