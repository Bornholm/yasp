/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Navbar, NavBrand, Tabs, Tab } from 'react-bootstrap';
import { ImagesTab, AppsTab } from './components';

export default class AegirClient extends React.Component {

  render() {

    return (
      /* jshint ignore:start */
      <div>
        <Navbar staticTop fluid>
          <NavBrand><a href="#">Aegir Web Client</a></NavBrand>
        </Navbar>
        <Tabs defaultActiveKey={1} position="left" tabWidth={2}>
          <Tab eventKey={1} title="Apps">
            <AppsTab />
          </Tab>
          <Tab eventKey={2} title="Images">
            <ImagesTab />
          </Tab>

        </Tabs>
      </div>
      /* jshint ignore:end */
    );
  }

}
