/* ==========================================================================
   imageslot.js — "this photo hasn't been added yet" cards.

   Every image the site expects but doesn't have yet ships as a 1x1
   transparent placeholder file. A placeholder still *loads* successfully, so
   an onerror handler wouldn't catch it — instead this checks the decoded
   width. Anything 2px or narrower is treated as not-yet-added, and the slot
   renders a small card naming the exact folder and filename to save into.

   Overwrite that file with a real photo and the card disappears on its own.
   No markup to edit, no data file to update.
   ========================================================================== */
(function () {
  'use strict';

  var PLACEHOLDER_MAX = 2; /* px — the shipped stand-ins are 1x1 */

  function pathOf(img) {
    var src = img.getAttribute('src') || '';
    /* Show the path as it sits in the project, not as a full URL. */
    return src.replace(/^.*?(assets\/)/, '$1').split('?')[0];
  }

  function copyBtn(path) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-copy';
    btn.textContent = 'Copy path';
    btn.addEventListener('click', function (e) {
      /* These slots often sit inside a whole-card <a> — don't navigate. */
      e.preventDefault();
      e.stopPropagation();
      var done = function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy path'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(path).then(done, function () {
          btn.textContent = 'Select the path above to copy';
        });
      } else {
        btn.textContent = 'Select the path above to copy';
      }
    });
    return btn;
  }

  function markPending(img) {
    if (img.dataset.slotDone) return;
    img.dataset.slotDone = '1';

    var host = img.parentElement;
    if (!host || host.querySelector('.slot-note')) return;

    var path = pathOf(img);
    var slash = path.lastIndexOf('/');
    var folder = slash > -1 ? path.slice(0, slash + 1) : '';
    var file = slash > -1 ? path.slice(slash + 1) : path;

    img.classList.add('is-pending');
    host.classList.add('has-slot-note');

    var note = document.createElement('div');
    note.className = 'slot-note';
    note.innerHTML =
      '<span class="slot-label">Photo not added yet</span>' +
      '<span class="slot-path"><span class="slot-dir">' + folder + '</span>' +
      '<strong>' + file + '</strong></span>';
    note.appendChild(copyBtn(path));

    host.appendChild(note);
  }

  function clear(img) {
    img.dataset.slotDone = '1';
    var host = img.parentElement;
    if (!host) return;
    host.classList.remove('has-slot-note');
    var note = host.querySelector('.slot-note');
    if (note) note.remove();
  }

  function check(img) {
    /* A missing file (naturalWidth 0 after load/error) counts as pending
       too, so a typo'd path surfaces as a slot card rather than a broken
       image icon. */
    if (img.naturalWidth > PLACEHOLDER_MAX) clear(img);
    else markPending(img);
  }

  function scan(root) {
    (root || document).querySelectorAll('img[data-slot]').forEach(function (img) {
      if (img.complete) {
        check(img);
      } else {
        img.addEventListener('load', function () { check(img); }, { once: true });
        img.addEventListener('error', function () { markPending(img); }, { once: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

  /* Cards are painted by render.js after both DOMContentLoaded and any
     router-driven page swap — rescan once the new markup exists. */
  document.addEventListener('content:rendered', function () { scan(); });
  document.addEventListener('page:swapped', function () { scan(); });
})();
