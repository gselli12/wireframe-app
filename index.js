const express = require('express');
const app = express();
var bodyParser = require('body-parser')


app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body.objects);

    res.json({success: true});
});

app.listen(8080, () => {
    console.log("listening on port 8080");
});
