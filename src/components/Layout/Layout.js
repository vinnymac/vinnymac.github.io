// @flow strict
import React from 'react';
import Helmet from 'react-helmet';
import type { Node as ReactNode } from 'react';
import { useSiteMetadata } from '../../hooks';
import styles from './Layout.module.scss';

import appleTouchIcon from './favicons/apple-touch-icon.png';
import favicon32 from './favicons/favicon-32x32.png';
import favicon16 from './favicons/favicon-16x16.png';
import safariPinnedTab from './favicons/safari-pinned-tab.svg';

type Props = {
  children: ReactNode,
  title: string,
  description?: string,
  socialImage?: string
};

const Layout = ({
  children,
  title,
  description,
  socialImage = ''
}: Props) => {
  const { author, url } = useSiteMetadata();
  const metaImage = socialImage || author.photo;
  const metaImageUrl = url + metaImage;

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
        <link rel="icon" sizes="32x32" href={favicon32} type="image/png" />
        <link rel="icon" sizes="16x16" href={favicon16} type="image/png" />
        <link rel="mask-icon" color="#5bbad5" href={safariPinnedTab} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={metaImageUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaImageUrl} />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
