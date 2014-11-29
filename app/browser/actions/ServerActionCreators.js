var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var ActionTypes = AppConstants.ActionTypes;


module.exports = {

    /**
     * @param {string} cityName
     * @param {Object} weather
     */
    newWeather: function (cityName, weather) {
        AppDispatcher.handleServerAction({
            actionType: ActionTypes.NEW_WEATHER,
            cityName: cityName,
            weather: weather
        });
    },

    /**
     * @param {string} query
     * @param {Object[]} suggest
     */
    newSuggest: function (query, suggest) {
        AppDispatcher.handleServerAction({
            actionType: ActionTypes.NEW_SUGGEST,
            query: query,
            suggest: suggest
        });
    }

};
