let myChart;
let bargraph;

$(document).ready(function() {
    $.ajax({
        url: "/getEvents",
    }).then(function (data, status, jqxhr) {
        var select = document.getElementById("events");
        const poggers = JSON.parse(jqxhr.responseText);
        for (i = 0; i < poggers.words.length; i++) {
            var option = document.createElement("option");
            option.text = poggers.words[i];
            select.add(option);

        }
        var select = document.getElementById("year");

        for(i = 2021; i > 2003; i--) {
            var option = document.createElement("option");
            option.text = i;
            select.add(option);

        }

        var select = document.getElementById("region");


        for(i = 1; i <= 6; i++) {
            var option = document.createElement("option");
            option.text = i + "A";
            select.add(option);
        }
    });
});
function yourName() {
    $.ajax({
        url: "/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var sized = ["D","R","S"];
        var type = document.getElementById("type").selectedIndex;
        var loopers = [32,4,1];
        var max = loopers[type];
        var select = document.getElementById("events");
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var year = document.getElementById("year").value;
        var uilregion = document.getElementById("region").value;
        var district = document.getElementById("district").value;

        var statewide = document.getElementById("czech").checked;
        var getOnly = document.getElementById("getonly").checked;
        var buildatable = [];
        var async_request=[];
        const rl  = "/getScore?subject=" + event + "&year="+year + "&region=" + district + "&conf=" + uilregion + "&district=" + sized[type];

        $.ajax({
            url: rl
        }).then(function(data, status, jqxhr) {

            var first = document.getElementById("fname").value
            var last = document.getElementById("lname").value
            var name = last + ", " + first;
            const poggers = JSON.parse(jqxhr.responseText);
            var i = 0;
            var person;
            poggers.people.pop();
            while(i < poggers.people.length) {
                if(poggers.people[i].name.valueOf() == name.valueOf()) {
                    person = (poggers.people[i]);
                    break;
                }
                i++;
            }
            var doc = document.getElementById("results");
            if(doc != undefined) {
                doc.remove();
            }
            var table = document.createElement("table")
            table.id = "results";
            createTable(poggers, table);

        });
    });

}

function generatesums(array) {
    let ret = []
    for(i = 0; i < array.length; i++) {
        var tot = 0;
        for(x = 0; x < array[i].scores.length; x++) {
            tot += array[i].scores[x];
        }
        ret.push({
            "x": array[i].year,
            "y": tot/array[i].scores.length
        });
    }
    return ret;
}
function combine(array) {
    let ret = [];
    for(i = 0; i < array.length; i++) {
        ret.concat(array[i].scores);
    }
    return ret;
}
function sortTwoArrays(arr1, arr2) {
    let n = arr1.length;
    for(i = 0; i < n-1; i++) {
        let min = i;
        for(j = i+1; j < n; j++) {
            if(arr1[j] > arr1[min]) {
                min = j;
            }
        }
        let tmp1 = arr1[min];
        arr1[min] = arr1[i];
        arr1[i] = tmp1;

        let tmp2 = arr2[min];
        arr2[min] = arr2[i];
        arr2[i] = tmp2;

    }
}
function scrollToName() {
    var elmnt = document.getElementById("thename");
    elmnt.scrollIntoView();
}

