'use strict';

const MapiClient = require('../mapi-client');
const tu = require('../../../test/test-utils');
const constants = require('../../constants');

test('errors without options', () => {
  tu.expectError(
    () => {
      new MapiClient();
    },
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

test('errors without an accessToken option', () => {
  tu.expectError(
    () => {
      new MapiClient({ foo: 'bar' });
    },
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

test('errors with an invalid accessToken', () => {
  tu.expectError(
    () => {
      new MapiClient({ accessToken: 'bar' });
    },
    error => {
      expect(error.message).toMatch(/invalid token/i);
    }
  );
});

test('origin defaults to the standard public origin', () => {
  const client = new MapiClient({ accessToken: tu.mockToken() });
  expect(client.origin).toBe(constants.API_ORIGIN);
});
