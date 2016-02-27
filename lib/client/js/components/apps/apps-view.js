/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import FlexLayout from '../flex-layout';
import AppCard from './app-card';

class AppsView extends React.Component {

  static select(state) {
    return {
      apps: state.apps
    };
  }

  constructor() {

    super();
    this.state = {};

    // Bind handlers
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.handleAppDelete = this.handleAppDelete.bind(this);
    this.handleAppStop = this.handleAppStop.bind(this);
    this.handleAppStart = this.handleAppStart.bind(this);

  }

  /* jshint ignore:start */
  render() {

    let apps = this.props.apps || [];

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let cards = apps.map(app => {
      return (
        <AppCard key={app.instanceId}
          style={cardStyle} app={app}
          onDeleteClick={this.handleAppDelete}
          onStopClick={this.handleAppStop}
          onStartClick={this.handleAppStart} />
      );
    });

    return (
      <div>
        <div className="clearfix">
          <div className="btn-group pull-right" role="group">
            <button className="btn btn-info" onClick={this.onRefreshClick}>Actualiser</button>
          </div>
        </div>
        <FlexLayout>
          {cards}
        </FlexLayout>
      </div>
    );
  }
  /* jshint ignore:end */

  componentWillMount() {
    this.props.dispatch(Actions.Apps.fetchAppsList());
  }

  onRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchAppsList());
  }

  handleAppStart(app) {
    this.props.dispatch(Actions.Apps.startApp(app.instanceId))
      .then(() => {
        this.props.dispatch(Actions.Apps.fetchAppsList());
      })
    ;
  }

  handleAppStop(app) {
    this.props.dispatch(Actions.Apps.stopApp(app.instanceId))
      .then(() => {
        this.props.dispatch(Actions.Apps.fetchAppsList());
      })
    ;
  }

  handleAppDelete(app) {
    this.props.dispatch(Actions.Apps.deleteApp(app.instanceId))
      .then(() => {
        this.props.dispatch(Actions.Apps.fetchAppsList());
      })
    ;
  }

}

export default connect(AppsView.select)(AppsView);
