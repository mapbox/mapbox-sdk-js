'use strict';

const browserLayer = require('../browser-layer');
const constants = require('../../constants');

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

  test('upload progress event is normalized and emitted', () => {
    const request = {
      id: 'fake',
      file: {},
      emitter: {
        emit: jest.fn()
      }
    };
    const xhr = {
      send: jest.fn(),
      upload: {},
      getAllResponseHeaders: jest.fn()
    };
    const mockEvent = {
      total: 26,
      loaded: 13
    };

    const send = browserLayer.sendRequestXhr(request, xhr);
    xhr.status = 200;
    xhr.response = 'fake response';
    xhr.onload();
    return send.then(() => {
      xhr.upload.onprogress(mockEvent);
      expect(request.emitter.emit).toHaveBeenCalledWith(
        constants.EVENT_PROGRESS_UPLOAD,
        {
          total: 26,
          transferred: 13,
          percent: 50
        }
      );
    });
  });

  test('XHR-initialization error causes Promise to reject', () => {
    const request = { id: 'fake', body: 'really fake' };
    const xhr = {
      send: jest.fn(),
      upload: {},
      getAllResponseHeaders: jest.fn()
    };
    const mockError = new Error();

    const send = browserLayer.sendRequestXhr(request, xhr);
    xhr.status = 200;
    xhr.response = 'fake response';
    xhr.onerror(mockError);
    expect(send).rejects.toThrow(mockError);
  });
});
