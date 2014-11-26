/** @jsx React.DOM */
var React = require('react');

var Network = require('./network');
var Content = require('../blocks/content/content.jsx');


window.onload = function () {
    var data = JSON.parse(document.getElementById("initial-data").innerHTML);
    console.log(data);
    React.render(<Content type={data.type} weather={data.weather} />, document.getElementById('content'));

    // Example
    var network = new Network();
    network.on('connect', function () {
        network.getSuggest('Екате').then(function (result) {
            console.log(result);

        }).catch(function (error) {
            throw error;

        });

    }).on('error', function (error) {
        throw error;

    });
}
