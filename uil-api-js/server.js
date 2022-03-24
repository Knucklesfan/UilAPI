

const express = require('express');
const app = express();
const PORT = 80;
const cheerio = require('cheerio');
const person = require("./person.js");
const fs = require('fs')

const version = "2.0.0";

//HUGE COMMENT TO REMIND YOURSELF:

//USE JSDOM, CHEERIO IS A LOST CAUSE

//update: lmao just learn jquery moron
var request = require('request');


const args = process.argv.slice(2);
function sync(events, startyear, endyear) {
    console.log(events.events.length);
    var sized = ["D", "R", "S"];
    for (var year = startyear; year <= endyear; year++) {
        for (var conf = 1; conf <= 6; conf++) {
            for (var district = 1; district <= 32; district++) {
                for (var a = 0; a < 3; a++) {
                    for (var b = 1; b < events.events.length; b++) {
                        console.log("Parsing scores for " + events.events[b] + " for District " + district + " on Conference " + conf + "A from the year " + year + " at the " + sized[a] + " event type.")
                        let req = new Object();
                        req.query = new Object();
                        req.query.subject = events.events[b];
                        req.query.region = district;
                        req.query.conf = conf + "A";
                        req.query.year = year;
                        req.query.district = sized[a];
                        getScore(req, true);
                    }
                }
            }
        }

    }
}
if(args[0] == "-S" || args[0] == "--sync") {
    console.log("Beginning Sync.. This could take a while, sorry UIL Servers!");
    getEvents(sync, parseInt(args[1]), parseInt(args[2]));
}
if(args[0] == "-v" || args[0] == "--version") {
    console.log("UIL-API Version " + version + " By Cade Parker: (C) " + new Date().getFullYear() + "\n" +
        "Big thank you to the following people:\n" +
        "Joel Melen\n" +
        "UIL Foundation\n" +
        "and the University of Texas at Austin");
    process.exit(0);
}
else if(args[0] == "-h" || args[0] == "--help"){
    console.log("Usage: node server.js [options]" +
        "options:\n" +
        "  -h, --help            show this help message and exit\n" +
        "  -v, --version         show program's version number and exit\n" +
        "  -S, --sync         Grabs the latest years from the UIL Servers.\n" +
        "Note: Sync requires at least one parameter, as a max year to cache. Otherwise, the command will fail.\n" +
        "");
    process.exit(0);
}
app.use(express.static('public'));

