/* jshint esnext: true, node: true */
'use strict';

let Controller = require('./controller');

//  TODO ACL
class TemplatesController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
  }

  listTemplates(req, res, next) {
    this._apps.listAvailableTemplates(true)
      .then(templates => res.status(200).send(templates))
      .catch(next)
    ;
  }

  bindTo(app) {
    app.get('/', this.listTemplates.bind(this));
  }

}

module.exports = TemplatesController;
