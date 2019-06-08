function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    var url = "/metadata/"+ sample ;
    
    d3.json(url).then(function(data){
//Append rows to the metadata table
        var div = d3.select("#sample-metadata");
         div.html("");
        var tr = div.append("tr");
        tr.append('tr').text("Age: " + data.AGE);
        tr.append('tr').text("BBTYPE: " + data.BBTYPE);
        tr.append('tr').text("ETHNICITY: " + data.ETHNICITY);
        tr.append('tr').text("GENDER: " + data.GENDER);
        tr.append('tr').text("LOCATION: " + data.LOCATION);
        tr.append('tr').text("WFREQ: " + data.WFREQ);
        tr.append('tr').text("sample: " + data.sample);
        });

  // Use `d3.json` to fetch the metadata for a sample
  
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var level = data.WFREQ;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
            'Slow', 'Super Slow', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Gauge</b> <br> Speed 0-100',
  height: 1000,
  width: 1000,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
    
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = "/samples/" + sample;
    
    d3.json(url).then(function (data) {
    var values = data.sample_values;
    var ids = data.otu_ids;
    var labels = data.otu_labels;
    var values_with_index = [];
    for (var i in values) {
        values_with_index.push([values[i], i]);
    }
    values_with_index.sort(function(left, right) {
    return (right[0] - left[0]);
    });
    var indexes = [];
    var otu_ids = [];
    var sample_values = [];
    var otu_labels = [];
    for (var j in values_with_index) {
        sample_values.push(values_with_index[j][0]);
        indexes.push(values_with_index[j][1]);
        otu_ids.push(ids[values_with_index[j][1]]);
        otu_labels.push(labels[values_with_index[j][1]]);
    }
    console.log("otu_ids = " + otu_ids);
    console.log("sample_values = " + sample_values);
    var otu_ids1 = otu_ids.slice(0,10);
    var sample_values1 = sample_values.slice(0,10);
    var otu_labels1 = otu_labels.slice(0,10);
        /*var otu_ids = data.otu_ids.slice(0,9);
        console.log("otu_ids = " + otu_ids);
        var sample_values = data.sample_values.slice(0,9);
        var otu_labels = data.otu_labels.slice(0,9); */
        var piedata = [{
                labels: otu_ids1,
                values: sample_values1,
                hovertext: otu_labels1,
                type: 'pie'
            }];
            
        
        var layout = {
                title: "Plot for Sample",
                height: 250,
                width: 250
            };
        Plotly.plot("pie", piedata, layout);

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
        
    //draw bubble chart
    var bubbledata = [{
                x: data.otu_ids,
                y: data.sample_values,
                text: data.otu_labels,
                mode: 'markers',
                marker: {
                    color: data.otu_ids,
                    size: data.sample_values
                }
            }];
            
        
        var layout1 = {
                title: "Sample BubbleChart",
                height: 800,
                width: 1500
            
            };
    Plotly.plot("bubble", bubbledata, layout1);
        
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
   console.log("inside init function");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  console.log("This is new sample");
}

// Initialize the dashboard
init();
