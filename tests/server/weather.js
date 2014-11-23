var expect = require('chai').expect;

var weather = require('../../app/server/weather');


describe('server.weather', function () {
    it('getLocalityInfo', function (done) {
        weather.getLocalityInfo(54).done(function (data) {
            expect(data).to.be.an('object');
            expect(data).to.have.deep.property('info.geoid').and.equal(54);
            done();

        }, done);
    });

    it('getLocalityInfo invalid GeoID', function (done) {
        weather.getLocalityInfo(-1).done(done, function (error) {
            if (error.message === 'Invalid region GeoID') { return done(); }
            done(error);
        });
    });

    it('getFactual', function (done) {
        weather.getFactual([54]).then(function (data) {
            expect(data).to.be.an('array').and.to.have.length(1);
            expect(data[0]).to.be.an('object');
            expect(data[0]).to.have.property('geoid').and.equal(54);
            expect(data[0]).to.have.property('temp').and.to.be.a('number');
            done();

        }, done);
    });

    it('getFactual invalid GeoID', function (done) {
        weather.getFactual([0]).then(done, function (error) {
            if (error.message === 'Invalid region GeoID') { return done(); }
            done(error);
        });
    });

    it('getSuggest', function (done) {
        weather.getSuggest('екатеринбург').done(function (data) {
            expect(data).to.be.an('array').with.to.have.length(1);
            expect(data[0]).to.be.a('object').with.to.have.property('geoid', 54);
            done();

        }, done);
    })

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
