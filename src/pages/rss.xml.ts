import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import siteConfig from '../site.config';
import { getPublishedPosts, postPath } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: postPath(post),
      categories: post.data.category ? [post.data.category] : [],
    })),
  });
}
