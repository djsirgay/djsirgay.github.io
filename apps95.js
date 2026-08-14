(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- DJSGAMP: make the music the obvious primary action ---------------- */
  const fresh = $('#fresh');
  const freshRail = $('#fresh-rail');
  if (fresh && freshRail && !$('.djsgamp-console', fresh)) {
    const consoleEl = document.createElement('div');
    consoleEl.className = 'djsgamp-console';
    consoleEl.innerHTML = `<div class="djsgamp-art"><img alt="Current DJ Sir Gay release"></div>
      <div class="djsgamp-display">
        <p class="djsgamp-label">DJSGAMP / selected file</p>
        <div class="djsgamp-title">Loading playlist…</div>
        <div class="djsgamp-meta"><span class="djsgamp-index">01</span><span class="djsgamp-duration">Fresh release</span></div>
        <div class="djsgamp-eq" aria-hidden="true">${Array.from({length:24},()=>'<i></i>').join('')}</div>
      </div>
      <div class="djsgamp-actions">
        <button type="button" class="djsgamp-play">▶ PLAY</button>
        <a class="djsgamp-youtube" href="https://www.youtube.com/@NostalgAiRec" target="_blank" rel="noreferrer">YouTube ↗</a>
        <a href="https://t.me/djsirgay" target="_blank" rel="noreferrer">Telegram ↗</a>
        <button type="button" class="djsgamp-copy">Copy link</button>
        <div class="djsgamp-copy-status" aria-live="polite"></div>
      </div>`;
    fresh.querySelector('.carousel-shell')?.insertAdjacentElement('beforebegin', consoleEl);

    let currentCard = null;
    const art = $('.djsgamp-art img', consoleEl);
    const title = $('.djsgamp-title', consoleEl);
    const indexEl = $('.djsgamp-index', consoleEl);
    const duration = $('.djsgamp-duration', consoleEl);
    const youtube = $('.djsgamp-youtube', consoleEl);
    const copyStatus = $('.djsgamp-copy-status', consoleEl);

    const cards = () => $$('.fresh-card', freshRail);
    const selectCard = card => {
      if (!card) return;
      currentCard = card;
      cards().forEach(node => node.removeAttribute('aria-current'));
      card.setAttribute('aria-current', 'true');
      const cardTitle = $('h3', card)?.textContent?.trim() || 'DJ Sir Gay release';
      const cardMeta = $('small', card)?.textContent?.trim() || 'Fresh release';
      const img = $('img', card)?.src || '';
      const position = Math.max(0, cards().indexOf(card));
      title.textContent = cardTitle;
      duration.textContent = cardMeta;
      indexEl.textContent = String(position + 1).padStart(2, '0');
      if (img) art.src = img;
      youtube.href = card.href || 'https://www.youtube.com/@NostalgAiRec';
      const task = $('.os95-task-btn[data-os-target="#fresh"]');
      if (task) task.textContent = `♫ ${cardTitle}`;
    };

    const sync = () => {
      const list = cards();
      if (!list.length) return;
      if (!currentCard || !currentCard.isConnected) selectCard(list[0]);
    };
    sync();
    new MutationObserver(sync).observe(freshRail, { childList: true, subtree: true });

    freshRail.addEventListener('click', event => {
      const card = event.target.closest('.fresh-card');
      if (card) selectCard(card);
    }, true);

    $('.djsgamp-play', consoleEl).addEventListener('click', () => {
      if (!currentCard) return;
      currentCard.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });
    $('.djsgamp-copy', consoleEl).addEventListener('click', async () => {
      const value = currentCard?.href || location.href;
      try {
        await navigator.clipboard.writeText(value);
        copyStatus.textContent = 'Copied.';
      } catch (_) {
        copyStatus.textContent = value;
      }
      setTimeout(() => { copyStatus.textContent = ''; }, 1800);
    });
  }

  /* ---------------- shared app helpers ---------------- */
  const closeExistingApp = () => $('.djsg-app-layer')?.remove();
  const makeApp = (title, className = '') => {
    closeExistingApp();
    const layer = document.createElement('div');
    layer.className = 'djsg-app-layer';
    layer.innerHTML = `<section class="djsg-app-window ${className}" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="djsg-app-titlebar">${title}<button type="button" class="djsg-app-close" aria-label="Close">×</button></div>
      <div class="djsg-app-content"></div>
    </section>`;
    document.body.append(layer);
    $('.djsg-app-close', layer).addEventListener('click', () => layer.remove());
    layer.addEventListener('click', event => { if (event.target === layer) layer.remove(); });
    return { layer, content: $('.djsg-app-content', layer) };
  };

  const paintIcon = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="21" fill="#fff" stroke="#000"/><rect x="6" y="7" width="20" height="13" fill="#ffffdf"/><path d="M8 18c3-10 15-10 17-2 1 4-4 3-5 5-2 2-1 5-5 5-6 0-10-3-7-8z" fill="#d8aa70" stroke="#000"/><circle cx="13" cy="14" r="2" fill="#f00"/><circle cx="18" cy="13" r="2" fill="#00f"/><circle cx="21" cy="17" r="2" fill="#0a0"/><path d="M22 5l5-4 2 2-5 4z" fill="#808080" stroke="#000"/></svg>`;

  const shortcuts = $('.os95-shortcuts');
  if (shortcuts && !$('.djsg-app-shortcut[data-app="paint"]', shortcuts)) {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'os95-shortcut djsg-app-shortcut';
    link.dataset.app = 'paint';
    link.innerHTML = `${paintIcon}<span>SERGEY.BMP</span>`;
    shortcuts.insertBefore(link, shortcuts.children[1] || null);
    link.addEventListener('click', event => { event.preventDefault(); openPaint(); });
  }

  const startLinks = $('.os95-start-links');
  if (startLinks && !$('#djsg-paint-launch')) {
    const firstHr = $('hr', startLinks);
    const paint = document.createElement('button');
    paint.type = 'button';
    paint.id = 'djsg-paint-launch';
    paint.innerHTML = '<span class="os95-menu-glyph">🎨</span><span><strong>Paint.exe</strong><br>Open SERGEY.BMP</span>';
    startLinks.insertBefore(paint, firstHr || null);
    paint.addEventListener('click', () => {
      $('#os95-start-menu')?.classList.remove('open');
      $('#os95-start-btn')?.setAttribute('aria-expanded', 'false');
      openPaint();
    });
  }

  function extractHeroDataUrl() {
    return '/assets/dj-sir-gay-paint-v2.webp';
  }

  // Desktop Reality can call Paint directly even if its own script wins the load race.
  window.openDJSGPaint = openPaint;

  function openPaint() {
    const { content } = makeApp('untitled - Paint', 'paint-window');
    content.innerHTML = `<div class="djsg-menubar"><span>File</span><span>Edit</span><span>View</span><span>Image</span><span>Colors</span><span>Help</span></div>
      <div class="paint-layout">
        <div class="paint-tools">
          <button class="paint-tool active" type="button" data-tool="pencil" title="Pencil">✎</button>
          <button class="paint-tool" type="button" data-tool="brush" title="Brush">🖌</button>
          <button class="paint-tool" type="button" data-tool="spray" title="Airbrush">░</button>
          <button class="paint-tool" type="button" data-tool="eraser" title="Eraser">▱</button>
          <select class="paint-size" aria-label="Brush size"><option value="2">2 px</option><option value="5">5 px</option><option value="10">10 px</option><option value="18">18 px</option></select>
        </div>
        <div class="paint-stage"><div class="paint-canvas-wrap"><canvas id="djsg-paint-canvas" width="800" height="1000" aria-busy="true"></canvas></div></div>
      </div>
      <div class="paint-bottom">
        <div class="paint-colors" aria-label="Colors"></div>
        <div class="paint-status">Loading SERGEY.BMP…</div>
      </div>
      <div class="paint-actions"><button type="button" data-paint-action="undo">Undo</button><button type="button" data-paint-action="reset">Restore photo</button><button type="button" data-paint-action="save">Save masterpiece.png</button><button type="button" data-paint-action="share">Share…</button><button type="button" data-paint-action="email">Save + email Sergey</button></div>`;

    const canvas = $('#djsg-paint-canvas', content);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const palette = ['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ff7f00','#7f3f00','#ffb6c1','#6a5acd','#00a86b','#ffd700','#ffffff','#222222','#e8d7b5','#ff69b4','#7fff00','#00bfff'];
    const colors = $('.paint-colors', content);
    palette.forEach((color, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = `paint-color${i === 0 ? ' active' : ''}`; button.style.background = color; button.dataset.color = color; button.title = color;
      colors.append(button);
    });

    let color = '#000000';
    let tool = 'pencil';
    let size = 2;
    let drawing = false;
    let last = null;
    let ready = false;
    const history = [];
    let pristine = null;

    const status = $('.paint-status', content);
    const setStatus = text => { status.textContent = text; };
    const snapshot = () => {
      try {
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (history.length > 12) history.shift();
      } catch (_) {}
    };

    const drawFallback = () => {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#000080'; ctx.font = 'bold 52px Tahoma, sans-serif'; ctx.fillText('SERGEY.BMP', 55, 100);
      ctx.fillStyle = '#000'; ctx.font = '24px Tahoma, sans-serif'; ctx.fillText('Photo driver unavailable. Please vandalize this instead.', 55, 145);
      pristine = ctx.getImageData(0,0,canvas.width,canvas.height);
      ready = true;
      canvas.setAttribute('aria-busy', 'false');
    };

    const source = extractHeroDataUrl();
    if (source) {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        const w = image.width * scale, h = image.height * scale;
        ctx.fillStyle = '#d8dce6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        pristine = ctx.getImageData(0,0,canvas.width,canvas.height);
        ready = true;
        canvas.setAttribute('aria-busy', 'false');
        setStatus('SERGEY.BMP — Paint is ready. Be disrespectful, artistically.');
      };
      image.onerror = drawFallback;
      image.src = source;
    } else drawFallback();

    colors.addEventListener('click', event => {
      const swatch = event.target.closest('.paint-color');
      if (!swatch) return;
      color = swatch.dataset.color;
      $$('.paint-color', colors).forEach(el => el.classList.toggle('active', el === swatch));
    });
    $('.paint-tools', content).addEventListener('click', event => {
      const button = event.target.closest('[data-tool]');
      if (!button) return;
      tool = button.dataset.tool;
      $$('.paint-tool', content).forEach(el => el.classList.toggle('active', el === button));
    });
    $('.paint-size', content).addEventListener('change', event => { size = Number(event.target.value) || 2; });

    const point = event => {
      const rect = canvas.getBoundingClientRect();
      return { x:(event.clientX - rect.left) * canvas.width / rect.width, y:(event.clientY - rect.top) * canvas.height / rect.height };
    };
    const stroke = (a,b) => {
      ctx.save();
      ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'pencil' ? Math.max(1,size) : tool === 'eraser' ? Math.max(12,size*2) : size;
      if (tool === 'spray') {
        ctx.fillStyle = color;
        for (let i=0;i<Math.max(8,size*2);i++) {
          const angle=Math.random()*Math.PI*2, radius=Math.random()*size*1.8;
          ctx.fillRect(b.x+Math.cos(angle)*radius,b.y+Math.sin(angle)*radius,1.5,1.5);
        }
      } else {
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
      ctx.restore();
    };
    canvas.addEventListener('pointerdown', event => {
      if (!ready) { setStatus('Loading SERGEY.BMP… one very dramatic second.'); return; }
      event.preventDefault(); snapshot(); drawing=true; last=point(event); canvas.setPointerCapture(event.pointerId); stroke(last,last);
    });
    canvas.addEventListener('pointermove', event => { if (!drawing) return; const p=point(event); stroke(last,p); last=p; });
    const stop = () => { drawing=false; last=null; };
    canvas.addEventListener('pointerup', stop); canvas.addEventListener('pointercancel', stop);

    const toBlob = () => new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const download = async () => {
      const blob = await toBlob(); if (!blob) return null;
      const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='SERGEY_MASTERPIECE.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); return blob;
    };

    $('.paint-actions', content).addEventListener('click', async event => {
      const action = event.target.closest('[data-paint-action]')?.dataset.paintAction;
      if (!action) return;
      if (action === 'undo' && history.length) ctx.putImageData(history.pop(),0,0);
      if (action === 'reset' && pristine) { snapshot(); ctx.putImageData(pristine,0,0); }
      if (action === 'save') { await download(); setStatus('Saved. The evidence is now on your device.'); }
      if (action === 'share') {
        const blob = await toBlob(); if (!blob) return;
        const file = new File([blob], 'SERGEY_MASTERPIECE.png', { type:'image/png' });
        if (navigator.canShare?.({files:[file]})) {
          try { await navigator.share({ title:'I ruined DJ Sir Gay in Paint.exe', text:'Made inside DJ Sir Gay.exe', files:[file] }); setStatus('Shared. Art history has been altered.'); } catch (_) {}
        } else { await download(); setStatus('File sharing is not available here, so I saved the PNG instead.'); }
      }
      if (action === 'email') {
        await download();
        location.href='mailto:ulyanoow@gmail.com?subject=I%20ruined%20SERGEY.BMP&body=I%20made%20something%20in%20Paint.exe.%20The%20PNG%20was%20saved%20to%20my%20device%20%E2%80%94%20attaching%20it%20here.';
      }
    });
  }

  /* ---------------- Solitaire.exe: real click/touch Klondike ---------------- */
  const oldSolitaire = $('#os95-solitaire');
  if (oldSolitaire) {
    const replacement = oldSolitaire.cloneNode(true);
    oldSolitaire.replaceWith(replacement);
    replacement.addEventListener('click', () => {
      $('#os95-start-menu')?.classList.remove('open');
      $('#os95-start-btn')?.setAttribute('aria-expanded','false');
      openSolitaire();
    });
  }

  function openSolitaire() {
    const { content } = makeApp('Solitaire.exe', 'solitaire-window');
    content.innerHTML = `<div class="djsg-menubar"><span>Game</span><span>Help</span></div>
      <div class="sol-toolbar"><button type="button" data-sol-new>New game</button><button type="button" data-sol-hint>Hint</button><span class="sol-status">Build down alternating colors. Aces go home.</span></div>
      <div class="solitaire-board">
        <div class="sol-top"><div class="sol-pile stock" data-sol-stock></div><div class="sol-pile waste" data-sol-waste></div><div></div>${[0,1,2,3].map(i=>`<div class="sol-pile foundation" data-sol-foundation="${i}"></div>`).join('')}</div>
        <div class="sol-tableau">${[0,1,2,3,4,5,6].map(i=>`<div class="sol-column" data-sol-column="${i}"></div>`).join('')}</div>
      </div>`;

    const suits = ['♠','♥','♦','♣'];
    const foundationSuit = ['♠','♥','♦','♣'];
    let stock, waste, foundations, tableau, selection, won;
    const status = $('.sol-status', content);

    const colorOf = suit => (suit === '♥' || suit === '♦') ? 'red' : 'black';
    const rankText = rank => ({1:'A',11:'J',12:'Q',13:'K'})[rank] || String(rank);
    const makeDeck = () => suits.flatMap(suit => Array.from({length:13},(_,i)=>({suit,rank:i+1,faceUp:false,id:`${suit}${i+1}-${Math.random().toString(36).slice(2)}`})));
    const shuffle = deck => { for(let i=deck.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; } return deck; };

    const newGame = () => {
      const deck = shuffle(makeDeck());
      tableau = Array.from({length:7},()=>[]);
      for (let col=0; col<7; col++) {
        for (let row=0; row<=col; row++) {
          const card = deck.pop(); card.faceUp = row === col; tableau[col].push(card);
        }
      }
      stock = deck.map(card => ({...card,faceUp:false})); waste=[]; foundations=[[],[],[],[]]; selection=null; won=false;
      status.textContent='Build down alternating colors. Aces go home.'; render();
    };

    const selectedCards = () => {
      if (!selection) return [];
      if (selection.source==='waste') return waste.length ? [waste[waste.length-1]] : [];
      if (selection.source==='foundation') return foundations[selection.pile].length ? [foundations[selection.pile][foundations[selection.pile].length-1]] : [];
      return tableau[selection.col].slice(selection.index);
    };
    const canTableau = (card,col) => {
      const dest=tableau[col], top=dest[dest.length-1];
      if (!top) return card.rank===13;
      return top.faceUp && top.rank===card.rank+1 && colorOf(top.suit)!==colorOf(card.suit);
    };
    const canFoundation = (card,pile) => {
      if (card.suit!==foundationSuit[pile]) return false;
      const dest=foundations[pile], top=dest[dest.length-1];
      return top ? card.rank===top.rank+1 : card.rank===1;
    };
    const clearSelection = () => { selection=null; render(); };
    const takeSelection = () => {
      const cards=selectedCards(); if (!cards.length) return [];
      if (selection.source==='waste') waste.pop();
      if (selection.source==='foundation') foundations[selection.pile].pop();
      if (selection.source==='tableau') tableau[selection.col].splice(selection.index);
      return cards;
    };
    const moveToTableau = col => {
      const cards=selectedCards(); if (!cards.length || !canTableau(cards[0],col) || (selection.source==='tableau' && selection.col===col)) return false;
      tableau[col].push(...takeSelection()); selection=null; afterMove(); return true;
    };
    const moveToFoundation = pile => {
      const cards=selectedCards();
      if (cards.length!==1 || !canFoundation(cards[0],pile)) return false;
      if (selection.source==='tableau' && selection.index!==tableau[selection.col].length-1) return false;
      foundations[pile].push(takeSelection()[0]); selection=null; afterMove(); return true;
    };
    const afterMove = () => {
      if (foundations.every(f=>f.length===13)) { won=true; status.textContent='You won. Productivity has been permanently disabled.'; if (!reducedMotion) document.body.classList.add('os95-glitch'); setTimeout(()=>document.body.classList.remove('os95-glitch'),500); }
      render();
    };
    const autoFoundation = sel => {
      selection=sel; const cards=selectedCards(); if(cards.length!==1) return clearSelection();
      const pile=foundationSuit.indexOf(cards[0].suit); if(!moveToFoundation(pile)) clearSelection();
    };

    const cardHtml = (card, attrs='') => {
      if (!card.faceUp) return `<button class="sol-card back" type="button" ${attrs} aria-label="Face-down card"></button>`;
      return `<button class="sol-card ${colorOf(card.suit)}" type="button" ${attrs} aria-label="${rankText(card.rank)} ${card.suit}"><span class="sol-rank">${rankText(card.rank)}</span><span class="sol-suit">${card.suit}</span></button>`;
    };

    function render() {
      const stockEl=$('[data-sol-stock]',content), wasteEl=$('[data-sol-waste]',content);
      stockEl.innerHTML=stock.length?`${cardHtml({faceUp:false},'data-action="stock"')}<span class="sol-stock-count">${stock.length}</span>`:'<button class="sol-card" type="button" data-action="stock" aria-label="Recycle waste">↻</button>';
      wasteEl.innerHTML=waste.length?cardHtml(waste[waste.length-1],'data-source="waste"'):'';
      foundations.forEach((pile,i)=>{ const el=$(`[data-sol-foundation="${i}"]`,content); el.innerHTML=pile.length?cardHtml(pile[pile.length-1],`data-source="foundation" data-pile="${i}"`):''; });
      tableau.forEach((col,ci)=>{
        const el=$(`[data-sol-column="${ci}"]`,content); el.innerHTML=''; let y=0;
        col.forEach((card,index)=>{
          const wrap=document.createElement('div'); wrap.innerHTML=cardHtml(card,`data-source="tableau" data-col="${ci}" data-index="${index}"`); const node=wrap.firstElementChild; node.style.top=`${y}px`; node.classList.toggle('selected', selection?.source==='tableau' && selection.col===ci && index>=selection.index); el.append(node); y += card.faceUp ? 25 : 16;
        });
        el.style.minHeight=`${Math.max(390,y+100)}px`;
      });
      const wasteCard=$('[data-source="waste"]',content); if(wasteCard) wasteCard.classList.toggle('selected',selection?.source==='waste');
      foundations.forEach((_,i)=>{ const card=$(`[data-source="foundation"][data-pile="${i}"]`,content); if(card) card.classList.toggle('selected',selection?.source==='foundation'&&selection.pile===i); });
    }

    content.addEventListener('click', event => {
      const target=event.target.closest('button,.sol-pile,.sol-column'); if(!target || won) return;
      if (target.matches('[data-sol-new]')) return newGame();
      if (target.matches('[data-sol-hint]')) {
        const ace=waste[waste.length-1];
        status.textContent = ace && canFoundation(ace,foundationSuit.indexOf(ace.suit)) ? 'Hint: the waste card can go to a foundation.' : 'Hint: look for a face-down tableau card you can uncover.'; return;
      }
      if (target.dataset.action==='stock' || target.closest('[data-sol-stock]')) {
        if(stock.length){ const card=stock.pop(); card.faceUp=true; waste.push(card); }
        else if(waste.length){ stock=waste.reverse().map(card=>({...card,faceUp:false})); waste=[]; }
        selection=null; render(); return;
      }
      const foundation=target.closest('[data-sol-foundation]');
      if(foundation && !target.dataset.source){ if(selection) moveToFoundation(Number(foundation.dataset.solFoundation)); return; }
      const column=target.closest('[data-sol-column]');
      if(column && !target.dataset.source){ if(selection) moveToTableau(Number(column.dataset.solColumn)); return; }

      if(target.dataset.source==='waste') { selection = selection?.source==='waste' ? null : {source:'waste'}; render(); return; }
      if(target.dataset.source==='foundation') { const pile=Number(target.dataset.pile); selection = selection?.source==='foundation'&&selection.pile===pile ? null : {source:'foundation',pile}; render(); return; }
      if(target.dataset.source==='tableau') {
        const col=Number(target.dataset.col), index=Number(target.dataset.index), card=tableau[col][index];
        if(!card.faceUp){ if(index===tableau[col].length-1){ card.faceUp=true; selection=null; render(); } return; }
        if(selection){ if(moveToTableau(col)) return; }
        selection = selection?.source==='tableau'&&selection.col===col&&selection.index===index ? null : {source:'tableau',col,index}; render();
      }
    });

    content.addEventListener('dblclick', event => {
      const target=event.target.closest('.sol-card[data-source]'); if(!target || won) return;
      if(target.dataset.source==='waste') return autoFoundation({source:'waste'});
      if(target.dataset.source==='tableau') {
        const col=Number(target.dataset.col), index=Number(target.dataset.index);
        if(index===tableau[col].length-1 && tableau[col][index].faceUp) autoFoundation({source:'tableau',col,index});
      }
    });

    $('[data-sol-new]',content).addEventListener('click',newGame);
    newGame();
  }
})();
