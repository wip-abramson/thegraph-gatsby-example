import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import FullGivethDonations from "../components/Visualisation/FullGivethDonations"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <div className="box">
      <h2 className="title">Giveth Donation Stats:</h2>
      <h2>{data.giveth.donations.length} Donations </h2>

      {
        data.giveth.tokens.map(token => {
          return <h3>{Math.round(token.totalDonated)} {token.tokenName}</h3>
        })
      }
      <hr/>
      <h2>{data.giveth.givers.length} Unique Giver addresses</h2>
      <h2>{data.giveth.donationRecipients.length} Donation Recipients</h2>
      <hr/>
      <FullGivethDonations givethData={data.giveth} />

    </div>


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
