/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');
let util = require('../util');
let mkdirp = require('mkdirp');
let rimraf = require('rimraf');
let path = require('path');
let ObjectHelpers = util.ObjectHelpers;
let VarsValidator = util.VarsValidator;
let AegirNS = util.AegirNamespace;

class AppsService {

  constructor(containersService, volumesDir) {
    this._containersService = containersService;
    this._volumesDir = volumesDir;
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
        let creationDate = imageInfo.Created;
        let appName = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_NAME, '');
        let appDescription = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_DESCRIPTION, '');
        let vars = ObjectHelpers.getPropIfExists(imageLabels, AegirNS.APP_VARS, {});

        let volumes = Object.keys(imageConfig.Volumes || {});
        let ports = Object.keys(imageConfig.ExposedPorts || {});

        return { imageId, appName, appDescription, creationDate, vars, volumes, ports };

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
    let varsConfig = opts.vars || {};

    // First, we validate the submitted vars
    return this.getImageInfo(imageId)
      .then(imageInfo => {

        let validator = new VarsValidator(imageInfo.vars);

        validator.validate(varsConfig, true);

        // Ensure volume dirs exists
        return this._ensureVolumes(instanceId, imageInfo.volumes)
          .then(volumes => {

            // Finally, create the container with the generated config

            let containerOpts = {
              Image: imageId,
              Labels: {},
              HostConfig: {
                Binds: volumes
              },
              Env: this._createEnvFromVars(imageInfo.vars, varsConfig)
            };

            // Set instanceId label
            containerOpts.Labels[AegirNS.APP_ID] = instanceId;

            console.log(JSON.stringify(containerOpts, null, 2));

            return this._containersService.create(containerOpts)
              .then(() => instanceId)
            ;

          })
        ;

      })
    ;
  }

  start(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.start(container.Id)
          .then(() => instanceId)
        ;
      })
    ;
  }

  stop(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.stop(container.Id)
          .then(() => instanceId)
        ;
      })
    ;
  }

  remove(instanceId, opts) {
    opts = opts || {};
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.remove(container.Id)
          .then(() => instanceId)
        ;
      })
      .then(instanceId => {
        if(opts.dropVolumes) {
          return this._dropVolumes(instanceId);
        }
      })
      .then(() => instanceId)
    ;
  }

  _createEnvFromVars(varsManifest, varsConfig) {

    // For each vars
    return Object.keys(varsConfig).map(varKey => {

      // Get the env alias if defined in vars manifest
      let envName = ObjectHelpers.getPropIfExists(
        varsManifest, varKey+'.env', varKey
      );

      return envName + '=' + varsConfig[varKey];

    });

  }

  _ensureVolumes(instanceId, volumes) {
    let volumesDir = this._volumesDir;
    let promises = volumes.map(volumePath => {
      let dirPath = path.join(volumesDir, instanceId, volumePath);
      return this._mkdirp(dirPath).then(() => dirPath+':'+volumePath);
    });
    return Promise.all(promises);
  }

  _dropVolumes(instanceId) {
    let volumesDir = this._volumesDir;
    let dirPath = path.join(volumesDir, instanceId);
    return this._rimraf(dirPath).then(() => dirPath);
  }

  _mkdirp(dirPath, opts) {
    return new Promise((resolve, reject) => {
      mkdirp(dirPath, opts, (err, made) => {
        if(err) return reject(err);
        return resolve(made);
      });
    });
  }

  _rimraf(dirPath) {
    return new Promise((resolve, reject) => {
      rimraf(dirPath, (err) => {
        if(err) return reject(err);
        return resolve();
      });
    });
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
