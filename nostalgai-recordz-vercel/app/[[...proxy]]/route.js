const UPSTREAM = 'https://nostalgairecordz.com';

const EDITIONS = {
  grey: {
    slug: 'grey',
    href: '/releases/ray-grey',
    name: 'Ocean Wave Grey',
    tier: 'Standard Edition',
    number: 'NRZ-009G',
    image: 'https://djsirgay.com/sergey-ray/assets/ocean-wave-grey.svg',
    detail: '2026 · 12″ LP · Standard printed package',
    features: ['12″ black vinyl', 'Ocean Wave Grey outer sleeve', 'Standard inner sleeve'],
  },
  blue: {
    slug: 'blue',
    href: '/releases/ray-blue',
    name: 'DreamWash Blue',
    tier: 'Deluxe Edition',
    number: 'NRZ-009B',
    image: 'https://djsirgay.com/sergey-ray/assets/dreamwash-blue.svg',
    detail: '2026 · 12″ LP + 12-page booklet · Deluxe edition',
    features: ['12″ black vinyl', 'DreamWash Blue outer sleeve', 'Printed inner sleeve', '12-page booklet'],
  },
  pink: {
    slug: 'pink',
    href: '/releases/ray-pink',
    name: 'Candy Melt Pink',
    tier: 'Collector’s Edition',
    number: 'NRZ-009P',
    image: 'https://djsirgay.com/sergey-ray/assets/candy-melt-pink.svg',
    detail: '2026 · 12″ LP + alternate sleeve + booklet · Collector’s edition',
    features: ['12″ black vinyl', 'Candy Melt Pink outer sleeve', 'Alternate printed inner sleeve', 'Collector-specific 12-page booklet'],
  },
};

const HOME_CSS = `<style id="nrz-ray-editions-css">
.nrz-ray-grey .cover-wrap{background:#d7d7d7}.nrz-ray-blue .cover-wrap{background:#d8e8f7}.nrz-ray-pink .cover-wrap{background:#f0d8e6}
.nrz-ray-card .status b{display:block}.nrz-ray-card .cover-wrap img{object-fit:cover}
.nrz-cart-float{position:fixed;right:18px;bottom:18px;z-index:99999;background:#12110f;color:#f2efe7!important;border:1px solid #f2efe7;padding:13px 16px;font:700 11px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.28)}
.nrz-cart-float:hover{background:#e74d8e}@media(max-width:700px){.nrz-cart-float{right:12px;bottom:12px}}
</style>`;

const HOME_SCRIPT = `<script id="nrz-ray-editions-script">(()=>{
const editions=${JSON.stringify(EDITIONS)};
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function setText(el,text){if(el)el.textContent=text}
function edit(card,key){
  const e=editions[key]; if(!card||!e)return;
  card.classList.remove('nrz-ray-grey','nrz-ray-blue','nrz-ray-pink');
  card.classList.add('nrz-ray-card','nrz-ray-'+key);
  qa('a',card).forEach(a=>{const h=a.getAttribute('href')||'';if(h.includes('/releases/ray')||a.classList.contains('card-buy')){a.href=e.href+(a.classList.contains('card-buy')?'#preorder':'');a.removeAttribute('target');a.removeAttribute('rel')}});
  const img=q('.cover-wrap img',card)||q('img',card);if(img){img.src=e.image;img.srcset='';img.alt='Sergéy — RAY — '+e.name+' — '+e.tier}
  setText(q('.release-meta h3',card)||q('h3',card),e.name);
  setText(q('.release-number',card),e.number);
  setText(q('.release-detail',card),e.detail);
  const s=q('.status',card);if(s)s.innerHTML='<b>'+e.tier+'</b>Pre-order open';
  const buy=q('.card-buy',card);if(buy){const z=q('span',buy);setText(z||buy,'Choose '+e.tier.replace(' Edition',''))}
}
function replaceUndefined(root=document){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/undefined copies/i.test(n.nodeValue||''))n.nodeValue=(n.nodeValue||'').replace(/Only\s+undefined copies/ig,'Pre-order open').replace(/undefined copies/ig,'Pre-order open')}}
function run(){
  if(location.pathname!=='/')return;
  const grid=q('.release-grid,#catalog-grid');if(!grid)return;
  let base=qa('article',grid).find(a=>qa('a',a).some(x=>(x.getAttribute('href')||'').includes('/releases/ray')))||q('.nrz-ray-card',grid);if(!base)return;
  let cards=qa('.nrz-ray-card',grid);
  if(!cards.length){base.classList.add('nrz-ray-card');cards=[base]}
  while(cards.length<3){const clone=base.cloneNode(true);cards[cards.length-1].insertAdjacentElement('afterend',clone);cards.push(clone)}
  edit(cards[0],'grey');edit(cards[1],'blue');edit(cards[2],'pink');
  qa('.nrz-ray-card',grid).slice(3).forEach(x=>x.remove());
  qa('.section-heading>p').forEach(p=>{if(/records|editions/i.test(p.textContent||'')&&/09|10|undefined/i.test(p.textContent||''))p.textContent='11 editions · 9 releases'});
  replaceUndefined();
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;run()})};
run();new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();</script>`;

