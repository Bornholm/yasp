/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';
import update from 'react-addons-update';
import { InstanceVarsValidator } from '../../../util';

export default class InstanceConfigurator extends React.Component {

  constructor() {
    super();
    this.state = {
      isValid: false,
      config: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {

    let image = this.props.image || {};
    let vars = image.vars || {};
    let config = this.state.config;

    let inputs = Object.keys(vars).map(varKey => {

      let varDefinition = vars[varKey];
      let type = varDefinition.type || "text";
      let label = varDefinition.label || varKey;
      let value = config[varKey] || varDefinition.defaultValue;
      let description = varDefinition.description;

      return (
        /* jshint ignore:start */
        <Input key={varKey} data-var-key={varKey}
          type={type} value={value}
          help={description} label={label}
          onChange={this.handleChange}
          />
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
    console.log(nextProps);
  }

  validate(noUpdate) {

    if(noUpdate) {
      return true;
    }

    // Check new status
    let wasValid = this.state.isValid;
    let isValid = this.validate(true);

    // If status changed
    if( wasValid !== isValid ) {
      // update current status
      this.setState({ isValid });
      this.props.onStatusChange(isValid);
    }

    return isValid;

  }

  handleChange(evt) {

    // Replicate change in state
    let state = this.state;
    let varKey = evt.target.dataset.varKey;
    let newState = update(this.state, {
      config: {
        [ varKey ] : { $set: evt.target.value }
      }
    });
    this.setState(newState);

    this.validate();

  }

  getConfig() {
    return this.state.config;
  }

}
