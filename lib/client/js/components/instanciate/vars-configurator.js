/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import update from 'react-addons-update';
import { VarsValidator } from '../../../../shared';

export default class VarsConfigurator extends React.Component {

  constructor() {

    super();

    // Set initial state
    this.state = {
      isValid: false,
      config: {}
    };

    // Bind methods to current instance
    this.handleChange = this.handleChange.bind(this);

  }

  /* jshint ignore:start */
  render() {

    let template = this.props.template || {};
    let vars = template.vars || {};
    let config = this.state.config;

    let inputs = Object.keys(vars).map(varKey => {

      let varDefinition = vars[varKey];
      let type = varDefinition.type || 'text';
      let label = varDefinition.label || varKey;
      let value = config[varKey];
      let description = varDefinition.description;

      return (
        <div key={varKey} className="form-group">
          <label>{label}</label>
          <input className="form-control"
            data-var-key={varKey}
            type={type} value={value}
            onChange={this.handleChange} />
          <span className="help-block">{description}</span>
        </div>
      );

    });

    return (
      <form>
        {inputs}
      </form>
    );
  }
  /* jshint ignore:end */

  componentWillMount() {

    this.updateConfigFromProps();

    // Initial check
    this.validate();

  }

  updateConfigFromProps() {

    // Initialise state
    let vars = this.props.template.vars;

    if(!vars) return;

    let configUpdate = {};

    Object.keys(vars).forEach((varKey) => {
      let varConfig = vars[varKey];
      configUpdate[varKey] = {
        $set: varConfig && 'defaultValue' in varConfig ? varConfig.defaultValue : ''
      };
    });

    let newState = update(this.state, { config: configUpdate });
    this.setState(newState);

  }

  validate(noUpdate) {

    if(noUpdate) {
      let validator = new VarsValidator(this.props.template.vars);
      return validator.validate(this.state.config);
    }

    // Check new status
    let wasValid = this.state.isValid;
    let isValid = this.validate(true);

    // If status changed
    if( wasValid !== isValid ) {
      // update current status
      this.setState({ isValid });
      if( typeof this.props.onStatusChange === 'function' ) {
        this.props.onStatusChange(isValid);
      }
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

// Define props interface

VarsConfigurator.propTypes = {
  onStatusChange: React.PropTypes.func,
  template: React.PropTypes.object.isRequired
};
