/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryPie } from 'victory';

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

    let lastEntry = stats[stats.length - 1];
    let totalUsage = lastEntry.cpu_stats.cpu_usage.total_usage;
    let cpuUsage = lastEntry.cpu_stats.cpu_usage.percpu_usage
      .map((cpu, i) => {
        let percent = (cpu/totalUsage).toFixed(0);
        return { x: `CPU ${i} - ${percent}%`, y: cpu};
      })
    ;

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <VictoryPie innerRadius={100} startAngle={-90} endAngle={90}
              animate={{velocity: 0.02}} data={cpuUsage} />
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
