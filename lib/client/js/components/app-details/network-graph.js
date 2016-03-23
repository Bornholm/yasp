/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import BaseGraph from './base-graph';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';

class NetworkGraph extends BaseGraph {

  constructor() {
    super();
    this.state = {};
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let stats = this.props.stats;

    if(!stats) return (<div></div>);

    let lastEntry = stats[stats.length-1];
    let totalMemory = lastEntry.memory_stats.limit/1024/1024;
    let memoryUse = stats.map((entry, i) => {
      let readTimestamp = new Date(entry.read);
      let x =  readTimestamp.getTime();
      let y = entry.memory_stats.usage/1024/1024;
      return {x, y};
    });

    let currentMemoryUse = lastEntry.memory_stats.usage/1024/1024;
    let currentMemoryUsePercent = (lastEntry.memory_stats.usage/lastEntry.memory_stats.limit)*100;

    return (
      <div className="panel panel-default" style={this.cardStyle}>
        <div className="panel-heading">
          <span>{t('network_use')}</span>
        </div>
        <div className="panel-body">
          <div style={{background: '#333'}}>
            <VictoryChart
              domain={{y:[0, totalMemory]}}
              width={380} height={250}
              padding={{left: 45, right: 20, bottom: 30, top: 20}}>
              <VictoryLine style={this.lineStyle} data={memoryUse} />
              <VictoryAxis
                style={this.axisStyle}
                tickFormat={this._formatTimeTicks} />
              <VictoryAxis
                style={this.axisStyle}
                tickFormat={ (y) => (y/1024).toFixed(1)+'Gb' }
                dependentAxis />
            </VictoryChart>
          </div>
        </div>
        <div className="panel-footer clearfix">
          <div className="pull-left">
            <b>{t('bytes_usage')}:&nbsp;</b><span>{currentMemoryUse.toFixed(2)}Mb</span>
          </div>
          <div className="pull-right">
            <b>{t('percent_usage')}:&nbsp;</b><span>{currentMemoryUsePercent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  }
  /* jshint ignore:end */

  _formatTimeTicks(x) {
    let d = new Date(x);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }

}

export default translate(['network-graph'])(NetworkGraph);
