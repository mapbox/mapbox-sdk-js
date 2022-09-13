'use strict';

const nodeClient = require('../lib/node/node-client');
const constants = require('../lib/constants');
const tu = require('./test-utils');
const testSharedInterface = require('./test-shared-interface');

describe('shared interface tests', () => {
  testSharedInterface(nodeClient);
});

test('errors early if access token not provided', () => {
  tu.expectError(
    () => nodeClient(),
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

describe('test node progress events', () => {
  let request;
  let server;
  let createLocalClient;
  const { mockToken } = tu;

  beforeAll(() => {
    return tu.mockServer().then(s => {
      server = s;
      createLocalClient = server.localClient(nodeClient);
    });
  });

  afterAll(done => {
    server.close(done);
  });

  afterEach(() => {
    server.reset();
  });

  beforeEach(() => {
    server.setResponse((req, res) => {
      res.append('Content-Type', 'application/json; charset=utf-8');
      res.json({ mockStyle: true });
    });

    const accessToken = mockToken();
    const client = createLocalClient({ accessToken });
    request = client.createRequest({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId',
      params: { styleId: 'foo' }
    });
  });

  test('request.emitter should emit uploadProgress events', () => {
    let progressUpload = [];
    request.emitter.on(constants.EVENT_PROGRESS_UPLOAD, resp => {
      progressUpload.push(Object.assign({}, resp));
    });

    return request.send().then(() => {
      expect(progressUpload).toEqual([
        { percent: 0, total: undefined, transferred: 0 },
        { percent: 100, total: 0, transferred: 0 }
      ]);
    });
  });

  test('request.emitter should emit downloadProgress events', () => {
    let progressDownload = [];
    request.emitter.on(constants.EVENT_PROGRESS_DOWNLOAD, resp => {
      progressDownload.push(Object.assign({}, resp));
    });

    return request.send().then(() => {
      expect(progressDownload).toEqual([
        { percent: 0, total: 18, transferred: 0 },
        { percent: 100, total: 18, transferred: 18 }
      ]);
    });
  });
});
