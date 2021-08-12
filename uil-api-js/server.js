const express = require('express');
const app = express();
const PORT = 8081;
const cheerio = require('cheerio');
const jsdom = require("jsdom");



//HUGE COMMENT TO REMIND YOURSELF:

//USE JSDOM, CHEERIO IS A LOST CAUSE
var request = require('request');

app.use(express.static('public'));

app.get('/', (req, res) => {
});
app.get('/getEvents', (req, res) => {
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
    link = "";
    if(parseInt(req.query.year) !== 2021) {
        link = ("http://utdirect.utexas.edu/uil/vlcp_pub_arch.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_submit_sw=X&s_year="+req.query.year+"&s_conference="+req.query.conf+"&s_level_id="+req.query.region+"&s_gender=&s_round=&s_dept=C&s_area_zone=");
    }
    else {
        link = ("http://utdirect.utexas.edu/uil/vlcp_results.WBX?s_event_abbr=" + req.query.subject + "?s_year="+ req.query.year +"&s_level_id=" + req.query.district + "&s_level_nbr=" + req.query.region + "&s_conference=" + req.query.conf + "&s_area_zone=&s_submit_sw=X");
    }

    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(html);
            const elements = $('#form1').children();
            const argh = elements.toArray();
            let jsonArray = [];
            console.log(argh)
            argh.forEach(element => {
                const elements = element.children("table");
                const argh = elements.toArray();
                argh.forEach(element => {
                    const elements = element("tr");
                    const argh = elements.toArray();
                    argh.shift();
                    argh.forEach(element => {
                        const elements = element("td");
                        const argh = elements.toArray();
                        if(argh.get(1).text().matches("[0-9]+") && !argh.get(2).text().matches(".*[a-z].*")) {
                            const pers = new Person(argh.get(0).text(),
                                argh.get(1).text(),
                                argh.get(2).text(),
                                argh.get(3).text(),
                                req.query.subject,
                                req.query.region,
                                req.query.conf,
                                req.query.year
                            );
                            jsonArray.push(pers);
                        }

                    })
                })
            })
            response = ["people",jsonArray];
            res.end(JSON.stringify(response));
        }
    });
});
app.get('/getScore', (req, res) => {
    res.end("Hello world.");
});
app.get('/getAllScores', (req, res) => {
    res.end("Hello world.");
});


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
