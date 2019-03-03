String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function loadGraph(data_labels, data_content, term){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',

        // Dataset to display
        data: {
            labels: data_labels,
            datasets: [{
                data: data_content,
                borderColor: [
                    "red",
                    "green",
                    "blue",
                    ],
                backgroundColor: [
                    "pink",
                    "lightgreen",
                    "lightblue",
                    ]
            }]
        },

        // Configuration options go here
        options: {
            // responsive: false,
            title: {
                display: true,
                text: "Results for " + term,
                fontSize: 24
            }
        }
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search');
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
    database.ref('/').orderByChild('name').equalTo(search_term).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var raw_data = child.val()['fields'].replaceAll("'", '"');
            var labels = [];
            var nums = [];
            JSON.parse(raw_data, function(key, value) {
                if (key) {
                    labels.push(key);
                    nums.push(value);
                }
            });
            loadGraph(labels, nums, search_term);
        });
    });
};