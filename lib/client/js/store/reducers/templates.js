/* jshint esnext: true, node: true */
'use strict';
import Actions from '../actions';

export default function templatesReducer(currState, action) {

  var templates = currState || [];

  switch(action.type) {

    case Actions.Apps.FETCH_TEMPLATES_SUCCESS:
      templates = action.templates;
      break;

  }

  return templates;

}
