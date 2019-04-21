
// copying python's replaceAll string function
String.prototype.replaceAll = function(s, r) {
    var target = this;
    return target.split(s).join(r);
}

var database = firebase.database();




// User story 1: as a developer, I want to get the number of occurences in 2008 for the term 'aeorcar'

// refer to the firebase to get the links to put inside ref
var demo1 = database.ref('1/occurences').once('value').then(function(snapshot) {
    
    //snapshot.val() returns a string which is the value you find when going to the link in ref
    // below i conver the string to json
    value = snapshot.val();
    value = value.replaceAll("'",'"');
    occurences = JSON.parse(value);
    
    
    console.log(occurences);
    console.log(occurences['2008']);
});

// User story 2: as a developer, I want to get the breakdown of appearances for the term aerocar in different fields of science
var demo2 = database.ref('1/fields').once('value').then(function(snapshot) {  
    value = snapshot.val();
    value = value.replaceAll("'",'"');
    occurences = JSON.parse(value);
    console.log(occurences);
});

// User story 3: as a developer, I want to get the date of entry of the word "astrogate" in both the English language and science fiction
var demo = database.ref('29/').once('value').then(function(snapshot) {
    
    // if snapshot.val is an entry instead of an attribute, you can access the attributes as follows
    console.log(snapshot.val().oxford);
    console.log(snapshot.val().first_date);
});

// TODO:
// User story 4: as a developer, I want to get, for each year in [1990, 1985], the number of appearrances for each year for the term "artificial intelligence" (28)

// User story 5: as a developer, I want to get the total number of appearances in all of research for the term "flitter" (200)