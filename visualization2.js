
xVal2 = vals[0];
yVal2 = vals[0];
height = 500;
width = 800;
offset = 30;
lineDataSet = []; 
parallelText = "Show Data in Parallel";
splomText = "Show Data in SPLOM";

d3.csv('challenger.csv', function(csvData) {
    data = csvData;
    
    //Create Title
    var showOtherVis = d3.select('#showOtherVisButton')
        .text(parallelText)
        .on('click', function(d) {
            if(d3.select(this).text() == splomText) {
                d3.select('#visSVG1').style('display', 'block');
                d3.select('#visSVG2').style('display', 'none');
                d3.select(this).text(parallelText);
                
            } else {
                d3.select('#visSVG2').style('display', 'block');
                d3.select('#visSVG1').style('display', 'none');
                d3.select(this).text(splomText);
            }
            
        });
            
    
    svg = d3.select('#visSVG2').append('svg:svg')
				.attr('width', width)
				.attr('height', height);
    
    var lineAttributeDiv = d3.select('#visSVG2').append('div')
        .attr('width', width)
        .attr('height', offset)
        .attr('class', 'chartTitle')
        .text("Hover over something to see data.");
    
    xScale = d3.scale.linear()
        .domain([0, 60])
        .range([offset + margin, width - margin - offset]);
    
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .innerTickSize(-(height - 60))
        .outerTickSize(0)
        .ticks(4);
    
    yScale = d3.scale.linear()
        .domain([d3.min(data, function(d) { return parseFloat(d[yVal2]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[yVal2]); })+1])
        .range([height - offset - margin, margin + offset]);
    
    parseData(data);
    
    
     var lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .interpolate("linear");
    
    var pointToggle = [];
    
    for(var i = 0; i < lineDataSet.length; i++) {
        pointToggle.push(false);
        svg.append('path')
            .attr('d', lineFunction(lineDataSet[i]))
            .attr('stroke', colorFunction(lineDataSet[i]))
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.3)
            .attr("class", function(d) { return 'l' + lineDataSet[i][3].y; })
            .on('mouseover', function(d) {
                d3.select(this).style('stroke-width', 6)
                    .attr('stroke-opacity', 1.0);
                var index = parseInt(d3.select(this).attr('class').substring(1)) -1;
                var displayText = "Launch Temperature: " + data[index].launch_temp +
                                " degrees F, Number of O-Rings Distressed: " + data[index].num_o_ring_distress +
                                ", Leak Check Pressure: " + data[index].leak_check_pressure +
                                ", Flight Index: " + data[index].flight_index;
            
            
                lineAttributeDiv.text("\n" +displayText);
            })
            .on('mouseout', function(d) {
                var temp = d3.select(this).attr("class").substring(1);
                var index = parseInt(temp) -1;
                lineAttributeDiv.text("Hover over something to see data.");
                if(pointToggle[index] == false){
                    d3.select(this).style('stroke-width', 3)
                        .attr('stroke-opacity', 0.3);
                }
            })
            .on('click', function(d) {
                var temp = d3.select(this).attr("class").substring(1);
                var index = parseInt(temp) -1;
                if(pointToggle[index] == false) {
                        pointToggle[index] = true;
                    } else {
                        pointToggle[index] = false;
                    }
            });
    }
    
    for(var i = 0; i < 4; i++) {
        var yOrder = ['launch_temp', 'num_o_ring_distress', 'leak_check_pressure', 'flight_index'];
        var yOrderTitle = ['Launch Temp F', 'Number of O-Rings Distressed', 'Leak Check Pressure' , 'Flight Index'];
        yScale2 = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[yOrder[i]]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[yOrder[i]]); })+1])
                  .range([height - offset - margin, margin + offset]);
        
        yAxis = d3.svg.axis()
        .scale(yScale2)
        .orient('left')
        .innerTickSize(0)
        .outerTickSize(0)
        .ticks(4);
    
        yAxisG = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' +  xScale(i*20) + ',0)')
            .call(yAxis);
        
        yLabel = svg.append('text')
				.attr('class','label2')
				.attr('x', xScale(i*20))
				.attr('y', height -10)
				.text(yOrderTitle[i]);

    }
	
});

function parseData(data) {
    for(var i = 0; i < data.length; i++) {
        var tempObject = [{"x": 0, "y": weatherScale(parseFloat(data[i].launch_temp))},
                         {"x": 20, "y": oringScale(parseFloat(data[i].num_o_ring_distress))},
                         {"x": 40, "y": leakScale(parseFloat(data[i].leak_check_pressure))},
                         {"x": 60, "y": parseFloat(data[i].flight_index)}];
        lineDataSet.push(tempObject);
        
    }
}

function weatherScale(value){
    var vmin = 52 - 1;
    var vmax = 81 + 1;
    var vdiff = vmax - vmin;
    var scaleDiff = 25;
    return (scaleDiff*(value-vmin)) / (vdiff);
}

function oringScale(value){
    var vmin = 0 - 1;
    var vmax = 2 + 1;
    var vdiff = vmax - vmin;
    var scaleDiff = 25;
    return (scaleDiff*(value-vmin)) / (vdiff);
}

function leakScale(value){
    var vmin = 50 - 1;
    var vmax = 200 + 1;
    var vdiff = vmax - vmin;
    var scaleDiff = 25;
    return (scaleDiff*(value-vmin)) / (vdiff);
}

function colorFunction(line) {
    if(line[1].y > 17) {
        return "red";
    } else if(line[1].y > 10) {
        return "orange";
    } else {
        return "green";
    }
}

    