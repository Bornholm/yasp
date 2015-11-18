/* jshint esnext: true, node: true */
'use strict';

let ObjectHelpers = require('../../lib/util/object-helpers');

exports.deflaten = function(test) {

  let labels = {
    'io.aegir.app.vars.foo.defaultValue': 'Baz',
    'io.aegir.app.vars.foo.type': 'text',
    'io.aegir.app.vars.foo.label': 'Foo',
    'io.aegir.app.vars.bar.defaultValue': '1',
    'io.aegir.app.vars.bar.type': 'integer',
    'io.aegir.app.vars.bar.label': 'Bar'
  };

  let result = ObjectHelpers.deflaten(labels);

  test.equals(result.io.aegir.app.vars.foo.label, 'Foo', "It should be equal to 'Foo' !");
  test.equals(result.io.aegir.app.vars.bar.defaultValue, '1', "It should be equal to '1' !");

  test.done();

};

exports.pathExists = function(test) {

  let obj = {
    io: {
      aegir: {
        app: {
          vars: {
            foo: {
              defaultValue: 'Baz',
              type: 'text',
              label: 'Foo'
            },
            bar: {
              defaultValue: '1',
              type: 'integer',
              label: 'Bar'
            }
          }
        }
      }
    }
  };

  let result = ObjectHelpers.pathExists(obj, 'io.aegir.app.vars.foo');

  test.ok(result, 'It should return true !')

  result = ObjectHelpers.pathExists(obj, 'io.aegir.app.var');

  test.ok(!result, 'It should return false !')

  test.done();

};
