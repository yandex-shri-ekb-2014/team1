var getIpFromRequest = require('ipware')().get_ip;
var request = require('request');
var parseString = require('xml2js').parseString;
var Q  = require('q');

request = Q.nbind(request);
parseString = Q.nbind(parseString);


/**
 * @param {Request} req
 * @return {Q.Promise<number>}
 */
function getGeoIdByIp(req) {
    var requestOpts = {
        url: 'http://export.yandex.ru/bar/reginfo.xml',
        headers: {
            'x-forwarded-for': getIpFromRequest(req).clientIp
        }
    };

    return request(requestOpts).spread(function(response, body) {
        return parseString(body);

    }).then(function(result) {
        var id = parseInt(result.info.region[0].$.id, 10);
        if (isNaN(id)) throw new TypeError('Bad geoId');

        return id;
    });
}

module.exports = {
    getByIp: getGeoIdByIp
};
