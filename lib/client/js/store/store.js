/* jshint esnext: true, node: true */
'use strict';

import { applyMiddleware, createStore, combineReducers } from 'redux';
import Reducers from './reducers';
import thunkMiddleware from 'redux-thunk';

let createAppStore = applyMiddleware(
  thunkMiddleware
)(createStore);

let appReducer = combineReducers({
  templates: Reducers.Templates,
  apps: Reducers.Apps,
  actions: Reducers.Actions,
  notifications: Reducers.Notifications,
  appStats: Reducers.AppStats
});

export default createAppStore(appReducer);
