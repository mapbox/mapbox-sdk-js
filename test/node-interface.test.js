'use strict';

const nodeClient = require('../lib/node/node-client');
const tu = require('./test-utils');
const testSharedInterface = require('./test-shared-interface');

describe('shared interface tests', () => {
  testSharedInterface(nodeClient);
});

test('errors early if access token not provided', () => {
  tu.expectError(
    () => nodeClient(),
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});
