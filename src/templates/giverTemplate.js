import React from 'react';
import GivethDonators from "../components/Visualisation/GivethDonators"

const GiverTemplate = ({data}) => {
  console.log(data);
  return <div>
    <h1>Giver of Giveth</h1>
    <h2>Thank you for donating {data.giveth.giver.donationCount} times!</h2>
    {/*<GivethDonators donations={data.giveth.donates}/>*/}
  </div>
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
          donationCount
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
