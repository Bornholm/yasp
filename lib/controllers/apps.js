/* jshint esnext: true, node: true */
'use strict';

let httpProxy = require('http-proxy');
let path = require('path');
let fs = require('fs');
let Controller = require('./controller');
let schemas = require('../schemas');
let errors = require('../errors');
let YaspConst = require('../util').YaspConst;
let bodyParser = require('body-parser');

class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
    this._servicesProxy = httpProxy.createProxyServer();
  }

  listImages(req, res, next) {
    this._apps.listAvailableImages(true)
      .then(images => res.status(200).send(images))
      .catch(next)
    ;
  }

  listInstances(req, res, next) {
    this._apps.listInstances()
      .then(instances => res.status(200).send(instances))
      .catch(next)
    ;
  }

  startInstance(req, res, next) {
    let instanceId = req.params.instanceId;
    // TODO validate instanceId format
    this._apps.start(instanceId)
      .then(result => res.status(200).send(result))
      .catch(next)
    ;
  }

  stopInstance(req, res, next) {
    let instanceId = req.params.instanceId;
    // TODO validate instanceId format
    this._apps.stop(instanceId)
      .then(result => res.status(200).send(result))
      .catch(next)
    ;
  }

  createInstance(req, res, next) {

    var instanceRequest = req.body;

    // TODO Create a real INSTANCE_REQUEST schema & test
    try {
      schemas.validate(instanceRequest, schemas.INSTANCE_REQUEST);
    } catch(err) {
      return next(new errors.BadRequestError(err.message));
    }

    let vars = instanceRequest.vars;
    let ports = instanceRequest.ports;
    let instanceId = instanceRequest.instanceId;

    this._apps.instanciate(instanceRequest.imageId, { vars, ports, instanceId })
      .then(appInstance => res.status(200).send(appInstance))
      .catch(next)
    ;

  }

  showServiceAdmin(req, res, next) {

    let instanceId = req.params.instanceId;
    let proxy = this._servicesProxy;

    let appDataDir = this._apps.getAppDataDir(instanceId);
    let socketPath = path.join(appDataDir, YaspConst.YASP_ADMIN_SOCKET);

    // TODO assert that apps is declared as a service

    fs.exists(socketPath, (exists) => {
      if(!exists) return res.status(404).end();
      // Rewrite URL and remove rp prefix
      req.url = req.url.replace(new RegExp(`^/${instanceId}/admin`), '');
      proxy.web(req, res, { target: {socketPath} }, next);
    });

  }

  bindTo(app) {
    app.get('/', bodyParser.json(), this.listInstances.bind(this));
    app.post('/', bodyParser.json(), this.createInstance.bind(this));
    app.all('/:instanceId/admin/*', this.showServiceAdmin.bind(this));
    app.post('/:instanceId/start', this.startInstance.bind(this));
    app.post('/:instanceId/stop', this.stopInstance.bind(this));
    app.get('/images', bodyParser.json(), this.listImages.bind(this));
  }

}

module.exports = AppsController;
