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
    //names = [];
    var a = "" + term;
    names.push(a.toLowerCase());
}

$( function() {
    names;
    $( "#myInput" ).autocomplete({
        source: names
    });
});


$(function myFunction() {
    $('.search__field').on("focus", function () {
        if (firstClick == 1) {
            firstClick = 0;
            $(".search__field").css({"border": "2px solid #ccc", "border-radius" : "30px;", "width": "50vw", "color" : "#2b2b2b", "cursor" : "default"});
            $(".search__icon").css({"background-color": "transparent", "cursor": "pointer", "pointer-events": "auto"});
        }
    });
});



function validate() {
    names;
    var inpObj = (document.getElementById('myInput').value);
    var in_array = jQuery.inArray(inpObj.toLowerCase(), names);

    if (in_array == -1) {
        $('.search__field').css({"border": "2px solid red"});
        document.getElementById("alert").innerHTML = "<span class='error'>No Matching Terms Found. Please Search Again.</span>";

        //$(".search__icon").css({"background-color": "transparent", "cursor": "pointer", "pointer-events": "auto"});

        return false;
    }
    return true;
}



