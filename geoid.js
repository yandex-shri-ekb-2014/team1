var Q = require('q');
var translit = require('translitit-cyrillic-russian-to-latin');
var weatherAPI = require('./app/server/weather');


var countries = [
    {geoid: 84,    name: 'США'},
    {geoid: 94,    name: 'Бразилия'},
    {geoid: 149,   name: 'Белоруссия'},
    {geoid: 187,   name: 'Украина'},
    {geoid: 225,   name: 'Россия'},
    {geoid: 995,   name: 'Тайланд'},
    {geoid: 10017, name: 'Куба'}
];

var printedCities = {};

/**
 * @param {string} name
 * @param {number} geoid
 * @param {?number} parent
 * @param {boolean} isCountry
 * @param {boolean} isProvince
 * @param {boolean} isCity
 * @param {boolean} [comma=true]
 */
function printObject(name, geoid, parent, isCountry, isProvince, isCity, comma) {
    if (typeof comma === 'undefined') { comma = true; }
    if (comma === true) { process.stdout.write(','); }

    var tname = translit(name).toLowerCase().replace(/ /g, '');
    if (printedCities[tname]) { tname += geoid; }
    printedCities[tname] = true;

    var string = JSON.stringify({
        name: name,
        translit: tname,
        geoid: geoid,
        parent: parent,
        isCountry: isCountry,
        isProvince: isProvince,
        isCity: isCity
    });

    process.stdout.write('\n  ' + string);
}

/**
 * @param {{geoid: number, name: string}} country
 * @param {{geoid: number, name: string}[]} provinces
 * @return {Q.Promise}
 */
function getCities(country, provinces) {
    var isFakeProvince = false;
    if (provinces.length === 0) {
        provinces = [country];
        isFakeProvince = true;
    }

    return provinces.reduce(function (prev, province) {
        return prev.then(function () {
            if (!isFakeProvince) {
                printObject(province.name, province.geoid, country.geoid, false, true, false);
            }

            return weatherAPI.getCitiesList(province.geoid);

        }).then(function (cities) {
            cities.forEach(function (city) {
                printObject(city.name, city.geoid, province.geoid, false, false, true);
            });
        });

    }, Q());
}

process.stdout.write('[');
countries.reduce(function (prev, country, index) {
    return prev.then(function () {
        printObject(country.name, country.geoid, null, true, false, false, index !== 0);
        return weatherAPI.getProvincesList(country.geoid);

    }).then(function (provinces) {
        return getCities(country, provinces);

    });

}, Q()).done(function () {
    process.stdout.write('\n]\n');

}, function (error) {
    console.log(error);

});
