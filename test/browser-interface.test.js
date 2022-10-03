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
  testSharedInterface(browserClient, true); // second argument sets isBrowserClient to true
});

test('errors early if access token not provided', () => {
  tu.expectError(
    () => browserClient(),
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

// Note: there are discrepancies between the node progress events
// and browser progress events. For now we are assuming
// the discrepancies are not worth normalizing across these
// two platforms as no one would be planning to use them
// in unison.
describe('test progress events', () => {
  let request;
  const { mockToken } = tu;

  afterEach(() => {
    mockXHR.teardown();
  });

  beforeEach(() => {
    mockXHR.setup();
    const accessToken = mockToken();
    const responseBody = { mockStyle: true };

    // To mock the progress event
    // server needs to send the `Content-length` header
    // ref: https://github.com/jameslnewell/xhr-mock/tree/master/packages/xhr-mock#upload-progress
    mockXHR.get(
      `https://api.mapbox.com/styles/v1/mockuser/foo?access_token=${accessToken}`,
      {
        status: 200,
        headers: {
          'Content-Length': JSON.stringify(responseBody).length,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(responseBody)
      }
    );
    const client = browserClient({ accessToken });

    request = client.createRequest({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId',
      params: { styleId: 'foo' }
    });
  });

  test('request.emitter should not emit uploadProgress events', () => {
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
