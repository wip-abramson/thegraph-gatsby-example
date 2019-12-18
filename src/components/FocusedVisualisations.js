import React from 'react';
import FocusedGivethDonations from "./Visualisation/FocusedGivethDonations"
import DonationsOverTime from "./Visualisation/DonationsOverTime"
import { getRelativeDaiValue } from "../utils/visualisationFunctions"


const FocusedVisualisations = ({node, isGiver}) => {

  let summedDonations = node.donations.reduce((total, d) => {
    return total += getRelativeDaiValue(d.token.tokenName, d.value)
  }, 0)

  const [showVis, setShowVis] = React.useState(false)

  let colorMap = {};

  React.useEffect(() => {
    console.log("POPULATE COLORS")
    node.donations.map(donation => {
      isGiver ? getColor(donation.to.id) : getColor(donation.from.id)
    })
    setShowVis(true)
  }, [node, isGiver])

  const getColor = (nodeId) => {
    console.log("GET COLOR FOR", nodeId)
    console.log("EXISTING MAP", colorMap)
    if (!colorMap[nodeId]) {
      let newColor = getRandomColor();

      colorMap[nodeId] = newColor

    }
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  return (
    <div>
      <h2>A total of {Math.round(summedDonations)} dollars!</h2>
      {showVis && (
        <div>
          <FocusedGivethDonations colorMap={colorMap} focusedNode={node} isGiver={isGiver}/>
          <DonationsOverTime showVis={showVis} colorMap={colorMap} donations={node.donations} isGiver={isGiver} totalDonationsValue={summedDonations}/>
        </div>
      )

      }
    </div>
  )
}

export default FocusedVisualisations
