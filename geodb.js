var optimist = require('optimist')
    .usage('Usage: $0 [-h] [--out filename]')
    .options('o', {
        alias: 'out',
        describe: 'output filename',
        default: 'geoid.db'
    })
    .options('h', {
        alias: 'help',
        describe: 'show this help',
        default: false
    });

var argv = optimist.argv;
if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}

var Q = require('q');
var translit = require('translitit-cyrillic-russian-to-latin');
var Datastore = require('nedb');
var weatherAPI = require('./weather');


var countries = require('./countrylist.json');
db = new Datastore({filename: argv.out, autoload: true});

var printedCities = {};

/**
 * @param {string} name
 * @param {number} geoid
 * @param {?number} parent
 * @param {boolean} isCountry
 * @param {boolean} isProvince
 * @param {boolean} isCity
 * @return {Q.Promise}
 */
function insertObject(name, geoid, parent, isCountry, isProvince, isCity) {
    var obj = {
        name: name,
        tname: translit(name).toLowerCase().replace(/ /g, ''),
        geoid: geoid,
        parent: parent,
        isCountry: isCountry,
        isProvince: isProvince,
        isCity: isCity
    };

    return Q.ninvoke(db, 'insert', obj).catch(function (error) {
        if (error.errorType !== 'uniqueViolated') { throw error; }

        obj.tname += geoid;
        return Q.ninvoke(db, 'insert', obj);
    });
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
                insertObject(province.name, province.geoid, country.geoid, false, true, false);
            }

            console.log('  Get cities for provinceId:', province.geoid);
            return weatherAPI.getCitiesList(province.geoid);

        }).then(function (cities) {
            cities.forEach(function (city) {
                insertObject(city.name, city.geoid, province.geoid, false, false, true);
            });
        });

    }, Q());
}

Q.ninvoke(db, 'ensureIndex', {fieldName: 'tname', unique: true}).then(function () {
    return Q.ninvoke(db, 'ensureIndex', {fieldName: 'geoid', unique: true})

}).then(function () {
    return countries.reduce(function (prev, country) {
        return prev.then(function () {
            insertObject(country.name, country.geoid, null, true, false, false);
            console.log('Get provinces for countrId:', country.geoid);
            return weatherAPI.getProvincesList(country.geoid);

        }).then(function (provinces) {
            return getCities(country, provinces);

        });

    }, Q())

}).catch(function (error) { console.log(error) });
