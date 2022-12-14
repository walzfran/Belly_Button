function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids;
    var otu_labels = sampleResult.otu_labels;
    var sample_values = sampleResult.sample_values;
    var wfreq = result.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = { title: "Subject's Top 10 Bacteria Cultures", 
    font: {color: "darkblue", family: "Arial"},
    paper_bgcolor: "lavender",
    margin: {t: 40, b: 40, l: 90, r: 5}
     
    };
    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values, 
        color: otu_ids,
        colorscale: "Blues"
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: "Total Bacteria Cultures Per Sample",
    margin: {t: 50, b: 50, l: 50, r: 50},
    hovermode: "closest",
    paper_bgcolor: "royalblue",
    font: {color: "white", family: "Arial"},
    xaxis: {title: "OTU ID"},
    yaxis: {title: "Sample Value (PPM)"}
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    
    // 4. Create the trace for the gauge chart.
     var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "Weekly Frequency of Cleaning", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "lavender" },
            { range: [2, 4], color: "lightblue" },
            { range: [4, 6], color: "blue" },
            { range: [6, 8], color: "royalblue" },
            { range: [8, 10], color: "darkblue" }
          ],
          threshold: {
            line: { color: "white", width: 4 },
            thickness: 0.75,
            value: 10
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 40, r: 40, l: 40, b: 40 },
      paper_bgcolor: "white",
      font: { color: "royalblue", family: "Arial" }
    
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 

  });
}
