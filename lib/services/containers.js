/* jshint esnext: true, node: true */
'use strict';

let debug = require('debug')('aegir:services:containers');

class ContainersService {

  constructor(dockerClient) {
    this._dockerClient = dockerClient;
  }

  fetchImages(opts) {
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      docker.listImages(opts, (err, images) => {
        if(err) reject(err);
        resolve(images);
      });
    });
  }

  fetchContainers(opts) {
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      docker.listContainers(opts, (err, containers) => {
        if(err) reject(err);
        resolve(containers);
      });
    });
  }

  inspectContainer(containerId) {
    return new Promise((resolve, reject) => {
      let container = this._dockerClient.getContainer(containerId);
      container.inspect(function(err, info) {
        if(err) reject(err);
        resolve(info);
      });
    });
  }

  createContainer(opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      let docker = this._dockerClient;
      docker.createContainer(opts, (err, container) => {
        if(err) return reject(err);
        return resolve(container);
      });
    });
  }

  startContainer(containerId) {
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      let container = docker.getContainer(containerId);
      container.start((err, data) => {
        if(err) return reject(err);
        return resolve(data);
      });
    });
  }

  stopContainer(containerId) {
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      let container = docker.getContainer(containerId);
      container.stop((err, data) => {
        if(err) return reject(err);
        return resolve(data);
      });
    });
  }

}

module.exports = ContainersService;
