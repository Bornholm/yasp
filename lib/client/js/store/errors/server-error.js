/* jshint esnext: true, node: true */
'use strict';

var BaseError = require('../../../../shared/base-error');

export default class ServerError extends BaseError {

  constructor(name, message, data) {
    super(message);
    this.originalErrorName = name;
    this.data = data;
  }

}