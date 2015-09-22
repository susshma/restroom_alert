/*jslint node: true */

'use strict';

var server = require('./server');
var superagent = require('superagent');

var io = require('socket.io').listen(server);

var port = process.env.PORT || 9002;

server.listen(port);

var App = function () {
    return this.init();
};

App.prototype.init = function () {
    this.bathStatus = 'https://api.particle.io/v1/devices/53ff69066678505514261667/doorStatus/?access_token=7e97832c4a6ef830852859b215562f5f2f96c8b8';

    return this.startLoop();
};

App.prototype.startLoop = function () {
    setInterval(this.getResult.bind(this), 2000);

    return this;
};

App.prototype.getResult = function () {
    superagent
        .get(this.bathStatus)
        .on('error', function (err) {
            io.emit('error', err);
        })
        .end(function (res) {
            if(res.body.result === 0) {
                io.emit('open');

                return this;
            }

            if(res.body.result === 1) {
                io.emit('close');

                return this;
            }

            io.emit('error', res);
        });

    return this;
};

module.exports = new App();