const RAY_CSS = `<style id="nrz-ray-selector-css">
.nrz-editions{background:#0e0e0e;color:#f5f1e9;padding:28px clamp(18px,5vw,72px);border-bottom:1px solid #ffffff30;font-family:Arial,sans-serif}
.nrz-editions-head{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:18px}.nrz-editions-kicker{font:700 10px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.65}.nrz-editions h2{font:400 clamp(28px,4vw,55px)/.95 Georgia,serif;margin:8px 0 0}.nrz-editions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.nrz-edition{display:grid;grid-template-columns:88px 1fr;gap:14px;align-items:center;color:inherit;text-decoration:none;border:1px solid #ffffff30;padding:10px;background:#171717;transition:.2s}.nrz-edition:hover,.nrz-edition.active{border-color:#fff;background:#242424}.nrz-edition img{width:88px;height:88px;object-fit:cover}.nrz-edition strong{display:block;font:400 22px/1 Georgia,serif}.nrz-edition span{display:block;margin-top:6px;font:700 9px/1.35 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;opacity:.7}.nrz-current-features{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.nrz-current-features span{border:1px solid #ffffff35;border-radius:20px;padding:7px 10px;font:700 9px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}.nrz-edition-label{display:inline-flex!important;padding:7px 10px!important;border:1px solid currentColor!important;border-radius:20px!important;font:700 10px ui-monospace,monospace!important;letter-spacing:.1em!important;text-transform:uppercase!important;margin-bottom:10px!important}.nrz-edition-name{font-family:Georgia,serif!important}
@media(max-width:800px){.nrz-editions-grid{grid-template-columns:1fr}.nrz-edition{grid-template-columns:70px 1fr}.nrz-edition img{width:70px;height:70px}}
</style>`;

