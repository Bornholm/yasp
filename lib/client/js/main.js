/* jshint esnext: true, node: true, browser: true */

'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import YaspClient from './yasp-client';
import { Store } from './store';
import moment from 'moment';
import momentFR from 'moment/locale/fr';

// Set moment locale
moment.locale('fr');

let appContainer = document.getElementById('yasp-app');

ReactDOM.render(
  <Provider store={Store}>
    <YaspClient />
  </Provider>,
  appContainer
);
