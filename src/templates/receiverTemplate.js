import React from 'react';
import GivethDonators from "../components/Visualisation/GivethDonators"

const ReceiverTemplate = ({data}) => {

  return <div>
    <h1>Receiver of Giveth's Giving</h1>
    {/*<GivethDonators donations={data.giveth.donates}/>*/}
  </div>
}

export const receiverTemplateQuery = graphql`
query ReceiverQuery($uniqueId: ID!) {
  giveth {
    

    donationRecipient(id: $uniqueId) {
      id
      donationCount
      donations(first: 1000)  {
        from {
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
    tokens {
      tokenName
      totalDonated
    }
  }
}
`;

export default ReceiverTemplate
