/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import update from 'react-addons-update';
import BaseGraph from './base-graph';
import { translate } from 'react-i18next';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory';

class NetworkGraph extends BaseGraph {

  constructor() {
    super();
    this.state = {};
    this.outputStyle = update(this.lineStyle, { data:{ stroke:{ $set: 'blue' }}});
    this.inputStyle = update(this.lineStyle, { data:{ stroke:{ $set: 'red' }}});
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let stats = this.props.stats;

    if(!stats || stats.length < 2) return (<div></div>);

    let lastEntry = stats[stats.length-1];

    let ioRate = stats.reduce((ioRate, e, i) => {
      if(i === 0) return ioRate;
      let ee = stats[i-1];
      let eIO = this._getTotalIO(ee.networks);
      let eeIO = this._getTotalIO(e.networks);
      let x = (new Date(e.read)).getTime();
      let timeDelta = x - (new Date(ee.read)).getTime()/1000;
      ioRate.output.push({x: x, y: (eeIO.output - eIO.output)/timeDelta});
      ioRate.input.push({x: x, y: (eeIO.input - eIO.input)/timeDelta});
      return ioRate;
    }, { output: [], input: []});

    let currentIORate = {
      input: ioRate.input[ioRate.input.length-1].y,
      output: ioRate.output[ioRate.output.length-1].y
    };

    return (
      <div className="panel panel-default" style={this.cardStyle}>
        <div className="panel-heading">
          <span>{t('network_use')}</span>
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
                dependentAxis />
              <VictoryLine
                style={this.outputStyle} data={ioRate.output} />
              <VictoryLine
                style={this.inputStyle} data={ioRate.input} />
            </VictoryChart>
          </div>
        </div>
        <div className="panel-footer clearfix">
          <div className="pull-left">
            <b>{t('input_rate')}:&nbsp;</b><span>{currentIORate.input.toFixed(2)}kb/s</span>
          </div>
          <div className="pull-right">
            <b>{t('output_rate')}:&nbsp;</b><span>{currentIORate.output.toFixed(2)}kb/s</span>
          </div>
        </div>
      </div>
    );
  }
  /* jshint ignore:end */

  _getTotalIO(networks) {
    let output = 0;
    let input = 0;
    Object.keys(networks).forEach(netInt => {
      let interfaceData = networks[netInt];
      output += interfaceData.tx_bytes;
      input += interfaceData.rx_bytes;
    });
    output /= 1024;
    input /= 1024;
    return {output, input};
  }

}

export default translate(['network-graph'])(NetworkGraph);
