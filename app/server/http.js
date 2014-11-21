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
        var cityName = geoidAPI.getTranslitCityNameByGeoid(geoid);
        if (cityName === null) {
            // Todo: redirect to choose ?
            return res.status(404).send('Can\'t resolve your ip to city...');
        }

        res.redirect('/' + cityName);

    }).done(next, next);
});

router.param('cityName', function (req, res, next, cityName) {
    var geoid = geoidAPI.getGeoidByTranslitCityName(cityName);
    if (geoid === null) {
        res.status(404).send('Can\'t resolve your cityName to geoid...');
        return next();
    }

    weatherAPI.getLocalityInfo(geoid).then(function (weather) {
        req.weather = weather;

    }).done(next, next);
});

router.get('/:cityName', function (req, res) {
    res.render('index', {data: {weather: req.weather, type: 'short'}});
});

router.get('/:cityName/details', function (req, res) {
    res.render('index', {data: {weather: req.weather, type: 'full'}});
});

router.get('/:cityName/climate', function (req, res) {
    res.render('index', {data: {weather: req.weather, type: 'climate'}});
});


module.exports.router = router;
