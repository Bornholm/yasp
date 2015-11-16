/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';

export default class InstanceConfigurator extends React.Component {

  constructor() {
    super();
    this.state = {
      config: {}
    };
  }

  render() {

    let image = this.props.image || {};
    let vars = image.vars || {};
    let config = this.state.config;

    let inputs = Object.keys(vars).map(varKey => {

      let varDefinition = vars[varKey];
      let type = varDefinition.type || "text";
      let label = varDefinition.label || varKey;
      let value = varDefinition.defaultValue;

      return (
        /* jshint ignore:start */
        <Input key={varKey} ref={"var-"+varKey} type={type} value={value} label={label} />
        /* jshint ignore:end */
      );

    });

    return (
      /* jshint ignore:start */
      <form>
        {inputs}
      </form>
      /* jshint ignore:end */
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props);
  }

  isValid() {
    return false;
  }

  getConfig() {
    return this.state.config;
  }

}
