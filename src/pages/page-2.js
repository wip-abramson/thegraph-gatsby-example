import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import GivethDonators from "../components/Visualisation/GivethDonators"

const SecondPage = ({data}) => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <GivethDonators donationData={data.giveth.donates} />

  </Layout>
)

export const allGivethDonations = graphql`
query MyQuery {

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
    `;

export default SecondPage
