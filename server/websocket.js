var _ = require('lodash');
var socketio = require('socket.io');
var Q = require('q');

var weather = require('./weather');
var checkGeoid = require('./geoid').checkGeoid;


/**
 * @param {Server} server
 */
function attach(server) {
    var io = socketio(server);

    var subscribeCount = {};
    var weatherKeepers = {};

    io.on('connection', function (socket) {
        var currentGeoid = null;
        var subscribeRunning = false;
        var subscribeQueue = [];

        /**
         * @param {Object} data
         */
        function sendData(data) { socket.send(JSON.stringify(data)); }

        /**
         * @param {Object} data
         */
        function subscribeCallback(data) {
            sendData({id: null, method: 'subscribe', result: data});
        }

        /**
         * @param {number} geoid
         */
        function unsubscribeGeoid(geoid) {
            subscribeCount[geoid] -= 1;
            weatherKeepers[geoid].removeListener('new', subscribeCallback);

            if (subscribeCount[geoid] === 0) {
                delete subscribeCount[geoid];
                weatherKeepers[geoid].stop();
                delete weatherKeepers[geoid];
            }
        }

        /**
         * @param {number} requestId
         * @param {number} geoid
         */
        function subscribeGeoid(requestId, geoid) {
            var promise = Q();

            if (subscribeRunning) {
                subscribeQueue.push(Q.defer());
                promise = _.last(subscribeQueue).promise;
            }
            subscribeRunning = true;

            promise.then(function () {
                return checkGeoid(geoid);

            }).then(function (isGoodGeoid) {
                if (!isGoodGeoid) { throw new Error('Bad geoid'); }

                if (currentGeoid !== null) { unsubscribeGeoid(currentGeoid); }

                currentGeoid = geoid;
                if (_.isUndefined(subscribeCount[geoid])) {
                    subscribeCount[geoid] = 0;
                    weatherKeepers[geoid] = new weather.WeatherKeeper(geoid);
                }

                subscribeCount[geoid] += 1;
                weatherKeepers[geoid].on('new', subscribeCallback);

                sendData({id: requestId, result: 'ok'});

            }).catch(function (error) {
                sendData({id: requestId, error: error.message});

            }).finally(function () {
                subscribeRunning = false;
                if (subscribeQueue > 0) { subscribeQueue.pop().resolve(); }

            }).done();
        }

        socket.on('message', function (request) {
            try {
                request = JSON.parse(request);
            } catch (error) {
                return sendData({error: 'Bad JSON'});
            }

            var requestId = request.id;
            var method = request.method;
            var params = request.params;

            if (_.isUndefined(requestId)) {
                return sendData({error: 'syntax error'});
            }

            if (method === 'subscribe' && _.isArray(params)) {
                return subscribeGeoid(requestId, params[0]);
            }

            sendData({id: requestId, error: 'unknow method'});
        });

        socket.on('disconnect', function () {
            if (currentGeoid !== null) { unsubscribeGeoid(currentGeoid); }
        });
    });
}


module.exports.attach = attach;
