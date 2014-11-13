var _ = require('lodash');
var request = require('request');
var parseString = require('xml2js').parseString;
var Q  = require('q');

var weather = require('./weather');


request = Q.nbind(request);
parseString = Q.nbind(parseString);


/**
 * @param {string} ipAddress
 * @return {Q.Promise<number>}
 */
function getGeoidByIp(ipAddress) {
    var requestOpts = {
        url: 'http://export.yandex.ru/bar/reginfo.xml',
        headers: {'x-forwarded-for': ipAddress}
    };

    return request(requestOpts).spread(function (response, body) {
        return parseString(body);

    }).then(function (result) {
        var id = parseInt(result.info.region[0].$.id, 10);
        if (isNaN(id)) { throw new TypeError('Bad geoId'); }

        return id;
    });
}

/**
 * @param {number} geoid
 * @return {Q.Promise<boolean>}
 */
function checkGeoid(geoid) {
    return weather.getFactual([geoid]).then(function (response) {
        return _.isArray(response) && response.length === 1 && response[0].geoid === geoid;

    });
}


module.exports = {
    getGeoidByIp: getGeoidByIp,
    checkGeoid: checkGeoid
};
