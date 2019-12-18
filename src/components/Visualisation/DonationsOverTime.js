import React from 'react';
import * as d3 from 'd3';
import { ETH, getRelativeDaiValue } from "../../utils/visualisationFunctions"

const DonationsOverTime = ({donations, isGiver, totalDonationsValue, getColor}) => {

  React.useEffect(() => {
    drawChart();
  }, [])

  const drawChart = () => {

    let boundingBox = d3.select("#donation-time-graph").node().getBoundingClientRect()

    // 2. Use the margin convention practice
    var margin = {top: 50, right: 50, bottom: 50, left: 100}
      , width = boundingBox.width - margin.left - margin.right // Use the window's width
      , height = boundingBox.height - margin.top - margin.bottom; // Use the window's height

// 7. d3's line generator

    let cumulativeDollarValue = 0;

    var line = d3.line()
      .x(function(d) { return xScale(d.time); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.cumulativeDollarValue); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    let dataset = donations.sort((x,y)=> {
      return x.timeSent - y.timeSent
    }).map(donation => {
      let daiValue = getRelativeDaiValue(donation.token.tokenName, donation.value);
      cumulativeDollarValue += daiValue;
      const current = cumulativeDollarValue;
      return {
        time: new Date(donation.timeSent * 1000) ,
        tokenValue: donation.value,
        dollarValue: daiValue,
        cumulativeDollarValue: current,
        otherPartyId: isGiver ? donation.to.id : donation.from.id,
        tokenName: donation.token.tokenName
      }
    })
    console.log("dataset", dataset)
    // 5. X scale will use the index of our data
    var xScale = d3.scaleTime()
      .domain([new Date(2018, 5, 28, 0), Date.now()])
      .range([0, width]); // output

// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
      .domain([0, totalDonationsValue]) // input
      .range([height, 0]); // output

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

// 1. Add the SVG to the page and employ #2
    var svg = d3.select("#donation-time-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Dollars");

    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
    svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d) {
      return xScale(d.time) })
      .attr("fill", d => "red")
      .attr("cy", function(d) { return yScale(d.cumulativeDollarValue) })
      .attr("r", 5)
      .on("mouseover", function(d) {
        console.log(d)
        d3.select(this)
          .attr('class', 'focus')
          .attr("r", 10)


        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("<div>" + d.time + "</div><div>" + d.tokenValue + " " + d.tokenName + "</div>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr('class', 'focus')
          .attr("r", 5)
        div.transition()
          .duration(200)
          .style("opacity", 0);
      })

  }


  return (
    <div id="donation-time-graph"/>
)
}

export default DonationsOverTime
