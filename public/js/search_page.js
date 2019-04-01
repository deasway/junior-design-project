var names = [];
var seen = new Set();
var firstClick = 1;

window.onload = function() {
    var toc = document.getElementById("category-page__members-div");

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
    database.ref('/').orderByChild('sorting_name').on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            a = child.val()['name'];
            dataPush(a);
            let firstChar = a.charAt(0).toUpperCase();
            if (!seen.has(firstChar)) {
                seen.add(firstChar);
                new_heading = document.createElement("div");
                new_heading.className = "category-page__first-char";
                new_heading.innerText = firstChar;
                toc.appendChild(new_heading);

                new_list = document.createElement("ul");
                new_list.className = "category-page__members-for-char";
                new_list.id = "category-page__members-for-char-" + firstChar;

                new_entry = document.createElement("li");
                new_entry.className = "category-page__member";

                new_link = document.createElement("a");
                new_link.className = "category-page__member-link";
                new_link.href = "/graph.html?search=" + a + "&k=2";
                new_link.title = a;
                new_link.innerText = a;

                new_entry.appendChild(new_link);
                new_list.appendChild(new_entry);
                toc.appendChild(new_list);
            } else {
                new_entry = document.createElement("li");
                new_entry.className = "category-page__member";

                new_link = document.createElement("a");
                new_link.className = "category-page__member-link";
                new_link.href = "/graph.html?search=" + a + "&k=2";
                new_link.title = a;
                new_link.innerText = a;

                new_entry.appendChild(new_link);
                new_list.appendChild(new_entry);
                document.getElementById("category-page__members-for-char-" + firstChar).childNodes[0].appendChild(new_entry);
            }
        });
    });
    return;
}


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


$(function thisFunction() {

    $(".search").css({"position":"absolute","top":"15%","left": "50%", "-webkit-transform":"translateX(-50%) translateY(-50%)", "transform":"translateX(-50%) translateY(-50%)"});

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
        alert("No Result Found");
        $('.search__field').css({"border": "2px solid red"});
        document.getElementById("alert").innerHTML = "<span class='error'>No Matching Terms Found. Please Search Again.</span>";
        return false;
    }
    return true;
}

