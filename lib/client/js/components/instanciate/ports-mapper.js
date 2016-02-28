/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import update from 'react-addons-update';
import { translate } from 'react-i18next';

class PortsMapper extends React.Component {

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

  /* jshint ignore:start */
  render() {

    let ports = this.props.ports || [];
    let portsMap = this.state.portsMap;
    let t = this.props.t;

    let rows = ports.map(port => {
      return (
        <tr key={port}>
          <td>
            <p className="form-control form-control-static">{port}</p>
          </td>
          <td>
            <input className="form-control"
              data-port={port}
              type="number" min="0" max="65535"
              value={portsMap[port]}
              onChange={this.handleChange} />
          </td>
        </tr>
      );
    });

    return (
      <div>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>{t('host_ports')}</th>
              <th>{t('app_ports')}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
  /* jshint ignore:end */

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
    if(typeof this.props.onPortsMapChange === 'function') {
      this.props.onPortsMapChange(newState.portsMap);
    }
    this.setState(newState);
  }

}

// Define props interface

PortsMapper.propTypes = {

};

export default translate(['ports-mapper'])(PortsMapper);
