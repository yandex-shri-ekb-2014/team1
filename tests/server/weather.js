var expect = require('chai').expect;

var weather = require('../../server/weather');


describe('server.weather', function () {
    it('getLocalityInfo', function (done) {
        weather.getLocalityInfo(54).then(function (data) {
            expect(data).to.be.an('object');
            expect(data).to.have.deep.property('info.geoid').and.equal(54);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('getFactual', function (done) {
        weather.getFactual([54]).then(function (data) {
            expect(data).to.be.an('array').and.to.have.length(1);
            expect(data[0]).to.be.an('object');
            expect(data[0]).to.have.property('geoid').and.equal(54);
            expect(data[0]).to.have.property('temp').and.to.be.a('number');
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('getFactual2', function (done) {
        weather.getFactual([0]).then(function (data) {
            expect(data).to.be.an('array').and.to.have.length(0);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('WeatherKeeper wait `new` event', function (done) {
        var wk = new weather.WeatherKeeper(54);
        wk.on('new', function (data) {
            expect(data).to.be.an('object');
            expect(data).to.have.deep.property('info.geoid').and.equal(54);
            wk.removeAllListeners();
            wk.stop();
            done();
        });
    });
});
