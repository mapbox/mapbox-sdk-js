'use strict';

var node = require('./node-layer');
var MapiClient = require('../classes/mapi-client');
/** @ignore @typedef {import("../classes/mapi-client").MapiClientOptions} MapiClientOptions*/

/**
 * @ignore
 * @constructor
 * @implements {MapiClient}
 * @param {MapiClientOptions} options
 */
function NodeClient(options) {
  MapiClient.call(this, options);
}
NodeClient.prototype = Object.create(MapiClient.prototype);
NodeClient.prototype.constructor = NodeClient;

NodeClient.prototype.sendRequest = node.nodeSend;
NodeClient.prototype.abortRequest = node.nodeAbort;

/**
 * Create a client for Node.
 *
 * @param {Object} options
 * @param {string} options.accessToken
 * @param {string} [options.origin]
 * @returns {MapiClient}
 */
function createNodeClient(options) {
  return new NodeClient(options);
}

module.exports = createNodeClient;
