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


require('./app').listen(argv.port, argv.host, function () {
    console.info('Server running on %s:%s', argv.host, argv.port);
});
