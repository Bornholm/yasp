var Aegir = require('./lib/aegir');
var config = require('./lib/config');

var app = new Aegir(config);

app.listen();
