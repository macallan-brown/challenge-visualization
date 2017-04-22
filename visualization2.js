
xVal2 = vals[0];
yVal2 = vals[0];
axisOffset2 = 200;
heightEach2 = 600;


d3.csv('challenger.csv', function(csvData) {
    data = csvData;
    var vis = d3.select('#visSVG2');
    for (var axis in vals) {
        var axis = vis.append('div:div');
        yScale = d3.scale.linear()
            .domain([d3.min(data, function(d) {return parseFloat(d[yVal2]); })-1,
                d3.min(data, function(d) {
                return parseFloat(d[yVal2]); 
            }) +1])
            .range([heightEach, 0]);
        //console.log( yScale()));
    }
});