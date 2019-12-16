import React from 'react';
import FullGivethDonations from "../components/Visualisation/FullGivethDonations"
import FocusedGivethDonations from "../components/Visualisation/FocusedGivethDonations"
import Layout from "../components/layout"

const GiverTemplate = ({data}) => {


  console.log(data.giveth.giver);
  return <Layout>
    <div>
      <h1>Giver of Giveth</h1>
      <h2>Thank you for donating {data.giveth.giver.donationCount} times!</h2>
      <FocusedGivethDonations isGiver={true} focusedNode={data.giveth.giver}/>
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
