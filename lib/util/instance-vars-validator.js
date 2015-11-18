/* jshint esnext: true, node: true */
'use strict';

class InstanceVarsValidator {

  constructor(appVarsManifest) {
    this._appVarsManifest = appVarsManifest;
  }

  validate(instanceOpts) {
    return true;
  }

}

module.exports = InstanceVarsValidator;
