var express = require('express');
var morgan = require('morgan');

var geoid = require('./geoid');
var weatherAPI = require('./weather');


var app = express();

app.use(morgan('combined'));
app.use('/static', express.static(__dirname + '/../desktop.bundles'));


app.get('/', function (req, res) {
    geoid.getByIp(req).then(function (regionId) {
        return weatherAPI.getLocalityInfo(regionId);

    }).then(function (data) {
        res.send(data);

    }).catch(function (error) {
        console.error(error);
        res.sendStatus(500);

    });
});

app.get('/details', function (req, res) {
    res.send('details weather');
});

app.get('/climate', function (req, res) {
    res.send('climate');
});


module.exports = app;
