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
| Publishing            | Standard.site (AT Protocol) records via Sequoia        |
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
standardDocumentUri: 'at://did:plc:.../site.standard.document/...' # set by `sequoia publish`; don't edit by hand
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

## Standard.site / AT Protocol

The site publishes [Standard.site](https://standard.site) records to the AT Protocol so
that sharing a post on Bluesky yields an **enhanced link card** (showing the publication
and author) instead of a plain preview. This is handled by [Sequoia](https://sequoia.pub),
a CLI that mints the records on your PDS; the blog only emits the discovery `<link>` tags
the records need.

**How it fits together:**

- A site-wide `<link rel="site.standard.publication">` is emitted on every page, and a
  per-post `<link rel="site.standard.document">` on each published post. Both come from
  `BaseLayout.astro`. Bluesky's crawler runs **no JavaScript**, so these are
  server-rendered into the static HTML.
- The publication AT-URI + DID live in `src/site.config.ts` (`standardSite`). Each post's
  document AT-URI lives in its frontmatter (`standardDocumentUri`), written by Sequoia.
- Sequoia also writes the verification file to `public/.well-known/site.standard.publication`,
  which ships verbatim in the build. Keep it committed.

**One-time setup:**

1. Install the CLI: `bun i -g sequoia-cli`.
2. Run `sequoia init` in the repo root. It opens an OAuth login for `@vinnymac.dev`'s PDS,
   creates the publication record, and writes the verification file under `public/.well-known/`.
3. Copy the reported DID and publication AT-URI into `standardSite` in `src/site.config.ts`
   (uncomment the block).

> When `standardSite` is unset, the link tags are simply not emitted — the site builds
> and deploys exactly as before, so you can land this wiring before publishing anything.

**Per release** (whenever posts are added or changed):

```sh
make publish-atproto   # → sequoia publish: mints/updates document records,
                       #   writes standardDocumentUri back into each post's frontmatter
```

Publish **before** deploying so the emitted AT-URIs resolve. There's a brief gap between
record creation and the site going live; indexers re-verify, so it self-heals. Confirm the
frontmatter key Sequoia writes matches `standardDocumentUri` in `src/content.config.ts` the
first time you run it.

## Deployment

Pushes to `source` (or `main`/`master`) trigger `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages via the official Pages action. The custom domain is configured in `public/CNAME`.

To deploy manually, run the workflow from the Actions tab.

## Migrating from the old Gatsby site

This branch replaces the Gatsby/Lumen setup (last touched in 2022) with Astro. URL structure is preserved (`/posts/<slug>`, `/category/<name>`, `/tag/<name>`, `/rss.xml`), so existing inbound links keep working.

If anything looks off, the previous Gatsby code is preserved in the `source` branch history.

## License

[MIT](./LICENSE).
