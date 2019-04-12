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

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
window.myChart = null;
var colorNames = Object.keys(window.chartColors);

function loadGraph(term, k, entryDate){
    const verticalLinePlugin = {
        getLinePosition: function (chart, pointIndex) {
            const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
            const data = meta.data;
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
    var ctx = document.getElementById('myChart').getContext('2d');
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
                text: "Results for " + aTerm,
                fontSize: 24,

            },
            responsive: true,
            legend: {
                display: true,
                position: 'bottom'
            },
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 10,
                    borderWidth: 3,
                    hoverRadius: 8,
                }
            },
            scales: {
                yAxes: [{
                    stacked: false
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
    window.myChart = new Chart(ctx, config);
    window.myChart.update();


}

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

window.onload = function() {

    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toLowerCase();
    const k = urlParams.get('k');
    currentK = parseInt(k);

    var database = firebase.database();
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
    });
    database.ref('/origins/' + search_term).once('value').then(function(snapshot) {
        date = snapshot.val()['brave'];
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

            var start_year_select = document.getElementById("start-year-select");
            var end_year_select = document.getElementById("end-year-select");
            for (i = min; i <= max; i++) {
                var option = document.createElement("option");
                option.text = i;
                option.value = i;
                start_year_select.add(option);
                var option = document.createElement("option");
                option.text = i;
                option.value = i;
                end_year_select.add(option);
            }
            $("#end-year-select").val(max);
            var k_select = document.getElementById("k-select");
            for (i = -1; i < Object.keys(cat_counts).length; i++) {
                var option = document.createElement("option");
                var j = i + 1;
                option.text = j;
                option.value = j;
                k_select.add(option);
            }
            $("#k-select").val(k);
            loadGraph(search_term, parseInt(k), date);
    });

    document.getElementById('process-button').addEventListener('click', function() {
        var startYear = parseInt(document.getElementById("start-year-select").value);
        var endYear = parseInt(document.getElementById("end-year-select").value);
        var k_selected = parseInt(document.getElementById("k-select").value);

        if (startYear >= endYear) {
            startYear = min;
            endYear = max;
        }
        if (parseInt(date) < startYear || parseInt(date) > endYear) {
            window.myChart.config.lineAtIndex = [];
        } else {
            window.myChart.config.lineAtIndex = [total_X_axis.indexOf(parseInt(date)) - total_X_axis.indexOf(startYear)];
        }

        updateGraph(config.options.title.text, k_selected);



        var start_ind = total_X_axis.indexOf(startYear);
        var end_ind = total_X_axis.indexOf(endYear);

        config.data.labels = total_X_axis.slice(start_ind, end_ind + 1);
        config.data.datasets.forEach(function(dataset) {
            dataset.data = dataset.data.slice(start_ind, end_ind + 1);
        });
        window.myChart.update();

    });
};



function updateGraph(term, k) {
    const chart = window.myChart;

    chart.data.datasets = [{
        label: "Total Occurrences",
        lineTension: 0,
        fill: false,
        data: total_Y_axis,
        backgroundColor: 'rgba(255, 99, 132,0.1)',
        borderColor: 'rgb(255, 99, 132)',
    }];

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
    window.myChart.update();
}

$(function updateDropdown () {
    $("#start-year-select").change(function (e) {
        $("#end-year-select").empty();
        var options =
            $("#start-year-select option").filter(function(e){

                return $(this).val() >= $("#start-year-select option:selected").val();
            }).clone();

        $("#end-year-select").append(options);
    });
});