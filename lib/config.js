/* jshint esnext: true, node: true */
var path = require('path');

module.exports = require('rc')('yasp', {



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
    socketPath: '/var/run/docker.sock'

  },

  apps: {

    defaultEnv: {
      YASP_UID: process.getgid(),
      YASP_GID: process.getgid()
    },

    volumesDir: path.join(__dirname, '..', './data/volumes')

  }

});
