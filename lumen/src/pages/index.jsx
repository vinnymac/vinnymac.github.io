import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import appleTouchIcon from './favicons/apple-touch-icon.png';
import favicon32 from './favicons/favicon-32x32.png';
import favicon16 from './favicons/favicon-16x16.png';
import safariPinnedTab from './favicons/safari-pinned-tab.svg';

class IndexRoute extends React.Component {
  render() {
    const items = [];
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const posts = this.props.data.allMarkdownRemark.edges;
    posts.forEach((post) => {
      items.push(<Post data={post} key={post.node.fields.slug} />);
    });

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
          <link rel="icon" sizes="32x32" href={favicon32} type="image/png" />
          <link rel="icon" sizes="16x16" href={favicon16} type="image/png" />
          <link rel="mask-icon" color="#5bbad5" href={safariPinnedTab} />
          <meta name="description" content={subtitle} />
        </Helmet>
        <Sidebar {...this.props} />
        <div className="content">
          <div className="content__inner">{items}</div>
        </div>
      </div>
    );
  }
}

IndexRoute.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired
      })
    }),
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array.isRequired
    })
  })
};

export default IndexRoute;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        subtitle
        copyright
        menu {
          label
          path
        }
        author {
          name
          email
          telegram
          twitter
          github
          rss
          vk
        }
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;
