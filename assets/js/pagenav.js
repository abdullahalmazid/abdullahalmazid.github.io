/* ==========================================================================
   pagenav.js — builds the page-bottom navigation from assets/data/content.js.

   Markup on a top-level page:      <div class="page-nav" data-pagenav="projects">
   Markup on a detail page:         <div class="page-nav" data-pagenav="projects:shantui-bulldozer">

   Top-level pages step through the tabs in SITE_DATA.pages; detail pages step
   through their siblings in that collection. Both wrap around end-to-start.

   This replaces what used to be hand-maintained markup: adding a project no
   longer means editing the Previous/Next links on three separate files, since
   the whole chain is derived from the array order at render time.
   ========================================================================== */
(function () {
  'use strict';

  function base() {
    return (document.body && document.body.getAttribute('data-base')) || '';
  }

  var FOLDER = {
    publications: 'publications/',
    projects: 'projects/',
    experience: 'experience/',
    education: 'education/',
    blog: 'blog/',
    courses: 'courses/'
  };

  function link(cls, dir, href, label) {
    return '<a class="' + cls + '" href="' + href + '">' +
             '<span class="pn-dir">' + dir + '</span>' +
             '<span class="pn-title">' + label + '</span>' +
           '</a>';
  }

  function browseRow(currentPageId) {
    var pages = window.SITE_DATA.pages;
    var parts = pages.map(function (p) {
      return p.id === currentPageId
        ? '<span class="pn-current">' + p.label + '</span>'
        : '<a href="' + base() + p.href + '">' + p.label + '</a>';
    });
    return '<span class="pn-label">Browse</span> ' +
           parts.join(' <span class="pn-sep">&middot;</span> ');
  }

  /* Returns { prev, next } as {href, label}, wrapping around the ends. */
  function neighbours(list, index, hrefFor, labelFor) {
    var n = list.length;
    if (n < 2) return null;
    var p = list[(index - 1 + n) % n];
    var q = list[(index + 1) % n];
    return {
      prev: { href: hrefFor(p), label: labelFor(p) },
      next: { href: hrefFor(q), label: labelFor(q) }
    };
  }

  function build(el) {
    var data = window.SITE_DATA;
    if (!data) return;

    var spec = (el.getAttribute('data-pagenav') || '').split(':');
    var collection = spec[0];
    var slug = spec[1];
    var pair = null;
    var currentTab = collection;

    if (slug) {
      /* Detail page — step between siblings in the same folder. */
      var list = data[collection] || [];
      var idx = -1;
      for (var i = 0; i < list.length; i++) {
        if (list[i].slug === slug) { idx = i; break; }
      }
      /* Courses live under Education in the top-level tab row. */
      if (collection === 'courses') currentTab = 'education';
      if (idx > -1) {
        var folder = FOLDER[collection] || '';
        pair = neighbours(list, idx,
          function (it) { return base() + folder + it.slug + '.html'; },
          function (it) { return it.title; });
      }
    }

    /* Either a top-level page, or a detail page in a collection with nothing
       to step to (a single project, a lone blog post). Falling back to the tab
       row keeps every page a route onward instead of a dead end. */
    if (!pair) {
      var pages = data.pages;
      var pIdx = -1;
      for (var j = 0; j < pages.length; j++) {
        if (pages[j].id === currentTab) { pIdx = j; break; }
      }
      if (pIdx > -1) {
        pair = neighbours(pages, pIdx,
          function (p) { return base() + p.href; },
          function (p) { return p.label; });
      }
    }

    var html = '<div class="page-nav-browse">' + browseRow(currentTab) + '</div>';
    if (pair) {
      /* With only two entries the chain wraps onto the same sibling in both
         directions — showing it twice would read as a bug, so show Next only. */
      var same = pair.prev.href === pair.next.href;
      html += '<div class="page-nav-seq' + (same ? ' is-single' : '') + '">' +
                (same ? '' : link('pn-prev', '&larr; Previous', pair.prev.href, pair.prev.label)) +
                link('pn-next', 'Next &rarr;', pair.next.href, pair.next.label) +
              '</div>';
    }
    el.innerHTML = html;
  }

  function paint(root) {
    (root || document).querySelectorAll('[data-pagenav]').forEach(build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { paint(); });
  } else {
    paint();
  }
  document.addEventListener('page:swapped', function () { paint(); });
})();
