/* ==========================================================================
   imageslot.js — keeps not-yet-added photos out of sight.

   Images the site expects but doesn't have yet ship as 1x1 placeholder
   files. A placeholder still loads successfully, so this checks the decoded
   width instead: anything 2px or narrower (or a file that fails to load)
   counts as "not added yet".

     - On a card, the cover becomes a quiet graph-paper panel showing the
       item's glyph (see .card-cover.is-empty in style.css).
     - Anywhere else (detail covers, figures, gallery tiles) the whole
       figure is hidden, so visitors never see an empty frame.

   Save the real photo over the placeholder file and it simply appears.
   ========================================================================== */
(function () {
  'use strict';

  var PLACEHOLDER_MAX = 2; /* px — the shipped stand-ins are 1x1 */
  var SELECTOR = 'img[data-slot], .detail-cover img, .project-figure img, .gallery-item img';
  var HIDE_WHOLE = '.gallery-item, .detail-cover, .project-figure, figure';

  function markEmpty(img) {
    var cover = img.closest('.card-cover');
    if (cover) {
      cover.classList.add('is-empty');
      return;
    }
    var box = img.closest(HIDE_WHOLE) || img;
    box.hidden = true;
  }

  function check(img) {
    if (img.dataset.slotChecked) return;
    img.dataset.slotChecked = '1';
    if (img.naturalWidth <= PLACEHOLDER_MAX) markEmpty(img);
  }

  function scan(root) {
    (root || document).querySelectorAll(SELECTOR).forEach(function (img) {
      if (img.complete) {
        check(img);
      } else {
        img.addEventListener('load', function () { check(img); }, { once: true });
        img.addEventListener('error', function () { img.dataset.slotChecked = '1'; markEmpty(img); }, { once: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

  /* render.js paints cards after DOMContentLoaded — rescan its output. */
  document.addEventListener('content:rendered', function () { scan(); });
})();
