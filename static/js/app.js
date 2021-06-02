// Write a function that will build the metadata for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()
// - extract the metadata from the json
// - filter the metadata for the sample id
// - update the metadata html elements
// - clear any existing metadata in the metadata html elements
// - append hew header tags for each key-value pair in the filtered metadata


// for i in list: 
    //read d3.json
    // gather metadata, sampleid, .filter(when id === sampleid), update #sample-metadata in html, add new header tags (new table?)
function buildMetadata(singleSample) {
    d3.json("data/samples.json").then((data) => {
        var result = data.metadata;
        var sampleResultFilter = result.filter(d => d.id == singleSample);
        var sampleResult = sampleResultFilter[0];
        console.log(sampleResult);

        var htmlMeta = d3.select("#sample-metadata");

        // clear html from #sample-metadata html
        htmlMeta.html("");

        Object.entries(sampleResult).forEach(([key, value]) => {
            htmlMeta.append("h6").text(`${key}: ${value}`);
        });
    });
}


// Write a function that will build the charts for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()
// - extract the samples from the json
// - filter the samples for the sample id
// - extract the ids, labels, and values from the filtered result
// - build a bubble chart and plot with Plotly.newPlot()
// - build a bar chart and plot with Plotly.newPlot()
function chartBuild(singleSample) {
    d3.json("data/samples.json").then((data) => {
        // console.log(data);
        var otuResult = data.samples;
        // console.log(otuResult);
        var otuResultFilter = otuResult.filter(d => d.id == singleSample);
        var otuSampleResult = otuResultFilter[0];
        console.log(otuSampleResult);

        var ids = otuSampleResult.otu_ids;
        console.log(ids);
        var labels = otuSampleResult.otu_labels;
        var sampleValues = otuSampleResult.sample_values;

        var bubbleChart = {
            title: "Bacteria Cultures",
            hovermode: "closest",
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Frequency"
            }
        };

        var bubbleData = [{
            x: ids,
            y: sampleValues,
            text: labels,
            mode: "markers"
        }];
        
        Plotly.newPlot("bubble", bubbleData, bubbleChart);

        var yTicks = ids.slice(0,10).map(otuId => `OTU ${otuId}`);

        var barData = [
            {
                y: yTicks,
                x: sampleValues.slice(0, 10),
                text: labels.slice(0, 10),
                type: "bar",
                orientation: "h"
            }
        ];

        var barChart = {
            title: "Top 10 Bacteria Found"
        };

        Plotly.newPlot("bar", barData, barChart);
    
    });

};

// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:
// - select the dropdown element in the page
// - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
// - extract the first sample from the data
// - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown

function init() {
    var dataSelector = d3.select("#selDataset");

    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            dataSelector.append("option").text(sample).property("value", sample);
        });

        var firstSample = sampleNames[0];
        chartBuild(firstSample);
        buildMetadata(firstSample);
    });
}




// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
// - call your two functions to build the metadata and build the charts on the new sample
// Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown

function optionChanged(newSample) {
    chartBuild(newSample);
    buildMetadata(newSample);
}


// Initialize the dashboard by calling your init() function

init();
