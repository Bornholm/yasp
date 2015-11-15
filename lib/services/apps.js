/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');
let uuid = require('node-uuid');

class AppsService {

  constructor(containersService) {
    this._containersService = containersService;
  }

  fetchAvailableImages() {
    let opts = {
      all: 0,
      filters: JSON.stringify({ label: ['io.aegir.app=1'] })
    };
    return this._containersService.fetchImages(opts)
      .then(images => {
        return images.map(image => {
          let labels = image.Labels || {};
          return {
            imageId: image.Id,
            appName: labels['io.aegir.app.name'] || '',
            appDescription: labels['io.aegir.app.description'] || '',
            vars: this._extractVarsFromLabels(labels)
          };
        });
      })
    ;
  }

  fetchInstances(onlyRunning) {
    let containersService = this._containersService;
    let opts = {
      all: onlyRunning ? 0 : 1,
      filters: JSON.stringify({ label: ['io.aegir.app=1'] })
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
    let appId = uuid.v4();
    let containerOpts = {
      Image: imageId,
      Labels: {
        'io.aegir.app.id': appId
      }
    };
    return this._containersService.createContainer(containerOpts)
      .then(() => { appId })
    ;
  }

  start(appId) {
    return this._findAppContainer(appId)
      .then(container => {
        return this._containersService.startContainer(container.Id)
          .then(() => { appId })
        ;
      })
    ;
  }

  stop(appId) {
    return this._findAppContainer(appId)
      .then(container => {
        return this._containersService.stopContainer(container.Id)
          .then(() => { appId })
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
          'io.aegir.app=1',
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

  _extractVarsFromLabels(labels) {
    let vars = {};
    let varKeyRegex = /^io\.aegir\.app\.vars\.(.+)$/;
    Object.keys(labels).forEach(key => {
      let result = key.match(varKeyRegex);
      if( result ) {
        let varName = result[1];
        let varDefinition = JSON.parse(labels[key]);
        vars[varName] = varDefinition;
      }
    });
    return vars;
  }

}

module.exports = AppsService;
