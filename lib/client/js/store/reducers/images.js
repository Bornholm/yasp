/* jshint esnext: true, node: true */
'use strict';
import Actions from '../actions';

export default function imagesReducer(currState, action) {

  var images = currState || [];

  switch(action.type) {

    case Actions.Apps.FETCH_IMAGES_SUCCESS:
      images = action.images;
      break;

  }

  return images;

}
