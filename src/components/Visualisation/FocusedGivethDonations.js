import React from 'react';
import * as d3 from "d3"
import {navigate} from 'gatsby';

const FocusedGivethDonations = ({focusedNode, isGiver, colorMap}) => {
  let [nodes, setNodes] = React.useState(null);
  let [links, setLinks] = React.useState(null);
  let [showVis, setShowVis] = React.useState(false);

  React.useEffect(() => {
    let giverAndReceivers = []
    let visLinks = []

    console.log("THE MAP", colorMap)
    giverAndReceivers.push({
      id: focusedNode.id,
      isGiver: isGiver
    })

    focusedNode.donations.map(donation => {
      visLinks.push({
        source: donation.from.id,
        target: donation.to.id,
        donation
      });

      if (isGiver) {
        let existingGiver = giverAndReceivers.find(e => e.id === donation.to.id)
        if (existingGiver) {
          console.log("Exists")
          // giverAndReceivers[existingGiverIndex]
        } else {
          giverAndReceivers.push({
            id: donation.to.id,
            isGiver: !isGiver
          })
        }

      }
      else {
        let existing= giverAndReceivers.find(e => e.id === donation.from.id)
        if (existing) {

        } else {
          giverAndReceivers.push({
            id: donation.from.id,
            isGiver: !isGiver
          })
        }

      }
    })
    setNodes(giverAndReceivers);
    setLinks(visLinks);

    drawChart(giverAndReceivers, visLinks, colorMap)
  }, [])

  const drawChart = (nodes, links, colorMap) => {
    console.log("DRAW CHART", nodes, links)
    const height = 400;
    const width = 400;


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

    drag_handler(containingG);
    let zoomHandler = d3.zoom()
      .scaleExtent([0.1, 0.2])
      .on('zoom', zoom_actions);


    zoomHandler(svg);

    const simulation = d3.forceSimulation().nodes(nodes);

    console.log(simulation.nodes())
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
      .strength((d, i) => {
       return i==0 ? -10000 : -500
      })
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
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.1, 0.1)
      )
      .selectAll('marker')
      .data(['mid']) // Different link/path types can be defined here
      .enter()
      .append('svg:marker') // This section adds in the arrows
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', -20)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 10)
      .attr('markerUnits', 'strokeWidth')
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
      .attr('stroke-width', (d) => {
        return 10
      })
      .on("mouseover", function(d) {
        d3.select(this)
          .style("stroke-opacity", 1.0)
          .attr('stroke-width', function(d) {
            return 20
          })

        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html((Math.round(d.donation.value * 10000) / 10000) + " " + d.donation.token.tokenName)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("stroke-opacity", 0.6)
          .attr('stroke-width', function(d) {
            return 10
          })
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
        return d.isGiver === isGiver ? 150 : 50
      })
      .attr('fill', d => {
        return (d.isGiver ? 'purple' : 'teal')
        // if (d.isGiver === isGiver) {
        //   return (d.isGiver ? 'purple' : 'teal')
        // } else {
        //   console.log("COLOR MAP and ID", colorMap, d.id)
        //   return colorMap[d.id]
        // }
      })
      .on("mouseover", function(d) {
        if (d.isGiver !== isGiver) {
          d3.select(this)
            .style("cursor", "pointer")
            .attr('r', 75)
        }

        // div.transition()
        //   .duration(200)
        //   .style("opacity", .9);
        // div.html(() => {
        //   let tooltip = "";
        //   tooltip += "<div>" + (Math.round(d.totalDonationValue * 10000) / 10000) + " Dollars " + (d.isGiver ? "Donated" : "Received") +" <br/> Over " + d.donationCount + " Donations </div>"
        //
        //   return tooltip
        // })
        //   .style("left", (d3.event.pageX) + "px")
        //   .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        if (d.isGiver !== isGiver) {
          d3.select(this)
            .style("cursor", "pointer")
            .attr('r', 50)
        }
      })
      .on("click", ((d) => {
        let url = d.isGiver ? "giver" : "receiver";
        url += "/" + d.id
        navigate(url)

      }))

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
        return "Node";
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
  }

  return (<div>
    <div id="d3-container"/>
  </div>)
}

export default FocusedGivethDonations
