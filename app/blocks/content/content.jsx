/** @jsx React.DOM */
var React = require('react');

var Tabs = require('../tabs/tabs.jsx');
var WeatherShort = require('../weather-short/weather-short.jsx');
var WeatherFull = require('../weather-full/weather-full.jsx');


var Content = React.createClass({
    render: function () {
        return (
            <section className="content">
                <Tabs type={this.props.type} documentURL={this.props.documentURL} />
                <WeatherShort type={this.props.type} forecast={this.props.weather.forecast} />
                <WeatherFull type={this.props.type} forecast={this.props.weather.forecast} />
            </section>
        );
    }
});


module.exports = Content;
