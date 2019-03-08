

var width = 600,
    height = 500,
    barHeight = height / 2 - 40;
var names = [];
var formatNumber = d3.format("s");
// var datamap = new Map();
// datamap.set("2015", "data/data2015.csv");
// datamap.set("2016", "data/data2016.csv");
// var selYear = "2016";
// function selectYear() {
//     selYear = document.getElementById("mySelect").value;
//     d3.select("svg").remove();
//     loadGraph();
// }

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const search_term = urlParams.get('search').toUpperCase();
    var title = document.getElementById("title");
    title.textContent += search_term;


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
             names.add(child.name);
        });
    });
};

$('#search').mdb_autocomplete({
data: names
});