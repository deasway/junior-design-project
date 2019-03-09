

var width = 600,
    height = 500,
    barHeight = height / 2 - 40;
var names = [];
//varformatNumber = d3.format("s");

/**
$('#form-autocomplete').mdb_autocomplete({
data: names
});
**/
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    //const search_term = urlParams.get('search').toLowerCase();
    //console.log(search_termc

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
    database.ref('/').orderByChild('name').on("value", function(snapshot, names) {
        snapshot.forEach(function(child) {
            a = child.val()['name'];
            dataPush(a);
        });
    });
};



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function dataPush(term) {
    //names = [];
    var a = "" + term;
    names.push(a.toLowerCase());
}

$(function() {
      $("#tags").autocomplete({
    source: names
  });
});
