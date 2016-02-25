/* jshint esnext: true, node: true */
'use strict';

import React from 'react';
import { Link } from 'react-router';
//import { TemplatesTab, AppsTab } from './components';

export default class App extends React.Component {

  constructor() {
    super();
  }

  /* jshint ignore:start */
  render() {
    console.log(this.props.location);
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">Yasp</Link>
            </div>
            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav">
                <li className={this.matchRoute(/^\/apps/) ? 'active' : null}><Link to="/apps">Apps</Link></li>
                <li><Link to="/catalog">Catalog</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#" onClick={this.logout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );

  }

  matchRoute(route) {
    let routeRegExp = new RegExp(route);
    return routeRegExp.test(this.props.location.pathname);
  }
  /* jshint ignore:end */

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
