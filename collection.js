(function () {
  var STD = ['6′ × 9′', '8′ × 10′', '9′ × 12′', '10′ × 14′', '12′ × 15′'];
  var KEY = 'fm-shortlist';

  function inStock(r) { return r.sizes.some(function (s) { return s[1] > 0; }); }

  var all = window.RUGS || [];
  var rugs = all.filter(inStock).concat(all.filter(function (r) { return !inStock(r); }));
  var grid = document.getElementById('rug-grid');
  if (!grid) return;

  var state = { avail: 'all', size: 'all', fiber: 'all', q: '' };
  var visible = [];
  var shortlist;
  try { shortlist = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { shortlist = []; }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function desc(r) { return [r.color, r.content].filter(Boolean).join(' · '); }
  function sizes(r) { return r.sizes.map(function (s) { return s[0]; }).join(' · '); }

  var stockCount = rugs.filter(inStock).length;
  document.querySelectorAll('[data-rug-count]').forEach(function (el) { el.textContent = rugs.length; });
  document.querySelectorAll('[data-stock-count]').forEach(function (el) { el.textContent = stockCount; });

  grid.innerHTML = rugs.map(function (r, i) {
    var stock = inStock(r);
    return '<article class="rug-card" data-i="' + i + '">' +
      '<button type="button" class="rug-open" aria-label="View ' + r.ref + '">' +
        '<span class="img-cell rug-img"><img src="' + r.img + '" alt="' + esc(r.ref + (r.color ? ', ' + r.color : '') + ' rug') + '" loading="lazy" decoding="async"></span>' +
      '</button>' +
      '<div class="rug-meta"><h3>' + r.ref + '</h3><button type="button" class="rug-add" data-ref="' + r.ref + '"></button></div>' +
      '<p class="rug-desc">' + esc(desc(r)) + '</p>' +
      '<p class="rug-sizes">' + esc(sizes(r)) + '</p>' +
      '<p class="rug-loc' + (stock ? ' is-stock' : '') + '">' + (stock ? 'In stock · Ready to ship' : 'Made to order · 8–10 weeks') + '</p>' +
    '</article>';
  }).join('');
  var cards = grid.children;

  /* ---------- Filters ---------- */
  var count = document.getElementById('rug-count');
  var empty = document.getElementById('rug-empty');

  function matches(r) {
    if (state.avail === 'stock' && !inStock(r)) return false;
    if (state.avail === 'mto' && inStock(r)) return false;
    if (state.size !== 'all' && !r.sizes.some(function (s) {
      return state.size === 'other' ? STD.indexOf(s[0]) < 0 : s[0] === state.size;
    })) return false;
    if (state.fiber !== 'all' && r.content.toLowerCase().indexOf(state.fiber) < 0) return false;
    if (state.q && (r.ref + ' ' + r.color + ' ' + r.content + ' ' + r.construction).toLowerCase().indexOf(state.q) < 0) return false;
    return true;
  }

  function apply() {
    visible = [];
    rugs.forEach(function (r, i) {
      var ok = matches(r);
      cards[i].hidden = !ok;
      if (ok) visible.push(i);
    });
    count.textContent = visible.length === rugs.length
      ? 'Showing all ' + rugs.length + ' designs'
      : 'Showing ' + visible.length + ' of ' + rugs.length + ' designs';
    empty.hidden = visible.length > 0;
  }

  var tabs = document.querySelectorAll('.loc-tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      state.avail = b.dataset.avail;
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      apply();
    });
  });
  document.getElementById('f-size').addEventListener('change', function (e) { state.size = e.target.value; apply(); });
  document.getElementById('f-fiber').addEventListener('change', function (e) { state.fiber = e.target.value; apply(); });
  document.getElementById('f-q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); apply(); });
  document.getElementById('rug-reset').addEventListener('click', function () {
    state = { avail: 'all', size: 'all', fiber: 'all', q: '' };
    document.getElementById('f-size').value = 'all';
    document.getElementById('f-fiber').value = 'all';
    document.getElementById('f-q').value = '';
    tabs.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.avail === 'all'); });
    apply();
  });

  var preset = (location.search.match(/[?&]avail=(stock|mto)\b/) || [])[1];
  if (preset) {
    state.avail = preset;
    tabs.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.avail === preset); });
  }

  /* ---------- Shortlist ---------- */
  var bar = document.getElementById('shortlist-bar');
  var slLabel = document.getElementById('sl-label');
  var slRefs = document.getElementById('sl-refs');
  var slClear = document.getElementById('sl-clear');
  var slCta = document.getElementById('sl-cta');
  var refsField = document.getElementById('refs');
  var lastSynced = refsField ? refsField.value : '';
  var current = null;

  function toggle(ref) {
    var k = shortlist.indexOf(ref);
    if (k < 0) shortlist.push(ref); else shortlist.splice(k, 1);
    try { localStorage.setItem(KEY, JSON.stringify(shortlist)); } catch (e) {}
    render();
  }

  function render() {
    grid.querySelectorAll('.rug-add').forEach(function (b) {
      var on = shortlist.indexOf(b.dataset.ref) >= 0;
      b.setAttribute('aria-pressed', on);
      b.textContent = on ? 'Shortlisted' : '+ Shortlist';
    });
    var n = shortlist.length;
    if (n) {
      slLabel.textContent = 'Your shortlist · ' + n + (n === 1 ? ' rug' : ' rugs');
      slRefs.textContent = shortlist.slice(0, 8).join(', ') + (n > 8 ? ' +' + (n - 8) + ' more' : '');
      slCta.textContent = 'Request pricing for ' + n;
    } else {
      slLabel.textContent = 'To the trade';
      slRefs.textContent = rugs.length + ' hand-knotted designs';
      slCta.textContent = 'Request trade pricing';
    }
    slClear.hidden = !n;
    if (refsField && refsField.value === lastSynced) {
      refsField.value = lastSynced = shortlist.join(', ');
    }
    if (current !== null) syncDialogButton();
  }

  grid.addEventListener('click', function (e) {
    var add = e.target.closest('.rug-add');
    if (add) { toggle(add.dataset.ref); return; }
    var open = e.target.closest('.rug-open');
    if (open) openRug(+open.parentNode.dataset.i);
  });
  slClear.addEventListener('click', function () {
    shortlist = [];
    try { localStorage.setItem(KEY, '[]'); } catch (e) {}
    render();
  });

  var heroVisible = true, contactVisible = false;
  function updateBar() { bar.classList.toggle('show', !heroVisible && !contactVisible); }
  if ('IntersectionObserver' in window) {
    var hero = document.querySelector('[data-hero]');
    var contact = document.getElementById('contact');
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; updateBar(); }).observe(hero);
    new IntersectionObserver(function (es) { contactVisible = es[0].isIntersecting; updateBar(); }, { threshold: 0.15 }).observe(contact);
  } else {
    bar.classList.add('show');
  }

  /* ---------- Detail dialog ---------- */
  var dialog = document.getElementById('rug-dialog');
  var dImg = document.getElementById('rd-img');
  var dThumbs = document.getElementById('rd-thumbs');
  var dAdd = document.getElementById('rd-add');

  function syncDialogButton() {
    var on = shortlist.indexOf(rugs[current].ref) >= 0;
    dAdd.textContent = on ? 'Remove from shortlist' : 'Add to shortlist';
  }

  function openRug(i) {
    current = i;
    var r = rugs[i];
    var stock = inStock(r);
    var imgs = [r.img].concat(r.details);
    dImg.src = r.img;
    dImg.alt = r.ref + (r.color ? ', ' + r.color : '') + ' rug';
    dThumbs.innerHTML = imgs.map(function (src, k) {
      return '<button type="button" data-src="' + src + '" aria-current="' + (k === 0) + '" aria-label="' + (k === 0 ? 'Full rug' : 'Detail ' + k) + '"><img src="' + src + '" alt=""></button>';
    }).join('');
    document.getElementById('rd-loc').textContent = stock ? 'In stock · Ready to ship' : 'Made to order · 8–10 weeks';
    document.getElementById('rd-ref').textContent = r.ref;
    var rows = [['Color', r.color], ['Construction', r.construction], ['Content', r.content]]
      .filter(function (x) { return x[1]; })
      .map(function (x) { return '<div class="rd-spec"><span class="label">' + x[0] + '</span><span>' + esc(x[1]) + '</span></div>'; });
    rows.push('<div class="rd-spec"><span class="label">' + (r.sizes.length > 1 ? 'Sizes' : 'Size') + '</span><span>' +
      r.sizes.map(function (s) {
        return esc(s[0]) + (stock ? ' <em>· ' + (s[1] > 0 ? s[1] + ' in stock' : 'made to order') + '</em>' : '');
      }).join('<br>') + '</span></div>');
    document.getElementById('rd-specs').innerHTML = rows.join('');
    document.getElementById('rd-note').textContent = stock
      ? 'In-stock pieces ship through our drop-ship program and are subject to prior sale. Once a size sells through, it is hand-knotted to order in India in 8–10 weeks. Sizes are approximate.'
      : 'Hand-knotted to order by our artisans in India. Lead time is 8–10 weeks. Sizes are approximate.';
    syncDialogButton();
    if (!dialog.open) dialog.showModal();
  }

  function step(d) {
    var pos = visible.indexOf(current);
    if (pos < 0 || !visible.length) return;
    openRug(visible[(pos + d + visible.length) % visible.length]);
  }

  dThumbs.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    dImg.src = b.dataset.src;
    dThumbs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-current', x === b); });
  });
  dAdd.addEventListener('click', function () { toggle(rugs[current].ref); });
  document.getElementById('rd-inquire').addEventListener('click', function () {
    if (shortlist.indexOf(rugs[current].ref) < 0) toggle(rugs[current].ref);
    dialog.close();
  });
  document.getElementById('rd-close').addEventListener('click', function () { dialog.close(); });
  document.getElementById('rd-prev').addEventListener('click', function () { step(-1); });
  document.getElementById('rd-next').addEventListener('click', function () { step(1); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  dialog.addEventListener('close', function () { current = null; });

  apply();
  render();

  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) {
    var html = document.documentElement;
    html.style.scrollBehavior = 'auto';
    target.scrollIntoView();
    html.style.scrollBehavior = '';
  }
})();
