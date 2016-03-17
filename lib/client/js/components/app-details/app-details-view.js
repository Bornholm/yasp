/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';
import FlexLayout from '../flex-layout';

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

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let lineStyle = {
      data: {
        stroke: 'green',
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
      }
    };

    let t = this.props.t;
    let instanceId = this.props.params.instanceId;
    let stats = this.props.appStats[instanceId];

    if(!stats) return (<div></div>);

    let memoryUse = stats.map((entry, i) => {
      let readTimestamp = new Date(entry.read);
      let x =  readTimestamp.getTime() - START_TIMESTAMP;
      let y = (entry.memory_stats.usage/entry.memory_stats.limit)*100;
      return {x, y};
    });

    let lastEntry = stats[stats.length-1];
    let currentMemoryUse = lastEntry.memory_stats.usage/1024/1024;
    let currentMemoryUsePercent = (lastEntry.memory_stats.usage/lastEntry.memory_stats.limit)*100;

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h4>Statistiques pour "<span>{instanceId}</span>"</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FlexLayout>
              <div className="panel panel-default" style={cardStyle}>
                <div className="panel-heading">
                  <span>{t('memory_use')}</span>
                </div>
                <div className="panel-body">
                  <div style={{background: '#333'}}>
                    <svg width={380} height={300}>
                      <VictoryChart
                        standalone={false}
                        width={380} height={300}
                        padding={{left: 30, right: 20, bottom: 30, top: 20}}
                        domain={{y: [0, 100]}}>
                        <VictoryLine style={lineStyle} data={memoryUse} />
                        <VictoryAxis style={axisStyle} animate={{velocity: 0.2}} />
                        <VictoryAxis style={axisStyle} animate={{velocity: 0.2}} dependentAxis/>
                      </VictoryChart>
                    </svg>
                  </div>
                </div>
                <div className="panel-footer clearfix">
                  <div className="pull-left">
                    <b>{t('percent_usage')}:&nbsp;</b><span>{currentMemoryUsePercent.toPrecision(2)}%</span>
                  </div>
                  <div className="pull-right">
                    <b>{t('bytes_usage')}:&nbsp;</b><span>{currentMemoryUse}Mb</span>
                  </div>
                </div>
              </div>
              <div className="panel panel-default" style={cardStyle}>
                <div className="panel-heading">
                  <span>{t('cpu_usage')}</span>
                </div>
                <div className="panel-body">
                  <div style={{background: '#333'}}>

                  </div>
                </div>
              </div>
            </FlexLayout>
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
