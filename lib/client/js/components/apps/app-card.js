/* jshint esnext: true, node: true */
'use strict';

import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

class AppCard extends React.Component {

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
    let t = this.props.t;

    let toggleApp = app.isRunning ? this.handleStopClick : this.handleStartClick;

    let deleteButton = null;
    if(!app.isRunning) {
      deleteButton = (
        <button className="btn btn-danger btn-xs pull-right" onClick={ this.handleDeleteClick }>
          {t('delete')}<i className="fa inline-icon fa-trash"></i>
        </button>
      );
    }

    let adminLink = null;
    if(app.isRunning && app.hasWebAdmin) {
      let adminUrl = `api/apps/${app.instanceId}/admin/`;
      adminLink = (
        <a className="btn btn-info btn-xs"
          target="_blank" href={adminUrl}>
          {t('administration')}<i className="inline-icon fa fa-cogs"></i>
        </a>
      );
    }

    let footer = (
      <div>
        {adminLink}
        <button className={ 'btn btn-xs ' + (app.isRunning ? 'btn-warning pull-right' : 'btn-success') }
          onClick={ toggleApp }>
          {  app.isRunning ? t('stop') : t('start') }
          <i className={ 'fa inline-icon ' + (app.isRunning ? 'fa-stop' : 'fa-play')}></i>
        </button>
        {deleteButton}
      </div>
    );

    let supervisionLink = (
      <Link className="pull-right" to={`/apps/${app.instanceId}`}>
        <small>{t('app_supervision')}<i className="inline-icon fa fa-line-chart"></i></small>
      </Link>
    );

    let header = (
      <div className="clearfix">
        <b>{app.instanceLabel || app.appName}</b>
        { app.isRunning ? supervisionLink : null }
      </div>
    );

    return (
      <div className="panel panel-default" style={this.props.style}>
        <div className="panel-heading">{header}</div>
        <div className="panel-body">
          <form className="form-horizontal form-condensed">
            <div className="form-group form-group-sm">
              <label className="col-sm-4 control-label">{t('instance_id')}</label>
              <div className="col-sm-8">
                <p className="form-control-static">{app.instanceId}</p>
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-sm-4 control-label">{t('template_name')}</label>
              <div className="col-sm-8">
                <p className="form-control-static">{app.appName}</p>
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-sm-4 control-label">{t('internal_ip_address')}</label>
              <div className="col-sm-8">
                <p className="form-control-static">{app.internalIPAddress ? app.internalIPAddress : '--'}</p>
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-sm-4 control-label">{t('creation_date')}</label>
              <div className="col-sm-8">
                <p className="form-control-static">{moment(app.creationDate).fromNow()}</p>
              </div>
            </div>
          </form>
        </div>
        <div className="panel-footer clearfix">{footer}</div>
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

export default translate(['app-card'])(AppCard);
