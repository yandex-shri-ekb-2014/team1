/** @jsx React.DOM */
var React = require('react');
var moment = require('moment');


var WeatherClimate = React.createClass({
    render: function () {
        var displayed = (this.props.type == "climate") ? {display:'block'} : {};
        return (
            <div className="content__weather-climate" style={displayed}>
                <div id="graph-wrp"></div>
            </div>
        );
    }
});

module.exports = WeatherClimate;
