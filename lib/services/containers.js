/* jshint esnext: true, node: true */
'use strict';

let debug = require('debug')('yasp:services:containers');

class ContainersService {

  constructor(dockerClient) {
    this._dockerClient = dockerClient;
  }

  listImages(opts) {
    debug('Listing images with opts', opts);
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      docker.listImages(opts, (err, images) => {
        if(err) reject(err);
        resolve(images);
      });
    });
  }

  listContainers(opts) {
    debug('Listing containers with opts', opts);
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      docker.listContainers(opts, (err, containers) => {
        if(err) reject(err);
        resolve(containers);
      });
    });
  }

  inspectImage(imageId) {
    debug('Inspecting image %s', imageId);
    return new Promise((resolve, reject) => {
      let image = this._dockerClient.getImage(imageId);
      image.inspect(function(err, info) {
        if(err) reject(err);
        resolve(info);
      });
    });
  }

  inspectContainer(containerId) {
    debug('Inspecting container %s', containerId);
    return new Promise((resolve, reject) => {
      let container = this._dockerClient.getContainer(containerId);
      container.inspect(function(err, info) {
        if(err) reject(err);
        resolve(info);
      });
    });
  }

  create(opts) {
    debug('Creating container with opts %j', opts);
    return new Promise((resolve, reject) => {
      opts = opts || {};
      let docker = this._dockerClient;
      docker.createContainer(opts, (err, container) => {
        if(err) return reject(err);
        return resolve(container);
      });
    });
  }

  start(containerId) {
    debug('Starting container %s', containerId);
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      let container = docker.getContainer(containerId);
      container.start((err, data) => {
        if(err) return reject(err);
        return resolve(data);
      });
    });
  }

  stop(containerId) {
    debug('Stopping container %s', containerId);
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      let container = docker.getContainer(containerId);
      container.stop((err, data) => {
        if(err) return reject(err);
        return resolve(data);
      });
    });
  }

  delete(containerId) {
    debug('Deleting container %s', containerId);
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      let container = docker.getContainer(containerId);
      container.remove((err, data) => {
        if(err) return reject(err);
        return resolve(data);
      });
    });
  }

}

module.exports = ContainersService;
