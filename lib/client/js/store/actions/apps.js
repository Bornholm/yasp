/* jshint esnext: true, node: true, browser: true */
/* globals EventSource */
'use strict';

import errors from '../errors';

const UPDATE_APPS_STATS = 'UPDATE_APPS_STATS';
const STOP_STATS_STREAMING = 'STOP_STATS_STREAMING';

const statStreams = {};

function stopStatsStreaming(instanceId) {
  return dispatch => {
    dispatch({ type: STOP_STATS_STREAMING, instanceId: instanceId });
    let statStream = statStreams[instanceId];
    if(statStream) {
      delete statStream.onmessage;
      statStream.close();
    }
  };
}

const START_STATS_STREAMING = 'START_STATS_STREAMING';

function startStatsStreaming(instanceId) {
  return dispatch => {
    let eventSource = new EventSource(`api/apps/${instanceId}/stats`);
    eventSource.onmessage = evt => {
      let stats = JSON.parse(evt.data);
      dispatch({ type: UPDATE_APPS_STATS, stats: stats,  instanceId: instanceId });
    };
    statStreams[instanceId] = eventSource;
    dispatch({ type: START_STATS_STREAMING, instanceId: instanceId });
  };
}


const FETCH_TEMPLATES_ASYNC = 'FETCH_TEMPLATES_ASYNC';
const FETCH_TEMPLATES_SUCCESS = 'FETCH_TEMPLATES_SUCCESS';
const FETCH_TEMPLATES_FAILED = 'FETCH_TEMPLATES_FAILED';

const FETCH_APPS_ASYNC = 'FETCH_APPS_ASYNC';
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS';
const FETCH_APPS_FAILED = 'FETCH_APPS_FAILED';

const INSTANCIATE_ASYNC = 'INSTANCIATE_ASYNC';
const INSTANCIATE_SUCCESS = 'INSTANCIATE_SUCCESS';
const INSTANCIATE_FAILED = 'INSTANCIATE_FAILED';

const START_APP_ASYNC = 'START_APP_ASYNC';
const START_APP_SUCCESS = 'START_APP_SUCCESS';
const START_APP_FAILED = 'START_APP_FAILED';

const STOP_APP_ASYNC = 'STOP_APP_ASYNC';
const STOP_APP_SUCCESS = 'STOP_APP_SUCCESS';
const STOP_APP_FAILED = 'STOP_APP_FAILED';

const DELETE_APP_ASYNC = 'DELETE_APP_ASYNC';
const DELETE_APP_SUCCESS = 'DELETE_APP_SUCCESS';
const DELETE_APP_FAILED = 'DELETE_APP_FAILED';

/* Internal helper */
function _handleAPIResponse(res) {
  if(res.status >= 200 && res.status < 400) {
    return res.json();
  } else {
    return res.json()
      .then(result => {
        throw new errors.ServerError(
          result.error,
          result.message,
          result.data
        );
      })
    ;
  }
}

function fetchTemplatesList () {
  return (dispatch) => {

    dispatch({type: FETCH_TEMPLATES_ASYNC });

    return fetch('api/templates', {credentials: 'include'})
      .then(_handleAPIResponse)
      .then(templates => {
        dispatch({type: FETCH_TEMPLATES_SUCCESS, templates: templates });
      })
      .catch(err => {
        dispatch({type: FETCH_TEMPLATES_FAILED, error: err });
        throw err;
      })
    ;

  };
}

function fetchAppsList () {
  return (dispatch) => {

    dispatch({type: FETCH_APPS_ASYNC });

    return fetch('api/apps', {credentials: 'include'})
      .then(_handleAPIResponse)
      .then(apps => {
        dispatch({type: FETCH_APPS_SUCCESS, apps: apps });
      })
      .catch(err => {
        dispatch({type: FETCH_APPS_FAILED, error: err });
        throw err;
      })
    ;

  };

}

function startApp(instanceId) {
  return (dispatch) => {

    dispatch({type: START_APP_ASYNC });

    return fetch('api/apps/'+instanceId+'/start', {method: 'POST', credentials: 'include'})
      .then(_handleAPIResponse)
      .then(result => {
        dispatch({type: START_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: START_APP_FAILED, error: err });
        throw err;
      })
    ;

  };

}

function stopApp(instanceId) {
  return (dispatch) => {

    dispatch({type: STOP_APP_ASYNC });

    return fetch('api/apps/'+instanceId+'/stop', {method: 'POST', credentials: 'include'})
      .then(_handleAPIResponse)
      .then(result => {
        dispatch({type: STOP_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: STOP_APP_FAILED, error: err });
        throw err;
      })
    ;

  };

}

function deleteApp(instanceId) {
  return (dispatch) => {

    dispatch({type: DELETE_APP_ASYNC });

    return fetch('api/apps/'+instanceId+'', {method: 'DELETE', credentials: 'include'})
      .then(_handleAPIResponse)
      .then(result => {
        dispatch({type: DELETE_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: DELETE_APP_FAILED, error: err });
        throw err;
      })
    ;

  };

}

function instanciate(templateId, instanceConfig) {
  instanceConfig = instanceConfig || {};
  return (dispatch) => {

    dispatch({
      type: INSTANCIATE_ASYNC,
      templateId: templateId,
      instanceConfig: instanceConfig
    });

    let reqOpts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: templateId,
        instanceLabel: instanceConfig.instanceLabel,
        instanceId: instanceConfig.instanceId,
        vars: instanceConfig.vars,
        ports: instanceConfig.ports
      }),
      credentials: 'include'
    };

    return fetch('api/apps', reqOpts)
      .then(_handleAPIResponse)
      .then(result => {
        dispatch({
          type: INSTANCIATE_SUCCESS,
          templateId: templateId,
          instanceConfig: instanceConfig,
          result: result
        });
      })
      .catch(err => {
        dispatch({type: INSTANCIATE_FAILED, error: err });
        throw err;
      })
    ;

  };

}

export default {
  FETCH_TEMPLATES_ASYNC,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILED,
  FETCH_APPS_ASYNC,
  FETCH_APPS_SUCCESS,
  FETCH_APPS_FAILED,
  INSTANCIATE_ASYNC,
  INSTANCIATE_SUCCESS,
  INSTANCIATE_FAILED,
  START_APP_ASYNC,
  START_APP_SUCCESS,
  START_APP_FAILED,
  STOP_APP_ASYNC,
  STOP_APP_SUCCESS,
  STOP_APP_FAILED,
  DELETE_APP_ASYNC,
  DELETE_APP_SUCCESS,
  DELETE_APP_FAILED,
  fetchTemplatesList,
  fetchAppsList,
  instanciate,
  startApp,
  stopApp,
  deleteApp,
  UPDATE_APPS_STATS,
  START_STATS_STREAMING,
  startStatsStreaming,
  STOP_STATS_STREAMING,
  stopStatsStreaming
};
