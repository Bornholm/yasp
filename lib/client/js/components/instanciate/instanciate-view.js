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
    this.instanciate = this.instanciate.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let template = this.state.template;

    if(!template) return null;

    return (
      <div>
        <h2>Instancier "{template.appName}"</h2>
        <div className="panel-group" id="instanciate-container" role="tablist" aria-multiselectable="true">

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
                <div className="alert alert-info">
                  Voici la liste des variables de configuration disponibles dans votre application. Vous pouvez modifier ici leur valeur
                  afin de personnaliser le comportement de votre nouvelle instance.
                </div>
                <VarsConfigurator ref="varsConfigurator" template={template}
                  onStatusChange={this.handleConfiguratorStatusChange} />
              </div>
            </div>
          </div>

          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="portsMapperHeading">
              <h4 className="panel-title">
                <a role="button" className="collapsed" data-toggle="collapse" data-parent="#instanciate-container" href="#portsMapper" aria-expanded="false" aria-controls="portsMapper">
                Réseau
                </a>
              </h4>
            </div>
            <div id="portsMapper" className="panel-collapse collapse" role="tabpanel" aria-labelledby="portsMapperHeading">
              <div className="panel-body">
                <div className="alert alert-info">
                  Vous pouvez configurer ici le plan d'adressage entre les ports de votre application et votre machine hôte.
                </div>
                <PortsMapper ref="portsMapper" ports={template.ports} />
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <button className="btn btn-success pull-right"
            onClick={this.instanciate}
            disabled={!this.state.canInstanciate}>
            Instancier
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

    let portsMapper = this.refs.portsMapper;
    let varsConfigurator = this.refs.varsConfigurator;

    let portsMap = portsMapper.getPortsMap();
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

}

InstanciateView.contextTypes = {
  router: React.PropTypes.object
};

export default connect(InstanciateView.select)(InstanciateView);
