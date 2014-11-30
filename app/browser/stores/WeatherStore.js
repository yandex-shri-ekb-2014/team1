var events = require('events');
var inherits = require('util').inherits;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var PayloadSources = AppConstants.PayloadSources;
var ActionTypes = AppConstants.ActionTypes;


/**
 * @event WeatherStore#change
 */

/**
 * @class WeatherStore
 */
function WeatherStore() {
    events.EventEmitter.call(this);

    this._currentCityName = null;
    // @todo weather hash?
    this._currentWeather = null;
}

inherits(WeatherStore, events.EventEmitter);

/**
 * @return {string}
 */
WeatherStore.prototype.getCityName = function () {
    return this._currentCityName;
};

/**
 * @return {Object}
 */
WeatherStore.prototype.getWeather = function () {
    return this._currentWeather;
};

/**
 * @param {string} cityName
 */
WeatherStore.prototype.newCityName = function (cityName) {
    if (this._currentCityName === cityName) { return; }

    this._currentCityName = cityName;
    this._currentWeather = null;
    this.emit('change');
};

/**
 * @param {string} cityName
 * @param {Object} weather
 */
WeatherStore.prototype.newWeather = function (cityName, weather) {
    if (this._currentCityName !== cityName) { return; }

    this._currentWeather = weather;
    this.emit('change');
};


var weatherStore = new WeatherStore();

weatherStore.dispatchToken = AppDispatcher.register(function (payload) {
    if (payload.source === PayloadSources.VIEW_ACTION && payload.action.actionType === ActionTypes.NEW_CITY) {
        return weatherStore.newCityName(payload.action.cityName);
    }

    if (payload.source === PayloadSources.SERVER_ACTION && payload.action.actionType === ActionTypes.NEW_WEATHER) {
        return weatherStore.newWeather(payload.action.cityName, payload.action.weather);
    }
});

module.exports = weatherStore;
