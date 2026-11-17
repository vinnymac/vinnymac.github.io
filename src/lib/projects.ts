import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { projectDateSortKey, projectDateYear } from './project-dates';

export type Project = CollectionEntry<'projects'>;

/** Matches `<html lang>`; every project date is formatted through Intl with it. */
export const PROJECTS_LOCALE = 'en-US';

/** Fetched OpenGraph images, keyed by project id. See scripts/fetch-project-images.ts. */
const ogImages = import.meta.glob<ImageMetadata>('../assets/projects/og/*.webp', {
  eager: true,
  import: 'default',
});

/** The card image: the per-project override, else the fetched OpenGraph image. Crashes if neither exists. */
export const projectImage = (project: Project): ImageMetadata => {
  if (project.data.image) return project.data.image;
  const og = ogImages[`../assets/projects/og/${project.id}.webp`];
  if (!og) {
    throw new Error(
      `Project "${project.id}" has no image. Run \`pnpm projects:images ${project.id}\` ` +
        `or set \`image\` in src/content/projects/${project.id}.yaml.`,
    );
  }
  return og;
};

/** All projects, newest first by `date`, then by most recent `endDate` (ongoing first), then title. */
export const getProjects = async (): Promise<Project[]> => {
  const all = await getCollection('projects');
  const collator = new Intl.Collator(PROJECTS_LOCALE, { sensitivity: 'base' });
  const endKey = (p: Project) =>
    p.data.endDate ? projectDateSortKey(p.data.endDate) : Number.POSITIVE_INFINITY;
  return all.toSorted(
    (a, b) =>
      projectDateSortKey(b.data.date) - projectDateSortKey(a.data.date) ||
      endKey(b) - endKey(a) ||
      collator.compare(a.data.title, b.data.title),
  );
};

export interface ProjectYear {
  year: number;
  projects: Project[];
}

/** Groups already-sorted projects by start year, preserving order. */
export const groupProjectsByYear = (projects: Project[]): ProjectYear[] => {
  const groups: ProjectYear[] = [];
  for (const project of projects) {
    const year = projectDateYear(project.data.date);
    const last = groups.at(-1);
    if (last?.year === year) last.projects.push(project);
    else groups.push({ year, projects: [project] });
  }
  return groups;
};

const yearFormat = new Intl.DateTimeFormat(PROJECTS_LOCALE, { year: 'numeric', timeZone: 'UTC' });
/** All date precisions display as a year; full values remain in time datetime attributes. */
export const formatProjectDate = (value: string): string => formatYear(projectDateYear(value));

/** The year heading text, in the page locale. */
export const formatYear = (year: number): string =>
  yearFormat.format(new Date(Date.UTC(year, 0, 1)));

/** Hostname shown on the card, e.g. `pointhound.com`. */
export const displayHost = (url: string): string => new URL(url).hostname.replace(/^www\./, '');

/** Repository location shown on repo cards, e.g. `github.com/nestjs/nest`. */
export const displayRepo = (url: string): string => {
  const { hostname, pathname } = new URL(url);
  return `${hostname.replace(/^www\./, '')}${pathname.replace(/\/$/, '')}`;
};
