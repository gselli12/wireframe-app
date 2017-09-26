const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const spicedPG = require("spiced-pg");
var url = require('url');


let db;
if(process.env.DATABASE_URL) {
    db = spicedPG(process.env.DATABASE_URL);
} else {
    const secret = require("./secrets.json");
    db = spicedPG("postgres:" + secret.username + ":" + secret.password + "@localhost:5432/wireframe");
}


app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/api/:string", (req, res) => {

    let adr = req.headers.referer;
    var q = url.parse(adr, true)
    console.log(q.pathname);

    let urlString = req.params.string;
    let wireframe =  JSON.stringify(req.body);

    if(q.pathname == "/") {
        console.log("new");
        db.query(`INSERT INTO wireframes (url_string, wireframe_object) VALUES ($1, $2)`, [urlString, wireframe], (err, results) => {
            if(err) {
                console.log(err);
            } else {
                return results;
            }
        });
    } else {
        console.log("not new", urlString);
        db.query(`UPDATE wireframes SET wireframe_object = ($2) WHERE url_string = ($1);`, [urlString, wireframe], (err, results) => {
            if(err) {
                console.log(err);
            } else {
                console.log(results);
                return results;
            }
        });
    }
    res.json({success: true});
});


app.get("/api/:string", (req, res) => {
    let string = req.params.string;

    db.query(`SELECT * FROM wireframes WHERE url_string = ($1)`, [string], (err, results) => {
        if(err) {
            console.log(err);
        } else {
            return results;
        }
    })
        .then(results => {
            if(results.rows.length == 0) {
                res.status(404);
                res.send();
            } else {
                res.json(results.rows);
            }
        });
});

app.get("/404", (req, res) => {
    res.sendFile(__dirname + "/public/404.html");
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(8080, () => {
    console.log("listening on port 8080");
});
