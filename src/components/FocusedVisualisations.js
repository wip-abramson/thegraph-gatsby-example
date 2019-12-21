import React from 'react';
import FocusedGivethDonations from "./Visualisation/FocusedGivethDonations"
import DonationsOverTime from "./Visualisation/DonationsOverTime"
import { getRelativeDaiValue } from "../utils/visualisationFunctions"


const FocusedVisualisations = ({node, isGiver}) => {

  let summedDonations = node.donations.reduce((total, d) => {
    return total += getRelativeDaiValue(d.token.tokenName, d.value)
  }, 0)

  const [colorMap, setColorMap] = React.useState(false)



  React.useEffect(() => {
    console.log("POPULATE COLORS")
    let map = {};
    node.donations.map(donation => {
      isGiver ? getColor(map, donation.to.id) : getColor(map, donation.from.id)
    })
    setColorMap(map)
  }, [node, isGiver])

  const getColor = (map, nodeId) => {
    console.log("GET COLOR FOR", nodeId)
    if (!map[nodeId]) {
      let newColor = getRandomColor();

      map[nodeId] = newColor

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
      {colorMap && (
        <div>
          <FocusedGivethDonations colorMap={colorMap} focusedNode={node} isGiver={isGiver}/>
          <DonationsOverTime colorMap={colorMap} donations={node.donations} isGiver={isGiver} totalDonationsValue={summedDonations}/>
        </div>
      )

      }
    </div>
  )
}

export default FocusedVisualisations
