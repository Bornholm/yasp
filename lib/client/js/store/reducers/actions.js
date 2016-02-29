/* jshint esnext: true, node: true */
'use strict';
import _ from 'lodash';

const ASYNC_ACTION_START_REGEX = /^(.+)_ASYNC$/;
const ASYNC_ACTION_FINISH_REGEX = /^(.+)(_FAILED|_SUCCESS)$/;

let pendingActions = {};
function isLoading() {
  for(let key in pendingActions) {
    if(pendingActions.hasOwnProperty(key)) {
      if(pendingActions[key] > 0) return true;
    }
  }
  return false;
}

function updatePendingActions(action) {
  let actionKey;
  let matches = action.type.match(ASYNC_ACTION_START_REGEX);

  if(matches) {
    actionKey = pendingActions[1];
    pendingActions[actionKey] = actionKey in pendingActions ? pendingActions[actionKey] + 1 : 1;
  } else {
    matches = action.type.match(ASYNC_ACTION_FINISH_REGEX);
    if(matches) {
      actionKey = pendingActions[1];
      pendingActions[actionKey] = actionKey in pendingActions ? pendingActions[actionKey] - 1 : 0;
    }
  }
}

export default function actionsReducer(currState, action) {

  let actions = currState || null;

  updatePendingActions(action);

  actions = _.extend({}, actions, { loading: isLoading() });

  return actions;

}
