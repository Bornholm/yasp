/* jshint esnext: true, node: true */
'use strict';

let Controller = require('./controller');
let schemas = require('../schemas');
let errors = require('../errors');

class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
  }

  listImages(req, res, next) {
    this._apps.listAvailableImages()
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
    this._apps.start(instanceId)
      .then(result => res.status(200).send(result))
      .catch(next)
    ;
  }

  stopInstance(req, res, next) {
    let instanceId = req.params.instanceId;
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

  bindTo(app) {
    app.get('/', this.listInstances.bind(this));
    app.post('/', this.createInstance.bind(this));
    app.post('/:instanceId/start', this.startInstance.bind(this));
    app.post('/:instanceId/stop', this.stopInstance.bind(this));
    app.get('/images', this.listImages.bind(this));
  }

}

module.exports = AppsController;
