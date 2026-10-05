/* ==========================================================================
   Image lightbox: any <img class="viewable"> becomes clickable, opening a
   full-size view in an overlay. Click the overlay, the close button, or
   press Escape to dismiss.
   ========================================================================== */
(function () {
  function buildLightbox() {
    if (document.getElementById('lightbox-modal')) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay lightbox-overlay';
    overlay.id = 'lightbox-modal';
    overlay.innerHTML =
      '<div class="lightbox-panel">' +
      '<button class="modal-close" id="lightbox-close" type="button" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<img id="lightbox-img" src="" alt="">' +
      '<div class="lightbox-caption" id="lightbox-caption"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  function openLightbox(src, alt) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-img').alt = alt || '';
    document.getElementById('lightbox-caption').textContent = alt || '';
    document.getElementById('lightbox-modal').classList.add('is-open');
  }

  function closeLightbox() {
    var overlay = document.getElementById('lightbox-modal');
    if (overlay) overlay.classList.remove('is-open');
  }

  function wire() {
    buildLightbox();
    document.querySelectorAll('img.viewable, .gallery-item img').forEach(function (img) {
      if (img.dataset.lbWired) return;
      img.dataset.lbWired = '1';
      img.addEventListener('click', function () {
        var figcaption = img.closest('figure') && img.closest('figure').querySelector('figcaption');
        var caption = (figcaption && figcaption.textContent.trim()) || img.alt;
        openLightbox(img.currentSrc || img.src, caption);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', wire);
  /* images added later (explorer panels) */
  document.addEventListener('content:rendered', wire);
})();
