/* jshint esnext: true, node: true */
'use strict';

class VarsValidator {

  constructor(appVarsManifest) {
    this._appVarsManifest = appVarsManifest;
  }

  validate(instanceVarsConfign, throwError) {
    // TODO make real validation
    return true;
  }

}

module.exports = VarsValidator;
