const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let highscores = {
    since: moment().format("MMM Do YYYY"),
    scores: { easy: 0, hard: 0 },
};

app.get('/highscore', (req, res) => {
    res.send(highscores);
});

app.put('/highscore', (req, res) => {
    if (!req.body.score || !req.body.difficulty) {
        res.send(highscores);
        return;
    }
    let score = req.body.score;
    let difficulty = req.body.difficulty;
    if (!highscores.scores[difficulty]) { //allows new difficulties to be inserted dynamically.
        highscores.scores[difficulty] = 0;
    }
    if (highscores.scores[difficulty] < score) {
        highscores.scores[difficulty] = score;
    }
    res.send(highscores);
});

app.listen(3130, () => console.log('Server listening on port 3130!'));