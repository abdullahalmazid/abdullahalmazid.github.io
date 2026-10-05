/* ==========================================================================
   cursor.js — six custom cursor shapes, one per section of the site.

     Home          CAD crosshair  live X / Y coordinates, shows SNAP on targets
     Projects      Gear           turns slowly, spins up over clickable things
     Publications  Reticle        rotating target ring with four ticks
     Experience    Hex nut        turns one face when it locks on, tightens on click
     About         Orbit          core with two orbiting particles
     Blog/Contact  Comet arrow    arrow pointer with a short glowing trail

   Hover effects (on every shape):
     images that open full size   laser trace: a line draws itself around
                                  the image, then a spark keeps circling it
     small buttons / menu items   edge glow: light runs along the border
                                  where the pointer is
     cards and everything else    CAD selection: four corner brackets snap
                                  on with a live size tag (width x height)

   A switcher at the bottom of the footer lets visitors pick any shape for
   the whole site (remembered in this browser); "Auto" returns to the
   per-section shapes. Only runs on devices with a mouse; reduced-motion
   settings stop the spinning and gliding.
   ========================================================================== */
(function () {
  'use strict';

  /* Start on the first real mouse or touchpad movement. (Checking the
     "primary pointer" isn't enough: laptops with a touchscreen report touch
     even when you're using the touchpad.) Finger and pen input never
     trigger it, so phones and tablets keep their normal behaviour. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CYAN = '#22d3ee', BLUE = '#4c8dff';
  var STORE_KEY = 'aam-cursor';

  /* section -> shape */
  var BY_PAGE = {
    index: 'crosshair',
    projects: 'gear', gallery: 'gear',
    publications: 'reticle',
    experience: 'hexnut', education: 'hexnut',
    about: 'orbit', achievements: 'orbit',
    blog: 'comet', contact: 'comet'
  };

  /* which hover effect each clickable thing gets */
  var VIEWABLE = '.viewable';
  var SMALL = '.btn, .nav-links a, .social, .theme-toggle, .ex-close, .skill-chip, .cursor-switch button, .nav-burger, .modal-close';
  var BLOCKS = '.card[href], .pub, a.contact-card, .link-list a, .aside-links a';
  var TARGETS = 'a[href], button, [role="button"], summary, label[for], select';
  var SPOTLIGHT = '.card, .glass, .pub, .contact-card, .skill-group, .panel';

  /* ---------------------------------------------------------------- */
  /* Shapes                                                            */
  /* ---------------------------------------------------------------- */
  function gearPath(teeth, ro, ri) {
    var pts = [], step = Math.PI * 2 / teeth;
    for (var i = 0; i < teeth; i++) {
      var a = i * step;
      [[ri, a - step * 0.5], [ri, a - step * 0.24], [ro, a - step * 0.15], [ro, a + step * 0.15], [ri, a + step * 0.24]]
        .forEach(function (p) { pts.push((p[0] * Math.cos(p[1])).toFixed(2) + ' ' + (p[0] * Math.sin(p[1])).toFixed(2)); });
    }
    return 'M' + pts.join('L') + 'Z';
  }

  function hexPoints(r) {
    var p = [];
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 3 * i;
      p.push((r * Math.cos(a)).toFixed(2) + ',' + (r * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }

  var SHAPES = {
    crosshair: {
      name: 'CAD crosshair', follow: 1, label: 'coords', hoverTurn: 45,
      svg: function () {
        return '<svg viewBox="-24 -24 48 48"><g stroke="' + CYAN + '" stroke-width="1.5" stroke-linecap="round">' +
          '<line x1="-21" y1="0" x2="-6" y2="0"/><line x1="6" y1="0" x2="21" y2="0"/>' +
          '<line x1="0" y1="-21" x2="0" y2="-6"/><line x1="0" y1="6" x2="0" y2="21"/></g>' +
          '<rect class="spin" x="-3" y="-3" width="6" height="6" fill="none" stroke="' + BLUE + '" stroke-width="1.5"/></svg>';
      }
    },
    gear: {
      name: 'Gear', follow: 0.3, spin: 40, spinHover: 280, shrinkOnHover: true,
      svg: function () {
        return '<svg viewBox="-24 -24 48 48"><g class="spin">' +
          '<path d="' + gearPath(10, 19, 14.5) + '" fill="rgb(76 141 255 / 0.16)" stroke="' + CYAN + '" stroke-width="1.4" stroke-linejoin="round"/>' +
          '<circle r="6" fill="none" stroke="' + BLUE + '" stroke-width="1.5"/></g><circle r="1.8" fill="' + CYAN + '"/></svg>';
      }
    },
    reticle: {
      name: 'Reticle', follow: 0.35, spin: 70, spinHover: 220, shrinkOnHover: true,
      svg: function () {
        return '<svg viewBox="-24 -24 48 48"><g stroke="' + BLUE + '" stroke-width="1.6" stroke-linecap="round">' +
          '<line x1="0" y1="-23" x2="0" y2="-19"/><line x1="0" y1="19" x2="0" y2="23"/>' +
          '<line x1="-23" y1="0" x2="-19" y2="0"/><line x1="19" y1="0" x2="23" y2="0"/></g>' +
          '<g class="spin"><circle r="15" fill="none" stroke="' + CYAN + '" stroke-width="1.8" stroke-dasharray="17 6.56" stroke-linecap="round"/></g>' +
          '<circle r="2" fill="' + CYAN + '"/></svg>';
      }
    },
    hexnut: {
      name: 'Hex nut', follow: 0.3, turnOnEnter: 60, shrinkOnHover: true,
      svg: function () {
        return '<svg viewBox="-24 -24 48 48"><g class="spin">' +
          '<polygon points="' + hexPoints(18) + '" fill="rgb(76 141 255 / 0.14)" stroke="' + CYAN + '" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<circle r="8.5" fill="#0a1120" stroke="' + BLUE + '" stroke-width="1.4"/>' +
          '<circle r="5.5" fill="none" stroke="' + BLUE + '" stroke-width="1" stroke-dasharray="2 2"/></g>' +
          '<circle r="1.8" fill="' + CYAN + '"/></svg>';
      }
    },
    orbit: {
      name: 'Orbit', follow: 0.3, orbit: true, shrinkOnHover: true,
      svg: function (uid) {
        return '<svg viewBox="-24 -24 48 48">' +
          '<defs><radialGradient id="core-' + uid + '"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="' + CYAN + '"/></radialGradient></defs>' +
          '<ellipse rx="19" ry="7" transform="rotate(-30)" fill="none" stroke="rgb(148 163 184 / 0.4)" stroke-width="1"/>' +
          '<ellipse rx="19" ry="7" transform="rotate(30)" fill="none" stroke="rgb(148 163 184 / 0.4)" stroke-width="1"/>' +
          '<circle class="sat-a" r="2.6" fill="' + CYAN + '" cx="16.5" cy="-9.5"/>' +
          '<circle class="sat-b" r="2.6" fill="' + BLUE + '" cx="-16.5" cy="-9.5"/>' +
          '<circle r="4" fill="url(#core-' + uid + ')"/></svg>';
      }
    },
    comet: {
      name: 'Comet arrow', follow: 1, tip: true, trail: true, hoverTurn: -14,
      svg: function (uid) {
        return '<svg viewBox="0 0 48 48"><defs><linearGradient id="arrow-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + CYAN + '"/><stop offset="1" stop-color="' + BLUE + '"/></linearGradient></defs>' +
          '<g class="spin"><polygon points="1,1 1,25 7.5,19 12,29 16.5,27 12,17.5 20.5,17.5" fill="url(#arrow-' + uid + ')" ' +
          'stroke="#04101f" stroke-width="1.3" stroke-linejoin="round"/></g></svg>';
      }
    }
  };
  var ORDER = ['crosshair', 'gear', 'reticle', 'hexnut', 'orbit', 'comet'];

  function stored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function store(v) {
    try {
      if (v) localStorage.setItem(STORE_KEY, v); else localStorage.removeItem(STORE_KEY);
    } catch (e) { /* storage unavailable: choice lasts for this page only */ }
  }

  function pageShape() {
    var page = document.body.getAttribute('data-page');
    return BY_PAGE[page] || 'crosshair';
  }

  /* ---------------------------------------------------------------- */
  function init() {
    var shapeEl = document.createElement('div');
    var cad = document.createElement('div');
    var trace = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var label = document.createElement('div');
    var glow = document.createElement('div');
    var canvas = document.createElement('canvas');
    shapeEl.className = 'cursor-shape';
    cad.className = 'cursor-cad';
    cad.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
    trace.setAttribute('class', 'cursor-trace');
    trace.innerHTML = '<rect></rect><circle r="2.6"></circle>';
    label.className = 'cursor-label';
    glow.className = 'cursor-glow';
    canvas.className = 'cursor-trail';
    [glow, canvas, cad, trace, shapeEl, label].forEach(function (el) {
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    });
    document.documentElement.classList.add('has-cursor');
    var ctx = canvas.getContext('2d');
    var corners = cad.querySelectorAll('i');
    var sizeTag = cad.querySelector('b');
    var traceRect = trace.querySelector('rect');
    var spark = trace.querySelector('circle');

    var current, spinEl, satA, satB;
    var choice = stored();
    if (choice && !SHAPES[choice]) choice = null;

    function use(id) {
      current = SHAPES[id];
      shapeEl.innerHTML = current.svg('live');
      shapeEl.classList.toggle('is-tip', !!current.tip);
      spinEl = shapeEl.querySelector('.spin');
      satA = shapeEl.querySelector('.sat-a');
      satB = shapeEl.querySelector('.sat-b');
      angle = 0; targetTurn = 0;
      trail.length = 0;
    }

    /* footer switcher */
    function buildSwitch() {
      var host = document.querySelector('.footer-bottom');
      if (!host) return;
      var wrap = document.createElement('div');
      wrap.className = 'cursor-switch';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Cursor style');
      var html = '<span class="cursor-switch-label">Cursor</span>' +
        '<button type="button" data-shape="" title="Auto: a different shape in each section">Auto</button>';
      ORDER.forEach(function (id) {
        html += '<button type="button" data-shape="' + id + '" title="' + SHAPES[id].name + '" aria-label="' +
                SHAPES[id].name + '">' + SHAPES[id].svg('sw-' + id) + '</button>';
      });
      wrap.innerHTML = html;
      host.insertBefore(wrap, host.lastElementChild);
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        choice = b.getAttribute('data-shape') || null;
        store(choice);
        use(choice || pageShape());
        mark();
      });
      function mark() {
        wrap.querySelectorAll('button').forEach(function (b) {
          b.setAttribute('aria-pressed', (b.getAttribute('data-shape') || null) === choice ? 'true' : 'false');
        });
      }
      mark();
    }

    /* state */
    var px = -300, py = -300, sx = px, sy = py, seen = false;
    var angle = 0, targetTurn = 0, phase = 0, press = 1, scale = 1;
    var hoverEl = null, hoverRadius = 8, viewMode = false, effect = '';
    var cornerPos = [[0, 0], [0, 0], [0, 0], [0, 0]], traceStart = 0;
    var gx = px, gy = py;
    var trail = [];
    var trailA = [76, 141, 255], trailB = [34, 211, 238], frameCount = 0;
    var last = performance.now();

    use(choice || pageShape());
    buildSwitch();

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function show(on) {
      seen = on;
      [shapeEl, glow].forEach(function (el) { el.classList.toggle('is-on', on); });
      if (!on) {
        label.classList.remove('is-on');
        if (hoverEl) hoverEl.classList.remove('fx-glow');
        hoverEl = null; effect = '';
      }
    }

    document.addEventListener('mousemove', function (e) {
      px = e.clientX;
      py = e.clientY;
      if (!seen) {            /* start where the pointer is, no fly-in */
        sx = px; sy = py; gx = px; gy = py;
        show(true);
      }
      if (effect === 'glow' && hoverEl) {
        var hr = hoverEl.getBoundingClientRect();
        hoverEl.style.setProperty('--gx', (px - hr.left) + 'px');
        hoverEl.style.setProperty('--gy', (py - hr.top) + 'px');
      }
      var card = e.target.closest && e.target.closest(SPOTLIGHT);
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (px - r.left) + 'px');
        card.style.setProperty('--my', (py - r.top) + 'px');
      }
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var view = t.closest(VIEWABLE);
      var small = view ? null : t.closest(SMALL);
      var el = view || small || t.closest(BLOCKS) || t.closest(TARGETS);
      viewMode = !!view;
      if (el === hoverEl) return;
      if (hoverEl) hoverEl.classList.remove('fx-glow');
      hoverEl = el;
      effect = view ? 'trace' : small ? 'glow' : el ? 'cad' : '';
      if (el) {
        hoverRadius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 6;
        if (current.turnOnEnter) targetTurn += current.turnOnEnter;
        if (effect === 'glow') el.classList.add('fx-glow');
        if (effect === 'trace') traceStart = performance.now();
        if (effect === 'cad') cornerPos = cornerPos.map(function () { return [px, py]; });
      }
    });

    document.addEventListener('mousedown', function () { press = 0.8; });
    document.addEventListener('mouseup', function () { press = 1; });
    document.documentElement.addEventListener('mouseleave', function () { show(false); });

    function lerp(a, b, k) { return a + (b - a) * k; }
    function pad4(n) { return String(Math.max(0, Math.round(n))).padStart(4, '0'); }

    function tick(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      var s = current;
      if (hoverEl && !hoverEl.isConnected) { hoverEl = null; effect = ''; }
      var hover = !!hoverEl;

      /* shape */
      var k = reduce ? 1 : s.follow;
      sx = lerp(sx, px, k);
      sy = lerp(sy, py, k);
      scale = lerp(scale, press * (hover && s.shrinkOnHover ? 0.8 : 1), 0.25);
      var off = s.tip ? 1 : 24;
      shapeEl.style.transform = 'translate3d(' + (sx - off).toFixed(1) + 'px,' + (sy - off).toFixed(1) + 'px,0) scale(' + scale.toFixed(3) + ')';

      if (!reduce) {
        if (s.spin) angle += (hover ? s.spinHover : s.spin) * dt;
        if (s.turnOnEnter) angle = lerp(angle, targetTurn, 0.12);
        if (s.hoverTurn) angle = lerp(angle, hover ? s.hoverTurn : 0, 0.2);
      }
      if (spinEl) spinEl.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ')');

      if (s.orbit && satA && satB) {
        phase += (reduce ? 0 : (hover ? 7 : 2.4)) * dt;
        var c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
        var ax = 19 * Math.cos(phase), ay = 7 * Math.sin(phase);
        var bx = 19 * Math.cos(phase + 2.2), by = 7 * Math.sin(phase + 2.2);
        satA.setAttribute('cx', (ax * c + ay * sn).toFixed(2));
        satA.setAttribute('cy', (-ax * sn + ay * c).toFixed(2));
        satB.setAttribute('cx', (bx * c - by * sn).toFixed(2));
        satB.setAttribute('cy', (bx * sn + by * c).toFixed(2));
      }

      var r = hover ? hoverEl.getBoundingClientRect() : null;

      /* CAD selection: brackets fly out of the cursor to the corners */
      var cadOn = hover && effect === 'cad';
      cad.classList.toggle('is-on', !!cadOn);
      if (cadOn) {
        var pad = r.height > 120 ? 8 : 6, cs = 14, ck = reduce ? 1 : 0.24;
        var goal = [[r.left - pad, r.top - pad], [r.right + pad - cs, r.top - pad],
                    [r.right + pad - cs, r.bottom + pad - cs], [r.left - pad, r.bottom + pad - cs]];
        for (var ci = 0; ci < 4; ci++) {
          var kk = reduce ? 1 : Math.max(0.08, ck - ci * 0.035);   /* corners land one after another */
          cornerPos[ci][0] = lerp(cornerPos[ci][0], goal[ci][0], kk);
          cornerPos[ci][1] = lerp(cornerPos[ci][1], goal[ci][1], kk);
          corners[ci].style.transform = 'translate3d(' + cornerPos[ci][0].toFixed(1) + 'px,' + cornerPos[ci][1].toFixed(1) + 'px,0)';
        }
        var dims = Math.round(r.width) + ' \u00d7 ' + Math.round(r.height);
        if (sizeTag.textContent !== dims) sizeTag.textContent = dims;
        sizeTag.style.transform = 'translate3d(' + (r.right + pad - sizeTag.offsetWidth).toFixed(1) + 'px,' +
                                  (r.top - pad - 22).toFixed(1) + 'px,0)';
      }

      /* laser trace: line draws around the image, then a spark circles it */
      var traceOn = hover && effect === 'trace';
      trace.classList.toggle('is-on', !!traceOn);
      if (traceOn) {
        var tp = 5, tw = r.width + tp * 2, th = r.height + tp * 2;
        var trad = Math.min(Math.max(hoverRadius, 6) + tp, th / 2);
        trace.setAttribute('width', tw.toFixed(1));
        trace.setAttribute('height', th.toFixed(1));
        trace.style.transform = 'translate3d(' + (r.left - tp).toFixed(1) + 'px,' + (r.top - tp).toFixed(1) + 'px,0)';
        traceRect.setAttribute('x', 1); traceRect.setAttribute('y', 1);
        traceRect.setAttribute('width', (tw - 2).toFixed(1)); traceRect.setAttribute('height', (th - 2).toFixed(1));
        traceRect.setAttribute('rx', trad.toFixed(1)); traceRect.setAttribute('ry', trad.toFixed(1));
        var L = traceRect.getTotalLength ? traceRect.getTotalLength() : 2 * (tw + th);
        var tt = reduce ? 1 : Math.min((now - traceStart) / 700, 1);
        traceRect.style.strokeDasharray = L.toFixed(1);
        traceRect.style.strokeDashoffset = (L * Math.pow(1 - tt, 3)).toFixed(1);
        if (traceRect.getPointAtLength) {
          var pt = traceRect.getPointAtLength(reduce ? 0 : ((now - traceStart) / 1000 * 280) % L);
          spark.setAttribute('cx', pt.x.toFixed(1));
          spark.setAttribute('cy', pt.y.toFixed(1));
        }
      }

      /* label: coordinates (crosshair) or "View" over images */
      var text = '';
      if (seen && viewMode && hover) text = 'VIEW';
      else if (seen && s.label === 'coords') text = hover ? 'SNAP' : 'X ' + pad4(px) + '  Y ' + pad4(py);
      if (text) {
        if (label.textContent !== text) label.textContent = text;
        label.classList.add('is-on');
        label.style.transform = 'translate3d(' + (px + 18) + 'px,' + (py + 16) + 'px,0)';
      } else {
        label.classList.remove('is-on');
      }

      /* glow */
      var gk = reduce ? 1 : 0.08;
      gx = lerp(gx, px, gk);
      gy = lerp(gy, py, gk);
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';

      /* comet trail (colours come from the theme: --trail-a / --trail-b) */
      if (!(frameCount++ % 30)) {
        var cs = getComputedStyle(document.documentElement);
        trailA = (cs.getPropertyValue('--trail-a') || '76,141,255').split(',').map(Number);
        trailB = (cs.getPropertyValue('--trail-b') || '34,211,238').split(',').map(Number);
      }
      if (trail.length || (s.trail && seen)) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (s.trail && seen && !reduce) {
        trail.push(px, py);
        if (trail.length > 44) trail.splice(0, 2);
        var n = trail.length / 2;
        for (var i = 0; i < n - 1; i++) {
          var f = i / n;
          ctx.beginPath();
          ctx.arc(trail[i * 2] + 3, trail[i * 2 + 1] + 4, 1 + f * 4, 0, Math.PI * 2);
          var ca = trailA, cb = trailB;
          ctx.fillStyle = 'rgba(' + Math.round(ca[0] + (cb[0] - ca[0]) * f) + ',' + Math.round(ca[1] + (cb[1] - ca[1]) * f) + ',' +
                          Math.round(ca[2] + (cb[2] - ca[2]) * f) + ',' + (f * 0.55).toFixed(3) + ')';
          ctx.fill();
        }
      } else if (trail.length) {
        trail.length = 0;
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var started = false;
  function maybeStart(e) {
    if (started || (e.pointerType && e.pointerType !== 'mouse')) return;
    started = true;
    window.removeEventListener('pointermove', maybeStart);
    init();
    /* place the cursor where the pointer already is */
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY }));
  }
  window.addEventListener('pointermove', maybeStart, { passive: true });
})();
