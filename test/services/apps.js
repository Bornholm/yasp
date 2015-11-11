/* jshint esnext: true, node: true */
'use strict';

let Docker = require('dockerode');
let services = require('../../lib/services');
let config = require('../../lib/config');

exports.setUp = function(done) {
  let dockerClient = new Docker(config.docker);
  let containersService = new services.Containers(dockerClient);
  this.appsService = new services.Apps(containersService);
  done();
};

exports.fetchAvailableImages = function(test) {

  this.appsService.fetchAvailableImages()
    .then(images => {
      console.log(images);
      test.done();
    })
    .catch(err => {
      test.ifError(err);
      test.done();
    })
  ;

};
