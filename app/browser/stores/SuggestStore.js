var events = require('events');
var inherits = require('util').inherits;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var PayloadSources = AppConstants.PayloadSources;
var ActionTypes = AppConstants.ActionTypes;


/**
 * @event SuggestStore#change
 */

/**
 * @class SuggestStore
 */
function SuggestStore() {
    events.EventEmitter.call(this);

    this._currentQuery = null;
    this._currentSuggest = [];
}

inherits(SuggestStore, events.EventEmitter);

/**
 * @return {string}
 */
SuggestStore.prototype.getQuery = function () {
    return this._currentQuery;
};

/**
 * @return {Object}
 */
SuggestStore.prototype.getSuggest = function () {
    return this._currentSuggest;
};

/**
 * @param {string} query
 */
SuggestStore.prototype.setQuery = function (query) {
    if (this._currentQuery === query) { return; }

    this._currentQuery = query;
    this._currentSuggest = [];
    this.emit('change');
};

/**
 * @param {string} cityName
 * @param {Object[]} suggest
 */
SuggestStore.prototype.setSuggest = function (query, suggest) {
    if (this._currentQuery !== query) { return; }

    this._currentSuggest = suggest;
    this.emit('change');
};


var SuggestStore = new SuggestStore();

SuggestStore.dispatchToken = AppDispatcher.register(function (payload) {
    if (payload.source === PayloadSources.VIEW_ACTION && payload.action.actionType === ActionTypes.NEW_SEARCH) {
        return SuggestStore.setQuery(payload.action.query);
    }

    if (payload.source === PayloadSources.SERVER_ACTION && payload.action.actionType === ActionTypes.NEW_SUGGEST) {
        return SuggestStore.setSuggest(payload.action.query, payload.action.suggest);
    }
});

module.exports = SuggestStore;
