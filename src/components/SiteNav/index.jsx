import React from "react";
import Link from "gatsby-link";
import { RouteHandler } from "react-router";
import "./style.css";

class SiteNav extends React.Component {
  render() {
    const { location } = this.props;
    return (
      <nav className="blog-nav">
        <ul>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "current" : null}
            >
              {" "}Articles
            </Link>
          </li>
          <li>
            <Link
              to="/about/"
              className={location.pathname === "/about/" ? "current" : null}
            >
              {" "}About me
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

SiteNav.propTypes = {
  location: React.PropTypes.object
};

export default SiteNav;
