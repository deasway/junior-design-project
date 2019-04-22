String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


// basic clor definitions
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    a: '#1f77b4',
    b: '#d62728',
    c: '#ff7f0e',
    d: '#ffbb78',
    e: '#2ca02c',
    f: '#98df8a',
    g: '#aec7e8',
    h: '#ff9896',
    i: '#9467bd',
    j: '#c5b0d5',
    k: '#8c564b',
    l: '#c49c94',
    m: '#e377c2',
    n: '#f7b6d2',
    o: '#7f7f7f',
    p: '#c7c7c7',
    q: '#bcbd22',
    r: '#dbdb8d',
    s: '#17becf',
    t: '#9edae5',
    grey: 'rgb(201, 203, 207)',
};

var colorNames = Object.keys(window.chartColors);
var total_occurrences = 0;
var temp_total = 0;
var temp_data = {};
var name;
var labels = [];
var temp = {};
var chart;
var min = 0;
var max = 0;
var tempName =[];

function drawMap(term, k_value, subfield) {
    //const urlParams = new URLSearchParams(window.location.search);
    const k = k_value;
    currentK = parseInt(k);

    if (Object.keys(occurrences).length == 0) {
        loadGraphMap(search_term.toUpperCase(), currentK);
    } else {
        updateGraph(search_term.toUpperCase(), currentK, subfield);
    }
};

function updateGraph(term, k, subfields){
    temp_data = {};
    temp = {};
    temp_total = 0;

    Object.keys(occurrences).forEach(function (key) {
        if (parseInt(key) >= parseInt($('#start-year').val()) && parseInt(key) <= parseInt($('#end-year').val())) {
            temp = (occurrences[key]);
            putData(temp);
        }
    });

    if (Object.entries(temp_data).length === 0) {
        alert("No Yearly Data Available");
    } else {
        if (chart) {
            chart.destroy();
        }
        var data_map = new Map();
        for (var key in temp_data) {
            if (temp_data.hasOwnProperty(key)) {
                data_map.set(key, temp_data[key]);
            }
        }

        // sort data
        data_map[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        };

        var data_labels = ["Other"];
        var data_content = [];
        data_content.push(temp_total);


        var ctx = document.getElementById('chart').getContext('2d');
        var config = {
            type: 'doughnut',

            // Dataset to display
            data: {
                labels: data_labels,
                datasets: [{
                    data: data_content,
                    backgroundColor: ["rgb(150, 150, 150)"]
                }]
            },

            // Configuration options go here
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: "Results for " + term,
                    fontSize: 24
                },

                legend: {
                    position: "right",
                    boxWidth: "12"
                }
            }
        };
        tempName = [];
        if (subfields != -1) {
            for (i = 0; i < subfields.length; i++) {
                for (let [key, value] of data_map) {
                    if ((subfields[i] + ' ') == key) {
                        tempName.push(key + ' ');
                        var colorName = colorNames[config.data.datasets[0].data.length % colorNames.length];
                        var newColor = window.chartColors[colorName];
                        config.data.labels.push(key);
                        config.data.datasets[0].data.push(parseInt(value));
                        config.data.datasets[0].backgroundColor.push(newColor);

                        config.data.datasets[0].data[0] -= parseInt(value);
                        if (config.data.datasets[0].data[0] < 0) {
                            config.data.datasets[0].data[0] = 0;
                        }
                    }
                }
            }
        }

        var i = tempName.length;
        console.log(i);
        for (let [key, value] of data_map) {
            if (i < k && !tempName.includes(key + '')) {
                tempName.push(key + '');
                var colorName = colorNames[config.data.datasets[0].data.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                config.data.labels.push(key);
                config.data.datasets[0].data.push(parseInt(value));
                config.data.datasets[0].backgroundColor.push(newColor);
                i++;

                config.data.datasets[0].data[0] -= parseInt(value);
                if (config.data.datasets[0].data[0] < 0) {
                    config.data.datasets[0].data[0] = 0;
                }
            }
        }
        //console.log(config.data.datasets);
        chart = new Chart(ctx, config);
    }


}

function loadGraphMap(term, k){
    var data_map = new Map();

    JSON.parse(total, function(key, value) {
        if (key) {
            data_map.set(key, value);
        }
    });

    // sort data
    data_map[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };

    var data_labels = ["Other"];
    var data_content = [];
    data_content.push(total_occurrences);

    $('#chart-container').html(canvas_html);
    var ctx = document.getElementById('chart').getContext('2d');
    var config = {
        type: 'doughnut',

        // Dataset to display
        data: {
            labels: data_labels,
            datasets: [{
                data: data_content,
                backgroundColor: ["rgb(150, 150, 150)"]
            }]
        },

        // Configuration options go here
        options: {
            // responsive: true,
            title: {
                display: true,
                text: "Results for " + term.toUpperCase(),
                fontSize: 25
            },
            maintainAspectRatio: true,
            responsive: false,
            legend: {
                position: "right",
                fullWidth: false
            }
        }
    };
    
    var i = 0;
    for (let [key, value] of data_map) {
        if (i < k) {
            var colorName = colorNames[config.data.datasets[0].data.length % colorNames.length];
            var newColor = window.chartColors[colorName];
            config.data.labels.push(key);
            config.data.datasets[0].data.push(parseInt(value));
            config.data.datasets[0].backgroundColor.push(newColor);
            i++;

            config.data.datasets[0].data[0] -= parseInt(value);
            if (config.data.datasets[0].data[0] < 0) {
                config.data.datasets[0].data[0] = 0;
            }
        } 
    }
    //console.log(config.data.datasets);
    chart = new Chart(ctx, config);
}


function putData(array) {
    Object.keys(array).forEach(function (key) {
       if (key in temp_data){
           temp_data[key] = (parseInt(temp_data[key]) + parseInt(array[key])).toString();
           temp_total += parseInt(array[key]);
       } else {
           temp_data[key] = array[key];
           temp_total += parseInt(array[key]);
       }
    });
}


