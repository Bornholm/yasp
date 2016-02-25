'use strict';

let PasswordUtil = require('../../lib/server/util/password');

// Generated with `mkpasswd -m sha-512 foo`
const HASH_TARGET = '$6$lMz.xg22jsaI5x$z.ckseUI25GAmMO5Qr2ZhyybdCXLTTILx7dforWpVlP7X3EVTipML7ZdQg50aT0nrrhItPnh5xLvBHhidnJe..';

exports.generatePasswordHash = function(test) {

  let result = PasswordUtil.parsePasswordHash(HASH_TARGET);

  test.equals(result.algorithm, 'sha512');

  let generatedHash = PasswordUtil.getSHA512PasswordHash('foo', result.salt);

  test.equals(HASH_TARGET, generatedHash);

  test.done();
};