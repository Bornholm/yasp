/* jshint esnext: true, node: true */
'use strict';

var BaseError = require('./base-error');

class UnknownAppTemplateError extends BaseError {

  constructor(appTemplateName) {
    super('Unknown template "'+appTemplateName+'" !');
    this.status = 400;
  }

}

module.exports = UnknownAppTemplateError;
