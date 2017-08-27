import React from 'react'
import Helmet from 'react-helmet'
import SitePost from '../components/SitePost'
import SitePage from '../components/SitePage'

class MarkdownWrapper extends React.Component {
    render() {
        const {route, data} = this.props
        const post = route.page.data
        let layout, template

        layout = post.layout

        if (layout != 'page') {
            template = <SitePost {...this.props}/>
        } else {
            template = <SitePage {...this.props}/>
        }

        return (
          <div>
            <Helmet title={ `${post.title} - ${data.site.siteMetadata.title}` }/>
            { template }
          </div>
        );
    }
}

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object,
}

export const pageQuery = graphql`
  query SiteMetadataLookup($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default MarkdownWrapper
