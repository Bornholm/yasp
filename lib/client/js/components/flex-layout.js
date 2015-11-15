/* jshint esnext: true, node: true */
'use strict';

import React from 'react';

export default class FlexLayout extends React.Component {

  render() {

    let alignItems = this.props.alignItems || 'flex-start';
    let justifyContent = this.props.justifyContent || 'flex-start';
    let flexDirection = this.props.flexDirection || 'row';
    let flexFlow = this.props.flexFlow || 'wrap';

    let layoutStyle = {
      display: 'flex',
      flexDirection: flexDirection,
      alignItems: alignItems,
      justifyContent: justifyContent,
      flexFlow: flexFlow
    };

    return (
      <div style={layoutStyle}>
        {this.props.children}
      </div>
    );

  }

}
