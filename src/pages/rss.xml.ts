import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import siteConfig from '../site.config';
import { getPublishedPosts, postPath } from '../lib/posts';

/**
 * Rewrite root-relative URLs (src="/foo", href="/bar") to absolute URLs.
 * RSS readers strip context, so /foo.jpg has nowhere to resolve against.
 */
const absolutizeUrls = (html: string, siteUrl: string): string =>
  html.replace(/(\s(?:src|href)=")\/(?!\/)/g, `$1${siteUrl}/`);

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const siteUrl = (context.site ?? new URL(siteConfig.url)).toString().replace(/\/$/, '');
  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: postPath(post),
        categories: post.data.category ? [post.data.category] : [],
        content: absolutizeUrls(html, siteUrl),
      };
    }),
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    site: context.site ?? siteConfig.url,
    items,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
<language>en-us</language>
<copyright>${siteConfig.copyright}</copyright>`,
  });
}
