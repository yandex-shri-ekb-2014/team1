var _ = require('lodash');
var request = require('request');
var parseString = require('xml2js').parseString;
var Q  = require('q');

var geoidList = require('./geoid.json');
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
        if (isNaN(id)) { throw new TypeError('Can\'t get GeoID'); }

        return id;
    });
}

/**
 * @param {number} geoid
 * @return {Q.Promise}
 */
function checkGeoid(geoid) {
    return weather.getFactual([geoid]).then(function () {});
}


/**
 * @param {number} geoid
 * @return {?string}
 */
function getTranslitCityNameByGeoid(geoid) {
    var record = _.find(geoidList, {geoid: geoid});
    if (_.isUndefined(record)) { return null; }
    return record.translit;
}

/**
 * @param {string} cityName
 * @return {?number}
 */
function getGeoidByTranslitCityName(cityName) {
    var record = _.find(geoidList, {translit: cityName});
    if (_.isUndefined(record)) { return null; }
    return record.geoid;
}


module.exports = {
    getGeoidByIp: getGeoidByIp,
    checkGeoid: checkGeoid,
    getTranslitCityNameByGeoid: getTranslitCityNameByGeoid,
    getGeoidByTranslitCityName: getGeoidByTranslitCityName
};
