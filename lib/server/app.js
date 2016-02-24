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

class App {

  constructor(config) {

    this._config = config;
    this._router = express();
    this._dockerClient = new Docker(config.docker);

    this._configure();

  }

  start() {

    let socketPath = this._config.web.socketPath;
    let port = this._config.web.port;
    let host = this._config.web.host;

    let router = this._router;

    return new Promise((resolve, reject) => {

      if(socketPath) {
        router.listen(socketPath, _listenHandler);
      } else {
        router.listen(port, host, _listenHandler);
      }

      function _listenHandler(err) {
        if(err) return reject(err);
        console.log(
          'Listening on %s',
          socketPath ? `unix://${socketPath}` : `http://${host}:${port}`
        );
        return resolve();
      }

    });

  }

  _configure() {
    this._configureRoutes();
  }

  _configureRoutes() {

    let router = this._router;
    let webConfig = this._config.web;

    router.use(morgan(webConfig.log.format, webConfig.log.options));

    router.use(compression());
    this._configureAPIRoutes();

    router.use('/js', browserifyMiddleware(webConfig.clientBaseDir + '/js', {
      transform: [['babelify', {presets: ['es2015', 'react']}]],
      settings: {
        production: {
          gzip: false
        }
      }
    }));
    router.use(express.static(webConfig.clientBaseDir));
    router.use('/vendor', express.static('./node_modules'));

  }

  _configureAPIRoutes() {

    let router = this._router;

    router.set('json spaces', 2);

    let appsService = this._getAppsService();
    let appsCtrl = new controllers.Apps(appsService);
    let templatesCtrl = new controllers.Templates(appsService);

    router.use('/api/apps', appsCtrl.middleware());
    router.use('/api/templates', templatesCtrl.middleware());

    router.use(middlewares.ErrorMiddleware());

  }

  _getContainersService() {
    return new services.Containers(this._dockerClient);
  }

  _getAppsService() {
    let containersService = this._getContainersService();
    let appsService = new services.Apps(containersService, this._config.apps);
    return appsService;
  }

}

module.exports = App;
