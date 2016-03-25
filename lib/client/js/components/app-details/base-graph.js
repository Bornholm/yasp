/* jshint esnext: true, node: true */
'use strict';

import React from 'react';

class BaseGraph extends React.Component {

  constructor() {
    super();

    this.cardStyle = {
      margin: '10px 5px 0 0'
    };

    this.lineStyle = {
      data: {
        stroke: 'green',
        strokeWidth: 1
      }
    };

    this.axisStyle = {
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

  }

  /* jshint ignore:start */
  render() {
    return null
  }
  /* jshint ignore:end */

  _formatTimeTicks(x) {
    let d = new Date(x);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  _getPreferredBytesUnit(value, treshold) {
    treshold = treshold || 512;
    let units = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
    let index = 0;
    while(value >= treshold && units[index]) {
      value /= 1024;
      index++;
    }
    return { value: value, unit: units[index] };
  }

}

export default BaseGraph;
