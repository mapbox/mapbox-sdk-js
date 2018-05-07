/**
 * @jest-environment jsdom-global
 */
'use strict';

const browserClient = require('../lib/browser/browser-client');
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
