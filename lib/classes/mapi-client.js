'use strict';

var parseToken = require('@mapbox/parse-mapbox-token');
var MapiRequest = require('./mapi-request');
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

/**
 * @ignore
 * @constructor
 * @param {MapiClientOptions} options
 */
function MapiClient(options) {
  if (!options || !options.accessToken) {
    throw new Error('Cannot create a client without an access token');
  }
  // Try parsing the access token to determine right away if it's valid.
  parseToken(options.accessToken);

  this.accessToken = options.accessToken;
  this.origin = options.origin || constants.API_ORIGIN;
}
/** @ignore @typedef {import("./mapi-request").MapiRequestOptions} MapiRequestOptions */
/** @ignore @method @param {MapiRequestOptions} requestOptions */
MapiClient.prototype.createRequest = function createRequest(requestOptions) {
  return new MapiRequest(this, requestOptions);
};
/**
 * @ignore
 * @method
 * @param {*} request
 * @returns {Promise<*>}
 */
MapiClient.prototype.sendRequest = function(request) {
  // eslint-disable-line no-unused-vars
  throw new Error('not implemented');
};

/**
 * @ignore
 * @method
 * @param {*} request
 * @returns {Promise<*>}
 */
MapiClient.prototype.abortRequest = function(request) {
  // eslint-disable-line no-unused-vars
  throw new Error('not implemented');
};

module.exports = MapiClient;
