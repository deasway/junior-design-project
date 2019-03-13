var names = [];

window.onload = function() {
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
    database.ref('/').orderByChild('name').on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            a = child.val()['name'];
            dataPush(a);
        });

    });
};

function dataPush(term) {
    //names = [];
    var a = "" + term;
    names.push(a.toLowerCase());
//    names.sort();
}

$( function() {
    names;
    $( "#myInput" ).autocomplete({
        source: names
    });
});


function validate() {
    names;
    var inpObj = (document.getElementById('myInput').value);
    var in_array = jQuery.inArray(inpObj.toLowerCase(), names);
    
    if (in_array == -1) {
        alert("No Result Found");
        document.getElementById("alert").innerHTML = "<span class='error'>No Matching Terms Found. Please Search Again.</span>";
        return false;
    }
    return true;
}



