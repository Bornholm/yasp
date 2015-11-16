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
      // It should return at least test app
      test.ok(images.length > 0, 'It should return a least one item !');
      let testApp = images.filter(img => img.appName === 'Test App')[0];
      test.ok(testApp, 'It should return at least the test app !');
      test.done();
    })
    .catch(err => {
      test.ifError(err);
      test.done();
    })
  ;

};

exports.instanciateAppAndStart = function(test) {

  let apps = this.appsService;

  apps.fetchAvailableImages()
    .then(images => {
      let testApp = images.filter(img => img.appName === 'Test App')[0];
      return apps.instanciate(testApp.imageId);
    })
    .then(instance => {
      return apps.start(instance.instanceId);
    })
    .then(instance => {
      return apps.stop(instance.instanceId);
    })
    .then(() => {
      test.done();
    })
    .catch(err => {
      test.ifError(err);
      test.done();
    })
  ;

};
