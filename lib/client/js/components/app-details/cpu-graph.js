/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import BaseGraph from './base-graph';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';

class CPUGraph extends BaseGraph {

  constructor() {
    super();
    this.state = {};
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let stats = this.props.stats;

    this.lineStyle.data.stroke = 'cyan';

    if(!stats) return (<div></div>);

    let currentCPUUse = '--';
    let cpuUsage = [];

    if(stats.length > 1) {

      cpuUsage = stats.reduce((cpuUsage, e, i) => {
        if(i === 0) return cpuUsage;
        let ee = stats[i-1];
        let cpuDelta = ee.cpu_stats.cpu_usage.total_usage - e.cpu_stats.cpu_usage.total_usage;
        let systemDelta = ee.cpu_stats.system_cpu_usage -e.cpu_stats.system_cpu_usage;
        let y = (((cpuDelta/systemDelta)*e.cpu_stats.cpu_usage.percpu_usage.length)*100);
        let x = (new Date(e.read)).getTime();
        cpuUsage.push({x, y});
        return cpuUsage;
      }, []);

      currentCPUUse = (cpuUsage[cpuUsage.length-1].y).toFixed(2);

    }

    return (
      <div className="panel panel-default" style={this.cardStyle}>
        <div className="panel-heading">
          <span>{t('cpu_use')}</span>
        </div>
        <div className="panel-body">
          <div style={{background: '#333'}}>
            <VictoryChart
              width={380} height={250}
              padding={{left: 45, right: 20, bottom: 30, top: 20}}>
              <VictoryAxis
                style={this.axisStyle}
                tickFormat={this._formatTimeTicks} />
              <VictoryAxis
                style={this.axisStyle}
                tickFormat={ (y) => y.toFixed(2)+'%' }
                dependentAxis />
              <VictoryLine
                style={this.lineStyle} data={cpuUsage} />
            </VictoryChart>
          </div>
        </div>
        <div className="panel-footer clearfix">
          <div className="pull-left">
            <b>{t('percent_usage')}:&nbsp;</b><span>{currentCPUUse}%</span>
          </div>
        </div>
      </div>
    );
  }
  /* jshint ignore:end */

}

export default translate(['cpu-graph'])(CPUGraph);
