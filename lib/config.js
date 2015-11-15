/* jshint esnext: true, node: true */
var path = require('path');

module.exports = require('rc')('aegir', {

  appTemplatesDir: path.join(__dirname, '..', './templates'),

  webApp: {

    host: 'localhost',
    port: 8888,

    clientBaseDir: path.join(__dirname, './client'),

    log: {
      format: 'combined',
      options: {}
    }

  },

  docker: {
    host: null,
    port: null,
    socketPath: '/var/run/docker.sock',
  },

  dockerRegistry: {

  }

});
