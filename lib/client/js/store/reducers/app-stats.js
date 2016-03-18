/* jshint esnext: true, node: true */
'use strict';
import Actions from '../actions';
import update from 'react-addons-update';

const MAX_STATS_ITEMS = 60;

export default function appStatsReducer(currState, action) {

  var stats = currState || {};

  switch(action.type) {

    case Actions.Apps.UPDATE_APPS_STATS:

      let instanceId = action.instanceId;
      let appStats = stats[instanceId] =  stats[instanceId] || [];

      let updateQuery = { $push: [action.stats] };
      if(appStats.length >= MAX_STATS_ITEMS) updateQuery.$splice = [[0, 1]];
      stats = update(stats, { [instanceId]: updateQuery });

      break;

  }

  return stats;

}
