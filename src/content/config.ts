import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    comments: z.boolean().default(true),
    sharing: z.boolean().default(true),
    /** Optional social image, relative to /public. */
    socialImage: z.string().optional(),
    /** Optional Bluesky thread URL — when set, replies to this post drive the comments section. */
    blueskyThreadUrl: z.string().url().optional(),
    /** Lumen leftover; ignored. */
    template: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    socialImage: z.string().optional(),
    template: z.string().optional(),
  }),
});

export const collections = { posts, pages };
