/* jshint esnext: true, node: true */
'use strict';
import _ from 'lodash';

const ASYNC_ACTION_FAILED_REGEX = /^(.+)(_FAILED)$/;

export default function notificationsReducer(currState, action) {

  let notifications = currState || [];
  let matches = action.type.match(ASYNC_ACTION_FAILED_REGEX);

  if(matches) {
    let actionKey = matches[1];

  }

  notifications = _.extend([], notifications, { loading: isLoading() });

  return notifications;

}
