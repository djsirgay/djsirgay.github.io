(() => {
  const PINK = 'https://raw.githubusercontent.com/djsirgay/djsirgay.github.io/7795302391f9dbfc7558aeb672c787a8dfdccf08/ray-pink-cover.webp';
  const BLUE = '/releases/ray.jpg';
  const path = location.pathname.replace(/\/$/, '');
  const isRay = path === '/releases/ray-blue' || path === '/releases/ray-pink';
  const variant = path.endsWith('-pink') ? 'pink' : 'blue';
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => Array.from(root.querySelectorAll(s));
  const ru = () => document.documentElement.lang === 'ru';
  const t = (en, rus) => (ru() ? rus : en);

  function rayImage() {
    return qa('img').find((img) =>
      (img.alt || '').toLowerCase().includes('ray') ||
      (img.src || '').includes('/releases/ray.jpg') ||
      (img.src || '').includes('ray-pink-cover')
    );
  }

  function labelCheckout() {
    qa('a[href*="buy.stripe.com"]').forEach((a) => {
      const span = q('span', a);
      if (span && /checkout|secure|оплат/i.test(span.textContent || '')) {
        span.textContent = t(
          `Checkout — ${variant === 'pink' ? 'Pink' : 'Blue'} Cover`,
          `Оплатить — ${variant === 'pink' ? 'розовая' : 'голубая'} обложка`
        );
      }
    });
  }

  function renderEditionPage() {
    if (!isRay) return;
    const image = rayImage();
    if (image) {
      image.src = variant === 'pink' ? PINK : BLUE;
      image.srcset = '';
      image.alt = `Sergéy — RAY — ${variant === 'pink' ? 'Pink' : 'Blue'} Cover Edition`;
    }

    const title = qa('h1,h2').find((el) => (el.textContent || '').trim().toLowerCase() === 'ray');
    if (title && !q('.nrz-edition-badge')) {
      const badge = document.createElement('span');
      badge.className = 'nrz-edition-badge';
      badge.textContent = variant === 'pink'
        ? t('Pink Cover Edition · NRZ-009P', 'Розовая обложка · NRZ-009P')
        : t('Blue Cover Edition · NRZ-009B', 'Голубая обложка · NRZ-009B');
      title.insertAdjacentElement('beforebegin', badge);
    }

    let picker = q('.nrz-edition-picker');
    if (!picker) {
      const anchor = q('.release-price,.nrz-price,.product-price,.price') || q('a[href*="buy.stripe.com"]') || title;
      if (anchor) {
        picker = document.createElement('section');
        picker.className = 'nrz-edition-picker';
        picker.innerHTML = `
          <p></p>
          <div class="nrz-edition-options">
            <button type="button" class="nrz-edition-option" data-v="blue"><img src="${BLUE}" alt="Blue cover"><span><b></b><small></small></span></button>
            <button type="button" class="nrz-edition-option" data-v="pink"><img src="${PINK}" alt="Pink cover"><span><b></b><small></small></span></button>
          </div>
          <div class="nrz-edition-note"></div>`;
        anchor.parentNode.insertBefore(picker, anchor);
      }
    }

    if (picker) {
      q(':scope > p', picker).textContent = t('Choose the physical edition', 'Выберите физическое издание');
      qa('[data-v]', picker).forEach((button) => {
        const v = button.dataset.v;
        button.classList.toggle('on', v === variant);
        q('b', button).textContent = v === 'pink' ? t('Pink Cover Edition', 'Розовая обложка') : t('Blue Cover Edition', 'Голубая обложка');
        q('small', button).textContent = v === 'pink'
          ? t('Alternate cover + exclusive printed sleeve', 'Альтернативная обложка и эксклюзивный печатный конверт')
          : t('Original cover + original printed sleeve', 'Оригинальная обложка и оригинальный печатный конверт');
        button.onclick = () => {
          if (v !== variant) location.href = `/releases/ray-${v}${location.search}${location.hash}`;
        };
      });
      q('.nrz-edition-note', picker).textContent = t(
        'The album and track list are identical. The cover and printed sleeve artwork are different. Each edition is a separate physical product and checkout.',
        'Альбом и трек-лист одинаковые. Отличаются обложка и оформление печатного конверта. Каждое издание — отдельный физический товар и отдельная оплата.'
      );
    }
    labelCheckout();
    document.title = `Sergéy — RAY — ${variant === 'pink' ? 'Pink Cover · NRZ-009P' : 'Blue Cover · NRZ-009B'} — Nostalgai Recordz`;
  }

  function editCard(card, v) {
    if (!card) return;
    card.classList.remove('nrz-blue-card', 'nrz-pink-card');
    card.classList.add(v === 'pink' ? 'nrz-pink-card' : 'nrz-blue-card');
    const href = `/releases/ray-${v}`;
    qa('a', card).forEach((a) => {
      if ((a.getAttribute('href') || '').includes('/releases/ray') || a.classList.contains('card-buy')) {
        a.href = href + (a.classList.contains('card-buy') ? '#preorder' : '');
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
    const image = q('.cover-wrap img', card) || q('img', card);
    if (image) {
      image.src = v === 'pink' ? PINK : BLUE;
      image.srcset = '';
      image.alt = `Sergéy — RAY — ${v === 'pink' ? 'Pink' : 'Blue'} Cover Edition`;
    }
    const title = q('.release-meta h3', card) || q('h3', card);
    if (title) title.textContent = v === 'pink' ? 'Ray — Pink Cover' : 'Ray — Blue Cover';
    const number = q('.release-number', card);
    if (number) number.textContent = v === 'pink' ? 'NRZ-009P' : 'NRZ-009B';
    const detail = q('.release-detail', card);
    if (detail) detail.textContent = v === 'pink' ? '2026 · 12″ LP + booklet · Pink cover' : '2026 · 12″ LP + booklet · Blue cover';
    const status = q('.status', card);
    if (status) status.innerHTML = `<b>${v === 'pink' ? 'Pink cover' : 'Blue cover'}</b>Pre-order open`;
    const buy = q('.card-buy span', card);
    if (buy) buy.textContent = 'View edition';
  }

  function renderHome() {
    if (location.pathname !== '/') return;
    const grid = q('.release-grid,#catalog-grid');
    if (!grid) return;
    const blue = qa('article', grid).find((article) =>
      qa('a', article).some((a) => (a.getAttribute('href') || '').startsWith('/releases/ray')) ||
      article.classList.contains('nrz-blue-card')
    );
    if (!blue) return;
    editCard(blue, 'blue');
    let pink = q('.nrz-pink-card', grid);
    if (!pink) {
      pink = blue.cloneNode(true);
      blue.insertAdjacentElement('afterend', pink);
    }
    editCard(pink, 'pink');
  }

  function run() {
    renderHome();
    renderEditionPage();
  }

  run();
  setTimeout(run, 350);
  setTimeout(run, 1200);
})();
