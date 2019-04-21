// Database config
var config = {
    apiKey: "AIzaSyB-Hrepj-ywDEoUIao6sVrH0UykxvcuXuw",
    authDomain: "space-force-dinos.firebaseapp.com",
    databaseURL: "https://space-force-dinos.firebaseio.com",
    projectId: "space-force-dinos",
    storageBucket: "space-force-dinos.appspot.com",
    messagingSenderId: "590463825386"
};
firebase.initializeApp(config);
Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 30;
};

const urlParams = new URLSearchParams(window.location.search);
const search_term = urlParams.get('search').toLowerCase();
const k = urlParams.get('k');
currentK = parseInt(k);

// Load database
var database = firebase.database();
database.ref('/fields/' + search_term).once('value').then(function(snapshot) {
    var occurrences = JSON.parse(snapshot.val()['by_year'].replaceAll("'", '"'));
    var years = [];
    Object.keys(occurrences).sort().forEach(function(key) {
        years.push(parseInt(key));
    });

    var total = JSON.parse(snapshot.val()['total'].replaceAll("'", '"'));
    var totalk = 0;
    Object.keys(total).sort().forEach(function(key) {
        $("#subfield-select").append('<option value="' + key + '">' + key + '</option>');
        totalk++;
    });

    // Set initial values
    $('.year-range-selectors').attr('max', years[years.length - 1]);
    $('.year-range-selectors').attr('min', years[0]);
    $('#start-year-txt').val(years[0].toString());
    $('#end-year-txt').val(years[years.length - 1].toString());
    $('#end-year').val(years[years.length - 1]);

    $('#k-select').attr('max', totalk);
    $('#k-select').attr('min', 0);
    $('#k-select-txt').val(currentK);
    $('#k-select').val(currentK);
});
    
// Raise onchange events every time a range slider is changed
$('input[type=range]').on('input', function () {
    $(this).trigger('change', ["input"]);
});

// Select subfield events
$('#subfield-add').on('click', function(e) {
    addToFields();
    updateFilter();
});

// K select events
$('#k-select-txt')  .on('change', function(e, param) {
    updateRangeInput(this.value, 'k-select');
    updateFilter();
});
$('#k-select')      .on('change', function(e, param) {
    updateTextInput(this.value, 'k-select-txt');
    // If mouse up, always update query
    if(!param) {
        updateKQuery(this.value);
        updateFilter();
    }
});

// End year events
$('#end-year-txt')  .on('change', function(e, param) {
    updateRangeInput(this.value, 'end-year');
    updateFilter();
});
$('#end-year')      .on('change', function(e, param) {
    updateTextInput(this.value, 'end-year-txt');
    if(!param) updateFilter();
});

// Start year events
$('#start-year-txt').on('change', function(e, param) {
    updateRangeInput(this.value, 'start-year');
    updateFilter();
});
$('#start-year')    .on('change', function(e, param) {
    updateTextInput(this.value, 'start-year-txt');
    if(!param) updateFilter();
});

// Graph select events
$('#graph-select > .btn').on('mouseup', function() {
    setTimeout(function(){
        updateFilter();
    }, 40);
});

// Updates URL string to include the ?...&k=x part
function updateKQuery(k) {
    history.replaceState(null, "SDP | Data",
        updateQueryStringParameter(document.location.href, "k", k));
}

// Redraws the graph based on the updated filters
var currentFilter = 'Amplitude';
function updateFilter() {
    var filters = {
        graph: $('#graph-select > .btn.active').text().trim(),
        startYear: $('#start-year').val(),
        endYear: $('#end-year').val(),
        k: $('#k-select').val(),
        subfields: $('#subfields li').map(function(){
           return $.trim($(this).attr('data-value'));
        }).get()
    }
    // TODO add logic to update chart js graph here
    console.log(filters);
    const search_term = urlParams.get('search').toLowerCase();

    // Switch out graph types
    if (filters.graph !== currentFilter) {
        switch (filters.graph) {
            case 'Amplitude':
                loadGraphAmp(search_term, filters.k, dateGlobal);
                break;
            case 'Map':
                 drawMap();
                break;
        }
        currentFilter = filters.graph;
    } else {
        // TODO simply redraw existing graph
    }
}

// Throttled function to update the query string (needed to bypass History
// API rate limiting in Chrome/Safari)
var updateQueryThrottle = throttle(function(val) {
    updateKQuery(val);
}, 400);

// Updates text inputs corresponding to range input (called from range)
function updateTextInput(val, id) {
    switch(id) {
        case "end-year-txt":
            if (parseInt(val) <= parseInt($('#start-year').val())) {
                $('#' + id).val(parseInt($('#start-year').val()) + 1); 
                $('#end-year').val(parseInt($('#start-year').val()) + 1);
            } else {
                $('#' + id).val(val); 
            }
            break;
        case "start-year-txt":
            if (parseInt(val) >= parseInt($('#end-year').val())) {
                $('#' + id).val(parseInt($('#end-year').val()) - 1); 
                $('#start-year').val(parseInt($('#end-year').val()) - 1);
            } else {
                $('#' + id).val(val); 
            }
            break;
        case "k-select-txt":
            updateQueryThrottle(val);
            $('#' + id).val(val); 
    }
}

// Updates range inputs corresponding to text input (called from text)
function updateRangeInput(val, id) {
    var flag = false;
    var textBox = $('#' + id + '-txt');
    var rangeBox = $('#' + id);

    switch(id) {
        case "end-year":
            if (parseInt(val) <= parseInt($('#start-year').val())) {
                textBox.val(parseInt($('#start-year').val()) + 1); 
                rangeBox.val(parseInt($('#start-year').val()) + 1);
                flag = true;
            }
            break;
        case "start-year":
            if (parseInt(val) >= parseInt($('#end-year').val())) {
                textBox.val(parseInt($('#end-year').val()) - 1); 
                rangeBox.val(parseInt($('#end-year').val()) - 1);
                flag = true;
            } 
            break;
        case "k-select":
            // Add updates query to window.location
            updateKQuery(val);
            break;
    }

    if (!flag) {
        if (parseInt(val) < parseInt(rangeBox.attr("min"))) {
            val = rangeBox.attr("min");
        } 

        if (parseInt(val) > parseInt(rangeBox.attr("max"))) {
            val = rangeBox.attr("max");
        }

        textBox.val(val);
        rangeBox.val(val);
    }
}

// Removves a field from the subfields selection control
function removeField(value) {
    $('#subfields li').filter(function() {
        return $(this).attr('data-value') === value;
    }).remove(); 
    $("#subfield-select").append('<option value="' + value + '">' + value + '</option>');
    updateFilter();

    var oldVal = $("#subfield-select").val();
    $("#subfield-select").html($("#subfield-select option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
    }));
    $("#subfield-select").val(oldVal);
}

// Adds the selected field to the subfields selections list
function addToFields() {
    var value = $("#subfield-select").val();
    if (value === null || value.trim() === '') return;
    $("#subfield-select :selected").remove();
    $("#subfields").append('<li data-value="'
        + value.trim() + '"><button onclick="removeField(\''
        + value.trim() + '\');"><i class="fas fa-times"></i></button><span>'
        + value.trim() + '</span></li>');
}

// Utility function to update a query string value in a URL
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

// Utility function that returns function that can only be executed so many
// times within the given time interval
function throttle(func, interval) {
    var lastCall = 0;
    return function() {
        var now = Date.now();
        if (lastCall + interval < now) {
            lastCall = now;
            return func.apply(this, arguments);
        }
    };
}
