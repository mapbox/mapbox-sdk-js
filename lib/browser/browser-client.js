'use strict';

var browser = require('./browser-layer');
var MapiClient = require('../classes/mapi-client');
/** @ignore @typedef {import("../classes/mapi-client").MapiClientOptions} MapiClientOptions */
/**
 * @ignore
 * @class
 * @name BrowserClient
 * @implements {MapiClient}
 */
class BrowserClient extends MapiClient {
  sendRequest(request) {
    return browser.browserSend.bind(this)(request);
  }

  abortRequest(request) {
    return browser.browserAbort.bind(this)(request);
  }
}

/**
 * Create a client for the browser.
 *
 * @param {Object} options
 * @param {string} options.accessToken
 * @param {string} [options.origin]
 * @returns {MapiClient}
 */
function createBrowserClient(options) {
  return new BrowserClient(options);
}

module.exports = createBrowserClient;
