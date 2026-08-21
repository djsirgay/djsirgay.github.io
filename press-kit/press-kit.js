(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const player = $('.player-window');
  if (!player) return;

  const tracks = [
    {title:'Runway × Bring Me Love',artist:'GAGA × DOECHII × MADONNA × SABRINA',file:'/assets/audio/runway-bring-me-love.mp3',duration:'3:05',art:'/assets/madonna-gaga-cover.webp',mediaArt:'/assets/media/runway-bring-me-love.jpg'},
    {title:'We Found Love × Save Me Tonight',artist:'JENNIFER LOPEZ × RIHANNA',file:'/assets/audio/we-found-love-save-me-tonight.mp3',duration:'4:09',art:'/assets/we-found-love-artists.webp',mediaArt:'/assets/media/we-found-love-save-me-tonight.jpg'},
    {title:'A Sky Full of Stars × Love Me',artist:'COLDPLAY × ARSEN MUKENDI',file:'/assets/audio/sky-full-of-stars-love-me.mp3',duration:'3:09',art:'/assets/sky-full-of-stars-artists.webp',mediaArt:'/assets/media/sky-full-of-stars-love-me.jpg'},
    {title:'All The Things She Said × UuUuuU',artist:'t.A.T.u. × FLOYYMENOR',file:'/assets/audio/all-the-things-she-said-uuuuuu.mp3',duration:'3:14',art:'/assets/all-the-things-she-said-artists.webp',mediaArt:'/assets/media/all-the-things-she-said-uuuuuu.jpg'},
    {title:'How Deep Is Your Time — Coachella',artist:'CALVIN HARRIS × HANS ZIMMER × DISCIPLES',file:'/assets/audio/how-deep-is-your-time.mp3',duration:'4:17',art:'/assets/how-deep-is-your-time-cover.webp',mediaArt:'/assets/media/how-deep-is-your-time.jpg'},
    {title:'Club Song × Like I Love You',artist:'THE PUSSYCAT DOLLS × JUSTIN TIMBERLAKE',file:'/assets/audio/club-song-like-i-love-you.mp3',duration:'2:43',art:'/assets/club-song-artists.webp',mediaArt:'/assets/media/club-song-like-i-love-you.jpg'}
  ];

  const audio = $('[data-player-audio]', player);
  const list = $('[data-player-list]', player);
  const seek = $('[data-player-seek]', player);
  let selected = 0;
  const fmt = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

  list.innerHTML = tracks.map((track, index) => `<button class="winamp-track${index === 0 ? ' selected' : ''}" type="button" data-track="${index}"><span>${String(index + 1).padStart(2, '0')}</span><span>${track.title}</span><time>${track.duration}</time></button>`).join('');

  const select = (index, play = false) => {
    selected = (index + tracks.length) % tracks.length;
    const track = tracks[selected];
    $$('.winamp-track', player).forEach((row, rowIndex) => row.classList.toggle('selected', rowIndex === selected));
    $('[data-player-title]', player).textContent = track.title.toUpperCase();
    $('[data-player-art]', player).src = track.art;
    $('[data-player-art]', player).alt = `${track.title} cover`;
    $('[data-player-total]', player).textContent = track.duration;
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'DJ Sir Gay — Press Preview',
        artwork: [{src:new URL(track.mediaArt, location.href).href,sizes:'1000x1000',type:'image/jpeg'}]
      });
    }
    const nextSource = new URL(track.file, location.href).href;
    if (audio.src !== nextSource) {
      audio.src = track.file;
      seek.value = '0';
      $('[data-player-elapsed]', player).textContent = '0:00';
    }
    if (play) audio.play().catch(() => {});
  };

  list.addEventListener('click', event => {
    const row = event.target.closest('[data-track]');
    if (row) select(Number(row.dataset.track), true);
  });
  $('[data-player-prev]', player).addEventListener('click', () => select(selected - 1, true));
  $('[data-player-next]', player).addEventListener('click', () => select(selected + 1, true));
  $('[data-player-play]', player).addEventListener('click', () => audio.play().catch(() => {}));
  $('[data-player-pause]', player).addEventListener('click', () => audio.pause());
  seek.addEventListener('input', () => { if (audio.duration) audio.currentTime = Number(seek.value) / 100 * audio.duration; });
  audio.addEventListener('ended', () => select(selected + 1, true));
  audio.addEventListener('play', () => {
    player.classList.add('is-playing');
    $('[data-player-mode]', player).textContent = 'PLAYING';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  });
  audio.addEventListener('pause', () => {
    player.classList.remove('is-playing');
    $('[data-player-mode]', player).textContent = audio.currentTime ? 'PAUSED' : 'READY';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
  });
  audio.addEventListener('timeupdate', () => {
    seek.value = audio.duration ? String(audio.currentTime / audio.duration * 100) : '0';
    $('[data-player-elapsed]', player).textContent = fmt(audio.currentTime);
    $('[data-player-total]', player).textContent = fmt(audio.duration);
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState && Number.isFinite(audio.duration) && audio.duration > 0) {
      try { navigator.mediaSession.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.min(audio.currentTime,audio.duration)}); } catch (_) {}
    }
  });
  if ('mediaSession' in navigator) {
    const actions = {
      play: () => audio.play().catch(() => {}),
      pause: () => audio.pause(),
      previoustrack: () => select(selected - 1, true),
      nexttrack: () => select(selected + 1, true),
      seekbackward: details => { audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); },
      seekforward: details => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10)); },
      seekto: details => { if (Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime; }
    };
    Object.entries(actions).forEach(([action, handler]) => { try { navigator.mediaSession.setActionHandler(action, handler); } catch (_) {} });
  }

  const wmpModal = $('[data-wmp-modal]');
  const wmpFrame = $('[data-wmp-frame]', wmpModal);
  const closeWmp = () => {
    if (!wmpModal || wmpModal.hidden) return;
    wmpModal.hidden = true;
    wmpFrame.src = 'about:blank';
  };
  $$('[data-wmp]').forEach(button => button.addEventListener('click', () => {
    const media = button.dataset.wmp;
    if (!media || !wmpModal) return;
    $('[data-wmp-heading]', wmpModal).textContent = `Windows Media Player — ${button.dataset.wmpTitle || 'DJ Sir Gay'}`;
    $('[data-wmp-now]', wmpModal).textContent = (button.dataset.wmpTitle || 'DJ Sir Gay').toUpperCase();
    wmpFrame.src = `https://www.youtube.com/embed/${media}&autoplay=1&rel=0`;
    wmpModal.hidden = false;
    $('[data-wmp-close]', wmpModal).focus();
  }));
  $('[data-wmp-close]', wmpModal)?.addEventListener('click', closeWmp);
  wmpModal?.addEventListener('click', event => { if (event.target === wmpModal) closeWmp(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeWmp(); });
  $('[data-dog-close]')?.addEventListener('click', () => $('.help-dog')?.remove());
  select(0, false);
})();
