/* jshint esnext: true, node: true */
'use strict';
import Actions from '../actions';

export default function appsReducer(currState, action) {

  var apps = currState || [];

  switch(action.type) {

    case Actions.Apps.FETCH_APPS_SUCCESS:
      apps = action.apps;
      break;

  }

  return apps;

}
