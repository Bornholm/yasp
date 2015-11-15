/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Navbar, NavBrand, Tabs, Tab } from 'react-bootstrap';
import { ImagesTab, AppsTab } from './components';

export default class AegirClient extends React.Component {

  constructor() {
    super();
    this.state = { tabKey: 1 };
    this.onTabSelect = this.onTabSelect.bind(this);
  }

  render() {
    let currentTabKey = this.state.tabKey;
    return (
      /* jshint ignore:start */
      <div>
        <Navbar staticTop fluid>
          <NavBrand><a href="#">Aegir Web Client</a></NavBrand>
        </Navbar>
        <Tabs activeKey={currentTabKey} position="left" tabWidth={2}
            animation={false} onSelect={this.onTabSelect}>
          <Tab eventKey={1} title="Apps">
            <AppsTab selected={currentTabKey === 1} />
          </Tab>
          <Tab eventKey={2} title="Catalogue">
            <ImagesTab selected={currentTabKey === 2} />
          </Tab>
        </Tabs>
      </div>
      /* jshint ignore:end */
    );

  }

  onTabSelect(tabKey) {
    this.setState({tabKey});
  }

}
