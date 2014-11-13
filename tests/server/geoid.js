var expect = require('chai').expect;

var geoid = require('../../server/geoid');


describe('server.geoid', function () {
    it('getGeoidByIp ekb', function (done) {
        geoid.getGeoidByIp('195.19.132.64').then(function (id) {
            expect(id).to.be.equal(54);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('getGeoidByIp spb', function (done) {
        geoid.getGeoidByIp('93.100.1.1').then(function (id) {
            expect(id).to.be.equal(2);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('checkGeoid good', function (done) {
        geoid.checkGeoid(54).then(function (isGood) {
            expect(isGood).to.equal(true);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });

    it('checkGeoid bad', function (done) {
        geoid.checkGeoid(0).then(function (isGood) {
            expect(isGood).to.equal(false);
            done();

        }).catch(function (error) {
            done(error);

        }).done();
    });
});
