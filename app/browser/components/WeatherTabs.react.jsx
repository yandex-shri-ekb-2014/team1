/** @jsx React.DOM */
var normalizeurl = require('normalizeurl');
var urljoin = require('url-join');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var WeatherTabs = React.createClass({
    mixins: [Router.State],

    getCurrentTabName: function () {
        var routes = this.getRoutes();
        return routes[routes.length - 1].name;
    },

    itemClassName: function (name) {
        var className = 'tabs__item';

        if (name === 'short') { className += ' tabs__item_left'; }
        if (name === 'climate') { className += ' tabs__item_right'; }

        var currentTabName = this.getCurrentTabName()
        if (name === currentTabName.split('-')[1]) { className += ' tabs__item_active'; }

        return className;
    },

    render: function () {
        var cityName = this.getParams().cityName;

        return (
            <div className="content__tabs">
                <ul className="tabs">
                    <li className={this.itemClassName('short')}>
                        <Link to="weather-short" params={{cityName: cityName}} className="tabs__link">кратко</Link>
                    </li>
                    <li className={this.itemClassName('full')}>
                        <Link to="weather-full" params={{cityName: cityName}} className="tabs__link">подробно</Link>
                    </li>
                    <li className={this.itemClassName('climate')}>
                        <Link to="weather-climate" params={{cityName: cityName}} className="tabs__link">наглядно</Link>
                    </li>
                </ul>
            </div>
        );
    }
});


module.exports = WeatherTabs;
