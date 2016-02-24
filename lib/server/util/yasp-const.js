/* jshint esnext: true, node: true */
'use strict';

let path = require('path');

const YASP_DEDICATED_VOLUME = '/var/run/yasp';
const YASP_ADMIN_SOCKET = path.join(YASP_DEDICATED_VOLUME, 'admin.sock');

module.exports = {
  YASP_DEDICATED_VOLUME,
  YASP_ADMIN_SOCKET
};