function getAllScoresForAllSchoolsAllTime() {
    $.ajax({
        url: "/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var select = document.getElementById("events");
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var sized = ["D","R","S"];
        var loopers = [32,4,1];
        var max = loopers[type];
        var type = document.getElementById("type").selectedIndex;
        var tables = []
        var async_request=[];

        for(yeardd = 2004; yeardd <= new Date().getFullYear(); yeardd++) {
            var buildatable = [];
            for(x = 0; x <= 6; x++) {
                var reggie = x + "A";

                for (i = 1; i <= max; i++) {
                    async_request.push($.ajax({
                        url: "/getScore?subject=" + event + "&year=" + year + "&region=" + i + "&conf=" + reggie + "&district=" + sized[type], // your url
                        method: 'GET', // method GET or POST
                        success: function (data, status, jqxhr) {
                            var json = JSON.parse(data)
                            buildatable.push({"x": yeardd, "y": parseInt(json.score)});
                        }
                    }));
                }
            }
            tables.push({
                "year": yeardd,
                "scores": buildatable
            });

        }
        $.when.apply(null, async_request).done( function() {

            makeLine(tables);
        });
});
}
function getAllSchoolsAndSort() {
    $.ajax({
        url: "/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var sized = ["D","R","S"];
        var type = document.getElementById("type").selectedIndex;
        var loopers = [32,4,1];
        var max = loopers[type];
        var select = document.getElementById("events");
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var year = document.getElementById("year").value;
        var uilregion = document.getElementById("region").value;
        var district = document.getElementById("district").value;

        var statewide = document.getElementById("czech").checked;
        var getOnly = document.getElementById("getonly").checked;
        var buildatable = [];
        var async_request=[];
        if(statewide) {
            for(x = 0; x <= 6; x++) {
                var reggie = x + "A";
                for (i = 1; i <= max; i++) {
                    async_request.push($.ajax({
                        url: "/getScore?subject=" + event + "&year=" + year + "&region=" + i + "&conf=" + reggie + "&district=" + sized[type], // your url
                        method: 'GET', // method GET or POST
                        success: function (data, status, jqxhr) {
                            var json = JSON.parse(data)
                            buildatable.push(json);
                        }
                    }));
                }
            }
        }
        else {
            var i = 1;
            if(getOnly) {
                i = 1+8*(district-1);
                max = i+7;
            }

            for(i; i <= max; i++) {
                async_request.push($.ajax({
                    url:"/getScore?subject=" + event + "&year="+year + "&region=" + i + "&conf=" + uilregion + "&district=" + sized[type] , // your url
                    method:'GET', // method GET or POST
                    success: function(data, status, jqxhr){
                        buildatable.push(JSON.parse(data));
                    }
                }));
            }
        }

        $.when.apply(null, async_request).done( function(){
            var combined = [];
            for(i = 0; i < buildatable.length; i++) {
                buildatable[i].people.pop();
                combined = combined.concat(buildatable[i].people);
            }
            // all done
            combined.sort(function (a,b) {
                return b.score-a.score;
            })
            var dir = 0;

            for(i = 0; i < combined.length; i++) {
                if(combined[i].name == lname+", "+fname) {
                    dir = i;
                }
            }
            document.getElementById("results").remove();
            var table = document.createElement("table")
            table.id = "results";

            var header = table.createTHead();
            var row = header.insertRow(0);

            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Place</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Name</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Score</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>School</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Skill</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Percent</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Conference</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>District</b>";
            table.append(cell)
            numbs = [];
            labls = [];

                for (i = 0; i < combined.length; i++) {
                    var row = document.createElement("tr")
                    var place = row.insertCell();
                    if(dir === i) {
                        row.style.color = "white";
                        row.style.backgroundColor = "red";
                        row.id = "thename";
                    }
                    place.innerHTML = (i+1);
                    var name = row.insertCell();
                    name.innerHTML = (combined[i].name);
                    var score = row.insertCell();
                    score.innerHTML = (combined[i].score);
                    var school = row.insertCell();
                    school.innerHTML = (combined[i].school);
                    var pointoff = row.insertCell();
                    pointoff.innerHTML = (combined[i].score - combined[dir].score);
                    var percent = row.insertCell();
                    percent.innerHTML =  ((combined[i].score / combined[dir].score)*100).toFixed(2) + "%";
                    var conf = row.insertCell();
                    conf.innerHTML =  combined[i].region;
                    var reg = row.insertCell();
                    reg.innerHTML =  combined[i].district;

                    row.append(place);
                    row.append(name);
                    row.append(score);
                    row.append(school);
                    row.append(pointoff);
                    row.append(percent);
                    row.append(conf);
                    row.append(reg);

                    table.append(row)
                    document.getElementById("tableholder").appendChild(table);
                    numbs.push(combined[i].score);
                    labls.push(combined[i].name)
                }
            addChart(numbs,labls,undefined)
            generateScoreTable(combined)


        });

    });

}
function createTable(poggers, table) {
    numbs = [];
    labls = [];
    var header = table.createTHead();
// Create an empty <tr> element and add it to the first position of <thead>:
    var row = header.insertRow(0);

// Insert a new cell (<td>) at the first position of the "new" <tr> element:
    var cell = row.insertCell(0);

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Place</b>";
    table.append(cell)
    // Insert a new cell (<td>) at the first position of the "new" <tr> element:
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Name</b>";
    table.append(cell)
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Score</b>";
    table.append(cell)
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>School</b>";
    table.append(cell)
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Skill</b>";
    table.append(cell)
    for (i = 0; i < poggers.people.length; i++) {
        var row = document.createElement("tr")
        var place = row.insertCell();
        place.innerHTML = (poggers.people[i].place);
        var name = row.insertCell();
        name.innerHTML = (poggers.people[i].name);
        var score = row.insertCell();
        score.innerHTML = (poggers.people[i].score);
        var school = row.insertCell();
        school.innerHTML = (poggers.people[i].school);
        var pointoff = row.insertCell();
        pointoff.innerHTML = (poggers.people[i].score - poggers.people[0].score);

        row.append(place);
        row.append(name);
        row.append(score);
        row.append(school);
        row.append(pointoff);

        table.append(row)
        document.getElementById("tableholder").appendChild(table);
        numbs.push(poggers.people[i].score);
        labls.push(poggers.people[i].name)
    }
    generateScoreTable(poggers.people);
    addChart(numbs,labls,undefined)

}

