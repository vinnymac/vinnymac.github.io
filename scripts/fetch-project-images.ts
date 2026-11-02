/**
 * Fetches each project's OpenGraph image into src/assets/projects/og/<id>.webp
 * so the Projects page never hotlinks third-party images and Astro's image
 * pipeline can serve sized, optimized copies.
 *
 * - Projects with an `image` override are not fetched (the override is checked to exist).
 * - Active projects read `og:image` (or `twitter:image`) from `url`.
 * - Archived projects read it from the original page captured in `archiveUrl`,
 *   and download the image through the Wayback Machine.
 * - Existing files are kept unless `--refresh` is passed.
 *
 * Exits non-zero and lists every project left without a usable image.
 *
 * Usage: pnpm projects:images [--refresh] [project-id ...]
 */
import { access, mkdir, readdir, readFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_DIR = join(ROOT, 'src/content/projects');
const OG_DIR = join(ROOT, 'src/assets/projects/og');
const MAX_WIDTH = 1200;
const MIN_WIDTH = 300;
const TIMEOUT_MS = 20_000;
// Some hosts refuse obvious bots; identify as a browser plus this script.
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36 vincenttaverna.com-project-images';

interface ProjectSource {
  id: string;
  file: string;
  status: 'active' | 'archived';
  url?: string;
  archiveUrl?: string;
  image?: string;
}

const exists = (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false,
  );

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const optionalString = (data: Record<string, unknown>, key: string, file: string) => {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new Error(`${file}: \`${key}\` must be a string`);
  return value;
};

const readProjects = async (): Promise<ProjectSource[]> => {
  const files = (await readdir(PROJECTS_DIR)).filter((f) => /\.ya?ml$/.test(f)).toSorted();
  if (files.length === 0) throw new Error(`No project files found in ${PROJECTS_DIR}`);
  return Promise.all(
    files.map(async (name) => {
      const file = join(PROJECTS_DIR, name);
      const data: unknown = parse(await readFile(file, 'utf8'));
      if (!isRecord(data)) throw new Error(`${name}: expected a YAML mapping`);
      const status = data.status;
      if (status !== 'active' && status !== 'archived') {
        throw new Error(`${name}: \`status\` must be "active" or "archived"`);
      }
      return {
        id: basename(name, extname(name)),
        file,
        status,
        url: optionalString(data, 'url', name),
        archiveUrl: optionalString(data, 'archiveUrl', name),
        image: optionalString(data, 'image', name),
      };
    }),
  );
};

const fetchOk = async (url: string, accept: string): Promise<Response> => {
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept, 'accept-language': 'en-US,en;q=0.8' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response;
};

const decodeEntities = (value: string): string =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x2F;', '/');

/** Finds `<meta property|name="og:image" content="…">` in either attribute order. */
const findMetaImage = (html: string): string | undefined => {
  for (const key of ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']) {
    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
      const name = /\b(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
      if (name?.toLowerCase() !== key) continue;
      const content = /\bcontent\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
      if (content) return decodeEntities(content.trim());
    }
  }
  return undefined;
};

const WAYBACK = /^https:\/\/web\.archive\.org\/web\/(\d{14})\/(.+)$/;

const parseWayback = (archiveUrl: string): [timestamp: string, original: string] => {
  const match = WAYBACK.exec(archiveUrl);
  if (!match?.[1] || !match[2]) throw new Error(`Not a Wayback snapshot URL: ${archiveUrl}`);
  return [match[1], match[2]];
};

/** `https://web.archive.org/web/<ts>/<url>` → `https://web.archive.org/web/<ts><flag>/<url>`. */
const waybackVariant = (archiveUrl: string, flag: 'id_' | 'im_'): string => {
  const [timestamp, original] = parseWayback(archiveUrl);
  return `https://web.archive.org/web/${timestamp}${flag}/${original}`;
};

const fetchOgImage = async (project: ProjectSource): Promise<Buffer> => {
  let pageUrl: string;
  if (project.status === 'active') {
    if (!project.url) throw new Error('active project has no `url`');
    pageUrl = project.url;
  } else {
    if (!project.archiveUrl) {
      throw new Error('archived project has neither an `image` override nor an `archiveUrl`');
    }
    pageUrl = waybackVariant(project.archiveUrl, 'id_');
  }

  const page = await fetchOk(pageUrl, 'text/html,application/xhtml+xml');
  const found = findMetaImage(await page.text());
  if (!found) throw new Error(`no og:image or twitter:image on ${pageUrl}`);

  // Archived pages: resolve against the original URL, then download via Wayback.
  let imageUrl = new URL(found, page.url).toString();
  if (project.status === 'archived' && project.archiveUrl) {
    const [timestamp, original] = parseWayback(project.archiveUrl);
    imageUrl = `https://web.archive.org/web/${timestamp}im_/${new URL(found, original).toString()}`;
  }

  const response = await fetchOk(imageUrl, 'image/avif,image/webp,image/png,image/jpeg,*/*');
  const type = response.headers.get('content-type') ?? '';
  if (!type.startsWith('image/'))
    throw new Error(`${imageUrl} returned ${type || 'no content-type'}`);
  return Buffer.from(await response.arrayBuffer());
};

const saveImage = async (input: Buffer, target: string): Promise<string> => {
  const { width, height, format } = await sharp(input).metadata();
  if (!width || !height)
    throw new Error(`could not read image dimensions (${format ?? 'unknown format'})`);
  if (width < MIN_WIDTH) throw new Error(`image is only ${width}px wide (need ≥ ${MIN_WIDTH}px)`);
  const info = await sharp(input)
    .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
    // Social cards are designed for a light preview; transparent logos would
    // otherwise sit on the dark-theme card background.
    .flatten({ background: '#ffffff' })
    .webp({ quality: 82 })
    .toFile(target);
  return `${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`;
};

const main = async () => {
  const args = process.argv.slice(2);
  const refresh = args.includes('--refresh');
  const only = new Set(args.filter((a) => !a.startsWith('--')));
  const projects = await readProjects();

  const unknown = [...only].filter((id) => !projects.some((p) => p.id === id));
  if (unknown.length > 0) throw new Error(`Unknown project id(s): ${unknown.join(', ')}`);

  await mkdir(OG_DIR, { recursive: true });
  const failures: string[] = [];

  for (const project of projects) {
    if (only.size > 0 && !only.has(project.id)) continue;
    const target = join(OG_DIR, `${project.id}.webp`);
    try {
      if (project.image) {
        const override = resolve(dirname(project.file), project.image);
        if (!(await exists(override))) throw new Error(`image override not found: ${override}`);
        console.log(`• ${project.id}: uses override ${project.image}`);
        continue;
      }
      if (!refresh && (await exists(target))) {
        console.log(`• ${project.id}: kept existing og/${project.id}.webp`);
        continue;
      }
      const summary = await saveImage(await fetchOgImage(project), target);
      console.log(`✓ ${project.id}: saved og/${project.id}.webp (${summary})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${project.id}: ${message}`);
      console.error(`✗ ${project.id}: ${message}`);
    }
  }

  const ids = new Set(projects.map((p) => p.id));
  const stale = (await readdir(OG_DIR)).filter((f) => !ids.has(basename(f, extname(f))));
  if (stale.length > 0) {
    console.warn(`\nUnused files in ${OG_DIR} (safe to delete): ${stale.join(', ')}`);
  }

  if (failures.length > 0) {
    console.error(
      `\n${failures.length} project(s) have no usable image. Fix the URL or add an \`image\` override:\n` +
        failures.map((f) => `  - ${f}`).join('\n'),
    );
    process.exit(1);
  }
};

await main();
