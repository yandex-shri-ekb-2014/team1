var optimist = require('optimist')
    .usage('Usage: $0 [-h] [--port port] [--host hostname]')
    .options('port', {
        describe: 'server port',
        default: 8000
    })
    .options('host', {
        describe: 'server hostname',
        default: 'localhost'
    })
    .options('h', {
        alias: 'help',
        describe: 'show this help',
        default: false
    });

var argv = optimist.argv;
if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}


var path = require('path');
var express = require('express');
var morgan = require('morgan');

var geoid = require('./geoid');
var weatherAPI = require('./weather')


var app = express();

app.use(morgan('combined'));
app.use('/static',  express.static(__dirname + '/../desktop.bundles'));


app.get('/', function (req, res) {
    geoid.getByIp(req).then(function(regionId) {
        return weatherAPI.getLocalityInfo(regionId)

    }).then(function(data) {
        res.send(data);

    }).catch(function(error) {
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


var server = app.listen(argv.port, argv.host, function () {
    console.info('Server running on %s:%s', argv.host, argv.port);
})
