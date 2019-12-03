import React from 'react';
import GivethDonators from "../components/Visualisation/GivethDonators"

const ReceiverTemplate = ({data}) => {

  return <div>
    <h1>Receiver of Giveth's Giving</h1>
    <GivethDonators donations={data.giveth.donates}/>
  </div>
}

export const receiverTemplateQuery = graphql`
query ReceiverQuery($uniqueId: GIVETH_BigInt!) {
  giveth {
    donates(where: {receiverId: $uniqueId}) {
      id
      receiverId
      token
      amount
      giverId
    }
  }
}
`;

export default ReceiverTemplate
