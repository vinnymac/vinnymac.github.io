const rucksack = require("rucksack-css");
const lost = require("lost");
const cssnext = require("postcss-cssnext");
const path = require("path");
const Shell = require("child_process");

// function postBuild(pages, callback) {
//   // Files in the static directory to be moved to public
//   const staticFiles = ["manifest.json", "CNAME"];
//
//   Shell.execSync(`cp -r ./static/{${staticFiles.join(",")}} public/`);
//   callback();
// }
//
// export { postBuild };

exports.onPostBuild = (pages, callback) => {
  // Files in the static directory to be moved to public
  const staticFiles = ["manifest.json", "CNAME"];

  Shell.execSync(`cp -r ./static/{${staticFiles.join(",")}} public/`);
  callback();
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  let slug;
  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (parsedFilePath.name !== `index` && parsedFilePath.dir !== ``) {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === ``) {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }

    // Add slug as a field on the node.
    createNodeField({ node, name: `slug`, value: slug });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const pages = [];
    const blogPost = path.resolve("src/templates/blog-post.js");
    // Query for all markdown "nodes" and for the slug we previously created.
    resolve(
      graphql(
        `
        {
          allMarkdownRemark {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        }
      `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMarkdownRemark.edges.forEach(edge => {
          createPage({
            path: edge.node.fields.slug, // required
            component: blogPost,
            context: {
              slug: edge.node.fields.slug
            }
          });
        });

        return;
      })
    );
  });
};

exports.modifyWebpackConfig = ({ config, stage }, options = {}) => {
  // console.log(config);
  // config.loader("css", {
  //   {
  //     loader: 'postcss-loader',
  //     options: {
  //       plugins: [
  //         lost(),
  //         rucksack(),
  //         cssnext({
  //           browsers: [">1%", "last 2 versions"]
  //         })
  //       ]
  //     }
  //   }
  // })
  config.merge(current => {
    current.postcss = [
      lost(),
      rucksack(),
      cssnext({
        browsers: [">1%", "last 2 versions"]
      })
    ];
    return current;
  });
  // config.merge({
  //   postcss: [
  //     lost(),
  //     rucksack(),
  //     cssnext({
  //       browsers: [">1%", "last 2 versions"]
  //     })
  //   ]
  // });

  config.loader("svg", {
    test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "file-loader"
  });

  return config;
};
