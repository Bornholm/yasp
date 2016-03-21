/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';

class CPUGraph extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  /* jshint ignore:start */
  render() {

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let lineStyle = {
      data: {
        stroke: 'cyan',
        strokeWidth: 1
      }
    };

    let axisStyle = {
      axis: {
        stroke: '#f7f7f7',
        strokeWidth: 1
      },
      ticks: {
        stroke: '#f7f7f7',
        strokeWidth: 1
      },
      grid: {
        stroke: '#b8b8b8',
        strokeWidth: 0.5
      }
    };

    let t = this.props.t;
    let stats = this.props.stats;

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
      <div className="panel panel-default" style={cardStyle}>
        <div className="panel-heading">
          <span>{t('cpu_use')}</span>
        </div>
        <div className="panel-body">
          <div style={{background: '#333'}}>
            <VictoryChart
              width={380} height={250}
              padding={{left: 45, right: 20, bottom: 30, top: 20}}>
              <VictoryAxis
                style={axisStyle} animate={{velocity: 0.2}}
                tickFormat={this._formatTimeTicks} />
              <VictoryAxis
                style={axisStyle} animate={{velocity: 0.2}}
                tickFormat={ (y) => y.toFixed(2)+'%' }
                dependentAxis />
              <VictoryLine
                interpolation="step"
                animate={{velocity: 0.02}}
                style={lineStyle} data={cpuUsage} />
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

  _formatTimeTicks(x) {
    let d = new Date(x);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }

}

export default translate(['cpu-graph'])(CPUGraph);
