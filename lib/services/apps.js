/* jshint esnext: true, node: true */
'use strict';

let path = require('path');
let fs = require('fs');
let schemas = require('../schemas');
let errors = require('../errors');

const JSON_FILE_REGEX = /\.json$/i;
const APP_INSTANCE_REGEX = /^\/aegir-app/i;

class AppsService {

  constructor(appTemplatesDir, containersService) {
    this._appTemplatesDir = appTemplatesDir;
    this._containers = containersService;
  }

  findTemplate(name) {
    return this.fetchAllTemplates()
      .then(templates => {
        for(let tpl, i = 0; (tpl = templates[i]); i++) {
          if(tpl.name === name) {
            return tpl;
          }
        }
        throw new errors.UnknownAppTemplateError(name);
      })
    ;
  }

  fetchAllTemplates() {

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

  instanciate(appTemplate, opts) {
    return new Promise((resolve, reject) => {

      schemas.validate(appTemplate, schemas.AppTemplate);

      let image = appTemplate.image;
      let containers = this._containers;

      containers.pull(image)
        .then(() => containers.run(image))
        .then(res => {
          console.log(res);
          return {};
        })
        .then(resolve)
        .catch(reject)
      ;

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
