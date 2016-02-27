/* jshint esnext: true, node: true */
'use strict';

import moment from 'moment';
import React from 'react';

export default class AppCard extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  render() {
    /* jshint ignore:start */
    let app = this.props.app;

    let toggleApp = app.isRunning ? this.handleStopClick : this.handleStartClick;

    let deleteButton = null;
    if(!app.isRunning) {
      deleteButton = (
        <button className="btn btn-danger btn-xs pull-right" onClick={ this.handleDeleteClick }>
          Delete
        </button>
      );
    }

    let footer = (
      <div>
        <div className="btn-group" role="group">
          <button className={ 'btn btn-xs ' + (app.isRunning ? 'btn-warning' : 'btn-success') }
            onClick={ toggleApp }>
            {  app.isRunning ? 'Stop' : 'Start' }
          </button>
        </div>
        {deleteButton}
      </div>
    );

    let header = (
      <span>
        <b>{app.appName}</b> - <small>{app.instanceId}</small>
      </span>
    );

    let adminLink = null;
    if(app.isRunning && app.hasWebAdmin) {
      let adminUrl = `api/apps/${app.instanceId}/admin/`;
      adminLink = (
        <div className="form-group">
          <label className="col-sm-4 control-label">Administration</label>
          <div className="col-sm-8">
            <p className="form-control-static">
              <a href={adminUrl} target="_blank">Accéder à l'administration</a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="panel panel-default" style={this.props.style}>
        <div className="panel-heading">{header}</div>
        <div className="panel-body">
          <form className="form-horizontal form-condensed">
            <div className="form-group">
              <label className="col-sm-4 control-label">Adresse interne</label>
              <div className="col-sm-8">
                <p className="form-control-static">{app.internalIPAddress ? app.internalIPAddress : '--'}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-4 control-label">Création</label>
              <div className="col-sm-8">
                <p className="form-control-static">{moment(app.creationDate).fromNow()}</p>
              </div>
            </div>
            {adminLink}
          </form>
        </div>
        <div className="panel-footer">{footer}</div>
      </div>
    );
    /* jshint ignore:end */
  }

  handleStopClick() {
    if(typeof this.props.onStopClick === 'function') {
      this.props.onStopClick(this.props.app);
    }
  }

  handleStartClick() {
    if(typeof this.props.onStartClick === 'function') {
      this.props.onStartClick(this.props.app);
    }
  }

  handleDeleteClick() {
    if(typeof this.props.onDeleteClick === 'function') {
      this.props.onDeleteClick(this.props.app);
    }
  }

}
