'use strict';

const MapiError = require('../mapi-error');
const constants = require('../../constants');

const mockRequest = {};

test('HTTP error with body that includes a message, and no options.message', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 401,
    body: '{"message":"You cannot see this"}'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(401);
  expect(error.body).toEqual({ message: 'You cannot see this' });
  expect(error.message).toBe('You cannot see this');
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with body that includes a message, but options.message overrides', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 401,
    body: '{"message":"You cannot see this"}',
    message: 'This is important'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(401);
  expect(error.body).toEqual({ message: 'You cannot see this' });
  expect(error.message).toBe('This is important');
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with body that does not include a message, and no options.message', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 477,
    body: '{"foo":"bar"}'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(477);
  expect(error.body).toEqual({ foo: 'bar' });
  expect(error.message).toBeNull();
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with body that is a string', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 477,
    body: 'Hello'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(477);
  expect(error.body).toBe('Hello');
  expect(error.message).toBe('Hello');
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with body that cannot be parsed as JSON', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 477,
    body: '{Hello}'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(477);
  expect(error.body).toBe('{Hello}');
  expect(error.message).toBe('{Hello}');
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with body that does not include a message, but options.message is provided', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 477,
    body: '{"foo":"bar"}',
    message: 'This is important'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(477);
  expect(error.body).toEqual({ foo: 'bar' });
  expect(error.message).toBe('This is important');
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with no body or options.message', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 500
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(500);
  expect(error.body).toBeNull();
  expect(error.message).toBeNull();
  expect(error.request).toBe(mockRequest);
});

test('HTTP error with options.message but no body', () => {
  const error = new MapiError({
    request: mockRequest,
    statusCode: 500,
    message: 'Oops'
  });
  expect(error.type).toBe(constants.ERROR_HTTP);
  expect(error.statusCode).toBe(500);
  expect(error.body).toBeNull();
  expect(error.message).toBe('Oops');
  expect(error.request).toBe(mockRequest);
});

test('RequestAbortedError', () => {
  const error = new MapiError({
    request: mockRequest,
    type: constants.ERROR_REQUEST_ABORTED
  });
  expect(error.type).toBe(constants.ERROR_REQUEST_ABORTED);
  expect(error.statusCode).toBeNull();
  expect(error.body).toBeNull();
  expect(error.message).toBe('Request aborted');
  expect(error.request).toBe(mockRequest);
});
