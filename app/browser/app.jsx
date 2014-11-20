/** @jsx React.DOM */
var React = require('react');

var GeoIDEcho = React.createClass({
    render: function () {
        return (
            <h1>{this.props.geoid}</h1>
        );
    }
});

window.onload = function () {
    var geoid = JSON.parse(document.getElementById("initial-data").innerHTML).geoid;
    React.render(<GeoIDEcho geoid={geoid} />, document.body);
}