app.get('/', (req, res) => {
});
app.get('/getScore', (req, res) => {
    if(req.query.subject == undefined) {
        req.query.subject = "CSC";
    }
    if(req.query.region == undefined) {
        req.query.region = "20";
    }
    if(req.query.conf == undefined) {
        req.query.conf = "2A";
    }
    if(req.query.year == undefined) {
        req.query.year = "2021";
    }
    if(req.query.district == undefined) {
        req.query.district = "D";
    }
    let link = "";
    if(parseInt(req.query.year) !== new Date().getFullYear()) {
        link = ("http://utdirect.utexas.edu/uil/vlcp_pub_arch.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_submit_sw=X&s_year="+req.query.year+"&s_conference="+req.query.conf+"&s_level_id="+req.query.region+"&s_gender=&s_round=&s_dept=C&s_area_zone=");
    }
    else {
        link = ("http://utdirect.utexas.edu/uil/vlcp_results.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_area_zone=&s_submit_sw=X");
    }
    var filnam = "./cache/" + req.query.subject + req.query.region + req.query.conf + req.query.year + req.query.district +".json";
    if(fs.existsSync(filnam) && !false) {
        console.log("already found");
        let raw = fs.readFileSync(filnam);
        let events = JSON.parse(raw);
        res.end(JSON.stringify(events));


    }
    else {
        request(link, function (error, response, html) {
            console.log("Request completed for " + req.query.subject + " at region "+ req.query.region + "in conference" + req.query.conf + " with year " + req.query.year + " of event type "+ req.query.district);
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                let jsonArray = [];
                let swapscore = true;
                $("body > div > form > table > tbody > tr").each((index, element) => {
                    if(index === 0) {
                        const tds = $(element).find("td");
                        for(var i = 0; i < tds.length;i++) {
                            if($(tds[i]).text().toLowerCase() === "score") {
                                swapscore = false;
                                return true;
                            }
                        }
                        return true;
                    }

                    const tds = $(element).find("td");
                    if(isNaN($(tds[1]).text())) {
                        if(swapscore) {
                            let pers = new person.person($(tds[0]).text(),$(tds[1]).text(),$(tds[3]).text(),$(tds[2]).text(),req.query.subject,req.query.region,req.query.conf,req.query.year)
                            jsonArray.push(pers);
                        }
                        else {
                            let pers = new person.person($(tds[0]).text(),$(tds[1]).text(),$(tds[2]).text(),$(tds[3]).text(),req.query.subject,req.query.region,req.query.conf,req.query.year)
                            jsonArray.push(pers);
                        }
                    }
                });
                //console.log(texts[2]);
                //console.log()
                //list.shift();
                //list.forEach(data => {
                //    console.log(data);
                //})
                const retuData = new Object();
                retuData.people = jsonArray;
                let data = JSON.stringify(retuData);

                fs.writeFileSync(filnam, data);
                let raw = fs.readFileSync(filnam);
                let events = JSON.parse(raw);
                res.end(JSON.stringify(events));

            }
            else {
                console.log("ERROR!");
            }
        });

    }
});
app.get('/getEvents', (req, res) => {
    if(fs.existsSync("./cache/events.json")) {
        let raw = fs.readFileSync('./cache/events.json');
        let events = JSON.parse(raw);
        res.end(JSON.stringify(events));


    }
    else {
        request("http://utdirect.utexas.edu/uil/vlcp_results.WBX", function (error, response, html) {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                let children = $("select[name=\"s_event_abbr\"]").children();
                const evts = [];
                const txt = [];
                children.each((index, element) => {
                    evts.push($(element).text());
                    txt.push($(element).val());
                })
                const retuData = new Object();
                retuData.events = txt;
                retuData.words = evts;
                let data = JSON.stringify(retuData);
                fs.writeFileSync('./cache/events.json', data);
                res.end(data);
            }
        });
    }
});
app.get('/getAllScores', (req, res) => {
    res.end("Hello world.");
});


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
function getEvents(callback, startyear, endyear) {
    if(fs.existsSync("./cache/events.json")) {
        let raw = fs.readFileSync('./cache/events.json');
        let events = JSON.parse(raw);
        callback(events,startyear,endyear);


    }
    else {
        request("http://utdirect.utexas.edu/uil/vlcp_results.WBX", function (error, response, html) {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                let children = $("select[name=\"s_event_abbr\"]").children();
                const evts = [];
                const txt = [];
                children.each((index, element) => {
                    evts.push($(element).text());
                    txt.push($(element).val());
                })
                const retuData = new Object();
                retuData.events = txt;
                retuData.words = evts;
                let data = JSON.stringify(retuData);
                fs.writeFileSync('./cache/events.json', data);
                callback(retuData,startyear,endyear);
            }
        });
    }
}
function getScore(req, force) {
    if(req.query.subject == undefined) {
        req.query.subject = "CSC";
    }
    if(req.query.region == undefined) {
        req.query.region = "20";
    }
    if(req.query.conf == undefined) {
        req.query.conf = "2A";
    }
    if(req.query.year == undefined) {
        req.query.year = "2021";
    }
    if(req.query.district == undefined) {
        req.query.district = "D";
    }
    let link = "";
    if(parseInt(req.query.year) !== new Date().getFullYear()) {
        link = ("http://utdirect.utexas.edu/uil/vlcp_pub_arch.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_submit_sw=X&s_year="+req.query.year+"&s_conference="+req.query.conf+"&s_level_id="+req.query.region+"&s_gender=&s_round=&s_dept=C&s_area_zone=");
    }
    else {
        link = ("http://utdirect.utexas.edu/uil/vlcp_results.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_area_zone=&s_submit_sw=X");
    }
    var filnam = "./cache/" + req.query.subject + req.query.region + req.query.conf + req.query.year + req.query.district +".json";
    if((fs.existsSync(filnam) && !force) || req.query.year == new Date().getFullYear()) {
        console.log("already found");
        let raw = fs.readFileSync(filnam);
        let events = JSON.parse(raw);
        return(JSON.stringify(events));
    }
    else {
        request(link, function (error, response, html) {
            console.log("Request completed for " + req.query.subject + " at region "+ req.query.region + "in conference" + req.query.conf + " with year " + req.query.year + " of event type "+ req.query.district);
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);
                let jsonArray = [];
                let swapscore = true;
                $("body > div > form > table > tbody > tr").each((index, element) => {
                    if(index === 0) {
                        const tds = $(element).find("td");
                        for(var i = 0; i < tds.length;i++) {
                            if($(tds[i]).text().toLowerCase() === "score") {
                                swapscore = false;
                                return true;
                            }
                        }
                        return true;
                    }

                    const tds = $(element).find("td");
                    if(isNaN($(tds[1]).text())) {
                        if(swapscore) {
                            let pers = new person.person($(tds[0]).text(),$(tds[1]).text(),$(tds[3]).text(),$(tds[2]).text(),req.query.subject,req.query.region,req.query.conf,req.query.year)
                            jsonArray.push(pers);
                        }
                        else {
                            let pers = new person.person($(tds[0]).text(),$(tds[1]).text(),$(tds[2]).text(),$(tds[3]).text(),req.query.subject,req.query.region,req.query.conf,req.query.year)
                            jsonArray.push(pers);
                        }
                    }
                });
                //console.log(texts[2]);
                //console.log()
                //list.shift();
                //list.forEach(data => {
                //    console.log(data);
                //})
                const retuData = new Object();
                retuData.people = jsonArray;
                let data = JSON.stringify(retuData);

                fs.writeFileSync(filnam, data);
                let raw = fs.readFileSync(filnam);
                let events = JSON.parse(raw);
                return(JSON.stringify(events));

            }
            else {
                console.log("ERROR!");
            }
        });

    }
}