function generateScoreTable(people) {
    if(document.getElementById("teamtable") != null) {
        document.getElementById("teamtable").remove();
    }
    var table = document.createElement("table")
    table.id = "teamtable";
    var header = table.createTHead();
// Create an empty <tr> element and add it to the first position of <thead>:
    var row = header.insertRow(0);

// Insert a new cell (<td>) at the first position of the "new" <tr> element:
    var cell = row.insertCell(0);

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Place</b>";
    table.append(cell)
    // Insert a new cell (<td>) at the first position of the "new" <tr> element:
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>School</b>";
    table.append(cell)
    var cell = row.insertCell();

// Add some bold text in the new cell:
    cell.innerHTML = "<b>Score</b>";
    table.append(cell)
    const map1 = new Map();
    for (i = 0; i < people.length; i++) {
        if(map1.get(people[i].school) === undefined) {
            map1.set(people[i].school, 0);
        }

        map1.set(people[i].school, map1.get(people[i].school) + parseInt(people[i].score));
    }
    var keyz = Array.from(map1.keys());
    var values = Array.from(map1.values());

    sortTwoArrays(values, keyz);

    for (i = 0; i < keyz.length; i++) {
        var row = document.createElement("tr")
        var place = row.insertCell();
        place.innerHTML = (i+1);
        var name = row.insertCell();
        name.innerHTML = (keyz[i]);
        var score = row.insertCell();
        score.innerHTML = (values[i]);

        row.append(place);
        row.append(name);
        row.append(score);
        table.append(row)
        document.getElementById("tableholder").appendChild(table);
    }


}

