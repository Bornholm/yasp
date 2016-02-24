/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Panel, Button, ButtonGroup, Modal, Accordion } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Actions } from '../store';
import { FlexLayout, VarsConfigurator, PortsMapper } from '.';
import moment from 'moment';

function select(state) {
  return {
    templates: state.templates
  };
}

class TemplatesTab extends React.Component {

  constructor() {
    super();
    this.state = {
      showInstanceModal: false,
      selectedTemplate: null,
      canInstanciate: false
    };

    this.openInstanceModal = this.openInstanceModal.bind(this);
    this.closeInstanceModal = this.closeInstanceModal.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.instanciate = this.instanciate.bind(this);
    this.handleConfiguratorStatusChange = this.handleConfiguratorStatusChange.bind(this);

  }

  render() {

    let templates = this.props.templates || [];
    let selectedTemplate = this.state.selectedTemplate || {};

    let cardStyle = {
      margin: '10px 5px 0 0',
      width: '250px'
    };

    let cards = templates.map(template => {
      let footer = (
        /* jshint ignore:start */
        <ButtonGroup>
          <Button bsStyle="primary" bsSize="small" onClick={this.openInstanceConfigurator.bind(this, template)}>
            Instancier
          </Button>
        </ButtonGroup>
        /* jshint ignore:end */
      );
      let header = (
        /* jshint ignore:start */
        <span><b>{template.appName}</b> - <small>{ moment(template.creationDate).calendar() }</small></span>
        /* jshint ignore:end */
      );
      return (
        /* jshint ignore:start */
        <Panel key={template.id} header={header} style={cardStyle} footer={footer}>
          {template.appDescription}
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
        <Modal show={this.state.showInstanceModal} onHide={this.closeInstanceModal}>
          <Modal.Header closeButton>
            <Modal.Title>Configurer {selectedTemplate.appName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion defaultActiveKey="1">
              <Panel header="Paramétrage" eventKey="1">
                <VarsConfigurator ref="varsConfigurator" template={selectedTemplate}
                  onStatusChange={this.handleConfiguratorStatusChange} />
              </Panel>
              <Panel header="Réseau" eventKey="2">
                <PortsMapper ref="portsMapper" ports={selectedTemplate.ports} />
              </Panel>
            </Accordion>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeInstanceModal}>Annuler</Button>
            <Button bsStyle="primary" onClick={this.instanciate} disabled={!this.state.canInstanciate}>Créer</Button>
          </Modal.Footer>
        </Modal>
      </div>
      /* jshint ignore:end */
    );

  }

  componentWillMount() {
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

  componentWillReceiveProps(nextProps) {
    // If tab is selected, update templates list
    if(nextProps.selected && !this.props.selected) {
      this.props.dispatch(Actions.Apps.fetchTemplatesList());
    }
  }

  onRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchTemplatesList());
  }

  openInstanceConfigurator(template) {
    this.setState({ selectedTemplate: template});
    this.openInstanceModal();
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
      .then(res => {
        this.closeInstanceModal();
        this.setState({ selectedTemplate: null });
      })
    ;

  }

  openInstanceModal() {
    this.setState({ showInstanceModal : true });
  }

  closeInstanceModal() {
    this.setState({ showInstanceModal : false });
  }

  handleConfiguratorStatusChange(isValid) {
    this.setState({canInstanciate: isValid});
  }

}

export default connect(select)(TemplatesTab);
