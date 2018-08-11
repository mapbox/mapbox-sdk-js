'use strict';

const browserLayer = require('../browser-layer');

describe('sendRequestXhr', () => {
  test('upload progress event is not assigned if the request does not include a body or file', () => {
    const request = { id: 'fake' };
    const xhr = {
      send: jest.fn(),
      upload: {},
      getAllResponseHeaders: jest.fn()
    };

    const send = browserLayer.sendRequestXhr(request, xhr);
    xhr.status = 200;
    xhr.response = 'fake response';
    xhr.onload();
    return send.then(() => {
      expect(xhr.upload).not.toHaveProperty('onprogress');
    });
  });

  test('upload progress event is not assigned if the request includes a body', () => {
    const request = { id: 'fake', body: 'really fake' };
    const xhr = {
      send: jest.fn(),
      upload: {},
      getAllResponseHeaders: jest.fn()
    };

    const send = browserLayer.sendRequestXhr(request, xhr);
    xhr.status = 200;
    xhr.response = 'fake response';
    xhr.onload();
    return send.then(() => {
      expect(xhr.upload).not.toHaveProperty('onprogress');
    });
  });

  test('upload progress event is assigned if the request includes a file', () => {
    const request = { id: 'fake', file: {} };
    const xhr = {
      send: jest.fn(),
      upload: {},
      getAllResponseHeaders: jest.fn()
    };

    const send = browserLayer.sendRequestXhr(request, xhr);
    xhr.status = 200;
    xhr.response = 'fake response';
    xhr.onload();
    return send.then(() => {
      expect(xhr.upload).toHaveProperty('onprogress');
    });
  });
});
