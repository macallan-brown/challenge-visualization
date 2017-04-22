
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
        xVal = vals[y];
        yVal = vals[x];
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

          xScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
                  .range([yOffset + margin, widthEach - margin - yOffset]);

          yScale = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
                      d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
                  .range([heightEach - xOffset - margin, margin + xOffset]);


          setXAxis(x);
          setYAxis(y);
          d3.selectAll('.axisMiddle').selectAll('.tick').selectAll('text').remove();

          var circle = svg.selectAll('circle')
                .data(data);
          var pointToggle = [];
          for(var i = 0; i < d3.selectAll(data).size(); i++){
              pointToggle.push(false);
          }
            console.log(pointToggle);
            
          circle.enter()
                .append('svg:circle')
                .attr('cx', function(d) {return xScale(d[xVal]); })
                .attr('cy', function(d) {return yScale(d[yVal]); })
                .attr('r', 3)
                .attr("class", function(d) { return 'p' + d['flight_index'] + ' ' + 'g' + xVal + yVal; })
                .on('mouseover', function(d) {
                    var chart = getChartEncodingForPoint(this.classList);
                    d3.select(this).append('svg:title')
                      .style('font-size', '50px')
                      .style('color', '#fff000')
                      .text(getHoverText(d, chart));
                    d3.selectAll('.p' + d['flight_index'])
                        .transition()
                        .duration(500)
                        .style('fill', '#f44242')
                        .attr('r', 5);
                    //console.log(d3.selectAll('circle').selectAll('p' + d['flight_index']));
                })
                .on('mouseout', function(d) {
                    if(pointToggle[d[vals[0]]] == false){
                        d3.selectAll('.p' + d['flight_index'])
                        .transition()
                        .duration(500) 
                        .style('fill', '#000000')
                        .attr('r', 3);
                    }
                })
                .on('click', function(d) {
                    if(pointToggle[d[vals[0]]] == false) {
                        pointToggle[d[vals[0]]] = true;
                    } else {
                        pointToggle[d[vals[0]]] = false;
                    }
                    console.log(pointToggle);
                    
                });
        }
      }
    }


});

//Get the chart that is responsible for the data
function getChartEncodingForPoint(chartString){
    var str = chartString.value;
    var text;
    switch(str.substring(str.indexOf('g'))) {
        case 'glaunch_templeak_check_pressure':
            text = 'templeak';
            break;
        case 'gnum_o_ring_distressleak_check_pressure':
            text = 'ringsleak';
            break;
        case 'gflight_indexleak_check_pressure':
            text = 'indexleak';
            break;
        case 'gleak_check_pressurelaunch_temp':
            text = 'leaktemp';
            break;
        case 'gnum_o_ring_distresslaunch_temp':
            text = 'ringstemp';
            break;
        case 'gflight_indexlaunch_temp':
            text = 'indextemp';
            break;
        case 'gleak_check_pressurenum_o_ring_distress':
            text = 'leakrings';
            break;
        case 'glaunch_tempnum_o_ring_distress':
            text = 'temprings';
            break;
        case 'gflight_indexnum_o_ring_distress':
            text = 'indexrings';
            break;
        case 'gleak_check_pressureflight_index':
            text = 'leakindex';
            break;
        case 'glaunch_tempflight_index':
            text = 'tempindex';
            break;
        case 'gnum_o_ring_distressflight_index':
            text = 'ringsindex';
            break;
        default:
            console.log('Could not figure out which graph the point is associated with');
    }
    return text;
}

//Takes in the data of the point and the chart value returned from getChartEncodingForPoint to return the hover over string data. 

function getHoverText(d, chart){
    var text;
    switch(chart) {
        case 'templeak':
            text = '(' + d[vals[2]] + 
                    ', ' + d[vals[3]] + ')';
            break;
        case 'ringsleak':
            text = '(' + d[vals[1]] + 
                    ', ' + d[vals[3]] + ')';
            break;
        case 'indexleak':
            text = '(' + d[vals[0]] + 
                    ', ' + d[vals[3]] + ')';
            break;
        case 'leaktemp':
            text = '(' + d[vals[3]] + 
                    ', ' + d[vals[2]] + ')';
            break;
        case 'ringstemp':
            text = '(' + d[vals[1]] + 
                    ', ' + d[vals[2]] + ')';
            break;
        case 'indextemp':
            text = '(' + d[vals[0]] + 
                    ', ' + d[vals[2]] + ')';
            break;
        case 'leakrings':
            text = '(' + d[vals[3]] + 
                    ', ' + d[vals[1]] + ')';
            break;
        case 'temprings':
            text = '(' + d[vals[2]] + 
                    ', ' + d[vals[1]] + ')';
            break;
        case 'indexrings':
            text = '(' + d[vals[0]] + 
                    ', ' + d[vals[1]] + ')';
            break;
        case 'leakindex':
            text = '(' + d[vals[3]] + 
                    ', ' + d[vals[0]] + ')';
            break;
        case 'tempindex':
            text = '(' + d[vals[2]] + 
                    ', ' + d[vals[0]] + ')';
            break;
        case 'ringsindex':
            text = '(' + d[vals[1]] + 
                    ', ' + d[vals[0]] + ')';
            break;
        default:
            console.log('Could not get data.');
    }
    return text;
}

//Sets up the axis and labels for the axis depending on which chart it is.
function setXAxis(x) {
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
  } else {
    xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('bottom')
          .innerTickSize(-heightEach)
          .outerTickSize(0)
          .ticks(4);
    xAxisG = svg.append('g')
          .attr('class', 'axisMiddle')
          .attr('transform', 'translate(0,' + (heightEach - xOffset) + ')')
          .call(xAxis);
  }
}

function setYAxis(y) {
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
  } else {
    yAxis = d3.svg.axis()
          .scale(yScale)
          .orient('right')
          .innerTickSize(-(widthEach))
          .outerTickSize(0)
          .ticks(4);

    yAxisG = svg.append('g')
          .attr('class', 'axisMiddle')
          .attr('transform', 'translate(' + (widthEach - xOffset)+ ',0)')
          .call(yAxis);
  }
}
