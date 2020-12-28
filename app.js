// D3 - Challenge
//Rafael Brennand

//Set graph dimension
var mHeight = 500;
var mWidth = 1000;

var margin = {right: 40, left: 80, top: 40, bottom: 80};

var actual_width = mWidth - margin.left - margin.right;
var actual_height = mHeight - margin.top - margin.bottom;

// Set SVG
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", mHeight)
    .attr("width", mWidth);

//Append SVG
var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import the data using d3
d3.csv("../data.csv").then(function(dataset) {
    //Run a for each to get all the columns we will use
    dataset.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes  = +data.smokes;
        data.age = +data.age;
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Set scales to fit the previously defined chart size
    //xLinearScale runs from 0 to defined width
    var xLinearScale = d3.scaleLinear().range([0, actual_width]);
    //yLinearScale starts from the top so it runs from defined height to 0
    var yLinearScale = d3.scaleLinear().range([actual_height, 0]);
    //Axis will use the scales previously defined
    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);



    //Now set up minimum and maximum x and y values so it can be used by the linear scale
    // We will start with age (x-axis) vs smokers (y-axis)
    var yMin = d3.min(dataset, function(data) {
        return data.smokes;
    });

    var yMax = d3.max(dataset, function(data) {
        return data.smokes;
    });

    var xMin = d3.min(dataset, function(data) {
        return data.age;
    });

    var xMax = d3.max(dataset, function(data) {
        return data.age;
    });

    //Set linear scales to fit data mins and max
    yLinearScale.domain([yMin, yMax]);
    xLinearScale.domain([xMin, xMax]);

    //Append the axes to chart
    chart.append("g")
        .attr("transform", `translate(0, ${actual_height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    //Create State circles to display inside the scatter plot
    var state_circles = chart.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age +1.5))
        .attr("cy", d => yLinearScale (d.smokes +0.3))
        .attr("r", "12")
        .attr("fill", "#5d81e4")
        .attr("opacity", 0.4)

    //Load state labels into circles
    chart.append("text")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(dataset)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.age +1.375);
            })
            .attr("y", function(data) {
                return yLinearScale(data.smokes +0.15);
            })
            //Select state abbreviation column
            .text(function(data) {
                return data.abbr
            });

    //Add labels to axis
            //Age for X axis
            chart.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left + 40)
              .attr("x", 0 - (actual_height / 2))
              .text("Smokes (%)");

            //Smokes for Y axis
            chart.append("text")
                .attr("transform", `translate(${actual_width / 2}, ${actual_height + margin.top})`)
                .text("Age (Years)");
});