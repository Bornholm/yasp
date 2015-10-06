/* jshint esnext: true, node: true */
'use strict';

class ContainersService {

  constructor(dockerClient) {
    this._dockerClient = dockerClient;
  }

  fetchList(onlyRunning) {
    let docker = this._dockerClient;
    return new Promise((resolve, reject) => {
      docker.listContainers({all: !onlyRunning}, (err, containers) => {
        if(err) reject(err);
        resolve(containers);
      });
    });
  }

}

module.exports = ContainersService;
