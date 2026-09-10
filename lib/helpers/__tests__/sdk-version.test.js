'use strict';

const getUserAgent = require('../sdk-version');
const pkg = require('../../../package.json');

test('returns the mapbox-sdk-js product token with the package.json version', () => {
  expect(getUserAgent()).toBe(`mapbox-sdk-js/${pkg.version}`);
});
