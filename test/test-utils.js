'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const base64url = require('base64-url');
const getPort = require('get-port');
const MapiClient = require('../lib/classes/mapi-client');

function requestConfig(service) {
  return service.client.createRequest.mock.calls[0][0];
}

function mockClient() {
  var client = {
    createRequest: jest.fn(),
    abortRequest: jest.fn()
  };
  // Allow for Object.isPrototypeOf checks.
  Object.setPrototypeOf(client, MapiClient.prototype);
  return client;
}

function mockServer() {
  let handleRequest;
  let handleResponse;

  const reset = () => {
    handleRequest = () => {};
    handleResponse = (req, res) => {
      if (req.headers['content-type'] === 'application/octet-stream') {
        const json = JSON.stringify({
          test: 'test'
        });
        const buf = Buffer.from(json);
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-disposition': 'attachment; filename=data.json'
        });
        res.write(buf);
        res.end();
      }

      res.send();
    };
  };
  reset();

  const setResponse = cb => {
    handleResponse = cb;
  };

  const captureRequest = sendRequest => {
    const promiseRequest = new Promise((resolve, reject) => {
      try {
        handleRequest = req => resolve(req);
      } catch (error) {
        reject(error);
      }
    });
    return sendRequest().then(() => promiseRequest);
  };

  const app = express();
  app.use(bodyParser.json());
  app.use((req, res) => {
    // The browser tests require Access-Control-Allow-Origin for CORS,
    // so we'll just universally set Access-Control-Expose-Headers here.
    res.header('Access-Control-Expose-Headers', [
      'Access-Control-Allow-Origin',
      'Link'
    ]);

    // allow the three odd headers we are testing for in `test-shared-interface`
    res.header('Access-Control-Allow-Headers', [
      'if-unmodified-since',
      'x-horse-name',
      'x-dog-name'
    ]);

    res.append('Access-Control-Allow-Origin', '*');
    handleRequest(req);
    handleResponse(req, res);
  });

  return getPort().then(port => {
    const origin = `http://localhost:${port}`;
    const nodeServer = app.listen(port);

    if (global.jsdom) {
      global.jsdom.reconfigure({
        url: origin
      });
    }

    const localClient = createClient => {
      return options => {
        return createClient(Object.assign({}, options, { origin }));
      };
    };

    const close = cb => {
      nodeServer.close(() => {
        cb();
      });
    };

    return {
      captureRequest,
      setResponse,
      reset,
      close,
      origin,
      port,
      localClient
    };
  });
}

function mockToken(header = 'pk', payload = {}, signature = 'sss') {
  const defaultedPayload = Object.assign(
    {
      u: 'mockuser',
      a: 'mockauth'
    },
    payload
  );
  const encodedPayload = base64url.encode(JSON.stringify(defaultedPayload));
  return [header, encodedPayload, signature].join('.');
}

function expectRejection(p, cb) {
  return p
    .then(() => {
      throw new Error('should have rejected');
    })
    .catch(cb);
}

function expectError(fn, cb) {
  try {
    fn();
    throw new Error('should have errored');
  } catch (e) {
    cb(e);
  }
}

module.exports = {
  requestConfig,
  mockClient,
  mockServer,
  mockToken,
  expectRejection,
  expectError
};
