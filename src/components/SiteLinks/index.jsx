import React from "react";
import "./style.css";
import "../../../static/fonts/fontawesome/style.css";

class SiteLinks extends React.Component {
  render() {
    const { data } = this.props;
    const {
      twitterUrl,
      githubUrl,
      vkUrl,
      emailUrl,
      telegramUrl,
      rssUrl
    } = data.site.siteMetadata;

    const twitter = twitterUrl
      ? <li>
          <a href={twitterUrl}>
            <i className="fa fa-twitter" />
          </a>
        </li>
      : null;

    const github = githubUrl
      ? <li>
          <a href={githubUrl}>
            <i className="fa fa-github-alt" />
          </a>
        </li>
      : null;

    const vk = vkUrl
      ? <li>
          <a href={vkUrl}>
            <i className="fa fa-vk" />
          </a>
        </li>
      : null;

    const email = emailUrl
      ? <li>
          <a href={emailUrl}>
            <i className="fa fa-envelope-o" />
          </a>
        </li>
      : null;

    const telegram = telegramUrl
      ? <li>
          <a href={telegramUrl}>
            <i className="fa fa-paper-plane" />
          </a>
        </li>
      : null;

    const rss = rssUrl
      ? <li>
          <a href={rssUrl}>
            <i className="fa fa-rss" />
          </a>
        </li>
      : null;

    return (
      <div className="blog-social">
        <ul>
          {twitter}
          {github}
          {vk}
        </ul>
        <ul>
          {email}
          {telegram}
        </ul>
        <ul>
          {rss}
        </ul>
      </div>
    );
  }
}

export const pageQuery = graphql`
  query SiteMetadataLookup($slug: String!) {
    site {
      siteMetadata {
        emailUrl
        githubUrl
        twitterUrl
      }
    }
  }
`;

export default SiteLinks;
