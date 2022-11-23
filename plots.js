function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // console.log(resultArray);
    var result = resultArray[0];
    // console.log(result);
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key,value]) => {
    PANEL.append("h6").text(`${key}: ${value}`);
  });
});
};

// Create bar chart, bubble chart, gauge chart
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      let sampleInfo = data.samples;
      // console.log(sampleInfo);
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      let sampleId = sampleInfo.filter(num => num.id === sample);
      // console.log(sampleId);
      //  5. Create a variable that holds the first sample in the array.
      let resultId = sampleId[0];
      // console.log(resultId);
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      let otuId = resultId.otu_ids;
        // console.log(otuId);
      let otuLabels = resultId.otu_labels;
      // console.log(otuLabels);
      let sampleValues = resultId.sample_values;
      // console.log(sampleValues);
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 

      var yticks = otuId.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      // console.log(yticks);

      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        type: "bar",
        orientation: "h",

    }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       title: "Top 10 Bacteria Cultures Found",
       xaxis: {title: "Sample Values"},
       yaxis: {title: "OTU ID"}
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuId,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuId,
        size: sampleValues
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 3. Create a variable that holds the washing frequency.
    let metadata = data.metadata;
    // console.log(metadata[0].wfreq);

    // if (metadata[0].id == sample) {
    //   console.log(metadata[0].wfreq);
    //   return metadata[0].wfreq;
    // };

    let patientInfo= metadata.filter(p => p.id == sample);
    // console.log(patientInfo);

    let washFrequency = patientInfo[0].wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: washFrequency,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
        ]
      }
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    width: 600,
    height: 500,
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
    });
  };

// };