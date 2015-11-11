/* jshint esnext: true, node: true */
'use strict';

var BaseError = require('./base-error');

class BadRequestError extends BaseError {

  constructor(message) {
    super(message);
    this.status = 400;
  }

}

module.exports = BadRequestError;
