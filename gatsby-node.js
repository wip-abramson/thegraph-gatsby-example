/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
var path = require("path")

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const giverTemplate = path.resolve(`src/templates/giverTemplate.js`)
  const receiverTemplate = path.resolve(`src/templates/receiverTemplate.js`)

  // Query for markdown nodes to use in creating pages.
  // You can query for whatever data you want to create pages for e.g.
  // products, portfolio items, landing pages, etc.
  // Variables can be added as the second function parameter
  return graphql(`
    query allGivers {
       giveth {
        givers(first: 1000) {
          id
          
        }
        donationRecipients(first: 1000) {
          id
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }
    let uniqueGivers = [];
    let uniqueReceivers = [];
    console.log(result.data);
    result.data.giveth.givers.map(giver => {
      createPage({
        path: "giver" + "/" + giver.id,
        component: giverTemplate,
        context: {
          uniqueId: giver.id
        }
      })
    })
    result.data.giveth.donationRecipients.map(receiver => {
      createPage({
        path: "receiver" + "/" + receiver.id,
        component: receiverTemplate,
        context: {
          uniqueId: receiver.id
        }
      })
    })
  })
}
