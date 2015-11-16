/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');
let ObjectHelpers = require('../util').ObjectHelpers;

class AppsService {

  constructor(containersService) {
    this._containersService = containersService;
  }

  fetchAvailableImages() {
    let opts = {
      all: 0,
      filters: JSON.stringify({ label: ['io.aegir.app.enabled=1'] })
    };
    return this._containersService.fetchImages(opts)
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

  fetchInstances(onlyRunning) {
    let containersService = this._containersService;
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({ label: ['io.aegir.app.enabled=1'] })
    };
    return containersService.fetchContainers(opts)
      .then(containers => {
        let promises = containers.map(c => {
          return containersService.inspectContainer(c.Id);
        });
        return Promise.all(promises);
      })
      .then(containers => {
        return containers.map(c => {
          return {
            instanceId: c.Config.Labels['io.aegir.app.id'],
            appName: c.Config.Labels['io.aegir.app.name'],
            appDescription: c.Config.Labels['io.aegir.app.description'],
            isRunning: c.State.Running,
            creationDate: c.Created
          };
        });
      })
    ;
  }

  instanciate(imageId, opts) {
    let instanceId = uuid.v4();
    let containerOpts = {
      Image: imageId,
      Labels: {
        'io.aegir.app.id': instanceId
      }
    };
    return this._containersService.createContainer(containerOpts)
      .then(() => { return { instanceId }; })
    ;
  }

  start(instanceId) {
    return this._findAppContainer(instanceId)
      .then(container => {
        return this._containersService.startContainer(container.Id)
          .then(() => { return { instanceId }; })
        ;
      })
    ;
  }

  stop(appId) {
    return this._findAppContainer(appId)
      .then(container => {
        return this._containersService.stopContainer(container.Id)
          .then(() => { return { appId }; })
        ;
      })
    ;
  }

  _findAppContainer(appId) {
    let containersService = this._containersService;
    let opts = {
      all: 1,
      filters: JSON.stringify({
        label: [
          'io.aegir.app.enabled=1',
          'io.aegir.app.id='+appId
        ]
      })
    };
    return containersService.fetchContainers(opts)
      .then(results => {
        return results[0];
      })
    ;
  }

}

module.exports = AppsService;
