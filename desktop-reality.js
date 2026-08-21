(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if ($('#djsg-desktop')) return;

  const projectCards = $$('.project-card').map((card, index) => {
    const title = $('h3', card)?.textContent?.trim() || `PROJECT_${index + 1}`;
    const subtitle = $('h4', card)?.textContent?.trim() || '';
    const summary = $('p', card)?.textContent?.trim() || '';
    const image = $('img', card)?.src || '';
    const play = $('[data-video]', card);
    const file = $('a[href*="project.html"]', card);
    return { title, subtitle, summary, image, video: play?.dataset.video || '', youtube: play?.href || '', file: file?.href || '' };
  });

  const articleCards = $$('.article-card').map(card => ({
    title: $('h3', card)?.textContent?.trim() || 'Public record',
    source: $('.article-source', card)?.textContent?.trim() || 'Internet',
    summary: $('p', card)?.textContent?.trim() || '',
    image: $('img', card)?.src || '',
    href: card.href || '#'
  }));

  const getFreshCards = () => $$('.fresh-card', $('#fresh-rail'));
  const cleanFile = value => value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 26) || 'PROJECT';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  document.documentElement.classList.add('desktop-reality-on');
  document.body.classList.add('desktop-reality-on');

  const desktop = document.createElement('div');
  desktop.id = 'djsg-desktop';
  desktop.innerHTML = '<div class="dr-icons" aria-label="Desktop files"></div><div class="dr-version">DJ Sir Gay 95<br>Build 1995.2026 / Los Angeles<br>Signal: online</div>';
  document.body.insertBefore(desktop, document.body.firstChild);
  const icons = $('.dr-icons', desktop);

  let z = 100;
  const windows = new Map();
  const mobile = () => matchMedia('(max-width:760px)').matches;

  const iconSvg = type => {
    const map = {
      exe:'<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000"/><rect x="7" y="7" width="18" height="8" fill="#000080"/><path d="M9 20h14M9 24h9" stroke="#000" stroke-width="2"/><rect x="10" y="9" width="3" height="3" fill="#00ffff"/></svg>',
      paint:'<svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="21" fill="#fff" stroke="#000"/><path d="M8 19c3-10 15-10 17-2 1 4-4 3-5 5-2 2-1 5-5 5-6 0-10-3-7-8z" fill="#d8aa70" stroke="#000"/><circle cx="13" cy="14" r="2" fill="#f00"/><circle cx="18" cy="13" r="2" fill="#00f"/><circle cx="21" cy="17" r="2" fill="#0a0"/></svg>',
      browser:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#75bfff" stroke="#000"/><path d="M4 16h24M16 3c5 6 5 20 0 26M16 3c-5 6-5 20 0 26" fill="none" stroke="#000080"/><path d="M6 9h20M6 23h20" stroke="#fff"/></svg>',
      folder:'<svg viewBox="0 0 32 32"><path d="M3 9h10l3 3h13v15H3z" fill="#f6cc22" stroke="#000"/><path d="M4 7h10l2 3H4z" fill="#ffe878" stroke="#000"/></svg>',
      telegram:'<svg viewBox="0 0 32 32"><rect x="3" y="4" width="26" height="23" fill="#fff" stroke="#000"/><path d="M6 8l20 5-8 4-3 7-2-6z" fill="#1e98d7" stroke="#000"/></svg>',
      mail:'<svg viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="19" fill="#fff" stroke="#000"/><path d="M4 8l12 10L28 8" fill="#c0c0c0" stroke="#000"/></svg>',
      trash:'<svg viewBox="0 0 32 32"><path d="M8 9h17l-2 20H10z" fill="#e7e7e7" stroke="#000"/><rect x="6" y="6" width="21" height="4" fill="#c0c0c0" stroke="#000"/><rect x="12" y="3" width="9" height="3" fill="#808080" stroke="#000"/></svg>',
      music:'<svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="22" fill="#303030" stroke="#000"/><rect x="6" y="7" width="20" height="7" fill="#001000"/><rect x="8" y="9" width="12" height="3" fill="#00ff00"/><path d="M10 20h13M10 23h10" stroke="#00ff00"/></svg>'
      ,instagram:'<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="6" fill="#fff" stroke="#000"/><rect x="8" y="8" width="16" height="16" rx="4" fill="none" stroke="#000080" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="none" stroke="#000080" stroke-width="2"/><circle cx="22" cy="10" r="1.5" fill="#ff0080"/></svg>'
    };
    return map[type] || map.exe;
  };

  const addIcon = ({type='exe', label, small='', action}) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'dr-icon';
    btn.innerHTML = `${iconSvg(type)}<span>${esc(label)}</span>${small ? `<small>${esc(small)}</small>` : ''}`;
    btn.addEventListener('click', action);
    icons.append(btn);
    return btn;
  };

  const randomJitter = n => (Math.random() * n * 2) - n;
  const place = (win, x, y) => {
    if (mobile()) return;
    requestAnimationFrame(() => {
      const maxX = Math.max(4, desktop.clientWidth - win.offsetWidth - 6);
      const maxY = Math.max(4, desktop.clientHeight - win.offsetHeight - 6);
      win.style.left = `${Math.max(4, Math.min(maxX, x + randomJitter(26)))}px`;
      win.style.top = `${Math.max(4, Math.min(maxY, y + randomJitter(24)))}px`;
    });
  };

  const focusWin = win => {
    $$('.dr-window.active', desktop).forEach(w => w.classList.remove('active'));
    win.classList.add('active'); win.style.zIndex = String(++z);
  };

  const makeWindow = ({id, title, className='', html='', x=160, y=30, hidden=false}) => {
    let win = windows.get(id);
    if (win) { win.classList.remove('hidden'); focusWin(win); return win; }
    win = document.createElement('section');
    win.className = `dr-window ${className}${hidden ? ' hidden' : ''}`;
    win.dataset.window = id;
    win.innerHTML = `<div class="dr-titlebar"><span class="dr-path">${esc(title)}</span><span class="dr-window-controls"><button type="button" data-min aria-label="Minimize">_</button><button type="button" data-max aria-label="Maximize">□</button><button type="button" data-close aria-label="Close">×</button></span></div><div class="dr-body">${html}</div>`;
    desktop.append(win); windows.set(id, win); focusWin(win); place(win, x, y);
    win.addEventListener('pointerdown', () => focusWin(win));
    $('[data-close]', win).addEventListener('click', () => win.classList.add('hidden'));
    $('[data-min]', win).addEventListener('click', () => win.classList.add('hidden'));
    $('[data-max]', win).addEventListener('click', () => win.classList.toggle('maximized'));
    makeDraggable(win);
    return win;
  };

  const makeDraggable = win => {
    const bar = $('.dr-titlebar', win); let dragging=false, ox=0, oy=0;
    bar.addEventListener('pointerdown', e => {
      if (mobile() || e.target.closest('button')) return;
      dragging=true; focusWin(win); const r=win.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top; bar.setPointerCapture(e.pointerId); e.preventDefault();
    });
    bar.addEventListener('pointermove', e => {
      if(!dragging || win.classList.contains('maximized')) return;
      const dr=desktop.getBoundingClientRect(); const maxX=Math.max(4,desktop.clientWidth-win.offsetWidth-4); const maxY=Math.max(4,desktop.clientHeight-win.offsetHeight-4);
      win.style.left=`${Math.max(4,Math.min(maxX,e.clientX-dr.left-ox))}px`; win.style.top=`${Math.max(4,Math.min(maxY,e.clientY-dr.top-oy))}px`;
    });
    const stop = () => dragging=false; bar.addEventListener('pointerup',stop); bar.addEventListener('pointercancel',stop);
  };

  const show = id => { const w=windows.get(id); if(w){w.classList.remove('hidden');focusWin(w);} return w; };

  const ledMessages = [
    ['STAY FUC*ING','STRONG'],
    ['PLAY IT','LOUD'],
    ['BE GAY','DO CRIME'],
    ['FROM DICTATORSHIP','TO DANCEFLOOR'],
    ['MUSIC WITHOUT','LIMITS']
  ];
  const ledSlide = (lines, duplicate=false) => {
    const longest = Math.max(...lines.map(line => line.length));
    return `<span${longest > 14 ? ' class="long"' : ''}${duplicate ? ' aria-hidden="true"' : ''}>${lines.map(line=>`<b>${esc(line)}</b>`).join('')}</span>`;
  };
  const ledMarkup = () => `${ledMessages.map(lines=>ledSlide(lines)).join('')}${ledSlide(ledMessages[0],true)}`;
  const startLed = sequence => {
    if (!sequence?.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const step = sequence.firstElementChild?.offsetHeight || 96;
    const frames = [];
    ledMessages.forEach((_, index) => {
      const start = index / ledMessages.length;
      const hold = (index + .72) / ledMessages.length;
      const end = (index + 1) / ledMessages.length;
      frames.push({transform:`translateY(${-index * step}px)`,offset:start});
      frames.push({transform:`translateY(${-index * step}px)`,offset:hold});
      frames.push({transform:`translateY(${-(index + 1) * step}px)`,offset:end});
    });
    sequence.animate(frames,{duration:ledMessages.length * 2700,iterations:Infinity,easing:'linear'});
  };

  /* README is a real window, not a website hero. */
  const welcome = makeWindow({id:'welcome',title:'Disk D:\\DJSG\\README.TXT',className:'dr-welcome',x:145,y:30,html:`<div class="dr-brandline"><img src="/assets/logo-square.svg" alt="DJ Sir Gay logo"><div><h1>DJ Sir Gay<span>.exe</span></h1><a class="dr-domain" href="https://djsirgay.com">DJSIRGAY.COM</a></div></div><p>Mashups, narrative DJ sets and pop memories rebuilt by a queer Eastern European artist in exile. This computer contains music, questionable files and a booking button with no sense of proportion.</p><div class="dr-quick"><button class="dr-btn primary" data-open-winamp>▶ Play music</button><button class="dr-btn" data-open-paint>🎨 Paint me gay</button><button class="dr-btn" data-open-stay>▰ Open LED</button><button class="dr-btn" data-open-projects>Disk D:\\PROJECTS</button><button class="dr-btn" data-open-browser>Public Record</button><button class="dr-btn" data-open-presskit>Press kit</button></div>`});

  /* Vertical Winamp. Six hand-picked local MP3s; no redirects. */
  const tracks = [
    {title:'Runway × Bring Me Love',artist:'GAGA × DOECHII × MADONNA × SABRINA',file:'/assets/audio/runway-bring-me-love.mp3',duration:'3:05',art:'/assets/madonna-gaga-cover.webp',mediaArt:'/assets/media/runway-bring-me-love.jpg',visualizer:{mode:'alchemy',name:'Alchemy',preset:'Kaleidoscope',tempo:128,colors:['#ff2fc8','#7d52ff','#42efff']}},
    {title:'We Found Love × Save Me Tonight',artist:'JENNIFER LOPEZ × RIHANNA',file:'/assets/audio/we-found-love-save-me-tonight.mp3',duration:'4:09',art:'/assets/we-found-love-artists.webp',mediaArt:'/assets/media/we-found-love-save-me-tonight.jpg',visualizer:{mode:'ambience',name:'Ambience',preset:'Water',tempo:126,colors:['#00d8ff','#1c54ff','#b8ff50']}},
    {title:'A Sky Full of Stars × Love Me',artist:'COLDPLAY × ARSEN MUKENDI',file:'/assets/audio/sky-full-of-stars-love-me.mp3',duration:'3:09',art:'/assets/sky-full-of-stars-artists.webp',mediaArt:'/assets/media/sky-full-of-stars-love-me.jpg',visualizer:{mode:'stars',name:'Musical Colors',preset:'Star Power',tempo:125,colors:['#67b7ff','#ffffff','#7064ff']}},
    {title:'All The Things She Said × UuUuuU',artist:'t.A.T.u. × FLOYYMENOR',file:'/assets/audio/all-the-things-she-said-uuuuuu.mp3',duration:'3:14',art:'/assets/all-the-things-she-said-artists.webp',mediaArt:'/assets/media/all-the-things-she-said-uuuuuu.jpg',visualizer:{mode:'bars',name:'Bars and Waves',preset:'Fire Storm',tempo:136,colors:['#ff392d','#ffb000','#d8ff3f']}},
    {title:'How Deep Is Your Time — Coachella',artist:'CALVIN HARRIS × HANS ZIMMER × DISCIPLES',file:'/assets/audio/how-deep-is-your-time.mp3',duration:'4:17',art:'/assets/how-deep-is-your-time-cover.webp',mediaArt:'/assets/media/how-deep-is-your-time.jpg',visualizer:{mode:'battery',name:'Battery',preset:'Event Horizon',tempo:122,colors:['#ffb31f','#ffe89a','#ff5d00']}},
    {title:'Club Song × Like I Love You',artist:'THE PUSSYCAT DOLLS × JUSTIN TIMBERLAKE',file:'/assets/audio/club-song-like-i-love-you.mp3',duration:'2:43',art:'/assets/club-song-artists.webp',mediaArt:'/assets/media/club-song-like-i-love-you.jpg',visualizer:{mode:'particle',name:'Particle',preset:'Rotating Particle',tempo:114,colors:['#f339ff','#4ad9ff','#ff6648']}}
  ];
  const winamp = makeWindow({id:'winamp',title:'C:\\Program Files\\Winamp\\WINAMP.EXE',className:'dr-winamp',x:Math.max(480,innerWidth-365),y:55,html:`<div class="dr-winamp-display"><small>DJ SIR GAY — WINAMP <em data-wa-mode>READY</em></small><span data-wa-title>LOADING PLAYLIST...</span></div><div class="dr-winamp-controls"><button type="button" data-wa-prev aria-label="Previous track"><i class="wa-skip wa-prev"></i></button><button type="button" data-wa-play aria-label="Play"><i class="wa-play"></i></button><button type="button" data-wa-pause aria-label="Pause"><i class="wa-pause"></i></button><button type="button" data-wa-next aria-label="Next track"><i class="wa-skip wa-next"></i></button><button type="button" data-wa-art aria-label="Open music visualization" title="Open visualization"><i class="wa-visualizer" aria-hidden="true">VIS</i></button></div><div class="dr-seek"><span data-wa-elapsed>0:00</span><input data-wa-seek type="range" min="0" max="100" value="0" aria-label="Track position"><span data-wa-total>0:00</span></div><div class="dr-winamp-eq">${Array.from({length:32},()=>'<i></i>').join('')}</div><div class="dr-playlist" data-wa-list></div><div class="dr-winamp-footer"><span>PLAYLIST</span><span data-wa-count>${tracks.length} FILES</span></div><audio data-wa-audio preload="auto" autoplay playsinline></audio>`});
  const visualizer = makeWindow({id:'visualizer',title:'C:\\WINDOWS\\MEDIA\\VISUALIZATIONS',className:'dr-album dr-visualizer',x:Math.max(500,innerWidth-780),y:Math.max(315,innerHeight-455),hidden:mobile(),html:`<div class="dr-visualizer-screen"><canvas data-viz-canvas width="250" height="200" aria-hidden="true"></canvas><div class="dr-viz-glass" aria-hidden="true"></div><div class="dr-viz-hud" aria-hidden="true"><span data-viz-preset>ALCHEMY // KALEIDOSCOPE</span><b data-viz-state>READY</b></div></div><div class="dr-viz-panel"><span><small>NOW PLAYING VISUALIZATION</small><strong data-viz-name>ALCHEMY</strong></span><b data-viz-count>01 / 06</b></div><div class="dr-album-caption" data-viz-caption aria-live="polite">Visualization: Alchemy — Runway × Bring Me Love</div>`});

  const audio = $('[data-wa-audio]', winamp);
  const list = $('[data-wa-list]', winamp);
  const seek = $('[data-wa-seek]', winamp);
  const vizCanvas = $('[data-viz-canvas]', visualizer);
  const vizContext = vizCanvas.getContext('2d', {alpha:false});
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isiOS = /iP(?:ad|hone|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const TAU = Math.PI * 2;
  let selectedFresh = 0;
  let vizMode = tracks[0].visualizer.mode;
  let vizPalette = tracks[0].visualizer.colors;
  let vizTempo = tracks[0].visualizer.tempo;
  let vizDirty = true;
  let vizNeedsFrame = true;
  let vizLastFrame = 0;
  let vizPeaks = [];
  let audioContext = null;
  let analyser = null;
  let audioSource = null;
  let frequencyData = null;
  let waveformData = null;

  const hash = value => {
    const n = Math.sin(value * 12.9898) * 43758.5453;
    return n - Math.floor(n);
  };
  const setVizState = value => { $('[data-viz-state]',visualizer).textContent=value; };
  const ensureAudioGraph = () => {
    if (isiOS) return null;
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return null;
    try {
      if (!audioContext) {
        audioContext = new AudioEngine();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = .84;
        audioSource = audioContext.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        waveformData = new Uint8Array(analyser.fftSize);
      }
      if (audioContext.state === 'suspended') audioContext.resume().catch(()=>{});
      return audioContext;
    } catch (_) {
      return null;
    }
  };
  const playAudio = (unlock=false) => {
    if (unlock) ensureAudioGraph();
    else if (audioContext?.state === 'suspended') audioContext.resume().catch(()=>{});
    return audio.play().catch(()=>{});
  };
  const readSignal = time => {
    const live = analyser && audioContext?.state === 'running';
    if (live) {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(waveformData);
    }
    const motion = audio.paused ? .22 : 1;
    const beatPhase = (Math.sin(time * (vizTempo / 60) * TAU - Math.PI / 2) + 1) / 2;
    const beat = Math.pow(beatPhase, 7) * motion;
    const freq = ratio => {
      const r = Math.max(0,Math.min(1,ratio));
      if (live) return (frequencyData[Math.min(frequencyData.length-1,Math.floor(r * frequencyData.length * .82))] || 0) / 255;
      const a = (Math.sin(time * (2.2 + r * 3.1) + r * 31 + selectedFresh) + 1) / 2;
      const b = (Math.sin(time * (5.4 - r * 1.7) - r * 17) + 1) / 2;
      return Math.min(1,(.09 + a * .34 + b * .18 + beat * (.52 - r * .22)) * motion);
    };
    const wave = ratio => {
      const r = Math.max(0,Math.min(1,ratio));
      if (live) return ((waveformData[Math.min(waveformData.length-1,Math.floor(r * waveformData.length))] || 128) - 128) / 128;
      return (Math.sin(r * TAU * 3 + time * 3.1) * .62 + Math.sin(r * TAU * 7 - time * 1.7) * .25) * motion;
    };
    let energy = 0;
    for (let i=0;i<18;i++) energy += freq(i/24);
    return {freq,wave,energy:energy/18,beat};
  };

  const clearViz = (color='#000') => {
    vizContext.globalCompositeOperation='source-over';
    vizContext.globalAlpha=1;
    vizContext.shadowBlur=0;
    vizContext.fillStyle=color;
    vizContext.fillRect(0,0,vizCanvas.width,vizCanvas.height);
  };
  const drawAlchemy = (time,signal) => {
    if (vizDirty) clearViz('#020005');
    else {vizContext.fillStyle='rgba(2,0,7,.18)';vizContext.fillRect(0,0,250,200);}
    vizContext.save();
    vizContext.translate(125,100);
    vizContext.globalCompositeOperation='lighter';
    for(let arm=0;arm<8;arm++){
      vizContext.save();
      vizContext.rotate(arm*TAU/8 + time*.055);
      for(let ribbon=0;ribbon<3;ribbon++){
        vizContext.beginPath();
        for(let i=0;i<=46;i++){
          const p=i/46, f=signal.freq(p*.82), radius=5+p*111;
          const bend=Math.sin(i*.27+time*(.72+ribbon*.16)+ribbon*2.1)*(3+ribbon*2+f*11)+signal.wave(p)*9;
          if(i===0)vizContext.moveTo(radius,bend+(ribbon-1)*5);else vizContext.lineTo(radius,bend+(ribbon-1)*5);
        }
        vizContext.strokeStyle=vizPalette[(arm+ribbon)%vizPalette.length];
        vizContext.globalAlpha=.32+signal.energy*.42;
        vizContext.lineWidth=ribbon===1?1.3:.65;
        vizContext.shadowColor=vizContext.strokeStyle;vizContext.shadowBlur=5+signal.beat*8;
        vizContext.stroke();
      }
      vizContext.restore();
    }
    vizContext.fillStyle=vizPalette[0];vizContext.globalAlpha=.5+signal.beat*.4;
    vizContext.beginPath();vizContext.arc(0,0,4+signal.energy*14,0,TAU);vizContext.fill();
    vizContext.restore();
  };
  const drawAmbience = (time,signal) => {
    clearViz('#000512');
    const glow=vizContext.createRadialGradient(132,94,4,132,94,145);
    glow.addColorStop(0,'#062b73');glow.addColorStop(.48,'#00182d');glow.addColorStop(1,'#000107');
    vizContext.fillStyle=glow;vizContext.fillRect(0,0,250,200);
    vizContext.save();vizContext.globalCompositeOperation='lighter';
    for(let layer=0;layer<8;layer++){
      vizContext.beginPath();
      for(let x=-8;x<=258;x+=4){
        const p=Math.max(0,Math.min(1,x/250));
        const y=33+layer*18+Math.sin(p*TAU*(1.15+layer*.08)+time*(.28+layer*.025)+layer*.8)*(8+signal.freq(p)*14)+signal.wave(p)*8;
        if(x===-8)vizContext.moveTo(x,y);else vizContext.lineTo(x,y);
      }
      vizContext.strokeStyle=vizPalette[layer%vizPalette.length];
      vizContext.globalAlpha=.12+layer*.018+signal.energy*.13;
      vizContext.lineWidth=4+layer*.7;vizContext.shadowColor=vizContext.strokeStyle;vizContext.shadowBlur=9;
      vizContext.stroke();
    }
    for(let i=0;i<18;i++){
      const x=hash(i*7.1)*250+Math.sin(time*.25+i)*9;
      const y=hash(i*3.7+8)*200+Math.cos(time*.2+i)*7;
      const r=1+hash(i*9.3)*4+signal.freq((i%12)/12)*4;
      vizContext.fillStyle=vizPalette[i%vizPalette.length];vizContext.globalAlpha=.18+signal.beat*.22;
      vizContext.beginPath();vizContext.arc(x,y,r,0,TAU);vizContext.fill();
    }
    vizContext.restore();
  };
  const drawStars = (time,signal) => {
    clearViz('#00000d');
    const sky=vizContext.createRadialGradient(125,96,1,125,96,150);
    sky.addColorStop(0,`rgba(58,86,255,${.2+signal.energy*.35})`);sky.addColorStop(.42,'#071341');sky.addColorStop(1,'#00000a');
    vizContext.fillStyle=sky;vizContext.fillRect(0,0,250,200);
    vizContext.save();vizContext.globalCompositeOperation='lighter';
    for(let i=0;i<120;i++){
      const phase=(hash(i*4.17)+time*(.025+signal.energy*.035))%1;
      const angle=hash(i*9.71+3)*TAU+time*.018;
      const radius=Math.pow(phase,2.15)*168;
      const x=125+Math.cos(angle)*radius*1.08;
      const y=96+Math.sin(angle)*radius*.78;
      const size=.35+phase*1.6+signal.freq((i%40)/40)*1.25;
      vizContext.fillStyle=vizPalette[i%vizPalette.length];vizContext.globalAlpha=.18+phase*.78;
      vizContext.fillRect(x,y,size,size);
    }
    for(let ring=0;ring<5;ring++){
      const radius=10+ring*13+signal.energy*17+Math.sin(time*.9+ring)*3;
      vizContext.strokeStyle=vizPalette[ring%vizPalette.length];vizContext.globalAlpha=.16+signal.beat*.25;
      vizContext.lineWidth=.7+signal.beat;vizContext.beginPath();vizContext.arc(125,96,radius,0,TAU);vizContext.stroke();
    }
    vizContext.restore();
  };
  const drawBars = (time,signal) => {
    clearViz('#080000');
    vizContext.strokeStyle='rgba(255,92,20,.12)';vizContext.lineWidth=.5;
    for(let y=20;y<200;y+=20){vizContext.beginPath();vizContext.moveTo(0,y+.5);vizContext.lineTo(250,y+.5);vizContext.stroke();}
    const count=34, gap=1, width=(250-(count+1)*gap)/count;
    if(vizPeaks.length!==count)vizPeaks=Array(count).fill(0);
    const gradient=vizContext.createLinearGradient(0,180,0,18);
    gradient.addColorStop(0,vizPalette[0]);gradient.addColorStop(.62,vizPalette[1]);gradient.addColorStop(1,vizPalette[2]);
    vizContext.fillStyle=gradient;
    for(let i=0;i<count;i++){
      const value=Math.min(1,signal.freq(i/count*.76)*1.22+signal.beat*(1-i/count)*.18);
      const height=Math.max(2,value*148);
      const x=gap+i*(width+gap);
      vizContext.fillRect(x,181-height,width,height);
      vizPeaks[i]=Math.max(value,vizPeaks[i]-.012);
      vizContext.fillStyle=vizPalette[2];vizContext.fillRect(x,178-vizPeaks[i]*148,width,2);vizContext.fillStyle=gradient;
    }
    vizContext.save();vizContext.globalCompositeOperation='lighter';vizContext.beginPath();
    for(let x=0;x<=250;x+=2){const p=x/250,y=35+signal.wave(p)*21+Math.sin(p*TAU*2-time*.8)*3;if(x===0)vizContext.moveTo(x,y);else vizContext.lineTo(x,y);}
    vizContext.strokeStyle='#fff27a';vizContext.globalAlpha=.72;vizContext.lineWidth=1;vizContext.shadowColor='#ff3a16';vizContext.shadowBlur=5;vizContext.stroke();vizContext.restore();
  };
  const drawBattery = (time,signal) => {
    if(vizDirty) clearViz('#050200');
    else {vizContext.fillStyle='rgba(5,2,0,.2)';vizContext.fillRect(0,0,250,200);}
    vizContext.save();vizContext.translate(125,100);vizContext.scale(1,.78);vizContext.globalCompositeOperation='lighter';
    for(let spoke=0;spoke<28;spoke++){
      const angle=spoke*TAU/28+time*.075;
      const power=signal.freq((spoke%18)/18);
      const inner=13+signal.energy*13,outer=92+power*32;
      vizContext.strokeStyle=vizPalette[spoke%vizPalette.length];vizContext.globalAlpha=.11+power*.58;
      vizContext.lineWidth=.6+power*1.4;vizContext.beginPath();vizContext.moveTo(Math.cos(angle)*inner,Math.sin(angle)*inner);vizContext.lineTo(Math.cos(angle+.2*signal.wave(spoke/28))*outer,Math.sin(angle+.2*signal.wave(spoke/28))*outer);vizContext.stroke();
    }
    for(let ring=0;ring<11;ring++){
      const radius=8+((ring*10+time*14)%111);
      vizContext.strokeStyle=vizPalette[ring%vizPalette.length];vizContext.globalAlpha=.08+(1-radius/125)*.38+signal.beat*.16;
      vizContext.lineWidth=.7+signal.energy*1.2;vizContext.beginPath();vizContext.arc(0,0,radius,0,TAU);vizContext.stroke();
    }
    vizContext.globalCompositeOperation='source-over';vizContext.fillStyle='#000';vizContext.beginPath();vizContext.arc(0,0,8+signal.beat*5,0,TAU);vizContext.fill();
    vizContext.strokeStyle='#ffdb72';vizContext.globalAlpha=.75;vizContext.lineWidth=1;vizContext.beginPath();vizContext.arc(0,0,10+signal.beat*6,0,TAU);vizContext.stroke();
    vizContext.restore();
  };
  const drawParticle = (time,signal) => {
    clearViz('#030007');
    const haze=vizContext.createLinearGradient(0,60,0,200);haze.addColorStop(0,'#170029');haze.addColorStop(1,'#001122');vizContext.fillStyle=haze;vizContext.fillRect(0,0,250,200);
    vizContext.save();vizContext.translate(125,86);vizContext.rotate(Math.sin(time*.2)*.09);vizContext.translate(-125,-86);vizContext.globalCompositeOperation='lighter';
    for(let row=0;row<22;row++){
      const depth=((row/22+time*.075)%1);
      const y=72+Math.pow(depth,2.1)*143;
      const spacing=3.2+depth*13.5;
      const drift=Math.sin(time*.55+row*.42)*7*(1-depth);
      for(let col=-12;col<=12;col++){
        const ratio=(col+12)/24;
        const power=signal.freq((ratio*.58+depth*.42)%1);
        const x=125+col*spacing+drift;
        const size=.45+depth*2.6+power*1.8;
        vizContext.fillStyle=vizPalette[(row+col+24)%vizPalette.length];vizContext.globalAlpha=.12+depth*.48+power*.25;
        vizContext.fillRect(x-size/2,y-size/2,size,size);
      }
    }
    vizContext.beginPath();
    for(let x=0;x<=250;x+=3){const p=x/250,y=65+signal.wave(p)*15+Math.sin(p*TAU*2+time)*3;if(x===0)vizContext.moveTo(x,y);else vizContext.lineTo(x,y);}
    vizContext.strokeStyle=vizPalette[1];vizContext.globalAlpha=.62;vizContext.shadowColor=vizPalette[0];vizContext.shadowBlur=6;vizContext.lineWidth=1;vizContext.stroke();vizContext.restore();
  };
  const drawVisualizer = now => {
    requestAnimationFrame(drawVisualizer);
    if (document.hidden || visualizer.classList.contains('hidden') || visualizer.classList.contains('minimized')) return;
    const interval = audio.paused ? Infinity : (reducedMotion.matches ? 500 : 0);
    if (!vizNeedsFrame && now-vizLastFrame<interval) return;
    vizLastFrame=now;vizNeedsFrame=false;
    const time=Number.isFinite(audio.currentTime) ? audio.currentTime : now/1000;
    const signal=readSignal(time);
    const painters={alchemy:drawAlchemy,ambience:drawAmbience,stars:drawStars,bars:drawBars,battery:drawBattery,particle:drawParticle};
    (painters[vizMode]||drawAlchemy)(time,signal);
    vizDirty=false;
  };
  requestAnimationFrame(drawVisualizer);
  new MutationObserver(()=>{vizNeedsFrame=true;vizDirty=true;}).observe(visualizer,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{vizNeedsFrame=true;});
  reducedMotion.addEventListener?.('change',()=>{vizNeedsFrame=true;vizDirty=true;});

  const applyVisualizer = track => {
    const preset=track.visualizer;
    vizMode=preset.mode;vizPalette=preset.colors;vizTempo=preset.tempo;vizPeaks=[];vizDirty=true;vizNeedsFrame=true;
    visualizer.dataset.vizMode=preset.mode;
    $('.dr-path',visualizer).textContent=`C:\\WINDOWS\\MEDIA\\VISUALIZATIONS\\${preset.name.toUpperCase()}.VIZ`;
    $('[data-viz-preset]',visualizer).textContent=`${preset.name.toUpperCase()} // ${preset.preset.toUpperCase()}`;
    $('[data-viz-name]',visualizer).textContent=`${preset.name} / ${preset.preset}`;
    $('[data-viz-count]',visualizer).textContent=`${String(selectedFresh+1).padStart(2,'0')} / ${String(tracks.length).padStart(2,'0')}`;
    $('[data-viz-caption]',visualizer).textContent=`Visualization: ${preset.name} — ${track.title}`;
  };
  const fmt = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00';
  list.innerHTML = tracks.map((track,i)=>`<button class="dr-track${i===0?' selected':''}" type="button" data-track="${i}"><span>${String(i+1).padStart(2,'0')}</span><span>${esc(track.title)}</span><time>${track.duration}</time></button>`).join('');
  const selectFresh = (index, play=false, unlock=false) => {
    selectedFresh=(index+tracks.length)%tracks.length; const track=tracks[selectedFresh];
    $$('.dr-track',winamp).forEach((row,i)=>row.classList.toggle('selected',i===selectedFresh));
    $('[data-wa-title]',winamp).textContent=track.title.toUpperCase();
    applyVisualizer(track);
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'DJ Sir Gay — Music Without Limits',
        artwork: [{src:new URL(track.mediaArt || track.art,location.href).href,sizes:'1000x1000',type:'image/jpeg'}]
      });
    }
    if(audio.src !== new URL(track.file,location.href).href){audio.src=track.file;seek.value=0;$('[data-wa-elapsed]',winamp).textContent='0:00';$('[data-wa-total]',winamp).textContent=track.duration;}
    if(play) playAudio(unlock);
  };
  selectFresh(0,false);
  list.addEventListener('click',e=>{const row=e.target.closest('[data-track]');if(row)selectFresh(Number(row.dataset.track),true,true)});
  $('[data-wa-prev]',winamp).addEventListener('click',()=>selectFresh(selectedFresh-1,true,true));
  $('[data-wa-next]',winamp).addEventListener('click',()=>selectFresh(selectedFresh+1,true,true));
  $('[data-wa-play]',winamp).addEventListener('click',()=>playAudio(true));
  $('[data-wa-pause]',winamp).addEventListener('click',()=>audio.pause());
  $('[data-wa-art]',winamp).addEventListener('click',()=>{show('visualizer');vizNeedsFrame=true;vizDirty=true;});
  audio.addEventListener('play',()=>{winamp.classList.add('is-playing');$('[data-wa-mode]',winamp).textContent='PLAYING';setVizState('PLAYING');vizNeedsFrame=true;if('mediaSession' in navigator)navigator.mediaSession.playbackState='playing';});
  audio.addEventListener('pause',()=>{winamp.classList.remove('is-playing');$('[data-wa-mode]',winamp).textContent=audio.currentTime ? 'PAUSED' : 'READY';setVizState(audio.currentTime?'PAUSED':'READY');vizNeedsFrame=true;if('mediaSession' in navigator)navigator.mediaSession.playbackState='paused';});
  audio.addEventListener('timeupdate',()=>{
    seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';
    $('[data-wa-elapsed]',winamp).textContent=fmt(audio.currentTime);
    $('[data-wa-total]',winamp).textContent=fmt(audio.duration);
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState && Number.isFinite(audio.duration) && audio.duration>0) {
      try { navigator.mediaSession.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.min(audio.currentTime,audio.duration)}); } catch (_) {}
    }
  });
  audio.addEventListener('ended',()=>selectFresh(selectedFresh+1,true));
  seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration;});
  if ('mediaSession' in navigator) {
    const actions = {
      play:()=>playAudio(false),
      pause:()=>audio.pause(),
      previoustrack:()=>selectFresh(selectedFresh-1,true),
      nexttrack:()=>selectFresh(selectedFresh+1,true),
      seekbackward:details=>{audio.currentTime=Math.max(0,audio.currentTime-(details.seekOffset||10));},
      seekforward:details=>{audio.currentTime=Math.min(audio.duration||Infinity,audio.currentTime+(details.seekOffset||10));},
      seekto:details=>{if(Number.isFinite(details.seekTime))audio.currentTime=details.seekTime;}
    };
    Object.entries(actions).forEach(([action,handler])=>{try{navigator.mediaSession.setActionHandler(action,handler);}catch(_){}});
  }
  const autoplay = () => playAudio(false);
  setTimeout(autoplay,350);
  document.addEventListener('pointerdown',()=>{ensureAudioGraph();autoplay();},{once:true,capture:true});

  const videoEmbed = value => {
    if(!value)return '';
    if(value.startsWith('videoseries'))return `https://www.youtube.com/embed/${value}`;
    if(/^[\w-]{6,}$/.test(value))return `https://www.youtube.com/embed/${value}?autoplay=1&rel=0`;
    try{const u=new URL(value);const v=u.searchParams.get('v');const list=u.searchParams.get('list');if(v)return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;if(list)return `https://www.youtube.com/embed/videoseries?list=${list}`;}catch(_){}
    return '';
  };
  function openWmp(video,title='DJ Sir Gay'){
    let win=windows.get('wmp'); const src=videoEmbed(video); if(!src)return;
    if(!win){win=makeWindow({id:'wmp',title:`C:\\Program Files\\Windows Media Player\\wmplayer.exe`,className:'dr-wmp',x:Math.max(170,innerWidth*.28),y:Math.max(90,innerHeight*.17),html:`<div class="dr-wmp-screen"><iframe title="Windows Media Player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><div class="dr-wmp-controls"><button type="button" aria-label="Play"><i class="dr-media-icon dr-media-play" aria-hidden="true"></i></button><button type="button" aria-label="Pause"><i class="dr-media-icon dr-media-pause" aria-hidden="true"></i></button><button type="button" aria-label="Stop"><i class="dr-media-icon dr-media-stop" aria-hidden="true"></i></button><div class="dr-wmp-now"><strong data-wmp-title></strong><div class="dr-wmp-bar"><i></i></div></div></div>`});}
    win.classList.remove('hidden'); focusWin(win); $('iframe',win).src=src; $('[data-wmp-title]',win).textContent=title; $('.dr-path',win).textContent=`Windows Media Player — ${title}`;
  }
  function openWmpFromCard(card,title){ const img=$('img',card)?.src||''; let id=''; const m=img.match(/\/vi\/([^/]+)/); if(m)id=m[1]; if(!id)id=card.href||''; openWmp(id,title); }

  /* Projects are files on the desktop and also available as a real folder. */
  const projectWindow = (p,index) => {
    const id=`project-${index}`; let win=windows.get(id); if(win){win.classList.remove('hidden');focusWin(win);return win;}
    win=makeWindow({id,title:`Disk D:\\PROJECTS\\${cleanFile(p.title)}.EXE`,className:'dr-project',x:170+index*32,y:120+index*24,html:`<div class="dr-project-media"><img src="${esc(p.image)}" alt="${esc(p.title)}"></div><div class="dr-project-copy"><small>DJSG PROJECT FILE / ${String(index+1).padStart(2,'0')}</small><h2>${esc(p.title)}</h2><h3>${esc(p.subtitle)}</h3><p>${esc(p.summary)}</p><div class="dr-project-actions"><button class="dr-btn primary" type="button" data-project-play>▶ PLAY</button><a class="dr-btn" href="${esc(p.file)}">Open file →</a><a class="dr-btn" href="${esc(p.youtube)}" target="_blank" rel="noreferrer">YouTube ↗</a></div></div>`});
    $('[data-project-play]',win).addEventListener('click',()=>openWmp(p.video||p.youtube,p.title)); return win;
  };

  const projectsFolder = makeWindow({id:'projects-folder',title:'Disk D:\\PROJECTS\\',className:'dr-browser hidden',x:215,y:100,hidden:true,html:`<div class="dr-menubar"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div><div class="dr-browser-content" data-project-folder style="padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:10px;background:#fff"></div>`});
  const pf=$('[data-project-folder]',projectsFolder); projectCards.forEach((p,i)=>{const b=document.createElement('button');b.className='dr-icon';b.style.color='#000';b.style.textShadow='none';b.innerHTML=`${iconSvg('exe')}<span>${esc(cleanFile(p.title))}.EXE</span>`;b.addEventListener('click',()=>projectWindow(p,i));pf.append(b)});

  /* Public record looks like a period news portal inside Internet Explorer. */
  const browser = makeWindow({id:'browser',title:'Internet Explorer — Yahoo! News / DJ Sir Gay',className:'dr-browser',x:Math.max(200,innerWidth*.34),y:80,hidden:true,html:`<div class="dr-menubar"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div><div class="dr-address"><strong>Address</strong><input readonly value="http://news.yahoo.com/djsirgay/public-record"></div><div class="dr-browser-content"><div class="dr-yahoo-head">Yahoo! <small>Public Record / DJ Sir Gay</small></div><div class="dr-record-tagline">More than a DJ. <span>Unfortunately.</span></div><div data-news></div></div>`});
  const news=$('[data-news]',browser); articleCards.forEach((a,i)=>{const row=document.createElement('button');row.type='button';row.className='dr-news-row';row.innerHTML=`<img src="${esc(a.image)}" alt=""><div><small>${esc(a.source)}</small><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p></div>`;row.addEventListener('click',()=>openArticle(a,i));news.append(row)});
  function openArticle(a,i){let win=windows.get(`article-${i}`);if(win){win.classList.remove('hidden');focusWin(win);return;}win=makeWindow({id:`article-${i}`,title:`Internet Explorer — ${a.title}`,className:'dr-article-preview',x:240+i*25,y:120+i*18,html:`<img src="${esc(a.image)}" alt=""><h2>${esc(a.title)}</h2><p><strong>${esc(a.source)}</strong></p><p>${esc(a.summary)}</p><a class="dr-btn primary" href="${esc(a.href)}" target="_blank" rel="noreferrer">Read full article ↗</a>`});}

  /* Stay Strong stays in its original standalone utility window. */
  makeWindow({id:'stay',title:'C:\\WINDOWS\\SYSTEM\\STAY_FUCKING_STRONG.SYS',className:'dr-stay',x:145,y:Math.max(380,innerHeight-225),hidden:mobile(),html:`<div class="dr-ledbox" aria-label="STAY FUC*ING STRONG and rotating DJ Sir Gay messages"><div class="dr-led-sequence">${ledMarkup()}</div></div><div class="dr-statusbar">Live message board / rear-window LED / Los Angeles</div>`});
  $$('.dr-led-sequence',desktop).forEach(startLed);

  /* Booking returns to the initial desktop composition. */
  const booking=makeWindow({id:'booking',title:'D:\\BOOKING\\BOOK_DJ_SIR_GAY.EXE',className:'dr-booking',x:Math.max(650,innerWidth-520),y:Math.max(390,innerHeight-315),hidden:mobile(),html:`<h2>BOOK DJ SIR GAY</h2><p>Because the room already has enough tasteful background music.</p><a class="dr-book-me" href="mailto:ulyanoow@gmail.com?subject=DJ%20Sir%20Gay%20booking&body=Name:%0AEvent%20date:%0ACity%20/%20venue:%0AEvent%20type:%0AEstimated%20audience:%0ABudget%20range:%0AHow%20should%20the%20room%20feel:%0A">BOOK<br>DJ SIR GAY</a><div class="dr-booking-note">A suspiciously efficient way to improve the lineup.</div>`});

  /* A compact desktop gateway plus a real shareable press-kit URL. */
  const presskit=makeWindow({id:'presskit',title:'D:\\PRESS_KIT\\README.TXT',className:'dr-presskit',x:Math.max(250,innerWidth*.31),y:Math.max(120,innerHeight*.18),hidden:true,html:`<div class="dr-presskit-head"><small>OFFICIAL / 2026</small><h2>PRESS KIT</h2><p>More than a DJ. <b>Unfortunately.</b></p></div><div class="dr-presskit-files"><a href="/press-kit/files/DJ_Sir_Gay_EPK_2026.pdf" target="_blank" rel="noreferrer">📄 DJ_SIR_GAY_EPK_2026.PDF <span>↗</span></a><a href="/press-kit/files/DJ_Sir_Gay_Press_Release_Belarus_in_Exile.pdf" target="_blank" rel="noreferrer">📄 PRESS_RELEASE.PDF <span>↗</span></a><a href="/press-kit/files/DJ_Sir_Gay_Technical_Advance_2026.pdf" target="_blank" rel="noreferrer">📄 TECHNICAL_ADVANCE.PDF <span>↗</span></a><a href="/press-kit/files/DJ_Sir_Gay_Press_Kit_2026.zip" download>🗜 DOWNLOAD_EVERYTHING.ZIP <span>↓</span></a></div><div class="dr-project-actions"><a class="dr-btn primary" href="/press-kit/">OPEN SHAREABLE PRESS PAGE →</a><a class="dr-btn" href="mailto:ulyanoow@gmail.com?subject=DJ%20Sir%20Gay%20press%20or%20booking%20request">Contact ↗</a></div><div class="dr-statusbar">Direct link: djsirgay.com/press-kit/</div>`});

  /* Fake copy dialog is a functional Telegram conversion. */
  const openDownloads = () => {
    let win=windows.get('downloads'); if(!win){win=makeWindow({id:'downloads',title:'Copying files — D:\\DJSG → C:\\Downloads',className:'dr-copy',x:Math.max(220,innerWidth*.33),y:Math.max(150,innerHeight*.22),html:`<h2>Copy these files to your Downloads?</h2><div class="dr-copy-route"><div class="dr-folder">D:\\DJSG</div><div class="dr-copy-arrow">→</div><div class="dr-folder">C:\\Downloads</div></div><div class="dr-copy-files">FRESH_MASHUPS.m3u<br>BELARUS_IN_EXILE.exe<br>STAY_FUCKING_STRONG.txt<br>QUEER_POP_MEMORY.dll<br>TELEGRAM_SHORTCUT.url</div><div class="dr-copy-progress"><i></i></div><p class="dr-copy-result">Preparing files…</p><a class="dr-btn primary" href="https://t.me/djsirgay" target="_blank" rel="noreferrer">Open Downloads in Telegram ↗</a>`});}
    win.classList.remove('hidden');focusWin(win);win.classList.remove('running');void win.offsetWidth;win.classList.add('running');$('.dr-copy-result',win).textContent='Copying questionable material…';setTimeout(()=>{$('.dr-copy-result',win).textContent='Copy complete. Your Downloads folder now has better taste.';},1900);
  };

  /* Desktop files. */
  addIcon({type:'music',label:'WINAMP.EXE',small:'Fresh Releases',action:()=>show('winamp')});
  projectCards.forEach((p,i)=>addIcon({type:'exe',label:`${cleanFile(p.title)}.EXE`,small:`D:\\PROJECTS\\${String(i+1).padStart(2,'0')}`,action:()=>projectWindow(p,i)}));
  addIcon({type:'paint',label:'SERGEY.BMP',small:'Open in Paint',action:()=>{const t=$('.djsg-app-shortcut[data-app="paint"]')||$('#djsg-paint-launch');t?.click();}});
  addIcon({type:'browser',label:'PUBLIC_RECORD.URL',small:'Yahoo! News',action:()=>show('browser')});
  addIcon({type:'folder',label:'PRESS_KIT',small:'EPK + advance + press',action:()=>show('presskit')});
  addIcon({type:'music',label:'STAY_STRONG.SYS',small:'Live rear-window LED',action:()=>show('stay')});
  addIcon({type:'telegram',label:'DOWNLOADS',small:'Copy to Telegram',action:openDownloads});
  addIcon({type:'mail',label:'BOOK_ME.EXE',small:'Book DJ Sir Gay',action:()=>show('booking')});
  addIcon({type:'trash',label:'Recycle Bin',small:'0 useful files',action:()=>{const d=windows.get('trash')||makeWindow({id:'trash',title:'Recycle Bin',className:'dr-article-preview',x:280,y:180,html:'<h2>Recycle Bin</h2><p>Rejected norms, failed censorship and several career plans were permanently deleted.</p><p><strong>Useful files: 0</strong></p>'});d.classList.remove('hidden');focusWin(d);}});

  /* README quick actions */
  const launchPaint = () => {
    if (typeof window.openDJSGPaint === 'function') { window.openDJSGPaint(); return true; }
    const launcher = $('#djsg-paint-launch');
    if (launcher) { launcher.click(); return true; }
    return false;
  };
  const launchPaintWhenReady = (attempt=0) => {
    if (!launchPaint() && attempt < 40) setTimeout(()=>launchPaintWhenReady(attempt+1),250);
  };
  $('[data-open-paint]',welcome).addEventListener('click',()=>launchPaintWhenReady()); $('[data-open-winamp]',welcome).addEventListener('click',()=>show('winamp')); $('[data-open-stay]',welcome).addEventListener('click',()=>show('stay')); $('[data-open-projects]',welcome).addEventListener('click',()=>show('projects-folder')); $('[data-open-browser]',welcome).addEventListener('click',()=>show('browser')); $('[data-open-presskit]',welcome).addEventListener('click',()=>show('presskit'));

  /* Route the existing Start/taskbar into windows instead of hidden webpage sections. */
  const routeTarget = target => {
    if(target==='#fresh'){show('winamp');return true} if(target==='#projects'){show('projects-folder');return true} if(target==='#voice'){show('browser');return true} if(target==='#booking'){show('booking');return true} return false;
  };
  window.DJSGDesktopOpen = routeTarget;
  document.addEventListener('click',e=>{const link=e.target.closest('[data-os-target]');if(link&&routeTarget(link.dataset.osTarget)){e.preventDefault();e.stopImmediatePropagation();$('#os95-start-menu')?.classList.remove('open');$('#os95-start-btn')?.setAttribute('aria-expanded','false');}},true);
  const task=$$('.os95-task-btn'); if(task[0])task[0].textContent='♫ WINAMP'; if(task[1])task[1].textContent='▣ D:\\PROJECTS'; if(task[2])task[2].textContent='🌐 Yahoo!'; if(task[3])task[3].textContent='✉ BOOK ME';

  /* The old floating YouTube modal is superseded by Windows Media Player. */
  document.addEventListener('click',e=>{const old=e.target.closest('[data-video]');if(!old||old.closest('#djsg-desktop'))return;e.preventDefault();e.stopImmediatePropagation();openWmp(old.dataset.video,old.closest('.project-card')?.querySelector('h3')?.textContent||'DJ Sir Gay');},true);

  /* README owns focus; cover, LED and booking remain visible around it on desktop. */
  show('welcome');

  addEventListener('resize',()=>{if(mobile())return;windows.forEach(win=>{if(win.classList.contains('hidden')||win.classList.contains('maximized'))return;const maxX=Math.max(4,desktop.clientWidth-win.offsetWidth-4),maxY=Math.max(4,desktop.clientHeight-win.offsetHeight-4);win.style.left=`${Math.min(maxX,parseFloat(win.style.left)||4)}px`;win.style.top=`${Math.min(maxY,parseFloat(win.style.top)||4)}px`;});});
})();
