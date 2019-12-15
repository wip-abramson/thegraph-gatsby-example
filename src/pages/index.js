import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import GivethDonators from "../components/Visualisation/GivethDonators"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    {
      data.giveth.tokens.map(token => {
        return <h2>Total {token.tokenName} donated - {token.totalDonated}</h2>
      })
    }
    <h2>From a total of {data.giveth.donations.length} Donations </h2>
    <h2>{data.giveth.givers.length} Unique Giver addresses</h2>
    <h2>{data.giveth.donationRecipients.length} Donation Recipients</h2>
    <GivethDonators givethData={data.giveth} />
  </Layout>
)

export const allGivethDonations = graphql`
query MyQuery {

  giveth {
    givers(first: 1000) {
      id
      donationCount
      donations  {
        token {
          tokenName
        }
        value
      }
    }
    donations(first: 1000)  {
      id
      to {
        id
      }
      from {
        id
      }
      token {
        tokenName
      }
      value
      timeSent
    }
    donationRecipients(first: 1000) {
      id
      donationCount
      donations  {
        token {
          tokenName
        }
        value
      }
    }
    tokens {
      tokenName
      totalDonated
    }
  }
}
    `;

export default IndexPage
