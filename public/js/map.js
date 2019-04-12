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


/**

jQuery.validator.addMethod("search__field", function(value) {
    names;
    var in_array = $.inArray(value.toLowerCase(), names);
    if (in_array == -1) {
        console.log("nai");
        return false;
    }else{
        console.log("yea");
        return true;
    }
}, "No Result");


$("#search_form").validate();

function myFunction() {
    names;
    var inpObj = document.getElementById("search");
    console.log(inpObj);
    if (!inpObj.checkValidity()) {
        document.getElementById("demo").innerHTML = inpObj.validationMessage;
    } else {
        document.getElementById("demo").innerHTML = "Input OK";
    }
}

$('#search_form').validator().on('submit', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
    } else {
        // everything looks good!
    }
})
 **/

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
        alert("No Result Found");
        document.getElementById("alert2").innerHTML = "<span class='error'>No Matching Terms Found. Please Search Again.</span>";
        return false;
    }
    return true;
}

