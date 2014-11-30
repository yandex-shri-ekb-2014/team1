var events = require('events');
var inherits = require('util').inherits;

var io = require('socket.io-client');
var Q = require('q');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ServerActionCreators = require('../actions/ServerActionCreators');
var AppConstants = require('../constants/AppConstants');
var ActionTypes = AppConstants.ActionTypes;

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

    self._currentCityName = null;
    self._setCityNameQueue = [];

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
 * @return {boolean}
 */
Network.prototype.isConnected = function () {
    return this._isConnected;
};

/**
 * @param {string} method
 * @param {*[]} params
 */
Network.prototype._request = function (method, params) {
    var deferred = Q.defer();
    var request = {id: this._requestId++, method: method, params: params};

    this._requests[request.id] = deferred;
    this._socket.send(JSON.stringify(request));

    return deferred.promise;
};

/**
 * @param {string} cityName
 * @return {Q.Promise}
 */
Network.prototype._subscribeWeather = function (cityName) {
    return this._request('weather.subscribe', [cityName]);
};

/**
 * @return {Q.Promise}
 */
Network.prototype._unsubscribeWeather = function () {
    return this._request('weather.unsubscribe', []);
};

/**
 * @param {string} cityName
 * @return {Q.Promise}
 */
Network.prototype.setCityName = function (cityName) {
    var self = this;

    self._setCityNameQueue.push(Q.defer());
    if (self._setCityNameQueue.length === 1) { self._setCityNameQueue[0].resolve(); }

    var promise = self._setCityNameQueue[self._setCityNameQueue.length-1].promise;
    if (self._currentCityName !== null) {
        promise = promise.then(function () { return self._unsubscribeWeather(); });
    }

    return promise.then(function () {
        return self._subscribeWeather(cityName);

    }).then(function () {
        self._currentCityName = cityName;

    }).finally(function () {
        self._setCityNameQueue.shift();
        if (self._setCityNameQueue.length > 0) { self._setCityNameQueue[0].resolve(); }

    });
};

/**
 * @param {string} cityName
 * @return {Q.Promise}
 */
Network.prototype.getWeather = function (cityName) {
    return this._request('weather.get', [cityName]);
};

/**
 * @param {string} query
 * @return {Q.Promise}
 */
Network.prototype.getSuggest = function (query) {
    return this._request('suggest', [query]).then(function (suggest) {
        return suggest;
    });
};


var network = new Network();
network.on('error', function (error) { console.error(error.stack); });
network.on('newWeather', function (cityName, weather) {
    ServerActionCreators.newWeather(cityName, weather);
});

network.dispatchToken = AppDispatcher.register(function (payload) {
    if (payload.source !== AppConstants.PayloadSources.VIEW_ACTION) { return; }

    switch (payload.action.actionType) {
        case ActionTypes.NEW_CITY:
            var cityName = payload.action.cityName;
            network.getWeather(cityName).then(function (weather) {
                ServerActionCreators.newWeather(cityName, weather);
                network.setCityName(cityName);
            });
            break;

        case ActionTypes.NEW_SEARCH:
            var query = payload.action.query;
            network.getSuggest(query).then(function (suggest) {
                ServerActionCreators.newSuggest(query, suggest);
            });
            break;

        default:
            break;
    }
});


module.exports = network;
