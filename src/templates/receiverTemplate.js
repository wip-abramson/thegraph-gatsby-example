import React from 'react';
import FullGivethDonations from "../components/Visualisation/FullGivethDonations"
import FocusedGivethDonations from "../components/Visualisation/FocusedGivethDonations"
import Layout from "../components/layout"
import DonationsOverTime from "../components/Visualisation/DonationsOverTime"
import { getRelativeDaiValue } from "../utils/visualisationFunctions"
import FocusedVisualisations from "../components/FocusedVisualisations"

const ReceiverTemplate = ({data}) => {

  let summedDonations = data.giveth.donationRecipient.donations.reduce((total, d) => {
    return total += getRelativeDaiValue(d.token.tokenName, d.value)
  }, 0)


  return <Layout>
    <div className="box">
      <h1 className="title">Receiver of Giveth's Giving</h1>
      <h2 className="subtitle">This has received {data.giveth.donationRecipient.donationCount} donations!</h2>
      <FocusedVisualisations isGiver={false} node={data.giveth.donationRecipient}/>
    </div>
    </Layout>
}

export const receiverTemplateQuery = graphql`
query ReceiverQuery($uniqueId: ID!) {
  giveth {
    

    donationRecipient(id: $uniqueId) {
      id
      donationCount
      donations  {
        from {
          id
        }
        to {
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

export default ReceiverTemplate
