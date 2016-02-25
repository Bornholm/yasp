/* jshint esnext: true, node: true, browser: true */

'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import App from './app';
import AppsView from './components/apps/apps-view';
import TemplatesView from './components/templates/templates-view';
import InstanciateView from './components/instanciate/instanciate-view';
import { Router, Route, hashHistory } from 'react-router';
import { Store } from './store';
import moment from 'moment';
import momentFR from 'moment/locale/fr';

// Set moment locale
moment.locale('fr');

let appContainer = document.getElementById('app');

ReactDOM.render(
  <Provider store={Store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/apps" component={AppsView} />
        <Route path="/templates" component={TemplatesView} />
        <Route path="/instanciate/:templateId" component={InstanciateView} />
      </Route>
    </Router>
  </Provider>,
  appContainer
);
