'use strict';

var parseToken = require('@mapbox/parse-mapbox-token');
var MapiRequest = require('./mapi-request');
/** @ignore @typedef {import("./mapi-request").MapiRequestOptions} MapiRequestOptions */
var constants = require('../constants');

/**
 * A low-level Mapbox API client. Use it to create service clients
 * that share the same configuration.
 *
 * Services and `MapiRequest`s use the underlying `MapiClient` to
 * determine how to create, send, and abort requests in a way
 * that is appropriate to the configuration and environment
 * (Node or the browser).
 *
 * @class MapiClient
 * @interface
 * @property {string} accessToken - The Mapbox access token assigned
 *   to this client.
 * @property {string} [origin] - The origin
 *   to use for API requests. Defaults to https://api.mapbox.com.
 */

/**
 * @ignore
 * @typedef MapiClientOptions
 * @property {string} accessToken
 * @property {string} [origin]
 */

class MapiClient {
  /**
   * @ignore
   * @constructor
   * @param {MapiClientOptions} options
   */
  constructor(options) {
    if (!options || !options.accessToken) {
      throw new Error('Cannot create a client without an access token');
    }
    // Try parsing the access token to determine right away if it's valid.
    parseToken(options.accessToken);

    this.accessToken = options.accessToken;
    this.origin = options.origin || constants.API_ORIGIN;
  }
  /** @ignore @method @param {MapiRequestOptions} requestOptions */
  createRequest(requestOptions) {
    return new MapiRequest(this, requestOptions);
  }
  /* eslint-disable no-unused-vars*/
  /**
   * @ignore
   * @method
   * @param {*} request
   * @returns {Promise<*>}
   */
  sendRequest(request) {
    throw new Error('not implemented');
  }

  /**
   * @ignore
   * @method
   * @param {*} request
   * @returns {void}
   */
  abortRequest(request) {
    throw new Error('not implemented');
  }
}

module.exports = MapiClient;
