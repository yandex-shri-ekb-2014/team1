/** @jsx React.DOM */
var delayed = require('delayed');
var React = require('react');

var SuggestStore = require('../stores/SuggestStore');

var SearchActionCreators = require('../actions/SearchActionCreators');


var Header = React.createClass({
    getInitialState: function () {
        return {
            suggest: []
        }
    },

    componentDidMount: function () {
        SuggestStore.on('change', this._onHeaderStoreChange);
    },

    componentWillUnmount: function () {
        SuggestStore.removeListener('change', this._onWeatherStoreChange);
    },

    render: function() {
        
        var suggestList = this.state.suggest.map(function (entry) {
            var temp = entry.temp;
            return <li className='search-suggest-item'><a className={'weather' + (temp + temp % 2)} href={'/'+entry.tname}>{entry.name}&nbsp;{entry.temp}</a></li>
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
                            <form className="search__form" action="">
                                <input type="text" className="search__input" onKeyUp={delayed.debounce(this._onKeyUp, 500, this)} />
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
    _onHeaderStoreChange: function () {
        if (this._getSearchQuery() !== SuggestStore.getQuery()) { return; }

        this.setState({ suggest: SuggestStore.getSuggest() });
    }
});


module.exports = Header;
