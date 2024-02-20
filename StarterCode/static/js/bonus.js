//*****************************************
// Initialize the Gauge Chart 
function initGaugeChart(subject){
    
    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: subject[0].wfreq,
          title: { text: "Belly Button Washing Frequency<br>Scrubs per week" },
          type: "indicator",
          mode: "gauge",
        
          gauge: {
            shape: "angular",
            bar:{color: "green"},
            axis: { range: [0, 9],
                    dticks: .1,
                    tickelabelstep:1,
                    showticklables: true,
                    tickvals:[0,1,2,3,4,5,6,7,8,9],
                    ticks: 'outside',
                    tickmode:'array',
                    ticklen:10,
            },
     
            steps: [
              { range: [0, 1], color: "#ffffff"},
              { range: [1, 2], color: "#ecf2df"}, 
              { range: [2, 3], color: "#d9e6bf"},
              { range: [3, 4], color: "#c6d99f"},
              { range: [4, 5], color: "#b3cc80"},
              { range: [5, 6], color: "#9fbf60"},
              { range: [6, 7], color: "#8cb340"},
              { range: [7, 8], color: "#79a620"},
              { range: [8, 9], color: "#669900"},

            ],
            threshold: {
              line: { color: "green", width: 4 },
              thickness: 0.75,
              value: subject[0].wfreq
            }
          }
        }
      ];
      
      var layout = {
        width: 600, 
        height: 450, 
        margin: { t: 0, b: 0 },
        };
    Plotly.newPlot('gauge', data, layout);
}

//*****************************************
// updateGaugeChart updates the gauge chart with new frequency values and is chained to the onChange event for the select control.
function updateGaugeChart(subject){
    Plotly.restyle("gauge", "value", [subject[0].wfreq]);
    Plotly.restyle("gauge", "gauge.threshold.value", [subject[0].wfreq]);
}
