import React from 'react';
import GivethDonators from "../components/Visualisation/GivethDonators"

const GiverTemplate = ({data}) => {
  console.log(data);
  return <div>
    <h1>Giver of Giveth</h1>
    <GivethDonators donations={data.giveth.donates}/>
  </div>
}

export const giverTemplateQuery = graphql`
query GiverQuery($uniqueId: GIVETH_BigInt!) {
  giveth {
    donates(where: {giverId: $uniqueId}) {
      id
      receiverId
      token
      amount
      giverId
    }
  }
}
`;

export default GiverTemplate
