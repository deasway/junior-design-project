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
	grey: 'rgb(201, 203, 207)'
};
var colorNames = Object.keys(window.chartColors);
var total_occurrences = 0;

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
    console.log(config.data.datasets);
    var myChart = new Chart(ctx, config);
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
            var raw_data = child.val()['fields'].replaceAll("'", '"');
            total_occurrences = parseInt(child.val()['num_total']);
            loadGraph(raw_data, child.val()['name'], k);
        });
    });
};