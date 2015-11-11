/* jshint esnext: true, node: true */
'use strict';

let validate = require('jsonschema').validate;

exports.INSTANCE_REQUEST = require('./instance-request');

exports.validate = function(instance, schema) {
  return validate(instance, schema, { throwError: true });
};
