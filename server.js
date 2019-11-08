const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let highscore = {
    since: moment().format("MMM Do YYYY"),
    score: 0,
};

app.get('/highscore', (req, res) => {
    res.send(highscore);
});

app.put('/highscore', (req, res) => {
    if (!req.body.score) {
        res.send(highscore);
        return;
    }
    let score = req.body.score;
    if (highscore.score < score) {
        highscore.score = score;
    }
    res.send(highscore);
});

app.listen(3130, () => console.log('Server listening on port 3130!'));