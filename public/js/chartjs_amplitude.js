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

function loadGraph(term, k){
    var ctx = document.getElementById('myChart').getContext('2d');
    config = {
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
                text: "Results for " + term,
                fontSize: 24
            },
            responsive: true,
            legend: {
                display: true
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
//    const search_term = urlParams.get('search');
    const search_term = urlParams.get('search').toLowerCase();
    const k = urlParams.get('k');
    currentK = parseInt(k);

    var firebase_config = {
        apiKey: "AIzaSyBXViFaFbggSb0QqB1QwmAtuE3XO545NF0",
        authDomain: "junior-design-project.firebaseapp.com",
        databaseURL: "https://junior-design-project.firebaseio.com",
        projectId: "junior-design-project",
        storageBucket: "junior-design-project.appspot.com",
        messagingSenderId: "986723685667"
    };
    firebase.initializeApp(firebase_config);
    var database = firebase.database();
    database.ref('/').orderByChild('sorting_name').equalTo(search_term).on("value", function(snapshot) {

        snapshot.forEach(function(child) {
            var raw_data = child.val()['occurrences'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(raw_data, function(key, value) {
                if (key) {
                    labels.push(parseInt(key));
                    nums.push(parseInt(value));
                }
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
        
            // sorts the categories greatest to least on total occurrences 
            var cat_counts = JSON.parse(child.val()['fields'].replaceAll("'", '"'));
            var items = Object.keys(cat_counts).map(function(key) {
                return [key, cat_counts[key]];
            });
            items.sort(function(t, o) {
                return parseInt(o[1]) - parseInt(t[1]);
            });
            for (i = 0; i < items.length; i++) {
                sortedCats.push(items[i][0]);
            }
            
            yearlyCatData = JSON.parse(child.val()['fields_by_year'].replaceAll("'", '"'));
            
            var start_year_select = document.getElementById("start-year-select");
            var end_year_select = document.getElementById("end-year-select");
            for (i = min; i <= max; i++) {
                var option = document.createElement("option");
                option.text = i;
                start_year_select.add(option);
                var option = document.createElement("option");
                option.text = i;
                end_year_select.add(option);
            }
            var k_select = document.getElementById("k-select");
            for (i = -1; i < Object.keys(cat_counts).length; i++) {
                var option = document.createElement("option");
                option.text = i + 1;
                k_select.add(option);
            }
            loadGraph(child.val()['name'], parseInt(k));
        });
    });
    
        document.getElementById('process-button').addEventListener('click', function() {
            var startYear = parseInt(document.getElementById("start-year-select").value);
            var endYear = parseInt(document.getElementById("end-year-select").value);
            var k_selected = parseInt(document.getElementById("k-select").value);
            
            updateGraph(config.options.title.text, k_selected);
            if (startYear >= endYear) {
                startYear = min;
                endYear = max;
            }
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
    config = {
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
                text: "Results for " + term,
                fontSize: 24
            },
            responsive: true,
            legend: {
                display: true
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
    window.myChart.destroy();
    var ctx = document.getElementById('myChart').getContext('2d')
    window.myChart = new Chart(ctx, config);
    window.myChart.update();
}
