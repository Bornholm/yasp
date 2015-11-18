/* jshint esnext: true, node: true */
'use strict';

let Docker = require('dockerode');
let services = require('../../lib/services');
let config = require('../../lib/config');

exports.setUp = function(done) {
  let dockerClient = new Docker(config.docker);
  let containersService = new services.Containers(dockerClient);
  this.appsService = new services.Apps(containersService, config.volumesDir);
  done();
};

exports.listAvailableImages = function(test) {

  this.appsService.listAvailableImages()
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

exports.instanciateAppThenStartStopAndRemove = function(test) {

  let apps = this.appsService;

  apps.listAvailableImages()
    .then(images => {
      let testApp = images.filter(img => img.appName === 'Test App')[0];
      return apps.instanciate(testApp.imageId);
    })
    .then(instanceId => {
      return apps.start(instanceId);
    })
    .then(instanceId => {
      return apps.stop(instanceId);
    })
    .then(instanceId => {
      return apps.remove(instanceId, {dropVolumes: true});
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

exports.instanciateAppThenListInstances = function(test) {

  let apps = this.appsService;
  let instanceId;

  apps.listAvailableImages()
    .then(images => {
      let testApp = images.filter(img => img.appName === 'Test App')[0];
      return apps.instanciate(testApp.imageId);
    })
    .then(_instanceId => {
      instanceId = _instanceId;
      return apps.listInstances();
    })
    .then(instances => {
      test.ok(instances && instances.length > 0, 'it sould return at least 1 item !');
    })
    .then(() => {
      return apps.remove(instanceId, {dropVolumes: true});
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
