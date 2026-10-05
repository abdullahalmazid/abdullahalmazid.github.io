# Abdullah Al Mazid — Portfolio

A plain HTML/CSS/JS portfolio site. No build step, no framework, no server —
open `index.html` directly or deploy straight to GitHub Pages.

## Structure

```
index.html                    Home: intro, key figures, focus areas, 3 projects,
                              3 publications, experience & education, contact band
about.html                    Bio, research interests, education, achievements, skills
projects.html                 Projects listing
projects/                     One page per project (+ _template.html)
publications.html             Publications listing
publications/                 One page per paper, each with an abstract (+ _template.html)
experience.html               Experience and education
experience/                   One page per role (+ _template.html)
blog.html                     Blog listing
blog/                         One page per post (+ _template.html)
contact.html                  Contact details + references
education/                    Degree pages, linked from About > Education (+ _template.html)
courses/                      One page per course, linked from education/buet-ipe.html
education.html, achievements.html, gallery.html
                              Redirects only, so old links keep working
404.html                      "Page not found" page (GitHub Pages serves it automatically)
assets/
  css/style.css               All styling, one file; colours and sizes at the top
  fonts/                      Sora + Inter (self-hosted variable fonts, SIL Open Font License)
  data/content.js             EVERY listing's content — the file you edit most
  data/skills-data.js         Skill content for the About page
  js/site.js                  Theme switch, mobile menu, header on scroll, footer year, count-up
  js/cursor.js                Six cursor shapes (one per section), hover frame, footer switcher
  js/explorer.js              Opens items in place on the listing pages (genie effect)
  js/render.js                Builds listings and homepage sections from content.js
  js/imageslot.js             Hides photos that haven't been added yet
  js/lightbox.js              Click an image to view it full size
  js/skills.js                Skills panel on the About page
  img/                        Photos (see img/MANIFEST.md)
  Abdullah_Al_Mazid_CV.pdf    Downloadable CV (linked from the homepage)
```

The menu has six items — About, Projects, Publications, Experience, Blog,
Contact — and your name in the top-left links Home.

## Adding a publication / project / experience / education / blog entry

Everything that appears in a listing comes from one file:
**`assets/data/content.js`**.

1. Add one object to the matching array (`publications`, `projects`,
   `experience`, `education`, `blog`, `achievements`, `courses`).
2. Copy that folder's `_template.html` to `<folder>/<your-slug>.html`, where
   `<your-slug>` matches the `slug` you just wrote, and fill in the body.

The listing page, its explorer, the homepage section and the sidebar lists on
other detail pages all update themselves. Achievements have no detail
pages, so for those step 1 is the whole job.

The **homepage** shows the first three `projects` and the first three
`publications`, so the order of those arrays decides what is featured.

Field reference is at the top of `content.js`. For project cards:

- `cover: { img: 'assets/img/...', alt: '...' }` — the card photo.
- `glyph: 'X'` inside `cover` — a symbol shown on a light grid-paper panel
  until the photo exists.

Image paths are written as if from the site root; pages inside a subfolder get
the `../` prefix added automatically.

## Adding photos

Photos the site expects but doesn't have yet ship as 1×1 placeholder files.
Visitors never see them: on a project card the slot shows the glyph panel, and
anywhere else (a detail page cover or figure) the image is simply hidden.

**To add a photo, save your real image over that exact path with the same
filename.** It appears on its own; there is nothing else to edit.
`assets/img/MANIFEST.md` lists every expected file and a suggested size.

To add more photos to a project page, put this inside its `detail-body`:

```html
<figure class="project-figure">
  <img class="viewable" src="../assets/img/projects/<slug>/<file>.jpg" alt="What it shows">
  <figcaption>One line about the photo.</figcaption>
</figure>
```

Keep photos under about 300 KB each (1600px on the long side is plenty).

## Still to write: course descriptions

The 12 course pages were generated from the course name alone, so their
descriptions are generic. Replace each with your own notes — what the course
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

## Design

- **Three themes:** Navy (default: deep navy, glass cards, blue-to-cyan
  accent), Dark (neutral charcoal) and Off-white (light). The round button in
  the header cycles through them and the visitor's browser remembers the
  choice. Each theme is a block of colour variables near the top of
  `style.css` (`:root`, `:root[data-theme="dark"]`, `:root[data-theme="light"]`).
- **Fonts:** Sora for headings, Inter for text, self-hosted from
  `assets/fonts/` so they load fast and work offline.
- **Every inner page** opens with a header band (breadcrumbs, title, short
  description). Detail pages have a sidebar with "At a glance", related
  items and a contact box.
- **Explorer** (`assets/js/explorer.js`) on Projects, Publications, Blog and
  Experience: click a card and the other cards slide into a column on the
  left while the item opens beside them with a genie animation. Click any
  card in the column to switch; Escape or the close button returns to the
  grid; left/right arrow keys step through items. The address becomes
  `projects.html#slug`, so links to a specific item work (homepage cards use
  them) and the Back button closes/reopens items. The content is read from
  each item's own detail page, which still works on its own ("Open full
  page"). Opening `index.html` straight from disk (file://) can't read other
  files, so there cards simply open the full page; on GitHub Pages or any
  local web server the explorer works.
- **Custom cursors** (`assets/js/cursor.js`): each section has its own
  shape: Home a CAD crosshair with live X/Y coordinates, Projects a gear,
  Publications a reticle, Experience (and education/course pages) a hex nut,
  About an orbit, Blog and Contact a comet arrow with a glowing trail. Hover
  effects: images that open full size get a laser trace (a line draws
  around the image, then a spark circles it) plus a "View" label; small
  buttons and menu items get an edge glow that follows the pointer; cards
  and everything else get a CAD selection (corner brackets with a live
  width x height tag). A switcher at the bottom of the footer lets visitors pick
  one shape for the whole site (remembered in their browser) or go back to
  "Auto". To change which shape a section gets, edit `BY_PAGE` near the top
  of `cursor.js`. Only on devices with a mouse; reduced-motion settings stop
  the spinning and gliding.

All colours and sizes are CSS variables at the top of `assets/css/style.css`:

    --bg         #070b16   page background
    --bg-alt     #0a1120   alternating section bands, header bands
    --surface    white 3.5%  card background
    --text       #e8eef8   headings and text
    --text-2     #aab6c8   body copy
    --muted      #7d8aa0   small print
    --accent     #4c8dff   blue accent
    --accent-2   #22d3ee   cyan accent (gradient end, highlights)

Page-to-page navigation is a normal page load (relative links always resolve
from the page you are on). `@view-transition` in the stylesheet gives a smooth
cross-fade in Chrome, Edge and Safari 18.2+.

## Editing shared things

- **Menu and footer** are repeated in every HTML file (so the site needs no
  server). If you add a top-level page, add its link to the `.nav-links` list
  in every file. On the current page the link carries `aria-current="page"`,
  which highlights it.
- **Order** of items everywhere (listings, explorer column, sidebar lists,
  homepage) comes from the order of the matching array in `content.js`.

## What needs JavaScript

Detail pages (every project, publication, course, blog post) are complete
standalone HTML and work with JavaScript off. Listings, the homepage sections
and the About page's education and achievements are rendered by JavaScript;
without it, a short note is shown instead.

## Deploying to GitHub Pages

Push to the `main` branch of `abdullahalmazid.github.io`; GitHub publishes it
at `https://abdullahalmazid.github.io/` within a minute or two. No build step,
no dependencies.
