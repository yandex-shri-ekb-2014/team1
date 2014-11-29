var inherits = require('util').inherits;
var Dispatcher = require('flux').Dispatcher;

var AppConstants = require('../constants/AppConstants');
var PayloadSources = AppConstants.PayloadSources;


/**
 * @class AppDispatcher
 */
function AppDispatcher() {
    Dispatcher.call(this);
}

inherits(AppDispatcher, Dispatcher);


/**
 * @param {Object} action
 */
AppDispatcher.prototype.handleServerAction = function (action) {
    var payload = {
        source: PayloadSources.SERVER_ACTION,
        action: action
    };
    this.dispatch(payload);
};

/**
 * @param {Object} action
 */
AppDispatcher.prototype.handleViewAction = function (action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
};


module.exports = new AppDispatcher();
