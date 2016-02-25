/* jshint esnext: true, node: true */
var path = require('path');

module.exports = require('rc')('yasp', {

  web: {

    host: 'localhost',
    port: 8888,

    clientBaseDir: path.join(__dirname, '../client'),

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

  },

  auth: {
    // List of users authorized to connect, default admin / yasp
    // Password generated with `mkpasswd -m sha-512 <password>`
    users: {
      admin: '$6$Q019TfV9hvFge9Y$GRtFpepSd1sDydVll3.ANUf21rT3AZoz9PdXBnJ42XlQuTGEhodLH5RYlu8w29SUgkRo6tkQARGDPUATq86X01'
    }
  }

});
