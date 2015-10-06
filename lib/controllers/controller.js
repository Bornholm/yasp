/* jshint esnext: true, node: true */
'use strict';

var express = require('express');

class Controller {

  middleware() {
    let app = express();
    this.bindTo(app);
    return app;
  }

  bindTo() {
    throw new Error('This method should be implemented by child classes.');
  }

}

module.exports = Controller;
