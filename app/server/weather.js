var crypto = require('crypto');
var events = require('events');
var inherits = require('util').inherits;

var LRU = require('lru-cache');
var _ = require('lodash');
var request = require('request');
var Q = require('q');

request = Q.nbind(request);


var weatherLRU = LRU({max: 1000, maxAge: 30000});
var weatherRequestPromises = {};

/**
 * @param {string} path
 * @return {Q.Promise<?>}
 */
function weatherRequest(path) {
    var url = 'http://ekb.shri14.ru/api' + path;

    var cachedResponse = weatherLRU.get(url);
    if (!_.isUndefined(cachedResponse)) {
        return Q(cachedResponse);
    }

    if (_.isUndefined(weatherRequestPromises[url])) {
        var requestOpts = {url: encodeURI(url), json: true};
        weatherRequestPromises[url] = request(requestOpts).spread(function (response, body) {
            weatherLRU.set(url, body);
            delete weatherRequestPromises[url];
            return body;
        });
    }

    return weatherRequestPromises[url];
}

/**
 * @param {Object} data
 * @return {Object}
 * @throws {Error} If data.message exists
 */
function checkWeatherRequest(data) {
    if (_.isUndefined(data.message)) { return data; }

    throw new Error(data.message);
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getLocalityInfo(geoid) {
    return weatherRequest('/localities/' + geoid).then(checkWeatherRequest);
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getCitiesList(geoid) {
    return weatherRequest('/localities/' + geoid + '/cities').then(checkWeatherRequest);
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getProvincesList(geoid) {
    return weatherRequest('/localities/' + geoid + '/provinces').then(checkWeatherRequest);
}

/**
 * @param {number[]} geoids
 * @return {Q.Promise<?>}
 */
function getFactual(geoids) {
    geoids = _.sortBy(geoids);

    return weatherRequest('/factual?ids=' + geoids.join(',')).then(function (data) {
        if (!_.isArray(data)) { throw new TypeError('Bad response'); }

        var isGoodData = _.chain(data)
            .pluck('geoid')
            .sortBy()
            .isEqual(geoids)
            .value();

        if (!isGoodData) { throw new Error('Invalid region GeoID'); }

        return data;
    });
}

/**
 * @param {string} query
 * @return {Q.Promise<Object[]>}
 */
function getSuggest(query) {
    return weatherRequest('/suggest?query=' + query).then(function (result) {
        if (!_.isArray(result)) { throw new TypeError('Bad response'); }
        return result;
    });
}


/**
 * @event WeatherKeeper#error
 * @param {Error} error
 */

/**
 * @event WeatherKeeper#new
 * @param {Object} data
 */

/**
 * @class WeatherKeeper
 * @param {number} geoid
 * @param {number} [syncInterval=30000]
 */
function WeatherKeeper(geoid, syncInterval) {
    syncInterval = _.isUndefined(syncInterval) ? 30000 : syncInterval;

    events.EventEmitter.call(this);

    this._geoid = geoid;
    this._syncInterval = syncInterval;
    this._timeoutId = null;

    this._state = {
        isActive: true,
        weatherHash: null
    };

    process.nextTick(this._sync.bind(this));
}

inherits(WeatherKeeper, events.EventEmitter);

/**
 */
WeatherKeeper.prototype._sync = function () {
    var self = this;
    self._timeoutId = null;

    if (self._state.isActive === false) { return; }

    getLocalityInfo(self._geoid).then(function (data) {
        var rawData = JSON.stringify(data);
        var dataHash = crypto.createHash('sha1').update(rawData).digest().toString('hex');

        if (self._state.weatherHash !== dataHash) {
            self._state.weatherHash = dataHash;
            self.emit('new', data);
        }

    }).catch(function (error) {
        self.emit('error', error);

    }).finally(function () {
        if (self._state.isActive === true) {
            self._timeoutId = setTimeout(self._sync.bind(self), self._syncInterval);
        }

    });
};

/**
 */
WeatherKeeper.prototype.stop = function () {
    this._state.isActive = false;
    if (this._timeoutId !== null) { clearTimeout(this._timeoutId); }
};


module.exports = {
    getLocalityInfo: getLocalityInfo,
    getCitiesList: getCitiesList,
    getProvincesList: getProvincesList,
    getFactual: getFactual,
    getSuggest: getSuggest,
    WeatherKeeper: WeatherKeeper
};
