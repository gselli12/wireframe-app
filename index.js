//SETUP
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const spicedPG = require("spiced-pg");
var url = require('url');
var cookieSession = require("cookie-session");

let db;
if(process.env.DATABASE_URL) {
    db = spicedPG(process.env.DATABASE_URL);
} else {
    const secret = require("./secrets.json");
    db = spicedPG("postgres:" + secret.username + ":" + secret.password + "@localhost:5432/wireframe");
}

//MIDDLEWARE
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(require("cookie-parser")());

app.use(cookieSession({
    name: "session",
    secret: "secret",
    maxAge: 14*24*60*60*1000
}));


//ROUTES
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/:string", (req, res) => {

    let adr = req.headers.referer;
    var q = url.parse(adr, true);

    let urlString = req.params.string;
    let wireframe =  JSON.stringify(req.body[0]);
    let backgroundcolor = req.body[1];
    let fontcolor = req.body[2];
    let fillcolor = req.body[3];

    if(q.pathname == "/") {
        console.log("new");
        db.query(`INSERT INTO wireframes (url_string, wireframe_object, background_color, fill_color, font_color) VALUES ($1, $2, $3, $4, $5)`, [urlString, wireframe, backgroundcolor, fillcolor, fontcolor], (err, results) => {
            if(err) {
                console.log(err);
            } else {
                req.session.user = urlString;
                console.log(req.session);
                return results;
            }
        }).then(() => {
            res.json({success: true});
        })
        ;
    } else {
        console.log("not new", urlString);
        db.query(`UPDATE wireframes SET wireframe_object = ($2), background_color = ($3), fill_color = ($4), font_color = ($5) WHERE url_string = ($1);`, [urlString, wireframe, backgroundcolor, fillcolor, fontcolor], (err, results) => {
            if(err) {
                console.log(err);
            } else {
                return results;
            }
        }).then(() => {
            res.json({success: true});
        });
    }
});

app.get("/api/hasCookie", (req, res) => {
    if(req.session.user) {
        res.json({
            success: true,
            cookie: req.session.user,
        });
    } else {
        res.json({
            success: true,
            cookie: false
        });
    }
});

app.get("/api/removeCookie", (req, res) => {
    req.session = null;
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
                res.sendFile(__dirname + "/404.html");
            } else {
                res.json(results.rows);
            }
        });
});

app.get("/404", (req, res) => {
    res.sendFile(__dirname + "/public/404.html");
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 8080, () => {
    console.log("listening on port 8080");
});
