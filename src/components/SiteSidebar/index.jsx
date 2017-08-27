import React from "react";
import Link from "gatsby-link";
import { RouteHandler } from "react-router";
import SiteNav from "../SiteNav";
import SiteLinks from "../SiteLinks";
import "./style.css";
import profilePic from "../../pages/photo.jpg";

class SiteSidebar extends React.Component {
  render() {
    const { location, children, data } = this.props;
    const isHome = location.pathname === "/";

    let header = (
      <header>
        <Link
          style={{
            textDecoration: "none",
            borderBottom: "none",
            outline: "none"
          }}
          to={"/"}
        >
          <img src={profilePic} width="75" height="75" alt="Profile Photo" />
        </Link>
        {isHome
          ? <h1>
            <Link
              style={{
                  textDecoration: "none",
                  borderBottom: "none",
                  color: "inherit"
              }}
              to={"/"}
            >
              {" "}{data.site.siteMetadata.author}{" "}
            </Link>
          </h1>
          : <h2>
            <Link
              style={{
                  textDecoration: "none",
                  borderBottom: "none",
                  color: "inherit"
              }}
              to={"/"}
            >
              {" "}{data.site.siteMetadata.author}{" "}
            </Link>
          </h2>}
        <p>
          {data.site.siteMetadata.description}
        </p>
      </header>
    );

    return (
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="blog-details">
            <header>
              {header}
            </header>
          </div>
          <div className="blog-options">
            <SiteNav {...this.props} />
            <footer>
              <SiteLinks {...this.props} />
              <p className="copyright">&copy; All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

SiteSidebar.propTypes = {
  children: React.PropTypes.any,
  location: React.PropTypes.object
};

export const pageQuery = graphql`
  query SiteMetadataLookup($slug: String!) {
    site {
      siteMetadata {
        author,
        description
      }
    }
  }
`;

export default SiteSidebar;
