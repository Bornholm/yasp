/* jshint esnext: true, node: true */
'use strict';
import update from 'react-addons-update';
import Actions from '../actions';
import i18n from '../../i18n';

const ASYNC_ACTION_FAILED_REGEX = /^.+(_FAILED)$/;

export default function notificationsReducer(currState, action) {

  let notifications = currState || [];

  switch(action.type) {
    case Actions.Notifications.ADD_NOTIFICATION:
      let notification = {
        type: action.alertType,
        message: action.message
      };
      notifications = update(notifications, {$push: [notification]});
      break;
  }

  // Check for async failed actions
  let matches = action.type.match(ASYNC_ACTION_FAILED_REGEX);

  if(matches) { // Create localized notification on error
    let error = action.error;
    let key = 'originalErrorName' in error ?
      [error.originalErrorName, error.message] :
      error.message
    ;
    let translateOpts = update('data' in error ? error.data : {}, {
      ns: {$set: 'errors'},
      defaultValue: {$set: error.message}
    });
    let notification = {
      type: 'danger',
      message: i18n.t(key, translateOpts)
    };
    notifications = update(notifications, {$push: [notification]});
  }

  return notifications;

}
