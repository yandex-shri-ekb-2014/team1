var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var ActionTypes = AppConstants.ActionTypes;


module.exports = {

    /**
     * @param {string} cityName
     */
    newCity: function (cityName) {
        AppDispatcher.handleViewAction({
            actionType: ActionTypes.NEW_CITY,
            cityName: cityName
        });
    },

    /**
     * @param {string} query
     */
    newSearch: function (query) {
        AppDispatcher.handleViewAction({
            actionType: ActionTypes.NEW_SEARCH,
            query: query
        });
    }

};
