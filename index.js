/* jshint esnext: true, node: true */
'use strict';

let config = require('./lib/server/config');
let App = require('./lib/server/app');

let app = new App(config);

app.start();
