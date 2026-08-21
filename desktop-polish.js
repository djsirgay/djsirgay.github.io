(() => {
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const desktop = $('#djsg-desktop');
  if (!desktop || document.documentElement.dataset.desktopPolish === '1') return;
  document.documentElement.dataset.desktopPolish = '1';

  const taskItems = $('.os95-task-items');
  if (!taskItems) return;

  const titleOf = win => $('.dr-path',win)?.textContent?.trim() || win.dataset.window || 'Window';
  const labelOf = win => {
    const raw = titleOf(win);
    if (/WINAMP/i.test(raw)) return '♫ WINAMP';
    if (/VISUALIZATIONS/i.test(raw)) return '✺ Visualizer';
    if (/Media Player/i.test(raw)) return '▶ Media Player';
    if (/BOOKING|PUT_ME_IN/i.test(raw)) return '✉ BOOK ME';
    if (/Yahoo|Internet Explorer/i.test(raw)) return '🌐 Browser';
    if (/STAY_FUCKING/i.test(raw)) return '▤ STATUS';
    if (/PROJECTS\\?$/i.test(raw)) return '▣ D:\\PROJECTS';
    if (/PROJECTS/i.test(raw)) return '▣ Project';
    if (/COVERS|SELECTED\.BMP/i.test(raw)) return '▧ Cover';
    if (/README/i.test(raw)) return '▤ README';
    return raw.split('\\').pop().slice(0,28);
  };

  const ytCommand = (iframe, func) => {
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({event:'command',func,args:[]}), 'https://www.youtube.com');
  };

  const ensureYoutubeApi = iframe => {
    if (!iframe?.src || iframe.src === 'about:blank' || iframe.src.includes('enablejsapi=1')) return;
    try {
      const url=new URL(iframe.src);
      if (!/youtube\.com$/i.test(url.hostname) && !/youtube-nocookie\.com$/i.test(url.hostname)) return;
      url.searchParams.set('enablejsapi','1');
      url.searchParams.set('origin',location.origin);
      iframe.src=url.toString();
    } catch(_) {}
  };

  const prepareWmp = win => {
    if (!win || win.dataset.wmpPolished === '1') return;
    win.dataset.wmpPolished='1';
    const iframe=$('iframe',win);
    ensureYoutubeApi(iframe);
    if (iframe) new MutationObserver(()=>ensureYoutubeApi(iframe)).observe(iframe,{attributes:true,attributeFilter:['src']});
    const controls=$$('.dr-wmp-controls>button',win);
    controls[0]?.addEventListener('click',()=>ytCommand(iframe,'playVideo'));
    controls[1]?.addEventListener('click',()=>ytCommand(iframe,'pauseVideo'));
    controls[2]?.addEventListener('click',()=>ytCommand(iframe,'stopVideo'));
    $('[data-close]',win)?.addEventListener('click',()=>ytCommand(iframe,'stopVideo'),true);
  };

  const ensureTask = win => {
    const id = win.dataset.window;
    if (!id) return null;
    let btn = [...taskItems.querySelectorAll('[data-dr-task]')].find(node => node.dataset.drTask === id);
    if (!btn) {
      btn = document.createElement('button');
      btn.type='button';
      btn.className='dr-task-btn';
      btn.dataset.drTask=id;
      btn.innerHTML=`<span>${labelOf(win)}</span>`;
      btn.addEventListener('click',()=>{
        const closed = win.classList.contains('hidden');
        const minimized = win.classList.contains('minimized');
        if (closed || minimized) {
          win.classList.remove('hidden','minimized');
          win.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'mouse'}));
        } else if (win.classList.contains('active')) {
          win.classList.add('minimized');
          win.classList.remove('active');
        } else {
          win.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'mouse'}));
        }
        sync();
      });
      taskItems.append(btn);
    }
    $('span',btn).textContent=labelOf(win);
    return btn;
  };

  const sync = () => {
    const wins = $$('.dr-window',desktop);
    const ids = new Set();
    wins.forEach(win=>{
      const id=win.dataset.window; if(!id)return; ids.add(id);
      const btn=ensureTask(win);
      const open=!win.classList.contains('hidden');
      const visible=open&&!win.classList.contains('minimized');
      btn.style.display=open?'flex':'none';
      btn.classList.toggle('active',visible&&win.classList.contains('active'));
    });
    $$('.dr-task-btn',taskItems).forEach(btn=>{if(!ids.has(btn.dataset.drTask))btn.remove();});
  };

  const wireWindow = win => {
    if (win.dataset.polished==='1') return;
    win.dataset.polished='1';
    if(win.dataset.window==='wmp')prepareWmp(win);
    const bar=$('.dr-titlebar',win);
    bar?.addEventListener('dblclick',e=>{
      if(e.target.closest('button'))return;
      win.classList.toggle('maximized');
      win.classList.remove('minimized');
      sync();
    });
    $('[data-min]',win)?.addEventListener('click',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      win.classList.add('minimized');
      win.classList.remove('active');
      sync();
    },true);
    $('[data-close]',win)?.addEventListener('click',()=>setTimeout(sync,0),true);
    win.addEventListener('pointerdown',()=>setTimeout(sync,0));
  };

  let ordering=false;
  const reorderIcons = () => {
    if(ordering)return;
    const icons=$('.dr-icons',desktop); if(!icons)return;
    const find=text=>$$('.dr-icon',icons).find(el=>$('span',el)?.textContent===text);
    const order=['WINAMP.EXE','BOOK_ME.EXE','SERGEY.BMP'];
    ordering=true;
    order.forEach((name,index)=>{
      const el=find(name); if(!el)return;
      const target=icons.children[index]||null;
      if(target!==el)icons.insertBefore(el,target);
    });
    ordering=false;
  };

  let selectBox=null,start=null;
  desktop.addEventListener('pointerdown',e=>{
    if(e.target!==desktop || e.pointerType==='touch')return;
    start={x:e.clientX,y:e.clientY};
    selectBox=document.createElement('div');
    selectBox.className='dr-desktop-selection';
    desktop.append(selectBox);
    desktop.setPointerCapture?.(e.pointerId);
  });
  desktop.addEventListener('pointermove',e=>{
    if(!selectBox||!start)return;
    const r=desktop.getBoundingClientRect();
    const x=Math.min(start.x,e.clientX)-r.left,y=Math.min(start.y,e.clientY)-r.top;
    selectBox.style.left=`${x}px`;selectBox.style.top=`${y}px`;
    selectBox.style.width=`${Math.abs(e.clientX-start.x)}px`;selectBox.style.height=`${Math.abs(e.clientY-start.y)}px`;
  });
  const endSelect=()=>{selectBox?.remove();selectBox=null;start=null};
  desktop.addEventListener('pointerup',endSelect);desktop.addEventListener('pointercancel',endSelect);

  const observer=new MutationObserver(()=>{
    $$('.dr-window',desktop).forEach(wireWindow);
    reorderIcons();sync();
  });
  observer.observe(desktop,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  $$('.dr-window',desktop).forEach(wireWindow);
  reorderIcons();sync();
})();
