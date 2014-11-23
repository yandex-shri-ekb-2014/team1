/** @jsx React.DOM */
var React = require('react');

var Tabs = require('../tabs/tabs.jsx');
var WeatherShort = require('../weather-short/weather-short.jsx')


var Content = React.createClass({
    render: function () {
        return (
            <section className="content">
                <Tabs type={this.props.type} documentURL={this.props.documentURL} />
                <WeatherShort forecast={this.props.weather.forecast} />
            </section>
        );
    }
});


module.exports = Content;
