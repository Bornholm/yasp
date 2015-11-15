/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Panel, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Actions } from '../store';
import InstanceConfigurator from './instance-configurator';
import FlexLayout from './flex-layout';

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
      selectedImage: null
    };

    this.openInstanceModal = this.openInstanceModal.bind(this);
    this.closeInstanceModal = this.closeInstanceModal.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.instanciate = this.instanciate.bind(this);

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
      return (
        /* jshint ignore:start */
        <Panel key={img.imageId} header={img.appName} style={cardStyle} footer={footer}>
          {img.appDescription}
          <br />
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
            <InstanceConfigurator ref="instanceConfigurator" image={selectedImage} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeInstanceModal}>Annuler</Button>
            <Button onClick={this.instanciate}>Créer</Button>
          </Modal.Footer>
        </Modal>
      </div>
      /* jshint ignore:end */
    );

  }

  componentDidMount() {
    this.props.dispatch(Actions.Apps.fetchImagesList());
  }

  onRefreshClick() {
    this.props.dispatch(Actions.Apps.fetchImagesList());
  }

  openInstanceConfigurator(img) {
    this.setState({ selectedImage: img});
    this.openInstanceModal();
  }

  instanciate() {

    let instanceConfigurator = this.refs.instanceConfigurator;
    let instanceConfig = instanceConfigurator.getConfig();
    let image = this.state.selectedImage;

    this.props.dispatch(Actions.Apps.instanciate(image.imageId, instanceConfig))
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

}

export default connect(select)(ImagesTab);
