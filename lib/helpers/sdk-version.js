'use strict';

var pkg = require('../../package.json');

// The UA product token is the repo/UA name (`mapbox-sdk-js`), which differs
// from the published package name (`@mapbox/mapbox-sdk`).
var PRODUCT_NAME = 'mapbox-sdk-js';

/**
 * Get this SDK's User-Agent product token, e.g. `mapbox-sdk-js/0.16.3`.
 * The version is read from package.json, so it can never drift from the
 * published package version.
 *
 * @returns {string}
 */
function getUserAgent() {
  return PRODUCT_NAME + '/' + pkg.version;
}

module.exports = getUserAgent;
