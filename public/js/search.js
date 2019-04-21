var names = [];
var firstClick = 1;

window.onload = function() {
    var config = {
        apiKey: "AIzaSyB-Hrepj-ywDEoUIao6sVrH0UykxvcuXuw",
        authDomain: "space-force-dinos.firebaseapp.com",
        databaseURL: "https://space-force-dinos.firebaseio.com",
        projectId: "space-force-dinos",
        storageBucket: "space-force-dinos.appspot.com",
        messagingSenderId: "590463825386"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    database.ref('/term_names').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            a = childSnapshot.val();
            dataPush(a);
        });
    });
};

function dataPush(term) {
    names.push(term.toString().toLowerCase());
}

$(document).ready(function(){
    $(function(){
        $(".search-field").autocomplete({
            source: names
        });
    });
});

$(function searchFocusHandlers() {
    $('.search-field').on("focus", function () {
        if (firstClick === 1) {
            firstClick = 0;
            $(".search-field").addClass('active');
            $(".search-icon").addClass('active');
        }
    });
});

function validate() {
    var search = $('.search-field');
    var in_array = jQuery.inArray(search.val().toLowerCase(), names);
    if (in_array === -1) {
        search.css({"border": "2px solid red"});
        $('.alert-div').addClass('alert-shown');
        return false;
    }
    return true;
}
