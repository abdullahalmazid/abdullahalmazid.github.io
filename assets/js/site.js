/* ==========================================================================
   Shared site behaviour: theme (navy / dark / off-white), mobile menu,
   header shadow on scroll, footer year, and the homepage count-up.
   Vanilla JS, no dependencies — works straight from GitHub Pages.
   ========================================================================== */
(function () {
  /* ---- Theme: navy (default), dark, off-white -------------------------
     Applied here, in <head>, before the page paints, so there is no flash.
     The header button cycles through the three and the choice is
     remembered in this browser. */
  var THEMES = [
    { id: '', name: 'Navy',
      icon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/><path d="M17 3v3M15.5 4.5h3"/>' },
    { id: 'dark', name: 'Dark',
      icon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>' },
    { id: 'light', name: 'Off-white',
      icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' }
  ];
  var theme = '';
  try { theme = localStorage.getItem('aam-theme') || ''; } catch (e) { /* storage unavailable */ }
  if (theme) document.documentElement.setAttribute('data-theme', theme);

  function themeIndex() {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === theme) return i;
    return 0;
  }

  function paintToggle(btn) {
    var cur = THEMES[themeIndex()];
    var next = THEMES[(themeIndex() + 1) % THEMES.length];
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + cur.icon + '</svg>';
    btn.setAttribute('aria-label', 'Theme: ' + cur.name + '. Switch to ' + next.name);
    btn.title = 'Theme: ' + cur.name + ' (click for ' + next.name + ')';
  }

  function buildToggle() {
    var row = document.querySelector('.header-row');
    if (!row) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    paintToggle(btn);
    btn.addEventListener('click', function () {
      theme = THEMES[(themeIndex() + 1) % THEMES.length].id;
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      else document.documentElement.removeAttribute('data-theme');
      try {
        if (theme) localStorage.setItem('aam-theme', theme); else localStorage.removeItem('aam-theme');
      } catch (e) { /* storage unavailable: choice lasts for this page only */ }
      paintToggle(btn);
    });
    var before = row.querySelector('.header-cta') || row.querySelector('.nav-burger');
    row.insertBefore(btn, before);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target) || reduce) return;
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    var start = null;
    var duration = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function watchCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Profile photo: tilt towards the pointer, with a shine that follows it */
  function tilt() {
    if (reduce) return;
    document.querySelectorAll('.portrait-frame, .bio-portrait').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--ty', ((x - 0.5) * 14).toFixed(2) + 'deg');
        el.style.setProperty('--tx', ((0.5 - y) * 14).toFixed(2) + 'deg');
        el.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('is-tilting');
        el.style.setProperty('--tx', '0deg');
        el.style.setProperty('--ty', '0deg');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildToggle();
    tilt();

    /* Phone menu: a drawer that slides in from the left over part of the
       screen, with a dimmed backdrop. Tap outside, swipe left or press
       Escape to close. */
    var burger = document.getElementById('nav-burger');
    var nav = document.getElementById('site-nav');
    if (burger && nav) {
      var head = document.querySelector('.site-header .brand');
      var cta = document.querySelector('.header-cta');
      if (head && !nav.querySelector('.drawer-head')) {
        var dh = document.createElement('div');
        dh.className = 'drawer-head';
        dh.appendChild(head.cloneNode(true));
        nav.insertBefore(dh, nav.firstChild);
      }
      if (cta && !nav.querySelector('.drawer-foot')) {
        var df = document.createElement('div');
        df.className = 'drawer-foot';
        var c = cta.cloneNode(true);
        c.classList.remove('header-cta', 'btn-sm');
        c.textContent = 'Download CV';
        df.appendChild(c);
        nav.appendChild(df);
      }
      var shade = document.createElement('div');
      shade.className = 'nav-backdrop';
      document.body.appendChild(shade);

      var setOpen = function (open) {
        document.body.classList.toggle('nav-open', open);
        document.documentElement.classList.toggle('sheet-locked', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function () {
        setOpen(!document.body.classList.contains('nav-open'));
      });
      shade.addEventListener('click', function () { setOpen(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false);
      });
      var sx = 0, sdx = 0;
      nav.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sdx = 0; }, { passive: true });
      nav.addEventListener('touchmove', function (e) {
        sdx = Math.min(0, e.touches[0].clientX - sx);
        if (document.body.classList.contains('nav-open')) nav.style.transform = 'translateX(' + sdx + 'px)';
      }, { passive: true });
      nav.addEventListener('touchend', function () {
        nav.style.transform = '';
        if (sdx < -60) setOpen(false);
      });
    }

    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        /* past the top of the page the bar shrinks to an icon-only pill */
        header.classList.toggle('is-compact', window.scrollY > 80);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* Figures are painted by render.js; start counting once they exist. */
  document.addEventListener('content:rendered', watchCounters);
})();
