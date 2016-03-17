/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import { translate, Interpolate } from 'react-i18next';
import FlexLayout from '../flex-layout';
import MemoryUseGraph from './memory-use-graph';

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

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h4><Interpolate i18nKey="stats_for" instanceId={instanceId} /></h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FlexLayout>
              <MemoryUseGraph stats={stats} />
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
