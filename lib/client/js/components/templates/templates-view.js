/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import FlexLayout from '../flex-layout';
import { Link } from 'react-router';
import moment from 'moment';
import { translate } from 'react-i18next';

class TemplatesView extends React.Component {

  static select(state) {
    return {
      templates: state.templates
    };
  }

  constructor() {
    super();
    this.state = {};
    this.onRefreshClick = this.onRefreshClick.bind(this);
  }

  render() {

    let t = this.props.t;
    let templates = this.props.templates || [];

    let cardStyle = {
      margin: '10px 5px 0 0',
      width: '250px'
    };

    let cards = templates.map(template => {
      return (
        /* jshint ignore:start */
        <div className="panel panel-default" key={template.id} style={cardStyle}>
          <div className="panel-heading">
            <span><b>{template.appName}</b> - <small>{ moment(template.creationDate).calendar() }</small></span>
          </div>
          <div className="panel-body">
            {template.appDescription}
          </div>
          <div className="panel-footer">
            <Link className="btn btn-primary btn-sm" to={`/instanciate/${template.id}`}>{t('instanciate')}<i className="fa inline-icon fa-plus"></i></Link>
          </div>
        </div>
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <div>
        <div className="clearfix">
          <div className="btn-group pull-right" role="group">
            <button className="btn btn-info btn-sm" onClick={this.onRefreshClick}>{t('refresh')}<i className="fa fa-refresh inline-icon"></i></button>
          </div>
        </div>
        <FlexLayout>
          {cards}
        </FlexLayout>
      </div>
      /* jshint ignore:end */
    );

  }

  componentWillMount() {
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

  onRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

}

export default translate(['templates'])(connect(TemplatesView.select)(TemplatesView));
