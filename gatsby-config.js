// const rucksack = require("rucksack-css");
// const lost = require("lost");
// const cssnext = require("postcss-cssnext");
//
// console.log("plg", rucksack, lost, cssnext);

module.exports = {
  siteMetadata: {
    title: "Dev Continuum",
    description: "Software Engineer",
    author: "Vincent Taverna",
    twitterUrl: "https://twitter.com/kidtheflash",
    githubUrl: "https://github.com/vinnymac",
    emailUrl: "mailto:vinnymac@gmail.com",
    vkUrl: null,
    rssUrl: null,
    telegramUrl: null,
    googleAnalyticsId: "UA-87784359-1",
    linkPrefix: ""
  },
  plugins: [
    // {
    //   resolve: "postcss-loader",
    //   options: {
    //     plugins: [
    //       lost(),
    //       rucksack(),
    //       cssnext({
    //         browsers: [">1%", "last 2 versions"]
    //       })
    //     ]
    //   }
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 690
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    `gatsby-plugin-sharp`
  ]
};
