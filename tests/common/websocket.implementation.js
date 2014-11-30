var expect = require('chai').expect;


/**
 * @param {Object} functions
 * @param {{socket: socket-io.Socket}} socketObj
 */
module.exports = function websocketImplementationTests(functions, socketObj) {
    describe('server.websocket', function () {
        var socket;

        before(functions.before);
        after(functions.after);
        beforeEach(function (done) {
            functions.beforeEach(function () {
                socket = socketObj.socket;
                done();
            });
        });
        afterEach(functions.afterEach);

        it('bad json', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"error":"Bad JSON"}');
                done();
            });
            socket.send({});
        });

        it('syntax error', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"error":"syntax error"}');
                done();
            });
            socket.send('{}');
        });

        it('unknow method', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"id":0,"error":"unknow method"}');
                done();
            });
            socket.send('{"id": 0, "params": []}');
        });

        it('weather.get: bad cityName', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"id":0,"error":"CityNameNotFound"}');
                done();
            });
            socket.send('{"id": 0, "method": "weather.get", "params": ["ekaterynburd"]}');
        });

        it('weather.get: return data', function (done) {
            socket.on('message', function (msg) {
                var data = JSON.parse(msg);
                expect(data.id).to.equal(0);

                expect(data.result).to.be.an('object');
                expect(data.result).to.have.deep.property('info.geoid').and.equal(54);
                done();
            });
            socket.send('{"id": 0, "method": "weather.get", "params": ["ekaterynburg"]}');
        });

        it('weather.subscribe: bad cityName', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"id":0,"error":"CityNameNotFound"}');
                done();
            });
            socket.send('{"id": 0, "method": "weather.subscribe", "params": ["ekaterynburd"]}');
        });

        it('weather.subscribe: return ok', function (done) {
            var isSubscribed = false;
            socket.on('message', function (msg) {
                if (!isSubscribed) {
                    expect(msg).to.equal('{"id":0,"result":"ok"}');
                    return (isSubscribed = true);
                }

                var data = JSON.parse(msg);
                expect(data.id).to.equal(null);
                expect(data.method).to.equal('weather.subscribe');

                expect(data.result).to.be.an('array').with.to.have.length(2);
                expect(data.result[0]).to.equal('ekaterynburg')
                expect(data.result[1]).to.have.deep.property('info.geoid').and.equal(54);
                done();
            });
            socket.send('{"id": 0, "method": "weather.subscribe", "params": ["ekaterynburg"]}');
        });

        it('weather.unsubscribe: return ok', function (done) {
            var isSubscribed = false;
            socket.on('message', function (msg) {
                if (JSON.parse(msg).id !== 0) { return }
                expect(msg).to.equal('{"id":0,"result":"ok"}');

                if (!isSubscribed) {
                    socket.send('{"id": 0, "method": "weather.unsubscribe", "params": []}');
                    return (isSubscribed = true);
                }

                done();
            });
            socket.send('{"id": 0, "method": "weather.subscribe", "params": ["ekaterynburg"]}');
        });

        it('suggest: return one', function (done) {
            socket.on('message', function (msg) {
                msg = JSON.parse(msg)
                delete msg.result[0].temp
                expect(msg).to.deep.equal({
                    id: 0,
                    result: [
                        {
                            geoid: 54,
                            name: "Екатеринбург",
                            tname: "ekaterynburg",
                            province: "Свердловская область",
                            country: "Россия",
                            relevance: 1000
                        }
                    ]
                });
                done();
            });
            socket.send('{"id": 0, "method": "suggest", "params": ["екатеринбург"]}');
        });

        it('suggest: return empty', function (done) {
            socket.on('message', function (msg) {
                expect(msg).to.equal('{"id":0,"result":[]}');
                done();
            });
            socket.send('{"id": 0, "method": "suggest", "params": ["екатеринбург1"]}');
        });
    });
};
