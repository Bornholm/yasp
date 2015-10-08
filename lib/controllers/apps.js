/* jshint esnext: true, node: true */
'use strict';

let Controller = require('./controller');
let schemas = require('../schemas');

class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
  }

  showTemplates(req, res, next) {
    this._apps.fetchAllTemplates()
      .then(templates => res.status(200).send(templates))
      .catch(next)
    ;
  }

  showInstances(req, res, next) {

    let onlyRunning = 'running' in req.query;

    this._apps.fetchInstances(onlyRunning)
      .then(instances => res.status(200).send(instances))
      .catch(next)
    ;

  }

  createInstance(req, res, next) {

    let instanceRequest = req.body;

    try {
      schemas.validate(instanceRequest, schemas.InstanceRequest);
    } catch(err) {
      return next(err);
    }

    let templateNamespace = instanceRequest.template;
    let apps = this._apps;

    apps.findTemplate(templateNamespace)
      .then(appTemplate => {
        return apps.instanciate(appTemplate);
      })
      .then(appInstance => {
        return res.status(200).send(appInstance);
      })
      .catch(next)
    ;

  }

  bindTo(app) {
    app.get('/', this.showInstances.bind(this));
    app.post('/', this.createInstance.bind(this));
    app.get('/templates', this.showTemplates.bind(this));
  }

}

module.exports = AppsController;
