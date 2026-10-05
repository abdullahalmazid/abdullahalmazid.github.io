/* ==========================================================================
   explorer.js — open items in place on the listing pages.

   Any list marked data-explorer (Projects, Publications, Blog, Experience)
   becomes an explorer: click a card and

     1. the other cards slide into a column on the left,
     2. the item opens beside them with a "genie" animation that grows out
        of the card you clicked,
     3. clicking another card in the column swaps the item in the same way.

   The item's content is read from its own detail page, so each project /
   paper / post is still written once, in its own HTML file. The address bar
   gets #slug, so a link like projects.html#iot-smart-conveyor opens that
   item directly, and Back / Escape close it. Left and right arrow keys step
   through the items.

   On phones (900px and narrower) the item slides up from the bottom in a
   sheet instead; drag it down, tap outside it, or press Back to close.

   If the page is opened straight from disk (file://) browsers block reading
   other files, so cards fall back to opening the full page.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NOUN = {
    projects: 'Project', publications: 'Paper', blog: 'Post',
    experience: 'Role', education: 'Programme'
  };
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var cache = {};
  var explorers = [];

  /* ---------------------------------------------------------------- */
  /* Helpers                                                           */
  /* ---------------------------------------------------------------- */
  function items(ex) {
    return Array.prototype.slice.call(ex.list.querySelectorAll(':scope > .card, :scope > .pub'));
  }

  function linkOf(item) {
    return item.matches('a') ? item : item.querySelector('a[href]');
  }

  function slugOf(item) {
    var a = linkOf(item);
    var m = a && a.pathname.match(/([^\/]+)\.html$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function findItem(ex, slug) {
    var all = items(ex);
    for (var i = 0; i < all.length; i++) if (slugOf(all[i]) === slug) return all[i];
    return null;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

  function load(url) {
    if (!cache[url]) {
      cache[url] = fetch(url).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }).then(function (html) {
        return new DOMParser().parseFromString(html, 'text/html');
      });
      cache[url].catch(function () { delete cache[url]; });
    }
    return cache[url];
  }

  /* Paths inside the fetched page are relative to that page. */
  function absolutise(root, base) {
    root.querySelectorAll('[src], [href]').forEach(function (el) {
      var attr = el.hasAttribute('src') ? 'src' : 'href';
      var val = el.getAttribute(attr);
      if (!val || /^(#|mailto:|tel:|data:)/i.test(val)) return;
      try { el.setAttribute(attr, new URL(val, base).href); } catch (e) { /* ignore */ }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Build the panel content from a detail page                        */
  /* ---------------------------------------------------------------- */
  function build(doc, url) {
    var head = document.createElement('header');
    head.className = 'ex-head';
    var hero = doc.querySelector('.page-hero .hero-inner');
    if (hero) head.innerHTML = hero.innerHTML;
    var h1 = head.querySelector('h1');
    if (h1) {
      var h2 = document.createElement('h2');
      h2.className = 'ex-title';
      h2.tabIndex = -1;
      h2.innerHTML = h1.innerHTML;
      h1.replaceWith(h2);
    }

    var glance = doc.querySelectorAll('.detail-aside .glance li span');
    if (glance.length) {
      var row = document.createElement('div');
      row.className = 'chip-row ex-chips';
      glance.forEach(function (g) {
        var c = document.createElement('span');
        c.className = 'chip';
        c.innerHTML = g.innerHTML;
        row.appendChild(c);
      });
      head.appendChild(row);
    }

    var body = document.createElement('div');
    body.className = 'ex-body';
    var main = doc.querySelector('.detail-main') || doc.getElementById('page-main');
    if (main) {
      Array.prototype.forEach.call(main.children, function (child) {
        if (child.matches('.page-nav, .detail-aside, script')) return;
        body.appendChild(document.importNode(child, true));
      });
    }

    absolutise(head, url);
    absolutise(body, url);
    return { head: head, body: body };
  }

  function fill(ex, item, content) {
    var all = items(ex);
    var idx = all.indexOf(item);
    var noun = NOUN[ex.list.getAttribute('data-render')] || 'Item';
    var url = linkOf(item).href;

    ex.panel.innerHTML =
      '<div class="ex-bar">' +
        '<span class="ex-count">' + noun + ' ' + (idx + 1) + ' of ' + all.length + '</span>' +
        '<div class="ex-actions">' +
          '<a class="btn btn-sm" href="' + url + '">Open full page</a>' +
          '<button class="ex-close" type="button" aria-label="Close">' + CLOSE + '</button>' +
        '</div>' +
      '</div>';
    ex.panel.appendChild(content.head);
    ex.panel.appendChild(content.body);
    ex.panel.querySelector('.ex-close').addEventListener('click', function () { close(ex, true); });

    /* lists inside the item (e.g. coursework) and image checks */
    if (window.SiteRender) window.SiteRender.paint(ex.panel);
    else document.dispatchEvent(new CustomEvent('content:rendered'));
  }

  function setActive(ex, item) {
    items(ex).forEach(function (el) {
      el.classList.toggle('is-active', el === item);
      var a = linkOf(el);
      if (a) {
        if (el === item) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      }
    });
    ex.active = item;
  }

  /* ---------------------------------------------------------------- */
  /* Animations                                                        */
  /* ---------------------------------------------------------------- */
  function rects(list) {
    return list.map(function (el) { return el.getBoundingClientRect(); });
  }

  /* FLIP: cards jump to their new place, then glide there from the old one */
  function glide(list, before) {
    if (reduce || !Element.prototype.animate) return;
    list.forEach(function (el, i) {
      var a = before[i];
      var b = el.getBoundingClientRect();
      if (!a || !b.width) return;
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px)', opacity: 0.35 },
        { transform: 'none', opacity: 1 }
      ], { duration: 620, delay: i * 35, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'backwards' });
    });
  }

  /* Genie: the panel grows out of the source card. Each horizontal slice
     of the panel travels from the card to its final place; slices nearest
     the card leave last, which bends the sides into a funnel. */
  function genie(panel, from) {
    if (reduce || !from) return;
    var to = panel.getBoundingClientRect();
    var W = to.width;
    var H = Math.min(to.height, window.innerHeight * 1.2);
    var s = {
      l: from.left - to.left, r: from.right - to.left,
      t: from.top - to.top, b: from.bottom - to.top
    };
    var sourceBelow = (from.top + from.height / 2) > (to.top + H / 2);
    var N = 16, K = 1.1, duration = 780, start = null;

    panel.classList.add('is-genie');
    function frame(ts) {
      if (start === null) start = ts;
      var t = clamp((ts - start) / duration);
      var left = [], right = [];
      for (var i = 0; i <= N; i++) {
        var v = i / N;
        var lag = sourceBelow ? v : 1 - v;
        var p = easeOut(clamp(t * (1 + K) - lag * K));
        var y = lerp(s.t + v * (s.b - s.t), v * H, p);
        left.push(lerp(s.l, 0, p).toFixed(1) + 'px ' + y.toFixed(1) + 'px');
        right.push(lerp(s.r, W, p).toFixed(1) + 'px ' + y.toFixed(1) + 'px');
      }
      if (H < to.height) {               /* the rest of a tall panel follows the last slice */
        var tail = lerp(s.b, to.height, easeOut(t));
        left.push(left[left.length - 1].split(' ')[0] + ' ' + tail.toFixed(1) + 'px');
        right.push(right[right.length - 1].split(' ')[0] + ' ' + tail.toFixed(1) + 'px');
      }
      panel.style.clipPath = 'polygon(' + left.concat(right.reverse()).join(',') + ')';
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        panel.style.clipPath = '';
        panel.classList.remove('is-genie');
      }
    }
    requestAnimationFrame(frame);
  }

  /* keep the active card visible inside the side column / phone strip */
  function reveal(ex, item) {
    var l = ex.list;
    var behavior = reduce ? 'auto' : 'smooth';
    if (l.scrollWidth > l.clientWidth + 2) {
      /* instant: a smooth scroll here gets cancelled by the page scroll */
      l.scrollLeft = Math.max(0, item.offsetLeft - 8);
    } else if (l.scrollHeight > l.clientHeight + 2) {
      var top = item.offsetTop, bottom = top + item.offsetHeight;
      if (top < l.scrollTop || bottom > l.scrollTop + l.clientHeight) {
        l.scrollTo({ top: Math.max(0, top - 8), behavior: behavior });
      }
    }
  }

  function scrollToExplorer(ex) {
    var header = document.querySelector('.site-header');
    var offset = (header ? header.offsetHeight : 0) + 20;
    var top = ex.wrap.getBoundingClientRect().top + window.scrollY - offset;
    if (Math.abs(window.scrollY - top) > 4) {
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Phone: items open in a bottom sheet instead of beside the list    */
  /* ---------------------------------------------------------------- */
  var phone = window.matchMedia ? window.matchMedia('(max-width: 900px)') : { matches: false };
  var sheet = null, sheetScroll = null, backdrop = null, sheetEx = null;

  function buildSheet() {
    if (sheet) return;
    backdrop = document.createElement('div');
    backdrop.className = 'sheet-backdrop';
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Details');
    sheet.innerHTML = '<div class="sheet-grip" aria-hidden="true"><span></span></div><div class="sheet-scroll"></div>';
    sheetScroll = sheet.querySelector('.sheet-scroll');
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
    backdrop.addEventListener('click', function () { if (sheetEx) close(sheetEx, true); });

    /* drag the sheet down to close it */
    var startY = 0, dy = 0, startT = 0, dragging = false;
    sheet.addEventListener('touchstart', function (e) {
      var onGrip = e.target.closest('.sheet-grip, .ex-bar');
      if (!onGrip && sheetScroll.scrollTop > 0) return;
      dragging = true; dy = 0;
      startY = e.touches[0].clientY; startT = Date.now();
      sheet.classList.add('is-dragging');
    }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      if (dy > 0 && sheetScroll.scrollTop <= 0) {
        sheet.style.transform = 'translateY(' + dy + 'px)';
        backdrop.style.opacity = String(Math.max(0, 1 - dy / 400));
      }
    }, { passive: true });
    sheet.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('is-dragging');
      var fast = dy / Math.max(1, Date.now() - startT) > 0.6;
      sheet.style.transform = '';
      backdrop.style.opacity = '';
      if ((dy > 120 || (fast && dy > 40)) && sheetEx) close(sheetEx, true);
    });
  }

  function openSheet(ex) {
    buildSheet();
    sheetEx = ex;
    if (ex.panel.parentNode !== sheetScroll) sheetScroll.appendChild(ex.panel);
    ex.panel.hidden = false;
    sheetScroll.scrollTop = 0;
    document.documentElement.classList.add('sheet-locked');
    requestAnimationFrame(function () {
      backdrop.classList.add('is-open');
      sheet.classList.add('is-open');
    });
  }

  function closeSheet(ex, done) {
    backdrop.classList.remove('is-open');
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('sheet-locked');
    setTimeout(function () {
      ex.panel.hidden = true;
      ex.panel.innerHTML = '';
      ex.wrap.appendChild(ex.panel);      /* back home, in case the screen grows */
      sheetEx = null;
      if (done) done();
    }, reduce ? 0 : 380);
  }

  /* ---------------------------------------------------------------- */
  /* Open / close                                                      */
  /* ---------------------------------------------------------------- */
  function open(ex, item, push) {
    if (ex.busy) return;
    var a = linkOf(item);
    if (!a) return;
    var url = a.href;
    var slug = slugOf(item);
    var from = item.getBoundingClientRect();
    ex.busy = true;
    item.classList.add('is-loading');

    load(url).then(function (doc) {
      var content = build(doc, url);
      if (phone.matches) {
        fill(ex, item, content);
        setActive(ex, item);
        ex.sheetOpen = true;
        openSheet(ex);
        if (push) history.pushState({ explorer: slug }, '', '#' + slug);
        var t = ex.panel.querySelector('.ex-title');
        if (t) t.focus({ preventScroll: true });
        return;
      }
      var list = items(ex);
      var wasOpen = ex.wrap.classList.contains('is-open');
      var before = wasOpen ? null : rects(list);

      if (!wasOpen) {
        ex.wrap.classList.add('is-open');
        ex.panel.hidden = false;
      }
      fill(ex, item, content);
      setActive(ex, item);
      if (before) glide(list, before);
      genie(ex.panel, from);

      if (push) history.pushState({ explorer: slug }, '', '#' + slug);
      scrollToExplorer(ex);
      var title = ex.panel.querySelector('.ex-title');
      if (title) title.focus({ preventScroll: true });

      reveal(ex, item);
    }).catch(function () {
      window.location.href = url;
    }).then(function () {
      ex.busy = false;
      item.classList.remove('is-loading');
    });
  }

  function close(ex, push) {
    if (ex.sheetOpen) {
      ex.sheetOpen = false;
      if (push) history.pushState('', '', window.location.pathname + window.location.search);
      var was = ex.active;
      closeSheet(ex, function () {
        setActive(ex, null);
        var a = was && linkOf(was);
        if (a) a.focus({ preventScroll: true });
      });
      return;
    }
    if (!ex.wrap.classList.contains('is-open') || ex.busy) return;
    var list = items(ex);
    var active = ex.active;

    function finish() {
      var before = rects(list);
      ex.wrap.classList.remove('is-open');
      ex.panel.hidden = true;
      ex.panel.innerHTML = '';
      ex.panel.style.opacity = '';
      setActive(ex, null);
      glide(list, before);
      if (active) {
        var r = active.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          active.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        }
        var a = linkOf(active);
        if (a) a.focus({ preventScroll: true });
      }
    }

    if (push) history.pushState('', '', window.location.pathname + window.location.search);

    if (reduce || !ex.panel.animate) return finish();
    ex.busy = true;
    var anim = ex.panel.animate([
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'scale(0.97) translateY(8px)' }
    ], { duration: 200, easing: 'ease-in' });
    anim.onfinish = function () { ex.busy = false; finish(); };
  }

  function step(ex, dir) {
    var all = items(ex);
    var i = all.indexOf(ex.active);
    if (i < 0) return;
    open(ex, all[(i + dir + all.length) % all.length], true);
  }

  /* ---------------------------------------------------------------- */
  /* Wiring                                                            */
  /* ---------------------------------------------------------------- */
  function setup(list) {
    if (list.dataset.exReady) return;
    list.dataset.exReady = '1';

    var wrap = document.createElement('div');
    wrap.className = 'explorer';
    list.parentNode.insertBefore(wrap, list);
    wrap.appendChild(list);
    list.classList.add('ex-list');

    var panel = document.createElement('article');
    panel.className = 'ex-panel glass';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    wrap.appendChild(panel);

    var ex = { wrap: wrap, list: list, panel: panel, active: null, busy: false };
    explorers.push(ex);

    list.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.location.protocol === 'file:') return;   /* let the link open the full page */
      var a = e.target.closest('a[href]');
      var item = a && a.closest('.card, .pub');
      if (!item || !list.contains(item)) return;
      e.preventDefault();
      if (item === ex.active) return;
      open(ex, item, true);
    });
  }

  function fromHash(push) {
    var slug = decodeURIComponent(window.location.hash.slice(1));
    explorers.forEach(function (ex) {
      var item = slug && findItem(ex, slug);
      if (item) {
        if (item !== ex.active) open(ex, item, push);
      } else {
        close(ex, false);
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-explorer]').forEach(setup);
    if (!explorers.length) return;
    if (window.location.hash && window.location.protocol !== 'file:') fromHash(false);

    window.addEventListener('popstate', function () { fromHash(false); });

    document.addEventListener('keydown', function (e) {
      if (document.querySelector('.modal-overlay.is-open')) return;
      var ex = explorers.filter(function (x) { return x.wrap.classList.contains('is-open') || x.sheetOpen; })[0];
      if (!ex) return;
      if (e.key === 'Escape') close(ex, true);
      else if (e.key === 'ArrowRight' && !e.target.closest('input, textarea')) step(ex, 1);
      else if (e.key === 'ArrowLeft' && !e.target.closest('input, textarea')) step(ex, -1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
