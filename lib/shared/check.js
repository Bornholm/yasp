'use strict';
class Check {

  static isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

}

module.exports = Check;
