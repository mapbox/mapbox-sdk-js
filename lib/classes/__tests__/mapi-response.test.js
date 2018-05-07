'use strict';

jest.mock('../../helpers/parse-link-header', () => {
  return jest.fn(() => ({ parsed: 'link-header' }));
});

const MapiResponse = require('../mapi-response');
const MapiRequest = require('../mapi-request');
const parseLinkHeader = require('../../helpers/parse-link-header');

function dummyRequest() {
  return new MapiRequest(
    {},
    {
      method: 'GET',
      path: '/styles/v1/mockuser'
    }
  );
}

describe('MapiResponse', () => {
  test('sets public instance fields', () => {
    const request = dummyRequest();
    const response = new MapiResponse(request, {
      headers: {
        mock: true,
        link: 'yaya'
      },
      body: '{ "mock": "body" }'
    });
    expect(response).toHaveProperty('request', request);
    expect(response).toHaveProperty('rawBody', '{ "mock": "body" }');
    expect(response).toHaveProperty('body', {
      mock: 'body'
    });
    expect(response).toHaveProperty('headers', { mock: true, link: 'yaya' });
    expect(response).toHaveProperty('links', {
      parsed: 'link-header'
    });
    expect(parseLinkHeader).toHaveBeenCalledWith('yaya');
  });
});

describe('MapiResponse#hasNextPage', () => {
  test('returns true if parsed links include a next page', () => {
    const request = dummyRequest();
    parseLinkHeader.mockReturnValueOnce({ next: { url: 'https://weep.com' } });
    const response = new MapiResponse(request, {
      headers: { mock: true },
      body: '{ "mock": "body" }'
    });
    expect(response.hasNextPage()).toBe(true);
  });

  test('returns false if parsed link do not include a next page', () => {
    const request = dummyRequest();
    parseLinkHeader.mockReturnValueOnce({ blah: { url: 'https://weep.com' } });
    const response = new MapiResponse(request, {
      headers: { mock: true },
      body: '{ "mock": "body" }'
    });
    expect(response.hasNextPage()).toBe(false);
  });
});

describe('MapiResopnse#nextPage', () => {
  test('returns null if there is no next page', () => {
    const request = dummyRequest();
    parseLinkHeader.mockReturnValueOnce({ blah: 'https://weep.com' });
    const response = new MapiResponse(request, {
      headers: { mock: true },
      body: '{ "mock": "body" }'
    });
    expect(response.nextPage()).toBeNull();
  });

  test('returns a new request if there is a next page', () => {
    const request = new MapiRequest(
      {},
      {
        method: 'PATCH',
        path: '/styles/v1/mockuser'
      }
    );
    parseLinkHeader.mockReturnValueOnce({ next: { url: 'https://weep.com' } });
    const response = new MapiResponse(request, {
      headers: { mock: true },
      body: '{ "mock": "body" }'
    });
    const nextPageRequest = response.nextPage();
    expect(nextPageRequest).toBeInstanceOf(MapiRequest);
    expect(nextPageRequest).toMatchObject({
      path: 'https://weep.com',
      method: 'PATCH'
    });
  });
});
