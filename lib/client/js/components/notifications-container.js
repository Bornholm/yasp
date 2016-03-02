/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { translate } from 'react-i18next';

class NotificationsContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      timeoutId: false
    };
    this.handleTick = this.handleTick.bind(this);
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let notifications = this.props.notifications || [];

    let alerts = notifications.map((n, i) => {
      return (
        <div key={'notification-'+i} className={'alert alert-'+n.type}>
          <button type="button" className="close"><span aria-hidden="true">&times;</span></button>
          {n.message}
        </div>
      );
    }).reverse();

    return (
      <div {...this.props}>
        {alerts}
      </div>
    );

  }
  /* jshint ignore:end */

  componentWillMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  componentDidUpdate() {
    let notifications = this.props.notifications;
    if(!notifications || notifications.length === 0) return;
    if(!this.isTimerRunning()) this.startTimer();
  }

  isTimerRunning() {
    return !!this.state.timeoutId;
  }

  startTimer() {
    if(this.state.timeoutId) this.stopTimer();
    let timeoutId = setTimeout(this.handleTick, this.props.delay || 10000);
    this.setState({timeoutId});
  }

  stopTimer() {
    let timeoutId = this.state.timeoutId;
    if(timeoutId) clearTimeout(this.state.timeoutId);
    this.setState({timeoutId: false});
  }

  handleTick() {
    let notifications = this.props.notifications;
    if(!notifications || notifications.length === 0) return;
    notifications.shift();
    this.forceUpdate();
    if(notifications.length > 0) this.startTimer();
  }


}

export default translate(['notifications', 'errors'])(NotificationsContainer);
