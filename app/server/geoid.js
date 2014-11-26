var request = require('request');
var parseString = require('xml2js').parseString;
var Q  = require('q');
var Datastore = require('nedb');

var errors = require('./errors');
var weather = require('./weather');


request = Q.nbind(request);
parseString = Q.nbind(parseString);

var db = new Datastore({filename: './geoid.db', autoload: true});
var dbFindOne = Q.nbind(db.findOne, db);


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
 * @return {Q.Promise<string>}
 */
function getCityNameByGeoid(geoid) {
    return dbFindOne({geoid: geoid}).then(function (record) {
        if (record === null) {
            throw new errors.GeoIdNotFound();
        }

        return record.tname;
    });
}

/**
 * @param {string} cityName
 * @return {Q.Promise<number>}
 */
function getGeoidByCityName(cityName) {
    return dbFindOne({tname: cityName}).then(function (record) {
        if (record === null) {
            throw new errors.CityNameNotFound();
        }

        return record.geoid;
    });
}


module.exports = {
    getGeoidByIp: getGeoidByIp,
    checkGeoid: checkGeoid,
    getCityNameByGeoid: getCityNameByGeoid,
    getGeoidByCityName: getGeoidByCityName
};
