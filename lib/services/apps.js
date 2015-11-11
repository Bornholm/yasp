/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');

class AppsService {

  constructor(containersService) {
    this._containers = containersService;
  }

  fetchAvailableImages() {
    let opts = {
      filters: JSON.stringify({ label: ['io.aegir.app=1'] })
    };
    return this._containers.fetchImages(opts)
      .then(images => {
        return images.map(image => {
          let labels = image.Labels || {};
          return {
            imageId: image.Id,
            appName: labels['io.aegir.app.name'] || '',
            appDescription: labels['io.aegir.app.description'] || '',
            vars: {}
          };
        });
      })
    ;
  }

  fetchInstances(onlyRunning) {
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({ label: ['io.aegir.app=1'] })
    };
    return this._containers.fetchContainers(opts);
  }

  instanciate(imageId, opts) {
    let appId = uuid.v4();
    let containerOpts = {
      Image: imageId,
      Labels: {
        'io.aegir.app.id': appId
      }
    };
    return this._containers.createContainer(containerOpts)
      .then(() => { appId })
    ;
  }

  start(appId) {
    return this._findAppContainer(appId)
      .then(container => {
        return this._containers.startContainer(container.Id)
          .then(() => { appId })
        ;
      })
    ;
  }

  stop(appId) {
    return this._findAppContainer(appId)
      .then(container => {
        return this._containers.stopContainer(container.Id)
          .then(() => { appId })
        ;
      })
    ;
  }

  _findAppContainer(appId) {
    let containers = this._containers;
    let opts = {
      all: 1,
      filters: JSON.stringify({
        label: [
          'io.aegir.app=1',
          'io.aegir.app.id='+appId
        ]
      })
    };
    return containers.fetchContainers(opts)
      .then(results => {
        return results[0];
      })
    ;
  }

}

module.exports = AppsService;
