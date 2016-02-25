/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Navbar, Nav, NavItem, NavBrand, Tabs, Tab } from 'react-bootstrap';
import { TemplatesTab, AppsTab } from './components';

export default class YaspClient extends React.Component {

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
          <NavBrand><a href="#">Yasp</a></NavBrand>
          <Nav pullRight>
            <NavItem onClick={this.logout} href="#">Logout</NavItem>
          </Nav>
        </Navbar>
        <Tabs activeKey={currentTabKey} position="left" tabWidth={2}
            animation={false} onSelect={this.onTabSelect}>
          <Tab eventKey={1} title="Apps">
            <AppsTab selected={currentTabKey === 1} />
          </Tab>
          <Tab eventKey={2} title="Catalogue">
            <TemplatesTab selected={currentTabKey === 2} />
          </Tab>
        </Tabs>
      </div>
      /* jshint ignore:end */
    );

  }

  onTabSelect(tabKey) {
    this.setState({tabKey});
  }

  logout() {
    let location = window.location;
    let badUser = Date.now();
    let protocol = location.protocol;
    let host = location.host;
    let path = location.pathname;
    let url = `${protocol}//${badUser}@${host}${path}`;
    fetch(url, {credentials: 'include'})
      .then(() => window.location.reload())
    ;
  }

}
