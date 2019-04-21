String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// global variables that always and are instantiated on pageload
var yearlyCatData = null;
var total_X_axis = [];
var total_Y_axis = [];
var sortedCats = [];
var currentK = 0;
var config = null;
var min = 0;
var max = 0;
var date;
var aTerm = "";
var kList = [];
var tempYears = {};

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
window.chart = null;
var colorNames = Object.keys(window.chartColors);

function loadGraphAmp(term, k, entryDate){
    const verticalLinePlugin = {
        getLinePosition: function (chart, pointIndex) {
            const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
            const data = meta.data;
            // TODO point index is -1 here?????
            return data[pointIndex]._model.x;
        },
        renderVerticalLine: function (chartInstance, pointIndex) {
            const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
            const scale = chartInstance.scales['y-axis-0'];
            const context = chartInstance.chart.ctx;
            const lineColor = "black";

            // render vertical line
            context.beginPath();
            context.strokeStyle = lineColor;
            context.moveTo(lineLeftOffset, scale.top);
            context.lineTo(lineLeftOffset, scale.bottom);
            context.stroke();

            // write label
            context.fillStyle = lineColor;
            context.textAlign = 'center';
            context.fillText('Word Enters SF Lexicon ('+entryDate+')', lineLeftOffset, scale.top - 12);
        },

        afterDatasetsDraw: function (chart, easing) {
            if (chart.config.lineAtIndex) {
                chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
            }
        }
    };

    Chart.plugins.register(verticalLinePlugin);
    var ctx = document.getElementById('chart').getContext('2d');
    config = {
        lineAtIndex: [total_X_axis.indexOf(parseInt(entryDate))],
        type: 'line',
        // Dataset to display
        data: {
            labels: total_X_axis,
            datasets: [{
                label: "Total Occurrences",
                lineTension: 0,
                fill: false,
                data: total_Y_axis,
                backgroundColor: 'rgba(255, 99, 132,0.1)',
                borderColor: 'rgb(255, 99, 132)',
            }]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: "Results for " + term.toUpperCase(),
                fontSize: 24,
                fontFamily: "'Roboto', sans-serif"
            },
            legend: {
                display: true,
                position: 'top'
            },
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 10,
                    borderWidth: 3,
                    hoverRadius: 8,
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [{
                    stacked: false
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 25
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        }
    };
    if (parseInt(entryDate) < total_X_axis[0] || parseInt(entryDate) > total_X_axis[total_X_axis.length - 1]) {
        config.lineAtIndex = [];
    }


    for (i = 0; i < k; i++) {
        if (i >= sortedCats.length) {
            break;
        }
        var cat = sortedCats[i];
        var cat_Y_axis = getOccurrencesForCategory(cat);
        var colorName = colorNames[config.data.datasets.length % colorNames.length];
        var newColor = window.chartColors[colorName];
        var newDataset = {
            label : cat,
            backgroundColor: newColor,
            borderColor: newColor,
            data : cat_Y_axis,
            lineTension: 0,
            fill: false
        };
        config.data.datasets.push(newDataset);
    }
    window.chart = new Chart(ctx, config);
    window.chart.update();
}

// function updateGraph(term, oldK, k, added_field_index) {
//     const chart = window.chart;
//     let used_data_labels = [];
//     let field_indexes_to_add = [];
    
//     for (i = chart.data.datasets.length - 1; i >= 0; i--) {
        
//         if (i > oldK && chart.getDatasetMeta(i).hidden == true) {
//             chart.data.datasets.splice(i, 1);
//         }
//     }
//     saved_cats = chart.data.datasets.slice(oldK + 1, chart.data.datasets.length);
//     for (i = 0; i < saved_cats.length; i++) {
//         field_indexes_to_add.push(sortedCats.indexOf(saved_cats[i]['label']))
//     }
//     chart.data.datasets = [{
//         label: "Total Occurrences",
//         lineTension: 0,
//         fill: false,
//         data: total_Y_axis,
//         backgroundColor: 'rgba(255, 99, 132,0.1)',
//         borderColor: 'rgb(255, 99, 132)',
//     }];

//     for (i = 0; i < k; i++) {
//         if (i >= sortedCats.length) {
//             break;
//         }
//         var cat = sortedCats[i];
//         var cat_Y_axis = getOccurrencesForCategory(cat);
//         var colorName = colorNames[config.data.datasets.length % colorNames.length];
//         var newColor = window.chartColors[colorName];
//         var newDataset = {
//             label : cat,
//             backgroundColor: newColor,
//             borderColor: newColor,
//             data : cat_Y_axis,
//             lineTension: 0,
//             fill: false
//         };
//         used_data_labels.push(cat);
//         config.data.datasets.push(newDataset);
//     }
    
//     if (added_field_index != "None" && !field_indexes_to_add.includes(added_field_index)) {
//         field_indexes_to_add.push(parseInt(added_field_index));
//     }
//     field_indexes_to_add.sort();
//     for (i = 0; i < field_indexes_to_add.length; i++) {
//         index = parseInt(field_indexes_to_add[i]);
//         if (!used_data_labels.includes(sortedCats[index])) {
//             var cat = sortedCats[index];
//             var cat_Y_axis = getOccurrencesForCategory(cat);
//             var colorName = colorNames[config.data.datasets.length % colorNames.length];
//             var newColor = window.chartColors[colorName];
//             var newDataset = {
//                 label : cat,
//                 backgroundColor: newColor,
//                 borderColor: newColor,
//                 data : cat_Y_axis,
//                 lineTension: 0,
//                 fill: false
//             };
//             used_data_labels.push(cat);
//             config.data.datasets.push(newDataset);
//         }
//     }
//     window.chart.update();
// }

function getOccurrencesForCategory(cat) {
    var y_axis = [];
    for (j = total_X_axis[0]; j <= total_X_axis[total_X_axis.length - 1]; j++) {
        if (yearlyCatData.hasOwnProperty(j.toString()) &&
            yearlyCatData[j.toString()].hasOwnProperty(cat)) {
            y_axis.push(parseInt(yearlyCatData[j.toString()][cat]));
        } else {
            y_axis.push(0);
        }
    }
    return y_axis;
}

var dateGlobal;
function drawAmplitude() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toLowerCase();
    const k = urlParams.get('k');
    currentK = parseInt(k);

    database.ref('/origins/' + search_term).once('value').then(function(snapshot) {
        date = snapshot.val()['brave'];
    });

    database.ref('/occurrences/' + search_term).once('value').then(function(snapshot) {
        var occurrences = JSON.parse(snapshot.val()['by_year'].replaceAll("'", '"'));
        var labels = [];
        var nums = [];
        Object.keys(occurrences).sort().forEach(function(key) {
            labels.push(parseInt(key));
            nums.push(parseInt(occurrences[key]));
        });
        min = labels[0];
        max = labels[labels.length - 1];
        var cur = 0;
        for (i = min; i <= max; i++) {
            total_X_axis.push(i);
                if (labels.includes(i)) {
                    total_Y_axis.push(nums[cur]);
                    cur = cur + 1;
                } else {
                    total_Y_axis.push(0);
                }
        }

        dateGlobal = date;
        loadGraphAmp(search_term, parseInt(k), date);
    });     

    database.ref('/fields/' + search_term).once('value').then(function(snapshot) {
        var cat_counts = JSON.parse(snapshot.val()['total'].replaceAll("'",'"'));
        yearlyCatData = JSON.parse(snapshot.val()['by_year'].replaceAll("'",'"'));
    
        // sorts the categories greatest to least on total occurrences
        var items = Object.keys(cat_counts).map(function(key) {
            return [key, cat_counts[key]];
        });
        items.sort(function(t, o) {
            return parseInt(o[1]) - parseInt(t[1]);
        });
        for (i = 0; i < items.length; i++) {
            sortedCats.push(items[i][0]);
        }
    });
};
$(window).on('load', () => drawAmplitude());
