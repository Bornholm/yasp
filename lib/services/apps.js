/* jshint esnext: true, node: true */
'use strict';

let path = require('path');
let fs = require('fs');
let schemas = require('../schemas');

const JSON_FILE_REGEX = /\.json$/i;
const APP_INSTANCE_REGEX = /^\/aegir-app/i;

class AppsService {

  constructor(appTemplatesDir, containersService) {
    this._appTemplatesDir = appTemplatesDir;
    this._containers = containersService;
  }

  loadTemplates() {

    let appTemplatesDir = this._appTemplatesDir;

    return this._findJSONFiles(appTemplatesDir)
      .then(files => {
        let promises = files.map(file => {
          let filePath = path.join(appTemplatesDir, file);
          return this._loadJSONFile(filePath);
        });
        return Promise.all(promises);
      })
    ;

  }

  fetchInstances(onlyRunning) {
    return this._containers.fetchList(onlyRunning)
      .then(containers => {
        return containers.filter(container => {
          return container.Names.reduce((result, name) => {
            return result || APP_INSTANCE_REGEX.test(name);
          }, false);
        });
      })
    ;
  }

  instanciate(appTemplate, appConfig) {
    return new Promise((resolve, reject) => {

      schemas.validate(schemas.APP_TEMPLATE, appTemplate);
      schemas.validate(schemas.APP_CONFIG, appConfig);

      let image = appTemplate.image;

      this._containers.run(image)
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

  _findJSONFiles(dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if(err) return reject(err);
        files = files.filter(file => JSON_FILE_REGEX.test(file));
        return resolve(files);
      });
    });
  }

  _loadJSONFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: 'utf8' }, (err, content) => {
        if(err) return reject(err);
        let json;
        try {
          json = JSON.parse(content);
        } catch(err) {
          return reject(err);
        }
        return resolve(json);
      });
    });
  }

}

module.exports = AppsService;
