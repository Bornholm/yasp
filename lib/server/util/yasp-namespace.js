/* jshint esnext: true, node: true */
'use strict';

const ROOT = 'io.yasp';
const APP_ENABLED = ROOT + '.app.enabled';
const APP_ID = ROOT + '.app.id';
const APP_NAME = ROOT + '.app.name';
const APP_DESCRIPTION = ROOT + '.app.description';

const APP_VARS = ROOT + '.app.vars';
const APP_VARS_LABEL = varName => `${ROOT}.app.vars.${varName}.label`;
const APP_VARS_DESCRIPTION = varName => `${ROOT}.app.vars.${varName}.description`;
const APP_VARS_DEFAULT_VALUE = varName => `${ROOT}.app.vars.${varName}.defaultValue`;
const APP_VARS_ENV = varName => `${ROOT}.app.vars.${varName}.env`;

module.exports = {
  ROOT,
  APP_ENABLED,
  APP_ID,
  APP_NAME,
  APP_DESCRIPTION,
  APP_VARS,
  APP_VARS_ENV,
  APP_VARS_DESCRIPTION,
  APP_VARS_DEFAULT_VALUE,
  APP_VARS_ENV
};
