'use strict';

const MapiRequest = require('../mapi-request');
const tu = require('../../../test/test-utils');

function createMockClient() {
  return {
    sendRequest: jest.fn(() => Promise.resolve({ body: 'mock' })),
    abortRequest: jest.fn(),
    _origin: 'mockClientOrigin'
  };
}

test('errors without a client', () => {
  tu.expectError(
    () => {
      new MapiRequest();
    },
    error => {
      expect(error.message).toMatch(/client/);
    }
  );
});

test('has unique id', () => {
  const client = createMockClient();
  const requestA = new MapiRequest(client, {
    path: 'mockUrl',
    method: 'MOCK_METHOD'
  });
  expect(typeof requestA.id).toBe('number');
  const requestB = new MapiRequest(client, {
    path: 'mockUrl',
    method: 'MOCK_METHOD'
  });
  expect(typeof requestB.id).toBe('number');
  expect(requestA.id).not.toBe(requestB.id);
});

test('sets instance fields, minimal options', () => {
  const client = createMockClient();
  const request = new MapiRequest(client, {
    path: 'mockUrl',
    method: 'MOCK_METHOD'
  });

  expect(request).toMatchObject({
    client,
    path: 'mockUrl',
    method: 'MOCK_METHOD',
    headers: {}
  });
});

test('sets instance fields, all options', () => {
  const client = createMockClient();
  const mockHeaders = { accept: 'nothing' };
  const mockBody = { foo: 'bar' };
  const mockFile = {};
  const request = new MapiRequest(client, {
    path: 'mockUrl',
    origin: 'mockClientOrigin',
    method: 'MOCK_METHOD',
    headers: mockHeaders,
    body: mockBody,
    file: mockFile
  });

  expect(request).toMatchObject({
    client,
    path: 'mockUrl',
    origin: 'mockClientOrigin',
    method: 'MOCK_METHOD',
    headers: {
      'content-type': 'application/json',
      accept: 'nothing'
    },
    body: { foo: 'bar' },
    file: mockFile
  });
});

describe('MapiRequest#send', () => {
  test('success', () => {
    const client = createMockClient();
    const expectedResponse = {};
    client.sendRequest.mockReturnValue(Promise.resolve(expectedResponse));
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    return request.send().then(response => {
      expect(response).toBe(expectedResponse);
    });
  });

  test('catching an error', () => {
    const client = createMockClient();
    const expectedError = new Error('error-message');
    client.sendRequest.mockReturnValue(Promise.reject(expectedError));
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    return tu.expectRejection(request.send(), error => {
      expect(error).toBe(expectedError);
    });
  });
});

describe('MapiRequest#eachPage', () => {
  test('one page', done => {
    const client = createMockClient();
    const mockResponses = [
      {
        page: 1,
        nextPage: () => null
      }
    ];
    let responseIndex = -1;
    const send = () => {
      responseIndex += 1;
      return Promise.resolve(mockResponses[responseIndex]);
    };
    client.sendRequest = send;
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    expect.hasAssertions();
    let pagesChecked = 0;
    const checkPage = (error, response, callback) => {
      pagesChecked += 1;
      expect(error).toBeNull();
      expect(response).toHaveProperty('page', pagesChecked);
      callback();
    };
    request.eachPage(checkPage);
    process.nextTick(() => {
      expect(pagesChecked).toBe(1);
      done();
    });
  });

  test('three pages', done => {
    const client = createMockClient();
    const mockResponses = [
      {
        page: 1,
        nextPage: () => ({
          send: () => Promise.resolve(mockResponses[1])
        })
      },
      {
        page: 2,
        nextPage: () => ({
          send: () => Promise.resolve(mockResponses[2])
        })
      },
      {
        page: 3,
        nextPage: () => null
      }
    ];
    let responseIndex = -1;
    const send = () => {
      responseIndex += 1;
      return Promise.resolve(mockResponses[responseIndex]);
    };
    client.sendRequest = send;
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    expect.hasAssertions();
    let pagesChecked = 0;
    const checkPage = (error, response, callback) => {
      pagesChecked += 1;
      expect(error).toBeNull();
      expect(response).toHaveProperty('page', pagesChecked);
      callback();
    };
    request.eachPage(checkPage);
    process.nextTick(() => {
      expect(pagesChecked).toBe(3);
      done();
    });
  });

  test('passes errors through', done => {
    const client = createMockClient();
    const expectedError = new Error();
    const mockResponses = [
      {
        page: 1,
        nextPage: () => ({
          send: () => Promise.resolve(mockResponses[1])
        })
      },
      {
        page: 2,
        nextPage: () => ({
          send: () => Promise.reject(expectedError)
        })
      },
      {
        page: 3,
        nextPage: () => null
      }
    ];
    let responseIndex = -1;
    client.sendRequest = () => {
      responseIndex += 1;
      return Promise.resolve(mockResponses[responseIndex]);
    };
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    expect.hasAssertions();
    let pagesChecked = 0;
    const checkPage = (error, response, callback) => {
      pagesChecked += 1;
      if (pagesChecked === 3) {
        expect(error).toBe(expectedError);
        expect(response).toBeNull();
      } else {
        expect(error).toBeNull();
        expect(response).toHaveProperty('page', pagesChecked);
        callback();
      }
    };
    request.eachPage(checkPage);
    process.nextTick(() => {
      expect(pagesChecked).toBe(3);
      done();
    });
  });
});

describe('MapiRequest#abort', () => {
  test("calls client's abort method", () => {
    const client = createMockClient();
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    request.send();
    request.abort();
    expect(client.abortRequest).toHaveBeenCalled();
  });

  test("sets request's aborted property", () => {
    const client = createMockClient();
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    request.send();
    expect(request.aborted).toBe(false);
    request.abort();
    expect(request.aborted).toBe(true);
  });

  test('if there is a next page request, cancels it', () => {
    // This assumes that eachPage is corrrectly assigning
    // request.nextPageRequest.
    const client = createMockClient();
    const request = new MapiRequest(client, {
      path: 'mockUrl',
      method: 'MOCK_METHOD'
    });
    request.send();
    const nextPageRequestAbort = jest.fn();
    request._nextPageRequest = { abort: nextPageRequestAbort };
    request.abort();
    expect(nextPageRequestAbort).toHaveBeenCalled();
    expect(request).not.toHaveProperty('nextPageRequest');
  });
});
