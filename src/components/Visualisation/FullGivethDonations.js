import React from 'react';
import DonationVisualisation from "./DonationVisualisation"
import { getRelativeDaiValue } from "../../utils/visualisationFunctions"

const FullGivethDonations = ({ givethData }) => {
  let [nodes, setNodes] = React.useState(null);
  let [links, setLinks] = React.useState(null);
  let [showVis, setShowVis] = React.useState(false);
  let [totalDaiDonated, setTotalDaiDonated] = React.useState(0);

  React.useEffect(() => {
    console.log('Mounted');
    createNodesAndLinks();
  }, []);

  const createNodesAndLinks = () => {
    let giversAndReceivers = [];
    let newLinks = []

    let totalDonated = givethData.tokens.reduce((total, token) => {
      console.log(token)
      let relativeDaiVaue = getRelativeDaiValue(token.tokenName, token.totalDonated)
      console.log(relativeDaiVaue)
      return total + relativeDaiVaue
    }, 0)
    console.log("TOTAL DAI", totalDonated)
    setTotalDaiDonated(totalDonated);
    let givers = givethData.givers.map(node => {
      node.totalDonationValue = calculateDaiDonationsValue(node.donations)
      node.isGiver = true
      return node
    })
    let recievers = givethData.donationRecipients.map(node => {
      node.totalDonationValue = calculateDaiDonationsValue(node.donations)
      node.isGiver = false
      return node
    })

    console.log("GIVERS", givers);
    console.log("RECEIVERS", recievers);
    giversAndReceivers = givers.concat(recievers)
    console.log("BOTH", giversAndReceivers)

    newLinks = givethData.donations.map(donation => {
      // donation.source = donation.from.id
      // donation.target=donation.to.id
      return {
        source: donation.from.id,
        target: donation.to.id,
        donation: donation
      }
    })

    setNodes(giversAndReceivers)
    setLinks(newLinks)



    // setTotalDaiDonated(runningTotal)
  };

  const calculateDaiDonationsValue = (donationsArray) => {
    let totalDaiValue = 0
    if (donationsArray.length !== 0) {
      totalDaiValue = donationsArray.reduce((total, donation) => {
        return total + getRelativeDaiValue(donation.token.tokenName, donation.value)
      }, 0)
    }
    return totalDaiValue
  }





  if (nodes && links) {
    return <div>
      <button onClick={() => setShowVis(true)}>Explore Giveth Donation Network</button>
      <DonationVisualisation showVisualisation={showVis} nodes={nodes} links={links} donationTotal={totalDaiDonated} />
    </div>
  }
  return <div/>
};

export default FullGivethDonations;
