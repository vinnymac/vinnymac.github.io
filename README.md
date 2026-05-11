# Dev Continuum

A personal blog by [Vincent Taverna](https://bsky.app/profile/vinnymac.dev), published at [vincenttaverna.com](https://vincenttaverna.com).

Built with [Astro](https://astro.build). Content lives as Markdown under `src/content/posts`. Comments are powered by Bluesky / AT Protocol — replies to a post's Bluesky thread are rendered inline.

## Stack

| Concern               | Tool                                                   |
| --------------------- | ------------------------------------------------------ |
| Static site generator | Astro 6                                                |
| Content               | Markdown + Content Collections (Zod-typed frontmatter) |
| Styling               | Sass modules, scoped via Astro `<style>`               |
| Syntax highlighting   | Shiki (built into Astro)                               |
| RSS                   | `@astrojs/rss`                                         |
| Sitemap               | `@astrojs/sitemap`                                     |
| Comments              | Bluesky `app.bsky.feed.getPostThread`                  |
| Hosting               | GitHub Pages (deployed via GitHub Actions)             |

## Development

```sh
mise install       # Node + pnpm (pinned in mise.toml)
pnpm install
make install_hooks # one-time: enables pre-commit fmt + lint
pnpm dev           # http://localhost:4321
```

> Don't have [mise](https://mise.jdx.dev)? Install matching versions of Node
> and pnpm by hand using the pins in `mise.toml`.

Other scripts:

| Command        | Description                                        |
| -------------- | -------------------------------------------------- |
| `pnpm build`   | Build the static site to `dist/`                   |
| `pnpm check`   | Type-check Astro + TypeScript                      |
| `pnpm fmt`     | Format with oxfmt (use `pnpm fmt:check` to verify) |
| `pnpm lint`    | Lint with oxlint                                   |
| `pnpm verify`  | Run fmt:check + lint + check (matches CI)          |
| `pnpm preview` | Serve the production build locally                 |

## Authoring a post

Add a new Markdown file under `src/content/posts/` — the filename can be anything (a date-prefixed name is convention). Frontmatter fields:

```yaml
---
title: 'Post Title'
date: '2026-01-01T00:00:00.000Z'
description: 'Short summary used for previews + social cards.'
category: 'category-name'
tags: ['tag-a', 'tag-b']
slug: 'stable-url-slug' # optional; falls back to filename
socialImage: '/media/foo.jpg' # optional, lives under public/
draft: false
blueskyThreadUrl: 'https://bsky.app/profile/vinnymac.dev/post/...' # optional; enables comments
---
```

### Bluesky comments

Comments are mirrored from a Bluesky thread — there is intentionally **no
in-page comment form**. Readers reply on Bluesky; the blog renders those
replies. The article URL doesn't need to be reachable for any of this to work
(Bluesky never crawls back to the site).

**To enable comments on a post:**

1. Post about the article on Bluesky from `@vinnymac.dev`.
2. Copy that Bluesky post's URL (e.g. `https://bsky.app/profile/vinnymac.dev/post/3l...`).
3. Paste it into the post's frontmatter as `blueskyThreadUrl`.
4. Rebuild — the empty-state disappears, replaced with the comments UI.

**How readers participate:** they click the "Reply on Bluesky" button, which
opens the thread on Bluesky in a new tab. They reply there (a Bluesky account
is required). Their reply appears on the article on the next page load.

**Empty state:** if a post has no `blueskyThreadUrl`, the section reads "This
post doesn't have a discussion thread yet. Find me at @vinnymac.dev on Bluesky
to chat." and links to the profile. That's the signal to go create the
Bluesky post and wire up the frontmatter.

**Does it need the site to be live?** No. The client fetches from
`https://public.api.bsky.app` (no auth, CORS-open), so comments load identically
in `pnpm dev`, `pnpm preview`, and production. The only thing that has to exist
is the Bluesky post itself.

The fetch logic, threading, and rendering live in `src/components/BlueskyComments.astro`.

## Deployment

Pushes to `source` (or `main`/`master`) trigger `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages via the official Pages action. The custom domain is configured in `public/CNAME`.

To deploy manually, run the workflow from the Actions tab.

## Migrating from the old Gatsby site

This branch replaces the Gatsby/Lumen setup (last touched in 2022) with Astro. URL structure is preserved (`/posts/<slug>`, `/category/<name>`, `/tag/<name>`, `/rss.xml`), so existing inbound links keep working.

If anything looks off, the previous Gatsby code is preserved in the `source` branch history.

## License

[MIT](./LICENSE).
