import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

const BUILD_TIME = new Date().getTime();

module.exports = class extends React.Component {
  static displayName = "HTML";
  static propTypes = {
    body: PropTypes.string
  };

  render() {
    const { body, route } = this.props;
    const { title } = Helmet.rewind();
    const font = (
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,400italic,500,700&subset=latin,cyrillic"
        rel="stylesheet"
        type="text/css"
      />
    );
    let css;
    if (process.env.NODE_ENV === "production") {
      css = (
        <style
          dangerouslySetInnerHTML={{
            __html: require("!raw!./public/styles.css")
          }}
        />
      );
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 maximum-scale=5.0"
          />
          {title.toComponent()}
          {font}
          {css}
          {this.props.headComponents}
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
};

// module.exports = React.createClass({
//   displayName: "HTML",
//   propTypes: {
//     body: React.PropTypes.string
//   },
//   render() {
//     const { body, route } = this.props;
//     const { title } = Helmet.rewind();
//     const font = (
//       <link
//         href="https://fonts.googleapis.com/css?family=Roboto:400,400italic,500,700&subset=latin,cyrillic"
//         rel="stylesheet"
//         type="text/css"
//       />
//     );
//     let css;
//     if (process.env.NODE_ENV === "production") {
//       css = (
//         <style
//           dangerouslySetInnerHTML={{
//             __html: require("!raw!./public/styles.css")
//           }}
//         />
//       );
//     }
//
//     return (
//       <html lang="en">
//         <head>
//           <meta charSet="utf-8" />
//           <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//           <meta
//             name="viewport"
//             content="width=device-width, initial-scale=1.0 maximum-scale=5.0"
//           />
//           {title.toComponent()}
//           {font}
//           {css}
//           {this.props.headComponents}
//         </head>
//         <body>
//           <div
//             id="___gatsby"
//             dangerouslySetInnerHTML={{ __html: this.props.body }}
//           />
//           {this.props.postBodyComponents}
//         </body>
//       </html>
//     );
//   }
// });
