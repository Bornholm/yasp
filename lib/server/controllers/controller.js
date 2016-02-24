/* jshint esnext: true, node: true */
'use strict';

let express = require('express');

class Controller {

  middleware() {
    let app = express();
    this.bindTo(app);
    return app;
  }

  bindTo(app) {
    throw new Error('Must be implemented by subclasses !');
  }

}

module.exports = Controller;
