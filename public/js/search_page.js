var names = [];
var seen = new Set();

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

// <a href="/wiki/Alice_Margatroid" title="Patchy" class="category-page__member-link">Patchy knows</a>
//    <div class="category-page__first-char">A</div>
//    <ul class="category-page__members-for-char">
//        <li class = "category-page__member">
//        </li>
//    </ul>

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

