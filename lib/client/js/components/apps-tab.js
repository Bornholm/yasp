/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Panel, Button, ButtonGroup, FormControls } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Actions } from '../store';
import FlexLayout from './flex-layout';
import moment from 'moment';

function select(state) {
  return {
    apps: state.apps
  };
}

class AppsTab extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.onRefreshClick = this.onRefreshClick.bind(this);
  }

  render() {

    let apps = this.props.apps || [];

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let cards = apps.map(app => {

      let toggleApp = app.isRunning ?
        this.stopApp.bind(this, app.instanceId) :
        this.startApp.bind(this, app.instanceId)
      ;

      let footer = (
        /* jshint ignore:start */
        <ButtonGroup>
          <Button bsStyle={ app.isRunning ? "danger" : "success" } bsSize="small"
            onClick={ toggleApp }>
            {  app.isRunning ? 'Stop' : 'Start' }
          </Button>
        </ButtonGroup>
        /* jshint ignore:end */
      );

      let header = (
        <span>
          <b>{app.appName}</b> - <small>{app.instanceId}</small>
        </span>
      );

      return (
        /* jshint ignore:start */
        <Panel key={app.instanceId} header={header} style={cardStyle} footer={footer}>
          <form className="form-horizontal">
            <FormControls.Static label="Statut" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={app.isRunning ? 'En fonction' : 'Stoppé'} />
            <FormControls.Static label="Date de création" labelClassName="col-xs-3" wrapperClassName="col-xs-9" value={moment(app.creationDate).calendar()} />
          </form>
        </Panel>
        /* jshint ignore:end */
      );

    });

    return (
      /* jshint ignore:start */
      <div>
        <ButtonGroup>
          <Button bsStyle="primary" onClick={this.onRefreshClick}>Actualiser</Button>
        </ButtonGroup>
        <FlexLayout>
          {cards}
        </FlexLayout>
      </div>
      /* jshint ignore:end */
    );

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

  startApp(instanceId) {
    this.props.dispatch(Actions.Apps.startApp(instanceId))
      .then(() => {
        this.props.dispatch(Actions.Apps.fetchAppsList());
      })
    ;
  }

  stopApp(instanceId) {
    this.props.dispatch(Actions.Apps.stopApp(instanceId))
      .then(() => {
        this.props.dispatch(Actions.Apps.fetchAppsList());
      })
    ;
  }

}

export default connect(select)(AppsTab);
