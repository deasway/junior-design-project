String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function loadGraph(data_labels, data_content, term){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx, {
        type: 'line',

        // Dataset to display
        data: {
            labels: data_labels,
            datasets: [{
                label: "Occurrences",
                lineTension: 0,
                spanGaps: true,
                data: data_content,
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
            // responsive: false,
            legend: {
                display: false
            },
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 10,
                    borderWidth: 3,
                    hoverRadius: 8,
                }
            }
        }
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toLowerCase();
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
    var search_term2 = search_term.charAt(0).toUpperCase() + search_term.substr(1);
    database.ref('/').orderByChild('name').equalTo(search_term).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var raw_data = child.val()['occurences'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(raw_data, function(key, value) {
                if (key) {
                    labels.push(key);
                    nums.push(value);
                }
            });
            loadGraph(labels, nums, search_term.toUpperCase());
        });
    });
    database.ref('/').orderByChild('name').equalTo(search_term.toUpperCase()).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var raw_data = child.val()['occurences'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(raw_data, function(key, value) {
                if (key) {
                    labels.push(key);
                    nums.push(value);
                }
            });
            loadGraph(labels, nums, search_term.toUpperCase());
        });
    });

    database.ref('/').orderByChild('name').equalTo(search_term2).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var raw_data = child.val()['occurences'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(raw_data, function(key, value) {
                if (key) {
                    labels.push(key);
                    nums.push(value);
                }
            });
            loadGraph(labels, nums, search_term.toUpperCase());
        });
    });













};