//It's been so long since I've written this code that I legitimately have no idea what it does anymore.
/**
function getIndividualScore() {
    $.ajax({
        url: "/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var select = document.getElementById("events");
        var sized = ["D", "R", "S"];
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var type = document.getElementById("type").selectedIndex;
        var year = document.getElementById("year").value;
        var region = document.getElementById("region").value;
        var district = document.getElementById("district").value;
        var buildatable = [];
        var async_request=[];
        var fname = document.getElementById("fname").value
        var lname = document.getElementById("lname").value

        for(i = 2004; i <= 2022; i++) {
            async_request.push($.ajax({
                url:"/getScore?subject=" + event + "&year="+i + "&region=" + district + "&conf=" + region + "&district=" + sized[type] , // your url
                method:'GET', // method GET or POST
                success: function(data, status, jqxhr){
                    buildatable.push(JSON.parse(data));
                }
            }));
        }
        $.when.apply(null, async_request).done(function() {
            var combined = [];
            for(i = 0; i < buildatable.length; i++) {
                combined = combined.concat(buildatable[i].people);
            }
            // all done
            combined.sort(function (a,b) {
                return b.score-a.score;
            })
            var dir = 0;
            var me = []
            var y = 0;
            for(i = 0; i < combined.length; i++) {
                if(combined[i].name == (lname + ", " + fname)) {
                    console.log(i)
                    me[y] = combined[i];
                    y++;
                }
            }
            document.getElementById("results").remove();
            var table = document.createElement("table")
            table.id = "results";

            var header = table.createTHead();
            var row = header.insertRow(0);

            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Place</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Name</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Score</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>School</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Skill</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Percent</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Conference</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>District</b>";
            table.append(cell)

            for (i = 0; i < me.length; i++) {
                var row = document.createElement("tr")
                var place = row.insertCell();
                if(dir === i) {
                    row.style.color = "white";
                    row.style.backgroundColor = "red";
                    row.id = "thename";
                }
                place.innerHTML = (i+1);
                var name = row.insertCell();
                name.innerHTML = (me[i].name);
                var score = row.insertCell();
                score.innerHTML = (me[i].score);
                var school = row.insertCell();
                school.innerHTML = (me[i].school);
                var pointoff = row.insertCell();
                pointoff.innerHTML = (me[i].score - me[dir].score);
                var percent = row.insertCell();
                percent.innerHTML =  ((me[i].score / me[dir].score)*100).toFixed(2) + "%";
                var conf = row.insertCell();
                conf.innerHTML =  me[i].region;
                var reg = row.insertCell();
                reg.innerHTML =  me[i].district;

                row.append(place);
                row.append(name);
                row.append(score);
                row.append(school);
                row.append(pointoff);
                row.append(percent);
                row.append(conf);
                row.append(reg);

                table.append(row)
                document.body.appendChild(table);
            }

        });
    });
}
 **/

