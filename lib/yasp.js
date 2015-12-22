/* jshint esnext: true, node: true */

'use strict';

let express = require('express');
let compression = require('compression');
let browserifyMiddleware = require('browserify-middleware');
let morgan = require('morgan');
let Docker = require('dockerode');
let services = require('./services');
let controllers = require('./controllers');
let middlewares = require('./middlewares');
let schemas = require('./schemas');

class Yasp {

  constructor(config) {
    this._config = config;
    this._app = express();
    this._dockerClient = new Docker(config.docker);
    this._configureRoutes();
  }

  listen(port, host) {

    port = port || this._config.webApp.port;
    host = host || this._config.webApp.host;

    let app = this._app;

    return new Promise((resolve, reject) => {
      app.listen(port, host, (err) => {
        if(err) return reject(err);
        console.log('Listening on %s://%s:%s/', 'http', host, port);
        resolve();
      });
    });

  }

  _configureRoutes() {

    let app = this._app;
    let webAppConfig = this._config.webApp;

    app.use(morgan(webAppConfig.log.format, webAppConfig.log.options));

    app.use(compression());
    this._configureAPIRoutes();

    app.use('/js', browserifyMiddleware(webAppConfig.clientBaseDir + '/js', {
      transform: [['babelify', {presets: ['es2015', 'react']}]],
      settings: {
        production: {
          gzip: false
        }
      }
    }));
    app.use(express.static(webAppConfig.clientBaseDir));
    app.use('/vendor', express.static('./node_modules'));

  }

  _configureAPIRoutes() {

    let app = this._app;

    app.set('json spaces', 2);

    let appsService = this._getAppsService();
    let appsCtrl = new controllers.Apps(appsService);
    let templatesCtrl = new controllers.Templates(appsService);

    app.use('/api/apps', appsCtrl.middleware());
    app.use('/api/templates', templatesCtrl.middleware());

    app.use(middlewares.ErrorMiddleware());

  }

  _getContainersService() {
    return new services.Containers(this._dockerClient);
  }

  _getAppsService() {
    let containersService = this._getContainersService();
    let volumesDir = this._config.volumesDir;
    let appsService = new services.Apps(containersService, volumesDir);
    return appsService;
  }

}

module.exports = Yasp;
