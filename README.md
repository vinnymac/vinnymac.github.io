# Dev Continuum

A personal blog by [Vincent Taverna](https://bsky.app/profile/vinnymac.dev), published at [vincenttaverna.com](https://vincenttaverna.com).

Built with [Astro](https://astro.build). Content lives as Markdown under `src/content/posts`. Comments are powered by Bluesky / AT Protocol — replies to a post's Bluesky thread are rendered inline.

## Stack

| Concern | Tool |
| --- | --- |
| Static site generator | Astro 4 |
| Content | Markdown + Content Collections (Zod-typed frontmatter) |
| Styling | Sass modules, scoped via Astro `<style>` |
| Syntax highlighting | Shiki (built into Astro) |
| RSS | `@astrojs/rss` |
| Sitemap | `@astrojs/sitemap` |
| Comments | Bluesky `app.bsky.feed.getPostThread` |
| Hosting | GitHub Pages (deployed via GitHub Actions) |

## Development

```sh
mise install    # installs Node + pnpm pinned in mise.toml
pnpm install
pnpm dev        # http://localhost:4321
```

Other scripts:

| Command | Description |
| --- | --- |
| `pnpm build` | Build the static site to `dist/` |
| `pnpm check` | Type-check Astro + TypeScript |
| `pnpm preview` | Serve the production build locally |

## Authoring a post

Add a new Markdown file under `src/content/posts/` — the filename can be anything (a date-prefixed name is convention). Frontmatter fields:

```yaml
---
title: "Post Title"
date: "2026-01-01T00:00:00.000Z"
description: "Short summary used for previews + social cards."
category: "category-name"
tags: ["tag-a", "tag-b"]
slug: "stable-url-slug"        # optional; falls back to filename
socialImage: "/media/foo.jpg"  # optional, lives under public/
draft: false
blueskyThreadUrl: "https://bsky.app/profile/vinnymac.dev/post/..."  # optional; enables comments
---
```

### Bluesky comments

To enable comments on a post:

1. Post about the article on Bluesky.
2. Copy the URL of that post (e.g. `https://bsky.app/profile/vinnymac.dev/post/3l...`).
3. Paste it into the post's frontmatter as `blueskyThreadUrl`.

On page load, the site fetches replies to that thread via the public AppView (no auth, no tracking) and renders them. Readers click "Reply on Bluesky" to participate.

Posts without `blueskyThreadUrl` show a fallback that links to my Bluesky profile.

## Deployment

Pushes to `source` (or `main`/`master`) trigger `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages via the official Pages action. The custom domain is configured in `public/CNAME`.

To deploy manually, run the workflow from the Actions tab.

## Migrating from the old Gatsby site

This branch replaces the Gatsby/Lumen setup (last touched in 2022) with Astro. URL structure is preserved (`/posts/<slug>`, `/category/<name>`, `/tag/<name>`, `/rss.xml`), so existing inbound links keep working.

If anything looks off, the previous Gatsby code is preserved in the `source` branch history.

## License

[MIT](./LICENSE).
