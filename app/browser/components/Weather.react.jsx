/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');

var WeatherStore = require('../stores/WeatherStore');

var WeatherTabs = require('./WeatherTabs.react.jsx');
var WeatherHeader = require('./WeatherHeader.react.jsx');
var WeatherShort = require('./WeatherShort.react.jsx');
var WeatherFull = require('./WeatherFull.react.jsx');
var WeatherClimate = require('./WeatherClimate.jsx');


var Weather = React.createClass({
    mixins: [Router.State],

    getInitialState: function () {
        return {
            weather: null
        }
    },

    componentDidMount: function () {
        WeatherStore.on('change', this._onWeatherStoreChange);
    },

    componentDidUpdate: function () {
        if (document.getElementById("graph-wrp") && this.state.weather) {
            WeatherClimate(this.state.weather.forecast[0]);
        }
    },

    componentWillUnmount: function () {
        WeatherStore.removeListener('change', this._onWeatherStoreChange);
    },

    render: function () {
        if (this.state.weather === null) { return (<img className="weather-spinner" src="/static/images/content/spinner.gif" />); }

        var page;
        switch (this.getRoutes()[this.getRoutes().length - 1].name) {
            case 'weather-short':
                page = <WeatherShort forecast={this.state.weather.forecast} />;
                break;

            case 'weather-full':
                page = <WeatherFull forecast={this.state.weather.forecast} />;
                break;

            case 'weather-climate':
                page =  (<div className="content__weather-climate">
                            <div id="graph-wrp"></div>
                        </div>);
                break;

            default:
                throw new Error('Unknow weather type');
        }

        return (
            <div>
                <WeatherHeader data={this.state.weather} />

                <section className="content">
                    <WeatherTabs />
                    {page}
                </section>
            </div>
        );
    },

    _onWeatherStoreChange: function () {
        this.setState({
            weather: WeatherStore.getWeather()
        });
    }
});


module.exports = Weather;
