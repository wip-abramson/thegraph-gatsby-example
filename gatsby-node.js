/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
// exports.createPages = ({ graphql, actions }) => {
//   const { createPage } = actions
//   const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
//   // Query for markdown nodes to use in creating pages.
//   // You can query for whatever data you want to create pages for e.g.
//   // products, portfolio items, landing pages, etc.
//   // Variables can be added as the second function parameter
//   return graphql(`
//     query uniswapPages ($limit: Int!) {
//       uniswap(limit: $limit) {
//         edges {
//           node {
//             frontmatter {
//               slug
//             }th
//           }
//         }
//       }
//     }
//   `, { limit: 1000 }).then(result => {
//     if (result.errors) {
//       throw result.errors
//     }
//
//   })
// }
