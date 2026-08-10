# Abdullah Al Mazid — Portfolio

A plain HTML/CSS/JS portfolio site. No build step, no framework, no server —
open `index.html` directly or deploy straight to GitHub Pages.

## Structure

```
index.html                    Home
about.html                     Bio + interactive skills panel
education.html                  Education listing
education/
  buet-ipe.html                   B.Sc. IPE detail page — links out to /courses/
  hsc-chattogram.html             HSC detail page
  _template.html                  Blank starting point for a new education entry
courses/                       One page per course, linked from education/buet-ipe.html
  quality-control-management.html  (+ 11 more — see the folder)
  _template.html                  Blank starting point for a new course
experience.html                 Experience listing
experience/
  pran-rfl-group.html              Individual experience pages
  _template.html                   Blank starting point for a new experience entry
projects.html                   Projects listing
projects/
  iot-smart-conveyor.html           Individual project pages
  cafeteria-production-planning.html
  shoe-cleaning-machine.html
  _template.html                    Blank starting point for a new project
publications.html               Publications listing
publications/
  egov-lens.html                     Individual publication pages (each has an Abstract section)
  stochastic-manufacturing.html
  pla-fea-validation.html
  _template.html                     Blank starting point for a new publication
blog.html                       Blog listing
blog/
  from-debugging-to-designing.html    Blog post
  _template.html                      Blank starting point for a new post
achievements.html               Honors & recognition (scholarships, publication record)
gallery.html                    Photo grid — hover a tile for a caption (no detail pages)
contact.html                    Contact info + references
assets/
  css/style.css                    All styling (one file, CSS variables for theming)
  js/site.js                        Theme toggle, mobile nav, small behaviors
  js/router.js                      No-reload page navigation
  js/skills.js                      Renders the interactive skills panel (hover/click)
  data/skills-data.js               Skill content: category, blurb, description, level
  data/content.js                   EVERY listing's content — the file you edit most
  js/render.js                      Builds listing grids + homepage sections from content.js
  js/pagenav.js                     Builds the Browse row and Previous/Next chain
  js/chrome.js                      Builds the menu dropdowns and the sidebar
  js/imageslot.js                   Shows the file path for photos not added yet
  js/lightbox.js                     Click-to-view full-size image lightbox
  img/profile.jpg                   Profile photo
  img/MANIFEST.md                   Every photo slot: path, purpose, suggested size
  Abdullah_Al_Mazid_CV.pdf           Downloadable CV (linked from the homepage)
```

## Adding a new publication / project / experience / education / blog entry

> **Note:** the site used to carry small grey "Adding a new project" boxes at the
> bottom of each listing page. Those were editor notes that site visitors could
> see, so they have been removed from the HTML. Everything they said now lives in
> this file instead.


Everything that appears in a listing now comes from one file:
**`assets/data/content.js`**. That file is the only place content lives.

1. Open `assets/data/content.js` and add one object to the matching array
   (`publications`, `projects`, `experience`, `education`, `blog`,
   `achievements`, `gallery`, `courses`).
2. Copy that folder's `_template.html` to `<folder>/<your-slug>.html`, where
   `<your-slug>` matches the `slug` you just wrote, and fill in the body.

That's it. The listing page, the matching homepage section, and the
Previous/Next chain on the new page **and on both of its neighbours** all
regenerate themselves from the array order. You no longer have to touch three
files and fix neighbouring links by hand.

Achievements and gallery items have no detail pages, so for those, step 1 is
the whole job.

**Field reference** is written at the top of `content.js`. The two that matter
most:

- `cover: { img: 'assets/img/...', alt: '...' }` — a real photo on the card.
- `cover: { glyph: 'X' }` — a themed placeholder letter instead.
  You can supply both: the photo is used if it exists, and the glyph is the
  fallback.

Image paths are written as if from the site root; pages inside a subfolder get
the `../` prefix added automatically.


## Still to write: course descriptions

The 12 course pages were generated from the course name alone, so their
descriptions are generic. Each one used to carry an on-page note saying so;
that note has been removed (visitors could see it), so here is the list
instead. Replace the body text on each with your own notes — what the course
covered, key projects, what you took from it:

- [ ] `courses/quality-control-management.html`
- [ ] `courses/supply-chain-management.html`
- [ ] `courses/operations-research.html`
- [ ] `courses/operations-management.html`
- [ ] `courses/project-management.html`
- [ ] `courses/probability-statistics.html`
- [ ] `courses/manufacturing-processes.html`
- [ ] `courses/ergonomics-safety-management.html`
- [ ] `courses/computer-integrated-manufacturing.html`
- [ ] `courses/intelligent-manufacturing.html`
- [ ] `courses/engineering-economics.html`
- [ ] `courses/product-design.html`

Course titles and their order in the menu and on the BUET page come from the
`courses` array in `assets/data/content.js`.

## Adding photos (the image slot system)

Every photo the site expects but doesn't have yet ships as a 1×1 transparent
placeholder file. On the page, that slot renders a small card showing the exact
folder and filename to save into, with a "Copy path" button.

