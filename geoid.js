var Q = require('q');
var weatherAPI = require('./server/weather');


var countries = [
    {geoid: 225, name: 'Россия'}
];


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

    var string = JSON.stringify({
        name: name,
        geoid: geoid,
        parent: parent,
        isCountry: isCountry,
        isProvince: isProvince,
        isCity: isCity
    });

    process.stdout.write('\n  ' + string);
}


Q.spawn(function* main() {
    try {
        process.stdout.write('[');
        for (var cIndex = 0; cIndex < countries.length; cIndex += 1) {
            var country = countries[cIndex];
            printObject(country.name, country.geoid, null, true, false, false, cIndex !== 0);

            var provinces = yield weatherAPI.getProvincesList(country.geoid);
            for (var pIndex = 0; pIndex < provinces.length; pIndex += 1) {
                var province = provinces[pIndex];
                printObject(province.name, province.geoid, country.geoid, false, true, false);

                var cities = yield weatherAPI.getCitiesList(province.geoid);
                for (var ciIndex = 0; ciIndex < cities.length; ciIndex += 1) {
                    var city = cities[ciIndex];
                    printObject(city.name, city.geoid, province.geoid, false, false, true);
                }
            }
        }
        process.stdout.write('\n]\n');

    } catch (e) {
        console.error(e);

    }
});
