$(document).ready(function() {
    $.ajax({
        url: "/getEvents"
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
        var select = document.getElementById("events");
        var sized = ["D","R","S"];
        var event = poggers.events[poggers.words.indexOf(select.value)];
        var type = document.getElementById("type").selectedIndex;
        var year = document.getElementById("year").value;
        var region = document.getElementById("region").value;
        var district = document.getElementById("district").value;

        $.ajax({
            url: "/getScore?subject=" + event + "&year="+year + "&region=" + district + "&conf=" + region + "&district=" + sized[type]
        }).then(function(data, status, jqxhr) {
            var first = document.getElementById("fname").value
            var last = document.getElementById("lname").value
            var name = last + ", " + first;
            const poggers = JSON.parse(jqxhr.responseText);
            var i = 0;
            var person;
            while(i < poggers.people.length) {
                if(poggers.people[i].name.valueOf() == name.valueOf()) {
                    person = (poggers.people[i]);
                    break;
                }
                i++;
            }
            document.getElementById("results").remove();
            var table = document.createElement("table")
            table.id = "results";
            createTable(poggers, table);

        });
    });

}
function scrollToName() {
    var elmnt = document.getElementById("thename");
    elmnt.scrollIntoView();
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
        var reg = document.getElementById("reg").value;

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
            console.log(getOnly)
            var i = 1;
            if(getOnly) {
                i = 1+8*(reg-1);
                max = i+7;
            }
            console.log("min: " + i + " max: " + max)

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
                combined = combined.concat(buildatable[i].people);
            }
            // all done
            console.log(lname+", "+fname)
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
                    document.body.appendChild(table);
                }

        });

    });

}
function createTable(poggers, table) {
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
        document.body.appendChild(table);
    }

}
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
function getAllScoreforIndividual() {
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
        for(var x = 0; x < poggers.events.length; x++) {
            console.log(poggers.events[x])
            for (i = 2004; i <= 2022; i++) {
                async_request.push($.ajax({
                    url: "/getScore?subject=" + poggers.events[x] + "&year=" + i + "&region=" + district + "&conf=" + region + "&district=" + sized[type], // your url
                    method: 'GET', // method GET or POST
                    success: function (data, status, jqxhr) {
                        buildatable.push(JSON.parse(data));
                    }
                }));
            }
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

            var cell = row.insertCell();
            cell.innerHTML = "<b>Event</b>";
            table.append(cell)

            var cell = row.insertCell();
            cell.innerHTML = "<b>Year</b>";
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
                document.body.appendChild(table);
            }

        });
    });
}




function onChangeReg() {
    var sized = [32,4,1];
    var val = document.getElementById("type");
    document.getElementById("district").setAttribute("max", sized[val.selectedIndex]);
    document.getElementById("district").value = sized[val.selectedIndex];
}