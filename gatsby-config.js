module.exports = {
  siteMetadata: {
    title: `The Giveth Donation Explorer`,
    description: `A visualisation tool to explore donations within the Giveth community.`,
    author: `@wip-abramson`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon-32x32.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // Arbitrary name for the remote schema Query type
        typeName: "GIVETH",
        // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
        fieldName: "giveth",
        // Url to query from
        url: "https://api.thegraph.com/subgraphs/name/wip-abramson/giveth-donation",

        // refetch interval in seconds
        refetchInterval: 60,
      },
    },
    `gatsby-plugin-sass`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