**To add a photo: save your real image over that exact path, same filename.**
The card disappears on its own — there is nothing to edit in HTML or in
`content.js`.

`assets/img/MANIFEST.md` lists every expected file, what it's for, and a
suggested size. Note the extension matters: if the manifest says `.png`, save a
PNG (or change the path in `content.js` to match your file).

## Design & layout

`assets/css/style.css` opens with a numbered contents list (22 sections) and an
"I want to change X" lookup table. Search for a bracketed tag such as `[10]` to
jump straight to a section. Section `[01]` is the control panel: fonts, layout
widths and every colour, each with a plain-English comment.

Section `[22]` is an optional layout inspector. Add `class="debug"` to a page's
`<body>` tag to outline every box and show its class name on hover, so you can
find which rule to edit. Remove the class when done.


The site uses a boxed white content canvas on a grey page: a centred masthead,
a dark horizontal menu bar with hover dropdowns, a two-column body (content
plus a right sidebar), and red rules marking section boundaries. Headings are
Georgia; body text is Arial.

There is a **single light palette** — the dark/light toggle was removed. All
colours are CSS variables at the top of `assets/css/style.css`:

    --red        #c0272d   section rules, headings, active menu item
    --nav-bg     #2f2f2f   menu bar and footer
    --canvas     #ffffff   content area
    --page-bg    #f2f2f2   page behind the canvas
    --rule       #d9d9d9   borders and dividers

Change `--red` and the accent recolours everywhere at once.

The red divider rules are CSS borders, not image files, so they stay sharp at
any zoom and follow the palette.

**Menu dropdowns and the sidebar are generated by `assets/js/chrome.js`** from
`content.js`. Add a project and it appears in the Projects dropdown and the
sidebar automatically. To give a top-level item a dropdown, add
`data-submenu="<collection>"` to its `<li>` in the menu markup.

The sidebar is a single empty `<aside class="sidebar"></aside>` on each page;
its widgets (About Me, Explore, Recent Posts, Archives, Elsewhere, Get in
touch) are all built in `chrome.js`. Edit that file to change them.

On screens under 860px the sidebar drops below the content and the menu
collapses behind a Menu button. Because dropdowns can't open on hover on a
touch screen, submenus render inline and always open there; on hybrid devices
the first tap on a parent item opens its submenu and the second follows the
link.

## Home page tiles

The "Click to open" grid is driven by the `tiles` array in `content.js`. Each
tile's banner is an image slot — until you save the real file it shows the path
to save it to. Banners look best at around 1024x742.

## Editing shared things

- **Page-bottom navigation** — generated by `assets/js/pagenav.js` from the
  `pages` array in `content.js` (for top-level tabs) or from the relevant
  collection (for detail pages). Both wrap around end-to-start. Reorder the
  `pages` array to reorder the tabs everywhere at once.
- **Colors / fonts / spacing** — all in `assets/css/style.css`, driven by the
  CSS variables in `:root` at the top of the file.
- **Navigation links** — the menu bar is duplicated at the top of every page
  (deliberately, so the site needs no server-side includes). If you add a new
  top-level page, add it to the `pages` array in `content.js` *and* add a
  matching `<li><a href="..." data-page="...">` to the `.nav-links` list in
  every HTML file. Dropdown contents need no editing — they come from
  `content.js`.
- **Footer** — same approach; duplicated at the bottom of every page.

## What needs JavaScript

Detail pages (every project, publication, course, blog post, and so on) are
still complete standalone HTML documents — they work with JavaScript off, load
directly, and are readable by search engines exactly as before.

The **listing grids and the page-bottom navigation** are rendered by JS. With
JS disabled, listing pages show a short note and a plain text Browse row
instead of cards. That was the trade for having one place to edit content.

## Navigating between pages without a full reload

`assets/js/router.js` intercepts clicks on internal links, fetches the target
page in the background, and swaps only the `#page-main` content — so the nav
bar and footer never flash/reload, and the transition crossfades in browsers
that support the View Transitions API (Chrome/Edge; it just swaps instantly
elsewhere). This is a progressive enhancement only:

- Every page is still a complete, self-contained HTML document — direct
  loads, view-source, and no-JS visitors all get a normal working page.
- If a fetch ever fails (e.g. opened via `file://` without a local server),
  it falls back to a normal full-page navigation automatically.
- To test it locally with the router active, serve the folder over HTTP
  (e.g. `python3 -m http.server` from inside `site/`) rather than
  double-clicking `index.html`.
- After each swap, `router.js` dispatches a `page:swapped` event on
  `document` — `skills.js` listens for this to re-render the skills panel
  when you land on the About page via a router-driven navigation instead of
  a full reload. Any future script that needs to re-initialize itself after
  a page swap should listen for that same event.

## Deploying to GitHub Pages

1. Push this folder's contents to a GitHub repository (they can live at the
   repo root, or in a `/docs` folder).
2. In the repo, go to **Settings → Pages**, set the source branch, and the
   folder (`/ (root)` or `/docs`).
3. Save — GitHub will publish the site at
   `https://<username>.github.io/<repo-name>/`.

No build step, no dependencies to install, no environment variables.
