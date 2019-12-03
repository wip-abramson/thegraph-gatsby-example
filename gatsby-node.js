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
    query allDonations {
       giveth {
        donates(first: 1000) {
          id
          giverId
          receiverId
          token
          amount
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
    result.data.giveth.donates.map(donation => {
      if (!uniqueGivers.includes(donation.giverId)) {
        uniqueGivers.push(donation.giverId);
      }
      if (!uniqueReceivers.includes(donation.receiverId)) {
        uniqueReceivers.push(donation.receiverId)
      }
    })
    uniqueGivers.map(id => {
      createPage({
        path: "giver" + "/" + id,
        component: giverTemplate,
        context: {
          uniqueId: id
        }
      })
    })
    uniqueReceivers.map(id => {
      createPage({
        path: "receiver" + "/" + id,
        component: receiverTemplate,
        context: {
          uniqueId: id
        }
      })
    })

  })
}
