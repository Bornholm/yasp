/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryPie } from 'victory';

const START_TIMESTAMP = Date.now();

class AppDetailsView extends React.Component {

  static select(state) {
    return {
      appStats: state.appStats
    };
  }

  constructor() {
    super();
    this.state = {};
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let instanceId = this.props.params.instanceId;
    let stats = this.props.appStats[instanceId];

    if(!stats) return (<div></div>);

    let memoryUse = stats.map((entry, i) => {
      let readTimestamp = new Date(entry.read);
      let x =  readTimestamp.getTime() - START_TIMESTAMP;
      let y = (entry.memory_stats.usage/entry.memory_stats.limit)*100;
      return {x, y};
    })

    return (
      <div>
        <div className="row">
          <div className="col-md-4">

          </div>
          <div className="col-md-4">
            <VictoryChart domain={{y: [0, 100]}}>
              <VictoryLine style={{data: {stroke: 'green', strokeWidth: 1}}} data={memoryUse} />
            </VictoryChart>
          </div>
        </div>
      </div>
    );
  }
  /* jshint ignore:end */

  componentWillMount() {
    let instanceId = this.props.params.instanceId;
    this.props.dispatch(Actions.Apps.startStatsStreaming(instanceId));
  }

  componentWillUnmount() {
    let instanceId = this.props.params.instanceId;
    this.props.dispatch(Actions.Apps.stopStatsStreaming(instanceId));
  }

}

export default translate(['app-details'])(connect(AppDetailsView.select)(AppDetailsView));
