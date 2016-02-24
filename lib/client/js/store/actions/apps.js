/* jshint esnext: true, node: true, browser: true */
'use strict';

const FETCH_TEMPLATES = 'FETCH_TEMPLATES';
const FETCH_TEMPLATES_SUCCESS = 'FETCH_TEMPLATES_SUCCESS';
const FETCH_TEMPLATES_FAILED = 'FETCH_TEMPLATES_FAILED';

const FETCH_APPS = 'FETCH_APPS';
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS';
const FETCH_APPS_FAILED = 'FETCH_APPS_FAILED';

const INSTANCIATE = 'INSTANCIATE';
const INSTANCIATE_SUCCESS = 'INSTANCIATE_SUCCESS';
const INSTANCIATE_FAILED = 'INSTANCIATE_FAILED';

const START_APP = 'START_APP';
const START_APP_SUCCESS = 'START_APP_SUCCESS';
const START_APP_FAILED = 'START_APP_FAILED';

const STOP_APP = 'STOP_APP';
const STOP_APP_SUCCESS = 'STOP_APP_SUCCESS';
const STOP_APP_FAILED = 'STOP_APP_FAILED';

const DELETE_APP = 'DELETE_APP';
const DELETE_APP_SUCCESS = 'DELETE_APP_SUCCESS';
const DELETE_APP_FAILED = 'DELETE_APP_FAILED';

function fetchTemplatesList () {
  return (dispatch) => {

    dispatch({type: FETCH_TEMPLATES });

    return fetch('api/templates')
      .then(res => res.json())
      .then(templates => {
        dispatch({type: FETCH_TEMPLATES_SUCCESS, templates: templates });
      })
      .catch(err => {
        dispatch({type: FETCH_TEMPLATES_FAILED, error: err });
      })
    ;

  };
}

function fetchAppsList () {
  return (dispatch) => {

    dispatch({type: FETCH_APPS });

    return fetch('api/apps')
      .then(res => res.json())
      .then(apps => {
        dispatch({type: FETCH_APPS_SUCCESS, apps: apps });
      })
      .catch(err => {
        dispatch({type: FETCH_APPS_FAILED, error: err });
      })
    ;

  };

}

function startApp(instanceId) {
  return (dispatch) => {

    dispatch({type: START_APP });

    return fetch('api/apps/'+instanceId+'/start', {method: 'POST'})
      .then(res => res.json())
      .then(result => {
        dispatch({type: START_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: START_APP_FAILED, error: err });
      })
    ;

  };

}

function stopApp(instanceId) {
  return (dispatch) => {

    dispatch({type: STOP_APP });

    return fetch('api/apps/'+instanceId+'/stop', {method: 'POST'})
      .then(res => res.json())
      .then(result => {
        dispatch({type: STOP_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: STOP_APP_FAILED, error: err });
      })
    ;

  };

}

function deleteApp(instanceId) {
  return (dispatch) => {

    dispatch({type: DELETE_APP });

    return fetch('api/apps/'+instanceId+'', {method: 'DELETE'})
      .then(res => res.json())
      .then(result => {
        dispatch({type: DELETE_APP_SUCCESS, result: result });
      })
      .catch(err => {
        dispatch({type: DELETE_APP_FAILED, error: err });
      })
    ;

  };

}

function instanciate(templateId, instanceConfig) {
  return (dispatch) => {

    dispatch({
      type: INSTANCIATE,
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
        vars: instanceConfig.vars,
        ports: instanceConfig.ports
      })
    };

    return fetch('api/apps', reqOpts)
      .then(res => res.json())
      .then(result => {
        dispatch({
          type: INSTANCIATE_SUCCESS,
          templateId: templateId,
          instanceConfig: instanceConfig,
          result: result
        });
      })
      .catch(err => {
        dispatch({type: FETCH_TEMPLATES_FAILED, error: err });
      })
    ;

  };

}

export default {

  FETCH_TEMPLATES,
  FETCH_TEMPLATES_SUCCESS,
  FETCH_TEMPLATES_FAILED,

  FETCH_APPS,
  FETCH_APPS_SUCCESS,
  FETCH_APPS_FAILED,

  INSTANCIATE,
  INSTANCIATE_SUCCESS,
  INSTANCIATE_FAILED,

  START_APP,
  START_APP_SUCCESS,
  START_APP_FAILED,

  STOP_APP,
  STOP_APP_SUCCESS,
  STOP_APP_FAILED,

  DELETE_APP,
  DELETE_APP_SUCCESS,
  DELETE_APP_FAILED,

  fetchTemplatesList,
  fetchAppsList,
  instanciate,
  startApp,
  stopApp,
  deleteApp

};
