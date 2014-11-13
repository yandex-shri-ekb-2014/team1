var expect = require('chai').expect;

var spawn = require('child_process').spawn;

var _ = require('lodash');
var socketio = require('socket.io-client');
var Q = require('q');


describe('server.websocket', function () {
    var server;
    var socket;

    beforeEach(function (done) {
        var deferred = Q.defer();
        deferred.promise.done(done, done);

        server = spawn('node', ['server/server', '--port', '8001']);
        server.stdout.on('data', function (data) {
            if (data.toString().indexOf('localhost:8001') === -1) { return; }

            socket = socketio('http://localhost:8001/', {forceNew: true});
            socket.on('connect', deferred.resolve);
            socket.on('error', deferred.reject);
        });
        server.stderr.on('data', function (data) {
            deferred.reject(new Error(data.toString()));
        });
    });

    afterEach(function (done) {
        var promise = Q();

        if (!_.isUndefined(socket)) {
            var deferred = Q.defer();
            promise = promise.then(function () { return deferred.promise; });

            socket.on('error', deferred.reject);
            socket.on('disconnect', deferred.resolve);
            socket.disconnect();
            socket = undefined;
        }

        promise.then(function () {
            var deferred = Q.defer();
            server.on('exit', function () { deferred.resolve(); });
            server.kill('SIGINT');
            server = undefined;
            return deferred.promise;

        }).done(done, done);
    });

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
        socket.send('{"id": 0}');
    });

    it('bad geoid', function (done) {
        socket.on('message', function (msg) {
            expect(msg).to.equal('{"id":0,"error":"Bad geoid"}');
            done();
        });
        socket.send('{"id": 0, "method": "subscribe", "params": [-1]}');
    });

    it('wait `new` event on subscribe method', function (done) {
        var isSubscribed = false;
        socket.on('message', function (msg) {
            if (!isSubscribed) {
                expect(msg).to.equal('{"id":0,"result":"ok"}');
                return (isSubscribed = true);
            }

            var data = JSON.parse(msg);
            expect(data.id).to.equal(null);
            expect(data.method).to.equal('subscribe');

            expect(data.result).to.be.an('object');
            expect(data.result).to.have.deep.property('info.geoid').and.equal(54);
            done();
        });
        socket.send('{"id": 0, "method": "subscribe", "params": [54]}');
    });
});
