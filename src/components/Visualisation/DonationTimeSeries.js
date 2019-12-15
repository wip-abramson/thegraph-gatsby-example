import React from 'react';
import * as d3 from 'd3';

const DonationTimeSeries = ({donations}) => {
  var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 630 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .innerTickSize(15)
    .outerTickSize(0)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d) { return d + "%";})
    .ticks(5)
    .innerTickSize(15)
    .outerTickSize(0)
    .orient("left");

  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });


  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("airbus_data.tsv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var companies = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, price: +d[name]};
        })
      };
    });


    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      d3.min(companies, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
      d3.max(companies, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
    ]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


    svg.append("line")
      .attr(
        {
          "class":"horizontalGrid",
          "x1" : 0,
          "x2" : width,
          "y1" : y(0),
          "y2" : y(0),
          "fill" : "none",
          "shape-rendering" : "crispEdges",
          "stroke" : "black",
          "stroke-width" : "1px",
          "stroke-dasharray": ("3, 3")
        });


    var company = svg.selectAll(".company")
      .data(companies)
      .enter().append("g")
      .attr("class", "company");



    var path = svg.selectAll(".company").append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { if (d.name == "Airbus")
      {return "rgb(000,255,000)"}
      else {return "#000";}
      });



    //var totalLength = path.node().getTotalLength();
    /*
    console.log(path);
    console.log(path.node());
    console.log(path[0][0]);
    console.log(path[0][1]);
    */
    var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength()];

    console.log(totalLength);


    d3.select(path[0][0])
      .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] )
      .attr("stroke-dashoffset", totalLength[0])
      .transition()
      .duration(5000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

    d3.select(path[0][1])
      .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
      .attr("stroke-dashoffset", totalLength[1])
      .transition()
      .duration(5000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

  });
}
