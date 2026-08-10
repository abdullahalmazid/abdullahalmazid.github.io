/* ==========================================================================
   Shared site behavior: mobile menu, dropdown handling, footer year.
   Vanilla JS, no dependencies — works straight from GitHub Pages.

   The dark/light theme toggle was removed with the restyle; the site now
   ships a single light palette.
   ========================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var burger = document.getElementById('nav-burger');
    if (burger) {
      burger.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    /* Dropdowns open on hover via CSS. That never fires on a touch screen,
       so there the first tap on a parent opens its submenu instead of
       following the link; a second tap navigates. */
    var coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (coarse) {
      document.addEventListener('click', function (e) {
        var link = e.target.closest('.nav-links > li.has-sub > a');
        if (!link) return;
        var li = link.parentElement;
        if (!li.classList.contains('is-open')) {
          e.preventDefault();
          document.querySelectorAll('.nav-links > li.is-open').forEach(function (o) {
            if (o !== li) o.classList.remove('is-open');
          });
          li.classList.add('is-open');
        }
      });
    }

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
