/* ==========================================================================
   Lightweight same-origin page router.

   Every page still works as a plain, fully self-contained HTML document
   (direct load, no-JS, view-source, curl) — this file is a progressive
   enhancement on top of that. It intercepts clicks on internal links,
   fetches the target page, swaps just the #page-main content, and updates
   the nav / title / URL — so navigating between pages no longer causes a
   full-document reload flash. Falls back to a normal navigation for
   external links, downloads, PDFs, and anything the fetch fails on.
   ========================================================================== */
(function () {
  function isRoutable(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== '' && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (!/\.html?$/i.test(url.pathname)) return false;
    return true;
  }

  function rewriteRelativeUrls(container, baseUrl) {
    container.querySelectorAll('[href], [src]').forEach(function (el) {
      var attr = el.hasAttribute('src') ? 'src' : 'href';
      var val = el.getAttribute(attr);
      if (!val) return;
      if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(val)) return; // absolute / protocol-relative
      if (/^(mailto:|tel:|#|data:)/i.test(val)) return;
      try { el.setAttribute(attr, new URL(val, baseUrl).href); } catch (e) { /* ignore */ }
    });
  }

  function setActiveNav(pageId) {
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.getAttribute('data-page') === pageId) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  function swapContent(html, url) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var newMain = doc.getElementById('page-main');
    var curMain = document.getElementById('page-main');
    if (!newMain || !curMain) { location.href = url; return; }

    rewriteRelativeUrls(newMain, url);
    curMain.innerHTML = newMain.innerHTML;
    document.title = doc.title;

    var pageId = doc.body ? doc.body.getAttribute('data-page') : null;
    if (pageId) setActiveNav(pageId);

    window.scrollTo(0, 0);
    document.body.classList.remove('nav-open');

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.dispatchEvent(new CustomEvent('page:swapped'));
  }

  function go(url, push) {
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('bad response ' + r.status);
        return r.text();
      })
      .then(function (html) {
        if (push) history.pushState({ url: url }, '', url);
        var apply = function () { swapContent(html, url); };
        if (document.startViewTransition) {
          document.startViewTransition(apply);
        } else {
          apply();
        }
      })
      .catch(function () {
        location.href = url;
      });
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a');
    if (!isRoutable(a)) return;
    if (a.href === location.href) { e.preventDefault(); return; }
    e.preventDefault();
    go(a.href, true);
  });

  window.addEventListener('popstate', function () {
    go(location.href, false);
  });
})();
