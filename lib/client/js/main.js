/* jshint esnext: true, node: true, browser: true */

'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import AegirClient from './aegir-client';
import { Store } from './store';
import moment from 'moment';
import momentFR from 'moment/locale/fr';

// Set moment locale
moment.locale('fr');

let appContainer = document.getElementById('aegir-app');

ReactDOM.render(
  <Provider store={Store}>
    <AegirClient />
  </Provider>,
  appContainer
);
