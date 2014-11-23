var spawn = require('child_process').spawn;

var _ = require('lodash');
var socketio = require('socket.io-client');
var Q = require('q');

var implementationTests = require('../common/websocket.implementation');


var server;
var socketObj = {};

function before(done) {
    var deferred = Q.defer();
    deferred.promise.done(done, done);

    server = spawn('node', ['server.js', '--port', '8001']);
    server.stdout.on('data', function (data) {
        if (data.toString().indexOf('localhost:8001') === -1) {
            deferred.reject(data);
        }

        deferred.resolve();
    });
    server.stderr.on('data', function (data) {
        deferred.reject(new Error(data.toString()));
    });
}

function after(done) {
    var promise = Q();

    promise.then(function () {
        var deferred = Q.defer();
        server.on('exit', function () { deferred.resolve(); });
        server.kill('SIGINT');
        server = undefined;
        return deferred.promise;

    }).done(done, done);
}

function beforeEach(done) {
    var deferred = Q.defer();
    deferred.promise.done(done, done);

    socketObj.socket = socketio('http://localhost:8001/', {forceNew: true});
    socketObj.socket.on('connect', deferred.resolve);
    socketObj.socket.on('error', deferred.reject);
}

function afterEach(done) {
    if (!_.isUndefined(socketObj.socket)) {
        var deferred = Q.defer();
        deferred.promise.done(done, done);

        socketObj.socket.on('error', deferred.reject);
        socketObj.socket.on('disconnect', function () { deferred.resolve() });
        socketObj.socket.disconnect();
        socketObj.socket = undefined;
    }
}


implementationTests({
    before: before,
    after: after,
    beforeEach: beforeEach,
    afterEach: afterEach
}, socketObj);
