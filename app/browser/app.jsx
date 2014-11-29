/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;

var App = require('./components/App.react.jsx');
var Weather = require('./components/Weather.react.jsx');
var NotFound = require('./components/NotFound.react.jsx');


var routes = (
    <Route path='/' handler={App}>
        <Route name='weather-short' path='/:cityName' handler={Weather} />
        <Route name='weather-full' path='/:cityName/details' handler={Weather} />
        <Route name='weather-climate' path='/:cityName/climate' handler={Weather} />
        <NotFoundRoute handler={NotFound} />
     </Route>
);

window.onload = function () {
    Router.run(routes, Router.HistoryLocation, function (Handler, state) {
        React.render(<Handler />, document.getElementById('content'));
    });
}
