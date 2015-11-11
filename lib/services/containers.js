/* jshint esnext: true, node: true */
'use strict';

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
