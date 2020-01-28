'use strict';

const tilesets = require('../services/tilesets');
const styles = require('../services/styles');
const MapiRequest = require('../lib/classes/mapi-request');
const MapiResponse = require('../lib/classes/mapi-response');
const MapiError = require('../lib/classes/mapi-error');
const MapiClient = require('../lib/classes/mapi-client');
const constants = require('../lib/constants');
const tu = require('./test-utils');

const { mockToken, expectRejection } = tu;

function testSharedInterface(createClient) {
  let server;
  let createLocalClient;
  beforeAll(() => {
    return tu.mockServer().then(s => {
      server = s;
      createLocalClient = server.localClient(createClient);
    });
  });
  afterAll(done => {
    server.close(done);
  });
  afterEach(() => {
    server.reset();
  });

  describe('client initialization', () => {
    test('fails if you provide an invalid access token', () => {
      tu.expectError(
        () => {
          createLocalClient({ accessToken: 'not right' });
        },
        error => {
          expect(error.message).toBe('Invalid token');
        }
      );
      tu.expectError(
        () => {
          createLocalClient({ accessToken: 'pk.ezMzMw==' });
        },
        error => {
          expect(error.message).toBe('Invalid token');
        }
      );
    });

    test('exposes the access token', () => {
      const accessToken = mockToken();
      const client = createLocalClient({ accessToken });
      expect(client.accessToken).toBe(accessToken);
    });
  });

  describe('create a service client without specifying the base client', () => {
    test('works', () => {
      const tilesetsClient = tilesets({ accessToken: mockToken() });
      expect(tilesetsClient.client).toBeInstanceOf(MapiClient);
      const request = tilesetsClient.listTilesets({ ownerId: 'mockery' });
      expect(request.client).toBe(tilesetsClient.client);
    });

    test("a service client's base client can be reused for other service clients", () => {
      const tilesetsClient = tilesets({ accessToken: mockToken() });
      const stylesClient = styles(tilesetsClient.client);
      expect(stylesClient.client).toBeInstanceOf(MapiClient);
      expect(stylesClient.client).toBe(tilesetsClient.client);
      const request = stylesClient.getStyle({
        ownerId: 'mockery',
        styleId: 'foo'
      });
      expect(request.client).toBe(stylesClient.client);
      expect(request.client).toBe(tilesetsClient.client);
    });
  });

  describe('request initialization', () => {
    let request;
    let client;
    beforeEach(() => {
      const accessToken = mockToken();
      client = createLocalClient({ accessToken });
      request = client.createRequest({
        method: 'GET',
        path: '/styles/v1/:ownerId/:styleId',
        styleId: 'mock-style-id'
      });
    });

    test('fails without path and method', () => {
      tu.expectError(
        () => {
          client.createRequest({ foo: 'bar ' });
        },
        error => {
          expect(error.message).toMatch(/path and method/);
        }
      );
    });

    test('exposes an event emitter', () => {
      expect(request.emitter).toBeTruthy();
      expect(typeof request.emitter.on).toBe('function');
    });

    test('starts with `response: null`', () => {
      expect(request.response).toBeNull();
    });

    test('starts with `error: null`', () => {
      expect(request.error).toBeNull();
    });

    test('starts with `aborted: false`', () => {
      expect(request.aborted).toBe(false);
    });

    test('exposes public methods', () => {
      expect(request.send).toBeInstanceOf(Function);
      expect(request.abort).toBeInstanceOf(Function);
      expect(request.eachPage).toBeInstanceOf(Function);
      expect(request.clone).toBeInstanceOf(Function);
    });

    test('does not error if you abort before sending', () => {
      expect(() => {
        request.abort();
      }).not.toThrow();
    });

    test('requests can have thier own designated origins', () => {
      const specialRequest = client.createRequest({
        method: 'GET',
        path: '/styles/v1/:ownerId/:styleId',
        styleId: 'mock-style-id',
        origin: 'https://www.fake.com'
      });
      expect(specialRequest.origin).toBe('https://www.fake.com');
    });
  });

  describe('HTTP methods', () => {
    let client;
    beforeEach(() => {
      const accessToken = mockToken();
      client = createLocalClient({ accessToken });
    });

    const sendRequest = method => {
      return client
        .createRequest({
          method,
          path: '/foodstuffs/v1/:ownerId'
        })
        .send();
    };

    test('GET', () => {
      return server.captureRequest(() => sendRequest('GET')).then(req => {
        expect(req.method).toBe('GET');
      });
    });

    test('POST', () => {
      return server.captureRequest(() => sendRequest('POST')).then(req => {
        expect(req.method).toBe('POST');
      });
    });

    test('PUT', () => {
      return server.captureRequest(() => sendRequest('PUT')).then(req => {
        expect(req.method).toBe('PUT');
      });
    });

    test('PATCH', () => {
      return server.captureRequest(() => sendRequest('PATCH')).then(req => {
        expect(req.method).toBe('PATCH');
      });
    });

    test('DELETE', () => {
      return server.captureRequest(() => sendRequest('DELETE')).then(req => {
        expect(req.method).toBe('DELETE');
      });
    });
  });

  describe('route params', () => {
    let client;
    beforeEach(() => {
      const accessToken = mockToken();
      client = createLocalClient({ accessToken });
    });

    test('no route params', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1'
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.path).toBe('/styles/v1');
      });
    });

    test('explicit ownerId overrides default', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId',
            params: { ownerId: 'specialguy' }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.path).toBe(`/styles/v1/specialguy`);
      });
    });

    test('params are encoded', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId/:styleId',
            params: {
              ownerId: 'specialguy',
              styleId: 'Wolf & Friend'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.path).toBe(`/styles/v1/specialguy/Wolf%20%26%20Friend`);
      });
    });

    test('@2x is not encoded', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId/:styleId/sprite@2x.png',
            params: {
              ownerId: 'specialguy',
              styleId: 'Wolf & Friend'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.path).toBe(
          `/styles/v1/specialguy/Wolf%20%26%20Friend/sprite@2x.png`
        );
      });
    });

    test('multiple params', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
            params: {
              ownerId: 'a',
              styleId: 'b',
              iconId: 'c'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.path).toBe(`/styles/v1/a/b/sprite/c`);
      });
    });

    test('missing param errors', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId/:styleId',
            params: {
              ownerId: 'a'
            }
          })
          .send();
      };
      tu.expectRejection(sendRequest(), error => {
        expect(error.message).toBe('Unspecified route parameter styleId');
      });
    });
  });

  describe('query params', () => {
    let client;
    beforeEach(() => {
      const accessToken = mockToken();
      client = createLocalClient({ accessToken });
    });

    test('no query', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId'
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.originalUrl.split('?')[1]).toBe(
          `access_token=${client.accessToken}`
        );
      });
    });

    test('empty query', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId',
            query: {}
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.originalUrl.split('?')[1]).toBe(
          `access_token=${client.accessToken}`
        );
      });
    });

    test('mixed-type query params', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId',
            query: {
              start: 1234,
              happy: true,
              sad: false,
              name: 'pal'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.originalUrl).toContain(
          `?start=1234&happy&name=pal&access_token=${client.accessToken}`
        );
      });
    });

    test('keys and values are both encoded', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId',
            query: {
              'restaurant name': 'Wolf & Man'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.originalUrl).toContain(
          `?restaurant%20name=Wolf%20%26%20Man&access_token=${
            client.accessToken
          }`
        );
      });
    });
  });

  describe('headers', () => {
    let client;
    beforeEach(() => {
      const accessToken = mockToken();
      client = createLocalClient({ accessToken });
    });

    test('default headers with body', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'POST',
            path: '/styles/v1/:ownerId',
            body: { style: {} }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.headers).toMatchObject({
          'content-type': 'application/json'
        });
      });
    });

    test('default headers can be overridden', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'POST',
            path: '/styles/v1/:ownerId',
            body: { style: {} },
            headers: {
              'Content-Type': 'application/octet-stream',
              Accept: 'text/csv'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.headers).toMatchObject({
          'content-type': 'application/octet-stream',
          accept: 'text/csv'
        });
      });
    });

    test('any headers can be added', () => {
      const sendRequest = () => {
        return client
          .createRequest({
            method: 'GET',
            path: '/styles/v1/:ownerId',
            headers: {
              'If-Unmodified-Since': 'Wed, 11 Apr 2018 17:09:50 GMT',
              'x-horse-name': 'Steuben',
              'X-DOG-NAME': 'Paul, Cat'
            }
          })
          .send();
      };
      return server.captureRequest(sendRequest).then(req => {
        expect(req.headers).toMatchObject({
          'if-unmodified-since': 'Wed, 11 Apr 2018 17:09:50 GMT',
          'x-horse-name': 'Steuben',
          'x-dog-name': 'Paul, Cat'
        });
      });
    });
  });

  describe('unpaginated GET that succeeds', () => {
    let request;
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

    test('request.send returns a Promise', () => {
      expect(request.send()).toBeInstanceOf(Promise);
    });

    test(`request.send's Promise resolves with a MapiResponse`, () => {
      return request.send().then(resp => {
        expect(resp).toBeInstanceOf(MapiResponse);
      });
    });

    test(`response.body exposes parsed body`, () => {
      return request.send().then(resp => {
        expect(resp.body).toEqual({ mockStyle: true });
      });
    });

    test(`response.rawBody exposes unparsed body`, () => {
      return request.send().then(resp => {
        expect(resp.rawBody).toBe(JSON.stringify({ mockStyle: true }));
      });
    });

    test(`response.request exposes request`, () => {
      return request.send().then(resp => {
        expect(resp.request).toBe(request);
      });
    });

    test(`response.statusCode exposes status code`, () => {
      return request.send().then(resp => {
        expect(resp.statusCode).toBe(200);
      });
    });

    test(`response.headers exposes parsed headers`, () => {
      return request.send().then(resp => {
        expect(resp.headers).toMatchObject({
          'content-type': 'application/json; charset=utf-8'
        });
      });
    });

    test(`response.links is empty`, () => {
      return request.send().then(resp => {
        expect(resp.links).toEqual({});
      });
    });

    test(`response.hasNextPage returns false`, () => {
      return request.send().then(resp => {
        expect(resp.hasNextPage()).toBe(false);
      });
    });

    test(`response.nextPage returns null`, () => {
      return request.send().then(resp => {
        expect(resp.nextPage()).toBeNull();
      });
    });

    test(`request.emitter emits a 'response' event with the same MapiResponse that the Promise resolves with`, () => {
      let emitterResp;
      request.emitter.on(constants.EVENT_RESPONSE, resp => {
        emitterResp = resp;
      });
      return request.send().then(resp => {
        expect(resp).toBe(emitterResp);
      });
    });

    test('response is saved on request.response', () => {
      return request.send().then(resp => {
        expect(request.response).toBe(resp);
      });
    });

    test('once request has received a response, it cannot be sent again', () => {
      return request.send().then(() => {
        expect(() => {
          request.send();
        }).toThrow('has already been sent');
      });
    });

    test('request cannot be sent multiple times at once', () => {
      expect(() => {
        request.send();
        request.send();
      }).toThrow('has already been sent');
    });

    test('should not error if you abort after the response is received', () => {
      return request.send().then(() => {
        expect(() => {
          request.abort();
        }).not.toThrow();
      });
    });

    test('after the response is received, request.clone returns a new equivalent request that you can send', () => {
      return request.send().then(firstResp => {
        const clone = request.clone();
        return clone.send().then(secondResp => {
          expect(firstResp).not.toBe(secondResp);
          expect(firstResp.body).toEqual(secondResp.body);
        });
      });
    });
  });

  describe('unpaginated GET that fails with a 404', () => {
    let request;
    beforeEach(() => {
      server.setResponse((req, res) => {
        res.append('Content-Type', 'application/json; charset=utf-8');
        res.status(404);
        res.send({ message: 'Style not found' });
      });

      const accessToken = mockToken();
      const client = createLocalClient({ accessToken });
      request = client.createRequest({
        method: 'GET',
        path: '/styles/v1/:ownerId/:styleId',
        params: { styleId: 'foo' }
      });
    });

    test(`request.send's Promise rejects with a MapiError`, () => {
      return expectRejection(request.send(), error => {
        expect(error).toBeInstanceOf(MapiError);
      });
    });

    test(`error.type exposes MapiError type`, () => {
      return expectRejection(request.send(), error => {
        expect(error.type).toBe('HttpError');
      });
    });

    test(`error.statusCode exposes HTTP status code`, () => {
      return expectRejection(request.send(), error => {
        expect(error.statusCode).toBe(404);
      });
    });

    test(`error.body exposes parsed JSON body of response`, () => {
      return expectRejection(request.send(), error => {
        expect(error.body).toEqual({ message: 'Style not found' });
      });
    });

    test(`error.request exposes the request`, () => {
      return expectRejection(request.send(), error => {
        expect(error.request).toBe(request);
      });
    });

    test(`error.message combines status code and the error's message property`, () => {
      return expectRejection(request.send(), error => {
        expect(error.message).toBe('Style not found');
      });
    });

    test(`request.emitter emits an 'error' event with the same MapiError that the Promise rejects with`, () => {
      let emitterError;
      request.emitter.on(constants.EVENT_ERROR, error => {
        emitterError = error;
      });
      return expectRejection(request.send(), error => {
        expect(error).toBe(emitterError);
      });
    });

    test('error is saved on request.error', () => {
      return expectRejection(request.send(), error => {
        expect(request.error).toBe(error);
      });
    });

    test('once request has errored, it cannot be sent again', () => {
      return expectRejection(request.send(), () => {
        expect(() => {
          request.send();
        }).toThrow('has already been sent');
      });
    });

    test('should not error if you abort after the request errors', () => {
      return expectRejection(request.send(), () => {
        expect(() => {
          request.abort();
        }).not.toThrow();
      });
    });

    test('after the request errors, request.clone returns a new equivalent request that you can send', () => {
      return expectRejection(request.send(), firstErr => {
        const clone = request.clone();
        return expectRejection(clone.send(), secondErr => {
          expect(firstErr).not.toBe(secondErr);
          expect(firstErr.response).toEqual(secondErr.response);
        });
      });
    });
  });

  describe('paginated GET that succeeds for every page', () => {
    let request;
    beforeEach(() => {
      server.setResponse((req, res) => {
        res.append('Content-Type', 'application/json; charset=utf-8');
        let body = {};
        let link;
        if (!req.query.start) {
          body = [{ a: 1 }, { a: 2 }];
          link = `<${
            server.origin
          }/tilesets/v1/mockuser?start=mockstart1>; rel="next">`;
        } else if (req.query.start === 'mockstart1') {
          body = [{ a: 3 }, { a: 4 }];
          link = `<${
            server.origin
          }/tilesets/v1/mockuser?start=mockstart2>; rel="next">`;
        } else if (req.query.start === 'mockstart2') {
          body = [{ a: 5 }, { a: 6 }];
          link = '';
        } else {
          throw new Error(`Unexpected request`);
        }
        if (link) {
          res.append('Link', [link]);
        }
        res.json(body);
      });

      const accessToken = mockToken();
      const client = createLocalClient({ accessToken });
      const tilesetsService = tilesets(client);
      request = tilesetsService.listTilesets();
    });

    test(`request.send's Promise resolves with a MapiResponse`, () => {
      return request.send().then(resp => {
        expect(resp).toBeInstanceOf(MapiResponse);
      });
    });

    test('first page includes expected results', () => {
      return request.send().then(resp => {
        expect(resp.body).toEqual([{ a: 1 }, { a: 2 }]);
      });
    });

    test(`response.headers includes unparsed link header as well as the other headers`, () => {
      return request.send().then(resp => {
        expect(resp.headers).toMatchObject({
          'content-type': 'application/json; charset=utf-8',
          link: `<${
            server.origin
          }/tilesets/v1/mockuser?start=mockstart1>; rel="next">`
        });
      });
    });

    test(`response.links includes parsed link header`, () => {
      return request.send().then(resp => {
        expect(resp.links).toMatchObject({
          next: {
            params: {},
            url: `${server.origin}/tilesets/v1/mockuser?start=mockstart1`
          }
        });
      });
    });

    test(`response.hasNextPage returns true`, () => {
      return request.send().then(resp => {
        expect(resp.hasNextPage()).toBe(true);
      });
    });

    test(`response.nextPage returns a MapiRequest for the next page`, () => {
      return request.send().then(resp => {
        const nextPageRequest = resp.nextPage();
        expect(nextPageRequest).toBeInstanceOf(MapiRequest);
      });
    });

    test(`the request from response.nextPage gets the next page`, () => {
      return request
        .send()
        .then(page1 => {
          const nextPageRequest = page1.nextPage();
          return nextPageRequest.send();
        })
        .then(page2 => {
          expect(page2.body).toEqual([{ a: 3 }, { a: 4 }]);
        });
    });

    test(`the response for the last page has the expected body`, () => {
      return request
        .send()
        .then(page1 => {
          return page1.nextPage().send();
        })
        .then(page2 => {
          return page2.nextPage().send();
        })
        .then(page3 => {
          expect(page3.body).toEqual([{ a: 5 }, { a: 6 }]);
        });
    });

    test(`the response for the last page has no parsed link`, () => {
      return request
        .send()
        .then(page1 => {
          return page1.nextPage().send();
        })
        .then(page2 => {
          return page2.nextPage().send();
        })
        .then(page3 => {
          expect(page3.links).toEqual({});
        });
    });

    test(`the response for the last page returns false from hasNextPage`, () => {
      return request
        .send()
        .then(page1 => {
          return page1.nextPage().send();
        })
        .then(page2 => {
          return page2.nextPage().send();
        })
        .then(page3 => {
          expect(page3.hasNextPage()).toBe(false);
        });
    });

    test('request.eachPage iterates over all pages', done => {
      expect.assertions(6);
      let currentPage = 0;
      request.eachPage((error, resp, next) => {
        currentPage += 1;
        expect(error).toBeNull();
        if (currentPage === 1) {
          expect(resp.body).toEqual([{ a: 1 }, { a: 2 }]);
        } else if (currentPage === 2) {
          expect(resp.body).toEqual([{ a: 3 }, { a: 4 }]);
        } else if (currentPage === 3) {
          expect(resp.body).toEqual([{ a: 5 }, { a: 6 }]);
        } else {
          throw new Error('Unexpected page');
        }
        if (resp.hasNextPage() === false) {
          done();
        }
        next();
      });
    });

    test(`after each page's response is received, that page's request cannot be re-sent`, done => {
      expect.assertions(6);
      request.eachPage((error, resp, next) => {
        expect(error).toBeNull();
        expect(() => {
          resp.request.send();
        }).toThrow('has already been sent');
        if (resp.hasNextPage() === false) {
          done();
        }
        next();
      });
    });
  });

  describe('aborting an unpaginated request', () => {
    let request;
    beforeEach(() => {
      server.setResponse(() => {
        // Let it hang.
      });

      const accessToken = mockToken();
      const client = createLocalClient({ accessToken });
      request = client.createRequest({
        method: 'GET',
        path: '/styles/v1/:ownerId/:styleId',
        params: { styleId: 'foo' }
      });
    });

    test(`request.send's Promise rejects with a MapiError`, () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, error => {
          expect(error).toBeInstanceOf(MapiError);
        });
      });
    });

    test('the request exposes `aborted: true`', () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, () => {
          expect(request.aborted).toBe(true);
        });
      });
    });

    test(`the error does not expose a statusCode or error property`, () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, error => {
          expect(error.status).toBeUndefined();
          expect(error.error).toBeUndefined();
        });
      });
    });

    test('the error has `response.null`', () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, error => {
          expect(error.body).toBeNull();
        });
      });
    });

    test(`the resultant error has a type and message indicating the cause`, () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, error => {
          expect(error.type).toBe('RequestAbortedError');
          expect(error.message).toBe('Request aborted');
        });
      });
    });

    test('once request has been aborted, it cannot be sent again', () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, () => {
          expect(() => {
            request.send();
          }).toThrow('has already been sent');
        });
      });
    });

    test('after the request errors, request.clone returns a new equivalent request that you can send', () => {
      const sent = request.send();
      return Promise.resolve(() => {
        request.abort();
        return expectRejection(sent, () => {
          const clone = request.clone();
          expect(clone.aborted).toBe(false);
          expect(() => {
            clone.send();
          }).not.toThrow();
        });
      });
    });
  });

  describe('aborting a paginated request', () => {
    let request;
    beforeEach(() => {
      server.setResponse((req, res) => {
        if (!req.query.start) {
          res.append('Content-Type', 'application/json; charset=utf-8');
          res.append('Link', [
            `<${
              server.origin
            }/tilesets/v1/mockuser?start=mockstart1>; rel="next"`
          ]);
          res.json([{ a: 1 }, { a: 2 }]);
        } else if (req.query.start === 'mockstart1') {
          // Let it hang
        } else {
          throw new Error(`Unexpected request`);
        }
      });

      const accessToken = mockToken();
      const client = createLocalClient({ accessToken });
      const tilesetsService = tilesets(client);
      request = tilesetsService.listTilesets();
    });

    test('requests created by eachPage are aborted when the original request is aborted', done => {
      let currentPage = 0;
      request.eachPage((error, resp, next) => {
        currentPage += 1;
        if (currentPage === 1) {
          expect(error).toBeNull();
          expect(resp).not.toBeNull();
          next();
          setTimeout(() => {
            request.abort();
          }, 100);
        } else if (currentPage === 2) {
          expect(error).toBeInstanceOf(MapiError);
          expect(error.type).toBe('RequestAbortedError');
          expect(resp).toBeNull();
          expect(() => {
            next();
          }).not.toThrow();
          done();
        } else {
          throw new Error('Unexpected page');
        }
      });
    });
  });
}

module.exports = testSharedInterface;
