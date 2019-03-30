String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function loadGraph(raw_data, term, k){
    // sort k-num
//    var blacklist = ["ARTICLE", "PROCEEDINGS PAPER", "BOOK REVIEW", "REVIEW", "BOOK CHAPTER"];

    var data_map = new Map();

    JSON.parse(raw_data, function(key, value) {
        if (key && !blacklist.includes(key)) {
            data_map.set(key, value);
        }
    });

    // sort data
    data_map[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };

    var data_labels = [];
    var data_content = [];
    var total_other = 0;

    var i = 0;
    for (let [key, value] of data_map) {
        if (i < k) {
            data_labels.push(key);
            data_content.push(value);
            i++;
        } else {
            console.log(value);
            total_other += parseInt(value);
        }
    }

    data_labels.push("OTHER");
    data_content.push(total_other);

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
                    "orange",
                    "purple",
                    "black"
                ],
                backgroundColor: [
                    "pink",
                    "lightgreen",
                    "lightblue",
                    "#ffc966",
                    "#EE82EE",
                    "gray"
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
            },

            legend: {
                position: "top"
            }
        }
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toLowerCase();
    const k = urlParams.get('k');
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

    var search_term2 = search_term.charAt(0).toUpperCase() + search_term.substr(1);
    database.ref('/').orderByChild('name').equalTo(search_term).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            console.log(child.val()['name']);
            var raw_data = child.val()['fields'].replaceAll("'", '"');
            loadGraph(raw_data, search_term.toUpperCase(), k);
        });
    });
    database.ref('/').orderByChild('name').equalTo(search_term.toUpperCase()).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            console.log(child.val()['name']);
            var raw_data = child.val()['fields'].replaceAll("'", '"');
            loadGraph(raw_data, search_term.toUpperCase(), k);
        });
    });

    database.ref('/').orderByChild('name').equalTo(search_term2).on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            console.log(child.val()['name']);
            var raw_data = child.val()['fields'].replaceAll("'", '"');
            loadGraph(raw_data, search_term.toUpperCase(), k);
        });
    });
};