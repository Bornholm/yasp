/* jshint esnext: true, node: true, browser: true */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import NotificationsContainer from './components/notifications-container';

class App extends React.Component {

  static select(state) {
    return {
      actions: state.actions,
      notifications: state.notifications
    };
  }

  constructor() {
    super();
  }

  /* jshint ignore:start */
  render() {

    let t = this.props.t;
    let notifications = this.props.notifications;

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed"
                data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span className="sr-only">{t('toggle_nav')}</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">{t('app_title')}</Link>
            </div>
            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav">
                <li className={this.matchRoute(/^\/apps/) ? 'active' : null}>
                  <Link to="/apps">{t('apps')}<i className="fa fa-cubes inline-icon"></i></Link>
                </li>
                <li className={this.matchRoute(/^\/templates/) ? 'active' : null}>
                  <Link to="/templates">{t('templates')}<i className="fa fa-shopping-basket inline-icon"></i></Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#" onClick={this.logout}>{t('logout')}<i className="fa fa-sign-out inline-icon"></i></a></li>
              </ul>
              <p className="navbar-text navbar-right">
                <span style={{visibility: this.props.actions.loading ? 'visible':'hidden'}}
                  className="loader">Loading...</span>
              </p>
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          {this.props.children}
        </div>
        <NotificationsContainer
          notifications={notifications} delay={60}
          style={{position: 'fixed', right: '50%', marginRight: '-25%', bottom: 0, zIndex: 100, width: '50%'}} />
      </div>
    );

  }
  /* jshint ignore:end */

  matchRoute(route) {
    let routeRegExp = new RegExp(route);
    return routeRegExp.test(this.props.location.pathname);
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

export default translate(['app'])(connect(App.select)(App));
