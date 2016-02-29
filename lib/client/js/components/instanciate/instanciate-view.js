/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import PortsMapper from './ports-mapper';
import VarsConfigurator from './vars-configurator';
import { translate, Interpolate } from 'react-i18next';
import { Check } from '../../../../shared';

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
      isVarsOK: false,
      canInstanciate: false,
      instanceLabel: '',
      portsMap: null
    };
    this.handlePortsMapChange = this.handlePortsMapChange.bind(this);
    this.handleConfiguratorStatusChange = this.handleConfiguratorStatusChange.bind(this);
    this.handleInstanceLabelChange = this.handleInstanceLabelChange.bind(this);
    this.instanciate = this.instanciate.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let template = this.state.template;

    if(!template) return null;

    let hasVars = Object.keys(template.vars).length > 0;

    let varsConfig = null;

    if(hasVars) {
      varsConfig = (
        <div>
          <div className="alert alert-info">{t('vars_config_explanation')}</div>
          <VarsConfigurator ref="varsConfigurator" template={template}
            onStatusChange={this.handleConfiguratorStatusChange} />
        </div>
      );
    } else {
      varsConfig = (
        <div className="alert alert-info"><i className="fa fa-info-circle" style={{marginRight: '5px'}}></i>{t('no_vars')}</div>
      );
    }

    return (
      <div className="col-md-8 col-md-offset-2">
        <Interpolate i18nKey="instanciate_app" parent="h3" appName={template.appName} />

        <div className="panel-group" id="instanciateContainer" role="tablist" aria-multiselectable="true">

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="instanceLabelHeading">
              <h4 className="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#instanciateContainer" href="#instanceLabel" aria-expanded="true" aria-controls="instanceLabel">
                1. {t('instance_label')}<i className="fa fa-tag inline-icon"></i>
                </a>
              </h4>
            </div>
            <div id="instanceLabel" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="instanceLabelHeading">
              <div className="panel-body">
                <input className="form-control" onChange={this.handleInstanceLabelChange} placeholder={t('instance_label_placeholder')}/>
              </div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="customParamsHeading">
              <h4 className="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#instanciateContainer" href="#customParams" aria-expanded="true" aria-controls="customParams">
                2. {t('configuration')}<i className="fa fa-pencil-square-o inline-icon"></i>
                </a>
              </h4>
            </div>
            <div id="customParams" className="panel-collapse collapse" role="tabpanel" aria-labelledby="customParamsHeading">
              <div className="panel-body">{varsConfig}</div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="portsMapperHeading">
              <h4 className="panel-title">
                <a role="button" className="collapsed" data-toggle="collapse" data-parent="#instanciateContainer" href="#portsMapper" aria-expanded="false" aria-controls="portsMapper">
                3. {t('network')}<i className="fa fa-server inline-icon"></i>
                </a>
              </h4>
            </div>
            <div id="portsMapper" className="panel-collapse collapse" role="tabpanel" aria-labelledby="portsMapperHeading">
              <div className="panel-body">
                <div className="alert alert-info"><i className="fa fa-info-circle" style={{marginRight: '5px'}}></i>{t('ports_mapping_explanation')}</div>
                <PortsMapper ports={template.ports} onPortsMapChange={this.handlePortsMapChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <button className="btn btn-success pull-right"
            onClick={this.instanciate}
            disabled={!this.state.canInstanciate}>
            {t('instanciate')}<i className="fa inline-icon fa-floppy-o"></i>
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

  componentDidUpdate() {
    let { instanceLabel, isVarsOK, canInstanciate } = this.state;
    let hasVars = this.props.template && Object.keys(this.props.template.vars).length > 0;
    let newResult = !Check.isBlank(instanceLabel) && (isVarsOK || !hasVars);
    if(newResult !== canInstanciate) this.setState({canInstanciate: newResult});
  }

  instanciate() {

    let varsConfigurator = this.refs.varsConfigurator;

    let portsMap = this.state.portsMap;
    let varsConfig = varsConfigurator ? varsConfigurator.getConfig() : null;
    let instanceLabel = this.state.instanceLabel;

    let template = this.state.template;

    this.props.dispatch(Actions.Apps.instanciate(
        template.id,
        {
          vars: varsConfig,
          ports: portsMap,
          instanceLabel: instanceLabel
        }
      ))
      .then(() => this.context.router.push('/apps'))
    ;

  }

  handleInstanceLabelChange(evt) {
    let instanceLabel = evt.target.value;
    this.setState({instanceLabel});
  }

  handleConfiguratorStatusChange(isValid) {
    this.setState({isVarsOK: isValid});
  }

  handlePortsMapChange(portsMap) {
    this.setState({portsMap});
  }

}

InstanciateView.contextTypes = {
  router: React.PropTypes.object
};

export default translate(['instanciate'])(connect(InstanciateView.select)(InstanciateView));
