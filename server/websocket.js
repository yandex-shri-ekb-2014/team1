var _ = require('lodash');
var socketio = require('socket.io');

var weather = require('./weather');


/**
 * @param {Server} server
 */
function attach(server) {
    var io = socketio(server);

    var subscribeCount = {};
    var weatherKeepers = {};

    /**
     * @param {number} geoid
     * @param {Socket} socket
     */
    function subscribeGeoid(geoid, socket) {
        if (_.isUndefined(subscribeCount[geoid])) {
            subscribeCount[geoid] = 0;
            weatherKeepers[geoid] = new weather.WeatherKeeper(geoid);
        }

        subscribeCount[geoid] += 1;
        weatherKeepers[geoid].on('new', function (data) {
            socket.emit('data', data);
        });
    }

    /**
     * @param {number} geoid
     */
    function unsubscribeGeoid(geoid) {
        subscribeCount[geoid] -= 1;

        if (subscribeCount[geoid] === 0) {
            delete subscribeCount[geoid];
            weatherKeepers[geoid].stop();
            weatherKeepers[geoid].removeAllListeners();
            delete weatherKeepers[geoid];
        }
    }

    io.on('connection', function (socket) {
        var currentGeoid = null;

        socket.on('subscribe', function (geoid) {
            if (currentGeoid !== null) { unsubscribeGeoid(currentGeoid); }

            currentGeoid = geoid;
            subscribeGeoid(currentGeoid, socket);
        });

        socket.on('disconnect', function () {
            if (currentGeoid !== null) { unsubscribeGeoid(currentGeoid); }
        });
    });
}


module.exports.attach = attach;
