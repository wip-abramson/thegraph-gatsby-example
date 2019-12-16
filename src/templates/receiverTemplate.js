import React from 'react';
import FullGivethDonations from "../components/Visualisation/FullGivethDonations"
import FocusedGivethDonations from "../components/Visualisation/FocusedGivethDonations"
import Layout from "../components/layout"

const ReceiverTemplate = ({data}) => {

  return <Layout>
    <div>
      <h1>Receiver of Giveth's Giving</h1>
      <h2>Thank you for donating {data.giveth.donationRecipient.donationCount} times!</h2>
      <FocusedGivethDonations isGiver={false} focusedNode={data.giveth.donationRecipient}/>
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
