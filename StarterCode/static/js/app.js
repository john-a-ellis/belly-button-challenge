//load the file
let myUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let myData = [];
let myNames = [];
let myMeta =[];
let mySamples = [];

d3.json(myUrl).then(function(getData){
    myData = getData;
    myNames = myData.names;
    myMeta = myData.metadata;
    mySamples = myData.samples;

    console.log(myNames[0]);
    console.log(myMeta);
    console.log(mySamples[0]);

    let firstSubject = select_init();
    bar_init(firstSubject[0].id);
    init_bubble(firstSubject[0].id);    
    
});

function optionChanged(option) {
    let mySubject = myMeta.filter(findSubjectbySelection,option)
    updateDemographics(mySubject);
    updateBarChart(option);
    updateBubbleChart(option);
}

function findSubjectbySelection(Subject){
    return Subject.id == this;
}
function findSamplesbySubjectID(Subject){
    return Subject.id == this;
}
function getOtuIDsbySubjectID(Subject){
    mySubject = findSamplesbySubjectID(Subject);
    returnIDs = mySubject.otu_ids;
    return returnIDs;
}
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

function bar_init(SubjectID) {
// Initialize the Bar Chart 
    thisPlot = getPlotData(SubjectID, "bar")
    thisXSeries = thisPlot[0];
    thisYSeries = thisPlot[1];
    console.log(thisXSeries);
    data = [{
      y: thisYSeries,
      x: thisXSeries,
      orientation: 'h',
      type: 'bar'}];

    Plotly.newPlot("bar", data);
  }

  function select_init() {

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

function updateBarChart(subjectID){
    let thisPlotData = getPlotData(subjectID, "bar");

    Plotly.restyle("bar", "x", [thisPlotData[0]]);
    Plotly.restyle("bar", "y", [thisPlotData[1]]);
}

function updateBubbleChart(subjectID){
    let thisPlotData = getPlotData(subjectID, "bubble")
    Plotly.restyle("bubble", "x", [thisPlotData[0]]);
    Plotly.restyle("bubble", "y", [thisPlotData[1]]);
}

function getPlotData(subjectID, plotType){
    let initSubject = mySamples.filter(findSamplesbySubjectID, subjectID);
    if (plotType === 'bar'){
        if(initSubject[0].otu_ids.length < 10){
            var myLength = initSubject[0].otu_ids.length;
        }
        else {
            var myLength = 10;
        }

        sliceotuids = initSubject[0].otu_ids.slice(0,myLength);
        plotsamples = initSubject[0].sample_values.slice(0,myLength);
        plototuids = [];
        for (x = 0; x < myLength; x++){
            plototuids.push('OTU '+ sliceotuids[x]);
        }
        yseries = plototuids.reverse();
        xseries = plotsamples.reverse();
    }
    else if (plotType === "bubble"){
        yseries = initSubject[0].sample_values;
        xseries = initSubject[0].otu_ids;
        
    }
    
    console.log(yseries);
    return [xseries, yseries];
}
function init_bubble(subjectID){
// Initialize the Bubble Chart
    let thisPlot = getPlotData(subjectID, "bubble")
    let thisXSeries = thisPlot[0];
    let thisYSeries = thisPlot[1];
    console.log(thisXSeries);
    let data = [{
        y: thisYSeries,
        x: thisXSeries,
        mode: 'markers',
        marker:{
            size: thisYSeries,
            color: thisXSeries
        }
    }]

    let layout = {
        xaxis:{title:'OTU ID'}
    }

    Plotly.newPlot("bubble", data, layout);
        
}