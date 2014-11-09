var request = require('request');
var Q = require('q');

request = Q.nbind(request);


/**
 * @param {string} path
 * @return {Q.Promise<?>}
 */
function weatherRequest(path) {
    var requestOpts = {
        url: 'http://ekb.shri14.ru/api' + path,
        json: true
    };

    return request(requestOpts).spread(function(response, body) {
        return body;
    });
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getLocalityInfo(geoid) {
    return weatherRequest('/localities/' + geoid);
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getCitiesList(geoid) {
    return weatherRequest('/localities/' + geoid + '/cities');
}

/**
 * @param {number} geoid
 * @return {Q.Promise<?>}
 */
function getProvincesList(geoid) {
    return weatherRequest('/localities/' + geoid + '/provinces');
}

/**
 * @param {number[]} geoids
 * @return {Q.Promise<?>}
 */
function getFactual(geoids) {
    return weatherRequest('/factual?ids=' + geoids.join(','));
}


module.exports = {
    getLocalityInfo: getLocalityInfo,
    getCitiesList: getCitiesList,
    getProvincesList: getProvincesList,
    getFactual: getFactual
};
