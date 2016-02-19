/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');
let util = require('../util');
let mkdirp = require('mkdirp');
let rimraf = require('rimraf');
let path = require('path');
let debug = require('debug')('yasp:services:apps');
let fs = require('fs');

let ObjectHelpers = util.ObjectHelpers;
let VarsValidator = util.VarsValidator;
let YaspNS = util.YaspNamespace;
let YaspConst = util.YaspConst;

class AppsService {

  constructor(containersService, appsConfig) {
    this._containersService = containersService;
    this._appsConfig = appsConfig;
  }

  listAvailableTemplates() {
    debug('Listing templates...');
    let opts = {
      all: 0,
      filters: JSON.stringify({
        label: [YaspNS.APP_ENABLED+'=1'],
        dangling: ['false']
      })
    };
    return this._containersService.listImages(opts)
      .then(images => {
        let promises = images.map(img => {
          return this.getTemplateManifest(img.Id);
        });
        return Promise.all(promises);
      })
    ;
  }

  listInstances(onlyRunning) {
    debug('Listing instances... (onlyRunning: %s)', onlyRunning);
    let containersService = this._containersService;
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({
        label:[YaspNS.APP_ENABLED+'=1', YaspNS.APP_ID]
      })
    };
    return containersService.listContainers(opts)
      .then(containers => {
        let promises = containers.map(c => {
          let instanceId = c.Labels[YaspNS.APP_ID];
          return this.getInstanceManifest(instanceId);
        });
        return Promise.all(promises);
      })
    ;
  }

  getTemplateManifest(templateId) {
    debug('Fetching template "%s" manifest...', templateId);
    return this._containersService.inspectImage(templateId)
      .then(dockerImage => {

        let imageConfig = dockerImage.Config;
        let imageLabels = ObjectHelpers.deflaten(imageConfig.Labels || {});

        let id = dockerImage.Id;
        let creationDate = dockerImage.Created;
        let appName = ObjectHelpers.getPropIfExists(imageLabels, YaspNS.APP_NAME, '');
        let appDescription = ObjectHelpers.getPropIfExists(imageLabels, YaspNS.APP_DESCRIPTION, '');
        let vars = ObjectHelpers.getPropIfExists(imageLabels, YaspNS.APP_VARS, {});

        let volumes = Object.keys(imageConfig.Volumes || {});
        let ports = Object.keys(imageConfig.ExposedPorts || {});

        let templateManifest = { id, appName, appDescription, creationDate, vars, volumes, ports };

        debug('Template manifest for "%s": %j', templateId, templateManifest);

        return templateManifest;

      })
    ;
  }

  getInstanceManifest(instanceId) {
    let containersService = this._containersService;
    return this._findAppContainer(instanceId)
      .then(container => {
        return containersService.inspectContainer(container.Id)
          .then(containerInfo => {
            return this._hasWebAdmin(instanceId)
              .then(hasWebAdmin => {
                return {
                  imageId: containerInfo.Image,
                  instanceId: instanceId,
                  appName: containerInfo.Config.Labels[YaspNS.APP_NAME],
                  appDescription: containerInfo.Config.Labels[YaspNS.APP_DESCRIPTION],
                  internalIPAddress: containerInfo.NetworkSettings.IPAddress,
                  isRunning: containerInfo.State.Running,
                  ports: containerInfo.HostConfig.PortBindings,
                  hasWebAdmin: hasWebAdmin,
                  creationDate: containerInfo.Created
                };
              })
            ;
          })
        ;
      })
    ;
  }

  instanciate(templateId, opts) {

    opts = opts || {};

    let instanceId = uuid.v4() || opts.instanceId;
    let varsConfig = opts.vars || {};
    let portsMap = opts.ports || {};

    // First, we validate the submitted vars
    return this.getTemplateManifest(templateId)
      .then(template => {

        let validator = new VarsValidator(template.vars);

        validator.validate(varsConfig, true);

        // Create volumes map with additional Yasp dedicated volume
        let volumes = (template.volumes || []).concat(YaspConst.YASP_DEDICATED_VOLUME);

        // Ensure volume dirs exists
        return this._ensureVolumes(instanceId, volumes)
          .then(volumes => {

            // Finally, create the container with the generated config

            let containerOpts = {
              Image: templateId,
              Labels: {},
              HostConfig: {
                Binds: volumes,
                PortBindings: this._formatPortsMap(portsMap),
                PublishAllPorts: false,
                RestartPolicy: { Name: 'unless-stopped' }
              },
              Env: this._getDefaultEnvs()
                .concat(this._createEnvFromVars(template.vars, varsConfig))
            };

            // Set instanceId label
            containerOpts.Labels[YaspNS.APP_ID] = instanceId;

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

  delete(instanceId, opts) {
    opts = opts || {};
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.delete(container.Id)
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

  _hasWebAdmin(instanceId) {
    return new Promise(resolve => {
      let appDataDir = this.getAppDataDir(instanceId);
      let socketPath = path.join(appDataDir, YaspConst.YASP_ADMIN_SOCKET);
      fs.exists(socketPath, resolve);
    });
  }

  _formatPortsMap(portsMap) {
    debug('Formatting ports map %j', portsMap);
    return Object.keys(portsMap).reduce((out, containerPort) => {
      let hostPort = portsMap[containerPort];
      if( hostPort !== null && hostPort !== undefined && hostPort !== '' ) {
        out[containerPort] = [{ HostPort: `${hostPort}` }];
      }
      return out;
    }, {});
  }

  _getDefaultEnvs() {
    let defaultEnv = this._appsConfig.defaultEnv;
    return Object.keys(defaultEnv).map(envKey => {
      let envVal = defaultEnv[envKey];
      return `${envKey}=${envVal}`;
    });
  }

  _createEnvFromVars(varsManifest, varsConfig) {
    // For each vars
    let envs = Object.keys(varsConfig).map(varKey => {
      // Get the env alias if defined in vars manifest
      let envKey = ObjectHelpers.getPropIfExists(
        varsManifest, `${varKey}.env`, varKey
      );
      return envKey + '=' + varsConfig[varKey];
    });
    return envs;
  }

  getAppDataDir(instanceId) {
    let volumesDir = this._appsConfig.volumesDir;
    return path.join(volumesDir, instanceId);
  }

  _ensureVolumes(instanceId, volumes) {
    let volumesDir = this._appsConfig.volumesDir;
    let promises = volumes.map(volumePath => {
      let appDataDir = this.getAppDataDir(instanceId);
      let dirPath = path.join(appDataDir, volumePath);
      return this._mkdirp(dirPath).then(() => dirPath+':'+volumePath);
    });
    return Promise.all(promises);
  }

  _dropVolumes(instanceId) {
    let volumesDir = this._appsConfig.volumesDir;
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
          YaspNS.APP_ENABLED+'=1',
          YaspNS.APP_ID+'='+instanceId
        ]
      })
    };
    return containersService.listContainers(opts)
      .then(results => {
        if(!results.length) {
          throw new Error(`Can't found app ${instanceId} !`);
        }
        return results[0];
      })
    ;
  }

}

module.exports = AppsService;
