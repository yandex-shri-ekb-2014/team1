var express = require('express');
// jshint camelcase:false
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var getIpFromRequest = require('ipware')().get_ip;
// jshint camelcase:true
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

var geoid = require('./geoid');
var weatherAPI = require('./weather');


var router = express.Router();

router.use('/static', express.static(__dirname + '/../desktop.bundles'));

router.get('/', function (req, res) {
    var clientIp = getIpFromRequest(req).clientIp;

    geoid.getGeoidByIp(clientIp).then(function (regionId) {
        return weatherAPI.getLocalityInfo(regionId);

    }).then(function (data) {
        res.send(data);

    }).catch(function (error) {
        console.error(error);
        res.sendStatus(500);

    });
});


module.exports.router = router;
