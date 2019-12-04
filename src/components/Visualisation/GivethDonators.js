import React from 'react';
import DonationVisualisation from "./DonationVisualisation"

export const DAI = "DAI";
export const ETH = "ETH";
export const DAI_TO_ETH = 150;

const GivethDonators = ({ donations }) => {
  let [nodes, setNodes] = React.useState(null);
  let [links, setLinks] = React.useState(null);
  let [totalDaiDonated, setTotalDaiDonated] = React.useState(0);

  React.useEffect(() => {
    console.log('Mounted');
    createNodesAndLinks();
  }, []);

  const getTokenName = (tokenAddress) => {
    if (tokenAddress === "0x0000000000000000000000000000000000000000") return ETH;
    else return DAI;
  };

  const createNodesAndLinks = () => {
    let nodes = [];
    let links = [];
    let includedGiverIds = [];
    let runningTotal = 0;
    donations.map(donation => {
      if (!includedGiverIds.includes(donation.giverId)) {
        nodes.push({
          id: donation.giverId,
          donationsReceived: [],
          donationsGiven: updateDonationsArray([], donation),
          isGiver: true,
        });
        includedGiverIds.push(donation.giverId);
      } else {
        nodes.forEach(node => {
          if (node.id === donation.giverId) {
            console.log("Node Exists", node);
            node.donationsGiven = updateDonationsArray(node.donationsGiven, donation)
          }
        });
      }
      if (!includedGiverIds.includes(donation.receiverId)) {
        nodes.push({
          id: donation.receiverId,
          donationsReceived: updateDonationsArray([], donation),
          donationsGiven: [],
          isGiver: false,
        });
        includedGiverIds.push(donation.receiverId);
      } else {
        nodes.forEach(node => {
          if (node.id === donation.receiverId) {
            node.donationsReceived = updateDonationsArray(node.donationsReceived, donation)
          }
        });
      }
      let link = {
        source: donation.giverId,
        target: donation.receiverId,
        donationData: getDonationData(donation)
      }
      links.push(link);
      runningTotal += getRelativeDaiValue(link.donationData);
      return donation;
    });
    console.log(nodes)
    console.log(links)
    setNodes(nodes)
    setLinks(links)
    setTotalDaiDonated(runningTotal)
  };

  const getRelativeDaiValue = (donationData) => {
    return donationData.tokenName === ETH ? DAI_TO_ETH * donationData.amount : donationData.amount
  }

  const convertTokenValue = (amount) => {
    return amount / (10 ** 18)
  }

  const updateDonationsArray = (donationsArray, donation) => {
    if (donationsArray.length === 0) {
      return [getDonationData(donation)]
    } else {
      let newDonationData = getDonationData(donation);
      donationsArray.push(newDonationData)
      return donationsArray
    }
  }

  const getDonationData = (donation) => {
    let tokenName = getTokenName(donation.token);
    let amount = convertTokenValue(donation.amount)
    return {
      tokenName,
      amount
    }
  }

  if (nodes && links) {
    return <DonationVisualisation nodes={nodes} links={links} donationTotal={totalDaiDonated} getRelativeDaiValue={getRelativeDaiValue}/>
  }
  return <div/>
};

export default GivethDonators;
