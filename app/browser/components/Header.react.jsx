/** @jsx React.DOM */
var delayed = require('delayed');
var React = require('react');
var Router = require('react-router');

var SearchActionCreators = require('../actions/SearchActionCreators');
var SuggestStore = require('../stores/SuggestStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var PayloadSources = AppConstants.PayloadSources;
var ActionTypes = AppConstants.ActionTypes;


var Header = React.createClass({
    mixins: [Router.Navigation],

    getInitialState: function () {
        return {
            suggest: [],
            isSuggestShow: false
        }
    },

    componentDidMount: function () {
        SuggestStore.on('change', this._onHeaderStoreChange);
        this._dispatchToken = AppDispatcher.register(function (payload) {
            if (payload.source === PayloadSources.VIEW_ACTION && payload.action.actionType === ActionTypes.NEW_CITY) {
                var tags = document.getElementsByClassName('search__input');
                if (tags.length === 1) {
                    tags[0].value = '';
                    this.setState({ suggest: [], isSuggestShow: false });
                }
            }
        });
    },

    componentWillUnmount: function () {
        SuggestStore.removeListener('change', this._onWeatherStoreChange);
        AppDispatcher.unregister(this._dispatchToken);
    },

    render: function() {
        var suggestEntries = [];
        if (this.state.isSuggestShow) {
            suggestEntries = this.state.suggest;
        }

        var suggestList = suggestEntries.map(function (entry) {
            var temp = entry.temp;
            var aClassName = 'weather' + (temp + temp % 2);

            return (
                <li className='search-suggest-item'>
                    <a className={aClassName} href={'/' + entry.tname}>{entry.name}<span className='search-suggest-item-temp'>{entry.temp}</span></a>
                </li>
            );
        });

        return (
            <header>
                <div className="header__top">
                    <div className="header__logo">
                        <img width={82} height={33} src="/static/images/header/logo.png" />
                    </div>
                    <div className="header__search">
                        <div className="search">
                            <ul className="search-suggest">
                                {suggestList}
                            </ul>
                            <div className="search-info">
                                <div className="search-info__wrapper-h1">
                                    <h1 className="search-info__h1">Погода</h1>
                                </div>
                                <div className="search-info__arrow" />
                            </div>
                            <form className="search__form" onSubmit={this._onSearchFormSubmit}>
                                <input type="text" className="search__input" onKeyUp={delayed.debounce(this._onKeyUp, 400, this)} onFocus={this._onSearchInputFocus} onBlur={delayed.debounce(this._onSearchInputBlur, 250)} />
                                <button className="search__button">Найти</button>
                            </form>
                        </div>
                    </div>
                    <div className="header__user">
                        <div className="user">
                            <img width={42} height={42} className="user__avatar" src="/static/images/header/userpic.jpg" />
                            <a className="user__name" href="#"><span className="user__red">S</span>arah Connor</a>
                        </div>
                    </div>
                </div>
            </header>
        );
    },

    /**
     */
    _onHeaderStoreChange: function () {
        if (this._getSearchQuery() !== SuggestStore.getQuery()) { return; }

        this.setState({ suggest: SuggestStore.getSuggest() });
    },

    /**
     * @return {?string}
     */
    _getSearchQuery: function () {
        var tags = document.getElementsByClassName('search__input');
        if (tags.length === 1) { return tags[0].value; }

        return null;
    },

    /**
     * @param {Object} event
     */
    _onKeyUp: function (event) {
        var query = this._getSearchQuery();
        if (query !== null) { SearchActionCreators.newSearch(query); }
    },

    /**
     */
    _onSearchInputFocus: function () {
        this.setState({ isSuggestShow: true });
    },

    /**
     */
    _onSearchInputBlur: function () {
        this.setState({ isSuggestShow: false });
    },

    /**
     */
    _onSearchFormSubmit: function (event) {
        event.preventDefault();
        if (this.state.suggest.length > 0) {
            this.transitionTo('weather-short', {cityName: this.state.suggest[0].tname});
            SearchActionCreators.newCity(this.state.suggest[0].tname);
        }
    }
});


module.exports = Header;
