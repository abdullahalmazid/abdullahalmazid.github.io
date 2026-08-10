/* ==========================================================================
   chrome.js — builds the two pieces of page furniture that would otherwise
   have to be hand-maintained in all 41 HTML files:

     1. the dropdown submenus in the menu bar
     2. the right sidebar widgets

   Both read from assets/data/content.js, so adding a project or a blog post
   updates the menu and the sidebar along with everything else.
   ========================================================================== */
(function () {
  'use strict';

  function base() {
    return (document.body && document.body.getAttribute('data-base')) || '';
  }

  function esc(s) { return String(s == null ? '' : s); }

  /* ------------------------------------------------------------------ */
  /* 1. Menu bar submenus                                                */
  /* ------------------------------------------------------------------ */
  /* Each <li data-submenu="..."> in the markup gets its dropdown filled
     from the matching collection. */
  var SUBMENUS = {
    education: function (d) {
      var out = d.education.map(function (it) {
        return { href: 'education/' + it.slug + '.html', label: it.title };
      });
      out.push({ head: 'Coursework' });
      d.courses.forEach(function (c) {
        out.push({ href: 'courses/' + c.slug + '.html', label: c.title });
      });
      return out;
    },
    experience: function (d) {
      return d.experience.map(function (it) {
        return { href: 'experience/' + it.slug + '.html', label: it.title };
      });
    },
    projects: function (d) {
      return d.projects.map(function (it) {
        return { href: 'projects/' + it.slug + '.html', label: it.title };
      });
    },
    publications: function (d) {
      return d.publications.map(function (it) {
        return { href: 'publications/' + it.slug + '.html', label: it.title };
      });
    },
    blog: function (d) {
      return d.blog.map(function (it) {
        return { href: 'blog/' + it.slug + '.html', label: it.title };
      });
    }
  };

  function buildMenus() {
    var data = window.SITE_DATA;
    if (!data) return;

    document.querySelectorAll('.nav-links > li[data-submenu]').forEach(function (li) {
      var name = li.getAttribute('data-submenu');
      var fn = SUBMENUS[name];
      if (!fn) return;
      var items = fn(data);
      if (!items.length) return;

      var top = li.querySelector('a');
      var overview = top ? top.getAttribute('href') : null;
      var html = '';
      if (overview) {
        html += '<li><a href="' + overview + '">All ' + esc(top.textContent).trim().toLowerCase() + '</a></li>';
      }
      items.forEach(function (it) {
        if (it.head) {
          html += '<li><span class="sub-head">' + esc(it.head) + '</span></li>';
        } else {
          html += '<li><a href="' + base() + it.href + '">' + esc(it.label) + '</a></li>';
        }
      });

      var ul = document.createElement('ul');
      ul.className = 'sub';
      ul.innerHTML = html;
      li.appendChild(ul);
      li.classList.add('has-sub');
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Sidebar                                                          */
  /* ------------------------------------------------------------------ */
  function widget(title, body, cls) {
    return '<div class="widget' + (cls ? ' ' + cls : '') + '">' +
             (title ? '<h4>' + title + '</h4>' : '') + body +
           '</div>';
  }

  function aboutWidget() {
    return widget('About Me',
      '<img class="widget-portrait" src="' + base() + 'assets/img/profile.jpg" alt="Abdullah Al Mazid">' +
      '<p>Hi, I\u2019m Abdullah \u2014 an Industrial &amp; Production Engineering graduate from BUET, ' +
      'working across quality systems, operations research, manufacturing systems and applied ' +
      'machine learning.</p>' +
      '<p><a href="' + base() + 'about.html">Read more &rarr;</a></p>');
  }

  function exploreWidget(data) {
    var skip = { index: 1, contact: 1 };
    var items = data.pages.filter(function (p) { return !skip[p.id]; })
      .map(function (p) {
        return '<li><a href="' + base() + p.href + '">' + esc(p.label) + '</a></li>';
      }).join('');
    return widget('Explore', '<ul>' + items + '</ul>');
  }

  function postsWidget(data) {
    if (!data.blog.length) return '';
    var items = data.blog.slice(0, 5).map(function (b) {
      return '<li><a href="' + base() + 'blog/' + b.slug + '.html">' + esc(b.title) + '</a>' +
             (b.foot ? '<span class="widget-post-date">' + b.foot + '</span>' : '') + '</li>';
    }).join('');
    return widget('Recent Posts', '<ul>' + items + '</ul>');
  }

  /* Archive months are derived from the posts themselves rather than kept
     in a second list that could drift out of sync. */
  function archivesWidget(data) {
    var seen = [];
    data.blog.forEach(function (b) {
      var m = String(b.foot || '').split('&middot;')[0].trim();
      if (m && seen.indexOf(m) === -1) seen.push(m);
    });
    if (!seen.length) return '';
    var opts = seen.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('');
    return widget('Archives',
      '<select aria-label="Select a month"><option>Select Month</option>' + opts + '</select>');
  }

  function subscribeWidget() {
    return '<div class="widget subscribe-box">' +
             '<h4>Get in touch</h4>' +
             '<p>Interested in working together, or want to talk about a project? ' +
             'Send me a message.</p>' +
             '<p style="margin-bottom:0;"><a class="btn btn-primary" href="' + base() +
               'contact.html">Contact me</a></p>' +
           '</div>';
  }

  function linksWidget() {
    return widget('Elsewhere',
      '<ul>' +
      '<li><a href="https://github.com/abdullahalmazid" target="_blank" rel="noopener">GitHub</a></li>' +
      '<li><a href="https://www.linkedin.com/in/abdullahalmazid/" target="_blank" rel="noopener">LinkedIn</a></li>' +
      '<li><a href="' + base() + 'assets/Abdullah_Al_Mazid_CV.pdf" target="_blank" rel="noopener">Download CV</a></li>' +
      '</ul>');
  }

  function buildSidebar() {
    var data = window.SITE_DATA;
    var host = document.querySelector('.sidebar');
    if (!data || !host || host.dataset.built) return;
    host.dataset.built = '1';
    host.innerHTML =
      aboutWidget() +
      exploreWidget(data) +
      postsWidget(data) +
      archivesWidget(data) +
      linksWidget() +
      subscribeWidget();
  }

  function init() {
    buildMenus();
    buildSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* The router swaps #page-main, which takes the sidebar with it — rebuild
     it. The menu bar lives outside #page-main and survives untouched. */
  document.addEventListener('page:swapped', function () { buildSidebar(); });
})();
