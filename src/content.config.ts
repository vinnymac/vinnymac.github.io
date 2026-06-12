import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    socialImage: z.string().optional(),
    blueskyThreadUrl: z.url().optional(),
    // Standard.site document record AT-URI, written back into frontmatter by
    // `sequoia publish`. Emitted as <link rel="site.standard.document"> so
    // Bluesky can attach this post to its publication. Optional: posts that
    // haven't been published to the PDS simply omit the document link tag.
    // NOTE: confirm this key matches the one Sequoia writes before publishing.
    standardDocumentUri: z.string().optional(),
    // Optional override for the URL slug. Astro's glob loader uses this as the
    // entry id, preserving the original Lumen `/posts/<slug>` URLs across the
    // migration. Declared here so the contract is reviewable and future Astro
    // upgrades can't silently break inbound links.
    slug: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    socialImage: z.string().optional(),
  }),
});

export const collections = { posts, pages };
