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

// Project dates are `YYYY` or `YYYY-MM`: precise enough for a timeline without
// inventing a day. Month is validated so `2026-13` fails the build.
const projectDate = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, {
  error: 'Use `YYYY` or `YYYY-MM` (e.g. 2026 or 2026-05).',
});

const WAYBACK_SNAPSHOT = /^https:\/\/web\.archive\.org\/web\/\d{14}\/.+/;

// One YAML file per project in src/content/projects/. The filename is the
// stable id (used for the fetched OpenGraph image, src/assets/projects/og/<id>.webp).
// `status` discriminates the union so impossible combinations fail the build:
// an active project must link somewhere; an archived one may only point at a
// Wayback snapshot. Objects are strict, so a stray `url` on an archived project
// (or a typo'd key) is an error rather than silently ignored.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/projects' }),
  schema: ({ image }) => {
    const base = {
      title: z.string().min(1),
      /** One or two plain sentences. */
      summary: z.string().min(1).max(280),
      /** Vincent's role, e.g. Creator, Maintainer, Contributor, Founding Staff Engineer. */
      role: z.string().min(1),
      /** What the card links to: a product or website (`site`) or a source repository (`repo`). Drives the filter on /projects. */
      kind: z.enum(['site', 'repo']),
      /** Start or launch. Sorting (newest first) and year grouping use this. */
      date: projectDate,
      endDate: projectDate.optional(),
      /** Overrides the fetched OpenGraph image. Path is relative to the YAML file. */
      image: image().optional(),
      /** Describes what the image shows. Required: every card image is informative. */
      imageAlt: z.string().min(1),
      tags: z.array(z.string().min(1)).default([]),
      /** Public source repository. Emitted in structured data, not as a second card link. */
      sourceUrl: z.url().optional(),
    };

    return (
      z
        .discriminatedUnion('status', [
          z.strictObject({
            ...base,
            status: z.literal('active'),
            url: z.url({ error: 'Active projects need a `url` (the live site or repository).' }),
          }),
          z.strictObject({
            ...base,
            status: z.literal('archived'),
            archiveUrl: z
              .url()
              .regex(WAYBACK_SNAPSHOT, {
                error:
                  '`archiveUrl` must be a web.archive.org snapshot (https://web.archive.org/web/<14-digit timestamp>/<url>).',
              })
              .optional(),
          }),
        ])
        // Compare at the coarser precision so `date: 2019-11, endDate: 2019` passes.
        .refine(
          ({ date, endDate }) => {
            if (!endDate) return true;
            const precision = Math.min(date.length, endDate.length);
            return endDate.slice(0, precision) >= date.slice(0, precision);
          },
          {
            error: '`endDate` must not be earlier than `date`.',
            path: ['endDate'],
          },
        )
    );
  },
});

export const collections = { posts, pages, projects };
