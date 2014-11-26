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


var express = require('express');
var morgan = require('morgan');
var errors = require('./app/server/errors');


var app = express();

app.set('views', './app/views')
app.set('view engine', 'jade')

app.use(morgan('combined'));

app.use('', require('./app/server/http').router);
app.use('/static', express.static('./desktop.bundles/index'));
app.use(function(error, req, res, next) {
    if(!error) { return next(); }
    console.log(error.stack);

    var status = 500;
    if (error instanceof errors.CityNameNotFound || errors instanceof errors.GeoIdNotFound) {
        status = 404;
    }
    res.sendStatus(status);
})

var server = app.listen(argv.port, argv.host, function () {
    console.info('Server running on %s:%s', argv.host, argv.port);
});
require('./app/server/websocket').attach(server);
