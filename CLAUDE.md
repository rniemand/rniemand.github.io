# CLAUDE.md — rniemand.github.io

## Project Overview

Static blog built with **Eleventy (11ty) v3.1.1**, deployed to GitHub Pages at `https://www.richardn.ca/`. Uses Nunjucks (`.njk`) as the templating engine.

## Dev Commands

```bash
npm start       # Dev server on http://localhost:8081 (with watch)
npm run build   # Production build → _site/
npm run debug   # Verbose debug build
```

## Preview Server

`.claude/launch.json` defines two server configurations:

| Name | Port | Notes |
|---|---|---|
| `eleventy-dev` | 8081 | Standard dev server via `npm start` |
| `eleventy-preview` | 8082 | Alternate for Claude preview tool (avoids port conflicts) |

**Important:** `npm start` has a hardcoded `--port=8081` flag — it does **not** respect the `PORT` env variable, so `autoPort: true` won't work with it. The `eleventy-preview` config passes `--port=8082` explicitly as an arg.

The Eleventy build (including image optimisation) takes **~60–90 seconds** on a cold start. However, if `npm start` is already running in a terminal (watch mode), the `.cache/` is warm and `eleventy-preview` starts in **a few seconds** — no need to sleep 90s in that case. Only sleep if you have confirmed the cache is cold (i.e. no dev server has been running).

## Key Files & Directories

| Path | Purpose |
|---|---|
| `eleventy.config.js` | Main 11ty config (plugins, filters, bundles) |
| `_data/metadata.js` | Site title, URL, description, author |
| `_includes/layouts/base.njk` | Root HTML shell — navbar, footer, analytics |
| `_includes/layouts/post.njk` | Individual blog post layout |
| `_includes/postslist.njk` | Reusable post list component (used by tag-pages.njk) |
| `css/index.css` | Custom styles (overrides Bootswatch) |
| `css/theme.css` | Bootswatch Quartz dark theme (do not edit) |
| `content/` | All site pages (blog posts, tags, archive, etc.) |
| `content/index.njk` | Home page — hero section + featured post + recent posts |
| `content/blog.njk` | Archive — year-grouped post cards + pagination |
| `content/projects.njk` | Projects — Bootstrap card grid by topic |
| `content/about.njk` | About Me page (GitHub: rniemand) |
| `content/tags.njk` | Tags overview page (card grid + live filter) |
| `content/tag-pages.njk` | Auto-generated per-tag listing pages |
| `_config/filters.js` | Custom Eleventy filters |
| `public/` | Static assets (pass-through copied to `_site/`) |

## Technology Stack

- **Framework:** Eleventy 3.1.1 (ES modules, `"type": "module"`)
- **CSS theme:** Bootswatch Quartz dark (`css/theme.css`) — do not edit
- **Custom CSS:** `css/index.css` — add all overrides here
- **Icons:** Bootstrap Icons 1.13.1 (CDN, already loaded in `base.njk`)
- **JS framework:** Bootstrap 5.3.7 (CDN)
- **Syntax highlighting:** Prism.js with Okaidia theme
- **Image optimization:** @11ty/eleventy-img (outputs AVIF + WebP)
- **Date handling:** Luxon
- **Body font:** Open Sans (user preference; Inter and Nunito also imported as alternatives)

## Post Layout (`_includes/layouts/post.njk`)

Blog posts use a structured `<article class="post-article">` wrapper with three key sections:

| Section | Class | Description |
|---|---|---|
| Header card | `.post-header` | Dark gradient card containing `.post-title` (h1) and `.post-meta-bar` (date + tag pills) |
| Table of contents | `.post-content-grid` | CSS grid wrapping `.post-toc-sidebar` (sticky, 210px) + `.post-body`; only rendered when `content \| toc` is truthy. Collapses to single column on ≤991px. |
| Body prose | `.post-body` | Prose content with Inter typography, styled h2/h3/h4, images, and lists |
| Prev/next nav | `.post-nav` | CSS grid (2-col) of `.post-nav-item` cards for previous/next post links |

**Tag pills** in the post header use `.post-tag-pill` (rounded, mint/dark style) — distinct from `.post-tag-badge` used in post cards on listing pages.

**`js/post.js`** auto-applies Bootstrap table classes to `.post-body table` elements on page load, and wraps each table in a `<div class="table-wrap">` for horizontal scroll on mobile and rounded-border containment.

## Table Styling

Tables in blog posts are styled by the combination of `post.js` (adds Bootstrap classes + `.table-wrap`) and custom CSS:

