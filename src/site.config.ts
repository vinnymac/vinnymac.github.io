export interface SocialContact {
  /** Display label / accessible title for the icon. */
  label: string;
  /** Fully-qualified URL. */
  href: string;
}

export interface MenuItem {
  label: string;
  path: string;
}

export interface SiteConfig {
  url: string;
  base: string;
  title: string;
  subtitle: string;
  copyright: string;
  postsPerPage: number;
  author: {
    name: string;
    bio: string;
    photo: string;
  };
  /** Bluesky handle, e.g. `vinnymac.dev`. Used for the comments thread root and link generation. */
  blueskyHandle: string;
  /**
   * Standard.site (AT Protocol) publishing identity. Populate after running
   * `sequoia init`, which authenticates to the PDS, creates the publication
   * record, and reports the DID + publication AT-URI. Both values are public —
   * they are emitted as `<link>` tags in the page head — so committing them is safe.
   * When unset, the Standard.site link tags are simply not emitted.
   */
  standardSite?: {
    /** Author DID, e.g. `did:plc:...` — resolves from `blueskyHandle`. */
    did: string;
    /** Publication record AT-URI: `at://<did>/site.standard.publication/<rkey>`. */
    publicationUri: string;
  };
  menu: MenuItem[];
  contacts: SocialContact[];
}

const config: SiteConfig = {
  url: 'https://vincenttaverna.com',
  base: '/',
  title: 'Dev Continuum',
  subtitle: 'Software Engineer',
  copyright: '© All rights reserved.',
  postsPerPage: 12,
  author: {
    name: 'Vincent Taverna',
    bio: 'Software Engineer',
    photo: '/photo.jpg',
  },
  blueskyHandle: 'vinnymac.dev',
  // Populated by `sequoia init` (see README → "Standard.site / AT Protocol").
  // standardSite: {
  //   did: 'did:plc:...',
  //   publicationUri: 'at://did:plc:.../site.standard.publication/...',
  // },
  menu: [
    { label: 'Articles', path: '/' },
    { label: 'About me', path: '/pages/about' },
  ],
  contacts: [
    { label: 'email', href: 'mailto:vinnymac@gmail.com' },
    { label: 'bluesky', href: 'https://bsky.app/profile/vinnymac.dev' },
    { label: 'github', href: 'https://github.com/vinnymac' },
    { label: 'tangled', href: 'https://tangled.org/vinnymac.dev' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/vincent-taverna-5bb49a62' },
    { label: 'rss', href: '/rss.xml' },
  ],
};

export default config;
