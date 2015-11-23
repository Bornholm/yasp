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
    images: state.images
  };
}

class ImagesTab extends React.Component {

  constructor() {
    super();
    this.state = {
      showInstanceModal: false,
      selectedImage: null,
      canInstanciate: false
    };

    this.openInstanceModal = this.openInstanceModal.bind(this);
    this.closeInstanceModal = this.closeInstanceModal.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.instanciate = this.instanciate.bind(this);
    this.handleConfiguratorStatusChange = this.handleConfiguratorStatusChange.bind(this);

  }

  render() {

    let images = this.props.images || [];
    let selectedImage = this.state.selectedImage || {};

    let cardStyle = {
      margin: '10px 5px 0 0'
    };

    let cards = images.map(img => {
      let footer = (
        /* jshint ignore:start */
        <ButtonGroup>
          <Button bsStyle="primary" bsSize="small" onClick={this.openInstanceConfigurator.bind(this, img)}>
            Instancier
          </Button>
        </ButtonGroup>
        /* jshint ignore:end */
      );
      let header = (
        /* jshint ignore:start */
        <span><b>{img.appName}</b> - <small>{ moment(img.creationDate).calendar() }</small></span>
        /* jshint ignore:end */
      );
      return (
        /* jshint ignore:start */
        <Panel key={img.imageId} header={header} style={cardStyle} footer={footer}>
          {img.appDescription}
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
            <Modal.Title>Configurer {selectedImage.appName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Accordion defaultActiveKey="1">
              <Panel header="Paramétrage" eventKey="1">
                <VarsConfigurator ref="varsConfigurator" image={selectedImage}
                  onStatusChange={this.handleConfiguratorStatusChange} />
              </Panel>
              <Panel header="Réseau" eventKey="2">
                <PortsMapper ref="portsMapper" ports={selectedImage.ports} />
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
    this.props.dispatch(Actions.Apps.fetchImagesList());
  }

  componentWillReceiveProps(nextProps) {
    // If tab is selected, update images list
    if(nextProps.selected && !this.props.selected) {
      this.props.dispatch(Actions.Apps.fetchImagesList());
    }
  }

  onRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchImagesList());
  }

  openInstanceConfigurator(img) {
    this.setState({ selectedImage: img});
    this.openInstanceModal();
  }

  instanciate() {

    let portsMapper = this.refs.portsMapper;
    let varsConfigurator = this.refs.varsConfigurator;

    let portsMap = portsMapper.getPortsMap();
    let varsConfig = varsConfigurator.getConfig();

    let image = this.state.selectedImage;

    this.props.dispatch(Actions.Apps.instanciate(
        image.imageId,
        {
          vars: varsConfig,
          ports: portsMap
        }
      ))
      .then(res => {
        this.closeInstanceModal();
        this.setState({ selectedImage: null });
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

export default connect(select)(ImagesTab);
