/* jshint esnext: true, node: true */
'use strict';

let debug = require('debug')('aegir:services:containers');

class ContainersService {

  constructor(dockerClient) {
    this._dockerClient = dockerClient;
  }

  fetchList(onlyRunning) {
    return new Promise((resolve, reject) => {
      let docker = this._dockerClient;
      docker.listContainers({all: !onlyRunning}, (err, containers) => {
        if(err) reject(err);
        resolve(containers);
      });
    });
  }

  run(image, opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      let docker = this._dockerClient;
      docker.run(image,
        opts.cmd, opts.stream,
        opts.createOpts, opts.startOpts,
        (err, data, container) => {
          if(err) return reject(err);
          return resolve({
            data: data,
            container: container
          });
        }
      );
    });
  }

  pull(image, opts) {
    return new Promise((resolve, reject) => {
      this._dockerClient.pull(image, opts, (err, stream) => {
        if(err) return reject(err);
        stream.on('data', data => debug('Pulling %s: %s', image, data));
        stream.once('error', reject);
        stream.once('end', resolve);
      });
    });
  }

}

module.exports = ContainersService;
