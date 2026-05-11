import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';
import remarkPublicImages from './src/lib/remark-public-images.ts';
import siteConfig from './src/site.config.ts';

// Defensive rehype plugin: ensure raw HTML <img> in markdown also gets
// loading="lazy" and decoding="async". Astro images and remark-public-images
// already cover the common paths; this catches any inline <img> a post emits.
function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      node.properties ??= {};
      node.properties.loading ??= 'lazy';
      node.properties.decoding ??= 'async';
    });
  };
}

// Wrap each <pre> in a <div class="code-block"> with a "Copy" button.
// The click handler is a global script in src/scripts/code-copy.ts (loaded by BaseLayout).
function rehypeCodeCopy() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre') return;
      if (!parent || typeof index !== 'number') return;
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block'] },
        children: [
          {
            type: 'element',
            tagName: 'button',
            properties: {
              type: 'button',
              className: ['code-block__copy'],
              'data-code-copy': '',
              'aria-label': 'Copy code to clipboard',
            },
            children: [{ type: 'text', value: 'Copy' }],
          },
          node,
        ],
      };
      parent.children[index] = wrapper;
      return ['skip', index + 1];
    });
  };
}

export default defineConfig({
  site: siteConfig.url,
  trailingSlash: 'ignore',
  prefetch: { defaultStrategy: 'hover' },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Dual themes — Shiki emits CSS variables consumed by both modes.
      // The active theme is selected via `color-scheme` (and our data-theme override).
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    smartypants: true,
    remarkPlugins: [remarkPublicImages],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'], ariaLabel: 'Permalink' },
          content: { type: 'text', value: '#' },
        },
      ],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeLazyImages,
      rehypeCodeCopy,
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
