var events = require('events');
var inherits = require('util').inherits;


if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}


/**
 * @event Network#error
 * @param {Error} error
 */

/**
 * @event Network#connect
 */

/**
 * @event Network#disconnect
 */

/**
 * @event Network#newWeather
 * @param {string} cityName
 * @param {Object} weather
 */

/**
 * @class Network
 */
function Network() {
    var self = this;

    events.EventEmitter.call(self);

    self._requestId = 0;
    self._requests = {};

    self._isConnected = false;
    self.on('connect', function () { self._isConnected = true; });
    self.on('disconnect', function () { self._isConnected = false; });

    self._socket = io('/');
    self._socket.on('connect_error', function (error) { self.emit('error', error); });
    self._socket.on('connect', function () { self.emit('connect'); });
    self._socket.on('disconnect', function () { self.emit('disconnect'); });

    self._socket.on('message', function (response) {
        try {
            response = JSON.parse(response);
        } catch (e) {
            return self.emit('error', e);
        }

        if (response.id === null) {
            if (response.method === 'weather.subscribe' && Array.isArray(response.params)) {
                return self.emit('newWeather', response.result[0], response.result[1]);
            }
        }

        var deferred = self._requests[response.id];
        if (typeof deferred === 'undefined') { return; }
        delete self._requests[response.id];

        if (typeof response.error === 'undefined') {
            deferred.resolve(response.result);

        } else {
            deferred.reject(response.error);

        }
    });
}

inherits(Network, events.EventEmitter);

/**
 * @param {string} method
 * @param {*[]} params
 */
Network.prototype._request = function (method, params) {
    var deferred = Promise.defer();
    var request = {id: this._requestId++, method: method, params: params};

    this._requests[request.id] = deferred;
    this._socket.send(JSON.stringify(request));

    return deferred.promise;
};

/**
 * @param {string} cityName
 * @return {Promise}
 */
Network.prototype.getWeather = function (cityName) {
    return this._request('weather.get', [cityName]);
};

/**
 * @param {string} cityName
 * @return {Promise}
 */
Network.prototype.subscribeWeather = function (cityName) {
    return this._request('weather.subscribe', [cityName]);
};

/**
 * @return {Promise}
 */
Network.prototype.unsubscribeWeather = function () {
    return this._request('weather.unsubscribe', []);
};

/**
 * @param {string} query
 * @return {Promise}
 */
Network.prototype.getSuggest = function (query) {
    return this._request('suggest', [query]);
};


module.exports = Network;
