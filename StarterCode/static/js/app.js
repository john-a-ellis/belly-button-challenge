//load the file
let myUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
// setting up some global arrays
let myData = [];
let myNames = [];
let myMeta =[];
let mySamples = [];

d3.json(myUrl).then(function(getData){
    myNames = getData.names;
    myMeta = getData.metadata;
    mySamples = getData.samples;
    console.log(getData);
    console.log(myNames);
    console.log(myMeta);
    console.log(mySamples);

//getting the first subject in the select list
    let firstSubject = initSelect();
//initalizing the charts based on the values related to the first subject id in the select list
    initBarChart(firstSubject[0].id);
    initBubbleChart(firstSubject[0].id);
    initGaugeChart(firstSubject);    
});
// **************************************
// optionChanged function fires a series of chained funcrtions when a new option is selected in the 'Test Subject ID No: select control
// it takes the option selected and calls a number of functions to update the Dashboard.
function optionChanged(option) {
    let mySubject = myMeta.filter(findSubjectbySelection,option)
    updateDemographics(mySubject);
    updateBarChart(option);
    updateBubbleChart(option);
    updateGaugeChart(mySubject);
}

//*****************************************
//findSubjectbySelection is used to filter the Meta array by the selected subject ID
function findSubjectbySelection(subject){
    return subject.id == this;
}

function findSamplesbySubjectID(Subject){
    return Subject.id == this;
}
function getOtuIDsbySubjectID(Subject){
    mySubject = findSamplesbySubjectID(Subject);
    returnIDs = mySubject.otu_ids;
    return returnIDs;
}
//*****************************************
// updateDemographics updates the demographic table with the values for the currently selected subject passed as a
// string value.  Chained to the onchange event for the select control.
function updateDemographics(subject) {
    let myDemoBox = d3.select(".panel-body");
    let myKeys = Object.keys(subject[0]);
    let myValues = Object.values(subject[0]);
    let text ='';
    for (i = 0; i < myValues.length; i++){
        text += '<b>' + myKeys[i] + '</b>';
        text += ': ';
        text += myValues[i];
        text += '<br>';
    }
    myDemoBox.html(text);
}

//*****************************************
  //initSelect() initializes the options and values to be used in the select control.
  function initSelect() {

    let mySelector=d3.select("#selDataset");
    
    let myOption=''; 
    for (x = 0; x < mySamples.length; x++){
        myOption = mySelector.append("option", myMeta[x].id);
        myOption.text( myMeta[x].id);
        myOption.attr("value", myMeta[x].id);
    }

    let mySubject = myMeta.filter(findSubjectbySelection, mySelector.property("value"))
    updateDemographics(mySubject);
    return mySubject;
}

//*****************************************
// updateBarChart updates the bar chart with new sample values and is chained to the onChange event for the select control.
function updateBarChart(subjectID){
    let thisPlotData = getSamplePlotData(subjectID, "bar");

    Plotly.restyle("bar", "x", [thisPlotData[0]]);
    Plotly.restyle("bar", "y", [thisPlotData[1]]);
    Plotly.restyle("bar", "text", [thisPlotData[2]]);
}

//*****************************************
// updateBubbleChart updates the bubble chart with new sample values and is chained to the onChange event for the select control.
function updateBubbleChart(subjectID){
    let thisPlotData = getSamplePlotData(subjectID, "bubble")
    Plotly.restyle("bubble", "x", [thisPlotData[0]]);
    Plotly.restyle("bubble", "y", [thisPlotData[1]]);
    Plotly.restyle("bubble", "text", [thisPlotData[2]]);
}

//*****************************************
// getSamplePlotData recieves two parameters, the first parameter is the subject ID as a string, the second is the plotType the returned
// data will be used in, also received as a string.  The function then formats the returned data based on the 
function getSamplePlotData(subjectID, plotType){
    let initSubject = mySamples.filter(findSamplesbySubjectID, subjectID);
    if (plotType === 'bar'){
        if(initSubject[0].otu_ids.length < 10){
            var myLength = initSubject[0].otu_ids.length;
        }
        else {
            var myLength = 10;
        }

        sliceOtuIds = initSubject[0].otu_ids.slice(0,myLength);
        plotSamples = initSubject[0].sample_values.slice(0,myLength);
        plotLabels = initSubject[0].otu_labels.slice(0,myLength);

        plotOtuIds = [];
        for (x = 0; x < myLength; x++){
            plotOtuIds.push('OTU '+ sliceOtuIds[x]);
        }
        ySeries = plotOtuIds.reverse();
        xSeries = plotSamples.reverse();
        zSeries = plotLabels.reverse();
    }
    else if (plotType === "bubble"){
        ySeries = initSubject[0].sample_values;
        xSeries = initSubject[0].otu_ids;
        zSeries = initSubject[0].otu_labels;    
    }
    
    return [xSeries, ySeries, zSeries];
}

//*****************************************
// Initialize the Bar Chart receives the selected subject ID as a string variable and passes it to getSamplePlotData
// to build the necessary data arrays for plotting.
function initBarChart(SubjectID) {

    thisPlot = getSamplePlotData(SubjectID, "bar")
    thisXSeries = thisPlot[0]; //array of otu ID's
    thisYSeries = thisPlot[1]; //array of sample values
    thisZSeries = thisPlot[2]; //array of otu label's

    data = [{
      y: thisYSeries,
      x: thisXSeries,
      text:thisZSeries,
      orientation: 'h',
      type: 'bar',
      
    }];
    
    let layout = {
        title: "Top 10 Occurring OTU's"
        };

    Plotly.newPlot("bar", data, layout);
  }

//*****************************************
// Initialize the Bubble Chart receives the selected subject ID as a string variable and passes it to getSamplePlotData
// to build the necessary data arrays for plotting.
function initBubbleChart(subjectID){

    let thisPlot = getSamplePlotData(subjectID, "bubble")
    let thisXSeries = thisPlot[0];
    let thisYSeries = thisPlot[1];
    let thisTextSeries = thisPlot[2];
    console.log(thisXSeries);
    let data = [{
        y: thisYSeries,
        x: thisXSeries,
        text:thisTextSeries,
        mode: 'markers',
        marker:{
            size: thisYSeries,
            color: thisXSeries
        }
    }]

    let layout = {
        xaxis:{title:'OTU ID'},
        yaxis:{title:'Sample Values'},
        title: "Samples Values by OTU ID"
    }

    Plotly.newPlot("bubble", data, layout);
        
}
