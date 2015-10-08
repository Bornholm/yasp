/* jshint esnext: true, node: true */
'use strict';

exports.AppTemplate = require('./app-template');
exports.InstanceRequest = require('./instance-request');

// Create validator instance
let Validator = require('jsonschema').Validator;
let validator = new Validator();

// Configure validator with Aegir schemas
validator.addSchema('/AppTemplate', exports.AppTemplate);
validator.addSchema('/InstanceRequest', exports.InstanceRequest);

exports.validate = function(instance, schema, opts) {
  opts = opts || {};
  opts.throwError = 'throwError' in opts ? opts.throwError : true;
  return validator.validate(instance, schema, opts);
};
