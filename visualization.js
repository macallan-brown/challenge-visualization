
widthEach = 200;
heightEach = 200;
margin = 20;
xOffset = 30;   //TODO: Will probably need an array for this so that each graph has a different value
yOffset = 30;  //Pretty sure that this is going to need to be an array
vals = ['flight_index','num_o_ring_distress','launch_temp','leak_check_pressure'];
xVal = vals[0];
yVal = vals[0];

d3.csv('challenger.csv', function(csvData) {
    data = csvData;

    for (var x in vals) {
      tableRow = d3.select('#visSVG1').append('tr:tr');
      for(var y in vals) {
        if(y == x) {
          titleText = '';
          switch (xVal) {
            case 'flight_index':
              titleText = 'Flight Index';
              break;
            case 'num_o_ring_distress':
              titleText = 'Number of O-Rings Distressed';
              break;
            case 'launch_temp':
              titleText = 'Launch Temperature';
              break;
            default:
              titleText = 'Leak Check Pressure';
          }
          tableItem = tableRow.append('td:td');
          title = tableItem.append('div:div')
                .attr('width', widthEach)
                .attr('height', heightEach)
                .attr('class', 'varlabel')
                .text(titleText);
        } else {
          tableItem = tableRow.append('td:td');
          svg = tableItem.append('svg:svg')
                .attr('width', widthEach)
                .attr('height', heightEach)
                .attr('class', 'scatterplot');

          xVal = vals[y];
          yVal = vals[x];

          xScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
                  .range([yOffset + margin, widthEach - margin - yOffset]);

          yScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
                  .range([heightEach - xOffset - margin, margin + xOffset]);

          //Build the axes
          //TODO: axis must change depending on which chart
          //TODO: create css class for axis, label


          if(x == 0){
            xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('top')
                  .innerTickSize(-heightEach)
                  .outerTickSize(0)
                  .ticks(4);

            xAxisG = svg.append('g')
                  .attr('class', 'axis')
                  .attr('transform', 'translate(0,' + xOffset + ')')
                  .call(xAxis);
          } else if(x == 3){
            xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom')
                  .innerTickSize(-heightEach)
                  .outerTickSize(0)
                  .ticks(4);

            xAxisG = svg.append('g')
                  .attr('class', 'axis')
                  .attr('transform', 'translate(0,' + (heightEach - xOffset) + ')')
                  .call(xAxis);
          }
          if(y == 0){
            yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('left')
                  .innerTickSize(-widthEach)
                  .outerTickSize(0)
                  .ticks(4);

            yAxisG = svg.append('g')
                  .attr('class', 'axis')
                  .attr('transform', 'translate(' + yOffset + ',0)')
                  .call(yAxis);

          } else if (y == 3) {
            yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('right')
                  .innerTickSize(-(widthEach))
                  .outerTickSize(0)
                  .ticks(4);

            yAxisG = svg.append('g')
                  .attr('class', 'axis')
                  .attr('transform', 'translate(' + (widthEach - xOffset)+ ',0)')
                  .call(yAxis);
          }



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
