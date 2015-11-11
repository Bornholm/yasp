/* jshint esnext: true, node: true */
'use strict';

let schemas = require('../schemas');

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

    };
    return this._containers.fetchList(opts)
      .then(containers => {
        return containers.filter(container => {
          return container.Names.reduce((result, name) => {
            return result || APP_INSTANCE_REGEX.test(name);
          }, false);
        });
      })
    ;
  }

  instanciate(imageId, appConfig) {
    return new Promise((resolve, reject) => {

      schemas.validate(schemas.APP_CONFIG, appConfig);

      this._containers.run(imageId)
        .then(res => {
          console.log(res);
          return {};
        })
        .then(resolve)
        .catch(reject)
      ;

      return resolve();

    });
  }

}

module.exports = AppsService;
