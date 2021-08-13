


const express = require('express');
const app = express();
const PORT = 8081;
const cheerio = require('cheerio');
const person = require("./person.js");



//HUGE COMMENT TO REMIND YOURSELF:

//USE JSDOM, CHEERIO IS A LOST CAUSE

//update: lmao just learn jquery moron
var request = require('request');

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
        req.query.year = "2019";
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

    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(html);
            let jsonArray = [];

            $("body > div > form > table > tbody > tr").each((index, element) => {
                if(index === 0) {
                    return true;
                }
                const tds = $(element).find("td");
                let pers = new person.person($(tds[0]).text(),$(tds[1]).text(),$(tds[2]).text(),$(tds[3]).text(),req.query.subject,req.query.region,req.query.conf,req.query.year)
                jsonArray.push(pers);
            });

            //console.log(texts[2]);
            //console.log()
            //list.shift();
            //list.forEach(data => {
            //    console.log(data);
            //})
            const retuData = new Object();
            retuData.people = jsonArray;
            res.end(JSON.stringify(retuData));
        }
    });
});
app.get('/getEvents', (req, res) => {
    request("http://utdirect.utexas.edu/uil/vlcp_results.WBX", function (error, response, html) {
        if(!error && response.statusCode == 200) {
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
            res.end(JSON.stringify(retuData));
        }
    });

});
app.get('/getAllScores', (req, res) => {
    res.end("Hello world.");
});


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
