/* jshint esnext: true, node: true */
'use strict';

var BaseError = require('../../shared/base-error');

class DockerError extends BaseError {

  constructor(message) {
    super(message);
    this.status = 500;
  }

}

module.exports = DockerError;
