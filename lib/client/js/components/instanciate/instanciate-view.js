/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import PortsMapper from './ports-mapper';
import VarsConfigurator from './vars-configurator';
import { translate, Interpolate } from 'react-i18next';

class InstanciateView extends React.Component {

  static select(state) {
    return {
      templates: state.templates
    };
  }

  constructor() {
    super();
    this.state = {
      template: null,
      canInstanciate: false,
      portsMap: null
    };
    this.handlePortsMapChange = this.handlePortsMapChange.bind(this);
    this.handleConfiguratorStatusChange = this.handleConfiguratorStatusChange.bind(this);
    this.instanciate = this.instanciate.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let template = this.state.template;

    if(!template) return null;

    return (
      <div>
        <Interpolate i18nKey="instanciate_app" parent="h2" appName={template.appName} />
        <div className="panel-group" id="instanciate-container" role="tablist" aria-multiselectable="true">
          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="customParamsHeading">
              <h4 className="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#instanciate-container" href="#customParams" aria-expanded="true" aria-controls="customParams">
                {t('configuration')}
                </a>
              </h4>
            </div>
            <div id="customParams" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="customParamsHeading">
              <div className="panel-body">
                <div className="alert alert-info">{t('vars_config_explanation')}</div>
                <VarsConfigurator ref="varsConfigurator" template={template}
                  onStatusChange={this.handleConfiguratorStatusChange} />
              </div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="portsMapperHeading">
              <h4 className="panel-title">
                <a role="button" className="collapsed" data-toggle="collapse" data-parent="#instanciate-container" href="#portsMapper" aria-expanded="false" aria-controls="portsMapper">
                {t('network')}
                </a>
              </h4>
            </div>
            <div id="portsMapper" className="panel-collapse collapse" role="tabpanel" aria-labelledby="portsMapperHeading">
              <div className="panel-body">
                <div className="alert alert-info">{t('ports_mapping_explanation')}</div>
                <PortsMapper ports={template.ports} onPortsMapChange={this.handlePortsMapChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <button className="btn btn-success pull-right"
            onClick={this.instanciate}
            disabled={!this.state.canInstanciate}>
            {t('instanciate')}
          </button>
        </div>
      </div>
    );
  }
  /* jshint ignore:end */

  componentWillMount() {
    if(this.props.templates.length === 0) {
      this.props.dispatch(Actions.Apps.fetchTemplatesList());
    } else {
      this.findTemplate(this.props.params.templateId, this.props.templates);
    }
  }

  componentWillReceiveProps(nextProps) {
    let templateId = nextProps.params.templateId;
    this.findTemplate(templateId, nextProps.templates);
  }

  findTemplate(templateId, templates) {
    let template = templates.reduce((found, curr) => {
      if(found) return found;
      if(curr.id === templateId) return curr;
    }, null);
    this.setState({template});
  }

  instanciate() {

    let varsConfigurator = this.refs.varsConfigurator;

    let portsMap = this.state.portsMap;
    let varsConfig = varsConfigurator.getConfig();

    let template = this.state.template;

    this.props.dispatch(Actions.Apps.instanciate(
        template.id,
        {
          vars: varsConfig,
          ports: portsMap
        }
      ))
      .then(() => this.context.router.push('/apps'))
    ;

  }

  handleConfiguratorStatusChange(isValid) {
    this.setState({canInstanciate: isValid});
  }

  handlePortsMapChange(portsMap) {
    this.setState({portsMap});
  }

}

InstanciateView.contextTypes = {
  router: React.PropTypes.object
};

export default translate(['instanciate'])(connect(InstanciateView.select)(InstanciateView));
