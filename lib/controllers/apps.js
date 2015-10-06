/* jshint esnext: true, node: true */
'use strict';

var Controller = require('./controller');

class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
  }

  showTemplates(req, res) {
    this._apps.loadTemplates()
      .then(templates => res.status(200).send(templates))
      .catch(err => res.status(500).send(err))
    ;
  }

  showInstances(req, res) {
    let onlyRunning = 'running' in req.query;
    this._apps.fetchInstances(onlyRunning)
      .then(instances => res.status(200).send(instances))
      .catch(err => res.status(500).send(err))
    ;
  }

  bindTo(app) {
    app.get('/', this.showInstances.bind(this));
    app.get('/templates', this.showTemplates.bind(this));
  }

}

module.exports = AppsController;
