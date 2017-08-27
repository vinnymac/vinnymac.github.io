import React from "react";
import moment from "moment";
import Link from "gatsby-link";
import { RouteHandler } from "react-router";
import access from "safe-access";
import ReadNext from "../ReadNext";
import "./style.css";
import "../../../static/css/highlight.css";

class SitePost extends React.Component {
  render() {
    const { route, data } = this.props;
    const post = route.page.data;
    const home = (
      <div>
        <Link className="gohome" to={"/"}>
          {" "}All Articles
        </Link>
      </div>
    );

    return (
      <div>
        {home}
        <div className="blog-single">
          <div className="text">
            <h1>
              {post.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
            <div className="date-published">
              <em>
                Published {moment(post.date).format("D MMM YYYY")}
              </em>
            </div>
          </div>
          <div className="footer">
            <ReadNext post={post} {...this.props} />
            <hr />
            <p>
              {data.site.siteMetadata.description}
              <a href={data.site.siteMetadata.twitterUrl}>
                <br /> <strong>{data.site.siteMetadata.author}</strong> on Twitter
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

SitePost.propTypes = {
  post: React.PropTypes.object.isRequired,
  pages: React.PropTypes.array
};

export const pageQuery = graphql`
  query SiteMetadataLookup($slug: String!) {
    site {
      siteMetadata {
        author,
        description,
        twitterUrl
      }
    }
  }
`;

export default SitePost;
