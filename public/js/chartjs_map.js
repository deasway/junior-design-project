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

var yearlyCatData = null;
var colorNames = Object.keys(window.chartColors);
var total_occurrences = 0;
var temp_total = 0;
var years = [];
var temp_data = {};
var name;
var raw_data = {};
var temp = {};
var myChart;
var min = 0;
var max = 0;



function loadGraph(raw_data, term, k){
    // sort k-num

    var data_map = new Map();

    JSON.parse(raw_data, function(key, value) {
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


    var ctx = document.getElementById('myChart').getContext('2d');
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
                text: "Results for " + term.toUpperCase(),
                fontSize: 25
            },

            legend: {
                position: "top"
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
    myChart = new Chart(ctx, config);
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toLowerCase();
    const k = parseInt(urlParams.get('k'));
    //console.log(search_term);
    var config = {
        apiKey: "AIzaSyBXViFaFbggSb0QqB1QwmAtuE3XO545NF0",
        authDomain: "junior-design-project.firebaseapp.com",
        databaseURL: "https://junior-design-project.firebaseio.com",
        projectId: "junior-design-project",
        storageBucket: "junior-design-project.appspot.com",
        messagingSenderId: "986723685667"
    };
    firebase.initializeApp(config);
    var database = firebase.database();


    database.ref('/').orderByChild('sorting_name').equalTo(search_term).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var cat_counts = JSON.parse(child.val()['fields'].replaceAll("'", '"'));
            var occurrences = child.val()['occurrences'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(occurrences, function(key, value) {
                if (key) {
                    labels.push(parseInt(key));
                    nums.push(parseInt(value));
                }
            });
            min = labels[0];
            max = labels[labels.length - 1];

            raw_data = child.val()['fields'].replaceAll("'", '"');
            total_occurrences = parseInt(child.val()['num_total']);
            yearlyCatData = JSON.parse(child.val()['fields_by_year'].replaceAll("'", '"'));
            if (yearlyCatData != null) {

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
                    option.text = i + 1;
                    option.value = i + 1;
                    k_select.add(option);
                }
                $("#k-select").val(k);


            }
            name = child.val()['name'];
            loadGraph(raw_data, name, k);
        });
    });



    document.getElementById('process-button').addEventListener('click', function() {
        var startYear = parseInt(document.getElementById("start-year-select").value);
        var endYear = parseInt(document.getElementById("end-year-select").value);
        var k_selected = parseInt(document.getElementById("k-select").value);
        temp_data = {};
        temp = {};
        temp_total = 0;
        Object.keys(yearlyCatData).forEach(function (key) {
            if (parseInt(key) >= startYear && parseInt(key) <= endYear) {
                temp = (yearlyCatData[key]);
                putData(temp);
            }
        });

        updateGraph(temp_data, name, k_selected);
    });

};

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



function updateGraph(temp_data, term, k){
    // sort k-num
    if (myChart) {
        myChart.destroy();
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


    var ctx = document.getElementById('myChart').getContext('2d');
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
                position: "top"
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
    myChart = new Chart(ctx, config);

}