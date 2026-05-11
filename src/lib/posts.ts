import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * The slug segment of a post's URL — single source of truth.
 * The glob loader uses the frontmatter `slug` field when present (falling back
 * to the filename), so this also preserves Lumen's `/posts/<slug>` URLs.
 */
export const postSlug = (post: Post): string => post.id;

/** Full URL path for a post — composed from postSlug. */
export const postPath = (post: Post): string => `/posts/${postSlug(post)}`;

export const categoryPath = (category: string): string => `/category/${kebabCase(category)}`;

export const tagPath = (tag: string): string => `/tag/${kebabCase(tag)}`;

export const kebabCase = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Posts visible on the site — drafts excluded — sorted newest first. */
export const getPublishedPosts = async (): Promise<Post[]> => {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
};

export interface CategoryCount {
  name: string;
  count: number;
}

export const summarizeCategories = (posts: Post[]): CategoryCount[] => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const c = post.data.category;
    if (!c) continue;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
};

export const summarizeTags = (posts: Post[]): CategoryCount[] => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
};

export const formatPostDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

export const formatFullDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
