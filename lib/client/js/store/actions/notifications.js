/* jshint esnext: true, node: true, browser: true */
'use strict';

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

function addNotification(message, type) {
  type = type || 'info';
  return { type: ADD_NOTIFICATION, alertType: type, message: message };
}

export default {
  ADD_NOTIFICATION,
  addNotification
};
