import React from 'react';
import * as d3 from "d3"
import {navigate} from 'gatsby';
import {ETH, DAI, DAI_TO_ETH} from "./GivethDonators"


const DonationVisualisation =({nodes, links, donationTotal, getRelativeDaiValue}) => {
  React.useEffect(() => {
    console.log('Mounted');
    drawChart(nodes, links, donationTotal);
  }, []);

  const calculateDaiDonationsValue = (donationsArray) => {
    let totalDaiValue = 0
    if (donationsArray.length !== 0) {
      totalDaiValue = donationsArray.reduce((total, donationData) => {
        return total + getRelativeDaiValue(donationData)
      }, 0)
    }
    return totalDaiValue
  }

  const calculateProportionDonatedRelativeToTotal = (donationData, donationTotal) => {
    return donationData.tokenName === ETH ? donationData.amount * DAI_TO_ETH / donationTotal : donationData / donationTotal
  }

  const drawChart = (nodes, links, donationTotal) => {
    const height = window.innerHeight;
    const width = window.innerWidth - 400;


    const svg = d3
      .select('#d3-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const containingG = svg.append('g');

    let drag_handler = d3
      .drag()
      .on('start', dragStart)
      .on('drag', dragDrag)
      .on('end', dragEnd);

    let zoomHandler = d3.zoom().on('zoom', zoom_actions);

    drag_handler(containingG);

    zoomHandler(svg);

    const simulation = d3.forceSimulation().nodes(nodes);

    //Create the link force
    //We need the id accessor to use named sources and targets
    let linkForce = d3
      .forceLink(links)
      .id(function(d) {
        return d.id;
      })
      .distance(1000)
      .strength(2.7);

    let chargeForce = d3
      .forceManyBody()
      .strength(-200)
      .distanceMax(200);

    let collisionForce = d3.forceCollide(200);

    simulation
      .force('center_force', d3.forceCenter(width / 2, height / 2))
      .force('links', linkForce)
      .force('collision', collisionForce)
      .force('charge', chargeForce);

    // build the arrow.
    svg
      .append('svg:defs')
      .call(zoomHandler)
      .call(
        zoomHandler.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.15, 0.15)
      )
      .selectAll('marker')
      .data(['mid']) // Different link/path types can be defined here
      .enter()
      .append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', -20)
      .attr('refY', 0)
      .attr('markerWidth', 500)
      .attr('markerHeight', 30)
      .attr('markerUnits', 'px')
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    //draw lines for the links
    let link = containingG
      .append('g')
      .attr('class', 'links')
      .selectAll('polyline')
      .data(links)
      .enter()
      .append('polyline')
      .attr('stroke-width', function(d) {
        let daiDonated = getRelativeDaiValue(d.donationData);
        let proportion = daiDonated / donationTotal

        const strokeWidth = proportion * 200;

        return strokeWidth > 10 ? strokeWidth : 10;
      })
      .attr('fill', 'blue')
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.donationData.amount + " " + d.donationData.tokenName)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .attr('marker-mid', 'url(#mid)');

    let linkText = containingG
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text');

    let linkTextLabels = linkText
      .attr('x', function(d) {
        return (d.source.x + d.target.x) / 2;
      })
      .attr('y', function(d) {
        return (d.source.y + d.target.y) / 2;
      })
      .text(function(d) {
        return '';
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px');
    // .attr("fill", "black");
    // build the arrow.
    let node = containingG
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => {
        // console.log(donationTotal)
        // console.log(d.amount / 10**18 )
        let daiDonatedAndReceived = calculateDaiDonationsValue(d.donationsGiven) + calculateDaiDonationsValue(d.donationsReceived)
        let proportion = daiDonatedAndReceived / donationTotal

        return 20 + 500 * proportion;
      })
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(() => {
          let tooltip = "";
          if (d.donationsGiven.length > 0) {
            tooltip += "Amount Given \n";
            d.donationsGiven.map(donation => {
              tooltip += "\n" + donation.tokenName + " : " + donation.amount + "\n"

            })
          }
          if (d.donationsReceived.length > 0) {
            tooltip += "Amount Received \n";
            d.donationsReceived.map(donation => {
              tooltip += donation.tokenName + " : " + donation.amount + "\n"
            })

          }
          return tooltip
        })
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .attr('fill', d => (d.isGiver ? 'purple' : 'teal'))
      .on("click", ((d) => {
        div.transition()
          .duration(500)
          .style("opacity", 0);
        let url = d.isGiver ? "giver" : "receiver";
        url += "/" + d.id
        navigate(url)

      }));

    let nodeText = containingG
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text');

    let nodeTextLabels = nodeText
      .attr('x', function(d) {
        return d.x;
      })
      .attr('y', function(d) {
        return d.y;
      })
      .text(function(d) {
        return d.id;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .attr('fill', 'white');

    function tickActions() {
      //update circle positions each tick of the simulation
      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });

      //update link positions
      //simply tells one end of the line to follow one node around
      //and the other end of the line to follow the other node around
      link.attr("points", function(d) {
        return d.source.x + "," + d.source.y + " " +
          (d.source.x + d.target.x)/2 + "," + (d.source.y + d.target.y)/2 + " " +
          d.target.x + "," + d.target.y; });

      nodeTextLabels
        .attr('x', function(d) {
          return d.x-10;
        })
        .attr('y', function(d) {
          return d.y+3;
        });

      linkTextLabels
        .attr('x', function(d) {
          return (d.source.x + d.target.x) / 2;
        })
        .attr('y', function(d) {
          return (d.source.y + d.target.y) / 2;
        });
    }

    const dragStart = d => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragDrag = d => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragEnd = d => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    function zoom_actions() {
      containingG.attr('transform', d3.event.transform);
    }

    simulation.on('tick', tickActions);
  };


  return <div id="d3-container"/>;

}

export default DonationVisualisation
