#!/usr/bin/env node
/**
 * One-shot optimizer for images served from `public/`.
 *
 * For every JPEG/PNG over the size threshold:
 *   - Recompresses the original in place (max-width 1600px, quality 82).
 *   - Generates a sibling `.webp` at quality 80.
 *
 * Markdown image references stay `![alt](/foo.jpg)`; the remark-public-images
 * plugin wraps them in `<picture>` with the `.webp` as the preferred source.
 *
 * Idempotent: skips a file when a sibling `.webp` already exists AND the
 * original is under 500KB (i.e. already compressed in a previous run).
 *
 * Run with `node scripts/optimize-public-images.mjs`.
 */
import { readFile, writeFile, stat, readdir, access } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const TARGET_DIRS = ['hackintosh', 'ipod4g', 'plex', 'media'];
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const RAW_THRESHOLD = 200 * 1024; // ignore files already small
const RECOMPRESSED_THRESHOLD = 500 * 1024; // treat as previously optimized

const exists = async (p) =>
  access(p)
    .then(() => true)
    .catch(() => false);

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
};

const optimize = async (file) => {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const stats = await stat(file);
  const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const webpExists = await exists(webpPath);
  if (webpExists && stats.size < RECOMPRESSED_THRESHOLD) return null;
  if (stats.size < RAW_THRESHOLD) return null;

  const original = await readFile(file);
  const base = sharp(original, { failOn: 'truncated' }).rotate();
  const metadata = await base.metadata();
  const resize =
    (metadata.width ?? 0) > MAX_WIDTH ? { width: MAX_WIDTH, withoutEnlargement: true } : null;

  // Compress original in place (if it gets smaller).
  const compressed = await (resize ? base.clone().resize(resize) : base.clone())
    .toFormat(ext === '.png' ? 'png' : 'jpeg', {
      quality: ext === '.png' ? undefined : JPEG_QUALITY,
      compressionLevel: ext === '.png' ? 9 : undefined,
      mozjpeg: ext !== '.png',
      palette: ext === '.png',
    })
    .toBuffer();
  if (compressed.length < original.length) await writeFile(file, compressed);

  if (!webpExists) {
    const webp = await sharp(original)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    await writeFile(webpPath, webp);
  }

  return {
    file,
    originalSize: original.length,
    newSize: Math.min(compressed.length, original.length),
  };
};

const main = async () => {
  const results = [];
  for (const sub of TARGET_DIRS) {
    const dir = join(PUBLIC_DIR, sub);
    if (!(await exists(dir))) continue;
    for (const file of await walk(dir)) {
      const result = await optimize(file);
      if (result) results.push(result);
    }
  }
  const before = results.reduce((s, r) => s + r.originalSize, 0);
  const after = results.reduce((s, r) => s + r.newSize, 0);
  const savedMB = ((before - after) / 1024 / 1024).toFixed(1);
  console.log(
    `Optimized ${results.length} files; reduced originals by ${savedMB}MB (plus WebP siblings).`,
  );
};

await main();
