/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import PortsMapper from './ports-mapper';
import VarsConfigurator from './vars-configurator';

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
      canInstanciate: false
    };
    this.handleConfiguratorStatusChange = this.handleConfiguratorStatusChange.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let template = this.state.template;

    if(!template) return null;

    return (
      <div>
        <h2>Instancier "{template.appName}"</h2>
        <div className="panel-group" id="#instanciate-container" role="tablist" aria-multiselectable="true">
          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="customParamsHeading">
              <h4 className="panel-title">
                <a role="button" data-toggle="collapse" data-parent="#instanciate-container" href="#customParams" aria-expanded="true" aria-controls="customParams">
                Paramétrage
                </a>
              </h4>
            </div>
            <div id="customParams" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="customParamsHeading">
              <div className="panel-body">
                <VarsConfigurator ref="varsConfigurator" template={template}
                  onStatusChange={this.handleConfiguratorStatusChange} />
              </div>
            </div>
          </div>
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

    let portsMapper = this.refs.portsMapper;
    let varsConfigurator = this.refs.varsConfigurator;

    let portsMap = portsMapper.getPortsMap();
    let varsConfig = varsConfigurator.getConfig();

    let template = this.state.selectedTemplate;

    this.props.dispatch(Actions.Apps.instanciate(
        template.id,
        {
          vars: varsConfig,
          ports: portsMap
        }
      ))
    ;

  }

  handleConfiguratorStatusChange(isValid) {
    this.setState({canInstanciate: isValid});
  }

}

export default connect(InstanciateView.select)(InstanciateView);
