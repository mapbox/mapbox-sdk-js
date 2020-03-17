'use strict';

var node = require('./node-layer');
var MapiClient = require('../classes/mapi-client');
/** @ignore @typedef {import("../classes/mapi-client").MapiClientOptions} MapiClientOptions*/
/** @ignore @typedef {import("../classes/mapi-client")} MapiClient*/

/**
 * @ignore
 * @constructor
 * @implements {MapiClient}
 * @param {MapiClientOptions} options
 */
class NodeClient extends MapiClient {
  sendRequest(request) {
    return node.nodeSend.bind(this)(request);
  }
  abortRequest(request) {
    return node.nodeAbort.bind(this)(request);
  }
}

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
