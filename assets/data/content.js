/* ==========================================================================
   content.js — the single source of truth for every listing on this site.

   Listing pages (and their explorers), the homepage sections, the About
   page's education and achievements, and the sidebar lists on detail pages
   are all rendered from this file by assets/js/render.js.

   TO ADD A NEW ITEM: add one object to the right array below, and create the
   matching detail page by copying that folder's _template.html. Nothing else
   needs editing — the listing page, the homepage section, and the sidebar
   lists on other detail pages all update themselves.

   Field reference (projects / blog / experience / achievements):
     slug     file name inside the folder, without ".html"
     title    card heading
     kicker   small line above the heading
     summary  one-paragraph description on the card
     foot     small print under the summary (date, team, place)
     cover    { img: 'assets/img/...', alt: '...' }   a real photo
              { glyph: 'X' }                          symbol shown until the
                                                      photo is added

   Paths in `img` are written as if from the site root — the renderer adjusts
   them automatically for pages inside a subfolder.
   ========================================================================== */
window.SITE_DATA = (function () {
  return {

    /* ------------------------------------------------------------------ */
    /* Homepage figures, shown in one row under the introduction.         */
    /* ------------------------------------------------------------------ */
    stats: [
      { value: '3.67', label: 'CGPA / 4.00' },
      { value: '3',    label: 'Peer-reviewed papers' },
      { value: '6',    label: 'Engineering projects' }
    ],

    /* ------------------------------------------------------------------ */
    /* Publications — text-first rows (no cover): year, title, one-line    */
    /* summary, venue and DOI.                                              */
    /* this page wants the venue and the DOI, not a thumbnail.            */
    /* ------------------------------------------------------------------ */
    publications: [
      {
        slug: 'egov-lens',
        kicker: 'ICCIT 2025 &middot; IEEE &middot; Conference Paper',
        title: 'eGov-Lens: Multi-Dimensional ML for Aspect-Based Bengali Public Feedback Analysis',
        summary: 'An aspect-based feedback pipeline for Bengali e-government services, built on 34,000+ annotated comments and benchmarking BanglaBERT, mBERT and bag-of-words models.',
        foot: 'DOI 10.1109/ICCIT68739.2025.11491291'
      },
      {
        slug: 'stochastic-manufacturing',
        kicker: 'IEOM Bangladesh 2025 &middot; Conference Paper',
        title: 'Stochastic Modeling of Throughput-Quality Dynamics in Labor-Intensive Manufacturing',
        summary: 'Time-and-motion analysis, SPC and Monte Carlo simulation link operator fatigue to process instability on two manual food-production lines, estimating a loss of about 1.7 million BDT a year.',
        foot: 'DOI 10.46254/BA08.20250379'
      },
      {
        slug: 'pla-fea-validation',
        kicker: 'IEOM Bangladesh 2024 &middot; Conference Paper',
        title: 'Validation of Temperature Effect on 3D Printed PLA Materials using FEA &amp; Hyperelastic Modeling',
        summary: 'Finite element validation of 3D-printed PLA at 20&ndash;40&deg;C using Neo-Hookean, Mooney-Rivlin and Yeoh hyperelastic models in Ansys.',
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
        foot: '05 Nov &ndash; 05 Dec 2025 &middot; Dhaka'
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
        foot: 'Jan 2025 &middot; 4 min read'
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
        summary: 'Two-time recipient of this merit-based award recognizing academic excellence at BUET.'
      },
      {
        kicker: 'Research &middot; IEEE / IEOM',
        title: 'Three Peer-Reviewed Publications',
        summary: 'Three peer-reviewed conference publications across IEEE (ICCIT) and IEOM as an undergraduate student &mdash; see the <a href="{base}publications.html">Publications</a> page for details.'
      }
    ],

    /* ------------------------------------------------------------------ */
    /* Courses — drives the Relevant Coursework grid on the BUET page and  */
    /* the "Other courses" list beside each course page.                   */
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
