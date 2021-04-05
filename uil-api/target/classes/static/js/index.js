$(document).ready(function() {
    $.ajax({
        url: "http://localhost:8080/getScore"
    }).then(function (data, status, jqxhr) {
        console.log(jqxhr);
        const poggers = JSON.parse(jqxhr.responseText);
        document.getElementById('name').innerHTML = ("My name is " + poggers.people[0].name);
        document.getElementById('score').innerHTML = ("My Computer Science score was " + poggers.people[0].score + "!");
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

            row.append(place);
            row.append(name);
            row.append(score);
            row.append(school);
            document.getElementById("results").append(row)
        }
    });
    $.ajax({
        url: "http://localhost:8080/getEvents"
    }).then(function (data, status, jqxhr) {
        var select = document.getElementById("events");
        const poggers = JSON.parse(jqxhr.responseText);
        for (i = 0; i < poggers.words.length; i++) {
            var option = document.createElement("option");
            option.text = poggers.words[i];
            select.add(option);

        }
    });
});
function yourName() {
    $.ajax({
        url: "http://localhost:8080/getEvents"
    }).then(function (data, status, jqxhr) {
        const poggers = JSON.parse(jqxhr.responseText);
        var select = document.getElementById("events");

        var event = poggers.events[poggers.words.indexOf(select.value)];
        console.log(event)
        $.ajax({
            url: "http://localhost:8080/getScore?subject=" + event
        }).then(function(data, status, jqxhr) {
            console.log(jqxhr);
            var first = document.getElementById("fname").value
            var last = document.getElementById("lname").value
            var name = last + ", " + first;
            const poggers = JSON.parse(jqxhr.responseText);
            var i = 0;
            var person;
            console.log(poggers.people.length)
            while(i < poggers.people.length) {
                if(poggers.people[i].name.valueOf() == name.valueOf()) {
                    person = (poggers.people[i]);
                    break;
                }
                i++;
            }
            document.getElementById('name').innerHTML = ("My name is: " + person.name);
            document.getElementById('score').innerHTML = ("My "+ select.value +" score was " + person.score + "!");
        });
    });
}