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

The Eleventy build (including image optimisation) takes **~60–90 seconds** before the server is ready to serve pages. Allow for this when using `preview_start`.

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

## Navigation

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

## Tags Page

The tags page (`content/tags.njk`) uses a responsive card grid with a live JavaScript filter input. Each card shows the tag name, post count badge, latest post title, and date. Cards animate on hover.

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

The biggest CI time-saver is the `.cache/` restore — `eleventy-img` stores processed AVIF/WebP in `.cache/` and skips reprocessing on cache hit, cutting build time from ~90s to ~5s when images haven't changed.
