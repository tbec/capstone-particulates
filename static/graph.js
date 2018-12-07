var c;
console.log("In the js file")
function draw_graph(field_name, anchor){
    console.log("Called")
    console.log("In the js function")
    console.log("Variable names: Field Name: " + field_name )
    console.log("Variable names: anchor: " + anchor )


    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = document.querySelector(".bottom-top-left").offsetWidth - margin.left - margin.right;
    var height = document.querySelector(".bottom-top-left").offsetHeight - margin.top - margin.bottom;

    //    width = 960 - margin.left - margin.right,
    //    height = 500 - margin.top - margin.bottom;

   // append the svg object to the body of the page
   // append a 'group' element to 'svg'
   // moves the 'group' element to the top left margin
   var svg = d3.select(anchor).append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
   .append("g")
       .attr("transform", 
           "translate(" + margin.left + "," + margin.top + ")");
   
   // get the data
   d3.csv("../static/pollution.csv", function(error, data) {
   if (error) throw error;
   console.log(data);
   console.log('--------------------------')                    
                                                                                    // From green to blue
   var colors = d3.scaleLinear().domain([0,getMaxDataValue(data,field_name)]).range(['blue','orange']);
   console.log(getMaxDataValue(data,field_name));
   var x = d3.scaleBand()
           .range([0, width])
           .padding(0.1);

   var y = d3.scaleLinear()
           .range([height, 0]);
   // Scale the range of the data in the domains
   x.domain(data.map(function(d,i) { return i; }));
   y.domain([0, d3.max(data, function(d) { return d[field_name]; })]);
   // append the rectangles for the bar chart
   svg.selectAll(".bar")
       .data(data)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d,i) { return x(i); })
       .attr("width", x.bandwidth())
       .attr('fill', function(d,i){return colors(d[field_name])})
       .attr("y", function(d) { return y(d[field_name]); })
       .attr("height", function(d) { return height - y(d[field_name]); });
   
   // add the x Axis
   svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));
       //   .selectAll('text')
       //   .attr("transform", "rotate(-65)");;
   
   // add the y Axis
   svg.append("g")
       .call(d3.axisLeft(y));

   svg.append("text")
           .attr("x", (width / 2))             
           .attr("y", height + margin.bottom)
           .attr("text-anchor", "middle")  
           .style("font-size", "16px") 
           .style("text-decoration", "underline")  
           .text(field_name);
   
   });
}

function getMaxDataValue(d,name){
    var temp = []
    console.log(d);
    c = d;
    for(var key in d) { temp.push(parseInt(c[key][name]))};
    return d3.max(temp);
}

// Extracts the data from the csv file into json format
function pullOutData(name, d){
    var total = 0;
    var count = 0;
    for (var key in d){
        if(!isNaN(parseInt(d[key][name]))){
                total += parseInt(d[key][name]); 
                count = count + 1;
        }
    };
    return {name : name, percent: total/count};
};

// Scales the values of the data to be a percentage of the whole rather than standalone values
function scaleDataPercent(data){
    var sum = 0;
    for(var d in data){
        sum += data[d].percent;
    }
    for(var d in data){
        data[d].percent = parseInt(((data[d].percent / sum) * 100).toFixed(2));
    }
    return data;
}


function draw_circle(field_names, anchor){
    console.log(anchor);
    document.querySelector(".outer-wrapper").style.width = "80vw";
    document.querySelector(".outer-wrapper").style.height = "80vh";

    d3.csv("../static/pollution.csv", function(error, data) {
        console.log("in circles")
        console.log(data)
        var d;
        var dataset = [];
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        console.log(data);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        for(var field in field_names)
        {
            console.log("This is th current field: " + field);
            dataset.push(pullOutData(field_names[field], data));
        }
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%% AFTER")
        console.log(dataset);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        d= data;
        // dataset.push(pullOutData("PM1"));
        // dataset.push(pullOutData("PM10"));
        // dataset.push(pullOutData("PM2.5"));
        dataset = scaleDataPercent(dataset);
        console.log("***************************")
        console.log(dataset);
        console.log("***************************")
        dataset = scaleDataPercent(dataset);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log(dataset);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                // var dataset = [
        //     { name: 'IE', percent: 39.10 },
        //     { name: 'Chrome', percent: 32.51 },
        //     { name: 'Safari', percent: 13.68 },
        //     { name: 'Firefox', percent: 8.71 },
        //     { name: 'Others', percent: 6.01 }
        // ];

        var pie=d3.pie().value(function(d){return d.percent;}).sort(null).padAngle(.03);

        var w=300;
        var h = 600 ;
        console.log("FIRST POINT")
        var outerRadius=w/2;
        var innerRadius=100;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var arc=d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);


                // {
                //     width:w,
                //     height:h,
                //     class:'shadow'
                // }
        var svg = d3.select(anchor).append("svg").attr('width', w).attr('height', h).append('g').attr("transform",'translate('+ w/1.5 + "," + h/2+")");

    

        var path = svg.selectAll('path').data(pie(dataset)).enter().append('path').attr('d',arc).attr('fill',function(d,i){return color(d.data.name)})

        path.transition()
                .duration(1000)
                .attrTween('d', function(d) {
                    var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });


        var restOfTheData=function(){
            var text=svg.selectAll('text')
                    .data(pie(dataset))
                    .enter()
                    .append("text")
                    .transition()
                    .duration(200)
                    .attr("transform", function (d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("dy", ".4em")
                    .attr("text-anchor", "middle")
                    .text(function(d){
                        return d.data.percent+"%";
                    })
                    .style("fill", "#fff")
                    .style('font-size', "10px");
                    

            var legendRectSize=20;
            var legendSpacing=7;
            var legendHeight=legendRectSize+legendSpacing;


            var legend=svg.selectAll('.legend').data(color.domain()).enter().append('g').attr("class","legend").attr("transform",function(d,i){return 'translate(-25,' + ((i*legendHeight)-30) + ')';});

            legend.append('rect').attr("width",legendRectSize).attr("height", legendRectSize).attr("rx", 20).attr("ry",20).style("fill",color).style("stroke",color);
            legend.append('text').attr("x",30).attr("y",15).text(function(d){return d;}).style("fill","#929DAF").style("font-size", "14px");

        };

        setTimeout(restOfTheData,1000);
    });
}

// draw_graph("CO", circle,bar);