function getAllScoreforIndividual(updateChart) {
    $.ajax({
        url: "/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var sized = ["D","R","S"];
        var type = document.getElementById("type").selectedIndex;
        var loopers = [32,4,1];
        var max = loopers[type];
        var select = document.getElementById("events");
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var year = document.getElementById("year").value;
        var uilregion = document.getElementById("region").value;
        var district = document.getElementById("district").value;

        var statewide = document.getElementById("czech").checked;
        var getOnly = document.getElementById("getonly").checked;
        var buildatable = [];
        var async_request=[];
        for(var x = 0; x < poggers.events.length; x++) {
            const rl  = "/getScore?subject=" + poggers.events[x] + "&year="+year + "&region=" + district + "&conf=" + uilregion + "&district=" + sized[type];
            async_request.push($.ajax({
                    url: rl, // your url
                    method: 'GET', // method GET or POST
                    success: function (data, status, jqxhr) {
                        buildatable.push(JSON.parse(data));
                    }
                }));
        }
        $.when.apply(null, async_request).done(function() {
            var combined = [];
            for(i = 0; i < buildatable.length; i++) {
                buildatable[i].people.pop();
                combined = combined.concat(buildatable[i].people);
            }
            // all done
            combined.sort(function (a,b) {
                return b.score-a.score;
            })
            var dir = 0;
            var me = []
            var y = 0;
            for(i = 0; i < combined.length; i++) {
                if(combined[i].name === (lname + ", " + fname)) {
                    me[y] = combined[i];
                    y++;
                }
            }
            var doc = document.getElementById("results");
            if(doc != undefined) {
                doc.remove();
            }
            var table = document.createElement("table")
            table.id = "results";

            var header = table.createTHead();
            var row = header.insertRow(0);

            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Place</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Name</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Score</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>School</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Skill</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Percent</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Conference</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>District</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Event</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Year</b>";
            table.append(cell)
            numbs = [];
            labls = [];
            for (i = 0; i < me.length; i++) {
                var row = document.createElement("tr")
                var place = row.insertCell();
                if(dir === i) {
                    row.style.color = "white";
                    row.style.backgroundColor = "red";
                    row.id = "thename";
                }
                place.innerHTML = (i+1);
                var name = row.insertCell();
                name.innerHTML = (me[i].name);
                var score = row.insertCell();
                score.innerHTML = (me[i].score);
                var school = row.insertCell();
                school.innerHTML = (me[i].school);
                var pointoff = row.insertCell();
                pointoff.innerHTML = (me[i].score - me[dir].score);
                var percent = row.insertCell();
                percent.innerHTML =  ((me[i].score / me[dir].score)*100).toFixed(2) + "%";
                var conf = row.insertCell();
                conf.innerHTML =  me[i].region;
                var reg = row.insertCell();
                reg.innerHTML =  me[i].district;
                var event = row.insertCell();
                event.innerHTML =  me[i].event;
                var year = row.insertCell();
                year.innerHTML =  me[i].year;

                row.append(place);
                row.append(name);
                row.append(score);
                row.append(school);
                row.append(pointoff);
                row.append(percent);
                row.append(conf);
                row.append(reg);
                row.append(event);
                row.append(year);

                table.append(row)
                document.getElementById("tableholder").appendChild(table);
                numbs.push(me[i].score);
                labls.push(me[i].event)
            }
            generateScoreTable(me)
            addChart(numbs,labls,undefined)

        });
    });
}



function onChangeReg() {
    var sized = [32,4,1];
    var val = document.getElementById("type");
    document.getElementById("district").setAttribute("max", sized[val.selectedIndex]);
    document.getElementById("district").value = sized[val.selectedIndex];
}

function makeLine(deta) {
    let years = [];
    for(i = 2004; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }
    let sep = combine(deta);
    let avg = generatesums(deta)
    if(bargraph != undefined) {
        bargraph.destroy();
    }

    bargraph = new Chart(timeline, {
        data: {
            datasets: [{
                type: 'line',
                label: 'Average over time',
                data: avg
            }, {
                type: 'scatter',
                label: 'True scores',
                data: sep,
            }],
            labels: years
        },
        options: {
        responsive: false,
            plugins: {
            legend: {
                labels: {
                    color: '#FFFFFF',
                },
                position: 'top',
            },
            title: {
                display: true,
                    text: 'Score Results',
                    color: '#FFFFFF'
            }
        }
    },

});
}

function addChart(dete, labls, title) {
    let data = {
        labels: labls,
        datasets: [
            {
                label: 'Dataset 1',
                data: dete,
                backgroundColor: Object.values({
                    red: 'rgb(255, 99, 132)',
                    orange: 'rgb(255, 159, 64)',
                    yellow: 'rgb(255, 205, 86)',
                    green: 'rgb(75, 192, 192)',
                    blue: 'rgb(54, 162, 235)',
                    purple: 'rgb(153, 102, 255)',
                    grey: 'rgb(201, 203, 207)'
                }),
            }
        ]
    };
    if(myChart != undefined) {
        myChart.destroy();
    }
    myChart = new Chart(
        document.getElementById('myChart'),
        {
            type: 'pie',
            data: data,
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF',
                        },
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Score Results',
                        color: '#FFFFFF'
                    }
                }
            },
        }
    );

}