var _ = require('lodash');
var socketio = require('socket.io');
var Q = require('q');

var weatherAPI = require('./weather');
var geoidAPI = require('./geoid');


/**
 * @param {Server} server
 */
function attach(server) {
    var io = socketio(server);

    var subscribeCount = {};
    var weatherKeepers = {};

    io.on('connection', function (socket) {
        var currentCityName = null;
        var subscribeRunning = false;
        var subscribeQueue = [];

        /**
         * @param {Object} data
         */
        function sendData(data) { socket.send(JSON.stringify(data)); }

        /**
         * @param {Object} data
         */
        function newWeatherCallback(data) {
            sendData({id: null, method: 'weather.subscribe', result: [currentCityName, data]});
        }

        /**
         * @param {string} cityName
         */
        function unsubscribeCityName(cityName) {
            subscribeCount[cityName] -= 1;
            weatherKeepers[cityName].removeListener('new', newWeatherCallback);

            if (subscribeCount[cityName] === 0) {
                delete subscribeCount[cityName];
                weatherKeepers[cityName].stop();
                delete weatherKeepers[cityName];
            }
        }

        /**
         * @param {string} cityName
         * @return {Q.Promise}
         */
        function subscribeCityName(cityName) {
            var promise = Q();

            if (subscribeRunning) {
                subscribeQueue.push(Q.defer());
                promise = _.last(subscribeQueue).promise;
            }
            subscribeRunning = true;

            return promise.then(function () {
                return geoidAPI.getGeoidByCityName(cityName);

            }).then(function (geoid) {
                if (currentCityName !== null) {
                    unsubscribeCityName(currentCityName);
                }

                currentCityName = cityName;
                if (_.isUndefined(subscribeCount[currentCityName])) {
                    subscribeCount[currentCityName] = 0;
                    weatherKeepers[currentCityName] = new weatherAPI.WeatherKeeper(geoid);
                }

                subscribeCount[currentCityName] += 1;
                weatherKeepers[currentCityName].on('new', newWeatherCallback);

            }).finally(function () {
                subscribeRunning = false;
                if (subscribeQueue.length > 0) {
                    subscribeQueue.shift().resolve();
                }

            }).then(function () { return 'ok'; });
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

            Q.fcall(function () {
                if (_.isUndefined(requestId) || !_.isArray(params)) {
                    throw new Error('syntax error');
                }

                if (method === 'weather.get') {
                    return geoidAPI.getGeoidByCityName(params[0]).then(weatherAPI.getLocalityInfo);
                }

                if (method === 'weather.subscribe') {
                    return subscribeCityName(params[0]);
                }

                if (method === 'weather.unsubscribe') {
                    if (currentCityName !== null) {
                        unsubscribeCityName(currentCityName);
                    }

                    return 'ok';
                }

                if (method === 'suggest') {
                    return weatherAPI.getSuggest(params[0]).then(function (entries) {
                        var promises = entries.slice(0, 9).map(function (entry) {
                            return geoidAPI.getCityNameByGeoid(entry.geoid).then(function (cityName) {
                                entry.tname = cityName;
                                return weatherAPI.getFactual([entry.geoid]);

                            }).then(function (result) {
                                entry.temp = result[0].temp;
                                return entry;

                            }).catch(function () { return; });
                        });

                        return Q.all(promises).then(function (entries) { return _.filter(entries); });
                    });
                }

                throw new Error('unknow method');

            }).done(function (data) {
                sendData({id: requestId, result: data});

            }, function (error) {
                var errorMsg = error.message || error.type;
                sendData({id: requestId, error: errorMsg});

            });
        });

        socket.on('disconnect', function () {
            if (currentCityName !== null) {
                unsubscribeCityName(currentCityName);
            }
        });
    });
}


module.exports.attach = attach;
