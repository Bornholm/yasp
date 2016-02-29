/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../../store';
import { translate } from 'react-i18next';

class VolumesView extends React.Component {

  static select(state) {
    return {
    };
  }

  constructor() {

    super();
    this.state = {};
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;

    return (
      <div>

      </div>
    );
  }
  /* jshint ignore:end */


}

export default translate(['volumes-view'])(connect(VolumesView.select)(VolumesView));
