const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

let highscore = {
    since: moment.calendarFormat("MMM Do YYYY"),
    score = 0,
};

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    res.send('Here is the response to your POST, man!\n');
});

app.listen(3130, () => console.log('Server listening on port 3130!'));