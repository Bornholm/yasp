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

  showImages(req, res, next) {
    this._apps.fetchAvailableImages()
      .then(images => res.status(200).send(images))
      .catch(next)
    ;
  }

  showInstances(req, res, next) {
    this._apps.fetchInstances()
      .then(instances => res.status(200).send(instances))
      .catch(next)
    ;
  }

  startInstance(req, res, next) {
    let instanceId = req.param('instanceId');
    this._apps.start(instanceId)
      .then(result => res.status(200).send(result))
      .catch(next)
    ;
  }

  stopInstance(req, res, next) {
    let instanceId = req.param('instanceId');
    this._apps.stop(instanceId)
      .then(result => res.status(200).send(result))
      .catch(next)
    ;
  }

  createInstance(req, res, next) {

    var instanceRequest = req.body;

    try {
      schemas.validate(instanceRequest, schemas.INSTANCE_REQUEST);
    } catch(err) {
      return next(new errors.BadRequestError(err.message));
    }

    this._apps.instanciate(instanceRequest.imageId)
      .then(appInstance => res.status(200).send(appInstance))
      .catch(next)
    ;

  }

  bindTo(app) {
    app.get('/', this.showInstances.bind(this));
    app.post('/', this.createInstance.bind(this));
    app.post('/:instanceId/start', this.startInstance.bind(this));
    app.post('/:instanceId/stop', this.stopInstance.bind(this));
    app.get('/images', this.showImages.bind(this));
  }

}

module.exports = AppsController;
