/* jshint esnext: true, node: true */
'use strict';

var BaseError = require('./base-error');

class InstanceAlreadyExistsError extends BaseError {

  constructor(instanceId) {
    super(`The instance "${instanceId} already exists !"`);
    this.status = 400;
    this.data = {instanceId};
  }

}

module.exports = InstanceAlreadyExistsError;
