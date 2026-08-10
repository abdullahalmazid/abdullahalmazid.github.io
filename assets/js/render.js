/* ==========================================================================
   render.js — turns the arrays in assets/data/content.js into cards.

   Any element carrying data-render="<collection>" is filled in on page load:

     <div class="grid grid-2" data-render="projects"></div>
     <div class="grid" data-render="publications" data-limit="3"></div>

   data-limit  show only the first N items (used by the homepage sections)

   Cards are built with exactly the same markup the listing pages used to
   hard-code, so a homepage card and a listing card stay identical in width,
   fields and structure by construction rather than by hand.
   ========================================================================== */
(function () {
  'use strict';

  /* Pages inside a subfolder carry <body data-base="../"> so paths written
     from the site root in content.js still resolve. */
  function base() {
    return (document.body && document.body.getAttribute('data-base')) || '';
  }

  /* Which folder holds the detail pages for each collection. Collections
     absent from this map (achievements) render as non-clickable cards. */
  var FOLDER = {
    publications: 'publications/',
    projects: 'projects/',
    experience: 'experience/',
    education: 'education/',
    blog: 'blog/',
    courses: 'courses/'
  };

  /* Accent colour used for the tag dot and cover tint, per collection. */
  var TYPE = {
    publications: 'publication',
    projects: 'project',
    experience: 'experience',
    education: 'education',
    blog: 'project',
    achievements: 'achievement',
    courses: 'education'
  };

  function withBase(str) {
    return String(str).replace(/\{base\}/g, base());
  }

  /* ---------------------------------------------------------------- */
  /* Cover slot                                                        */
  /* ---------------------------------------------------------------- */
  /* An item may name a real photo, a fallback glyph, or both. When both
     are present the photo wins if the file is real; imageslot.js swaps in
     the glyph (plus the file path, so you know what to save) if it is
     still a placeholder. */
  function cover(item, type) {
    var c = item.cover;
    if (!c) return '';
    var glyph = c.glyph ? ' data-glyph="' + c.glyph + '"' : '';
    var html = '<div class="card-cover ' + type + '"' + glyph + '>';
    if (c.img) {
      html += '<img data-slot src="' + base() + c.img + '" alt="' + (c.alt || '') + '" loading="lazy">';
    }
    return html + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* One card                                                          */
  /* ---------------------------------------------------------------- */
  function card(item, collection) {
    var type = TYPE[collection] || 'project';
    var folder = FOLDER[collection];
    var href = folder && item.slug ? base() + folder + item.slug + '.html' : null;

    var inner = '';
    inner += cover(item, type);
    inner += '<div class="card-kicker"><span class="tag-dot ' + type + '"></span>' +
             (item.kicker || '') + '</div>';
    inner += '<h3>' + item.title + '</h3>';
    if (item.summary) inner += '<p>' + withBase(item.summary) + '</p>';
    if (item.foot || href) {
      inner += '<div class="card-foot"><span>' + (item.foot || '&nbsp;') + '</span>' +
               (href ? '<span>Read more &rarr;</span>' : '') + '</div>';
    }

    var attrs = 'class="card"';
    return href
      ? '<a ' + attrs + ' href="' + href + '">' + inner + '</a>'
      : '<div ' + attrs + '>' + inner + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Gallery tile — thumbnail with the caption printed beneath it       */
  /* ---------------------------------------------------------------- */
  function tile(item, index) {
    var alt = String(item.caption || '').replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
    return '' +
      '<figure class="gallery-item">' +
        '<div class="shot">' +
          '<img data-slot class="viewable" src="' + base() + item.img + '" alt="' + alt +
            '" loading="lazy">' +
        '</div>' +
        '<figcaption>' + (item.caption || '') + '</figcaption>' +
      '</figure>';
  }

  /* ---------------------------------------------------------------- */
  /* Section tile — a large visual entry point to a whole section       */
  /* ---------------------------------------------------------------- */
  function sectionTile(item) {
    return '<a class="tile" href="' + base() + item.href + '">' +
             '<div class="tile-img">' +
               '<img data-slot src="' + base() + item.img + '" alt="" loading="lazy">' +
             '</div>' +
             '<span class="tile-label">' + item.label + '</span>' +
           '</a>';
  }

  /* ---------------------------------------------------------------- */
  /* Stat rail                                                         */
  /* ---------------------------------------------------------------- */
  function stat(item) {
    return '<div class="stat-well">' +
             '<span class="n">' + item.value + '</span>' +
             '<span class="l">' + item.label + '</span>' +
           '</div>';
  }

  /* ---------------------------------------------------------------- */
  function paint(root) {
    var data = window.SITE_DATA;
    if (!data) return;

    (root || document).querySelectorAll('[data-render]').forEach(function (el) {
      var name = el.getAttribute('data-render');
      var items = data[name];
      if (!items) return;

      var limit = parseInt(el.getAttribute('data-limit'), 10);
      if (limit > 0) items = items.slice(0, limit);

      var html;
      if (name === 'tiles') {
        html = items.map(sectionTile).join('');
      } else if (name === 'gallery') {
        html = items.map(tile).join('');
      } else if (name === 'stats') {
        html = items.map(stat).join('');
      } else {
        html = items.map(function (item) { return card(item, name); }).join('');
      }
      el.innerHTML = html;
    });

    document.dispatchEvent(new CustomEvent('content:rendered'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { paint(); });
  } else {
    paint();
  }

  /* router.js swaps #page-main without a reload — re-render afterwards. */
  document.addEventListener('page:swapped', function () { paint(); });
})();
