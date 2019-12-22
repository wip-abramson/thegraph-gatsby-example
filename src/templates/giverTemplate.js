import React from 'react';
import FullGivethDonations from "../components/Visualisation/FullGivethDonations"
import FocusedGivethDonations from "../components/Visualisation/FocusedGivethDonations"
import Layout from "../components/layout"
import DonationsOverTime from "../components/Visualisation/DonationsOverTime"
import { getRelativeDaiValue } from "../utils/visualisationFunctions"
import FocusedVisualisations from "../components/FocusedVisualisations"

const GiverTemplate = ({data}) => {

  let summedDonations = data.giveth.giver.donations.reduce((total, d) => {
    return total += getRelativeDaiValue(d.token.tokenName, d.value)
  }, 0)



  return <Layout>
    <div className="box">
      <h1 className="title">Giver of Giveth</h1>
      <h2 className="subtitle">Thank you for donating {data.giveth.giver.donationCount} times!</h2>
      <FocusedVisualisations isGiver={true} node={data.giveth.giver}/>

    </div>
    </Layout>

}

export const giverTemplateQuery = graphql`
query GiverQuery($uniqueId: ID!) {
  giveth {
    giver(id: $uniqueId) {
      id
      donationCount
      donations {
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
    }
  }
}
`;

export default GiverTemplate
