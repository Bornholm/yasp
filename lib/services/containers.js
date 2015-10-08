/* jshint esnext: true, node: true */
'use strict';

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

}

module.exports = ContainersService;
