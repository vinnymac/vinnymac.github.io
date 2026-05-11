/**
 * schema.org JSON-LD builders.
 * The actual <script type="application/ld+json"> emission + CSP hashing lives
 * in BaseLayout — these helpers just shape the data.
 */
import type { Post } from './posts';
import { categoryPath } from './posts';
import siteConfig from '../site.config';

const PERSON_ID = `${siteConfig.url}/#author`;
const BLOG_ID = `${siteConfig.url}/#blog`;

export const buildPostGraph = (
  post: Post,
  canonicalUrl: string,
  imageUrl: string,
): Record<string, unknown> => {
  const { title, description, date, tags, category } = post.data;
  const { author, url: siteUrl, title: siteTitle, contacts } = siteConfig;
  const sameAs = contacts.filter((c) => c.href.startsWith('http')).map((c) => c.href);
  const iso = date.toISOString();

  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: 'Home', url: `${siteUrl}/` },
  ];
  if (category) {
    breadcrumbItems.push({
      name: category,
      url: new URL(categoryPath(category), siteUrl).toString(),
    });
  }
  breadcrumbItems.push({ name: title, url: canonicalUrl });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: author.name,
        url: siteUrl,
        image: new URL(author.photo, siteUrl).toString(),
        sameAs,
      },
      {
        '@type': 'Blog',
        '@id': BLOG_ID,
        name: siteTitle,
        url: siteUrl,
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: imageUrl,
        datePublished: iso,
        dateModified: iso,
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        url: canonicalUrl,
        keywords: tags.length > 0 ? tags.join(', ') : undefined,
        articleSection: category,
        inLanguage: 'en',
        isPartOf: { '@id': BLOG_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  };
};
