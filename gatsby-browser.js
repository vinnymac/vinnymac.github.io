import ReactGA from 'react-ga'
import gatsbyConfig from './gatsby-config'

ReactGA.initialize(gatsbyConfig.siteMetadata.googleAnalyticsId);

exports.onRouteUpdate = (state, page, pages) => {
  ReactGA.pageview(state.pathname);
};
