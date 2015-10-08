/* jshint esnext: true, node: true */

'use strict';

let Aegir = require('./lib/aegir');
let config = require('./lib/config');

let app = new Aegir(config);

app.checkTemplates()
  .then(() => app.listen())
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
;
