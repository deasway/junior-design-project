var dates = [];
var year = 2000;
dates.push(year);
for (i = 0; i < 9; i++) {
    year += 1;
    dates.push(year);
}


window.onload = function() {
    var chart = c3.generate({
    title: {
        text: "Number of Occurrences for 'Cloning'",
    },
    data: {
        x: 'x',
        
        columns: [
            ['x'].concat(dates),
            ['Number Of Occurrences', 30, 200, 100, 400, 150, 250, 70, 40, 60, 100],
        ]
    },
    axis: {
        x: {
            type: 'date'
        }
    }
        
    });

};







