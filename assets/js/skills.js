/* ==========================================================================
   Renders skill categories/chips from SKILLS_DATA into any
   <div class="skill-groups" id="skills-root"></div> found on the page, and
   wires up: hover -> tooltip (pure CSS, via data-tip), click -> modal with
   fuller description + level meter.
   ========================================================================== */
(function () {
  function levelLabel(n) {
    return n >= 3 ? 'Core to a major project' : n === 2 ? 'Applied in a project' : 'Familiar (coursework)';
  }

  function buildModal() {
    if (document.getElementById('skill-modal')) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'skill-modal';
    overlay.innerHTML =
      '<div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="skill-modal-title">' +
      '<button class="modal-close" id="skill-modal-close" type="button" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<div class="modal-category" id="skill-modal-category"></div>' +
      '<h3 id="skill-modal-title"></h3>' +
      '<p id="skill-modal-desc"></p>' +
      '<div class="modal-level">' +
      '<span class="lvl-label" id="skill-modal-level-label"></span>' +
      '<div class="lvl-track" id="skill-modal-level-track"></div>' +
      '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.getElementById('skill-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(skill, category) {
    var overlay = document.getElementById('skill-modal');
    document.getElementById('skill-modal-category').textContent = category;
    document.getElementById('skill-modal-title').textContent = skill.name;
    document.getElementById('skill-modal-desc').textContent = skill.description;
    document.getElementById('skill-modal-level-label').textContent = levelLabel(skill.level);
    var track = document.getElementById('skill-modal-level-track');
    track.innerHTML = '';
    for (var i = 1; i <= 3; i++) {
      var seg = document.createElement('div');
      seg.className = 'lvl-seg' + (i <= skill.level ? ' filled' : '');
      track.appendChild(seg);
    }
    overlay.classList.add('is-open');
  }

  function closeModal() {
    var overlay = document.getElementById('skill-modal');
    if (overlay) overlay.classList.remove('is-open');
  }

  function render() {
    var root = document.getElementById('skills-root');
    if (!root || !window.SKILLS_DATA) return;
    buildModal();

    var html = '';
    window.SKILLS_DATA.forEach(function (group) {
      html += '<div class="skill-group"><h3>' + group.category + '</h3><div class="chip-row">';
      group.skills.forEach(function (skill) {
        html += '<button type="button" class="skill-chip" data-tip="' +
          skill.blurb.replace(/"/g, '&quot;') + '" data-category="' +
          group.category.replace(/"/g, '&quot;') + '" data-id="' + skill.id + '">' +
          '<span class="lvl-dot"></span>' + skill.name + '</button>';
      });
      html += '</div></div>';
    });
    root.innerHTML = html;

    root.querySelectorAll('.skill-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = window.SKILLS_DATA.find(function (g) { return g.category === chip.getAttribute('data-category'); });
        var skill = group && group.skills.find(function (s) { return s.id === chip.getAttribute('data-id'); });
        if (skill) openModal(skill, group.category);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('page:swapped', render);
})();
