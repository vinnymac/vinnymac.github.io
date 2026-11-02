/**
 * Draws a plain summary card (title, one line, optional icon) for a project that has
 * no public page to read an OpenGraph image from. Writes
 * src/assets/projects/screenshots/<id>.webp at the 1200×630 social-card size; set it as
 * the project's `image` override.
 *
 * Usage: pnpm projects:card <id> --title <text> --line <text> [--caption <text>]
 *          [--icon <svg-or-png path>] [--bg <#hex>] [--fg <#hex>] [--accent <#hex>]
 */
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import sharp, { type OverlayOptions } from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'src/assets/projects/screenshots');
const WIDTH = 1200;
const HEIGHT = 630;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    line: { type: 'string' },
    caption: { type: 'string' },
    icon: { type: 'string' },
    bg: { type: 'string', default: '#1f2933' },
    fg: { type: 'string', default: '#f7f5f0' },
    accent: { type: 'string', default: '#8fb8de' },
  },
});

const [id] = positionals;
if (!id || !values.title || !values.line) {
  throw new Error('Usage: projects:card <id> --title <text> --line <text> [options]');
}
const hex = /^#[0-9a-f]{6}$/i;
for (const key of ['bg', 'fg', 'accent'] as const) {
  if (!hex.test(values[key])) throw new Error(`--${key} must be a #rrggbb color`);
}

const escapeXml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Greedy word wrap on a character budget; the card has room for three lines. */
const wrap = (text: string, max: number): string[] => {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    if (current && `${current} ${word}`.length > max) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const lines = wrap(values.line, values.icon ? 28 : 44);
if (lines.length > 3) throw new Error('--line is too long for the card (three lines at most)');

const font = 'font-family="Helvetica Neue, Helvetica, Arial, sans-serif"';
const spans = lines
  .map((line, i) => `<tspan x="100" dy="${i === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${values.bg}"/>
  <rect x="100" y="150" width="72" height="8" rx="4" fill="${values.accent}"/>
  <text x="100" y="270" ${font} font-size="96" font-weight="700" fill="${values.fg}">${escapeXml(values.title)}</text>
  <text x="100" y="350" ${font} font-size="38" fill="${values.fg}" fill-opacity="0.82">${spans}</text>${
    values.caption
      ? `\n  <text x="100" y="${HEIGHT - 70}" ${font} font-size="26" letter-spacing="1.5" fill="${values.accent}">${escapeXml(values.caption.toUpperCase())}</text>`
      : ''
  }
</svg>`;

const layers: OverlayOptions[] = [];
if (values.icon) {
  const size = 360;
  const icon = await sharp(await readFile(resolve(values.icon)), { density: 300 })
    .resize(size, size)
    .png()
    .toBuffer();
  // Round the corners the way macOS masks an app icon.
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.2237)}" fill="#fff"/></svg>`,
  );
  layers.push({
    input: await sharp(icon)
      .composite([{ input: mask, blend: 'dest-in' }])
      .png()
      .toBuffer(),
    left: WIDTH - size - 110,
    top: Math.round((HEIGHT - size) / 2),
  });
}

await mkdir(OUT_DIR, { recursive: true });
const file = join(OUT_DIR, `${id}.webp`);
await sharp(Buffer.from(svg)).composite(layers).webp({ quality: 88 }).toFile(file);
console.log(`Wrote ${file}`);
