/* jshint esnext: true, node: true, browser: true */

'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import App from './app';
import AppView from './components/apps/apps-view';
import { Router, Route, hashHistory, Redirect } from 'react-router';
import { Store } from './store';
import moment from 'moment';
import momentFR from 'moment/locale/fr';

// Set moment locale
moment.locale('fr');

let appContainer = document.getElementById('yasp-app');

ReactDOM.render(
  <Provider store={Store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="apps" component={AppView} />
      </Route>
    </Router>
  </Provider>,
  appContainer
);
