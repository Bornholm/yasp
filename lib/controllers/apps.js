/* jshint esnext: true, node: true */
'use strict';

let Controller = require('./controller');
let schemas = require('../schemas');

class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
  }

  showImages(req, res, next) {

  }

  showInstances(req, res, next) {

    let onlyRunning = 'running' in req.query;

    this._apps.fetchInstances(onlyRunning)
      .then(instances => res.status(200).send(instances))
      .catch(next)
    ;

  }

  createIntance(req, res, next) {

    var instanceRequest = req.body;

    try {
      schemas.validate(instanceRequest, schemas.INSTANCE_REQUEST);
    } catch(err) {
      return next(err);
    }

  }

  bindTo(app) {
    app.get('/', this.showInstances.bind(this));
    app.post('/', this.createIntance.bind(this));
    app.get('/images', this.showImages.bind(this));
  }

}

module.exports = AppsController;
