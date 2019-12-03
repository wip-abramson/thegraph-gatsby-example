import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import GivethDonators from "../components/Visualisation/GivethDonators"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <h1>The Giveth Giving Data Visualisation</h1>
    <GivethDonators donations={data.giveth.donates} />
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

export default IndexPage
