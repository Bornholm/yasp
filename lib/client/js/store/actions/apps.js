/* jshint esnext: true, node: true, browser: true */
'use strict';

const FETCH_IMAGES = 'FETCH_IMAGES';
const FETCH_IMAGES_SUCCESS = 'FETCH_IMAGES_SUCCESS';
const FETCH_IMAGES_FAILED = 'FETCH_IMAGES_FAILED';

const FETCH_APPS = 'FETCH_APPS';
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS';
const FETCH_APPS_FAILED = 'FETCH_APPS_FAILED';

const INSTANCIATE = 'INSTANCIATE';
const INSTANCIATE_SUCCESS = 'INSTANCIATE_SUCCESS';
const INSTANCIATE_FAILED = 'INSTANCIATE_FAILED';

function fetchImagesList () {
  return (dispatch) => {

    dispatch({type: FETCH_IMAGES });

    return fetch('/api/apps/images')
      .then(res => res.json())
      .then(images => {
        dispatch({type: FETCH_IMAGES_SUCCESS, images: images });
      })
      .catch(err => {
        dispatch({type: FETCH_IMAGES_FAILED, error: err });
      })
    ;

  };
}

function fetchAppsList () {
  return (dispatch) => {

    dispatch({type: FETCH_APPS });

    return fetch('/api/apps')
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

function instanciate(imageId, instanceConfig) {
  return (dispatch) => {

    dispatch({
      type: INSTANCIATE,
      imageId: imageId,
      instanceConfig: instanceConfig
    });

    let reqOpts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageId: imageId
      })
    };

    return fetch('/api/apps', reqOpts)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        dispatch({
          type: INSTANCIATE_SUCCESS,
          imageId: imageId,
          instanceConfig: instanceConfig
        });
      })
      .catch(err => {
        dispatch({type: FETCH_IMAGES_FAILED, error: err });
      })
    ;

  };

}

export default {

  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_FAILED,

  FETCH_APPS,
  FETCH_APPS_SUCCESS,
  FETCH_APPS_FAILED,

  INSTANCIATE,
  INSTANCIATE_SUCCESS,
  INSTANCIATE_FAILED,

  fetchImagesList,
  fetchAppsList,
  instanciate

};
