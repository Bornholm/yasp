/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');
let util = require('../util');
let ObjectHelpers = util.ObjectHelpers;
let InstanceVarsValidator = util.InstanceVarsValidator;
let AegirNS = util.AegirNamespace;

class AppsService {

  constructor(containersService) {
    this._containersService = containersService;
  }

  listAvailableImages() {
    let opts = {
      all: 0,
      filters: JSON.stringify({ label: [AegirNS.APP_ENABLED] })
    };
    return this._containersService.listImages(opts)
      .then(images => {
        let promises = images.map(img => {
          return this.getImageInfo(img.Id);
        });
        return Promise.all(promises);
      })
    ;
  }

  listInstances(onlyRunning) {
    let containersService = this._containersService;
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({ label: [AegirNS.APP_ENABLED+'=1'] })
    };
    return containersService.listContainers(opts)
      .then(containers => {
        let promises = containers.map(c => {
          let instanceId = c.Labels[AegirNS.APP_ID];
          return this.getInstanceInfo(instanceId);
        });
        return Promise.all(promises);
      })
    ;
  }

  getImageInfo(imageId) {
    return this._containersService.inspectImage(imageId)
      .then(imageInfo => {

        let imageConfig = imageInfo.Config;
        let imageLabels = ObjectHelpers.deflaten(imageConfig.Labels || {});

        let imageId = imageInfo.Id;
        let appName = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_NAME, '');
        let appDescription = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_DESCRIPTION, '');
        let vars = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_VARS, {});

        let volumes = Object.keys(imageConfig.Volumes || {});
        let ports = Object.keys(imageConfig.ExposedPorts || {});

        return { imageId, appName, appDescription, vars, volumes, ports };

      })
    ;
  }

  getInstanceInfo(instanceId) {
    let containersService = this._containersService;
    return this._findAppContainer(instanceId)
      .then(container => {
        return containersService.inspectContainer(container.Id)
          .then(containerInfo => {
            return {
              imageId: containerInfo.Image,
              instanceId: instanceId,
              appName: containerInfo.Config.Labels[AegirNS.APP_NAME],
              appDescription: containerInfo.Config.Labels[AegirNS.APP_DESCRIPTION],
              isRunning: containerInfo.State.Running,
              creationDate: containerInfo.Created
            };
          })
        ;
      })
    ;
  }

  instanciate(imageId, opts) {

    opts = opts || {};

    let instanceId = uuid.v4() || opts.instanceId;
    let vars = opts.vars || {};

    // First, we validate the submitted vars
    return this.getImageInfo(imageId)
      .then(imageInfo => {
        let validator = new InstanceVarsValidator(imageInfo.vars);
        validator.validate(vars);
      })
      .then(() => {
         // TODO: If vars are valid, we create the needed folders for the volumes
      })
      .then(volumes => {

        // Finally, create the container with the generated config

        let containerOpts = {
          Image: imageId,
          Labels: {}
        };
        containerOpts.Labels[AegirNS.APP_ID] = instanceId;

        return this._containersService.create(containerOpts)
          .then(() => { return instanceId; })
        ;

      })
    ;
  }

  start(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.start(container.Id)
          .then(() => { return instanceId; })
        ;
      })
    ;
  }

  stop(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.stop(container.Id)
          .then(() => { return instanceId; })
        ;
      })
    ;
  }

  remove(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.remove(container.Id)
          .then(() => { return instanceId; })
        ;
      })
    ;
  }

  _findAppContainer(instanceId) {
    let containersService = this._containersService;
    let opts = {
      all: 1,
      filters: JSON.stringify({
        label: [
          AegirNS.APP_ENABLED+'=1',
          AegirNS.APP_ID+'='+instanceId
        ]
      })
    };
    return containersService.listContainers(opts)
      .then(results => {
        return results[0];
      })
    ;
  }

}

module.exports = AppsService;
