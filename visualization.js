
widthEach = 200;
heightEach = 200;
margin = 10;
xOffset = 40;   //TODO: Will probably need an array for this so that each graph has a different value
yOffset = 100;  //Pretty sure that this is going to need to be an array
vals = ['flight_index','num_o_ring_distress','launch_temp','leak_check_pressure'];
xVal = vals[0];
yVal = vals[0];

d3.csv('challenger.csv', function(csvData) {
    data = csvData;

    //Size the Div that contains everything


    //TODO: need to set xval and yval dynamically

    for (var x in vals) {
      tableRow = d3.select('#visSVG1').append('tr:tr');
      for(var y in vals) {
        if(y == x) {
          title = tableRow.append('div:div')
                .attr('width', widthEach)
                .attr('height', heightEach)
                .text(xVal);
        } else {
          tableItem = tableRow.append('td:td');
          svg = tableItem.append('svg:svg')
                .attr('width', widthEach)
                .attr('height', heightEach);

          xVal = vals[x];
          yVal = vals[y];

          xScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
                  .range([yOffset + margin, widthEach - margin]);

          yScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
                  .range([heightEach - xOffset - margin, margin]);

          //Build the axes
          //TODO: axis must change depending on which chart
          //TODO: create css class for axis, label
          xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(4);
          xAxisG = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + (heightEach - xOffset) + ')')
                .call(xAxis);
          // xLabel = svg.append('text')
          //       .attr('class', 'label')
          //       .attr('x', widthEach/2)
          //       .attr('y', heightEach-5)
          //       .text(xVal);
          yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(4);
          yAxisG = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + yOffset + ',0)')
                .call(yAxis);
          // yLabel = svg.append('text')
          //       .attr('class','label')
          //       .attr('x', yOffset/2)
          //       .attr('y', heightEach/2-10)
          //       .text(yVal);

          var circle = svg.selectAll('circle')
                .data(data);
          circle.enter()
                .append('svg:circle')
                .attr('cx', function(d) {return xScale(d[xVal]); })
                .attr('cy', function(d) {return yScale(d[yVal]); })
                .attr('r', 3)
                //.style('fill', '#000000');
        }
      }
    }


});
