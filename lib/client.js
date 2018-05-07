'use strict';

// The "browser" field in "package.json" instructs browser
// bundlers to override this an load browser/browser-client, instead.
var nodeClient = require('./node/node-client');

module.exports = nodeClient;
