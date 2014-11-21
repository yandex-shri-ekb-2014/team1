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
    var data = JSON.parse(document.getElementById("initial-data").innerHTML);
    console.log(data);
    //React.render(<GeoIDEcho geoid={data.geoid} />, document.body);
}
