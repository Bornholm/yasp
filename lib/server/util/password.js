'use strict';
let sha512crypt = require('sha512crypt-node').sha512crypt;

const ALG_MAP = {
  1: 'md5',
  5: 'sha256',
  6: 'sha512'
};

class PasswordUtil {

  static getPasswordHashAlgorithm(hashHeader) {
    return ALG_MAP[hashHeader];
  }

  static parsePasswordHash(hash) {
    let parts = hash.split('$');
    return {
      header: parts[1],
      algorithm: PasswordUtil.getPasswordHashAlgorithm(parts[1]),
      salt: parts[2],
      hash: parts[3]
    };
  }

  static getSHA512PasswordHash(password, salt) {
    return sha512crypt(password, salt);
  }

}

module.exports = PasswordUtil;