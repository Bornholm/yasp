/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import FlexLayout from '../flex-layout';
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
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleInstanciateClick = this.handleInstanciateClick.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let templateGroups = this.groupByAppName(this.props.templates || []);

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let cards = Object.keys(templateGroups).map((appName, cardIndex) => {

      let templateVersions = templateGroups[appName];
      let template = templateVersions[0];

      let versionsOptions = templateVersions
        .sort((t1, t2) => {
          return t1.creationDate < t2.creationDate;
        })
        .map(version => {
          return (
            <option key={'template-version-'+version.tag} value={version.id}>{t(version.tag)}</option>
          );
        })
      ;

      return (
        <div className="panel panel-default" key={template.id} style={cardStyle}>
          <div className="panel-heading">
            <span><b>{template.appName}</b> - <small>{ moment(template.creationDate).calendar() }</small></span>
          </div>
          <div className="panel-body">
            {template.appDescription}
          </div>
          <div className="panel-footer">
            <form className="form-inline text-right" style={{margin: 0}}>
              <select ref={'templateVersionSelect-'+cardIndex}
                className="form-control input-sm">
                {versionsOptions}
              </select>
              <button data-card-index={cardIndex}
                className="btn btn-primary btn-sm input-sm"
                onClick={this.handleInstanciateClick}>
                {t('instanciate')}<i className="fa inline-icon fa-plus"></i>
              </button>
            </form>
          </div>
        </div>

      );
    });

    return (
      <div>
        <div className="clearfix">
          <div className="btn-group pull-right" role="group">
            <button className="btn btn-info btn-sm" onClick={this.handleRefreshClick}>
              {t('refresh')}<i className="fa fa-refresh inline-icon"></i>
            </button>
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
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

  groupByAppName(templates) {
    return templates.reduce((grouped, template) => {
      if(!(template.appName in grouped)) {
        grouped[template.appName] = [template];
      } else {
        grouped[template.appName].push(template);
      }
      return grouped;
    }, {});
  }

  handleRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

  handleInstanciateClick(evt) {
    evt.preventDefault();
    let cardIndex = evt.currentTarget.dataset.cardIndex;
    let versionSelect = ReactDOM.findDOMNode(this.refs['templateVersionSelect-'+cardIndex]);
    let templateId = versionSelect.value;
    this.context.router.push(`/instanciate/${templateId}`);
  }

}

TemplatesView.contextTypes = {
  router: React.PropTypes.object
};

export default translate(['templates-view'])(connect(TemplatesView.select)(TemplatesView));
