/**
 * @jest-environment jsdom-global
 */
'use strict';
const mockXHR = require('xhr-mock').default;
const browserClient = require('../lib/browser/browser-client');
const constants = require('../lib/constants');
const tu = require('./test-utils');
const testSharedInterface = require('./test-shared-interface');

describe('shared interface tests', () => {
  testSharedInterface(browserClient);
});

test('errors early if access token not provided', () => {
  tu.expectError(
    () => browserClient(),
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

describe('test node progress events', () => {
  let request;
  const { mockToken } = tu;

  afterEach(() => {
    mockXHR.teardown();
  });

  beforeEach(() => {
    mockXHR.setup();
    const accessToken = mockToken();
    mockXHR.get(
      `https://api.mapbox.com/styles/v1/mockuser/foo?access_token=${accessToken}`,
      {
        status: 200,
        headers: {
          'Content-Length': '18',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ mockStyle: true })
      }
    );
    const client = browserClient({ accessToken });

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
      expect(progressUpload).toEqual([]);
    });
  });

  test('request.emitter should emit downloadProgress events', () => {
    let progressDownload = [];
    request.emitter.on(constants.EVENT_PROGRESS_DOWNLOAD, resp => {
      progressDownload.push(Object.assign({}, resp));
    });

    return request.send().then(() => {
      expect(progressDownload).toEqual([
        { percent: 100, total: 18, transferred: 18 }
      ]);
    });
  });
});
