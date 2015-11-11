/* jshint esnext: true, node: true */
'use strict';

let validate = require('jsonschema').validate;

exports.APP_CONFIG = require('./app-config');

exports.validate = function(instance, schema) {
  return validate(instance, schema, { throwError: true });
};
