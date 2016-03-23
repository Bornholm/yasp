/* jshint esnext: true, node: true */
'use strict';

let httpProxy = require('http-proxy');
let path = require('path');
let fs = require('fs');
let Controller = require('./controller');
let schemas = require('../schemas');
let errors = require('../errors');
let YaspConst = require('../util').YaspConst;
let bodyParser = require('body-parser');
let url = require('url');
let _ = require('lodash');

//  TODO ACL
class AppsController extends Controller {

  constructor(appsService) {
    super();
    this._apps = appsService;
    this._servicesProxy = httpProxy.createProxyServer();
    this._initProxyListeners();
  }

  listInstances(req, res, next) {
    this._apps.listInstances()
      .then(instances => res.status(200).send(instances))
      .catch(next)
    ;
  }

  startInstance(req, res, next) {
    let instanceId = req.params.instanceId;
    // TODO validate instanceId format
    this._apps.start(instanceId)
      .then(instanceId => res.status(200).send({instanceId}))
      .catch(next)
    ;
  }

  stopInstance(req, res, next) {
    let instanceId = req.params.instanceId;
    // TODO validate instanceId format
    this._apps.stop(instanceId)
      .then(instanceId => res.status(200).send({instanceId}))
      .catch(next)
    ;
  }

  deleteInstance(req, res, next) {
    let instanceId = req.params.instanceId;
    // TODO validate instanceId format
    // TODO add dropVolumes parameter handling
    this._apps.delete(instanceId)
      .then(instanceId => res.status(200).send({instanceId}))
      .catch(next)
    ;
  }

  createInstance(req, res, next) {

    var instanceRequest = req.body;

    // TODO Create a real INSTANCE_REQUEST schema & test
    try {
      schemas.validate(instanceRequest, schemas.INSTANCE_REQUEST);
    } catch(err) {
      return next(new errors.BadRequestError(err.message));
    }

    let vars = instanceRequest.vars;
    let ports = instanceRequest.ports;
    let instanceId = instanceRequest.instanceId;
    let instanceLabel = instanceRequest.instanceLabel;

    this._apps.instanciate(instanceRequest.templateId, { vars, ports, instanceId, instanceLabel })
      .then(instanceId => res.status(200).send({instanceId}))
      .catch(next)
    ;

  }

  showServiceAdmin(req, res) {

    let instanceId = req.params.instanceId;
    let proxy = this._servicesProxy;

    let appDataDir = this._apps.getAppDataDir(instanceId);
    let socketPath = path.join(appDataDir, YaspConst.YASP_ADMIN_SOCKET);

    // TODO assert that apps is declared as a service

    fs.exists(socketPath, (exists) => {
      if(!exists) return res.status(404).end();
      // Rewrite URL and remove proxy prefix
      req.url = req.url.replace(new RegExp(`^/${instanceId}/admin`), '');
      proxy.web(req, res, { target: {socketPath} }, (err) => {
        if(err) {
          console.error(err);
          return res.status(502).end('502 - Bad gateway');
        }
      });
    });

  }

  streamStats(req, res, next) {
    let instanceId = req.params.instanceId;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    this._apps.getStatsStream(instanceId)
      .then(stream => {

        let throttled = _.throttle(data => {
          let stats = data.toString();
          res.write(`data: ${stats}\n\n`);
          if('flush' in res) res.flush();
        }, 1000);

        req.once('close', () => {
          throttled.cancel();
          stream.removeAllListeners();
          stream.destroy();
        });

        stream.on('data', throttled);

        stream.once('error', err => {
          throttled.cancel();
          stream.removeAllListeners();
          stream.destroy();
          console.error(err);
          return;
        });

        stream.once('end', () => {
          throttled.cancel();
          stream.removeAllListeners();
          stream.destroy();
          res.end();
        });

      })
      .catch(next)
    ;
  }

  _initProxyListeners() {
    let proxy = this._servicesProxy;
    proxy.on('proxyRes', this._rewriteProxyRes.bind(this));
  }

  _rewriteProxyRes(proxyRes, req) {

    const cookiePathRegex = /path=(\/.*\/);/i;
    const instanceId = req.params.instanceId;
    const proxyPrefix = `/api/apps/${instanceId}/admin`;

    // Rewrite cookies path
    if('set-cookie' in proxyRes.headers) {
      let cookies = proxyRes.headers['set-cookie'];
      cookies.forEach((cookie, i) => {
        let matches = cookiePathRegex.exec(cookie);
        if(matches) {
          let cookiePath = matches[1];
          cookies[i] = cookie.replace(cookiePathRegex, `path=${proxyPrefix}${cookiePath};`);
        }
      });
    }

    // Rewrite redirects
    if('location' in proxyRes.headers) {
      let redirectUrl = url.parse(proxyRes.headers.location).path;
      proxyRes.headers.location = `${proxyPrefix}${redirectUrl}`;
    }

  }

  bindTo(app) {
    app.get('/', this.listInstances.bind(this));
    app.post('/', bodyParser.json(), this.createInstance.bind(this));
    app.all('/:instanceId/admin/*', this.showServiceAdmin.bind(this));
    app.get('/:instanceId/stats', this.streamStats.bind(this));
    app.post('/:instanceId/start', this.startInstance.bind(this));
    app.post('/:instanceId/stop', this.stopInstance.bind(this));
    app.delete('/:instanceId', this.deleteInstance.bind(this));
  }

}

module.exports = AppsController;
