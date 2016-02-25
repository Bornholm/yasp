/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import update from 'react-addons-update';

export default class PortsMapper extends React.Component {

  constructor() {

    super();

    // Set initial state
    this.state = {
      isValid: false,
      portsMap: {}
    };

    // Bind methods to current instance
    this.handleChange = this.handleChange.bind(this);

  }

  render() {

    let ports = this.props.ports || [];
    let portsMap = this.state.portsMap;

    let rows = ports.map(port => {

      return (
        /* jshint ignore:start */
        <tr key={port}>
          <td>
            <FormControls.Static value={port} bsSize="small" />
          </td>
          <td>
            <Input type="number" min="0" max="65535" bsSize="small"
              data-port={port} value={portsMap[port]}
              onChange={this.handleChange} />
          </td>
        </tr>
        /* jshint ignore:end */
      );

    });

    return (
      /* jshint ignore:start */
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Application</th>
            <th>Machine hôte</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      /* jshint ignore:end */
    );
  }

  componentWillMount() {
    this.updatePortsMapFromProps();
  }

  updatePortsMapFromProps() {
    let portsMap = this.state.portsMap;
    let ports = this.props.ports || [];
    ports.forEach((p) => {
      portsMap[p] = portsMap[p] || '';
    });
  }

  handleChange(evt) {
    let value = evt.target.value;
    let port = evt.target.dataset.port;
    let updateQuery = {
      portsMap: {
        [ port ]: { $set: value }
      }
    };
    let newState = update(this.state, updateQuery);
    this.setState(newState);
  }

  getPortsMap() {
    return this.state.portsMap;
  }

}

// Define props interface

PortsMapper.propTypes = {

};