function rayScript(activeKey) {
  return `<script id="nrz-ray-selector-script">(()=>{
  const editions=${JSON.stringify(EDITIONS)},key=${JSON.stringify(activeKey)},e=editions[key]||editions.grey;
  function replaceUndefined(root=document){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/undefined copies/i.test(n.nodeValue||''))n.nodeValue=(n.nodeValue||'').replace(/Only\s+undefined copies/ig,'Pre-order open').replace(/undefined copies/ig,'Pre-order open')}}
  function selector(){const items=Object.values(editions).map(x=>'<a class="nrz-edition '+(x.slug===key?'active':'')+'" href="'+x.href+'"><img src="'+x.image+'" alt="'+x.name+'"><div><strong>'+x.name+'</strong><span>'+x.tier+'</span></div></a>').join('');const features=e.features.map(x=>'<span>'+x+'</span>').join('');const wrap=document.createElement('section');wrap.className='nrz-editions';wrap.innerHTML='<div class="nrz-editions-head"><div><div class="nrz-editions-kicker">Sergéy — RAY · 10th Anniversary Edition</div><h2>Choose your physical edition.</h2></div></div><div class="nrz-editions-grid">'+items+'</div><div class="nrz-current-features">'+features+'</div>';const main=document.querySelector('main');(main||document.body).insertAdjacentElement(main?'beforebegin':'afterbegin',wrap)}
  function apply(){if(document.querySelector('.nrz-editions'))return;selector();replaceUndefined();document.title='Sergéy — RAY — '+e.name+' — '+e.tier+' | Nostalgai Recordz';const imgs=[...document.querySelectorAll('main img,[class*=cover] img,[class*=product] img')];const img=imgs.find(x=>/ray/i.test((x.alt||'')+' '+(x.src||'')))||imgs[0];if(img){img.src=e.image;img.srcset='';img.alt='Sergéy — RAY — '+e.name+' — '+e.tier}const h=[...document.querySelectorAll('h1,h2,h3')].find(x=>/^ray$/i.test((x.textContent||'').trim())||/serg.*ray/i.test(x.textContent||''));if(h){const label=document.createElement('span');label.className='nrz-edition-label';label.textContent=e.tier;h.insertAdjacentElement('beforebegin',label);h.classList.add('nrz-edition-name')}const detail=[...document.querySelectorAll('p,li,span')].find(x=>/12[″”"]?\s*LP.*booklet|artist album/i.test(x.textContent||''));if(detail)detail.textContent=e.detail;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();setTimeout(replaceUndefined,800);
  })();</script>`;
}

function cleanHeaders(req) {
  const h = new Headers(req.headers);
  ['host', 'connection', 'content-length', 'accept-encoding', 'x-forwarded-host', 'x-forwarded-proto'].forEach((k) => h.delete(k));
  return h;
}

function target(parts, req, overridePath) {
  const incoming = new URL(req.url);
  const u = new URL(overridePath || '/' + parts.join('/'), UPSTREAM);
  u.search = incoming.search;
  return u;
}

function editionForPath(path) {
  if (/ray-pink\/?$/.test(path)) return 'pink';
  if (/ray-blue\/?$/.test(path)) return 'blue';
  return 'grey';
}

export async function GET(req, { params }) {
  const p = await params;
  const parts = p.proxy || [];
  const path = '/' + parts.join('/');
  const isRay = /^\/releases\/ray(?:-grey|-blue|-pink)?\/?$/.test(path);
  const upstreamPath = isRay ? '/releases/ray' : undefined;
  const r = await fetch(target(parts, req, upstreamPath), {
    headers: cleanHeaders(req),
    redirect: 'manual',
    cache: 'no-store',
  });
  const h = new Headers(r.headers);
  h.delete('content-length');
  h.delete('content-encoding');
  h.set('cache-control', 'no-store');
  h.set('x-nostalgai-overlay', 'ray-three-editions-v3');
  const type = r.headers.get('content-type') || '';
  if (type.includes('text/html')) {
    let body = await r.text();
    if (path === '/' || path === '') {
      body = body
        .replace('</head>', HOME_CSS + '</head>')
        .replace('</body>', `<a class="nrz-cart-float" href="/releases/ray-grey">RAY · 3 EDITIONS ↗</a>${HOME_SCRIPT}</body>`);
    } else if (isRay) {
      body = body
        .replace('</head>', RAY_CSS + '</head>')
        .replace('</body>', rayScript(editionForPath(path)) + '</body>');
    }
    return new Response(body, { status: r.status, headers: h });
  }
  return new Response(await r.arrayBuffer(), { status: r.status, headers: h });
}

export async function POST(req, { params }) {
  const p = await params;
  const parts = p.proxy || [];
  const path = '/' + parts.join('/');
  const upstreamPath = /^\/releases\/ray(?:-grey|-blue|-pink)?\/?$/.test(path) ? '/releases/ray' : undefined;
  return fetch(target(parts, req, upstreamPath), {
    method: 'POST',
    headers: cleanHeaders(req),
    body: await req.arrayBuffer(),
    redirect: 'manual',
  });
}
