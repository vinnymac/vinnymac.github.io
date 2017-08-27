import React from "react";
import Link from "gatsby-link";
import sortBy from "lodash/sortBy";
import moment from "moment";
import Helmet from "react-helmet";
import access from "safe-access";
import SitePost from "../components/SitePost";
import SiteSidebar from "../components/SiteSidebar";
import appleTouchIcon from "./apple-touch-icon.png";
import favicon32 from "./favicon-32x32.png";
import favicon16 from "./favicon-16x16.png";
import safariPinnedTab from "./safari-pinned-tab.svg";

class SiteIndex extends React.Component {
  render() {
    const pageLinks = [];
    // Sort pages.
    const sortedPages = sortBy(this.props.route.pages, page =>
      access(page, "data.date")
    ).reverse();
    sortedPages.forEach((page, i) => {
      if (
        access(page, "file.ext") === "md" &&
        access(page, "data.layout") === "post"
      ) {
        const title = access(page, "data.title") || page.path;
        const description = access(page, "data.description");
        const datePublished = access(page, "data.date");
        const category = access(page, "data.category");

        pageLinks.push(
          <div className="blog-post" key={i}>
            <time dateTime={moment(datePublished).format("MMMM D, YYYY")}>
              {moment(datePublished).format("MMMM YYYY")}
            </time>
            <span style={{ padding: "5px" }} />
            <span className="blog-category">
              {category}
            </span>
            <h2>
              <Link style={{ borderBottom: "none" }} to={page.path}>
                {" "}{title}{" "}
              </Link>
            </h2>
            <p dangerouslySetInnerHTML={{ __html: description }} />
            <Link className="readmore" to={page.path}>
              {" "}Read
            </Link>
          </div>
        );
      }
    });

    return (
      <div>
        <Helmet
          title={this.props.data.site.siteMetadata.title}
          meta={[{ name: "theme-color", content: "#ffffff" }]}
          link={[
            { rel: "manifest", href: "/manifest.json" },
            {
              rel: "apple-touch-icon",
              sizes: "180x180",
              href: appleTouchIcon
            },
            {
              rel: "icon",
              sizes: "32x32",
              href: favicon32,
              type: "image/png"
            },
            {
              rel: "icon",
              sizes: "16x16",
              href: favicon16,
              type: "image/png"
            },
            {
              rel: "mask-icon",
              href: safariPinnedTab,
              color: "#5bbad5"
            }
          ]}
        />
        <SiteSidebar {...this.props} />
        <div className="content">
          <div className="main">
            <div className="main-inner">
              {pageLinks}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SiteIndex.propTypes = {
  route: React.PropTypes.object
};

export const pageQuery = graphql`
  query SiteMetadataLookup($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default SiteIndex;
