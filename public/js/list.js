var seen = new Set();
var jsonUrl = "https://deasway.github.io/junior-design-project/public/js/resources/term_names/term_names.json";

$.getJSON(jsonUrl, function(terms) {
    var toc = document.getElementById('category-page-members');
    for (i in terms) {
        var term = i;
        var firstChar = i.charAt(0).toUpperCase();
        var submitLink = 'data.html?search=' + term + '&k=0';
        if (!seen.has(firstChar)) {
            seen.add(firstChar);
                
            var wrapper = document.createElement('div');
            wrapper.className = 'category-page-wrapper';
            
            new_heading = document.createElement('div');
            new_heading.className = 'category-page-first-char';
            new_heading.innerText = firstChar;
            wrapper.appendChild(new_heading);

            new_list = document.createElement('ul');
            new_list.className = 'category-page-members-for-char';
            new_list.id = firstChar;

            new_entry = document.createElement('li');
            new_entry.className = 'category-page-member';

            new_link = document.createElement('a');
            new_link.href = submitLink;
            new_link.title = terms[i];
            new_link.innerText = terms[i];

            new_entry.appendChild(new_link);
            new_list.appendChild(new_entry);
            wrapper.appendChild(new_list);
            toc.appendChild(wrapper);
        } else {
            new_entry = document.createElement('li');

            new_link = document.createElement('a');
            new_link.href = submitLink;
            new_link.title = terms[i];
            new_link.innerText = terms[i];
            new_entry.appendChild(new_link);
            new_list.appendChild(new_entry);
            document.getElementById(firstChar).childNodes[0].appendChild(new_entry);
        }
    }
});

$.fn.exists = function () {
    return this.length !== 0;
}

function filter(string) {
    // Iterates through all categories
    $('div.category-page-wrapper').each(function() {
        var anyDisplay = false;
        var wrapper = $(this);
        wrapper.find('a').each(function() {
            var thisObj = $(this);
            var displays = thisObj.text().toLowerCase().indexOf(string) > -1;
            if (!anyDisplay && displays) anyDisplay = true;
            thisObj.toggle(displays);
        });
        wrapper.toggle(anyDisplay);
    });
}

$(function() {
    $('#search').on('input', function(e) {
        filter($(this).val());
    });
    $("#search-form").submit(function(e){
        e.preventDefault();
    });
});
