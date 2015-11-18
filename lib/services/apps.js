/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');
let ObjectHelpers = require('../util').ObjectHelpers;

class AppsService {

  constructor(containersService) {
    this._containersService = containersService;
  }

  listAvailableImages() {
    let opts = {
      all: 0,
      filters: JSON.stringify({ label: ['io.aegir.app.enabled=1'] })
    };
    return this._containersService.listImages(opts)
      .then(images => {
        return images.map(image => {
          let appMeta = ObjectHelpers.deflaten(image.Labels || {});
          let imageId = image.Id;
          let appName = ObjectHelpers.getPropIfExists(appMeta, 'io.aegir.app.name', '');
          let appDescription = ObjectHelpers.getPropIfExists(appMeta, 'io.aegir.app.description', '');
          let vars = ObjectHelpers.getPropIfExists(appMeta, 'io.aegir.app.vars', {});
          return { imageId, appName, appDescription, vars };
        });
      })
    ;
  }

  listInstances(onlyRunning) {
    let containersService = this._containersService;
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({ label: ['io.aegir.app.enabled=1'] })
    };
    return containersService.listContainers(opts)
      .then(containers => {
        let promises = containers.map(c => {
          return this.info(c.Labels['io.aegir.app.id']);
        });
        return Promise.all(promises);
      })
    ;
  }

  info(instanceId) {
    let containersService = this._containersService;
    return this._findAppContainer(instanceId)
      .then(container => {
        return containersService.inspect(container.Id)
          .then(containerInfo => {
            return {
              imageId: containerInfo.Image,
              instanceId: instanceId,
              appName: containerInfo.Config.Labels['io.aegir.app.name'],
              appDescription: containerInfo.Config.Labels['io.aegir.app.description'],
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
    let containerOpts = {
      Image: imageId,
      Labels: {
        'io.aegir.app.id': instanceId
      }
    };
    return this._containersService.create(containerOpts)
      .then(() => { return instanceId; })
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
          'io.aegir.app.enabled=1',
          'io.aegir.app.id='+instanceId
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