| Part | Style |
|---|---|
| Wrapper | `.table-wrap` — `border: 1px solid #2a3358`, `border-radius: 0.5rem`, `overflow-x: auto` |
| Header `<th>` | Background `#151d35`, color `#c3e6ff`, uppercase, `letter-spacing: 0.06em`, cell borders `#253060`, bottom border `2px #2a3358` |
| Odd rows | Background `#1a1f38`, cell borders `#1e2845` |
| Even rows | Background `#13172c`, cell borders `#1e2845` |
| Hover | Background `#252d50`, color `#f0f4f8` |

Add class `skip-auto-class` to any `<table>` to opt out of the automatic JS styling.

## Image Display

Eleventy image transform wraps all `<img>` tags in `<picture>` elements. In blog post bodies, `.post-body picture` is styled as an integrated dark card:
- Background `#0a0f1e`, border `#2a3358`, `border-radius: 0.6rem`, `padding: 0.75rem`
- The `<img>` inside has `border-radius: 0.35rem` and a deep `box-shadow`
- Add class `no-borders` to the original `<img>` to suppress shadow/border styling

## Color Palette

The site uses a dark theme. Key custom colors (defined in `css/index.css`):

| Use | Color |
|---|---|
| Body background | `#1a1e2e` (dark navy — replaces Quartz gradient) |
| H1 headings | `#c3e6ff` (light blue) |
| H2 headings | `#ffd97f` (golden) |
| H3 headings | `#f0ff7f` (lime yellow) |
| Links | `#b2fde7` (mint) |
| Post tag links | `#f0ff7f` |
| Post title (cards) | `#f0ff7f` (lime yellow) |
| Code | `#e0e832` (bright yellow) |
| Code background | `#31363b` |
| Primary accent | `#e83283` (pink/magenta — from Quartz) |
| Info/cyan accent | `#39cbfb` |
| Navbar/Footer bg | `#212529` (Bootstrap dark) |
| Card background | `#1f2540` |
| Card border | `#2a3358` |

**Important:** `css/theme.css` sets a cyan→indigo→pink gradient on `body`. This is overridden in `css/index.css` with:
```css
body {
  background-image: none !important;
  background-color: #1a1e2e !important;
}
```

## Navigation & Layout

**Navbar** (`base.njk`): Uses `navbar-dark bg-dark` (Bootstrap `#212529`). Padding reduced via `.navbar { padding-top/bottom: 0.3rem }` in `css/index.css`. The `div.main-content` top margin is `3.5rem` to clear the compact fixed navbar.

**Footer** (`base.njk`): Single-line GitHub link. Uses `py-2` (not `py-3`) for a slim height.

Nav items are driven by `eleventyNavigation` frontmatter in content files:

| Page | Key | Order | Icon |
|---|---|---|---|
| Projects | Projects | 2 | `bi-folder2-open` |
| Tags | Tags | 3 | `bi-tags-fill` |
| Archive | Archive | 4 | `bi-journal-text` |
| About | About | 5 | `bi-person-fill` |

Icons are rendered in `base.njk` via a `{% if entry.key == "..." %}` block. To add a new nav item with a custom icon, add it to the if/elif chain in `base.njk`.

## Adding Blog Posts

Posts live in `content/blog/YYYY/YYYY-MM-DD.njk` (or `.md`). Frontmatter:

```yaml
---
title: Post Title
description: Short description
date: 2026-01-15
tags:
  - tag1
  - tag2
---
```

Use `draft: true` to hide a post from production builds.

## Custom Filters (in `_config/filters.js`)

| Filter | Description |
|---|---|
| `readableDate` | Formats date with Luxon |
| `readableDate2` | `dd MMM yyyy` format |
| `htmlDateString` | HTML5 date attribute format |
| `filterTagList` | Removes system tags ("all", "posts") |
| `sortAlphabetically` | Alphabetical sort |
| `postBanner` | Generates banner image path |
| `postLogo` | Generates logo image path |
| `head` | Returns first N items (negative N = last N items) |
| `groupByYear` | Groups post array into `[{year, posts}]` — newest year first |

## Post Card Component

Post cards are used on the home page, archive, and tag pages. CSS classes:
- `.post-card` — clickable card container (onclick sets location.href)
- `.post-title` — lime yellow link, hover turns light blue
- `.post-meta-row` — flex row holding date and tags
- `.post-date` — muted date with calendar icon
- `.post-tags-inline` — inline tag badges container
- `.post-tag-badge` — small dark badge link per tag
- `.post-card-logo` — small logo image (44×44)
- `.post-card-banner` — full-width banner image

Always add `onclick="event.stopPropagation()"` to tag links inside cards so clicking a tag doesn't also navigate to the post.

The inner flex row uses `align-items-center` (not `align-items-start`) so logo icons vertically centre within the card regardless of title length.

## Home Page Design

`content/index.njk` — no pagination, accesses `collections.posts | reverse` directly:
- Hero section (`.hero-section`) with CTA buttons
- Featured latest post (`.featured-post`) showing `allPosts[0]`
- Recent posts (loop indices 2–9 via `loop.index`)
- "View all N posts" link to `/blog/`

