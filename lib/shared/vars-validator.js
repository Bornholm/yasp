/* jshint esnext: true, node: true */
'use strict';

class VarsValidator {

  constructor(appVarsManifest) {
    this._appVarsManifest = appVarsManifest;
  }

  validate(instanceVarsConfig, throwError) {
    // TODO make real validation
    return true;
  }

}

module.exports = VarsValidator;
