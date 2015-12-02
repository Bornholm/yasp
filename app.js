/* jshint esnext: true, node: true */

'use strict';

let Yasp = require('./lib/yasp');
let config = require('./lib/config');

let app = new Yasp(config);

app.listen()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
;
