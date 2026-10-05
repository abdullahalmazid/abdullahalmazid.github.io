/* ==========================================================================
   render.js — turns the arrays in assets/data/content.js into page content.

   Any element carrying data-render="<collection>" is filled in on page load:

     <div class="project-list" data-render="projects" data-limit="3"></div>
     <ol class="pub-list" data-render="publications"></ol>
     <ul class="timeline" data-render="experience" data-style="timeline"></ul>

   data-limit     show only the first N items (used by the homepage)
   data-exclude   leave out the item with this slug (sidebar "More ..." lists)
   data-no-cover  leave out cover images (education, achievements, blog list)
   data-style     "timeline" renders a vertical timeline instead of cards
   data-link      "explorer" links items to their listing page's explorer
                  (projects.html#slug) instead of the standalone page

   The element type picks the layout otherwise: <ol> renders publication
   rows, <ul> renders a list of links (coursework), anything else renders
   cards. A homepage card and a listing card come from the same function,
   so they always match.
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

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function withBase(str) {
    return String(str).replace(/\{base\}/g, base());
  }

  /* Listing page that hosts each collection's explorer (explorer.js) */
  var LISTING = {
    projects: 'projects.html',
    publications: 'publications.html',
    blog: 'blog.html',
    experience: 'experience.html',
    education: 'experience.html'
  };
  var toExplorer = false;   /* set per container: data-link="explorer" */

  function hrefFor(item, collection) {
    if (toExplorer && LISTING[collection] && item.slug) {
      return base() + LISTING[collection] + '#' + item.slug;
    }
    var folder = FOLDER[collection];
    return folder && item.slug ? base() + folder + item.slug + '.html' : null;
  }

  /* "A &middot; B" in content.js -> separate parts */
  function parts(str) {
    return String(str || '').split(/\s*&middot;\s*/).filter(Boolean);
  }

  function plain(str) {
    return parts(str).join(', ');
  }

  /* ---------------------------------------------------------------- */
  /* Cover slot                                                        */
  /* ---------------------------------------------------------------- */
  /* A real photo, a glyph, or both. imageslot.js turns a not-yet-added
     photo into a grid-paper panel showing the glyph. */
  function cover(item) {
    var c = item.cover;
    if (!c) return '';
    var glyph = c.glyph ? ' data-glyph="' + c.glyph + '"' : '';
    var html = '<div class="card-cover"' + glyph + '>';
    if (c.img) {
      html += '<img data-slot src="' + base() + c.img + '" alt="' + (c.alt || '') + '" loading="lazy">';
    }
    return html + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Card                                                              */
  /* ---------------------------------------------------------------- */
  function card(item, collection, noCover) {
    var href = hrefFor(item, collection);
    var kick = parts(item.kicker);

    var body = '';
    if (kick.length > 1) {
      body += '<div class="card-tags">' +
                kick.map(function (k) { return '<span class="tag">' + k + '</span>'; }).join('') +
              '</div>';
    } else if (kick.length === 1) {
      body += '<p class="card-kicker">' + kick[0] + '</p>';
    }
    body += '<h3>' + item.title + '</h3>';
    if (item.summary) body += '<p>' + withBase(item.summary) + '</p>';
    if (item.foot || href) {
      body += '<div class="card-foot"><span>' + (item.foot || '') + '</span>' +
              (href ? '<span class="card-go">' + ARROW + '</span>' : '') + '</div>';
    }

    var showCover = !noCover && item.cover;
    var cls = 'card' + (showCover ? '' : ' no-cover');
    var inner = (showCover ? cover(item) : '') + '<div class="card-body">' + body + '</div>';
    return href
      ? '<a class="' + cls + '" href="' + href + '">' + inner + '</a>'
      : '<div class="' + cls + '">' + inner + '</div>';
  }

  /* ---------------------------------------------------------------- */
  /* Publication row — year, title, venue and DOI                      */
  /* ---------------------------------------------------------------- */
  function publication(item) {
    var year = (String(item.kicker || '').match(/\b(19|20)\d{2}\b/) || [''])[0];
    var meta = plain(item.kicker);
    if (item.foot) meta += (meta ? ' &middot; ' : '') + item.foot;
    return '<li class="pub">' +
             '<span class="pub-year">' + year + '</span>' +
             '<div><a class="pub-title" href="' + hrefFor(item, 'publications') + '">' + item.title + '</a>' +
             (item.summary ? '<p class="pub-summary">' + item.summary + '</p>' : '') +
             '<p class="pub-meta">' + meta + '</p></div>' +
             '<span class="card-go">' + ARROW + '</span>' +
           '</li>';
  }

  /* ---------------------------------------------------------------- */
  /* Timeline entry (experience / education on the homepage)          */
  /* ---------------------------------------------------------------- */
  function timelineItem(item, collection) {
    var href = hrefFor(item, collection);
    var when = item.foot && /\d{4}/.test(item.foot) && collection === 'experience'
      ? item.foot : item.kicker;
    var foot = collection === 'experience' ? item.kicker : item.foot;
    var title = href ? '<a href="' + href + '">' + item.title + '</a>' : item.title;
    return '<li class="tl-item">' +
             '<span class="tl-when">' + plain(when) + '</span>' +
             '<h3>' + title + '</h3>' +
             (item.summary ? '<p>' + withBase(item.summary) + '</p>' : '') +
             (foot ? '<p class="tl-foot">' + plain(foot) + '</p>' : '') +
           '</li>';
  }

  /* ---------------------------------------------------------------- */
  /* Plain link row — coursework list                                  */
  /* ---------------------------------------------------------------- */
  function linkItem(item, collection) {
    var href = hrefFor(item, collection);
    return '<li>' + (href ? '<a href="' + href + '">' + item.title + '</a>' : item.title) + '</li>';
  }

  /* ---------------------------------------------------------------- */
  /* Homepage figure                                                   */
  /* ---------------------------------------------------------------- */
  function stat(item) {
    var count = item.still ? '' : ' data-count="' + item.value + '"';
    return '<div class="fact">' +
             '<span class="n"' + count + '>' + item.value + '</span>' +
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

      var exclude = el.getAttribute('data-exclude');
      if (exclude) items = items.filter(function (it) { return it.slug !== exclude; });

      var limit = parseInt(el.getAttribute('data-limit'), 10);
      if (limit > 0) items = items.slice(0, limit);

      /* A sidebar box with nothing to list (e.g. "More posts" with one post) */
      var box = el.closest('.aside-card');
      if (box && !items.length) { box.hidden = true; return; }

      toExplorer = el.getAttribute('data-link') === 'explorer';
      var html;
      if (name === 'stats') {
        html = items.map(stat).join('');
      } else if (el.getAttribute('data-style') === 'timeline') {
        html = items.map(function (item) { return timelineItem(item, name); }).join('');
      } else if (name === 'publications' && el.tagName === 'OL') {
        html = items.map(publication).join('');
      } else if (el.tagName === 'UL') {
        html = items.map(function (item) { return linkItem(item, name); }).join('');
      } else {
        var noCover = el.hasAttribute('data-no-cover');
        html = items.map(function (item) { return card(item, name, noCover); }).join('');
      }
      el.innerHTML = html;
    });
    toExplorer = false;

    document.dispatchEvent(new CustomEvent('content:rendered'));
  }

  /* explorer.js calls this after inserting an item's content */
  window.SiteRender = { paint: paint };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { paint(); });
  } else {
    paint();
  }
})();
