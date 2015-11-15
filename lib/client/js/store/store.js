/* jshint esnext: true, node: true */
'use strict';

import { applyMiddleware, createStore, combineReducers } from 'redux';
import Reducers from './reducers';
import thunkMiddleware from 'redux-thunk';

let createAppStore = applyMiddleware(
  thunkMiddleware
)(createStore);

let appReducer = combineReducers({
  images: Reducers.Images,
  apps: Reducers.Apps
});

export default createAppStore(appReducer);
