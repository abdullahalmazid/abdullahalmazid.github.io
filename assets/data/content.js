/* ==========================================================================
   content.js — the single source of truth for every listing on this site.

   Listing pages, the homepage sections, and the Previous/Next chains are all
   rendered from this file by assets/js/render.js and assets/js/pagenav.js.

   TO ADD A NEW ITEM: add one object to the right array below, and create the
   matching detail page by copying that folder's _template.html. Nothing else
   needs editing — the listing page, the homepage section, and the prev/next
   links on the new page AND its neighbours all update themselves.

   Field reference (projects / blog / experience / achievements):
     slug     file name inside the folder, without ".html"
     title    card heading
     kicker   small line above the heading
     summary  one-paragraph description on the card
     foot     small text in the bottom-left of the card
     cover    { img: 'assets/img/...', alt: '...' }   a real photo
              { glyph: 'X' }                          a themed letter instead

   Paths in `img` are written as if from the site root — the renderer adjusts
   them automatically for pages inside a subfolder.
   ========================================================================== */
window.SITE_DATA = (function () {
  return {

    /* ------------------------------------------------------------------ */
    /* Top-level tabs — order here drives the "Browse" row and the        */
    /* Previous/Next pair on every top-level page (it wraps around).      */
    /* ------------------------------------------------------------------ */
    pages: [
      { id: 'index',        href: 'index.html',        label: 'Home' },
      { id: 'about',        href: 'about.html',        label: 'About' },
      { id: 'education',    href: 'education.html',    label: 'Education' },
      { id: 'experience',   href: 'experience.html',   label: 'Experience' },
      { id: 'projects',     href: 'projects.html',     label: 'Projects' },
      { id: 'publications', href: 'publications.html', label: 'Publications' },
      { id: 'blog',         href: 'blog.html',         label: 'Blog' },
      { id: 'achievements', href: 'achievements.html', label: 'Achievements' },
      { id: 'gallery',      href: 'gallery.html',      label: 'Gallery' },
      { id: 'contact',      href: 'contact.html',      label: 'Contact' }
    ],

    /* ------------------------------------------------------------------ */
    /* Homepage figures. `value` may end in a suffix (e.g. "6+") — the     */
    /* count-up animation reads the number and keeps whatever follows it.  */
    /* ------------------------------------------------------------------ */
    stats: [
      { value: '3.67', label: 'CGPA / 4.00' },
      { value: '3',    label: 'Peer-reviewed papers' },
      { value: '6',    label: 'Engineering & research projects' },
      { value: '2026', label: 'BUET, IPE graduate', still: true }
    ],

    /* ------------------------------------------------------------------ */
    /* Home page "click to open" tiles — the big visual entry points.     */
    /* Each banner is an image slot: until you save the real file, the     */
    /* tile shows the path to save it to.                                  */
    /* ------------------------------------------------------------------ */
    tiles: [
      { href: 'projects.html',     label: 'Projects',     img: 'assets/img/tiles/projects.jpg' },
      { href: 'publications.html', label: 'Publications', img: 'assets/img/tiles/publications.jpg' },
      { href: 'education.html',    label: 'Education',    img: 'assets/img/tiles/education.jpg' },
      { href: 'experience.html',   label: 'Experience',   img: 'assets/img/tiles/experience.jpg' },
      { href: 'gallery.html',      label: 'Gallery',      img: 'assets/img/tiles/gallery.jpg' },
      { href: 'blog.html',         label: 'Blog',         img: 'assets/img/tiles/blog.jpg' }
    ],

    /* ------------------------------------------------------------------ */
    /* Publications — text-first cards (no cover slot): a reader scanning  */
    /* this page wants the venue and the DOI, not a thumbnail.            */
    /* ------------------------------------------------------------------ */
    publications: [
      {
        slug: 'egov-lens',
        kicker: 'ICCIT 2025 &middot; IEEE &middot; Conference Paper',
        title: 'eGov-Lens: Multi-Dimensional ML for Aspect-Based Bengali Public Feedback Analysis',
        foot: 'DOI 10.1109/ICCIT68739.2025.11491291'
      },
      {
        slug: 'stochastic-manufacturing',
        kicker: 'IEOM Bangladesh 2025 &middot; Conference Paper',
        title: 'Stochastic Modeling of Throughput-Quality Dynamics in Labor-Intensive Manufacturing',
        foot: 'DOI 10.46254/BA08.20250379'
      },
      {
        slug: 'pla-fea-validation',
        kicker: 'IEOM Bangladesh 2024 &middot; Conference Paper',
        title: 'Validation of Temperature Effect on 3D Printed PLA Materials using FEA &amp; Hyperelastic Modeling',
        foot: 'DOI 10.46254/BA07.20240046'
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Projects                                                            */
    /* ------------------------------------------------------------------ */
    projects: [
      {
        slug: 'iot-smart-conveyor',
        kicker: 'Automation &middot; Quality &amp; Inventory Control',
        title: 'IoT-Based Smart Conveyor System for Integrated Quality, Inventory and Process Control',
        summary: 'Weight-triggered conveyor automation with real-time inventory tracking and IoT-based remote monitoring, built for BUET\u2019s Computer Integrated Manufacturing course.',
        foot: 'BUET &middot; Group B8',
        cover: { img: 'assets/img/projects/iot-smart-conveyor/prototype.jpg', alt: 'Prototype of the IoT smart conveyor system' }
      },
      {
        slug: 'cafeteria-production-planning',
        kicker: 'Optimization &middot; Production Planning',
        title: 'Operations Research Optimization &mdash; Cafeteria Production Planning',
        summary: 'A linear programming model optimizing production quantity and pricing under demand, resource, and operational constraints using Gurobi and Excel Solver.',
        foot: 'BUET',
        cover: { img: 'assets/img/projects/cafeteria-production-planning/cover.jpg', alt: 'Cafeteria production planning optimization model', glyph: '&Sigma;' }
      },
      {
        slug: 'shoe-cleaning-machine',
        kicker: 'Product Design &middot; Engineering Analysis',
        title: 'Semi-Automated Shoe Cleaning Machine',
        summary: 'A full product-design study &mdash; QFD, material selection, Ansys structural validation, and cost analysis &mdash; for BUET\u2019s Product Design-II course.',
        foot: 'BUET &middot; Group B14',
        cover: { img: 'assets/img/projects/shoe-cleaning-machine/final-design.jpg', alt: 'Final design of the semi-automated shoe cleaning machine' }
      },
      {
        slug: 'floor-plan-design',
        kicker: 'AutoCAD &middot; 2D Architectural Drafting',
        title: 'Residential Floor Plan Design',
        summary: 'A complete 2D floor plan for a 3-bedroom residential building, drafted as a construction-ready blueprint.',
        foot: 'AutoCAD',
        cover: { img: 'assets/img/projects/floor-plan-design/cover.jpg', alt: 'Residential floor plan drafted in AutoCAD', glyph: 'F' }
      },
      {
        slug: 'shantui-bulldozer',
        kicker: 'SolidWorks &middot; Advanced 3D CAD Design',
        title: 'Shantui Compact Bulldozer',
        summary: 'A highly detailed 3D CAD model of a Shantui compact bulldozer, replicating real-world engineering structure and functionality.',
        foot: 'SolidWorks &middot; Ansys',
        cover: { img: 'assets/img/projects/shantui-bulldozer/cover.jpg', alt: '3D CAD model of a Shantui compact bulldozer', glyph: 'D' }
      },
      {
        slug: 'iot-monitoring-dashboard',
        kicker: 'Web-Based System',
        title: 'IoT Data Monitoring Dashboard',
        summary: 'A web-based dashboard for monitoring and managing IoT sensor data in real time, with a full-stack frontend and backend.',
        foot: 'Full-Stack &middot; IoT',
        cover: { img: 'assets/img/projects/iot-monitoring-dashboard/cover.png', alt: 'IoT data monitoring dashboard interface', glyph: 'M' }
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Experience                                                          */
    /* ------------------------------------------------------------------ */
    experience: [
      {
        slug: 'pran-rfl-group',
        kicker: 'Industrial Attachment',
        title: 'PRAN-RFL Group',
        summary: 'Observed large-scale FMCG production across beverage, dairy, biscuit, and confectionery lines, studying time-and-motion analysis, production scheduling, and statistical quality control in a live manufacturing environment.',
        foot: '05 Nov &ndash; 05 Dec 2025 &middot; Dhaka',
        cover: { glyph: 'P' }
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Education                                                           */
    /* ------------------------------------------------------------------ */
    education: [
      {
        slug: 'buet-ipe',
        kicker: '2022 &ndash; 2026',
        title: 'B.Sc. in Industrial &amp; Production Engineering',
        summary: 'Bangladesh University of Engineering &amp; Technology (BUET) &middot; Dhaka',
        foot: 'CGPA: 3.67 / 4.00'
      },
      {
        slug: 'hsc-chattogram',
        kicker: '2018 &ndash; 2020',
        title: 'Higher Secondary Certificate (HSC)',
        summary: 'Chattogram Collegiate School and College',
        foot: 'GPA: 5.00 / 5.00'
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Blog                                                                */
    /* ------------------------------------------------------------------ */
    blog: [
      {
        slug: 'from-debugging-to-designing',
        kicker: 'Career &middot; Design &middot; Development',
        title: 'From Debugging Code to Designing Experiences',
        summary: 'I didn\u2019t set out to care about pixels. I set out to solve problems. Somewhere along the way, the two became the same thing.',
        foot: 'Jan 2025 &middot; 4 min read',
        cover: { img: 'assets/img/blog/from-debugging-to-designing.jpg', alt: '', glyph: 'D' }
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Achievements — no detail pages, so these render as plain cards      */
    /* rather than links.                                                  */
    /* ------------------------------------------------------------------ */
    achievements: [
      {
        kicker: 'Merit-Based Award &middot; BUET',
        title: 'Deen Scholarship',
        summary: 'Two-time recipient of this merit-based award recognizing academic excellence at BUET.',
        cover: { img: 'assets/img/achievements/deen-scholarship.jpg', alt: 'Deen Scholarship certificate', glyph: 'D' }
      },
      {
        kicker: 'Research &middot; IEEE / IEOM',
        title: 'Three Peer-Reviewed Publications',
        summary: 'Three peer-reviewed conference publications across IEEE (ICCIT) and IEOM as an undergraduate student &mdash; see the <a href="{base}publications.html">Publications</a> page for details.',
        cover: { glyph: '3' }
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Gallery — every tile points at a real file path. Until you drop     */
    /* the actual photo in, the tile shows that path so you know exactly   */
    /* what to save and where. The moment the file is real, the tile       */
    /* becomes the photo.                                                  */
    /* ------------------------------------------------------------------ */
    gallery: [
      {
        img: 'assets/img/gallery/floor-plan-autocad.jpg',
        tint: 'project',
        caption: 'A detailed 2D floor plan drafted in AutoCAD &mdash; room layouts, dimensions, walls, doors and windows for a residential building.'
      },
      {
        img: 'assets/img/gallery/iot-conveyor-circuit.png',
        tint: 'project',
        caption: 'Circuit diagram for the IoT smart conveyor: an ESP microcontroller wired to IR/proximity sensors, a motor driver module and the DC drive.'
      },
      {
        img: 'assets/img/gallery/iot-dashboard.png',
        tint: 'publication',
        caption: 'The IoT data monitoring dashboard, showing live sensor readings in the web interface.'
      },
      {
        img: 'assets/img/gallery/shoe-cleaning-machine.png',
        tint: 'experience',
        caption: 'The semi-automated shoe cleaning machine built for the Product Design sessional course.'
      },
      {
        img: 'assets/img/gallery/prototype-build.png',
        tint: 'achievement',
        caption: 'Prototype assembly work in progress.'
      },
      {
        img: 'assets/img/gallery/projects-overview.jpg',
        tint: 'education',
        caption: 'Project work at BUET.'
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Courses — drives the Relevant Coursework grid on the BUET page and  */
    /* the Previous/Next chain between individual course pages.            */
    /* ------------------------------------------------------------------ */
    courses: [
      { slug: 'quality-control-management',        title: 'Quality Control Management' },
      { slug: 'supply-chain-management',           title: 'Supply Chain Management' },
      { slug: 'operations-research',               title: 'Operations Research' },
      { slug: 'operations-management',             title: 'Operations Management' },
      { slug: 'project-management',                title: 'Project Management' },
      { slug: 'probability-statistics',            title: 'Probability &amp; Statistics' },
      { slug: 'manufacturing-processes',           title: 'Manufacturing Processes I &amp; II' },
      { slug: 'ergonomics-safety-management',      title: 'Ergonomics &amp; Safety Management' },
      { slug: 'computer-integrated-manufacturing', title: 'Computer Integrated Manufacturing' },
      { slug: 'intelligent-manufacturing',         title: 'Intelligent Manufacturing' },
      { slug: 'engineering-economics',             title: 'Engineering Economics' },
      { slug: 'product-design',                    title: 'Product Design I &amp; II' }
    ]
  };
})();
