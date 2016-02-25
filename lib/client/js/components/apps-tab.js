/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Actions } from '../store';
import { FlexLayout, AppCard } from '.';

function select(state) {
  return {
    apps: state.apps
  };
}

class AppsTab extends React.Component {

  constructor() {

    super();
    this.state = {};

    // Bind handlers
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.handleAppDelete = this.handleAppDelete.bind(this);
    this.handleAppStop = this.handleAppStop.bind(this);
    this.handleAppStart = this.handleAppStart.bind(this);

  }

  render() {
    /* jshint ignore:start */
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
        <ButtonGroup>
          <Button bsStyle="primary" onClick={this.onRefreshClick}>Actualiser</Button>
        </ButtonGroup>
        <FlexLayout>
          {cards}
        </FlexLayout>
      </div>
    );
    /* jshint ignore:end */
  }

  componentWillMount() {
    this.props.dispatch(Actions.Apps.fetchAppsList());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selected && (!this.props.selected || !this.props)) {
      this.props.dispatch(Actions.Apps.fetchAppsList());
    }
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

export default connect(select)(AppsTab);
