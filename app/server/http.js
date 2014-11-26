var express = require('express');
// jshint camelcase:false
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var getIpFromRequest = require('ipware')().get_ip;
// jshint camelcase:true
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

var geoidAPI = require('./geoid');
var weatherAPI = require('./weather');


var router = express.Router();

router.get('/', function (req, res, next) {
    var clientIp = getIpFromRequest(req).clientIp;

    geoidAPI.getGeoidByIp(clientIp).then(function (geoid) {
        return geoidAPI.getCityNameByGeoid(geoid);

    }).then(function (cityName) {
        res.redirect('/' + cityName);

    }).done(next, next);
});

router.param('cityName', function (req, res, next, cityName) {
    geoidAPI.getGeoidByCityName(cityName).then(function (geoid) {
        return weatherAPI.getLocalityInfo(geoid);

    }).then(function (weather) {
        req.weather = weather;

    }).done(next, next);
});

router.get('/:cityName', function (req, res) {
    /*
    var React = require('react');
    require('node-jsx').install({extension: '.jsx'});
    var Content = React.createFactory(require('../blocks/content/content.jsx'));
    var html = React.renderToString(Content({weather: req.weather, type: 'short', documentURL: req.originalUrl}));
    console.log(html);
    */
    res.render('index', {data: {weather: req.weather, type: 'short'}});
});

router.get('/:cityName/details', function (req, res) {
    res.render('index', {data: {weather: req.weather, type: 'full'}});
});

router.get('/:cityName/climate', function (req, res) {
    res.render('index', {data: {weather: req.weather, type: 'climate'}});
});


module.exports.router = router;