## Archive Page Design

`content/blog.njk` — paginates at 25 posts, newest first. Uses `groupByYear` filter to group `pagination.items` into year sections with count badges. Has prev/next pagination buttons.

**Live search** filters within the current page by title + tags (`data-search` attribute on each `.post-card`). When a query is active:
- Non-matching cards are hidden (`display:none`)
- Year groups with no visible posts are hidden
- Pagination is hidden (searching across pages isn't supported — the "no results" message links to `/blog/` for that)
- A match count ("N posts matched on this page") and a clear (×) button appear

The inline `<script eleventy:ignore>` block drives the filter — `eleventy:ignore` prevents Eleventy's JS bundle from processing it.

## Projects Page Design

`content/projects.njk` — Bootstrap `row g-4` grid of `.project-card` components. Each card has a `.project-card-header` (dark, with icon) and `.project-card-body` with `.project-topic` rows. Older posts are in a `<details>` element.

Each `.project-topic` contains a `.project-topic-label` (muted uppercase category name) and a `.project-links` flex-wrap container of `.project-link` pill badges. Each badge links to a post.

## Tags Page

The tags page (`content/tags.njk`) uses a responsive card grid with a live JavaScript filter input. Each card shows the tag name, post count badge, latest post title, and date. Cards animate on hover.

**Logo mapping:** Each tag card displays a representative logo from `public/img/post-logos/` using a CSS `background-image` span (see eleventy-img bypass note above). The mapping is defined as a Nunjucks object at the top of the tag grid loop. Current mapping:

| Tag | Logo | Notes |
|---|---|---|
| `.net` | `dotnet.png` | |
| `3d printing` | `3dprinter.png` | |
| `arduino` | `arduino.png` | |
| `blogging` | `blog.png` | |
| `ci-cd` | `git.png` | No dedicated CI/CD logo — approximate |
| `database` | `mariadb.png` | Approximate — most common DB in recent posts |
| `docker` | `docker.png` | |
| `documentation` | `docsify.png` | |
| `esp8266` | `esp8266.png` | |
| `esphome` | `esphome.png` | |
| `gaming` | `satisfactory.png` | Only gaming posts cover Satisfactory |
| `github` | `github.png` | |
| `grafana` | `grafana.png` | |
| `home assistant` | `hass.png` | |
| `influxdb` | `influxdb.png` | |
| `iot` | `wifi.png` | No generic IoT logo — approximate |
| `javascript` | `javascript.png` | |
| `linux` | `ubuntu.png` | Approximate — most linux posts are Ubuntu |
| `monitoring` | `grafana.png` | Approximate — most recognisable monitoring tool |
| `mqtt` | `mqtt.png` | |
| `networking` | `wifi.png` | No generic networking logo — approximate |
| `server` | `server.png` | |
| `svelte` | `svelte.png` | |
| `tasmota` | `tasmota.png` | |
| `telegraf` | `telegraf.png` | |
| `typescript` | `typescript.png` | |
| `unraid` | `unraid.png` | |
| `windows` | *(none)* | **Missing** — no Windows logo in `public/img/post-logos/` yet |

When a new tag is added, update the `tagLogos` object in `tags.njk` and add a matching logo to `public/img/post-logos/` if needed. Tags with no entry in the map fall back to the generic `bi-tag-fill` Bootstrap icon.

## Plugin Gotchas

### eleventy-plugin-toc
The `| toc` filter outputs `<div class="toc"><ol>...</ol></div>` — there is **no `<nav>` element**. CSS selectors must use `.toc` not `nav`:
```css
/* correct */
.post-toc-sidebar .toc a { ... }
/* wrong — nav doesn't exist in the output */
.post-toc-sidebar div > nav a { ... }
```

### eleventy-img transform & image paths
The image transform resolves `<img src="...">` paths **relative to the input template file**, not the project root or `public/`. Key rules:
- Images in `public/img/` are pass-through copied to `_site/img/` but are **not** found by the transform (the transform doesn't look in `public/`).
- To have an image processed by the transform (e.g. in `content/index.njk`), place it under `content/` and use a relative path: `<img src="./img/richard.jpg">`.
- A leading `/` resolves from the project root (e.g. `/img/foo.jpg` → `D:/dev/rniemand.github.io/img/foo.jpg`), which also doesn't exist unless you create a root-level `img/` dir.

**Bypassing the transform entirely:** When you want to reference a `public/` image at its final runtime URL (e.g. `/img/post-logos/foo.png`) without the transform intercepting it, use a CSS `background-image` on a `<span>` via an inline style instead of an `<img>` tag. Inline `style` attributes are not processed by the transform:
```html
<!-- transform-safe — resolves at runtime via pass-through copy -->
<span style="background-image:url('/img/post-logos/foo.png')"></span>
```

### Bootswatch Quartz — automatic card gradients
The Quartz theme is compiled with `$enable-gradients: true`, so Bootstrap's `.card` (and several other components) automatically receive a `background-image: linear-gradient(...)`. To suppress the gradient on a custom card, add:
```css
.my-card {
  background-color: #1f2540;
  background-image: none !important;
}
```
This is already applied to `.tag-card` and `.tag-card .card-footer` in `content/tags.njk`.

## Blog Update Checklist

Every time a new post is added (or a batch of posts is touched), work through the following in order.

### 1. Content review (new posts only)

- **Grammar, spelling & wording** — proofread the full post copy. Fix obvious errors directly; flag ambiguous rewrites for the author to approve.
- **Technical accuracy** — verify that commands, config snippets, and version numbers look correct for the stated context. If something appears wrong or outdated, **do not silently correct it** — provide reference links so the author can confirm before changing anything.
- **External links** — check that all `href` values pointing outside the site return a valid response (not 404 / domain-parked). Flag any dead links with the broken URL and a suggested replacement if one can be found.
- **Internal links** — verify that all relative or absolute internal `href` values resolve to a real page within the site. Cross-reference against the file structure in `content/`.

### 2. Projects page (`content/projects.njk`)

- If the new post belongs to an existing project card, add a `.project-link` badge to the appropriate `.project-topic` section.
- If the new post represents a **new topic with 3 or more posts**, create a new `.project-card` with a relevant Bootstrap Icon and logical sub-topics.
- If the post is part of a **series**, ensure it is either:
  - Listed inline under a labelled `Series: …` topic row (for short series ≤ ~8 posts), or
  - Placed inside a `<details class="project-archive">` block with a `Series: … (N posts)` summary (for longer series).
- Do **not** add one-off posts to the projects page — the 3-post minimum applies.

### 3. Tags

- Compare the tags on the new post against tags used on thematically similar posts. Aim for consistency (e.g. `home assistant` not `hass`, `database` not `db`).
- If a chosen tag feels like a poor fit or a duplicate of an existing tag, **flag it to the author** with a suggested alternative — do not rename tags silently, as they affect tag pages and URLs.
- Periodically (e.g. when touching older posts or doing a larger refactor), scan older post frontmatter for tag inconsistencies and report a summary to the author for review.

### 4. General

- Run a quick visual check in the preview server after changes to confirm nothing is broken.
- If the post introduces a new content pattern (new frontmatter field, new shortcode usage, etc.) update this `CLAUDE.md` accordingly.

## Analytics & Comments

- **Google Analytics:** GA4 tag `G-HRDC8SXRVG` (in `base.njk`)
- **Disqus:** Site ID `richardn-ca` (comment count script loaded; embed is commented out in `post.njk`)

## Deployment

- Output: `_site/` directory
- GitHub Pages with custom domain `richardn.ca` (CNAME in `public/`)
- Also has `netlify.toml` and `vercel.json` configs

## GitHub Actions CI/CD (`.github/workflows/build.yml`)

Two-job pipeline — `build` then `deploy` (deploy only runs on `main`):

| What | Value | Notes |
|---|---|---|
| Runner | `ubuntu-24.04` | Latest GitHub-hosted runner |
| Node | `22` | Current LTS |
| npm install | `npm ci` | Fast, reproducible from lockfile |
| npm cache | `setup-node cache: 'npm'` | Automatic `~/.npm` cache keyed on `package-lock.json` |
| Eleventy cache | `actions/cache@v4` → `.cache/` | Preserves processed images & fetch cache across runs |
| Eleventy cache key | SHA of all image files | Invalidates only when source images change |
| Deploy action | `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4` | Official GitHub Pages OIDC deploy — no PAT needed, no `gh-pages` branch commit |
| Concurrency | `cancel-in-progress: true` | Cancels stale builds when a new push arrives |

**One-time setup required:** For the official `deploy-pages` action to work, the GitHub repository Pages source must be set to **"GitHub Actions"** (not "Deploy from a branch"). Go to: *Settings → Pages → Build and deployment → Source → GitHub Actions*.

**Image format strategy** (controlled via `ELEVENTY_RUN_MODE` in `eleventy.config.js`):
- **Dev/watch** (`npm start`, `ELEVENTY_RUN_MODE=serve`): generates **WebP + original only** — skips AVIF to keep rebuilds fast
- **Production** (`npm run build`, `ELEVENTY_RUN_MODE=build`): generates **AVIF + WebP + original**, with AVIF `effort: 0` (fastest Sharp encode setting) to reduce CI time

The `.cache/` restore — `eleventy-img` stores processed images in `.cache/` and skips reprocessing on cache hit, cutting build time from ~90s to ~5s when images haven't changed.
