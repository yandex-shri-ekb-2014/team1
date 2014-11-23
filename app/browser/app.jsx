/** @jsx React.DOM */
var React = require('react');

var Network = require('./network');
var Content = require('../blocks/content/content.jsx');


window.onload = function () {
    var data = JSON.parse(document.getElementById("initial-data").innerHTML);
    console.log(data);
    React.render(<Content type={data.type} weather={data.weather} />, document.getElementById('content'));
}
